import { DebugProtocol } from 'vscode-debugprotocol';
import { DebugSession } from 'vscode-debugadapter';
import { IDebugAdapter } from './debugAdapterInterfaces';
import { ITargetFilter } from './chromeConnection';
export interface IChromeDebugSessionOpts {
    adapter?: IDebugAdapter;
    targetFilter?: ITargetFilter;
    logFileDirectory?: string;
}
export declare class ChromeDebugSession extends DebugSession {
    private _adapterProxy;
    /**
     * This needs a bit of explanation -
     * We call DebugSession.run to create the connection to VS Code, which takes a Class extending DebugSession,
     * not an instance. That's problematic because a class can't be naturally configured the way an instance
     * would be. So this factory function dynamically creates a class which has 'opts' in a closure and can
     * instantiate ChromeDebugSession with it. Otherwise all consumers would need to subclass ChromeDebugSession
     * in a sort of non-obvious way.
     */
    static getSession(opts: IChromeDebugSessionOpts): typeof ChromeDebugSession;
    constructor(targetLinesStartAt1: boolean, isServer?: boolean, opts?: IChromeDebugSessionOpts);
    /**
     * Overload sendEvent to log
     */
    sendEvent(event: DebugProtocol.Event): void;
    /**
     * Overload sendResponse to log
     */
    sendResponse(response: DebugProtocol.Response): void;
    private onLog(msg, level);
    /**
     * Takes a response and a promise to the response body. If the promise is successful, assigns the response body and sends the response.
     * If the promise fails, sets the appropriate response parameters and sends the response.
     */
    private sendResponseAsync(request, response, responseP);
    /**
     * Overload dispatchRequest to dispatch to the adapter proxy instead of debugSession's methods for each request.
     */
    protected dispatchRequest(request: DebugProtocol.Request): void;
}
