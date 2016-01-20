/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/editorCommon', 'vs/base/common/event', 'vs/base/common/lifecycle', 'vs/base/common/async', 'vs/editor/common/core/range', 'vs/editor/common/core/selection'], function (require, exports, EditorCommon, event_1, lifecycle_1, async_1, range_1, selection_1) {
    function configurationsEqual(a, b) {
        if (a && !b || !a && b) {
            return false;
        }
        if (!a && !b) {
            return true;
        }
        return (a.tabSize === b.tabSize
            && a.insertSpaces === b.insertSpaces);
    }
    (function (TextEditorRevealType) {
        TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
        TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
        TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    })(exports.TextEditorRevealType || (exports.TextEditorRevealType = {}));
    var TextEditorRevealType = exports.TextEditorRevealType;
    /**
     * Text Editor that is permanently bound to the same model.
     * It can be bound or not to a CodeEditor.
     */
    var MainThreadTextEditor = (function () {
        function MainThreadTextEditor(id, model, codeEditor, focusTracker) {
            this._id = id;
            this._model = model;
            this._codeEditor = null;
            this._focusTracker = focusTracker;
            this._codeEditorListeners = [];
            this._onSelectionChanged = new event_1.Emitter();
            this._onConfigurationChanged = new event_1.Emitter();
            this._lastSelection = [new selection_1.Selection(1, 1, 1, 1)];
            this._lastConfiguration = {
                insertSpaces: false,
                tabSize: 4
            };
            this.setCodeEditor(codeEditor);
        }
        MainThreadTextEditor.prototype.dispose = function () {
            this._model = null;
            this._codeEditor = null;
            this._codeEditorListeners = lifecycle_1.disposeAll(this._codeEditorListeners);
        };
        MainThreadTextEditor.prototype.getId = function () {
            return this._id;
        };
        MainThreadTextEditor.prototype.getModel = function () {
            return this._model;
        };
        MainThreadTextEditor.prototype.hasCodeEditor = function (codeEditor) {
            return (this._codeEditor === codeEditor);
        };
        MainThreadTextEditor.prototype.setCodeEditor = function (codeEditor) {
            var _this = this;
            if (this.hasCodeEditor(codeEditor)) {
                // Nothing to do...
                return;
            }
            this._codeEditorListeners = lifecycle_1.disposeAll(this._codeEditorListeners);
            this._codeEditor = codeEditor;
            if (this._codeEditor) {
                var forwardSelection = function () {
                    _this._lastSelection = _this._codeEditor.getSelections();
                    _this._onSelectionChanged.fire(_this._lastSelection);
                };
                this._codeEditorListeners.push(this._codeEditor.addListener2(EditorCommon.EventType.CursorSelectionChanged, forwardSelection));
                if (!selection_1.Selection.selectionsArrEqual(this._lastSelection, this._codeEditor.getSelections())) {
                    forwardSelection();
                }
                var forwardConfiguration = function () {
                    _this._lastConfiguration = MainThreadTextEditor._readConfiguration(_this._codeEditor);
                    _this._onConfigurationChanged.fire(_this._lastConfiguration);
                };
                this._codeEditorListeners.push(this._codeEditor.addListener2(EditorCommon.EventType.ConfigurationChanged, forwardConfiguration));
                if (!configurationsEqual(this._lastConfiguration, MainThreadTextEditor._readConfiguration(this._codeEditor))) {
                    forwardConfiguration();
                }
                this._codeEditorListeners.push(this._codeEditor.addListener2(EditorCommon.EventType.EditorFocus, function () {
                    _this._focusTracker.onGainedFocus();
                }));
                this._codeEditorListeners.push(this._codeEditor.addListener2(EditorCommon.EventType.EditorBlur, function () {
                    _this._focusTracker.onLostFocus();
                }));
            }
        };
        MainThreadTextEditor.prototype.isVisible = function () {
            return !!this._codeEditor;
        };
        Object.defineProperty(MainThreadTextEditor.prototype, "onSelectionChanged", {
            get: function () {
                return this._onSelectionChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadTextEditor.prototype, "onConfigurationChanged", {
            get: function () {
                return this._onConfigurationChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        MainThreadTextEditor.prototype.getSelections = function () {
            if (this._codeEditor) {
                return this._codeEditor.getSelections();
            }
            return this._lastSelection;
        };
        MainThreadTextEditor.prototype.setSelections = function (selections) {
            if (this._codeEditor) {
                this._codeEditor.setSelections(selections);
                return;
            }
            this._lastSelection = selections.map(selection_1.Selection.liftSelection);
            console.warn('setSelections on invisble editor');
        };
        MainThreadTextEditor.prototype.getConfiguration = function () {
            if (this._codeEditor) {
                return MainThreadTextEditor._readConfiguration(this._codeEditor);
            }
            return this._lastConfiguration;
        };
        MainThreadTextEditor.prototype.setConfiguration = function (newConfiguration) {
            if (this._codeEditor) {
                this._codeEditor.updateOptions(newConfiguration);
                return;
            }
            this._lastConfiguration.tabSize = typeof newConfiguration.tabSize !== 'undefined' ? newConfiguration.tabSize : this._lastConfiguration.tabSize;
            this._lastConfiguration.insertSpaces = typeof newConfiguration.insertSpaces !== 'undefined' ? newConfiguration.insertSpaces : this._lastConfiguration.insertSpaces;
            console.warn('setConfiguration on invisible editor');
        };
        MainThreadTextEditor.prototype.setDecorations = function (key, ranges) {
            if (!this._codeEditor) {
                console.warn('setDecorations on invisible editor');
                return;
            }
            this._codeEditor.setDecorations(key, ranges);
        };
        MainThreadTextEditor.prototype.revealRange = function (range, revealType) {
            if (!this._codeEditor) {
                console.warn('revealRange on invisible editor');
                return;
            }
            if (revealType === TextEditorRevealType.Default) {
                this._codeEditor.revealRange(range);
            }
            else if (revealType === TextEditorRevealType.InCenter) {
                this._codeEditor.revealRangeInCenter(range);
            }
            else if (revealType === TextEditorRevealType.InCenterIfOutsideViewport) {
                this._codeEditor.revealRangeInCenterIfOutsideViewport(range);
            }
            else {
                console.warn('Unknown revealType');
            }
        };
        MainThreadTextEditor._readConfiguration = function (codeEditor) {
            var indent = codeEditor.getIndentationOptions();
            return {
                insertSpaces: indent.insertSpaces,
                tabSize: indent.tabSize
            };
        };
        MainThreadTextEditor.prototype.isFocused = function () {
            if (this._codeEditor) {
                return this._codeEditor.isFocused();
            }
            return false;
        };
        MainThreadTextEditor.prototype.matches = function (editor) {
            return editor.getControl() === this._codeEditor;
        };
        MainThreadTextEditor.prototype.applyEdits = function (versionIdCheck, edits) {
            if (this._model.getVersionId() !== versionIdCheck) {
                console.warn('Model has changed in the meantime!');
                // throw new Error('Model has changed in the meantime!');
                // model changed in the meantime
                return false;
            }
            if (this._codeEditor) {
                var transformedEdits = edits.map(function (edit) {
                    return {
                        identifier: null,
                        range: range_1.Range.lift(edit.range),
                        text: edit.text,
                        forceMoveMarkers: edit.forceMoveMarkers
                    };
                });
                return this._codeEditor.executeEdits('MainThreadTextEditor', transformedEdits) || true;
            }
            console.warn('applyEdits on invisible editor');
            return false;
        };
        return MainThreadTextEditor;
    })();
    exports.MainThreadTextEditor = MainThreadTextEditor;
    /**
     * Keeps track of what goes on in the main thread and maps models => text editors
     */
    var MainThreadEditorsTracker = (function () {
        function MainThreadEditorsTracker(editorService, modelService) {
            var _this = this;
            this._codeEditorService = editorService;
            this._modelService = modelService;
            this._toDispose = [];
            this._focusedTextEditorId = null;
            this._visibleTextEditorIds = [];
            this._editorModelChangeListeners = Object.create(null);
            this._model2TextEditors = Object.create(null);
            this._onTextEditorAdd = new event_1.Emitter();
            this._onTextEditorRemove = new event_1.Emitter();
            this._onDidUpdateTextEditors = new event_1.Emitter();
            this._onDidChangeFocusedTextEditor = new event_1.Emitter();
            this._focusTracker = {
                onGainedFocus: function () { return _this._updateFocusedTextEditor(); },
                onLostFocus: function () { return _this._updateFocusedTextEditor(); }
            };
            this._modelService.onModelAdded(this._onModelAdded, this, this._toDispose);
            this._modelService.onModelRemoved(this._onModelRemoved, this, this._toDispose);
            this._codeEditorService.onCodeEditorAdd(this._onCodeEditorAdd, this, this._toDispose);
            this._codeEditorService.onCodeEditorRemove(this._onCodeEditorRemove, this, this._toDispose);
            this._updateMapping = new async_1.RunOnceScheduler(function () { return _this._doUpdateMapping(); }, 0);
            this._toDispose.push(this._updateMapping);
        }
        MainThreadEditorsTracker.prototype._nextId = function () {
            return String(++MainThreadEditorsTracker._LAST_TEXT_EDITOR_ID);
        };
        MainThreadEditorsTracker.prototype.dispose = function () {
            this._toDispose = lifecycle_1.disposeAll(this._toDispose);
        };
        MainThreadEditorsTracker.prototype._onModelAdded = function (model) {
            this._updateMapping.schedule();
        };
        MainThreadEditorsTracker.prototype._onModelRemoved = function (model) {
            this._updateMapping.schedule();
        };
        MainThreadEditorsTracker.prototype._onCodeEditorAdd = function (codeEditor) {
            var _this = this;
            this._editorModelChangeListeners[codeEditor.getId()] = codeEditor.addListener2(EditorCommon.EventType.ModelChanged, function (_) { return _this._updateMapping.schedule(); });
            this._updateMapping.schedule();
        };
        MainThreadEditorsTracker.prototype._onCodeEditorRemove = function (codeEditor) {
            this._editorModelChangeListeners[codeEditor.getId()].dispose();
            delete this._editorModelChangeListeners[codeEditor.getId()];
            this._updateMapping.schedule();
        };
        MainThreadEditorsTracker.prototype._doUpdateMapping = function () {
            var _this = this;
            var allModels = this._modelService.getModels();
            // Same filter as in pluginHostDocuments
            allModels.filter(function (model) { return !model.isTooLargeForHavingARichMode(); });
            var allModelsMap = Object.create(null);
            allModels.forEach(function (model) {
                allModelsMap[model.getAssociatedResource().toString()] = model;
            });
            // Remove text editors for models that no longer exist
            Object.keys(this._model2TextEditors).forEach(function (modelUri) {
                if (allModelsMap[modelUri]) {
                    // model still exists, will be updated below
                    return;
                }
                var textEditorsToRemove = _this._model2TextEditors[modelUri];
                delete _this._model2TextEditors[modelUri];
                for (var i = 0; i < textEditorsToRemove.length; i++) {
                    _this._onTextEditorRemove.fire(textEditorsToRemove[i]);
                    textEditorsToRemove[i].dispose();
                }
            });
            // Handle all visible models
            var visibleModels = this._getVisibleModels();
            Object.keys(visibleModels).forEach(function (modelUri) {
                var model = visibleModels[modelUri].model;
                var codeEditors = visibleModels[modelUri].codeEditors;
                if (!_this._model2TextEditors[modelUri]) {
                    _this._model2TextEditors[modelUri] = [];
                }
                var existingTextEditors = _this._model2TextEditors[modelUri];
                // Remove text editors if more exist
                while (existingTextEditors.length > codeEditors.length) {
                    var removedTextEditor = existingTextEditors.pop();
                    _this._onTextEditorRemove.fire(removedTextEditor);
                    removedTextEditor.dispose();
                }
                // Adjust remaining text editors
                for (var i = 0; i < existingTextEditors.length; i++) {
                    existingTextEditors[i].setCodeEditor(codeEditors[i]);
                }
                // Create new editors as needed
                for (var i = existingTextEditors.length; i < codeEditors.length; i++) {
                    var newTextEditor = new MainThreadTextEditor(_this._nextId(), model, codeEditors[i], _this._focusTracker);
                    existingTextEditors.push(newTextEditor);
                    _this._onTextEditorAdd.fire(newTextEditor);
                }
            });
            // Handle all not visible models
            allModels.forEach(function (model) {
                var modelUri = model.getAssociatedResource().toString();
                if (visibleModels[modelUri]) {
                    // model is visible, already handled above
                    return;
                }
                if (!_this._model2TextEditors[modelUri]) {
                    _this._model2TextEditors[modelUri] = [];
                }
                var existingTextEditors = _this._model2TextEditors[modelUri];
                // Remove extra text editors
                while (existingTextEditors.length > 1) {
                    var removedTextEditor = existingTextEditors.pop();
                    _this._onTextEditorRemove.fire(removedTextEditor);
                    removedTextEditor.dispose();
                }
                // Create new editor if needed or adjust it
                if (existingTextEditors.length === 0) {
                    var newTextEditor = new MainThreadTextEditor(_this._nextId(), model, null, _this._focusTracker);
                    existingTextEditors.push(newTextEditor);
                    _this._onTextEditorAdd.fire(newTextEditor);
                }
                else {
                    existingTextEditors[0].setCodeEditor(null);
                }
            });
            this._printState();
            this._visibleTextEditorIds = this._findVisibleTextEditorIds();
            this._updateFocusedTextEditor();
            // this is a sync event
            this._onDidUpdateTextEditors.fire(undefined);
        };
        MainThreadEditorsTracker.prototype._updateFocusedTextEditor = function () {
            this._setFocusedTextEditorId(this._findFocusedTextEditorId());
        };
        MainThreadEditorsTracker.prototype._findFocusedTextEditorId = function () {
            var modelUris = Object.keys(this._model2TextEditors);
            for (var i = 0, len = modelUris.length; i < len; i++) {
                var editors = this._model2TextEditors[modelUris[i]];
                for (var j = 0, lenJ = editors.length; j < lenJ; j++) {
                    if (editors[j].isFocused()) {
                        return editors[j].getId();
                    }
                }
            }
            return null;
        };
        MainThreadEditorsTracker.prototype._findVisibleTextEditorIds = function () {
            var result = [];
            var modelUris = Object.keys(this._model2TextEditors);
            for (var i = 0, len = modelUris.length; i < len; i++) {
                var editors = this._model2TextEditors[modelUris[i]];
                for (var j = 0, lenJ = editors.length; j < lenJ; j++) {
                    if (editors[j].isVisible()) {
                        result.push(editors[j].getId());
                    }
                }
            }
            result.sort();
            return result;
        };
        MainThreadEditorsTracker.prototype._setFocusedTextEditorId = function (focusedTextEditorId) {
            if (this._focusedTextEditorId === focusedTextEditorId) {
                // no change
                return;
            }
            this._focusedTextEditorId = focusedTextEditorId;
            this._printState();
            this._onDidChangeFocusedTextEditor.fire(this._focusedTextEditorId);
        };
        MainThreadEditorsTracker.prototype._printState = function () {
            // console.log('----------------------');
            // Object.keys(this._model2TextEditors).forEach((modelUri) => {
            // 	let editors = this._model2TextEditors[modelUri];
            // 	console.log(editors.map((e) => {
            // 		return e.getId() + " (" + (e.getId() === this._focusedTextEditorId ? 'FOCUSED, ': '') + modelUri + ")";
            // 	}).join('\n'));
            // });
        };
        MainThreadEditorsTracker.prototype._getVisibleModels = function () {
            var r = {};
            var allCodeEditors = this._codeEditorService.listCodeEditors();
            // Maintain a certain sorting such that the mapping doesn't change too much all the time
            allCodeEditors.sort(function (a, b) { return strcmp(a.getId(), b.getId()); });
            allCodeEditors.forEach(function (codeEditor) {
                var model = codeEditor.getModel();
                if (!model) {
                    return;
                }
                var modelUri = model.getAssociatedResource().toString();
                r[modelUri] = r[modelUri] || {
                    model: model,
                    codeEditors: []
                };
                r[modelUri].codeEditors.push(codeEditor);
            });
            return r;
        };
        MainThreadEditorsTracker.prototype.getFocusedTextEditorId = function () {
            return this._focusedTextEditorId;
        };
        MainThreadEditorsTracker.prototype.getVisibleTextEditorIds = function () {
            return this._visibleTextEditorIds;
        };
        Object.defineProperty(MainThreadEditorsTracker.prototype, "onTextEditorAdd", {
            get: function () {
                return this._onTextEditorAdd.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadEditorsTracker.prototype, "onTextEditorRemove", {
            get: function () {
                return this._onTextEditorRemove.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadEditorsTracker.prototype, "onDidUpdateTextEditors", {
            get: function () {
                return this._onDidUpdateTextEditors.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadEditorsTracker.prototype, "onChangedFocusedTextEditor", {
            get: function () {
                return this._onDidChangeFocusedTextEditor.event;
            },
            enumerable: true,
            configurable: true
        });
        MainThreadEditorsTracker.prototype.findTextEditorIdFor = function (codeEditor) {
            var modelUris = Object.keys(this._model2TextEditors);
            for (var i = 0, len = modelUris.length; i < len; i++) {
                var editors = this._model2TextEditors[modelUris[i]];
                for (var j = 0, lenJ = editors.length; j < lenJ; j++) {
                    if (editors[j].hasCodeEditor(codeEditor)) {
                        return editors[j].getId();
                    }
                }
            }
            return null;
        };
        MainThreadEditorsTracker.prototype.registerTextEditorDecorationType = function (key, options) {
            this._codeEditorService.registerDecorationType(key, options);
        };
        MainThreadEditorsTracker.prototype.removeTextEditorDecorationType = function (key) {
            this._codeEditorService.removeDecorationType(key);
        };
        MainThreadEditorsTracker._LAST_TEXT_EDITOR_ID = 0;
        return MainThreadEditorsTracker;
    })();
    exports.MainThreadEditorsTracker = MainThreadEditorsTracker;
    function strcmp(a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }
});
//# sourceMappingURL=mainThreadEditors.js.map