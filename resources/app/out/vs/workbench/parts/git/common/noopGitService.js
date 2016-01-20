/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/workbench/parts/git/common/git', 'vs/base/common/winjs.base'], function (require, exports, git, winjs) {
    var NoOpGitService = (function () {
        function NoOpGitService() {
        }
        NoOpGitService.prototype.serviceState = function () {
            return winjs.Promise.as(git.RawServiceState.OK);
        };
        NoOpGitService.prototype.status = function () {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.init = function () {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.add = function (filesPaths) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.stage = function (filePath, content) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.branch = function (name, checkout) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.checkout = function (treeish, filePaths) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.clean = function (filePaths) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.undo = function () {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.reset = function (treeish, hard) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.revertFiles = function (treeish, filePaths) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.fetch = function () {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.pull = function (rebase) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.push = function () {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.sync = function () {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.commit = function (message, amend, stage) {
            return winjs.Promise.as(NoOpGitService.STATUS);
        };
        NoOpGitService.prototype.detectMimetypes = function (path, treeish) {
            return winjs.Promise.as([]);
        };
        NoOpGitService.prototype.show = function (path, treeish) {
            return winjs.Promise.as(null);
        };
        NoOpGitService.prototype.onOutput = function () {
            return winjs.Promise.as(function () { return null; });
        };
        NoOpGitService.STATUS = {
            repositoryRoot: null,
            state: git.ServiceState.NotAWorkspace,
            status: [],
            HEAD: null,
            heads: [],
            tags: [],
            remotes: []
        };
        return NoOpGitService;
    })();
    exports.NoOpGitService = NoOpGitService;
});
//# sourceMappingURL=noopGitService.js.map