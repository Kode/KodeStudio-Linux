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
define(["require", "exports", 'vs/base/common/errors', 'vs/base/common/lifecycle', 'vs/base/browser/dom', 'vs/base/common/platform', 'vs/base/parts/tree/browser/treeImpl', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/workbench/parts/debug/browser/debugEditorInputs', 'vs/workbench/parts/debug/browser/replViewer', 'vs/workbench/parts/debug/common/debug', 'vs/workbench/parts/debug/electron-browser/debugActions', 'vs/workbench/parts/debug/common/replHistory', 'vs/platform/telemetry/common/telemetry', 'vs/platform/contextview/browser/contextView', 'vs/platform/instantiation/common/instantiation', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/storage/common/storage', 'vs/platform/lifecycle/common/lifecycle', 'vs/base/common/keyCodes', 'vs/css!./media/repl'], function (require, exports, errors, lifecycle, dom, platform, treeimpl, baseeditor, editorinputs, viewer, debug, debugactions, replhistory, telemetry_1, contextView_1, instantiation_1, contextService_1, storage_1, lifecycle_1, keyCodes_1) {
    var $ = dom.emmet;
    var replTreeOptions = {
        indentPixels: 8,
        twistiePixels: 20,
        paddingOnRow: false
    };
    var HISTORY_STORAGE_KEY = 'debug.repl.history';
    var Repl = (function (_super) {
        __extends(Repl, _super);
        function Repl(debugService, contextMenuService, contextService, telemetryService, instantiationService, contextViewService, storageService, lifecycleService) {
            _super.call(this, Repl.ID, telemetryService);
            this.debugService = debugService;
            this.contextMenuService = contextMenuService;
            this.contextService = contextService;
            this.instantiationService = instantiationService;
            this.contextViewService = contextViewService;
            this.storageService = storageService;
            this.toDispose = [];
            this.registerListeners(lifecycleService);
        }
        Repl.prototype.registerListeners = function (lifecycleService) {
            var _this = this;
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.REPL_ELEMENTS_UPDATED, function (re) {
                _this.onReplElementsUpdated(re);
            }));
            lifecycleService.onShutdown(this.onShutdown, this);
        };
        Repl.prototype.onReplElementsUpdated = function (re) {
            var _this = this;
            if (this.tree) {
                if (this.refreshTimeoutHandle) {
                    return; // refresh already triggered
                }
                this.refreshTimeoutHandle = setTimeout(function () {
                    delete _this.refreshTimeoutHandle;
                    var scrollPosition = _this.tree.getScrollPosition();
                    _this.tree.refresh().then(function () {
                        if (scrollPosition === 0 || scrollPosition === 1) {
                            return _this.tree.setScrollPosition(1); // keep scrolling to the end unless user scrolled up
                        }
                    }, errors.onUnexpectedError);
                }, Repl.REFRESH_DELAY);
            }
        };
        Repl.prototype.createEditor = function (parent) {
            var _this = this;
            var container = dom.append(parent.getHTMLElement(), $('.repl'));
            // inherit the background color from selected theme.
            dom.addClass(container, 'monaco-editor-background');
            this.treeContainer = dom.append(container, $('.repl-tree'));
            var replInputContainer = dom.append(container, $(platform.isWindows ? '.repl-input-wrapper.windows' : platform.isMacintosh ? '.repl-input-wrapper.mac' : '.repl-input-wrapper.linux'));
            this.replInput = dom.append(replInputContainer, $('input.repl-input'));
            dom.addStandardDisposableListener(this.replInput, 'keydown', function (e) {
                var trimmedValue = _this.replInput.value.trim();
                if (e.equals(keyCodes_1.CommonKeybindings.ENTER) && trimmedValue) {
                    _this.debugService.addReplExpression(trimmedValue);
                    Repl.HISTORY.evaluated(trimmedValue);
                    _this.replInput.value = '';
                }
                else if (e.equals(keyCodes_1.CommonKeybindings.UP_ARROW) || e.equals(keyCodes_1.CommonKeybindings.DOWN_ARROW)) {
                    var historyInput = e.equals(keyCodes_1.CommonKeybindings.UP_ARROW) ? Repl.HISTORY.previous() : Repl.HISTORY.next();
                    if (historyInput) {
                        Repl.HISTORY.remember(_this.replInput.value, e.equals(keyCodes_1.CommonKeybindings.UP_ARROW));
                        _this.replInput.value = historyInput;
                        // always leave cursor at the end.
                        e.preventDefault();
                    }
                }
            });
            this.characterWidthSurveyor = dom.append(container, $('.surveyor'));
            this.characterWidthSurveyor.textContent = Repl.HALF_WIDTH_TYPICAL;
            for (var i = 0; i < 10; i++) {
                this.characterWidthSurveyor.textContent += this.characterWidthSurveyor.textContent;
            }
            this.characterWidthSurveyor.style.fontSize = platform.isMacintosh ? '12px' : '14px';
            this.renderer = this.instantiationService.createInstance(viewer.ReplExpressionsRenderer);
            this.tree = new treeimpl.Tree(this.treeContainer, {
                dataSource: new viewer.ReplExpressionsDataSource(this.debugService),
                renderer: this.renderer,
                controller: new viewer.ReplExpressionsController(this.debugService, this.contextMenuService, new viewer.ReplExpressionsActionProvider(this.instantiationService), this.replInput, false)
            }, replTreeOptions);
            if (!Repl.HISTORY) {
                Repl.HISTORY = new replhistory.ReplHistory(JSON.parse(this.storageService.get(HISTORY_STORAGE_KEY, storage_1.StorageScope.WORKSPACE, '[]')));
            }
        };
        Repl.prototype.setInput = function (input, options) {
            var _this = this;
            return _super.prototype.setInput.call(this, input, options).then(function () {
                if (!_this.tree) {
                    return;
                }
                if (!_this.tree.getInput()) {
                    _this.tree.setInput(_this.debugService.getModel());
                }
            });
        };
        Repl.prototype.layout = function (dimension) {
            if (this.tree) {
                this.renderer.setWidth(dimension.width - 20, this.characterWidthSurveyor.clientWidth / this.characterWidthSurveyor.textContent.length);
                this.tree.layout(this.treeContainer.clientHeight);
                this.tree.refresh().done(null, errors.onUnexpectedError);
            }
        };
        Repl.prototype.focus = function () {
            this.replInput.focus();
        };
        Repl.prototype.reveal = function (element) {
            return this.tree.reveal(element);
        };
        Repl.prototype.onShutdown = function () {
            this.storageService.store(HISTORY_STORAGE_KEY, JSON.stringify(Repl.HISTORY.save()), storage_1.StorageScope.WORKSPACE);
        };
        Repl.prototype.dispose = function () {
            // destroy container
            this.toDispose = lifecycle.disposeAll(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        Repl.ID = 'workbench.editors.replEditor';
        Repl.HALF_WIDTH_TYPICAL = 'n';
        Repl.REFRESH_DELAY = 500; // delay in ms to refresh the repl for new elements to show
        Repl = __decorate([
            __param(0, debug.IDebugService),
            __param(1, contextView_1.IContextMenuService),
            __param(2, contextService_1.IWorkspaceContextService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, contextView_1.IContextViewService),
            __param(6, storage_1.IStorageService),
            __param(7, lifecycle_1.ILifecycleService)
        ], Repl);
        return Repl;
    })(baseeditor.BaseEditor);
    exports.Repl = Repl;
    var ReplEditorActionContributor = (function (_super) {
        __extends(ReplEditorActionContributor, _super);
        function ReplEditorActionContributor(instantiationService) {
            _super.call(this);
            this.instantiationService = instantiationService;
        }
        ReplEditorActionContributor.prototype.hasActionsForEditorInput = function (context) {
            return context.input instanceof editorinputs.ReplEditorInput;
        };
        ReplEditorActionContributor.prototype.getActionsForEditorInput = function (context) {
            return [this.instantiationService.createInstance(debugactions.ClearReplAction)];
        };
        ReplEditorActionContributor = __decorate([
            __param(0, instantiation_1.IInstantiationService)
        ], ReplEditorActionContributor);
        return ReplEditorActionContributor;
    })(baseeditor.EditorInputActionContributor);
    exports.ReplEditorActionContributor = ReplEditorActionContributor;
    var ReplInputFactory = (function () {
        function ReplInputFactory(ns) {
            // noop
        }
        ReplInputFactory.prototype.serialize = function (editorInput) {
            return editorInput.getId();
        };
        ReplInputFactory.prototype.deserialize = function (instantiationService, resourceRaw) {
            return editorinputs.ReplEditorInput.getInstance();
        };
        ReplInputFactory = __decorate([
            __param(0, instantiation_1.INullService)
        ], ReplInputFactory);
        return ReplInputFactory;
    })();
    exports.ReplInputFactory = ReplInputFactory;
});
//# sourceMappingURL=replEditor.js.map