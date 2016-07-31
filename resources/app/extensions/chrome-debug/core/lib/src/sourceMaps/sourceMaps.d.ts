import { MappedPosition } from './sourceMap';
export declare class SourceMaps {
    private _generatedPathToSourceMap;
    private _authoredPathToSourceMap;
    private _webRoot;
    constructor(webRoot: string);
    /**
     * Returns the generated script path for an authored source path
     * @param pathToSource - The absolute path to the authored file
     */
    getGeneratedPathFromAuthoredPath(authoredPath: string): string;
    mapToGenerated(authoredPath: string, line: number, column: number): MappedPosition;
    mapToAuthored(pathToGenerated: string, line: number, column: number): MappedPosition;
    allMappedSources(pathToGenerated: string): string[];
    /**
     * Given a new path to a new script file, finds and loads the sourcemap for that file
     */
    processNewSourceMap(pathToGenerated: string, sourceMapURL: string): Promise<void>;
}
