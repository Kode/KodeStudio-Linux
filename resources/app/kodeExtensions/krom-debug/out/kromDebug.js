"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_debugadapter_1 = require("vscode-debugadapter");
const child_process = require("child_process");
const fs = require("fs");
const net = require("net");
const path = require("path");
const source_map = require("source-map");
const { Subject } = require('await-notify');
class BreakpointRequest {
}
class KromDebugSession extends vscode_debugadapter_1.LoggingDebugSession {
    constructor() {
        super("krom.txt");
        this._variableHandles = new vscode_debugadapter_1.Handles();
        this._configurationDone = new Subject();
        this.pendingResponses = new Map();
        this.connected = false;
        this.pendingBreakPointRequests = [];
        this.reconnectionAttempts = 15;
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
    initializeRequest(response, args) {
        response.body = response.body || {};
        response.body.supportsConfigurationDoneRequest = true;
        response.body.supportsEvaluateForHovers = false;
        response.body.supportsStepBack = false;
        this.sendResponse(response);
        this.sendEvent(new vscode_debugadapter_1.InitializedEvent());
    }
    configurationDoneRequest(response, args) {
        super.configurationDoneRequest(response, args);
        this._configurationDone.notify();
    }
    connect(port, response, args) {
        vscode_debugadapter_1.logger.log('Really connecting...');
        this.socket = net.connect(port, 'localhost', () => {
            vscode_debugadapter_1.logger.log('Connected');
            this.connected = true;
            for (let breakpointRequest of this.pendingBreakPointRequests) {
                this.setBreakPoints(breakpointRequest);
            }
            this.pendingBreakPointRequests = [];
            this.sendResponse(response);
            this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_START, KromDebugSession.KROM_DEBUG_API]);
        });
        this.socket.on('data', (data) => {
            vscode_debugadapter_1.logger.log('Receiving data.');
            if (data.readInt32LE(0) === KromDebugSession.IDE_MESSAGE_STACKTRACE) {
                let ii = 4;
                let frames = [];
                let responseId = data.readInt32LE(ii);
                ii += 4;
                vscode_debugadapter_1.logger.log('Receiving a stack trace for response ' + responseId + '.');
                let length = data.readInt32LE(ii);
                ii += 4;
                vscode_debugadapter_1.logger.log('Stack frame length is ' + length);
                for (let i = 0; i < length; ++i) {
                    const index = data.readInt32LE(ii);
                    ii += 4;
                    const scriptId = data.readInt32LE(ii);
                    ii += 4;
                    let line = data.readInt32LE(ii);
                    ii += 4;
                    let column = data.readInt32LE(ii);
                    ii += 4;
                    const sourceLength = data.readInt32LE(ii);
                    ii += 4;
                    const functionHandle = data.readInt32LE(ii);
                    ii += 4;
                    const stringLength = data.readInt32LE(ii);
                    ii += 4;
                    let str = '';
                    for (let j = 0; j < stringLength; ++j) {
                        str += String.fromCharCode(data.readInt32LE(ii));
                        ii += 4;
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
                    vscode_debugadapter_1.logger.log('Responding with the stack trace.');
                    let stackFrames = [];
                    for (let frame of frames) {
                        if (frame.originalLine === null) {
                            stackFrames.push(new vscode_debugadapter_1.StackFrame(frame.index, frame.sourceText, new vscode_debugadapter_1.Source('krom.js', path.join(args.projectDir ? args.projectDir : '', 'build', 'krom', 'krom.js')), frame.line, frame.column));
                        }
                        else {
                            stackFrames.push(new vscode_debugadapter_1.StackFrame(frame.index, frame.sourceText, new vscode_debugadapter_1.Source('krom.js', frame.originalSource), frame.originalLine, frame.originalColumn));
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
                let variables = [];
                let ii = 4;
                let responseId = data.readInt32LE(ii);
                ii += 4;
                vscode_debugadapter_1.logger.log('Receiving variables for response ' + responseId + '.');
                let length = data.readInt32LE(ii);
                ii += 4;
                for (let i = 0; i < length; ++i) {
                    let stringLength = data.readInt32LE(ii);
                    ii += 4;
                    let str = '';
                    for (let j = 0; j < stringLength; ++j) {
                        str += String.fromCharCode(data.readInt32LE(ii));
                        ii += 4;
                    }
                    let name = str;
                    stringLength = data.readInt32LE(ii);
                    ii += 4;
                    str = '';
                    for (let j = 0; j < stringLength; ++j) {
                        str += String.fromCharCode(data.readInt32LE(ii));
                        ii += 4;
                    }
                    let type = str;
                    stringLength = data.readInt32LE(ii);
                    ii += 4;
                    str = '';
                    for (let j = 0; j < stringLength; ++j) {
                        str += String.fromCharCode(data.readInt32LE(ii));
                        ii += 4;
                    }
                    let value = str;
                    variables.push({
                        name,
                        type,
                        value
                    });
                }
                const vars = new Array();
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
                    vscode_debugadapter_1.logger.log('Responding with the variables.');
                    response.body = {
                        variables: variables
                    };
                    this.sendResponse(response);
                }
            }
            else if (data.readInt32LE(0) === KromDebugSession.IDE_MESSAGE_BREAK) {
                vscode_debugadapter_1.logger.log('Receiving a breakpoint event.');
                this.sendEvent(new vscode_debugadapter_1.StoppedEvent('breakpoint', KromDebugSession.THREAD_ID));
            }
            else if (data.readInt32LE(0) === KromDebugSession.IDE_MESSAGE_LOG) {
                let ii = 4;
                let stringLength = data.readInt32LE(ii);
                ii += 4;
                let str = '';
                for (let j = 0; j < stringLength; ++j) {
                    str += String.fromCharCode(data.readInt32LE(ii));
                    ii += 4;
                }
                const e = new vscode_debugadapter_1.OutputEvent(`${str}\n`);
                //e.body.source = this.createSource(filePath);
                //e.body.line = this.convertDebuggerLineToClient(line);
                //e.body.column = this.convertDebuggerColumnToClient(column);
                this.sendEvent(e);
            }
        });
        this.socket.on('error', (err) => {
            vscode_debugadapter_1.logger.log('Connection error: ' + err.message);
            if (!this.connected && this.reconnectionAttempts > 0) {
                --this.reconnectionAttempts;
                setTimeout(() => {
                    this.connect(port, response, args);
                }, 1000);
            }
        });
        this.socket.on('end', () => {
            this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
        });
    }
    launchRequest(response, args) {
        return __awaiter(this, void 0, void 0, function* () {
            vscode_debugadapter_1.logger.setup(args.trace ? vscode_debugadapter_1.Logger.LogLevel.Verbose : vscode_debugadapter_1.Logger.LogLevel.Stop, false);
            //logger.setup(Logger.LogLevel.Verbose, false);
            yield this._configurationDone.wait(1000);
            vscode_debugadapter_1.logger.log('Connecting...');
            this.sourceMap = yield new source_map.SourceMapConsumer(fs.readFileSync(path.join(args.projectDir ? args.projectDir : '', 'build', 'krom', 'krom.js.temp.map'), 'utf8'));
            const port = args.port || Math.floor((Math.random() * 10000) + 10000);
            if (args.kromDir && args.projectDir && !args.noKromLaunch) {
                let child;
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
                    this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
                });
            }
            this.connect(port, response, args);
        });
    }
    setBreakPoints(request) {
        this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_CLEAR_BREAKPOINTS]);
        //const path = <string>args.source.path;
        const clientLines = request.args.lines || [];
        const actualBreakpoints = clientLines.map(l => {
            let line = this.convertClientLineToDebugger(l);
            let path = request.args.source.path ? request.args.source.path : '';
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
            const bp = new vscode_debugadapter_1.Breakpoint(verified, this.convertDebuggerLineToClient(line));
            bp.id = id;
            return bp;
        });
        request.response.body = {
            breakpoints: actualBreakpoints
        };
        this.sendResponse(request.response);
    }
    setBreakPointsRequest(response, args) {
        if (this.connected) {
            this.setBreakPoints({ response, args });
        }
        else {
            this.pendingBreakPointRequests.push({ response, args });
        }
    }
    sendMessage(numbers) {
        this.socket.write(Buffer.from(Int32Array.from(numbers).buffer));
    }
    pauseRequest(response, args) {
        this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_PAUSE]);
        this.sendResponse(response);
    }
    threadsRequest(response) {
        response.body = {
            threads: [
                new vscode_debugadapter_1.Thread(KromDebugSession.THREAD_ID, "thread 1")
            ]
        };
        this.sendResponse(response);
    }
    stackTraceRequest(response, args) {
        vscode_debugadapter_1.logger.log('Request stack trace (seq ' + response.request_seq + ').');
        //const startFrame = typeof args.startFrame === 'number' ? args.startFrame : 0;
        //const maxLevels = typeof args.levels === 'number' ? args.levels : 1000;
        //const endFrame = startFrame + maxLevels;
        this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_STACKTRACE, response.request_seq]);
        this.pendingResponses.set(response.request_seq, response);
    }
    scopesRequest(response, args) {
        vscode_debugadapter_1.logger.log('Request scopes (seq ' + response.request_seq + ').');
        const frameReference = args.frameId;
        const scopes = new Array();
        scopes.push(new vscode_debugadapter_1.Scope("Local", this._variableHandles.create("local_" + frameReference), false));
        scopes.push(new vscode_debugadapter_1.Scope("Global", this._variableHandles.create("global_" + frameReference), true));
        response.body = {
            scopes: scopes
        };
        this.sendResponse(response);
    }
    variablesRequest(response, args) {
        vscode_debugadapter_1.logger.log('Request variables (seq ' + response.request_seq + ').');
        const variables = new Array();
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
    continueRequest(response, args) {
        this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_CONTINUE]);
        this.sendResponse(response);
    }
    nextRequest(response, args) {
        this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_STEP_OVER]);
        this.sendResponse(response);
    }
    stepInRequest(response, args) {
        this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_STEP_IN]);
        this.sendResponse(response);
    }
    stepOutRequest(response, args) {
        this.sendMessage([KromDebugSession.DEBUGGER_MESSAGE_STEP_OUT]);
        this.sendResponse(response);
    }
}
KromDebugSession.KROM_DEBUG_API = 1;
KromDebugSession.DEBUGGER_MESSAGE_BREAKPOINT = 0;
KromDebugSession.DEBUGGER_MESSAGE_PAUSE = 1;
KromDebugSession.DEBUGGER_MESSAGE_STACKTRACE = 2;
KromDebugSession.DEBUGGER_MESSAGE_CONTINUE = 3;
KromDebugSession.DEBUGGER_MESSAGE_STEP_OVER = 4;
KromDebugSession.DEBUGGER_MESSAGE_STEP_IN = 5;
KromDebugSession.DEBUGGER_MESSAGE_STEP_OUT = 6;
KromDebugSession.DEBUGGER_MESSAGE_VARIABLES = 7;
KromDebugSession.DEBUGGER_MESSAGE_CLEAR_BREAKPOINTS = 8;
KromDebugSession.DEBUGGER_MESSAGE_START = 9;
KromDebugSession.IDE_MESSAGE_STACKTRACE = 0;
KromDebugSession.IDE_MESSAGE_BREAK = 1;
KromDebugSession.IDE_MESSAGE_VARIABLES = 2;
KromDebugSession.IDE_MESSAGE_LOG = 3;
KromDebugSession.THREAD_ID = 1;
exports.KromDebugSession = KromDebugSession;
//# sourceMappingURL=kromDebug.js.map