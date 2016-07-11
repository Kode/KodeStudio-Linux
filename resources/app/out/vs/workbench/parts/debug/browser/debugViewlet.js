/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["vs/workbench/parts/debug/common/debug","vs/css!vs/workbench/parts/debug/browser/media/debugViewlet","vs/nls!vs/workbench/parts/debug/browser/debugActionItems","vs/base/common/lifecycle","vs/nls!vs/workbench/parts/debug/browser/debugViewlet","vs/workbench/parts/debug/browser/debugActionItems","require","exports","vs/base/common/winjs.base","vs/nls","vs/base/browser/dom","vs/base/common/platform","vs/base/browser/ui/actionbar/actionbar","vs/css!vs/workbench/parts/debug/browser/debugViewlet","vs/platform/configuration/common/configuration","vs/workbench/parts/debug/browser/debugViewlet","vs/base/browser/builder","vs/base/common/errors","vs/base/browser/ui/splitview/splitview","vs/workbench/common/memento","vs/workbench/browser/viewlet","vs/workbench/parts/debug/electron-browser/debugActions","vs/platform/instantiation/common/instantiation","vs/platform/progress/common/progress","vs/platform/workspace/common/workspace","vs/platform/telemetry/common/telemetry","vs/platform/storage/common/storage"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[1], __M([13]), {});
define(__m[2], __M([9,4]), function(nls, data) { return nls.create("vs/workbench/parts/debug/browser/debugActionItems", data); });

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[5], __M([6,7,2,3,17,10,11,12,0,14]), function (require, exports, nls, lifecycle, errors, dom, platform_1, actionbar_1, debug_1, configuration_1) {
    "use strict";
    var SelectConfigActionItem = (function (_super) {
        __extends(SelectConfigActionItem, _super);
        function SelectConfigActionItem(action, debugService, configurationService) {
            _super.call(this, null, action);
            this.debugService = debugService;
            this.select = document.createElement('select');
            this.select.className = "debug-select action-bar-select " + (platform_1.isWindows ? 'windows' : '');
            this.toDispose = [];
            this.registerListeners(configurationService);
        }
        SelectConfigActionItem.prototype.registerListeners = function (configurationService) {
            var _this = this;
            this.toDispose.push(dom.addStandardDisposableListener(this.select, 'change', function (e) {
                _this.actionRunner.run(_this._action, e.target.value).done(null, errors.onUnexpectedError);
            }));
            this.toDispose.push(this.debugService.onDidChangeState(function (state) {
                _this.select.disabled = state !== debug_1.State.Inactive;
            }));
            this.toDispose.push(configurationService.onDidUpdateConfiguration(function (e) {
                _this.setOptions(true).done(null, errors.onUnexpectedError);
            }));
            this.toDispose.push(this.debugService.getConfigurationManager().onDidConfigurationChange(function (name) {
                _this.setOptions(false).done(null, errors.onUnexpectedError);
            }));
        };
        SelectConfigActionItem.prototype.render = function (container) {
            dom.addClass(container, 'select-container');
            container.appendChild(this.select);
            this.setOptions(true).done(null, errors.onUnexpectedError);
        };
        SelectConfigActionItem.prototype.focus = function () {
            if (this.select) {
                this.select.focus();
            }
        };
        SelectConfigActionItem.prototype.blur = function () {
            if (this.select) {
                this.select.blur();
            }
        };
        SelectConfigActionItem.prototype.setOptions = function (changeDebugConfiguration) {
            var _this = this;
            var previousSelectedIndex = this.select.selectedIndex;
            this.select.options.length = 0;
            return this.debugService.getConfigurationManager().loadLaunchConfig().then(function (config) {
                if (!config || !config.configurations) {
                    _this.select.add(_this.createOption(nls.localize(0, null)));
                    _this.select.disabled = true;
                    return changeDebugConfiguration ? _this.actionRunner.run(_this._action, null) : null;
                }
                var configurations = config.configurations;
                _this.select.disabled = configurations.length < 1;
                var found = false;
                var configurationName = _this.debugService.getConfigurationManager().configurationName;
                for (var i = 0; i < configurations.length; i++) {
                    _this.select.add(_this.createOption(configurations[i].name));
                    if (configurationName === configurations[i].name) {
                        _this.select.selectedIndex = i;
                        found = true;
                    }
                }
                if (!found && configurations.length > 0) {
                    if (!previousSelectedIndex || previousSelectedIndex < 0 || previousSelectedIndex >= configurations.length) {
                        previousSelectedIndex = 0;
                    }
                    _this.select.selectedIndex = previousSelectedIndex;
                    if (changeDebugConfiguration) {
                        return _this.actionRunner.run(_this._action, configurations[previousSelectedIndex].name);
                    }
                }
            });
        };
        SelectConfigActionItem.prototype.createOption = function (value) {
            var option = document.createElement('option');
            option.value = value;
            option.text = value;
            return option;
        };
        SelectConfigActionItem.prototype.dispose = function () {
            this.debugService = null;
            this.toDispose = lifecycle.dispose(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        SelectConfigActionItem = __decorate([
            __param(1, debug_1.IDebugService),
            __param(2, configuration_1.IConfigurationService)
        ], SelectConfigActionItem);
        return SelectConfigActionItem;
    }(actionbar_1.BaseActionItem));
    exports.SelectConfigActionItem = SelectConfigActionItem;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[15], __M([6,7,4,16,8,3,18,19,20,0,21,5,22,23,24,25,26,1]), function (require, exports, nls, builder, winjs_base_1, lifecycle, splitview_1, memento, viewlet_1, debug, debugactions, dbgactionitems, instantiation_1, progress_1, workspace_1, telemetry_1, storage_1) {
    "use strict";
    var IDebugService = debug.IDebugService;
    var $ = builder.$;
    var DebugViewlet = (function (_super) {
        __extends(DebugViewlet, _super);
        function DebugViewlet(telemetryService, progressService, debugService, instantiationService, contextService, storageService) {
            var _this = this;
            _super.call(this, debug.VIEWLET_ID, telemetryService);
            this.progressService = progressService;
            this.debugService = debugService;
            this.instantiationService = instantiationService;
            this.contextService = contextService;
            this.progressRunner = null;
            this.viewletSettings = this.getMemento(storageService, memento.Scope.WORKSPACE);
            this.toDispose = [];
            this.views = [];
            this.toDispose.push(this.debugService.onDidChangeState(function (state) {
                _this.onDebugServiceStateChange(state);
            }));
        }
        // viewlet
        DebugViewlet.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            this.$el = parent.div().addClass('debug-viewlet');
            if (this.contextService.getWorkspace()) {
                var actionRunner_1 = this.getActionRunner();
                this.views = debug.DebugViewRegistry.getDebugViews().map(function (viewConstructor) { return _this.instantiationService.createInstance(viewConstructor, actionRunner_1, _this.viewletSettings); });
                this.splitView = new splitview_1.SplitView(this.$el.getHTMLElement());
                this.toDispose.push(this.splitView);
                this.views.forEach(function (v) { return _this.splitView.addView(v); });
                // Track focus
                this.toDispose.push(this.splitView.onFocus(function (view) {
                    _this.lastFocusedView = view;
                }));
            }
            else {
                this.$el.append($([
                    '<div class="noworkspace-view">',
                    '<p>', nls.localize(0, null), '</p>',
                    '<p>', nls.localize(1, null), '</p>',
                    '</div>'
                ].join('')));
            }
            return winjs_base_1.TPromise.as(null);
        };
        DebugViewlet.prototype.setVisible = function (visible) {
            var _this = this;
            return _super.prototype.setVisible.call(this, visible).then(function () {
                return winjs_base_1.TPromise.join(_this.views.map(function (view) { return view.setVisible(visible); }));
            });
        };
        DebugViewlet.prototype.layout = function (dimension) {
            if (this.splitView) {
                this.splitView.layout(dimension.height);
            }
        };
        DebugViewlet.prototype.focus = function () {
            _super.prototype.focus.call(this);
            if (this.lastFocusedView && this.lastFocusedView.isExpanded()) {
                this.lastFocusedView.focusBody();
                return;
            }
            if (this.views.length > 0) {
                this.views[0].focusBody();
            }
        };
        DebugViewlet.prototype.getActions = function () {
            var _this = this;
            if (this.debugService.state === debug.State.Disabled) {
                return [];
            }
            if (!this.actions) {
                this.actions = [
                    this.instantiationService.createInstance(debugactions.StartDebugAction, debugactions.StartDebugAction.ID, debugactions.StartDebugAction.LABEL),
                    this.instantiationService.createInstance(debugactions.SelectConfigAction, debugactions.SelectConfigAction.ID, debugactions.SelectConfigAction.LABEL),
                    this.instantiationService.createInstance(debugactions.ConfigureAction, debugactions.ConfigureAction.ID, debugactions.ConfigureAction.LABEL),
                    this.instantiationService.createInstance(debugactions.ToggleReplAction, debugactions.ToggleReplAction.ID, debugactions.ToggleReplAction.LABEL)
                ];
                this.actions.forEach(function (a) {
                    _this.toDispose.push(a);
                });
            }
            return this.actions;
        };
        DebugViewlet.prototype.getActionItem = function (action) {
            if (action.id === debugactions.SelectConfigAction.ID) {
                return this.instantiationService.createInstance(dbgactionitems.SelectConfigActionItem, action);
            }
            return null;
        };
        DebugViewlet.prototype.onDebugServiceStateChange = function (newState) {
            if (this.progressRunner) {
                this.progressRunner.done();
            }
            if (newState === debug.State.Initializing) {
                this.progressRunner = this.progressService.show(true);
            }
            else {
                this.progressRunner = null;
            }
        };
        DebugViewlet.prototype.dispose = function () {
            this.toDispose = lifecycle.dispose(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        DebugViewlet.prototype.shutdown = function () {
            this.views.forEach(function (v) { return v.shutdown(); });
            _super.prototype.shutdown.call(this);
        };
        DebugViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, progress_1.IProgressService),
            __param(2, IDebugService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, workspace_1.IWorkspaceContextService),
            __param(5, storage_1.IStorageService)
        ], DebugViewlet);
        return DebugViewlet;
    }(viewlet_1.Viewlet));
    exports.DebugViewlet = DebugViewlet;
});

}).call(this);
//# sourceMappingURL=debugViewlet.js.map
