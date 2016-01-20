/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls', 'vs/base/common/paths', 'vs/base/common/strings', 'vs/platform/thread/common/threadService', 'vs/platform/plugins/common/pluginsRegistry', 'vs/base/common/mime', 'vs/base/common/errors', 'vs/platform/instantiation/common/descriptors', 'vs/base/common/event'], function (require, exports, nls, paths, Strings, threadService_1, pluginsRegistry_1, Mime, Errors, descriptors_1, event_1) {
    var languagesExtPoint = pluginsRegistry_1.PluginsRegistry.registerExtensionPoint('languages', {
        description: nls.localize('vscode.extension.contributes.languages', 'Contributes language declarations.'),
        type: 'array',
        default: [{ id: '', aliases: [], extensions: [] }],
        items: {
            type: 'object',
            default: { id: '', extensions: [] },
            properties: {
                id: {
                    description: nls.localize('vscode.extension.contributes.languages.id', 'ID of the language.'),
                    type: 'string'
                },
                aliases: {
                    description: nls.localize('vscode.extension.contributes.languages.aliases', 'Name aliases for the language.'),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                extensions: {
                    description: nls.localize('vscode.extension.contributes.languages.extensions', 'File extensions associated to the language.'),
                    default: ['.foo'],
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                filenames: {
                    description: nls.localize('vscode.extension.contributes.languages.filenames', 'File names associated to the language.'),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                mimetypes: {
                    description: nls.localize('vscode.extension.contributes.languages.mimetypes', 'Mime types associated to the language.'),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                firstLine: {
                    description: nls.localize('vscode.extension.contributes.languages.firstLine', 'A regular expression matching the first line of a file of the language.'),
                    type: 'string'
                },
                configuration: {
                    description: nls.localize('vscode.extension.contributes.languages.configuration', 'A relative path to a file containing configuration options for the language.'),
                    type: 'string'
                }
            }
        }
    });
    function isUndefinedOrStringArray(value) {
        if (typeof value === 'undefined') {
            return true;
        }
        if (!Array.isArray(value)) {
            return false;
        }
        return value.every(function (item) { return typeof item === 'string'; });
    }
    function isValidLanguageExtensionPoint(value, collector) {
        if (!value) {
            collector.error(nls.localize('invalid.empty', "Empty value for `contributes.{0}`", languagesExtPoint.name));
            return false;
        }
        if (typeof value.id !== 'string') {
            collector.error(nls.localize('require.id', "property `{0}` is mandatory and must be of type `string`", 'id'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.extensions)) {
            collector.error(nls.localize('opt.extensions', "property `{0}` can be omitted and must be of type `string[]`", 'extensions'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.filenames)) {
            collector.error(nls.localize('opt.filenames', "property `{0}` can be omitted and must be of type `string[]`", 'filenames'));
            return false;
        }
        if (typeof value.firstLine !== 'undefined' && typeof value.firstLine !== 'string') {
            collector.error(nls.localize('opt.firstLine', "property `{0}` can be omitted and must be of type `string`", 'firstLine'));
            return false;
        }
        if (typeof value.configuration !== 'undefined' && typeof value.configuration !== 'string') {
            collector.error(nls.localize('opt.configuration', "property `{0}` can be omitted and must be of type `string`", 'configuration'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.aliases)) {
            collector.error(nls.localize('opt.aliases', "property `{0}` can be omitted and must be of type `string[]`", 'aliases'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.mimetypes)) {
            collector.error(nls.localize('opt.mimetypes', "property `{0}` can be omitted and must be of type `string[]`", 'mimetypes'));
            return false;
        }
        return true;
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var LanguageExtensionPointHandler = (function () {
        function LanguageExtensionPointHandler() {
            this._onDidAddMode = new event_1.Emitter();
            this.onDidAddMode = this._onDidAddMode.event;
            this.knownModeIds = {};
            this.mime2LanguageId = {};
            this.name2LanguageId = {};
            this.id2Name = {};
            this.name2Extensions = {};
            this.compatModes = {};
            this.lowerName2Id = {};
            this.id2ConfigurationFiles = {};
            this._isRegisteredWithThreadService = false;
        }
        // -- BEGIN IThreadSynchronizableObject
        LanguageExtensionPointHandler.prototype.creationDone = function () {
            this._isRegisteredWithThreadService = true;
        };
        LanguageExtensionPointHandler.prototype.getId = function () {
            return 'LanguageExtensionPointHandler';
        };
        LanguageExtensionPointHandler.prototype.getSerializableState = function () {
            return {
                knownModeIds: this.knownModeIds,
                mime2LanguageId: this.mime2LanguageId,
                name2LanguageId: this.name2LanguageId,
                name2Extensions: this.name2Extensions,
                id2Name: this.id2Name,
                compatModes: this.compatModes,
                lowerName2Id: this.lowerName2Id
            };
        };
        LanguageExtensionPointHandler.prototype.setData = function (data) {
            this.knownModeIds = data.knownModeIds;
            this.mime2LanguageId = data.mime2LanguageId;
            this.name2LanguageId = data.name2LanguageId;
            this.name2Extensions = data.name2Extensions;
            this.id2Name = data.id2Name;
            this.compatModes = data.compatModes;
            this.lowerName2Id = data.lowerName2Id;
        };
        // -- END IThreadSynchronizableObject
        LanguageExtensionPointHandler.prototype.registerCompatMode = function (def) {
            this._onLanguage({
                id: def.id,
                extensions: def.extensions,
                filenames: def.filenames,
                firstLine: def.firstLine,
                aliases: def.aliases,
                mimetypes: def.mimetypes
            });
            this.compatModes[def.id] = descriptors_1.createAsyncDescriptor1(def.moduleId, def.ctorName);
        };
        LanguageExtensionPointHandler.prototype._handleLanguagesExtensionPointUsers = function (extensions) {
            var allValidLanguages = [];
            for (var i = 0, len = extensions.length; i < len; i++) {
                var extension = extensions[i];
                if (!Array.isArray(extension.value)) {
                    extension.collector.error(nls.localize('invalid', "Invalid `contributes.{0}`. Expected an array.", languagesExtPoint.name));
                    continue;
                }
                for (var j = 0, lenJ = extension.value.length; j < lenJ; j++) {
                    if (isValidLanguageExtensionPoint(extension.value[j], extension.collector)) {
                        allValidLanguages.push({
                            id: extension.value[j].id,
                            extensions: extension.value[j].extensions,
                            filenames: extension.value[j].filenames,
                            firstLine: extension.value[j].firstLine,
                            aliases: extension.value[j].aliases,
                            mimetypes: extension.value[j].mimetypes,
                            configuration: extension.value[j].configuration ? paths.join(extension.description.extensionFolderPath, extension.value[j].configuration) : extension.value[j].configuration
                        });
                    }
                }
            }
            if (this._isRegisteredWithThreadService) {
                this._onLanguagesEverywhere(allValidLanguages);
            }
            else {
                this._onLanguagesImpl(allValidLanguages);
            }
        };
        LanguageExtensionPointHandler.prototype._onLanguagesEverywhere = function (desc) {
            this._onLanguagesImpl(desc);
        };
        LanguageExtensionPointHandler.prototype._onLanguagesImpl = function (desc) {
            for (var i = 0; i < desc.length; i++) {
                this._onLanguage(desc[i]);
            }
        };
        LanguageExtensionPointHandler.prototype._setMime2LanguageId = function (mimeType, modeId) {
            if (this.mime2LanguageId[mimeType] && this.mime2LanguageId[mimeType] !== modeId) {
                console.warn('Overwriting mime <<' + mimeType + '>> to now point to modeId <<' + modeId + '>>');
            }
            this.mime2LanguageId[mimeType] = modeId;
        };
        LanguageExtensionPointHandler.prototype.registerLanguage = function (lang) {
            this._onLanguage(lang);
        };
        LanguageExtensionPointHandler.prototype._onLanguage = function (lang) {
            this.knownModeIds[lang.id] = true;
            var primaryMime = null;
            if (typeof lang.mimetypes !== 'undefined' && Array.isArray(lang.mimetypes)) {
                for (var i = 0; i < lang.mimetypes.length; i++) {
                    if (!primaryMime) {
                        primaryMime = lang.mimetypes[i];
                    }
                    this.mime2LanguageId[lang.mimetypes[i]] = lang.id;
                }
            }
            if (!primaryMime) {
                primaryMime = 'text/x-' + lang.id;
                this.mime2LanguageId[primaryMime] = lang.id;
            }
            if (typeof lang.extensions !== 'undefined' && Array.isArray(lang.extensions)) {
                for (var i = 0; i < lang.extensions.length; i++) {
                    Mime.registerTextMimeByFilename(lang.extensions[i], primaryMime);
                }
            }
            if (typeof lang.filenames !== 'undefined' && Array.isArray(lang.filenames)) {
                for (var i = 0; i < lang.filenames.length; i++) {
                    Mime.registerTextMimeByFilename(lang.filenames[i], primaryMime);
                }
            }
            if (typeof lang.firstLine === 'string' && lang.firstLine.length > 0) {
                var firstLineRegexStr = lang.firstLine;
                if (firstLineRegexStr.charAt(0) !== '^') {
                    firstLineRegexStr = '^' + firstLineRegexStr;
                }
                try {
                    var firstLineRegex = new RegExp(firstLineRegexStr);
                    if (!Strings.regExpLeadsToEndlessLoop(firstLineRegex)) {
                        Mime.registerTextMimeByFirstLine(firstLineRegex, primaryMime);
                    }
                }
                catch (err) {
                    // Most likely, the regex was bad
                    Errors.onUnexpectedError(err);
                }
            }
            var bestName = null;
            if (typeof lang.aliases !== 'undefined' && Array.isArray(lang.aliases)) {
                for (var i = 0; i < lang.aliases.length; i++) {
                    if (!lang.aliases[i] || lang.aliases[i].length === 0) {
                        continue;
                    }
                    if (!bestName) {
                        bestName = lang.aliases[i];
                        this.name2LanguageId[lang.aliases[i]] = lang.id;
                        this.name2Extensions[lang.aliases[i]] = lang.extensions;
                    }
                    this.lowerName2Id[lang.aliases[i].toLowerCase()] = lang.id;
                }
            }
            this.id2Name[lang.id] = bestName || '';
            if (typeof lang.configuration === 'string') {
                this.id2ConfigurationFiles[lang.id] = this.id2ConfigurationFiles[lang.id] || [];
                this.id2ConfigurationFiles[lang.id].push(lang.configuration);
            }
            this._onDidAddMode.fire(lang.id);
        };
        LanguageExtensionPointHandler.prototype.isRegisteredMode = function (mimetypeOrModeId) {
            // Is this a known mime type ?
            if (hasOwnProperty.call(this.mime2LanguageId, mimetypeOrModeId)) {
                return true;
            }
            // Is this a known mode id ?
            return hasOwnProperty.call(this.knownModeIds, mimetypeOrModeId);
        };
        LanguageExtensionPointHandler.prototype.getRegisteredModes = function () {
            return Object.keys(this.knownModeIds);
        };
        LanguageExtensionPointHandler.prototype.getRegisteredMimetypes = function () {
            return Object.keys(this.mime2LanguageId);
        };
        LanguageExtensionPointHandler.prototype.getRegisteredLanguageNames = function () {
            return Object.keys(this.name2LanguageId);
        };
        LanguageExtensionPointHandler.prototype.getLanguageName = function (modeId) {
            return this.id2Name[modeId] || null;
        };
        LanguageExtensionPointHandler.prototype.getModeIdForLanguageNameLowercase = function (languageNameLower) {
            return this.lowerName2Id[languageNameLower] || null;
        };
        LanguageExtensionPointHandler.prototype.getConfigurationFiles = function (modeId) {
            return this.id2ConfigurationFiles[modeId] || [];
        };
        LanguageExtensionPointHandler.prototype.getMimeForMode = function (theModeId) {
            for (var mime in this.mime2LanguageId) {
                if (this.mime2LanguageId.hasOwnProperty(mime)) {
                    var modeId = this.mime2LanguageId[mime];
                    if (modeId === theModeId) {
                        return mime;
                    }
                }
            }
            return null;
        };
        LanguageExtensionPointHandler.prototype.extractModeIds = function (commaSeparatedMimetypesOrCommaSeparatedIdsOrName) {
            var _this = this;
            if (!commaSeparatedMimetypesOrCommaSeparatedIdsOrName) {
                return [];
            }
            return (commaSeparatedMimetypesOrCommaSeparatedIdsOrName.
                split(',').
                map(function (mimeTypeOrIdOrName) { return mimeTypeOrIdOrName.trim(); }).
                map(function (mimeTypeOrIdOrName) {
                return _this.mime2LanguageId[mimeTypeOrIdOrName] || mimeTypeOrIdOrName;
            }).
                filter(function (modeId) {
                return _this.knownModeIds[modeId];
            }));
        };
        LanguageExtensionPointHandler.prototype.getModeIdsFromLanguageName = function (languageName) {
            if (!languageName) {
                return [];
            }
            if (hasOwnProperty.call(this.name2LanguageId, languageName)) {
                return [this.name2LanguageId[languageName]];
            }
            return [];
        };
        LanguageExtensionPointHandler.prototype.getModeIdsFromFilenameOrFirstLine = function (filename, firstLine) {
            if (!filename && !firstLine) {
                return [];
            }
            var mimeTypes = Mime.guessMimeTypes(filename, firstLine);
            return this.extractModeIds(mimeTypes.join(','));
        };
        LanguageExtensionPointHandler.prototype.getCompatMode = function (modeId) {
            return this.compatModes[modeId] || null;
        };
        LanguageExtensionPointHandler.prototype.getExtensions = function (languageName) {
            return this.name2Extensions[languageName];
        };
        LanguageExtensionPointHandler.$_onLanguagesEverywhere = threadService_1.EverywhereAttr(LanguageExtensionPointHandler, LanguageExtensionPointHandler.prototype._onLanguagesEverywhere);
        return LanguageExtensionPointHandler;
    })();
    // Create the handler, register it as a thread synchronizable object and as an ext point listener
    var _instance = new LanguageExtensionPointHandler();
    threadService_1.registerThreadSynchronizableObject(_instance);
    languagesExtPoint.setHandler(function (extensions) {
        _instance._handleLanguagesExtensionPointUsers(extensions);
    });
    // Export only a subset of the handler
    exports.LanguageExtensions = _instance;
});
//# sourceMappingURL=languageExtensionPoint.js.map