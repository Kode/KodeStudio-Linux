/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/nls', 'vs/base/common/severity', 'vs/base/common/winjs.base', 'vs/base/common/actions', 'electron', 'vs/base/common/platform', 'vs/platform/message/common/message', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/request/common/request'], function (require, exports, nls, severity_1, winjs_base_1, actions_1, electron_1, platform_1, message_1, contextService_1, request_1) {
    var Update = (function () {
        function Update(contextService, messageService, requestService) {
            var _this = this;
            this.contextService = contextService;
            this.messageService = messageService;
            this.requestService = requestService;
            var env = this.contextService.getConfiguration().env;
            electron_1.ipcRenderer.on('vscode:update-downloaded', function (event, update) {
                _this.messageService.show(severity_1.default.Info, {
                    message: nls.localize('updateAvailable', "{0} will be updated after it restarts.", env.appName),
                    actions: [Update.ShowReleaseNotesAction(env.releaseNotesUrl), Update.NotNowAction, Update.ApplyUpdateAction]
                });
            });
            electron_1.ipcRenderer.on('vscode:update-not-available', function () {
                _this.messageService.show(severity_1.default.Info, nls.localize('noUpdatesAvailable', "There are no updates currently available."));
            });
            var updateFeedUrl = env.updateFeedUrl;
            // manually check for update on linux
            if (platform_1.isLinux && updateFeedUrl) {
                this.requestService.makeRequest({ url: updateFeedUrl }).done(function (res) {
                    if (res.status !== 200) {
                        return; // no update available
                    }
                    _this.messageService.show(severity_1.default.Info, {
                        message: nls.localize('noUpdateLinux', "This version of {0} is outdated and can\'t be updated automatically. Please download and install the latest version manually.", env.appName),
                        actions: [
                            new actions_1.Action('pleaseUpdate', nls.localize('downloadLatestAction', "Download Latest"), '', true, function () {
                                electron_1.shell.openExternal(env.productDownloadUrl);
                                return winjs_base_1.Promise.as(true);
                            }),
                            new actions_1.Action('releaseNotes', nls.localize('releaseNotesAction', "Release Notes"), '', true, function () {
                                electron_1.shell.openExternal(env.releaseNotesUrl);
                                return winjs_base_1.Promise.as(false);
                            })
                        ]
                    });
                });
            }
        }
        Update.ApplyUpdateAction = new actions_1.Action('update.applyUpdate', nls.localize('updateNow', "Update Now"), null, true, function () { electron_1.ipcRenderer.send('vscode:update-apply'); return winjs_base_1.Promise.as(true); });
        Update.NotNowAction = new actions_1.Action('update.later', nls.localize('later', "Later"), null, true, function () { return winjs_base_1.Promise.as(true); });
        Update.ShowReleaseNotesAction = function (releaseNotesUrl) { return new actions_1.Action('update.showReleaseNotes', nls.localize('releaseNotes', "Release Notes"), null, true, function () { electron_1.shell.openExternal(releaseNotesUrl); return winjs_base_1.Promise.as(false); }); };
        Update = __decorate([
            __param(0, contextService_1.IWorkspaceContextService),
            __param(1, message_1.IMessageService),
            __param(2, request_1.IRequestService)
        ], Update);
        return Update;
    })();
    exports.Update = Update;
});
//# sourceMappingURL=update.js.map