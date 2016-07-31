import { MappedPosition } from 'source-map';
export declare type MappedPosition = MappedPosition;
export declare class SourceMap {
    private _generatedPath;
    private _sources;
    private _smc;
    private _authoredPathCaseMap;
    /**
     * pathToGenerated - an absolute local path or a URL
     * json - sourcemap contents
     * webRoot - an absolute path
     */
    constructor(generatedPath: string, json: string, webRoot: string);
    authoredSources: string[];
    generatedPath(): string;
    doesOriginateFrom(absPath: string): boolean;
    authoredPositionFor(line: number, column: number): MappedPosition;
    generatedPositionFor(source: string, line: number, column: number): MappedPosition;
}
