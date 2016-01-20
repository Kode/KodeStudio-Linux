/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/node/service.cp', 'vs/base/common/uri', 'vs/platform/files/common/files', 'vs/workbench/services/files/node/watcher/common'], function (require, exports, winjs_base_1, service_cp_1, uri_1, files_1, common_1) {
    var WatcherService = (function () {
        function WatcherService() {
        }
        WatcherService.prototype.watch = function (request) {
            throw new Error('not implemented');
        };
        return WatcherService;
    })();
    exports.WatcherService = WatcherService;
    var FileWatcher = (function () {
        function FileWatcher(basePath, ignored, eventEmitter, errorLogger, verboseLogging) {
            this.basePath = basePath;
            this.ignored = ignored;
            this.eventEmitter = eventEmitter;
            this.errorLogger = errorLogger;
            this.verboseLogging = verboseLogging;
            this.isDisposed = false;
        }
        FileWatcher.prototype.startWatching = function () {
            var _this = this;
            var client = new service_cp_1.Client(uri_1.default.parse(require.toUrl('bootstrap')).fsPath, {
                serverName: 'Watcher',
                args: ['--type=watcherService'],
                env: {
                    AMD_ENTRYPOINT: 'vs/workbench/services/files/node/watcher/unix/watcherApp',
                    PIPE_LOGGING: 'true',
                    VERBOSE_LOGGING: this.verboseLogging
                }
            });
            var service = client.getService('WatcherService', WatcherService);
            // Start watching
            service.watch({ basePath: this.basePath, ignored: this.ignored, verboseLogging: this.verboseLogging }).then(null, function (err) {
                if (!(err instanceof Error && err.name === 'Canceled' && err.message === 'Canceled')) {
                    return winjs_base_1.Promise.wrapError(err); // the service lib uses the promise cancel error to indicate the process died, we do not want to bubble this up
                }
            }, function (events) { return _this.onRawFileEvents(events); }).done(function () {
                // our watcher app should never be completed because it keeps on watching. being in here indicates
                // that the watcher process died and we want to restart it here.
                if (!_this.isDisposed) {
                    _this.startWatching();
                }
            }, this.errorLogger);
            return function () {
                client.dispose();
                _this.isDisposed = true;
            };
        };
        FileWatcher.prototype.onRawFileEvents = function (events) {
            // Emit through broadcast service
            if (events.length > 0) {
                this.eventEmitter.emit(files_1.EventType.FILE_CHANGES, common_1.toFileChangesEvent(events));
            }
        };
        return FileWatcher;
    })();
    exports.FileWatcher = FileWatcher;
});
//# sourceMappingURL=watcherService.js.map