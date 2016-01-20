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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/common/actions', 'vs/workbench/common/constants', 'vs/platform/actions/common/actions', 'vs/platform/message/common/message', 'vs/platform/storage/common/storage', 'vs/platform/platform', 'vs/base/common/platform', 'vs/workbench/common/actionRegistry', 'vs/platform/theme/common/themes', 'vs/workbench/services/quickopen/common/quickOpenService', 'vs/platform/workspace/common/workspace', 'vs/workbench/services/themes/node/themeService', 'electron'], function (require, exports, nls, winjs, actions, Constants, actions_1, message_1, storage_1, platform, commonPlatform, workbenchActionRegistry, Themes, quickOpenService_1, workspace_1, themeService_1, electron_1) {
    var SelectThemeAction = (function (_super) {
        __extends(SelectThemeAction, _super);
        function SelectThemeAction(id, label, contextService, quickOpenService, storageService, messageService, themeService) {
            _super.call(this, id, label);
            this.contextService = contextService;
            this.quickOpenService = quickOpenService;
            this.storageService = storageService;
            this.messageService = messageService;
            this.themeService = themeService;
        }
        SelectThemeAction.prototype.run = function () {
            var _this = this;
            return this.themeService.getThemes().then(function (contributedThemes) {
                var currentTheme = _this.storageService.get(Constants.Preferences.THEME, storage_1.StorageScope.GLOBAL, Themes.DEFAULT_THEME_ID);
                var selectedIndex = 0;
                var picks = [];
                Themes.getBaseThemes(commonPlatform.isWindows).forEach(function (baseTheme) {
                    picks.push({ label: Themes.toLabel(baseTheme), id: Themes.toId(baseTheme), description: nls.localize('themes.defaultTheme', "Default color theme") });
                });
                var contributedThemesById = {};
                contributedThemes.forEach(function (theme) {
                    picks.push({ id: theme.id, label: theme.label, description: theme.description });
                    contributedThemes[theme.id] = theme;
                });
                picks = picks.sort(function (t1, t2) { return t1.label.localeCompare(t2.label); });
                var selectedPickIndex;
                picks.forEach(function (p, index) {
                    if (p.id === currentTheme) {
                        selectedPickIndex = index;
                    }
                });
                var pickTheme = function (pick) {
                    if (pick) {
                        var themeId = pick.id;
                        if (!contributedThemesById[themeId]) {
                            // built-in theme
                            electron_1.ipcRenderer.send('vscode:changeTheme', themeId);
                        }
                        else {
                            // before applying, check that it can be loaded
                            return _this.themeService.loadThemeCSS(themeId).then(function (_) {
                                electron_1.ipcRenderer.send('vscode:changeTheme', themeId);
                            }, function (error) {
                                _this.messageService.show(message_1.Severity.Info, nls.localize('problemChangingTheme', "Problem loading theme: {0}", error.message));
                            });
                        }
                    }
                    else {
                        // undo changes
                        if (_this.storageService.get(Constants.Preferences.THEME, storage_1.StorageScope.GLOBAL) !== currentTheme) {
                            electron_1.ipcRenderer.send('vscode:changeTheme', currentTheme);
                        }
                    }
                    return winjs.Promise.as(null);
                };
                return _this.quickOpenService.pick(picks, { placeHolder: nls.localize('themes.selectTheme', "Select Color Theme"), autoFocus: { autoFocusIndex: selectedPickIndex } }).then(pickTheme, null, pickTheme);
            });
        };
        SelectThemeAction.ID = 'workbench.action.selectTheme';
        SelectThemeAction.LABEL = nls.localize('selectTheme.label', 'Color Theme');
        SelectThemeAction = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, quickOpenService_1.IQuickOpenService),
            __param(4, storage_1.IStorageService),
            __param(5, message_1.IMessageService),
            __param(6, themeService_1.IThemeService)
        ], SelectThemeAction);
        return SelectThemeAction;
    })(actions.Action);
    var category = nls.localize('preferences', "Preferences");
    var workbenchActionsRegistry = platform.Registry.as(workbenchActionRegistry.Extensions.WorkbenchActions);
    workbenchActionsRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(SelectThemeAction, SelectThemeAction.ID, SelectThemeAction.LABEL), category);
});
//# sourceMappingURL=themes.contribution.js.map