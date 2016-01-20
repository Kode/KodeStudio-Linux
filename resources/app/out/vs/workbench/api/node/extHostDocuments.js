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
define(["require", "exports", 'vs/base/common/errors', 'vs/editor/common/services/modelService', 'vs/editor/common/editorCommon', 'vs/editor/common/model/mirrorModel2', 'vs/platform/thread/common/thread', 'vs/base/common/event', 'vs/base/common/uri', 'vs/base/common/lifecycle', 'vs/workbench/api/node/extHostTypes', 'vs/platform/event/common/event', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/parts/files/common/files', './extHostTypeConverters', 'vs/base/common/winjs.base', 'vs/editor/common/model/textModelWithTokensHelpers', 'vs/platform/files/common/files', 'vs/editor/common/services/modeService', 'vs/workbench/services/untitled/common/untitledEditorService', 'vs/workbench/common/editor/resourceEditorInput', 'vs/base/common/async', 'weak'], function (require, exports, errors_1, modelService_1, EditorCommon, mirrorModel2_1, thread_1, event_1, uri_1, lifecycle_1, extHostTypes_1, event_2, editorService_1, files_1, TypeConverters, winjs_base_1, textModelWithTokensHelpers_1, files_2, modeService_1, untitledEditorService_1, resourceEditorInput_1, async_1, weak) {
    var _modeId2WordDefinition = Object.create(null);
    function setWordDefinitionFor(modeId, wordDefinition) {
        _modeId2WordDefinition[modeId] = wordDefinition;
    }
    exports.setWordDefinitionFor = setWordDefinitionFor;
    function getWordDefinitionFor(modeId) {
        return _modeId2WordDefinition[modeId];
    }
    exports.getWordDefinitionFor = getWordDefinitionFor;
    var ExtHostModelService = (function () {
        function ExtHostModelService(threadService) {
            this._proxy = threadService.getRemotable(MainThreadDocuments);
            this._onDidAddDocumentEventEmitter = new event_1.Emitter();
            this.onDidAddDocument = this._onDidAddDocumentEventEmitter.event;
            this._onDidRemoveDocumentEventEmitter = new event_1.Emitter();
            this.onDidRemoveDocument = this._onDidRemoveDocumentEventEmitter.event;
            this._onDidChangeDocumentEventEmitter = new event_1.Emitter();
            this.onDidChangeDocument = this._onDidChangeDocumentEventEmitter.event;
            this._onDidSaveDocumentEventEmitter = new event_1.Emitter();
            this.onDidSaveDocument = this._onDidSaveDocumentEventEmitter.event;
            this._documentData = Object.create(null);
            this._documentLoader = Object.create(null);
            this._documentContentProviders = Object.create(null);
        }
        ExtHostModelService.prototype.getAllDocumentData = function () {
            var result = [];
            for (var key in this._documentData) {
                result.push(this._documentData[key]);
            }
            return result;
        };
        ExtHostModelService.prototype.getDocumentData = function (resource) {
            if (!resource) {
                return;
            }
            var data = this._documentData[resource.toString()];
            if (data) {
                return data;
            }
        };
        ExtHostModelService.prototype.ensureDocumentData = function (uri) {
            var _this = this;
            var cached = this._documentData[uri.toString()];
            if (cached) {
                return winjs_base_1.TPromise.as(cached);
            }
            var promise = this._documentLoader[uri.toString()];
            if (!promise) {
                promise = this._proxy._tryOpenDocument(uri).then(function () {
                    delete _this._documentLoader[uri.toString()];
                    return _this._documentData[uri.toString()];
                }, function (err) {
                    delete _this._documentLoader[uri.toString()];
                    return winjs_base_1.TPromise.wrapError(err);
                });
                this._documentLoader[uri.toString()] = promise;
            }
            return promise;
        };
        ExtHostModelService.prototype.registerTextDocumentContentProvider = function (scheme, provider) {
            var _this = this;
            if (scheme === 'file' || scheme === 'untitled' || this._documentContentProviders[scheme]) {
                throw new Error("scheme '" + scheme + "' already registered");
            }
            this._documentContentProviders[scheme] = provider;
            this._proxy.$registerTextContentProvider(scheme);
            var subscription;
            if (typeof provider.onDidChange === 'function') {
                subscription = provider.onDidChange(function (uri) {
                    if (_this._documentData[uri.toString()]) {
                        _this.$provideTextDocumentContent(uri).then(function (value) {
                            return _this._proxy.$onVirtualDocumentChange(uri, value);
                        }, errors_1.onUnexpectedError);
                    }
                });
            }
            return new extHostTypes_1.Disposable(function () {
                _this._proxy.$unregisterTextContentProvider(scheme);
                _this._documentContentProviders[scheme] = undefined; // keep the knowledge of that scheme
                if (subscription) {
                    subscription.dispose();
                }
            });
        };
        ExtHostModelService.prototype.$provideTextDocumentContent = function (uri) {
            var provider = this._documentContentProviders[uri.scheme];
            if (!provider) {
                return winjs_base_1.TPromise.wrapError("unsupported uri-scheme: " + uri.scheme);
            }
            return async_1.asWinJsPromise(function (token) { return provider.provideTextDocumentContent(uri, token); }).then(function (value) {
                if (typeof value !== 'string') {
                    return winjs_base_1.TPromise.wrapError('received illegal value from text document provider');
                }
                return value;
            });
        };
        ExtHostModelService.prototype.$getUnreferencedDocuments = function () {
            var result = [];
            for (var key in this._documentData) {
                var uri = uri_1.default.parse(key);
                if (this._documentContentProviders[uri.scheme] && !this._documentData[key].isDocumentReferenced) {
                    result.push(uri);
                }
            }
            return winjs_base_1.TPromise.as(result);
        };
        ExtHostModelService.prototype._acceptModelAdd = function (initData) {
            var data = new ExtHostDocumentData(this._proxy, initData.url, initData.value.lines, initData.value.EOL, initData.modeId, initData.versionId, initData.isDirty);
            var key = data.document.uri.toString();
            if (this._documentData[key]) {
                throw new Error('Document `' + key + '` already exists.');
            }
            this._documentData[key] = data;
            this._onDidAddDocumentEventEmitter.fire(data.document);
        };
        ExtHostModelService.prototype._acceptModelModeChanged = function (url, oldModeId, newModeId) {
            var data = this._documentData[url.toString()];
            // Treat a mode change as a remove + add
            this._onDidRemoveDocumentEventEmitter.fire(data.document);
            data._acceptLanguageId(newModeId);
            this._onDidAddDocumentEventEmitter.fire(data.document);
        };
        ExtHostModelService.prototype._acceptModelSaved = function (url) {
            var data = this._documentData[url.toString()];
            data._acceptIsDirty(false);
            this._onDidSaveDocumentEventEmitter.fire(data.document);
        };
        ExtHostModelService.prototype._acceptModelDirty = function (url) {
            var document = this._documentData[url.toString()];
            document._acceptIsDirty(true);
        };
        ExtHostModelService.prototype._acceptModelReverted = function (url) {
            var document = this._documentData[url.toString()];
            document._acceptIsDirty(false);
        };
        ExtHostModelService.prototype._acceptModelRemoved = function (url) {
            var key = url.toString();
            if (!this._documentData[key]) {
                throw new Error('Document `' + key + '` does not exist.');
            }
            var data = this._documentData[key];
            delete this._documentData[key];
            this._onDidRemoveDocumentEventEmitter.fire(data.document);
            data.dispose();
        };
        ExtHostModelService.prototype._acceptModelChanged = function (url, events) {
            var data = this._documentData[url.toString()];
            data.onEvents(events);
            this._onDidChangeDocumentEventEmitter.fire({
                document: data.document,
                contentChanges: events.map(function (e) {
                    return {
                        range: TypeConverters.toRange(e.range),
                        rangeLength: e.rangeLength,
                        text: e.text
                    };
                })
            });
        };
        ExtHostModelService = __decorate([
            thread_1.Remotable.PluginHostContext('ExtHostModelService'),
            __param(0, thread_1.IThreadService)
        ], ExtHostModelService);
        return ExtHostModelService;
    })();
    exports.ExtHostModelService = ExtHostModelService;
    var ExtHostDocumentData = (function (_super) {
        __extends(ExtHostDocumentData, _super);
        function ExtHostDocumentData(proxy, uri, lines, eol, languageId, versionId, isDirty) {
            _super.call(this, uri, lines, eol, versionId);
            this._proxy = proxy;
            this._languageId = languageId;
            this._isDirty = isDirty;
            this._textLines = [];
        }
        ExtHostDocumentData.prototype.dispose = function () {
            this._textLines.length = 0;
            this._isDirty = false;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(ExtHostDocumentData.prototype, "document", {
            get: function () {
                // dereferences or creates the actual document for this
                // document data. keeps a weak reference only such that
                // we later when a document isn't needed anymore
                if (!this.isDocumentReferenced) {
                    var data = this;
                    var doc = {
                        get uri() { return data._uri; },
                        get fileName() { return data._uri.fsPath; },
                        get isUntitled() { return data._uri.scheme !== 'file'; },
                        get languageId() { return data._languageId; },
                        get version() { return data._versionId; },
                        get isDirty() { return data._isDirty; },
                        save: function () { return data._proxy._trySaveDocument(data._uri); },
                        getText: function (range) { return range ? data._getTextInRange(range) : data.getText(); },
                        get lineCount() { return data._lines.length; },
                        lineAt: function (lineOrPos) { return data.lineAt(lineOrPos); },
                        offsetAt: function (pos) { return data.offsetAt(pos); },
                        positionAt: function (offset) { return data.positionAt(offset); },
                        validateRange: function (ran) { return data.validateRange(ran); },
                        validatePosition: function (pos) { return data.validatePosition(pos); },
                        getWordRangeAtPosition: function (pos) { return data.getWordRangeAtPosition(pos); }
                    };
                    this._documentRef = weak(doc);
                }
                return weak.get(this._documentRef);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostDocumentData.prototype, "isDocumentReferenced", {
            get: function () {
                return this._documentRef && !weak.isDead(this._documentRef);
            },
            enumerable: true,
            configurable: true
        });
        ExtHostDocumentData.prototype._acceptLanguageId = function (newLanguageId) {
            this._languageId = newLanguageId;
        };
        ExtHostDocumentData.prototype._acceptIsDirty = function (isDirty) {
            this._isDirty = isDirty;
        };
        ExtHostDocumentData.prototype._getTextInRange = function (_range) {
            var range = this.validateRange(_range);
            if (range.isEmpty) {
                return '';
            }
            if (range.isSingleLine) {
                return this._lines[range.start.line].substring(range.start.character, range.end.character);
            }
            var lineEnding = this._eol, startLineIndex = range.start.line, endLineIndex = range.end.line, resultLines = [];
            resultLines.push(this._lines[startLineIndex].substring(range.start.character));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._lines[i]);
            }
            resultLines.push(this._lines[endLineIndex].substring(0, range.end.character));
            return resultLines.join(lineEnding);
        };
        ExtHostDocumentData.prototype.lineAt = function (lineOrPosition) {
            var line;
            if (lineOrPosition instanceof extHostTypes_1.Position) {
                line = lineOrPosition.line;
            }
            else if (typeof lineOrPosition === 'number') {
                line = lineOrPosition;
            }
            if (line < 0 || line >= this._lines.length) {
                throw new Error('Illegal value ' + line + ' for `line`');
            }
            var result = this._textLines[line];
            if (!result || result.lineNumber !== line || result.text !== this._lines[line]) {
                var text = this._lines[line];
                var firstNonWhitespaceCharacterIndex = /^(\s*)/.exec(text)[1].length;
                var range = new extHostTypes_1.Range(line, 0, line, text.length);
                var rangeIncludingLineBreak = new extHostTypes_1.Range(line, 0, line + 1, 0);
                result = Object.freeze({
                    lineNumber: line,
                    range: range,
                    rangeIncludingLineBreak: rangeIncludingLineBreak,
                    text: text,
                    firstNonWhitespaceCharacterIndex: firstNonWhitespaceCharacterIndex,
                    isEmptyOrWhitespace: firstNonWhitespaceCharacterIndex === text.length
                });
                this._textLines[line] = result;
            }
            return result;
        };
        ExtHostDocumentData.prototype.offsetAt = function (position) {
            position = this.validatePosition(position);
            this._ensureLineStarts();
            return this._lineStarts.getAccumulatedValue(position.line - 1) + position.character;
        };
        ExtHostDocumentData.prototype.positionAt = function (offset) {
            offset = Math.floor(offset);
            offset = Math.max(0, offset);
            this._ensureLineStarts();
            var out = { index: 0, remainder: 0 };
            this._lineStarts.getIndexOf(offset, out);
            var lineLength = this._lines[out.index].length;
            // Ensure we return a valid position
            return new extHostTypes_1.Position(out.index, Math.min(out.remainder, lineLength));
        };
        // ---- range math
        ExtHostDocumentData.prototype.validateRange = function (range) {
            if (!(range instanceof extHostTypes_1.Range)) {
                throw new Error('Invalid argument');
            }
            var start = this.validatePosition(range.start);
            var end = this.validatePosition(range.end);
            if (start === range.start && end === range.end) {
                return range;
            }
            return new extHostTypes_1.Range(start.line, start.character, end.line, end.character);
        };
        ExtHostDocumentData.prototype.validatePosition = function (position) {
            if (!(position instanceof extHostTypes_1.Position)) {
                throw new Error('Invalid argument');
            }
            var line = position.line, character = position.character;
            var hasChanged = false;
            if (line < 0) {
                line = 0;
                hasChanged = true;
            }
            if (line >= this._lines.length) {
                line = this._lines.length - 1;
                hasChanged = true;
            }
            if (character < 0) {
                character = 0;
                hasChanged = true;
            }
            var maxCharacter = this._lines[line].length;
            if (character > maxCharacter) {
                character = maxCharacter;
                hasChanged = true;
            }
            if (!hasChanged) {
                return position;
            }
            return new extHostTypes_1.Position(line, character);
        };
        ExtHostDocumentData.prototype.getWordRangeAtPosition = function (_position) {
            var position = this.validatePosition(_position);
            var wordAtText = textModelWithTokensHelpers_1.WordHelper._getWordAtText(position.character + 1, textModelWithTokensHelpers_1.WordHelper.ensureValidWordDefinition(getWordDefinitionFor(this._languageId)), this._lines[position.line], 0);
            if (wordAtText) {
                return new extHostTypes_1.Range(position.line, wordAtText.startColumn - 1, position.line, wordAtText.endColumn - 1);
            }
        };
        return ExtHostDocumentData;
    })(mirrorModel2_1.MirrorModel2);
    exports.ExtHostDocumentData = ExtHostDocumentData;
    var MainThreadDocuments = (function () {
        function MainThreadDocuments(threadService, modelService, modeService, eventService, textFileService, editorService, fileService, untitledEditorService) {
            var _this = this;
            this._modelService = modelService;
            this._modeService = modeService;
            this._textFileService = textFileService;
            this._editorService = editorService;
            this._fileService = fileService;
            this._untitledEditorService = untitledEditorService;
            this._proxy = threadService.getRemotable(ExtHostModelService);
            this._modelIsSynced = {};
            this._toDispose = [];
            modelService.onModelAdded(this._onModelAdded, this, this._toDispose);
            modelService.onModelRemoved(this._onModelRemoved, this, this._toDispose);
            modelService.onModelModeChanged(this._onModelModeChanged, this, this._toDispose);
            this._toDispose.push(eventService.addListener2(files_1.EventType.FILE_SAVED, function (e) {
                _this._proxy._acceptModelSaved(e.getAfter().resource);
            }));
            this._toDispose.push(eventService.addListener2(files_1.EventType.FILE_REVERTED, function (e) {
                _this._proxy._acceptModelReverted(e.getAfter().resource);
            }));
            this._toDispose.push(eventService.addListener2(files_1.EventType.FILE_DIRTY, function (e) {
                _this._proxy._acceptModelDirty(e.getAfter().resource);
            }));
            var handle = setInterval(function () { return _this._runDocumentCleanup(); }, 30 * 1000);
            this._toDispose.push({ dispose: function () { clearInterval(handle); } });
            this._modelToDisposeMap = Object.create(null);
            this._resourceContentProvider = Object.create(null);
        }
        MainThreadDocuments.prototype.dispose = function () {
            var _this = this;
            Object.keys(this._modelToDisposeMap).forEach(function (modelUrl) {
                _this._modelToDisposeMap[modelUrl].dispose();
            });
            this._modelToDisposeMap = Object.create(null);
            this._toDispose = lifecycle_1.disposeAll(this._toDispose);
        };
        MainThreadDocuments.prototype._onModelAdded = function (model) {
            var _this = this;
            // Same filter as in mainThreadEditors
            if (model.isTooLargeForHavingARichMode()) {
                // don't synchronize too large models
                return null;
            }
            var modelUrl = model.getAssociatedResource();
            this._modelIsSynced[modelUrl.toString()] = true;
            this._modelToDisposeMap[modelUrl.toString()] = model.addBulkListener2(function (events) { return _this._onModelEvents(modelUrl, events); });
            this._proxy._acceptModelAdd({
                url: model.getAssociatedResource(),
                versionId: model.getVersionId(),
                value: model.toRawText(),
                modeId: model.getMode().getId(),
                isDirty: this._textFileService.isDirty(modelUrl)
            });
        };
        MainThreadDocuments.prototype._onModelModeChanged = function (event) {
            var model = event.model, oldModeId = event.oldModeId;
            var modelUrl = model.getAssociatedResource();
            if (!this._modelIsSynced[modelUrl.toString()]) {
                return;
            }
            this._proxy._acceptModelModeChanged(model.getAssociatedResource(), oldModeId, model.getMode().getId());
        };
        MainThreadDocuments.prototype._onModelRemoved = function (model) {
            var modelUrl = model.getAssociatedResource();
            if (!this._modelIsSynced[modelUrl.toString()]) {
                return;
            }
            delete this._modelIsSynced[modelUrl.toString()];
            this._modelToDisposeMap[modelUrl.toString()].dispose();
            delete this._modelToDisposeMap[modelUrl.toString()];
            this._proxy._acceptModelRemoved(modelUrl);
        };
        MainThreadDocuments.prototype._onModelEvents = function (modelUrl, events) {
            var changedEvents = [];
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                switch (e.getType()) {
                    case EditorCommon.EventType.ModelContentChanged2:
                        changedEvents.push(e.getData());
                        break;
                }
            }
            if (changedEvents.length > 0) {
                this._proxy._acceptModelChanged(modelUrl, changedEvents);
            }
        };
        // --- from plugin host process
        MainThreadDocuments.prototype._trySaveDocument = function (uri) {
            return this._textFileService.save(uri);
        };
        MainThreadDocuments.prototype._tryOpenDocument = function (uri) {
            if (!uri.scheme || !uri.fsPath) {
                return winjs_base_1.TPromise.wrapError('Uri must have scheme and path. One or both are missing in: ' + uri.toString());
            }
            var promise;
            switch (uri.scheme) {
                case 'untitled':
                    promise = this._handleUnititledScheme(uri);
                    break;
                case 'file':
                default:
                    promise = this._handleAsResourceInput(uri);
                    break;
            }
            return promise.then(function (success) {
                if (!success) {
                    return winjs_base_1.TPromise.wrapError('cannot open ' + uri.toString());
                }
            }, function (err) {
                return winjs_base_1.TPromise.wrapError('cannot open ' + uri.toString() + '. Detail: ' + errors_1.toErrorMessage(err));
            });
        };
        MainThreadDocuments.prototype._handleAsResourceInput = function (uri) {
            return this._editorService.resolveEditorModel({ resource: uri }).then(function (model) {
                return !!model;
            });
        };
        MainThreadDocuments.prototype._handleUnititledScheme = function (uri) {
            var _this = this;
            var asFileUri = uri_1.default.file(uri.fsPath);
            return this._fileService.resolveFile(asFileUri).then(function (stats) {
                // don't create a new file ontop of an existing file
                return winjs_base_1.TPromise.wrapError('file already exists on disk');
            }, function (err) {
                var input = _this._untitledEditorService.createOrGet(asFileUri); // using file-uri makes it show in 'Working Files' section
                return input.resolve(true).then(function (model) {
                    if (input.getResource().toString() !== uri.toString()) {
                        throw new Error("expected URI " + uri.toString() + " BUT GOT " + input.getResource().toString());
                    }
                    return _this._proxy._acceptModelDirty(uri); // mark as dirty
                }).then(function () {
                    return true;
                });
            });
        };
        // --- virtual document logic
        MainThreadDocuments.prototype.$registerTextContentProvider = function (scheme) {
            var _this = this;
            this._resourceContentProvider[scheme] = resourceEditorInput_1.ResourceEditorInput.registerResourceContentProvider(scheme, {
                provideTextContent: function (uri) {
                    return _this._proxy.$provideTextDocumentContent(uri).then(function (value) {
                        var firstLineText = value.substr(0, 1 + value.search(/\r?\n/));
                        var mode = _this._modeService.getOrCreateModeByFilenameOrFirstLine(uri.fsPath, firstLineText);
                        return _this._modelService.createModel(value, mode, uri);
                    });
                }
            });
        };
        MainThreadDocuments.prototype.$unregisterTextContentProvider = function (scheme) {
            var registration = this._resourceContentProvider[scheme];
            if (registration) {
                registration.dispose();
            }
        };
        MainThreadDocuments.prototype.$onVirtualDocumentChange = function (uri, value) {
            var model = this._modelService.getModel(uri);
            if (model) {
                model.setValue(value);
            }
        };
        MainThreadDocuments.prototype._runDocumentCleanup = function () {
            var _this = this;
            this._proxy.$getUnreferencedDocuments().then(function (resources) {
                var toBeDisposed = [];
                var promises = resources.map(function (resource) {
                    return _this._editorService.inputToType({ resource: resource }).then(function (input) {
                        if (!_this._editorService.isVisible(input, true)) {
                            toBeDisposed.push(resource);
                        }
                    });
                });
                return winjs_base_1.TPromise.join(promises).then(function () {
                    for (var _i = 0; _i < toBeDisposed.length; _i++) {
                        var resource = toBeDisposed[_i];
                        _this._modelService.destroyModel(resource);
                    }
                });
            }, errors_1.onUnexpectedError);
        };
        MainThreadDocuments = __decorate([
            thread_1.Remotable.MainContext('MainThreadDocuments'),
            __param(0, thread_1.IThreadService),
            __param(1, modelService_1.IModelService),
            __param(2, modeService_1.IModeService),
            __param(3, event_2.IEventService),
            __param(4, files_1.ITextFileService),
            __param(5, editorService_1.IWorkbenchEditorService),
            __param(6, files_2.IFileService),
            __param(7, untitledEditorService_1.IUntitledEditorService)
        ], MainThreadDocuments);
        return MainThreadDocuments;
    })();
    exports.MainThreadDocuments = MainThreadDocuments;
});
//# sourceMappingURL=extHostDocuments.js.map