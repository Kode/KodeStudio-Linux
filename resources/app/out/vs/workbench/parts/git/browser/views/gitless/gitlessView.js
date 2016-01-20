/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
define(["require", "exports", 'vs/nls', 'vs/base/common/platform', 'vs/base/common/winjs.base', 'vs/base/common/eventEmitter', 'vs/base/browser/builder', 'vs/platform/workspace/common/workspace', 'vs/platform/selection/common/selection', 'vs/css!./gitlessView'], function (require, exports, nls, platform, winjs, ee, builder, workspace_1, selection_1) {
    var $ = builder.$;
    var GitlessView = (function (_super) {
        __extends(GitlessView, _super);
        function GitlessView(contextService) {
            _super.call(this);
            this.ID = 'gitless';
            this._contextService = contextService;
        }
        Object.defineProperty(GitlessView.prototype, "element", {
            get: function () {
                if (!this._element) {
                    this.render();
                }
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        GitlessView.prototype.render = function () {
            var instructions;
            if (platform.isMacintosh) {
                instructions = nls.localize('macInstallWith', "You can either install it with {0}, download it from {1} or install the {2} command line developer tools, by simply typing {3} on a Terminal prompt.", '<a href="http://brew.sh/" target="_blank">Homebrew</a>', '<a href="http://git-scm.com/download/mac" target="_blank">git-scm.com</a>', '<a href="https://developer.apple.com/xcode/" target="_blank">XCode</a>', '<code>git</code>');
            }
            else if (platform.isWindows) {
                instructions = nls.localize('winInstallWith', "You can either install it with {0} or download it from {1}.", '<a href="https://chocolatey.org/packages/git" target="_blank">Chocolatey</a>', '<a href="http://git-scm.com/download/win" target="_blank">git-scm.com</a>');
            }
            else if (platform.isLinux) {
                instructions = nls.localize('linuxDownloadFrom', "You can download it from {0}.", '<a href="http://git-scm.com/download/linux" target="_blank">git-scm.com</a>');
            }
            else {
                instructions = nls.localize('downloadFrom', "You can download it from {0}.", '<a href="http://git-scm.com/download" target="_blank">git-scm.com</a>');
            }
            this._element = $([
                '<div class="gitless-view">',
                '<p>', nls.localize('looksLike', "It looks like git is not installed on your system."), '</p>',
                '<p>', instructions, '</p>',
                '<p>', nls.localize('pleaseRestart', "Once git is installed, please restart {0}.", this._contextService.getConfiguration().env.appName), '</p>',
                '</div>'
            ].join('')).getHTMLElement();
        };
        GitlessView.prototype.focus = function () {
            return;
        };
        GitlessView.prototype.layout = function (dimension) {
            return;
        };
        GitlessView.prototype.setVisible = function (visible) {
            return winjs.Promise.as(null);
        };
        GitlessView.prototype.getSelection = function () {
            return selection_1.Selection.EMPTY;
        };
        GitlessView.prototype.getControl = function () {
            return null;
        };
        GitlessView.prototype.getActions = function () {
            return [];
        };
        GitlessView.prototype.getSecondaryActions = function () {
            return [];
        };
        GitlessView = __decorate([
            __param(0, workspace_1.IWorkspaceContextService)
        ], GitlessView);
        return GitlessView;
    })(ee.EventEmitter);
    exports.GitlessView = GitlessView;
});
//# sourceMappingURL=gitlessView.js.map