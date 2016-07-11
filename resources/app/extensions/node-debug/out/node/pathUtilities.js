/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
var Path = require('path');
var FS = require('fs');
/**
  * The input paths must use the path syntax of the underlying operating system.
 */
function makePathAbsolute(absPath, relPath) {
    return Path.resolve(Path.dirname(absPath), relPath);
}
exports.makePathAbsolute = makePathAbsolute;
/**
 * Remove the first segment of the given path and return the result.
 * The input path must use the path syntax of the underlying operating system.
 */
function removeFirstSegment(path) {
    var segments = path.split(Path.sep);
    segments.shift();
    if (segments.length > 0) {
        return segments.join(Path.sep);
    }
    return null;
}
exports.removeFirstSegment = removeFirstSegment;
/**
 * Return the relative path between 'path' and 'target'.
 * The input paths must use the path syntax of the underlying operating system.
 */
function makeRelative(target, path) {
    var t = target.split(Path.sep);
    var p = path.split(Path.sep);
    var i = 0;
    for (; i < Math.min(t.length, p.length) && t[i] === p[i]; i++) {
    }
    var result = '';
    for (; i < p.length; i++) {
        result = Path.join(result, p[i]);
    }
    return result;
}
exports.makeRelative = makeRelative;
/**
 * Returns a path with a lower case drive letter.
 */
function normalizeDriveLetter(path) {
    var regex = /^([A-Z])(\:[\\\/].*)$/;
    if (regex.test(path)) {
        path = path.replace(regex, function (s, s1, s2) { return s1.toLowerCase() + s2; });
    }
    return path;
}
exports.normalizeDriveLetter = normalizeDriveLetter;
/**
 * Given an absolute, normalized, and existing file path 'realPath' returns the exact path that the file has on disk.
 * On a case insensitive file system, the returned path might differ from the original path by character casing.
 * On a case sensitive file system, the returned path will always be identical to the original path.
 * In case of errors, null is returned. But you cannot use this function to verify that a path exists.
 * realPath does not handle '..' or '.' path segments and it does not take the locale into account.
 * Since a drive letter of a Windows path cannot be looked up, realPath normalizes the drive letter to lower case.
 */
function realPath(path) {
    var dir = Path.dirname(path);
    if (path === dir) {
        // is this an upper case drive letter?
        if (/^[A-Z]\:\\$/.test(path)) {
            path = path.toLowerCase();
        }
        return path;
    }
    var name = Path.basename(path).toLowerCase();
    try {
        var entries = FS.readdirSync(dir);
        var found = entries.filter(function (e) { return e.toLowerCase() === name; }); // use a case insensitive search
        if (found.length === 1) {
            // on a case sensitive filesystem we cannot determine here, whether the file exists or not, hence we need the 'file exists' precondition
            var prefix = realPath(dir); // recurse
            if (prefix) {
                return Path.join(prefix, found[0]);
            }
        }
        else if (found.length > 1) {
            // must be a case sensitive $filesystem
            var ix = found.indexOf(name);
            if (ix >= 0) {
                var prefix = realPath(dir); // recurse
                if (prefix) {
                    return Path.join(prefix, found[ix]);
                }
            }
        }
    }
    catch (error) {
    }
    return null;
}
exports.realPath = realPath;
//---- the following functions work with Windows and Unix-style paths independent from the underlying OS.
/**
 * Returns true if the Windows or Unix-style path is absolute.
 */
function isAbsolutePath(path) {
    if (path) {
        if (path.charAt(0) === '/') {
            return true;
        }
        if (/^[a-zA-Z]\:[\\\/]/.test(path)) {
            return true;
        }
    }
    return false;
}
exports.isAbsolutePath = isAbsolutePath;
/**
 * Convert the given Windows or Unix-style path into a normalized path that only uses forward slashes and has all superflous '..' sequences removed.
 * If the path starts with a Windows-style drive letter, a '/' is prepended.
 */
function normalize(path) {
    path = path.replace(/\\/g, '/');
    if (/^[a-zA-Z]\:\//.test(path)) {
        path = '/' + path;
    }
    path = Path.normalize(path); // use node's normalize to remove '<dir>/..' etc.
    path = path.replace(/\\/g, '/');
    return path;
}
exports.normalize = normalize;
/**
 * Convert the given normalized path into a Windows-style path.
 */
function toWindows(path) {
    if (/^\/[a-zA-Z]\:\//.test(path)) {
        path = path.substr(1);
    }
    path = path.replace(/\//g, '\\');
    return path;
}
exports.toWindows = toWindows;
/**
 * Append the given relative path to the absolute path and normalize the result.
 */
function join(absPath, relPath) {
    absPath = normalize(absPath);
    relPath = normalize(relPath);
    if (absPath.charAt(absPath.length - 1) === '/') {
        absPath = absPath + relPath;
    }
    else {
        absPath = absPath + '/' + relPath;
    }
    absPath = Path.normalize(absPath);
    absPath = absPath.replace(/\\/g, '/');
    return absPath;
}
exports.join = join;
/**
 * Return the relative path between 'from' and 'to'.
 */
function makeRelative2(from, to) {
    from = normalize(from);
    to = normalize(to);
    var froms = from.substr(1).split('/');
    var tos = to.substr(1).split('/');
    while (froms.length > 0 && tos.length > 0 && froms[0] === tos[0]) {
        froms.shift();
        tos.shift();
    }
    var l = froms.length - tos.length;
    if (l === 0) {
        l = tos.length - 1;
    }
    while (l > 0) {
        tos.unshift('..');
        l--;
    }
    return tos.join('/');
}
exports.makeRelative2 = makeRelative2;

//# sourceMappingURL=data:application/json;base64,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RztBQUNILHVCQUE4QixJQUFZLEVBQUUsRUFBVTtJQUVyRCxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLEVBQUUsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFbkIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEMsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFcEMsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUVELElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDZCxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUMsRUFBRSxDQUFDO0lBQ0wsQ0FBQztJQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUF2QmUscUJBQWEsZ0JBdUI1QixDQUFBIiwiZmlsZSI6Im5vZGUvcGF0aFV0aWxpdGllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAgQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWUgTGljZW5zZS50eHQgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgbGljZW5zZSBpbmZvcm1hdGlvbi5cbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgRlMgZnJvbSAnZnMnO1xuXG5cbi8qKlxuICAqIFRoZSBpbnB1dCBwYXRocyBtdXN0IHVzZSB0aGUgcGF0aCBzeW50YXggb2YgdGhlIHVuZGVybHlpbmcgb3BlcmF0aW5nIHN5c3RlbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VQYXRoQWJzb2x1dGUoYWJzUGF0aDogc3RyaW5nLCByZWxQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gUGF0aC5yZXNvbHZlKFBhdGguZGlybmFtZShhYnNQYXRoKSwgcmVsUGF0aCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaXJzdCBzZWdtZW50IG9mIHRoZSBnaXZlbiBwYXRoIGFuZCByZXR1cm4gdGhlIHJlc3VsdC5cbiAqIFRoZSBpbnB1dCBwYXRoIG11c3QgdXNlIHRoZSBwYXRoIHN5bnRheCBvZiB0aGUgdW5kZXJseWluZyBvcGVyYXRpbmcgc3lzdGVtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRmlyc3RTZWdtZW50KHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IHNlZ21lbnRzID0gcGF0aC5zcGxpdChQYXRoLnNlcCk7XG5cdHNlZ21lbnRzLnNoaWZ0KCk7XG5cdGlmIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuIHNlZ21lbnRzLmpvaW4oUGF0aC5zZXApO1xuXHR9XG5cdHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgcmVsYXRpdmUgcGF0aCBiZXR3ZWVuICdwYXRoJyBhbmQgJ3RhcmdldCcuXG4gKiBUaGUgaW5wdXQgcGF0aHMgbXVzdCB1c2UgdGhlIHBhdGggc3ludGF4IG9mIHRoZSB1bmRlcmx5aW5nIG9wZXJhdGluZyBzeXN0ZW0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUmVsYXRpdmUodGFyZ2V0OiBzdHJpbmcsIHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IHQgPSB0YXJnZXQuc3BsaXQoUGF0aC5zZXApO1xuXHRjb25zdCBwID0gcGF0aC5zcGxpdChQYXRoLnNlcCk7XG5cblx0bGV0IGkgPSAwO1xuXHRmb3IgKDsgaSA8IE1hdGgubWluKHQubGVuZ3RoLCBwLmxlbmd0aCkgJiYgdFtpXSA9PT0gcFtpXTsgaSsrKSB7XG5cdH1cblxuXHRsZXQgcmVzdWx0ID0gJyc7XG5cdGZvciAoOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuXHRcdHJlc3VsdCA9IFBhdGguam9pbihyZXN1bHQsIHBbaV0pO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHBhdGggd2l0aCBhIGxvd2VyIGNhc2UgZHJpdmUgbGV0dGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRHJpdmVMZXR0ZXIocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcblx0Y29uc3QgcmVnZXggPSAvXihbQS1aXSkoXFw6W1xcXFxcXC9dLiopJC87XG5cdGlmIChyZWdleC50ZXN0KHBhdGgpKSB7XG5cdFx0cGF0aCA9IHBhdGgucmVwbGFjZShyZWdleCwgKHMsIHMxLCBzMikgPT4gczEudG9Mb3dlckNhc2UoKSArIHMyKTtcblx0fVxuXHRyZXR1cm4gcGF0aDtcbn1cblxuLyoqXG4gKiBHaXZlbiBhbiBhYnNvbHV0ZSwgbm9ybWFsaXplZCwgYW5kIGV4aXN0aW5nIGZpbGUgcGF0aCAncmVhbFBhdGgnIHJldHVybnMgdGhlIGV4YWN0IHBhdGggdGhhdCB0aGUgZmlsZSBoYXMgb24gZGlzay5cbiAqIE9uIGEgY2FzZSBpbnNlbnNpdGl2ZSBmaWxlIHN5c3RlbSwgdGhlIHJldHVybmVkIHBhdGggbWlnaHQgZGlmZmVyIGZyb20gdGhlIG9yaWdpbmFsIHBhdGggYnkgY2hhcmFjdGVyIGNhc2luZy5cbiAqIE9uIGEgY2FzZSBzZW5zaXRpdmUgZmlsZSBzeXN0ZW0sIHRoZSByZXR1cm5lZCBwYXRoIHdpbGwgYWx3YXlzIGJlIGlkZW50aWNhbCB0byB0aGUgb3JpZ2luYWwgcGF0aC5cbiAqIEluIGNhc2Ugb2YgZXJyb3JzLCBudWxsIGlzIHJldHVybmVkLiBCdXQgeW91IGNhbm5vdCB1c2UgdGhpcyBmdW5jdGlvbiB0byB2ZXJpZnkgdGhhdCBhIHBhdGggZXhpc3RzLlxuICogcmVhbFBhdGggZG9lcyBub3QgaGFuZGxlICcuLicgb3IgJy4nIHBhdGggc2VnbWVudHMgYW5kIGl0IGRvZXMgbm90IHRha2UgdGhlIGxvY2FsZSBpbnRvIGFjY291bnQuXG4gKiBTaW5jZSBhIGRyaXZlIGxldHRlciBvZiBhIFdpbmRvd3MgcGF0aCBjYW5ub3QgYmUgbG9va2VkIHVwLCByZWFsUGF0aCBub3JtYWxpemVzIHRoZSBkcml2ZSBsZXR0ZXIgdG8gbG93ZXIgY2FzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlYWxQYXRoKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cblx0bGV0IGRpciA9IFBhdGguZGlybmFtZShwYXRoKTtcblx0aWYgKHBhdGggPT09IGRpcikge1x0Ly8gZW5kIHJlY3Vyc2lvblxuXHRcdC8vIGlzIHRoaXMgYW4gdXBwZXIgY2FzZSBkcml2ZSBsZXR0ZXI/XG5cdFx0aWYgKC9eW0EtWl1cXDpcXFxcJC8udGVzdChwYXRoKSkge1xuXHRcdFx0cGF0aCA9IHBhdGgudG9Mb3dlckNhc2UoKTtcblx0XHR9XG5cdFx0cmV0dXJuIHBhdGg7XG5cdH1cblx0bGV0IG5hbWUgPSBQYXRoLmJhc2VuYW1lKHBhdGgpLnRvTG93ZXJDYXNlKCk7XG5cdHRyeSB7XG5cdFx0bGV0IGVudHJpZXMgPSBGUy5yZWFkZGlyU3luYyhkaXIpO1xuXHRcdGxldCBmb3VuZCA9IGVudHJpZXMuZmlsdGVyKGUgPT4gZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lKTtcdC8vIHVzZSBhIGNhc2UgaW5zZW5zaXRpdmUgc2VhcmNoXG5cdFx0aWYgKGZvdW5kLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0Ly8gb24gYSBjYXNlIHNlbnNpdGl2ZSBmaWxlc3lzdGVtIHdlIGNhbm5vdCBkZXRlcm1pbmUgaGVyZSwgd2hldGhlciB0aGUgZmlsZSBleGlzdHMgb3Igbm90LCBoZW5jZSB3ZSBuZWVkIHRoZSAnZmlsZSBleGlzdHMnIHByZWNvbmRpdGlvblxuXHRcdFx0bGV0IHByZWZpeCA9IHJlYWxQYXRoKGRpcik7ICAgLy8gcmVjdXJzZVxuXHRcdFx0aWYgKHByZWZpeCkge1xuXHRcdFx0XHRyZXR1cm4gUGF0aC5qb2luKHByZWZpeCwgZm91bmRbMF0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZm91bmQubGVuZ3RoID4gMSkge1xuXHRcdFx0Ly8gbXVzdCBiZSBhIGNhc2Ugc2Vuc2l0aXZlICRmaWxlc3lzdGVtXG5cdFx0XHRjb25zdCBpeCA9IGZvdW5kLmluZGV4T2YobmFtZSk7XG5cdFx0XHRpZiAoaXggPj0gMCkge1x0Ly8gY2FzZSBzZW5zaXRpdmVcblx0XHRcdFx0bGV0IHByZWZpeCA9IHJlYWxQYXRoKGRpcik7ICAgLy8gcmVjdXJzZVxuXHRcdFx0XHRpZiAocHJlZml4KSB7XG5cdFx0XHRcdFx0cmV0dXJuIFBhdGguam9pbihwcmVmaXgsIGZvdW5kW2l4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gc2lsZW50bHkgaWdub3JlIGVycm9yXG5cdH1cblx0cmV0dXJuIG51bGw7XG59XG5cbi8vLS0tLSB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyB3b3JrIHdpdGggV2luZG93cyBhbmQgVW5peC1zdHlsZSBwYXRocyBpbmRlcGVuZGVudCBmcm9tIHRoZSB1bmRlcmx5aW5nIE9TLlxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgV2luZG93cyBvciBVbml4LXN0eWxlIHBhdGggaXMgYWJzb2x1dGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Fic29sdXRlUGF0aChwYXRoOiBzdHJpbmcpIHtcblx0aWYgKHBhdGgpIHtcblx0XHRpZiAocGF0aC5jaGFyQXQoMCkgPT09ICcvJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmICgvXlthLXpBLVpdXFw6W1xcXFxcXC9dLy50ZXN0KHBhdGgpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvbnZlcnQgdGhlIGdpdmVuIFdpbmRvd3Mgb3IgVW5peC1zdHlsZSBwYXRoIGludG8gYSBub3JtYWxpemVkIHBhdGggdGhhdCBvbmx5IHVzZXMgZm9yd2FyZCBzbGFzaGVzIGFuZCBoYXMgYWxsIHN1cGVyZmxvdXMgJy4uJyBzZXF1ZW5jZXMgcmVtb3ZlZC5cbiAqIElmIHRoZSBwYXRoIHN0YXJ0cyB3aXRoIGEgV2luZG93cy1zdHlsZSBkcml2ZSBsZXR0ZXIsIGEgJy8nIGlzIHByZXBlbmRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShwYXRoOiBzdHJpbmcpIDogc3RyaW5nIHtcblxuXHRwYXRoID0gcGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cdGlmICgvXlthLXpBLVpdXFw6XFwvLy50ZXN0KHBhdGgpKSB7XG5cdFx0cGF0aCA9ICcvJyArIHBhdGg7XG5cdH1cblx0cGF0aCA9IFBhdGgubm9ybWFsaXplKHBhdGgpO1x0Ly8gdXNlIG5vZGUncyBub3JtYWxpemUgdG8gcmVtb3ZlICc8ZGlyPi8uLicgZXRjLlxuXHRwYXRoID0gcGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cdHJldHVybiBwYXRoO1xufVxuXG4vKipcbiAqIENvbnZlcnQgdGhlIGdpdmVuIG5vcm1hbGl6ZWQgcGF0aCBpbnRvIGEgV2luZG93cy1zdHlsZSBwYXRoLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9XaW5kb3dzKHBhdGg6IHN0cmluZykgOiBzdHJpbmcge1xuXHRpZiAoL15cXC9bYS16QS1aXVxcOlxcLy8udGVzdChwYXRoKSkge1xuXHRcdHBhdGggPSBwYXRoLnN1YnN0cigxKTtcblx0fVxuXHRwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKTtcblx0cmV0dXJuIHBhdGg7XG59XG5cbi8qKlxuICogQXBwZW5kIHRoZSBnaXZlbiByZWxhdGl2ZSBwYXRoIHRvIHRoZSBhYnNvbHV0ZSBwYXRoIGFuZCBub3JtYWxpemUgdGhlIHJlc3VsdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGpvaW4oYWJzUGF0aDogc3RyaW5nLCByZWxQYXRoOiBzdHJpbmcpIDogc3RyaW5nIHtcblx0YWJzUGF0aCA9IG5vcm1hbGl6ZShhYnNQYXRoKTtcblx0cmVsUGF0aCA9IG5vcm1hbGl6ZShyZWxQYXRoKTtcblx0aWYgKGFic1BhdGguY2hhckF0KGFic1BhdGgubGVuZ3RoLTEpID09PSAnLycpIHtcblx0XHRhYnNQYXRoID0gYWJzUGF0aCArIHJlbFBhdGg7XG5cdH0gZWxzZSB7XG5cdFx0YWJzUGF0aCA9IGFic1BhdGggKyAnLycgKyByZWxQYXRoO1xuXHR9XG5cdGFic1BhdGggPSBQYXRoLm5vcm1hbGl6ZShhYnNQYXRoKTtcblx0YWJzUGF0aCA9IGFic1BhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXHRyZXR1cm4gYWJzUGF0aDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHJlbGF0aXZlIHBhdGggYmV0d2VlbiAnZnJvbScgYW5kICd0bycuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUmVsYXRpdmUyKGZyb206IHN0cmluZywgdG86IHN0cmluZyk6IHN0cmluZyB7XG5cblx0ZnJvbSA9IG5vcm1hbGl6ZShmcm9tKTtcblx0dG8gPSBub3JtYWxpemUodG8pO1xuXG5cdGNvbnN0IGZyb21zID0gZnJvbS5zdWJzdHIoMSkuc3BsaXQoJy8nKTtcblx0Y29uc3QgdG9zID0gdG8uc3Vic3RyKDEpLnNwbGl0KCcvJyk7XG5cblx0d2hpbGUgKGZyb21zLmxlbmd0aCA+IDAgJiYgdG9zLmxlbmd0aCA+IDAgJiYgZnJvbXNbMF0gPT09IHRvc1swXSkge1xuXHRcdGZyb21zLnNoaWZ0KCk7XG5cdFx0dG9zLnNoaWZ0KCk7XG5cdH1cblxuXHRsZXQgbCA9IGZyb21zLmxlbmd0aCAtIHRvcy5sZW5ndGg7XG5cdGlmIChsID09PSAwKSB7XG5cdFx0bCA9IHRvcy5sZW5ndGggLSAxO1xuXHR9XG5cblx0d2hpbGUgKGwgPiAwKSB7XG5cdFx0dG9zLnVuc2hpZnQoJy4uJyk7XG5cdFx0bC0tO1xuXHR9XG5cdHJldHVybiB0b3Muam9pbignLycpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
