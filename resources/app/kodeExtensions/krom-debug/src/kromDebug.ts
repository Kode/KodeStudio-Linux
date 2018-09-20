import {
	Logger, logger,
	LoggingDebugSession,
	InitializedEvent, TerminatedEvent, StoppedEvent, OutputEvent,
	Thread, StackFrame, Scope, Source, Handles, Breakpoint
} from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as net from 'net';
import * as path from 'path';
import * as source_map from 'source-map';
const { Subject } = require('await-notify');

interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
	trace?: boolean;
	noKromLaunch?: boolean;
	port?: number;

	// Set by the extension itself
	projectDir?: string;
	kromDir?: string;
}

class BreakpointRequest {
	response: DebugProtocol.SetBreakpointsResponse;
	args: DebugProtocol.SetBreakpointsArguments;
}

export class KromDebugSession extends LoggingDebugSession {
	private static DEBUGGER_MESSAGE_BREAKPOINT = 0;
	private static DEBUGGER_MESSAGE_PAUSE = 1;
	private static DEBUGGER_MESSAGE_STACKTRACE = 2;
	private static DEBUGGER_MESSAGE_CONTINUE = 3;
	private static DEBUGGER_MESSAGE_STEP_OVER = 4;
	private static DEBUGGER_MESSAGE_STEP_IN = 5;
	private static DEBUGGER_MESSAGE_STEP_OUT = 6;
	private static DEBUGGER_MESSAGE_VARIABLES = 7;
	private static DEBUGGER_MESSAGE_CLEAR_BREAKPOINTS = 8;

	private static IDE_MESSAGE_STACKTRACE = 0;
	private static IDE_MESSAGE_BREAK = 1;
	private static IDE_MESSAGE_VARIABLES = 2;
	private static IDE_MESSAGE_LOG = 3;

	private static THREAD_ID = 1;

	private _variableHandles = new Handles<string>();

	private _configurationDone = new Subject();

	private sourceMap: source_map.SourceMapConsumer;

	private socket: net.Socket;

	private pendingResponses: Map<number, DebugProtocol.Response> = new Map();

	private connected = false;

	private pendingBreakPointRequests: Array<BreakpointRequest> = [];

	private reconnectionAttempts = 15;

	public constructor() {
		super("krom.txt");

		// this debugger uses zero-based lines and columns
		this.setDebuggerLinesStartAt1(true);
		this.setDebuggerColumnsStartAt1(true);

		/*
		// setup event handlers
		this._runtime.on('stopOnEntry', () => {
			this.sendEvent(new StoppedEvent('entry', KromDebugSession.THREAD_ID));
		});
		this._runtime.on('stopOnStep', () => {
			this.sendEvent(new StoppedEvent('step', KromDebugSession.THREAD_ID));
		});
		this._runtime.on('stopOnBreakpoint', () => {
			this.sendEvent(new StoppedEvent('breakpoint', KromDebugSession.THREAD_ID));
		});
		this._runtime.on('stopOnException', () => {
			this.sendEvent(new StoppedEvent('exception', KromDebugSession.THREAD_ID));
		});
		this._runtime.on('breakpointValidated', (bp: MockBreakpoint) => {
			this.sendEvent(new BreakpointEvent('changed', <DebugProtocol.Breakpoint>{ verified: bp.verified, id: bp.id }));
		});
		*/
	}

	protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
		response.body = response.body || {};

		response.body.supportsConfigurationDoneRequest = true;
		response.body.supportsEvaluateForHovers = false;
		response.body.supportsStepBack = false;

		this.sendResponse(response);
		this.sendEvent(new InitializedEvent());
	}

	protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void {
		super.configurationDoneRequest(response, args);
		this._configurationDone.notify();
	}

	private connect(port: number, response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): void {
		logger.log('Really connecting...');
		this.socket = net.connect(port, 'localhost', () => {
			logger.log('Connected');
			this.connected = true;
			for (let breakpointRequest of this.pendingBreakPointRequests) {
				this.setBreakPoints(breakpointRequest);
			}
			this.pendingBreakPointRequests = [];
			this.sendResponse(response);
		});

		this.socket.on('data', (data) => {
			logger.log('Receiving data.');
			if (data.readInt32LE(0) === KromDebugSession.IDE_MESSAGE_STACKTRACE) {
				let ii = 4;
				let frames: any[] = [];
				let responseId = data.readInt32LE(ii); ii += 4;
				logger.log('Receiving a stack trace for response ' + responseId + '.');
				let length = data.readInt32LE(ii); ii += 4;
				logger.log('Stack frame length is ' + length);
				for (let i = 0; i < length; ++i) {
					const index = data.readInt32LE(ii); ii += 4;
					const scriptId = data.readInt32LE(ii); ii += 4;
					let line = data.readInt32LE(ii); ii += 4;
					let column = data.readInt32LE(ii); ii += 4;
					const sourceLength = data.readInt32LE(ii); ii += 4;
					const functionHandle = data.readInt32LE(ii); ii += 4;
					const stringLength = data.readInt32LE(ii); ii += 4;
					let str = '';
					for (let j = 0; j < stringLength; ++j) {
						str += String.fromCharCode(data.readInt32LE(ii)); ii += 4;
					}

					const original = this.sourceMap.originalPositionFor({ line: line, column: column });

					frames.push({
						index: index,
						scriptId: scriptId,
						line: line,
						column: column,
						sourceLength: sourceLength,
						functionHandle: functionHandle,
						sourceText: str,
						originalLine: original.line,
						originalColumn: original.column,
						originalSource: original.source,
						originalName: original.name
					});
				}
				let response = this.pendingResponses.get(responseId);
				if (response) {
					this.pendingResponses.delete(responseId);
					logger.log('Responding with the stack trace.');

					let stackFrames: StackFrame[] = [];
					for (let frame of frames) {
						if (frame.originalLine === null) {
							stackFrames.push(new StackFrame(frame.index, frame.sourceText, new Source('krom.js', path.join(args.projectDir ? args.projectDir : '', 'build', 'krom', 'krom.js')), frame.line, frame.column));
						}
						else {
							stackFrames.push(new StackFrame(frame.index, frame.sourceText, new Source('krom.js', frame.originalSource), frame.originalLine, frame.originalColumn));
						}
					}
					response.body = {
						stackFrames: stackFrames,
						totalFrames: frames.length
					};
					this.sendResponse(response);
				}
			}
			else if (data.readInt32LE(0) === KromDebugSession.IDE_MESSAGE_VARIABLES) {
				let variables: any[] = [];
				let ii = 4;
				let responseId = data.readInt32LE(ii); ii += 4;
				logger.log('Receiving variables for response ' + responseId + '.');
				let length = data.readInt32LE(ii); ii += 4;
				for (let i = 0; i < length; ++i) {
					let stringLength = data.readInt32LE(ii); ii += 4;
					let str = '';
					for (let j = 0; j < stringLength; ++j) {
						str += String.fromCharCode(data.readInt32LE(ii)); ii += 4;
					}
					let name = str;

					stringLength = data.readInt32LE(ii); ii += 4;
					str = '';
					for (let j = 0; j < stringLength; ++j) {
						str += String.fromCharCode(data.readInt32LE(ii)); ii += 4;
					}
					let type = str;

					stringLength = data.readInt32LE(ii); ii += 4;
					str = '';
					for (let j = 0; j < stringLength; ++j) {
						str += String.fromCharCode(data.readInt32LE(ii)); ii += 4;
					}
					let value = str;

					variables.push({
						name,
						type,
						value
					});
				}

				const vars = new Array<DebugProtocol.Variable>();
				//const id = this._variableHandles.get(args.variablesReference);
				for (let v of variables) {
					vars.push({
						name: v.name,
						type: v.type,
						value: v.value,
						variablesReference: 0
					});
				}

				let response = this.pendingResponses.get(responseId);
				if (response) {
					this.pendingResponses.delete(responseId);
					logger.log('Responding with the variables.');
					response.body = {
						variables: variables
					};
					this.sendResponse(response);
				}
			}
			else if (data.readInt32LE(0) === KromDebugSession.IDE_MESSAGE_BREAK) {
				logger.log('Receiving a breakpoint event.');
				this.sendEvent(new StoppedEvent('breakpoint', KromDebugSession.THREAD_ID));
			}
			else if (data.readInt32LE(0) === KromDebugSession.IDE_MESSAGE_LOG) {
				let ii = 4;
				let stringLength = data.readInt32LE(ii); ii += 4;
				let str = '';
				for (let j = 0; j < stringLength; ++j) {
					str += String.fromCharCode(data.readInt32LE(ii)); ii += 4;
				}

				const e: DebugProtocol.OutputEvent = new OutputEvent(`${str}\n`);
				//e.body.source = this.createSource(filePath);
				//e.body.line = this.convertDebuggerLineToClient(line);
				//e.body.column = this.convertDebuggerColumnToClient(column);
				this.sendEvent(e);
			}
		});

		this.socket.on('error', (err) => {
			logger.log('Connection error: ' + err.message);
			if (!this.connected && this.reconnectionAttempts > 0) {
				--this.reconnectionAttempts;
				setTimeout(() => {
					this.connect(port, response, args);
				}, 1000);
			}
		});

		this.socket.on('end', () => {
			this.sendEvent(new TerminatedEvent());
		});
	}

	protected async launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments) {
		logger.setup(args.trace ? Logger.LogLevel.Verbose : Logger.LogLevel.Stop, false);
		//logger.setup(Logger.LogLevel.Verbose, false);

		await this._configurationDone.wait(1000);

		logger.log('Connecting...');

		this.sourceMap = await new source_map.SourceMapConsumer(fs.readFileSync(path.join(args.projectDir ? args.projectDir : '', 'build', 'krom', 'krom.js.temp.map'), 'utf8'));

		const port = args.port || Math.floor((Math.random() * 10000) + 10000);

		if (args.kromDir && args.projectDir && !args.noKromLaunch) {
			let child: child_process.ChildProcess;
			if (process.platform === 'win32') {
				child = child_process.spawn(path.join(args.kromDir, 'Krom.exe'), [path.join(args.projectDir, 'build', 'krom'), path.join(args.projectDir, 'build', 'krom-resources'), '--debug', port.toString()]);
			}
			else if (process.platform === 'darwin') {
				child = child_process.spawn(path.join(args.kromDir, 'Krom.app', 'Contents', 'MacOS', 'Krom'), [path.join(args.projectDir, 'build', 'krom'), path.join(args.projectDir, 'build', 'krom-resources'), '--debug', port.toString()]);
			}
			else {
				child = child_process.spawn(path.join(args.kromDir, 'Krom'), [path.join(args.projectDir, 'build', 'krom'), path.join(args.projectDir, 'build', 'krom-resources'), '--debug', port.toString()]);
			}
			child.on('exit', () => {
				this.sendEvent(new TerminatedEvent());
			});
		}

		this.connect(port, response, args);
	}

	private setBreakPoints(request: BreakpointRequest): void {
		this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_CLEAR_BREAKPOINTS]);

		//const path = <string>args.source.path;
		const clientLines = request.args.lines || [];

		const actualBreakpoints = clientLines.map(l => {
			let line = this.convertClientLineToDebugger(l);
			let path: string = request.args.source.path ? request.args.source.path : '';
			path = path.replace(/\\/g, '/');

			let pos = this.sourceMap.generatedPositionFor({
				source: 'file:///' + path.charAt(0).toUpperCase() + path.substr(1),
				line: line,
				column: 0
			});

			if (pos.line === null) {
				pos = this.sourceMap.generatedPositionFor({
					source: 'file:///' + path.charAt(0).toLowerCase() + path.substr(1),
					line: line,
					column: 0
				});
			}

			this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_BREAKPOINT, pos.line ? pos.line : line]);

			let verified = true;
			let id = 0;
			const bp = <DebugProtocol.Breakpoint> new Breakpoint(verified, this.convertDebuggerLineToClient(line));
			bp.id= id;
			return bp;
		});

		request.response.body = {
			breakpoints: actualBreakpoints
		};
		this.sendResponse(request.response);
	}

	protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {
		if (this.connected) {
			this.setBreakPoints({response, args});
		}
		else {
			this.pendingBreakPointRequests.push({response, args});
		}
	}

	private sendMessage(numbers: number[]): void {
		this.socket.write(Buffer.from(Int32Array.from(numbers).buffer));
	}

	protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments): void {
		this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_PAUSE]);
		this.sendResponse(response);
	}

	protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
		response.body = {
			threads: [
				new Thread(KromDebugSession.THREAD_ID, "thread 1")
			]
		};
		this.sendResponse(response);
	}

	protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): void {
		logger.log('Request stack trace (seq ' + response.request_seq + ').');

		//const startFrame = typeof args.startFrame === 'number' ? args.startFrame : 0;
		//const maxLevels = typeof args.levels === 'number' ? args.levels : 1000;
		//const endFrame = startFrame + maxLevels;

		this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_STACKTRACE, response.request_seq]);
		this.pendingResponses.set(response.request_seq, response);
	}

	protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
		logger.log('Request scopes (seq ' + response.request_seq + ').');

		const frameReference = args.frameId;
		const scopes = new Array<Scope>();
		scopes.push(new Scope("Local", this._variableHandles.create("local_" + frameReference), false));
		scopes.push(new Scope("Global", this._variableHandles.create("global_" + frameReference), true));

		response.body = {
			scopes: scopes
		};
		this.sendResponse(response);
	}

	protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void {
		logger.log('Request variables (seq ' + response.request_seq + ').');
		const variables = new Array<DebugProtocol.Variable>();
		const id = this._variableHandles.get(args.variablesReference);
		if (id !== null) {
			variables.push({
				name: id + "_i",
				type: "integer",
				value: "123",
				variablesReference: 0
			});
			variables.push({
				name: id + "_f",
				type: "float",
				value: "3.14",
				variablesReference: 0
			});
			variables.push({
				name: id + "_s",
				type: "string",
				value: "hello world",
				variablesReference: 0
			});
			variables.push({
				name: id + "_o",
				type: "object",
				value: "Object",
				variablesReference: this._variableHandles.create("object_")
			});
		}

		/*response.body = {
			variables: variables
		};
		this.sendResponse(response);*/

		this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_VARIABLES, response.request_seq]);
		this.pendingResponses.set(response.request_seq, response);
	}

	protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void {
		this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_CONTINUE]);
		this.sendResponse(response);
	}

	protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
		this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_STEP_OVER]);
		this.sendResponse(response);
	}

	protected stepInRequest(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments): void {
		this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_STEP_IN]);
		this.sendResponse(response);
	}

    protected stepOutRequest(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments): void {
		this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_STEP_OUT]);
		this.sendResponse(response);
	}

	//private createSource(filePath: string): Source {
	//	return new Source(path.basename(filePath), this.convertDebuggerPathToClient(filePath), undefined, undefined, 'mock-adapter-data');
	//}
}
