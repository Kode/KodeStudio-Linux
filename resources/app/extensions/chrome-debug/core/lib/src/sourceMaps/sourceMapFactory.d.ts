import { SourceMap } from './sourceMap';
/**
 * pathToGenerated - an absolute local path or a URL.
 * mapPath - a path relative to pathToGenerated.
 */
export declare function getMapForGeneratedPath(pathToGenerated: string, mapPath: string, webRoot: string): Promise<SourceMap>;
