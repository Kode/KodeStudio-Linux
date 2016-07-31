/**
 * Resolves a relative path in terms of another file
 */
export declare function resolveRelativeToFile(absPath: string, relPath: string): string;
/**
 * Determine the absolute path to the sourceRoot.
 */
export declare function getAbsSourceRoot(sourceRoot: string, webRoot: string, generatedPath: string): string;
