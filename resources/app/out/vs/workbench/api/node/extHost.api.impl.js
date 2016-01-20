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
define(["require", "exports", 'vs/editor/common/modes/languageSelector', 'vs/platform/thread/common/thread', 'vs/base/common/errors', 'vs/workbench/api/node/extHostFileSystemEventService', 'vs/workbench/api/node/extHostDocuments', 'vs/workbench/api/node/extHostConfiguration', 'vs/workbench/api/node/extHostDiagnostics', 'vs/workbench/api/node/extHostWorkspace', 'vs/workbench/api/node/extHostQuickOpen', 'vs/workbench/api/node/extHostStatusBar', 'vs/workbench/api/node/extHostCommands', 'vs/workbench/api/node/extHostOutputService', 'vs/workbench/api/node/extHostMessageService', 'vs/workbench/api/node/extHostEditors', 'vs/workbench/api/node/extHostLanguages', 'vs/workbench/api/node/extHostLanguageFeatures', 'vs/workbench/api/node/extHostApiCommands', 'vs/workbench/api/node/extHostTypes', 'vs/editor/common/modes', 'vs/editor/common/services/modeService', 'vs/base/common/uri', 'vs/base/common/severity', 'vs/editor/common/editorCommon', 'vs/platform/plugins/common/plugins', 'vs/platform/plugins/common/pluginsRegistry', 'vs/platform/workspace/common/workspace', 'vs/base/common/cancellation', 'vs/workbench/api/node/mainThreadEditors', 'vs/base/common/paths'], function (require, exports, languageSelector_1, thread_1, errors, extHostFileSystemEventService_1, extHostDocuments_1, extHostConfiguration_1, extHostDiagnostics_1, extHostWorkspace_1, extHostQuickOpen_1, extHostStatusBar_1, extHostCommands_1, extHostOutputService_1, extHostMessageService_1, extHostEditors_1, extHostLanguages_1, extHostLanguageFeatures_1, extHostApiCommands_1, extHostTypes, Modes, modeService_1, uri_1, severity_1, EditorCommon, plugins_1, pluginsRegistry_1, workspace_1, cancellation_1, mainThreadEditors_1, paths) {
    /**
     * This class implements the API described in vscode.d.ts,
     * for the case of the extensionHost host process
     */
    var ExtHostAPIImplementation = (function () {
        function ExtHostAPIImplementation(threadService, pluginService, contextService) {
            var _this = this;
            this._pluginService = pluginService;
            this._threadService = threadService;
            this._proxy = threadService.getRemotable(MainProcessVSCodeAPIHelper);
            this.version = contextService.getConfiguration().env.version;
            this.Uri = uri_1.default;
            this.Location = extHostTypes.Location;
            this.Diagnostic = extHostTypes.Diagnostic;
            this.DiagnosticSeverity = extHostTypes.DiagnosticSeverity;
            this.Disposable = extHostTypes.Disposable;
            this.TextEdit = extHostTypes.TextEdit;
            this.WorkspaceEdit = extHostTypes.WorkspaceEdit;
            this.Position = extHostTypes.Position;
            this.Range = extHostTypes.Range;
            this.Selection = extHostTypes.Selection;
            this.CancellationTokenSource = cancellation_1.CancellationTokenSource;
            this.Hover = extHostTypes.Hover;
            this.SymbolKind = extHostTypes.SymbolKind;
            this.SymbolInformation = extHostTypes.SymbolInformation;
            this.DocumentHighlightKind = extHostTypes.DocumentHighlightKind;
            this.DocumentHighlight = extHostTypes.DocumentHighlight;
            this.CodeLens = extHostTypes.CodeLens;
            this.ParameterInformation = extHostTypes.ParameterInformation;
            this.SignatureInformation = extHostTypes.SignatureInformation;
            this.SignatureHelp = extHostTypes.SignatureHelp;
            this.CompletionItem = extHostTypes.CompletionItem;
            this.CompletionItemKind = extHostTypes.CompletionItemKind;
            this.ViewColumn = extHostTypes.ViewColumn;
            this.StatusBarAlignment = extHostTypes.StatusBarAlignment;
            this.IndentAction = Modes.IndentAction;
            this.OverviewRulerLane = EditorCommon.OverviewRulerLane;
            this.TextEditorRevealType = mainThreadEditors_1.TextEditorRevealType;
            errors.setUnexpectedErrorHandler(function (err) {
                _this._proxy.onUnexpectedPluginHostError(errors.transformErrorForSerialization(err));
            });
            var pluginHostCommands = this._threadService.getRemotable(extHostCommands_1.ExtHostCommands);
            var pluginHostEditors = this._threadService.getRemotable(extHostEditors_1.ExtHostEditors);
            var pluginHostMessageService = new extHostMessageService_1.ExtHostMessageService(this._threadService, this.commands);
            var pluginHostQuickOpen = this._threadService.getRemotable(extHostQuickOpen_1.ExtHostQuickOpen);
            var pluginHostStatusBar = new extHostStatusBar_1.ExtHostStatusBar(this._threadService);
            var extHostOutputService = new extHostOutputService_1.ExtHostOutputService(this._threadService);
            // commands namespace
            this.commands = {
                registerCommand: function (id, command, thisArgs) {
                    return pluginHostCommands.registerCommand(id, command, thisArgs);
                },
                registerTextEditorCommand: function (id, callback, thisArg) {
                    var actualCallback = thisArg ? callback.bind(thisArg) : callback;
                    return pluginHostCommands.registerCommand(id, function () {
                        var activeTextEditor = pluginHostEditors.getActiveTextEditor();
                        if (!activeTextEditor) {
                            console.warn('Cannot execute ' + id + ' because there is no active text editor.');
                            return;
                        }
                        activeTextEditor.edit(function (edit) {
                            actualCallback(activeTextEditor, edit);
                        }).then(function (result) {
                            if (!result) {
                                console.warn('Edits from command ' + id + ' were not applied.');
                            }
                        }, function (err) {
                            console.warn('An error occured while running command ' + id, err);
                        });
                    });
                },
                executeCommand: function (id) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    return pluginHostCommands.executeCommand.apply(pluginHostCommands, [id].concat(args));
                },
                getCommands: function (filterInternal) {
                    if (filterInternal === void 0) { filterInternal = false; }
                    return pluginHostCommands.getCommands(filterInternal);
                }
            };
            this.window = {
                get activeTextEditor() {
                    return pluginHostEditors.getActiveTextEditor();
                },
                get visibleTextEditors() {
                    return pluginHostEditors.getVisibleTextEditors();
                },
                showTextDocument: function (document, column, preserveFocus) {
                    return pluginHostEditors.showTextDocument(document, column, preserveFocus);
                },
                createTextEditorDecorationType: function (options) {
                    return pluginHostEditors.createTextEditorDecorationType(options);
                },
                onDidChangeActiveTextEditor: pluginHostEditors.onDidChangeActiveTextEditor.bind(pluginHostEditors),
                onDidChangeTextEditorSelection: function (listener, thisArgs, disposables) {
                    return pluginHostEditors.onDidChangeTextEditorSelection(listener, thisArgs, disposables);
                },
                onDidChangeTextEditorOptions: function (listener, thisArgs, disposables) {
                    return pluginHostEditors.onDidChangeTextEditorOptions(listener, thisArgs, disposables);
                },
                showInformationMessage: function (message) {
                    var items = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        items[_i - 1] = arguments[_i];
                    }
                    return pluginHostMessageService.showMessage(severity_1.default.Info, message, items);
                },
                showWarningMessage: function (message) {
                    var items = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        items[_i - 1] = arguments[_i];
                    }
                    return pluginHostMessageService.showMessage(severity_1.default.Warning, message, items);
                },
                showErrorMessage: function (message) {
                    var items = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        items[_i - 1] = arguments[_i];
                    }
                    return pluginHostMessageService.showMessage(severity_1.default.Error, message, items);
                },
                showQuickPick: function (items, options) {
                    return pluginHostQuickOpen.show(items, options);
                },
                showInputBox: pluginHostQuickOpen.input.bind(pluginHostQuickOpen),
                createStatusBarItem: function (position, priority) {
                    return pluginHostStatusBar.createStatusBarEntry(position, priority);
                },
                setStatusBarMessage: function (text, timeoutOrThenable) {
                    return pluginHostStatusBar.setStatusBarMessage(text, timeoutOrThenable);
                },
                createOutputChannel: function (name) {
                    return extHostOutputService.createOutputChannel(name);
                }
            };
            //
            var workspacePath = contextService.getWorkspace() ? contextService.getWorkspace().resource.fsPath : undefined;
            var pluginHostFileSystemEvent = threadService.getRemotable(extHostFileSystemEventService_1.ExtHostFileSystemEventService);
            var pluginHostWorkspace = new extHostWorkspace_1.ExtHostWorkspace(this._threadService, workspacePath);
            var pluginHostDocuments = this._threadService.getRemotable(extHostDocuments_1.ExtHostModelService);
            this.workspace = Object.freeze({
                get rootPath() {
                    return pluginHostWorkspace.getPath();
                },
                set rootPath(value) {
                    throw errors.readonly();
                },
                asRelativePath: function (pathOrUri) {
                    return pluginHostWorkspace.getRelativePath(pathOrUri);
                },
                findFiles: function (include, exclude, maxResults, token) {
                    return pluginHostWorkspace.findFiles(include, exclude, maxResults, token);
                },
                saveAll: function (includeUntitled) {
                    return pluginHostWorkspace.saveAll(includeUntitled);
                },
                applyEdit: function (edit) {
                    return pluginHostWorkspace.appyEdit(edit);
                },
                createFileSystemWatcher: function (pattern, ignoreCreate, ignoreChange, ignoreDelete) {
                    return pluginHostFileSystemEvent.createFileSystemWatcher(pattern, ignoreCreate, ignoreChange, ignoreDelete);
                },
                get textDocuments() {
                    return pluginHostDocuments.getAllDocumentData().map(function (data) { return data.document; });
                },
                set textDocuments(value) {
                    throw errors.readonly();
                },
                openTextDocument: function (uriOrFileName) {
                    var uri;
                    if (typeof uriOrFileName === 'string') {
                        uri = uri_1.default.file(uriOrFileName);
                    }
                    else if (uriOrFileName instanceof uri_1.default) {
                        uri = uriOrFileName;
                    }
                    else {
                        throw new Error('illegal argument - uriOrFileName');
                    }
                    return pluginHostDocuments.ensureDocumentData(uri).then(function () {
                        var data = pluginHostDocuments.getDocumentData(uri);
                        return data && data.document;
                    });
                },
                registerTextDocumentContentProvider: function (scheme, provider) {
                    return pluginHostDocuments.registerTextDocumentContentProvider(scheme, provider);
                },
                onDidOpenTextDocument: function (listener, thisArgs, disposables) {
                    return pluginHostDocuments.onDidAddDocument(listener, thisArgs, disposables);
                },
                onDidCloseTextDocument: function (listener, thisArgs, disposables) {
                    return pluginHostDocuments.onDidRemoveDocument(listener, thisArgs, disposables);
                },
                onDidChangeTextDocument: function (listener, thisArgs, disposables) {
                    return pluginHostDocuments.onDidChangeDocument(listener, thisArgs, disposables);
                },
                onDidSaveTextDocument: function (listener, thisArgs, disposables) {
                    return pluginHostDocuments.onDidSaveDocument(listener, thisArgs, disposables);
                },
                onDidChangeConfiguration: function (listener, thisArgs, disposables) {
                    return pluginHostConfiguration.onDidChangeConfiguration(listener, thisArgs, disposables);
                },
                getConfiguration: function (section) {
                    return pluginHostConfiguration.getConfiguration(section);
                }
            });
            //
            extHostApiCommands_1.registerApiCommands(threadService);
            //
            var languages = new extHostLanguages_1.ExtHostLanguages(this._threadService);
            var pluginHostDiagnostics = new extHostDiagnostics_1.ExtHostDiagnostics(this._threadService);
            var languageFeatures = threadService.getRemotable(extHostLanguageFeatures_1.ExtHostLanguageFeatures);
            this.languages = {
                createDiagnosticCollection: function (name) {
                    return pluginHostDiagnostics.createDiagnosticCollection(name);
                },
                getLanguages: function () {
                    return languages.getLanguages();
                },
                match: function (selector, document) {
                    return languageSelector_1.score(selector, document.uri, document.languageId);
                },
                registerCodeActionsProvider: function (selector, provider) {
                    return languageFeatures.registerCodeActionProvider(selector, provider);
                },
                registerCodeLensProvider: function (selector, provider) {
                    return languageFeatures.registerCodeLensProvider(selector, provider);
                },
                registerDefinitionProvider: function (selector, provider) {
                    return languageFeatures.registerDefinitionProvider(selector, provider);
                },
                registerHoverProvider: function (selector, provider) {
                    return languageFeatures.registerHoverProvider(selector, provider);
                },
                registerDocumentHighlightProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentHighlightProvider(selector, provider);
                },
                registerReferenceProvider: function (selector, provider) {
                    return languageFeatures.registerReferenceProvider(selector, provider);
                },
                registerRenameProvider: function (selector, provider) {
                    return languageFeatures.registerRenameProvider(selector, provider);
                },
                registerDocumentSymbolProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentSymbolProvider(selector, provider);
                },
                registerWorkspaceSymbolProvider: function (provider) {
                    return languageFeatures.registerWorkspaceSymbolProvider(provider);
                },
                registerDocumentFormattingEditProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentFormattingEditProvider(selector, provider);
                },
                registerDocumentRangeFormattingEditProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentRangeFormattingEditProvider(selector, provider);
                },
                registerOnTypeFormattingEditProvider: function (selector, provider, firstTriggerCharacter) {
                    var moreTriggerCharacters = [];
                    for (var _i = 3; _i < arguments.length; _i++) {
                        moreTriggerCharacters[_i - 3] = arguments[_i];
                    }
                    return languageFeatures.registerOnTypeFormattingEditProvider(selector, provider, [firstTriggerCharacter].concat(moreTriggerCharacters));
                },
                registerSignatureHelpProvider: function (selector, provider) {
                    var triggerCharacters = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        triggerCharacters[_i - 2] = arguments[_i];
                    }
                    return languageFeatures.registerSignatureHelpProvider(selector, provider, triggerCharacters);
                },
                registerCompletionItemProvider: function (selector, provider) {
                    var triggerCharacters = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        triggerCharacters[_i - 2] = arguments[_i];
                    }
                    return languageFeatures.registerCompletionItemProvider(selector, provider, triggerCharacters);
                },
                setLanguageConfiguration: function (language, configuration) {
                    return _this._setLanguageConfiguration(language, configuration);
                }
            };
            var pluginHostConfiguration = threadService.getRemotable(extHostConfiguration_1.ExtHostConfiguration);
            //
            this.extensions = {
                getExtension: function (extensionId) {
                    var desc = pluginsRegistry_1.PluginsRegistry.getPluginDescription(extensionId);
                    if (desc) {
                        return new Extension(pluginService, desc);
                    }
                },
                get all() {
                    return pluginsRegistry_1.PluginsRegistry.getAllPluginDescriptions().map(function (desc) { return new Extension(pluginService, desc); });
                }
            };
            // Intentionally calling a function for typechecking purposes
            defineAPI(this);
        }
        ExtHostAPIImplementation.generateDisposeToken = function () {
            return String(++ExtHostAPIImplementation._LAST_REGISTER_TOKEN);
        };
        ExtHostAPIImplementation.prototype._disposableFromToken = function (disposeToken) {
            var _this = this;
            return new extHostTypes.Disposable(function () { return _this._proxy.disposeByToken(disposeToken); });
        };
        ExtHostAPIImplementation.prototype._setLanguageConfiguration = function (modeId, configuration) {
            var disposables = [];
            var comments = configuration.comments, wordPattern = configuration.wordPattern;
            // comment configuration
            if (comments) {
                var contrib = { commentsConfiguration: {} };
                if (comments.lineComment) {
                    contrib.commentsConfiguration.lineCommentTokens = [comments.lineComment];
                }
                if (comments.blockComment) {
                    var _a = comments.blockComment, blockStart = _a[0], blockEnd = _a[1];
                    contrib.commentsConfiguration.blockCommentStartToken = blockStart;
                    contrib.commentsConfiguration.blockCommentEndToken = blockEnd;
                }
                var d = this.Modes_CommentsSupport_register(modeId, contrib);
                disposables.push(d);
            }
            // word definition
            if (wordPattern) {
                extHostDocuments_1.setWordDefinitionFor(modeId, wordPattern);
                var d = this.Modes_TokenTypeClassificationSupport_register(modeId, {
                    wordDefinition: wordPattern
                });
                disposables.push(d);
            }
            else {
                extHostDocuments_1.setWordDefinitionFor(modeId, null);
            }
            // on enter
            var onEnter = {};
            var empty = true;
            var brackets = configuration.brackets, indentationRules = configuration.indentationRules, onEnterRules = configuration.onEnterRules;
            if (brackets) {
                empty = false;
                onEnter.brackets = brackets.map(function (pair) {
                    var open = pair[0], close = pair[1];
                    return { open: open, close: close };
                });
            }
            if (indentationRules) {
                empty = false;
                onEnter.indentationRules = indentationRules;
            }
            if (onEnterRules) {
                empty = false;
                onEnter.regExpRules = onEnterRules;
            }
            if (!empty) {
                var d = this.Modes_OnEnterSupport_register(modeId, onEnter);
                disposables.push(d);
            }
            if (configuration.__electricCharacterSupport) {
                disposables.push(this.Modes_ElectricCharacterSupport_register(modeId, configuration.__electricCharacterSupport));
            }
            if (configuration.__characterPairSupport) {
                disposables.push(this.Modes_CharacterPairSupport_register(modeId, configuration.__characterPairSupport));
            }
            return (_b = extHostTypes.Disposable).from.apply(_b, disposables);
            var _b;
        };
        ExtHostAPIImplementation.prototype.Modes_CommentsSupport_register = function (modeId, commentsSupport) {
            var disposeToken = ExtHostAPIImplementation.generateDisposeToken();
            this._proxy.Modes_CommentsSupport_register(disposeToken, modeId, commentsSupport);
            return this._disposableFromToken(disposeToken);
        };
        ExtHostAPIImplementation.prototype.Modes_TokenTypeClassificationSupport_register = function (modeId, tokenTypeClassificationSupport) {
            var disposeToken = ExtHostAPIImplementation.generateDisposeToken();
            this._proxy.Modes_TokenTypeClassificationSupport_register(disposeToken, modeId, tokenTypeClassificationSupport);
            return this._disposableFromToken(disposeToken);
        };
        ExtHostAPIImplementation.prototype.Modes_ElectricCharacterSupport_register = function (modeId, electricCharacterSupport) {
            var disposeToken = ExtHostAPIImplementation.generateDisposeToken();
            this._proxy.Modes_ElectricCharacterSupport_register(disposeToken, modeId, electricCharacterSupport);
            return this._disposableFromToken(disposeToken);
        };
        ExtHostAPIImplementation.prototype.Modes_CharacterPairSupport_register = function (modeId, characterPairSupport) {
            var disposeToken = ExtHostAPIImplementation.generateDisposeToken();
            this._proxy.Modes_CharacterPairSupport_register(disposeToken, modeId, characterPairSupport);
            return this._disposableFromToken(disposeToken);
        };
        ExtHostAPIImplementation.prototype.Modes_OnEnterSupport_register = function (modeId, opts) {
            var disposeToken = ExtHostAPIImplementation.generateDisposeToken();
            this._proxy.Modes_OnEnterSupport_register(disposeToken, modeId, opts);
            return this._disposableFromToken(disposeToken);
        };
        ExtHostAPIImplementation._LAST_REGISTER_TOKEN = 0;
        ExtHostAPIImplementation = __decorate([
            __param(0, thread_1.IThreadService),
            __param(1, plugins_1.IPluginService),
            __param(2, workspace_1.IWorkspaceContextService)
        ], ExtHostAPIImplementation);
        return ExtHostAPIImplementation;
    })();
    exports.ExtHostAPIImplementation = ExtHostAPIImplementation;
    var Extension = (function () {
        function Extension(pluginService, description) {
            this._pluginService = pluginService;
            this.id = description.id;
            this.extensionPath = paths.normalize(description.extensionFolderPath, true);
            this.packageJSON = description;
        }
        Object.defineProperty(Extension.prototype, "isActive", {
            get: function () {
                return this._pluginService.isActivated(this.id);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "exports", {
            get: function () {
                return this._pluginService.get(this.id);
            },
            enumerable: true,
            configurable: true
        });
        Extension.prototype.activate = function () {
            return this._pluginService.activateAndGet(this.id);
        };
        return Extension;
    })();
    function defineAPI(impl) {
        var node_module = require.__$__nodeRequire('module');
        var original = node_module._load;
        node_module._load = function load(request, parent, isMain) {
            if (request === 'vscode') {
                return impl;
            }
            return original.apply(this, arguments);
        };
        define('vscode', [], impl);
    }
    var MainProcessVSCodeAPIHelper = (function () {
        function MainProcessVSCodeAPIHelper(modeService) {
            this._modeService = modeService;
            this._token2Dispose = {};
        }
        MainProcessVSCodeAPIHelper.prototype.onUnexpectedPluginHostError = function (err) {
            errors.onUnexpectedError(err);
        };
        MainProcessVSCodeAPIHelper.prototype.disposeByToken = function (disposeToken) {
            if (this._token2Dispose[disposeToken]) {
                this._token2Dispose[disposeToken].dispose();
                delete this._token2Dispose[disposeToken];
            }
        };
        MainProcessVSCodeAPIHelper.prototype.Modes_CommentsSupport_register = function (disposeToken, modeId, commentsSupport) {
            this._token2Dispose[disposeToken] = this._modeService.registerDeclarativeCommentsSupport(modeId, commentsSupport);
        };
        MainProcessVSCodeAPIHelper.prototype.Modes_TokenTypeClassificationSupport_register = function (disposeToken, modeId, tokenTypeClassificationSupport) {
            this._token2Dispose[disposeToken] = this._modeService.registerDeclarativeTokenTypeClassificationSupport(modeId, tokenTypeClassificationSupport);
        };
        MainProcessVSCodeAPIHelper.prototype.Modes_ElectricCharacterSupport_register = function (disposeToken, modeId, electricCharacterSupport) {
            this._token2Dispose[disposeToken] = this._modeService.registerDeclarativeElectricCharacterSupport(modeId, electricCharacterSupport);
        };
        MainProcessVSCodeAPIHelper.prototype.Modes_CharacterPairSupport_register = function (disposeToken, modeId, characterPairSupport) {
            this._token2Dispose[disposeToken] = this._modeService.registerDeclarativeCharacterPairSupport(modeId, characterPairSupport);
        };
        MainProcessVSCodeAPIHelper.prototype.Modes_OnEnterSupport_register = function (disposeToken, modeId, opts) {
            this._token2Dispose[disposeToken] = this._modeService.registerDeclarativeOnEnterSupport(modeId, opts);
        };
        MainProcessVSCodeAPIHelper = __decorate([
            thread_1.Remotable.MainContext('MainProcessVSCodeAPIHelper'),
            __param(0, modeService_1.IModeService)
        ], MainProcessVSCodeAPIHelper);
        return MainProcessVSCodeAPIHelper;
    })();
    exports.MainProcessVSCodeAPIHelper = MainProcessVSCodeAPIHelper;
});
//# sourceMappingURL=extHost.api.impl.js.map