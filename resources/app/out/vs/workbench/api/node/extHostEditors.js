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
define(["require", "exports", 'vs/base/common/event', 'vs/base/common/lifecycle', 'vs/base/common/winjs.base', 'vs/platform/thread/common/thread', 'vs/workbench/api/node/extHostDocuments', './extHostTypes', 'vs/editor/common/editorCommon', 'vs/editor/common/services/codeEditorService', 'vs/workbench/services/editor/common/editorService', 'vs/editor/common/services/modelService', 'vs/workbench/api/node/mainThreadEditors', './extHostTypeConverters', 'vs/workbench/common/events', 'vs/platform/telemetry/common/telemetry', 'vs/platform/event/common/event', 'vs/base/common/arrays'], function (require, exports, event_1, lifecycle_1, winjs_base_1, thread_1, extHostDocuments_1, extHostTypes_1, editorCommon_1, codeEditorService_1, editorService_1, modelService_1, mainThreadEditors_1, TypeConverters, events_1, telemetry_1, event_2, arrays_1) {
    var ExtHostEditors = (function () {
        function ExtHostEditors(threadService) {
            this._onDidChangeTextEditorSelection = new event_1.Emitter();
            this.onDidChangeTextEditorSelection = this._onDidChangeTextEditorSelection.event;
            this._onDidChangeTextEditorOptions = new event_1.Emitter();
            this.onDidChangeTextEditorOptions = this._onDidChangeTextEditorOptions.event;
            this._modelService = threadService.getRemotable(extHostDocuments_1.ExtHostModelService);
            this._proxy = threadService.getRemotable(MainThreadEditors);
            this._onDidChangeActiveTextEditor = new event_1.Emitter();
            this._editors = Object.create(null);
            this._visibleEditorIds = [];
        }
        ExtHostEditors.prototype.getActiveTextEditor = function () {
            return this._activeEditorId && this._editors[this._activeEditorId];
        };
        ExtHostEditors.prototype.getVisibleTextEditors = function () {
            var _this = this;
            return this._visibleEditorIds.map(function (id) { return _this._editors[id]; });
        };
        Object.defineProperty(ExtHostEditors.prototype, "onDidChangeActiveTextEditor", {
            get: function () {
                return this._onDidChangeActiveTextEditor && this._onDidChangeActiveTextEditor.event;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostEditors.prototype.showTextDocument = function (document, column, preserveFocus) {
            var _this = this;
            return this._proxy._tryShowTextDocument(document.uri, TypeConverters.fromViewColumn(column), preserveFocus).then(function (id) {
                var editor = _this._editors[id];
                if (editor) {
                    return editor;
                }
                else {
                    throw new Error('Failed to create editor.');
                }
            });
        };
        ExtHostEditors.prototype.createTextEditorDecorationType = function (options) {
            return new TextEditorDecorationType(this._proxy, options);
        };
        // --- called from main thread
        ExtHostEditors.prototype._acceptTextEditorAdd = function (data) {
            var document = this._modelService.getDocumentData(data.document);
            var newEditor = new ExtHostTextEditor(this._proxy, data.id, document, data.selections.map(TypeConverters.toSelection), data.options);
            this._editors[data.id] = newEditor;
        };
        ExtHostEditors.prototype._acceptOptionsChanged = function (id, opts) {
            var editor = this._editors[id];
            editor._acceptOptions(opts);
            this._onDidChangeTextEditorOptions.fire({
                textEditor: editor,
                options: opts
            });
        };
        ExtHostEditors.prototype._acceptSelectionsChanged = function (id, _selections) {
            var selections = _selections.map(TypeConverters.toSelection);
            var editor = this._editors[id];
            editor._acceptSelections(selections);
            this._onDidChangeTextEditorSelection.fire({
                textEditor: editor,
                selections: selections
            });
        };
        ExtHostEditors.prototype._acceptActiveEditorAndVisibleEditors = function (id, visibleIds) {
            this._visibleEditorIds = visibleIds;
            if (this._activeEditorId === id) {
                // nothing to do
                return;
            }
            this._activeEditorId = id;
            this._onDidChangeActiveTextEditor.fire(this.getActiveTextEditor());
        };
        ExtHostEditors.prototype._acceptTextEditorRemove = function (id) {
            // make sure the removed editor is not visible
            var newVisibleEditors = this._visibleEditorIds.filter(function (visibleEditorId) { return visibleEditorId !== id; });
            if (this._activeEditorId === id) {
                // removing the current active editor
                this._acceptActiveEditorAndVisibleEditors(undefined, newVisibleEditors);
            }
            else {
                this._acceptActiveEditorAndVisibleEditors(this._activeEditorId, newVisibleEditors);
            }
            var editor = this._editors[id];
            editor.dispose();
            delete this._editors[id];
        };
        ExtHostEditors = __decorate([
            thread_1.Remotable.PluginHostContext('ExtHostEditors'),
            __param(0, thread_1.IThreadService)
        ], ExtHostEditors);
        return ExtHostEditors;
    })();
    exports.ExtHostEditors = ExtHostEditors;
    var TextEditorDecorationType = (function () {
        function TextEditorDecorationType(proxy, options) {
            this.key = 'TextEditorDecorationType' + (++TextEditorDecorationType.LAST_ID);
            this._proxy = proxy;
            this._proxy._registerTextEditorDecorationType(this.key, options);
        }
        TextEditorDecorationType.prototype.dispose = function () {
            this._proxy._removeTextEditorDecorationType(this.key);
        };
        TextEditorDecorationType.LAST_ID = 0;
        return TextEditorDecorationType;
    })();
    var TextEditorEdit = (function () {
        function TextEditorEdit(document) {
            this._documentVersionId = document.version;
            this._collectedEdits = [];
        }
        TextEditorEdit.prototype.finalize = function () {
            return {
                documentVersionId: this._documentVersionId,
                edits: this._collectedEdits
            };
        };
        TextEditorEdit.prototype.replace = function (location, value) {
            var range = null;
            if (location instanceof extHostTypes_1.Position) {
                range = new extHostTypes_1.Range(location, location);
            }
            else if (location instanceof extHostTypes_1.Range) {
                range = location;
            }
            else if (location instanceof extHostTypes_1.Selection) {
                range = new extHostTypes_1.Range(location.start, location.end);
            }
            else {
                throw new Error('Unrecognized location');
            }
            this._collectedEdits.push({
                range: range,
                text: value,
                forceMoveMarkers: false
            });
        };
        TextEditorEdit.prototype.insert = function (location, value) {
            this._collectedEdits.push({
                range: new extHostTypes_1.Range(location, location),
                text: value,
                forceMoveMarkers: true
            });
        };
        TextEditorEdit.prototype.delete = function (location) {
            var range = null;
            if (location instanceof extHostTypes_1.Range) {
                range = location;
            }
            else if (location instanceof extHostTypes_1.Selection) {
                range = new extHostTypes_1.Range(location.start, location.end);
            }
            else {
                throw new Error('Unrecognized location');
            }
            this._collectedEdits.push({
                range: range,
                text: null,
                forceMoveMarkers: true
            });
        };
        return TextEditorEdit;
    })();
    exports.TextEditorEdit = TextEditorEdit;
    function readonly(name, alt) {
        var message = "The property '" + name + "' is readonly.";
        if (alt) {
            message += " Use '" + alt + "' instead.";
        }
        return new Error(message);
    }
    function illegalArg(name) {
        return new Error("illgeal argument '" + name + "'");
    }
    function deprecated(name, message) {
        if (message === void 0) { message = 'Refer to the documentation for further details.'; }
        return function (target, key, descriptor) {
            var originalMethod = descriptor.value;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.warn("[Deprecation Warning] method '" + name + "' is deprecated and should no longer be used. " + message);
                return originalMethod.apply(this, args);
            };
            return descriptor;
        };
    }
    var ExtHostTextEditor = (function () {
        function ExtHostTextEditor(proxy, id, document, selections, options) {
            this._proxy = proxy;
            this._id = id;
            this._documentData = document;
            this._selections = selections;
            this._options = options;
        }
        ExtHostTextEditor.prototype.dispose = function () {
            this._documentData = null;
        };
        ExtHostTextEditor.prototype.show = function (column) {
            this._proxy._tryShowEditor(this._id, TypeConverters.fromViewColumn(column));
        };
        ExtHostTextEditor.prototype.hide = function () {
            this._proxy._tryHideEditor(this._id);
        };
        Object.defineProperty(ExtHostTextEditor.prototype, "document", {
            // ---- the document
            get: function () {
                return this._documentData.document;
            },
            set: function (value) {
                throw readonly('document');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostTextEditor.prototype, "options", {
            // ---- options
            get: function () {
                return this._options;
            },
            set: function (value) {
                var _this = this;
                this._options = value;
                this._runOnProxy(function () {
                    return _this._proxy._trySetOptions(_this._id, _this._options);
                }, true);
            },
            enumerable: true,
            configurable: true
        });
        ExtHostTextEditor.prototype._acceptOptions = function (options) {
            this._options = options;
        };
        Object.defineProperty(ExtHostTextEditor.prototype, "selection", {
            // ---- selections
            get: function () {
                return this._selections && this._selections[0];
            },
            set: function (value) {
                if (!(value instanceof extHostTypes_1.Selection)) {
                    throw illegalArg('selection');
                }
                this._selections = [value];
                this._trySetSelection(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostTextEditor.prototype, "selections", {
            get: function () {
                return this._selections;
            },
            set: function (value) {
                if (!Array.isArray(value) || value.some(function (a) { return !(a instanceof extHostTypes_1.Selection); })) {
                    throw illegalArg('selections');
                }
                this._selections = value;
                this._trySetSelection(true);
            },
            enumerable: true,
            configurable: true
        });
        ExtHostTextEditor.prototype.setDecorations = function (decorationType, ranges) {
            var _this = this;
            this._runOnProxy(function () { return _this._proxy._trySetDecorations(_this._id, decorationType.key, TypeConverters.fromRangeOrRangeWithMessage(ranges)); }, true);
        };
        ExtHostTextEditor.prototype.revealRange = function (range, revealType) {
            var _this = this;
            this._runOnProxy(function () { return _this._proxy._tryRevealRange(_this._id, TypeConverters.fromRange(range), revealType || mainThreadEditors_1.TextEditorRevealType.Default); }, true);
        };
        ExtHostTextEditor.prototype._trySetSelection = function (silent) {
            var _this = this;
            var selection = this._selections.map(TypeConverters.fromSelection);
            return this._runOnProxy(function () { return _this._proxy._trySetSelections(_this._id, selection); }, silent);
        };
        ExtHostTextEditor.prototype._acceptSelections = function (selections) {
            this._selections = selections;
        };
        // ---- editing
        ExtHostTextEditor.prototype.edit = function (callback) {
            var edit = new TextEditorEdit(this._documentData.document);
            callback(edit);
            return this._applyEdit(edit);
        };
        ExtHostTextEditor.prototype._applyEdit = function (editBuilder) {
            var editData = editBuilder.finalize();
            // prepare data for serialization
            var edits = editData.edits.map(function (edit) {
                return {
                    range: TypeConverters.fromRange(edit.range),
                    text: edit.text,
                    forceMoveMarkers: edit.forceMoveMarkers
                };
            });
            return this._proxy._tryApplyEdits(this._id, editData.documentVersionId, edits);
        };
        // ---- util
        ExtHostTextEditor.prototype._runOnProxy = function (callback, silent) {
            var _this = this;
            return callback().then(function () { return _this; }, function (err) {
                if (!silent) {
                    return winjs_base_1.TPromise.wrapError(silent);
                }
                console.warn(err);
            });
        };
        Object.defineProperty(ExtHostTextEditor.prototype, "show",
            __decorate([
                deprecated('TextEditor.show')
            ], ExtHostTextEditor.prototype, "show", Object.getOwnPropertyDescriptor(ExtHostTextEditor.prototype, "show")));
        Object.defineProperty(ExtHostTextEditor.prototype, "hide",
            __decorate([
                deprecated('TextEditor.hide')
            ], ExtHostTextEditor.prototype, "hide", Object.getOwnPropertyDescriptor(ExtHostTextEditor.prototype, "hide")));
        return ExtHostTextEditor;
    })();
    var MainThreadEditors = (function () {
        function MainThreadEditors(threadService, workbenchEditorService, telemetryService, editorService, eventService, modelService) {
            var _this = this;
            this._proxy = threadService.getRemotable(ExtHostEditors);
            this._workbenchEditorService = workbenchEditorService;
            this._telemetryService = telemetryService;
            this._toDispose = [];
            this._textEditorsListenersMap = Object.create(null);
            this._textEditorsMap = Object.create(null);
            this._activeTextEditor = null;
            this._visibleEditors = [];
            this._editorTracker = new mainThreadEditors_1.MainThreadEditorsTracker(editorService, modelService);
            this._toDispose.push(this._editorTracker);
            this._toDispose.push(this._editorTracker.onTextEditorAdd(function (textEditor) { return _this._onTextEditorAdd(textEditor); }));
            this._toDispose.push(this._editorTracker.onTextEditorRemove(function (textEditor) { return _this._onTextEditorRemove(textEditor); }));
            this._toDispose.push(this._editorTracker.onDidUpdateTextEditors(function () { return _this._updateActiveAndVisibleTextEditors(); }));
            this._toDispose.push(this._editorTracker.onChangedFocusedTextEditor(function (focusedTextEditorId) { return _this._updateActiveAndVisibleTextEditors(); }));
            this._toDispose.push(eventService.addListener2(events_1.EventType.EDITOR_INPUT_CHANGED, function () { return _this._updateActiveAndVisibleTextEditors(); }));
        }
        MainThreadEditors.prototype.dispose = function () {
            var _this = this;
            Object.keys(this._textEditorsListenersMap).forEach(function (editorId) {
                lifecycle_1.disposeAll(_this._textEditorsListenersMap[editorId]);
            });
            this._textEditorsListenersMap = Object.create(null);
            this._toDispose = lifecycle_1.disposeAll(this._toDispose);
        };
        MainThreadEditors.prototype._onTextEditorAdd = function (textEditor) {
            var _this = this;
            var id = textEditor.getId();
            var toDispose = [];
            toDispose.push(textEditor.onConfigurationChanged(function (opts) {
                _this._proxy._acceptOptionsChanged(id, opts);
            }));
            toDispose.push(textEditor.onSelectionChanged(function (selection) {
                _this._proxy._acceptSelectionsChanged(id, selection);
            }));
            this._proxy._acceptTextEditorAdd({
                id: id,
                document: textEditor.getModel().getAssociatedResource(),
                options: textEditor.getConfiguration(),
                selections: textEditor.getSelections()
            });
            this._textEditorsListenersMap[id] = toDispose;
            this._textEditorsMap[id] = textEditor;
        };
        MainThreadEditors.prototype._onTextEditorRemove = function (textEditor) {
            var id = textEditor.getId();
            lifecycle_1.disposeAll(this._textEditorsListenersMap[id]);
            delete this._textEditorsListenersMap[id];
            delete this._textEditorsMap[id];
            this._proxy._acceptTextEditorRemove(id);
        };
        MainThreadEditors.prototype._updateActiveAndVisibleTextEditors = function () {
            var visibleEditors = this._editorTracker.getVisibleTextEditorIds();
            var activeEditor = this._findActiveTextEditorId();
            if (activeEditor === this._activeTextEditor && arrays_1.equals(this._visibleEditors, visibleEditors, function (a, b) { return a === b; })) {
                // no change
                return;
            }
            this._activeTextEditor = activeEditor;
            this._visibleEditors = visibleEditors;
            this._proxy._acceptActiveEditorAndVisibleEditors(this._activeTextEditor, this._visibleEditors);
        };
        MainThreadEditors.prototype._findActiveTextEditorId = function () {
            var focusedTextEditorId = this._editorTracker.getFocusedTextEditorId();
            if (focusedTextEditorId) {
                return focusedTextEditorId;
            }
            var activeEditor = this._workbenchEditorService.getActiveEditor();
            if (!activeEditor) {
                return null;
            }
            var editor = activeEditor.getControl();
            // Substitute for (editor instanceof ICodeEditor)
            if (!editor || typeof editor.getEditorType !== 'function') {
                // Not a text editor...
                return null;
            }
            if (editor.getEditorType() === editorCommon_1.EditorType.ICodeEditor) {
                return this._editorTracker.findTextEditorIdFor(editor);
            }
            // Must be a diff editor => use the modified side
            return this._editorTracker.findTextEditorIdFor(editor.getModifiedEditor());
        };
        // --- from plugin host process
        MainThreadEditors.prototype._tryShowTextDocument = function (resource, position, preserveFocus) {
            var _this = this;
            var input = {
                resource: resource,
                options: { preserveFocus: preserveFocus }
            };
            return this._workbenchEditorService.openEditor(input, position).then(function (editor) {
                return new winjs_base_1.TPromise(function (c) {
                    // not very nice but the way it is: changes to the editor state aren't
                    // send to the ext host as they happen but stuff is delayed a little. in
                    // order to provide the real editor on #openTextEditor we need to sync on
                    // that update
                    var subscription;
                    var handle;
                    function contd() {
                        subscription.dispose();
                        clearTimeout(handle);
                        c(undefined);
                    }
                    subscription = _this._editorTracker.onDidUpdateTextEditors(function () {
                        contd();
                    });
                    handle = setTimeout(function () {
                        contd();
                    }, 100);
                }).then(function () {
                    // find the editor we have just opened and return the
                    // id we have assigned to it.
                    for (var id in _this._textEditorsMap) {
                        if (_this._textEditorsMap[id].matches(editor)) {
                            return id;
                        }
                    }
                });
            });
        };
        MainThreadEditors.prototype._tryShowEditor = function (id, position) {
            // check how often this is used
            this._telemetryService.publicLog('api.deprecated', { function: 'TextEditor.show' });
            var mainThreadEditor = this._textEditorsMap[id];
            if (mainThreadEditor) {
                var model = mainThreadEditor.getModel();
                return this._workbenchEditorService.openEditor({
                    resource: model.getAssociatedResource(),
                    options: { preserveFocus: false }
                }, position).then(function () { return; });
            }
        };
        MainThreadEditors.prototype._tryHideEditor = function (id) {
            // check how often this is used
            this._telemetryService.publicLog('api.deprecated', { function: 'TextEditor.hide' });
            var mainThreadEditor = this._textEditorsMap[id];
            if (mainThreadEditor) {
                var editors = this._workbenchEditorService.getVisibleEditors();
                for (var _i = 0; _i < editors.length; _i++) {
                    var editor = editors[_i];
                    if (mainThreadEditor.matches(editor)) {
                        return this._workbenchEditorService.closeEditor(editor).then(function () { return; });
                    }
                }
            }
        };
        MainThreadEditors.prototype._trySetSelections = function (id, selections) {
            if (!this._textEditorsMap[id]) {
                return winjs_base_1.TPromise.wrapError('TextEditor disposed');
            }
            this._textEditorsMap[id].setSelections(selections);
            return winjs_base_1.TPromise.as(null);
        };
        MainThreadEditors.prototype._trySetDecorations = function (id, key, ranges) {
            if (!this._textEditorsMap[id]) {
                return winjs_base_1.TPromise.wrapError('TextEditor disposed');
            }
            this._textEditorsMap[id].setDecorations(key, ranges);
            return winjs_base_1.TPromise.as(null);
        };
        MainThreadEditors.prototype._tryRevealRange = function (id, range, revealType) {
            if (!this._textEditorsMap[id]) {
                return winjs_base_1.TPromise.wrapError('TextEditor disposed');
            }
            this._textEditorsMap[id].revealRange(range, revealType);
        };
        MainThreadEditors.prototype._trySetOptions = function (id, options) {
            if (!this._textEditorsMap[id]) {
                return winjs_base_1.TPromise.wrapError('TextEditor disposed');
            }
            this._textEditorsMap[id].setConfiguration(options);
            return winjs_base_1.TPromise.as(null);
        };
        MainThreadEditors.prototype._tryApplyEdits = function (id, modelVersionId, edits) {
            if (!this._textEditorsMap[id]) {
                return winjs_base_1.TPromise.wrapError('TextEditor disposed');
            }
            return winjs_base_1.TPromise.as(this._textEditorsMap[id].applyEdits(modelVersionId, edits));
        };
        MainThreadEditors.prototype._registerTextEditorDecorationType = function (key, options) {
            this._editorTracker.registerTextEditorDecorationType(key, options);
        };
        MainThreadEditors.prototype._removeTextEditorDecorationType = function (key) {
            this._editorTracker.removeTextEditorDecorationType(key);
        };
        MainThreadEditors = __decorate([
            thread_1.Remotable.MainContext('MainThreadEditors'),
            __param(0, thread_1.IThreadService),
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, telemetry_1.ITelemetryService),
            __param(3, codeEditorService_1.ICodeEditorService),
            __param(4, event_2.IEventService),
            __param(5, modelService_1.IModelService)
        ], MainThreadEditors);
        return MainThreadEditors;
    })();
    exports.MainThreadEditors = MainThreadEditors;
});
//# sourceMappingURL=extHostEditors.js.map