export declare enum LogLevel {
    Verbose = 0,
    Log = 1,
    Error = 2,
}
export declare type ILogCallback = (msg: string, level: LogLevel) => void;
export declare function log(msg: string, level?: LogLevel, forceDiagnosticLogging?: boolean): void;
export declare function verbose(msg: string): void;
export declare function error(msg: string, forceDiagnosticLogging?: boolean): void;
/**
 * Set the logger's minimum level to log. Log messages are queued before this is
 * called the first time, because minLogLevel defaults to Error.
 */
export declare function setMinLogLevel(logLevel: LogLevel): void;
export declare function init(logCallback: ILogCallback, logFileDirectory?: string): void;
