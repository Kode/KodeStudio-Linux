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
define(["require", "exports", 'vs/nls', 'vs/base/common/lifecycle', 'vs/base/common/strings', 'vs/base/common/errors', 'vs/base/common/severity', 'vs/base/browser/dom', 'vs/base/common/winjs.base', 'vs/editor/contrib/zoneWidget/browser/zoneWidget', 'vs/base/browser/builder', 'vs/editor/browser/editorBrowserExtensions', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/common/editorCommon', 'vs/base/browser/htmlContentRenderer', 'vs/base/common/event', 'vs/editor/common/core/position', 'vs/platform/markers/common/markers', 'vs/platform/telemetry/common/telemetry', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/event/common/event', 'vs/platform/editor/common/editor', 'vs/editor/common/services/bulkEdit', 'vs/base/common/keyCodes', 'vs/css!./gotoError'], function (require, exports, nls, lifecycle, strings, Errors, severity_1, DOM, winjs_base_1, ZoneWidget, Builder, editorBrowserExtensions_1, editorCommonExtensions_1, editorAction_1, EditorCommon, HtmlContentRenderer, event_1, position_1, markers_1, telemetry_1, keybindingService_1, event_2, editor_1, bulkEdit_1, keyCodes_1) {
    var $ = Builder.$;
    var MarkerModel = (function () {
        function MarkerModel(editor, markers) {
            var _this = this;
            this._editor = editor;
            this._markers = null;
            this._nextIdx = -1;
            this._toUnbind = [];
            this._ignoreSelectionChange = false;
            this._onCurrentMarkerChanged = new event_1.Emitter();
            this._onMarkerSetChanged = new event_1.Emitter();
            this.setMarkers(markers);
            // listen on editor
            this._toUnbind.push(this._editor.addListener(EditorCommon.EventType.Disposed, function () { return _this.dispose(); }));
            this._toUnbind.push(this._editor.addListener(EditorCommon.EventType.CursorPositionChanged, function () {
                if (!_this._ignoreSelectionChange) {
                    _this._nextIdx = -1;
                }
            }));
        }
        Object.defineProperty(MarkerModel.prototype, "onCurrentMarkerChanged", {
            get: function () {
                return this._onCurrentMarkerChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MarkerModel.prototype, "onMarkerSetChanged", {
            get: function () {
                return this._onMarkerSetChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        MarkerModel.prototype.setMarkers = function (markers) {
            // assign
            this._markers = markers || [];
            // sort markers
            this._markers.sort(function (left, right) {
                if (left.startLineNumber === right.startLineNumber) {
                    return left.startColumn - right.startColumn;
                }
                else {
                    return left.startLineNumber - right.startLineNumber;
                }
            });
            this._nextIdx = -1;
            this._onMarkerSetChanged.fire(this);
        };
        MarkerModel.prototype.withoutWatchingEditorPosition = function (callback) {
            this._ignoreSelectionChange = true;
            try {
                callback();
            }
            finally {
                this._ignoreSelectionChange = false;
            }
        };
        MarkerModel.prototype.initIdx = function (fwd) {
            var found = false;
            var position = this._editor.getPosition();
            for (var i = 0, len = this._markers.length; i < len && !found; i++) {
                var pos = { lineNumber: this._markers[i].startLineNumber, column: this._markers[i].startColumn };
                if (position.isBeforeOrEqual(pos)) {
                    this._nextIdx = i + (fwd ? 0 : -1);
                    found = true;
                }
            }
            if (!found) {
                // after the last change
                this._nextIdx = fwd ? 0 : this._markers.length - 1;
            }
            if (this._nextIdx < 0) {
                this._nextIdx = this._markers.length - 1;
            }
        };
        MarkerModel.prototype.move = function (fwd) {
            if (!this.canNavigate()) {
                this._onCurrentMarkerChanged.fire(undefined);
                return;
            }
            if (this._nextIdx === -1) {
                this.initIdx(fwd);
            }
            else if (fwd) {
                this._nextIdx += 1;
                if (this._nextIdx >= this._markers.length) {
                    this._nextIdx = 0;
                }
            }
            else {
                this._nextIdx -= 1;
                if (this._nextIdx < 0) {
                    this._nextIdx = this._markers.length - 1;
                }
            }
            var marker = this._markers[this._nextIdx];
            this._onCurrentMarkerChanged.fire(marker);
        };
        MarkerModel.prototype.canNavigate = function () {
            return this._markers.length > 0;
        };
        MarkerModel.prototype.next = function () {
            this.move(true);
        };
        MarkerModel.prototype.previous = function () {
            this.move(false);
        };
        MarkerModel.prototype.goTo = function (pos) {
            for (var i = 0; i < this._markers.length; i++) {
                var marker = this._markers[i];
                if (marker.startLineNumber <= pos.lineNumber && marker.endLineNumber >= pos.lineNumber
                    && marker.startColumn <= pos.column && marker.endColumn >= pos.column) {
                    this._onCurrentMarkerChanged.fire(marker);
                    return;
                }
            }
            return null;
        };
        MarkerModel.prototype.indexOf = function (marker) {
            return this._markers.indexOf(marker);
        };
        MarkerModel.prototype.length = function () {
            return this._markers.length;
        };
        MarkerModel.prototype.reveal = function () {
            var _this = this;
            if (this._nextIdx === -1) {
                return;
            }
            this.withoutWatchingEditorPosition(function () {
                var pos = new position_1.Position(_this._markers[_this._nextIdx].startLineNumber, _this._markers[_this._nextIdx].startColumn);
                _this._editor.setPosition(pos);
                _this._editor.revealPositionInCenter(pos);
            });
        };
        MarkerModel.prototype.dispose = function () {
            this._toUnbind = lifecycle.cAll(this._toUnbind);
        };
        return MarkerModel;
    })();
    var zoneOptions = {
        showFrame: true,
        showArrow: true
    };
    var MarkerNavigationWidget = (function (_super) {
        __extends(MarkerNavigationWidget, _super);
        function MarkerNavigationWidget(eventService, editorService, editor, _model) {
            _super.call(this, editor, zoneOptions);
            this._model = _model;
            this._callOnDispose = [];
            this._eventService = eventService;
            this._editorService = editorService;
            this.create();
            this._wireModelAndView();
        }
        MarkerNavigationWidget.prototype.fillContainer = function (container) {
            var _this = this;
            var $container = $(container).addClass('marker-widget');
            $container.div({ class: 'descriptioncontainer' }, function (div) {
                _this._element = div;
            });
            $container.div(function (div) {
                _this._quickFixSection = div;
            });
            $container.on(DOM.EventType.CLICK, function () {
                _this.editor.focus();
            });
        };
        MarkerNavigationWidget.prototype._wireModelAndView = function () {
            this._model.onCurrentMarkerChanged(this.showAtMarker, this, this._callOnDispose);
        };
        MarkerNavigationWidget.prototype.showAtMarker = function (marker) {
            var _this = this;
            if (!marker) {
                return;
            }
            // set color
            switch (marker.severity) {
                case severity_1.default.Error:
                    this.options.frameColor = '#ff5a5a';
                    break;
                case severity_1.default.Warning:
                case severity_1.default.Info:
                    this.options.frameColor = '#5aac5a';
                    break;
            }
            // update label and show
            var text = strings.format('({0}/{1}) ', this._model.indexOf(marker) + 1, this._model.length());
            if (marker.source) {
                text = text + "[" + marker.source + "] ";
            }
            this._element.text(text);
            var htmlElem = this._element.getHTMLElement();
            HtmlContentRenderer.renderHtml2(marker.message).forEach(function (node) {
                htmlElem.appendChild(node);
            });
            var mode = this.editor.getModel().getMode();
            this._quickFixSection.hide();
            if (mode.quickFixSupport) {
                var promise = mode.quickFixSupport.getQuickFixes(this.editor.getModel().getAssociatedResource(), marker);
                promise.then(function (result) {
                    _this._quickFixSection.clearChildren();
                    if (result.length > 0) {
                        var container = $(_this._quickFixSection);
                        container.span({
                            class: 'quickfixhead',
                            text: result.length > 1 ? nls.localize('quickfix.multiple.label', 'Suggested fixes: ') : nls.localize('quickfix.single.label', 'Suggested fix: ')
                        }).span({ class: 'quickfixcontainer' }, function (quickFixContainer) {
                            result.forEach(function (fix, idx, arr) {
                                var container = $(quickFixContainer);
                                if (idx > 0) {
                                    container = container.span({ text: ', ' });
                                }
                                container.span({
                                    class: 'quickfixentry',
                                    text: fix.command.title
                                }).on(DOM.EventType.CLICK, function () {
                                    mode.quickFixSupport.runQuickFixAction(_this.editor.getModel().getAssociatedResource(), marker, fix).then(function (result) {
                                        return bulkEdit_1.bulkEdit(_this._eventService, _this._editorService, _this.editor, result.edits);
                                    });
                                    return true;
                                });
                            });
                        });
                        _this._quickFixSection.show();
                        _this.show(new position_1.Position(marker.startLineNumber, marker.startColumn), 4);
                    }
                }, function (error) {
                    Errors.onUnexpectedError(error);
                });
            }
            this._model.withoutWatchingEditorPosition(function () {
                _this.show(new position_1.Position(marker.startLineNumber, marker.startColumn), 3);
            });
        };
        MarkerNavigationWidget.prototype.dispose = function () {
            this._callOnDispose = lifecycle.disposeAll(this._callOnDispose);
            _super.prototype.dispose.call(this);
        };
        return MarkerNavigationWidget;
    })(ZoneWidget.ZoneWidget);
    var MarkerNavigationAction = (function (_super) {
        __extends(MarkerNavigationAction, _super);
        function MarkerNavigationAction(descriptor, editor, next, telemetryService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.Writeable | editorAction_1.Behaviour.UpdateOnModelChange);
            this.telemetryService = telemetryService;
            this._isNext = next;
        }
        MarkerNavigationAction.prototype.run = function () {
            var model = MarkerController.getMarkerController(this.editor).getOrCreateModel();
            this.telemetryService.publicLog('zoneWidgetShown', { mode: 'go to error' });
            if (model) {
                if (this._isNext) {
                    model.next();
                }
                else {
                    model.previous();
                }
                model.reveal();
            }
            return winjs_base_1.TPromise.as(true);
        };
        MarkerNavigationAction = __decorate([
            __param(3, telemetry_1.ITelemetryService)
        ], MarkerNavigationAction);
        return MarkerNavigationAction;
    })(editorAction_1.EditorAction);
    var MarkerController = (function () {
        function MarkerController(editor, markerService, keybindingService, eventService, editorService) {
            this._callOnClose = [];
            this.markerService = markerService;
            this.eventService = eventService;
            this.editorService = editorService;
            this.editor = editor;
            this._markersNavigationVisible = keybindingService.createKey(CONTEXT_MARKERS_NAVIGATION_VISIBLE, false);
        }
        MarkerController.getMarkerController = function (editor) {
            return editor.getContribution(MarkerController.ID);
        };
        MarkerController.prototype.getId = function () {
            return MarkerController.ID;
        };
        MarkerController.prototype.dispose = function () {
            this._cleanUp();
        };
        MarkerController.prototype._cleanUp = function () {
            this._markersNavigationVisible.reset();
            this._callOnClose = lifecycle.disposeAll(this._callOnClose);
            this._zone = null;
            this._model = null;
        };
        MarkerController.prototype.getOrCreateModel = function () {
            var _this = this;
            if (this._model) {
                return this._model;
            }
            var markers = this._getMarkers();
            this._model = new MarkerModel(this.editor, markers);
            this._zone = new MarkerNavigationWidget(this.eventService, this.editorService, this.editor, this._model);
            this._markersNavigationVisible.set(true);
            this._callOnClose.push(this._model);
            this._callOnClose.push(this._zone);
            this._callOnClose.push(this.editor.addListener2(EditorCommon.EventType.ModelChanged, function () {
                _this._cleanUp();
            }));
            this._model.onCurrentMarkerChanged(function (marker) { return !marker && _this._cleanUp(); }, undefined, this._callOnClose);
            this.markerService.onMarkerChanged(this._onMarkerChanged, this, this._callOnClose);
            return this._model;
        };
        MarkerController.prototype.closeMarkersNavigation = function () {
            this._cleanUp();
        };
        MarkerController.prototype._onMarkerChanged = function (changedResources) {
            var _this = this;
            if (!changedResources.some(function (r) { return _this.editor.getModel().getAssociatedResource().toString() === r.toString(); })) {
                return;
            }
            this._model.setMarkers(this._getMarkers());
        };
        MarkerController.prototype._getMarkers = function () {
            var resource = this.editor.getModel().getAssociatedResource(), markers = this.markerService.read({ resource: resource });
            return markers;
        };
        MarkerController.ID = 'editor.contrib.markerController';
        MarkerController = __decorate([
            __param(1, markers_1.IMarkerService),
            __param(2, keybindingService_1.IKeybindingService),
            __param(3, event_2.IEventService),
            __param(4, editor_1.IEditorService)
        ], MarkerController);
        return MarkerController;
    })();
    var NextMarkerAction = (function (_super) {
        __extends(NextMarkerAction, _super);
        function NextMarkerAction(descriptor, editor, telemetryService) {
            _super.call(this, descriptor, editor, true, telemetryService);
        }
        NextMarkerAction.ID = 'editor.action.marker.next';
        NextMarkerAction = __decorate([
            __param(2, telemetry_1.ITelemetryService)
        ], NextMarkerAction);
        return NextMarkerAction;
    })(MarkerNavigationAction);
    var PrevMarkerAction = (function (_super) {
        __extends(PrevMarkerAction, _super);
        function PrevMarkerAction(descriptor, editor, telemetryService) {
            _super.call(this, descriptor, editor, false, telemetryService);
        }
        PrevMarkerAction.ID = 'editor.action.marker.prev';
        PrevMarkerAction = __decorate([
            __param(2, telemetry_1.ITelemetryService)
        ], PrevMarkerAction);
        return PrevMarkerAction;
    })(MarkerNavigationAction);
    var CONTEXT_MARKERS_NAVIGATION_VISIBLE = 'markersNavigationVisible';
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(NextMarkerAction, NextMarkerAction.ID, nls.localize('markerAction.next.label', "Go to Next Error or Warning"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyCode.F8
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(PrevMarkerAction, PrevMarkerAction.ID, nls.localize('markerAction.previous.label', "Go to Previous Error or Warning"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.F8
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('closeMarkersNavigation', editorCommonExtensions_1.CommonEditorRegistry.commandWeight(50), { primary: keyCodes_1.KeyCode.Escape }, false, CONTEXT_MARKERS_NAVIGATION_VISIBLE, function (ctx, editor, args) {
        var controller = MarkerController.getMarkerController(editor);
        controller.closeMarkersNavigation();
    });
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(MarkerController);
});
//# sourceMappingURL=gotoError.js.map