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
define(["require", "exports", 'vs/base/common/errors', 'vs/base/common/types', 'vs/base/common/events', 'vs/platform/files/common/files', 'vs/base/common/paths', 'vs/editor/common/editorCommon', 'vs/workbench/common/constants', 'vs/platform/theme/common/themes', 'vs/workbench/browser/parts/editor/iframeEditor', 'vs/workbench/parts/markdown/common/markdownEditorInput', 'vs/workbench/parts/markdown/browser/markdownActions', 'vs/workbench/common/events', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/storage/common/storage', 'vs/platform/configuration/common/configuration', 'vs/editor/common/services/modelService', 'vs/platform/event/common/event', 'vs/platform/instantiation/common/instantiation', 'vs/editor/common/services/modeService'], function (require, exports, errors, types, events_1, files_1, paths, editorCommon_1, constants_1, themes, iframeEditor_1, markdownEditorInput_1, markdownActions_1, events_2, editorService_1, contextService_1, storage_1, configuration_1, modelService_1, event_1, instantiation_1, modeService_1) {
    // This extension tracks markdown files for changes to update markdown editors and inputs accordingly.
    var MarkdownFileTracker = (function () {
        function MarkdownFileTracker(modeService, eventService, editorService, configurationService, storageService, contextService, modelService, instantiationService) {
            this.modeService = modeService;
            this.eventService = eventService;
            this.editorService = editorService;
            this.configurationService = configurationService;
            this.storageService = storageService;
            this.contextService = contextService;
            this.modelService = modelService;
            this.instantiationService = instantiationService;
            this.markdownConfigurationPaths = [];
            this.hasModelListenerOnResourcePath = Object.create(null);
            this.configureMode(this.storageService.get(constants_1.Preferences.THEME, storage_1.StorageScope.GLOBAL));
            this.registerListeners();
            this.handleWelcome();
        }
        MarkdownFileTracker.prototype.registerListeners = function () {
            var _this = this;
            this.fileChangeListener = this.eventService.addListener(files_1.EventType.FILE_CHANGES, function (e) { return _this.onFileChanges(e); });
            this.configFileChangeListener = this.configurationService.addListener(configuration_1.ConfigurationServiceEventTypes.UPDATED, function (e) { return _this.onConfigFileChange(e); });
            // reload markdown editors when their resources change
            this.editorInputChangeListener = this.eventService.addListener(events_2.EventType.EDITOR_INPUT_CHANGED, function (e) { return _this.onEditorInputChanged(e); });
            // initially read the config for CSS styles in preview
            this.configurationService.loadConfiguration().done(function (config) {
                _this.readMarkdownConfiguration(config);
            }, errors.onUnexpectedError);
            // listen to theme changes
            this.themeChangeListener = this.storageService.addListener(storage_1.StorageEventType.STORAGE, function (e) {
                if (e.key === constants_1.Preferences.THEME) {
                    _this.configureMode(e.newValue);
                    _this.reloadMarkdownEditors(true);
                }
            });
        };
        MarkdownFileTracker.prototype.onEditorInputChanged = function (e) {
            var _this = this;
            var input = e.editorInput;
            if (input instanceof markdownEditorInput_1.MarkdownEditorInput) {
                var markdownResource = input.getResource();
                var editorModel = this.modelService.getModel(markdownResource);
                if (editorModel && !this.hasModelListenerOnResourcePath[markdownResource.toString()]) {
                    var toUnbind = [];
                    var unbind = function () {
                        while (toUnbind.length) {
                            toUnbind.pop()();
                        }
                        _this.hasModelListenerOnResourcePath[markdownResource.toString()] = false;
                    };
                    // Listen on changes to the underlying resource of the markdown preview
                    toUnbind.push(editorModel.addListener(editorCommon_1.EventType.ModelContentChanged, function (modelEvent) {
                        if (_this.reloadTimeout) {
                            window.clearTimeout(_this.reloadTimeout);
                        }
                        _this.reloadTimeout = setTimeout(function () {
                            if (!_this.reloadMarkdownEditors(false, markdownResource)) {
                                unbind();
                            }
                        }, MarkdownFileTracker.RELOAD_MARKDOWN_DELAY);
                    }));
                    // Mark as being listened
                    this.hasModelListenerOnResourcePath[markdownResource.toString()] = true;
                    // Unbind when input or model gets disposed
                    toUnbind.push(input.addListener(events_1.EventType.DISPOSE, unbind));
                    toUnbind.push(editorModel.addListener(editorCommon_1.EventType.ModelDispose, unbind));
                }
            }
        };
        MarkdownFileTracker.prototype.handleWelcome = function () {
            var firstStartup = !this.storageService.get(MarkdownFileTracker.hideWelcomeSettingskey);
            var emptyWorkbench = !this.contextService.getWorkspace() && (!this.contextService.getOptions().filesToOpen || this.contextService.getOptions().filesToOpen.length === 0) && (!this.contextService.getOptions().filesToCreate || this.contextService.getOptions().filesToCreate.length === 0);
            if (firstStartup && emptyWorkbench) {
                this.storageService.store(MarkdownFileTracker.hideWelcomeSettingskey, true); // only once
                var action = this.instantiationService.createInstance(markdownActions_1.ShowWelcomeAction, markdownActions_1.ShowWelcomeAction.ID, markdownActions_1.ShowWelcomeAction.LABEL);
                if (action.enabled) {
                    action.setPreserveFocus(true);
                    action.run().done(function () { return action.dispose(); }, errors.onUnexpectedError);
                }
            }
        };
        MarkdownFileTracker.prototype.configureMode = function (theme) {
            if (theme) {
                var baseTheme = themes.getBaseThemeId(theme);
                this.modeService.configureMode('text/x-web-markdown', { theme: baseTheme });
            }
        };
        MarkdownFileTracker.prototype.getId = function () {
            return 'vs.markdown.filetracker';
        };
        MarkdownFileTracker.prototype.onConfigFileChange = function (e) {
            // reload markdown editors if styles change
            if (this.readMarkdownConfiguration(e.config)) {
                this.reloadMarkdownEditors(true);
            }
        };
        MarkdownFileTracker.prototype.readMarkdownConfiguration = function (languageConfiguration) {
            var oldMarkdownConfigurationThumbprint = this.markdownConfigurationThumbprint;
            var newMarkdownConfigurationThumbprint;
            // Reset old
            this.markdownConfigurationThumbprint = null;
            this.markdownConfigurationPaths = [];
            if (languageConfiguration) {
                var markdownConfiguration = languageConfiguration.markdown;
                if (markdownConfiguration && types.isArray(markdownConfiguration.styles)) {
                    newMarkdownConfigurationThumbprint = markdownConfiguration.styles.join('');
                    var styles = markdownConfiguration.styles.map(function (style) { return paths.makeAbsolute(paths.normalize(style)); });
                    this.markdownConfigurationPaths = styles;
                }
            }
            // Remember as current
            this.markdownConfigurationThumbprint = newMarkdownConfigurationThumbprint;
            return (oldMarkdownConfigurationThumbprint !== newMarkdownConfigurationThumbprint);
        };
        MarkdownFileTracker.prototype.onFileChanges = function (e) {
            var _this = this;
            // If any of the markdown CSS styles have updated, reload all markdown editors
            if (this.markdownConfigurationPaths.length && e.containsAny(this.markdownConfigurationPaths.map(function (p) { return _this.contextService.toResource(p); }), files_1.FileChangeType.UPDATED)) {
                this.reloadMarkdownEditors(true);
            }
        };
        MarkdownFileTracker.prototype.reloadMarkdownEditors = function (clearIFrame, resource) {
            var didReload = false;
            var editors = this.editorService.getVisibleEditors();
            editors.forEach(function (editor) {
                // Only applicable to markdown editor inputs in iframe editors
                var input = editor.input;
                if (input instanceof markdownEditorInput_1.MarkdownEditorInput && editor instanceof iframeEditor_1.IFrameEditor) {
                    if (!resource || resource.toString() === input.getResource().toString()) {
                        editor.reload(clearIFrame);
                        didReload = true;
                    }
                }
            });
            return didReload;
        };
        MarkdownFileTracker.prototype.dispose = function () {
            if (this.fileChangeListener) {
                this.fileChangeListener();
                this.fileChangeListener = null;
            }
            if (this.configFileChangeListener) {
                this.configFileChangeListener();
                this.configFileChangeListener = null;
            }
            if (this.editorInputChangeListener) {
                this.editorInputChangeListener();
                this.editorInputChangeListener = null;
            }
        };
        MarkdownFileTracker.hideWelcomeSettingskey = 'workbench.hide.welcome';
        MarkdownFileTracker.RELOAD_MARKDOWN_DELAY = 300; // delay before reloading markdown preview after user typing
        MarkdownFileTracker = __decorate([
            __param(0, modeService_1.IModeService),
            __param(1, event_1.IEventService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, configuration_1.IConfigurationService),
            __param(4, storage_1.IStorageService),
            __param(5, contextService_1.IWorkspaceContextService),
            __param(6, modelService_1.IModelService),
            __param(7, instantiation_1.IInstantiationService)
        ], MarkdownFileTracker);
        return MarkdownFileTracker;
    })();
    exports.MarkdownFileTracker = MarkdownFileTracker;
});
//# sourceMappingURL=markdownExtension.js.map