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
define(["require", "exports", 'vs/base/common/uri', 'vs/base/common/bits/encoding', 'vs/workbench/browser/viewlet', 'vs/nls', 'vs/platform/actions/common/actions', 'vs/platform/platform', 'vs/platform/configuration/common/configurationRegistry', 'vs/workbench/common/actionRegistry', 'vs/workbench/common/contributions', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/workbench/parts/files/browser/files', 'vs/workbench/parts/files/common/files', 'vs/workbench/parts/files/browser/fileTracker', 'vs/workbench/parts/files/common/editors/saveParticipant', 'vs/workbench/parts/files/browser/editors/fileEditorInput', 'vs/workbench/parts/files/browser/editors/textFileEditor', 'vs/workbench/parts/files/browser/editors/binaryFileEditor', 'vs/platform/instantiation/common/instantiation', 'vs/platform/instantiation/common/descriptors', 'vs/workbench/services/viewlet/common/viewletService', 'vs/workbench/services/editor/common/editorService', 'vs/base/common/keyCodes', 'vs/css!./media/files.contribution'], function (require, exports, uri_1, encoding_1, viewlet_1, nls, actions_1, platform_1, configurationRegistry_1, actionRegistry_1, contributions_1, baseEditor_1, files_1, files_2, fileTracker_1, saveParticipant_1, fileEditorInput_1, textFileEditor_1, binaryFileEditor_1, instantiation_1, descriptors_1, viewletService_1, editorService_1, keyCodes_1) {
    // Viewlet Action
    var OpenExplorerViewletAction = (function (_super) {
        __extends(OpenExplorerViewletAction, _super);
        function OpenExplorerViewletAction(id, label, viewletService, editorService) {
            _super.call(this, id, label, files_2.VIEWLET_ID, viewletService, editorService);
        }
        OpenExplorerViewletAction.ID = files_2.VIEWLET_ID;
        OpenExplorerViewletAction.LABEL = nls.localize('showExplorerViewlet', "Show Explorer");
        OpenExplorerViewletAction = __decorate([
            __param(2, viewletService_1.IViewletService),
            __param(3, editorService_1.IWorkbenchEditorService)
        ], OpenExplorerViewletAction);
        return OpenExplorerViewletAction;
    })(viewlet_1.ToggleViewletAction);
    exports.OpenExplorerViewletAction = OpenExplorerViewletAction;
    // Register Viewlet
    platform_1.Registry.as(viewlet_1.Extensions.Viewlets).registerViewlet(new viewlet_1.ViewletDescriptor('vs/workbench/parts/files/browser/explorerViewlet', 'ExplorerViewlet', files_2.VIEWLET_ID, nls.localize('explore', "Explorer"), 'explore', 0));
    platform_1.Registry.as(viewlet_1.Extensions.Viewlets).setDefaultViewletId(files_2.VIEWLET_ID);
    var openViewletKb = {
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_E
    };
    // Register Action to Open Viewlet
    platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions).registerWorkbenchAction(new actions_1.SyncActionDescriptor(OpenExplorerViewletAction, OpenExplorerViewletAction.ID, OpenExplorerViewletAction.LABEL, openViewletKb), nls.localize('view', "View"));
    // Register file editors
    platform_1.Registry.as(baseEditor_1.Extensions.Editors).registerEditor(new files_1.FileEditorDescriptor(textFileEditor_1.TextFileEditor.ID, // explicit dependency because we don't want these editors lazy loaded
    nls.localize('textFileEditor', "Text File Editor"), 'vs/workbench/parts/files/browser/editors/textFileEditor', 'TextFileEditor', [
        'text/*',
        // In case the mime type is unknown, we prefer the text file editor over the binary editor to leave a chance
        // of opening a potential text file properly. The resolution of the file in the text file editor will fail
        // early on in case the file is actually binary, to prevent downloading a potential large binary file.
        'application/unknown'
    ]), [
        new descriptors_1.SyncDescriptor(fileEditorInput_1.FileEditorInput)
    ]);
    platform_1.Registry.as(baseEditor_1.Extensions.Editors).registerEditor(new files_1.FileEditorDescriptor(binaryFileEditor_1.BinaryFileEditor.ID, // explicit dependency because we don't want these editors lazy loaded
    nls.localize('binaryFileEditor', "Binary File Editor"), 'vs/workbench/parts/files/browser/editors/binaryFileEditor', 'BinaryFileEditor', [
        'image/*',
        'application/pdf',
        'audio/*',
        'video/*',
        'application/octet-stream'
    ]), [
        new descriptors_1.SyncDescriptor(fileEditorInput_1.FileEditorInput)
    ]);
    // Register default file input handler
    // Note: because of service injection, the descriptor needs to have the exact count
    // of arguments as the FileEditorInput constructor. Otherwise when creating an
    // instance through the instantiation service he will inject the services wrong!
    var descriptor = new descriptors_1.AsyncDescriptor('vs/workbench/parts/files/browser/editors/fileEditorInput', 'FileEditorInput', /* DO NOT REMOVE */ void 0, /* DO NOT REMOVE */ void 0, /* DO NOT REMOVE */ void 0);
    platform_1.Registry.as(baseEditor_1.Extensions.Editors).registerDefaultFileInput(descriptor);
    // Register Editor Input Factory
    var FileEditorInputFactory = (function () {
        function FileEditorInputFactory(ns) {
        }
        FileEditorInputFactory.prototype.serialize = function (editorInput) {
            var fileEditorInput = editorInput;
            var fileInput = {
                resource: fileEditorInput.getResource().toString(),
                mime: fileEditorInput.getMime()
            };
            return JSON.stringify(fileInput);
        };
        FileEditorInputFactory.prototype.deserialize = function (instantiationService, serializedEditorInput) {
            var fileInput = JSON.parse(serializedEditorInput);
            return instantiationService.createInstance(fileEditorInput_1.FileEditorInput, uri_1.default.parse(fileInput.resource), fileInput.mime, void 0);
        };
        FileEditorInputFactory = __decorate([
            __param(0, instantiation_1.INullService)
        ], FileEditorInputFactory);
        return FileEditorInputFactory;
    })();
    platform_1.Registry.as(baseEditor_1.Extensions.Editors).registerEditorInputFactory(files_2.FILE_EDITOR_INPUT_ID, FileEditorInputFactory);
    // Register File Tracker
    platform_1.Registry.as(contributions_1.Extensions.Workbench).registerWorkbenchContribution(fileTracker_1.FileTracker);
    // Register Save Participant
    platform_1.Registry.as(contributions_1.Extensions.Workbench).registerWorkbenchContribution(saveParticipant_1.SaveParticipant);
    // Configuration
    var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
    configurationRegistry.registerConfiguration({
        'id': 'files',
        'order': 7,
        'title': nls.localize('filesConfigurationTitle', "Files configuration"),
        'type': 'object',
        'properties': {
            'files.exclude': {
                'id': 'glob-pattern',
                'type': 'object',
                'description': nls.localize('exclude', "Configure glob patterns for excluding files and folders."),
                'default': { '**/.git': true, '**/.DS_Store': true },
                'additionalProperties': {
                    'anyOf': [
                        {
                            'type': 'boolean',
                            'description': nls.localize('files.exclude.boolean', "The glob pattern to match file paths against. Set to true or false to enable or disable the pattern."),
                        },
                        {
                            'type': 'object',
                            'properties': {
                                'when': {
                                    'type': 'string',
                                    'pattern': '\\w*\\$\\(basename\\)\\w*',
                                    'default': '$(basename).ext',
                                    'description': nls.localize('files.exclude.when', 'Additional check on the siblings of a matching file. Use $(basename) as variable for the matching file name.')
                                }
                            }
                        }
                    ]
                }
            },
            'files.encoding': {
                'type': 'string',
                'enum': Object.keys(encoding_1.SUPPORTED_ENCODINGS),
                'default': 'utf8',
                'description': nls.localize('encoding', "The default character set encoding to use when reading and writing files."),
            },
            'files.trimTrailingWhitespace': {
                'type': 'boolean',
                'default': false,
                'description': nls.localize('trimTrailingWhitespace', "When enabled, will trim trailing whitespace when you save a file.")
            },
            'files.autoSaveDelay': {
                'type': 'number',
                'default': 0,
                'description': nls.localize('autoSaveDelay', "When set to a positive number, will automatically save dirty editors after configured seconds.")
            },
            'files.autoSaveFocusChange': {
                'type': 'boolean',
                'default': false,
                'description': nls.localize('autoSaveFocusChange', "When enabled, will automatically save dirty editors when they lose focus or are closed.")
            }
        }
    });
    configurationRegistry.registerConfiguration({
        'id': 'explorer',
        'order': 8,
        'title': nls.localize('explorerConfigurationTitle', "File Explorer configuration"),
        'type': 'object',
        'properties': {
            'explorer.workingFiles.maxVisible': {
                'type': 'number',
                'description': nls.localize('maxVisible', "Maximum number of working files to show before scrollbars appear."),
                'default': 9
            },
            'explorer.workingFiles.dynamicHeight': {
                'type': 'boolean',
                'description': nls.localize('dynamicHeight', "Controls if the height of the working files section should adapt dynamically to the number of elements or not."),
                'default': true
            }
        }
    });
});
//# sourceMappingURL=files.contribution.js.map