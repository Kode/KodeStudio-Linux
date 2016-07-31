import { DebugProtocol } from 'vscode-debugprotocol';
import { IStackTraceResponseBody } from '../src/chrome/debugAdapterInterfaces';
export declare function setupUnhandledRejectionListener(): void;
export declare function removeUnhandledRejectionListener(): void;
export declare class MockEvent implements DebugProtocol.Event {
    event: string;
    body: any;
    seq: number;
    type: string;
    constructor(event: string, body?: any);
}
export declare function registerEmptyMocks(...moduleNames: string[]): void;
export declare function getStackTraceResponseBody(aPath: string, lines: number[], sourceReferences?: number[]): IStackTraceResponseBody;
/**
 * Some tests use this to override 'os' and 'path' with the windows versions for consistency when running on different
 * platforms. For other tests, it either doesn't matter, or they have platform-specific test code.
 */
export declare function registerWin32Mocks(): void;
export declare function registerOSXMocks(): void;
/**
 * path.resolve + fixing the drive letter to match what VS Code does. Basically tests can use this when they
 * want to force a path to native slashes and the correct letter case, but maybe can't use un-mocked utils.
 */
export declare function pathResolve(...segments: string[]): string;
export declare function registerMockReadFile(...entries: {
    absPath: string;
    data: string;
}[]): void;
