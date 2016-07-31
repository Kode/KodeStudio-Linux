import { DebugProtocol } from 'vscode-debugprotocol';
import { IDebugAdapter, ILaunchRequestArgs, ISetBreakpointsArgs, ISetBreakpointsResponseBody, IStackTraceResponseBody, IAttachRequestArgs, IScopesResponseBody, IVariablesResponseBody, ISourceResponseBody, IThreadsResponseBody, IEvaluateResponseBody } from './debugAdapterInterfaces';
import { ChromeConnection } from './chromeConnection';
export declare class ChromeDebugAdapter implements IDebugAdapter {
    private static THREAD_ID;
    private static PAGE_PAUSE_MESSAGE;
    private static EXCEPTION_VALUE_ID;
    private static PLACEHOLDER_URL_PROTOCOL;
    private _clientAttached;
    private _variableHandles;
    private _currentStack;
    private _committedBreakpointsByUrl;
    private _overlayHelper;
    private _exceptionValueObject;
    private _expectingResumedEvent;
    private _setBreakpointsRequestQ;
    private _scriptsById;
    private _scriptsByUrl;
    private _chromeProc;
    private _chromeConnection;
    private _eventHandler;
    constructor(chromeConnection: ChromeConnection);
    private paused;
    private clearTargetContext();
    private clearClientContext();
    registerEventHandler(eventHandler: (event: DebugProtocol.Event) => void): void;
    initialize(args: DebugProtocol.InitializeRequestArguments): DebugProtocol.Capabilites;
    launch(args: ILaunchRequestArgs): Promise<void>;
    attach(args: IAttachRequestArgs): Promise<void>;
    setupLogging(args: IAttachRequestArgs | ILaunchRequestArgs): void;
    /**
     * Chrome is closing, or error'd somehow, stop the debug session
     */
    terminateSession(): void;
    clearEverything(): void;
    private _attach(port, url?, address?);
    private fireEvent(event);
    /**
     * e.g. the target navigated
     */
    private onGlobalObjectCleared();
    private onDebuggerPaused(notification);
    private onDebuggerResumed();
    private onScriptParsed(script);
    private onBreakpointResolved(params);
    private onConsoleMessage(params);
    disconnect(): Promise<void>;
    setBreakpoints(args: ISetBreakpointsArgs): Promise<ISetBreakpointsResponseBody>;
    setFunctionBreakpoints(): Promise<any>;
    private clearAllBreakpoints(url);
    private addBreakpoints(url, lines, cols?);
    private chromeBreakpointResponsesToODPBreakpoints(url, responses, requestLines);
    setExceptionBreakpoints(args: DebugProtocol.SetExceptionBreakpointsArguments): Promise<void>;
    continue(): Promise<void>;
    next(): Promise<void>;
    stepIn(): Promise<void>;
    stepOut(): Promise<void>;
    pause(): Promise<void>;
    stackTrace(args: DebugProtocol.StackTraceArguments): IStackTraceResponseBody;
    scopes(args: DebugProtocol.ScopesArguments): IScopesResponseBody;
    variables(args: DebugProtocol.VariablesArguments): Promise<IVariablesResponseBody>;
    source(args: DebugProtocol.SourceArguments): Promise<ISourceResponseBody>;
    threads(): IThreadsResponseBody;
    evaluate(args: DebugProtocol.EvaluateArguments): Promise<IEvaluateResponseBody>;
    private propertyDescriptorToVariable(propDesc);
    /**
     * Run the object through ChromeUtilities.remoteObjectToValue, and if it returns a variableHandle reference,
     * use it with this instance's variableHandles to create a variable handle.
     */
    private remoteObjectToValueWithHandle(object);
    private shouldIgnoreScript(script);
}
