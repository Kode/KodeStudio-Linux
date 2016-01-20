/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/platform/files/common/files', 'vs/workbench/services/files/node/watcher/common', 'vs/workbench/services/files/node/watcher/win32/csharpWatcherService'], function (require, exports, files_1, watcher, csharpWatcherService_1) {
    var FileWatcher = (function () {
        function FileWatcher(basePath, ignored, eventEmitter, errorLogger, verboseLogging) {
            this.basePath = basePath;
            this.ignored = ignored;
            this.errorLogger = errorLogger;
            this.verboseLogging = verboseLogging;
            this.eventEmitter = eventEmitter;
        }
        FileWatcher.prototype.startWatching = function () {
            var _this = this;
            var watcher = new csharpWatcherService_1.OutOfProcessWin32FolderWatcher(this.basePath, this.ignored, this.errorLogger, function (events) { return _this.onRawFileEvents(events); }, this.verboseLogging);
            return function () { return watcher.dispose(); };
        };
        FileWatcher.prototype.onRawFileEvents = function (events) {
            // Emit through broadcast service
            if (events.length > 0) {
                this.eventEmitter.emit(files_1.EventType.FILE_CHANGES, watcher.toFileChangesEvent(events));
            }
        };
        return FileWatcher;
    })();
    exports.FileWatcher = FileWatcher;
});
//# sourceMappingURL=watcherService.js.map