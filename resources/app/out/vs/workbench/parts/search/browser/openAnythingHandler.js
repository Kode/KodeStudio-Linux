/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/platform/configuration/common/configuration","vs/base/common/winjs.base","vs/nls!vs/workbench/parts/search/browser/openAnythingHandler","vs/base/common/labels","vs/base/parts/quickopen/browser/quickOpenModel","vs/workbench/browser/quickopen","vs/platform/instantiation/common/instantiation","vs/base/common/paths","vs/nls!vs/workbench/parts/search/browser/openSymbolHandler","vs/platform/search/common/search","vs/workbench/parts/search/common/searchQuery","vs/workbench/parts/search/browser/openFileHandler","vs/nls","vs/workbench/services/editor/common/editorService","vs/nls!vs/workbench/parts/search/browser/openFileHandler","vs/platform/message/common/message","vs/platform/workspace/common/workspace","vs/workbench/parts/search/browser/openSymbolHandler","vs/base/common/async","vs/workbench/services/workspace/common/contextService","vs/workbench/services/group/common/groupService","vs/base/common/objects","vs/workbench/parts/files/common/files","vs/base/common/filters","vs/editor/common/services/modeService","vs/workbench/parts/search/common/search","vs/workbench/parts/search/browser/openAnythingHandler","vs/base/common/types","vs/base/common/platform","vs/base/common/scorer","vs/base/common/strings","vs/workbench/common/editor"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};

define(__m[16], __M([14,4]), function(nls, data) { return nls.create("vs/workbench/parts/search/browser/openFileHandler", data); });
define(__m[10], __M([14,4]), function(nls, data) { return nls.create("vs/workbench/parts/search/browser/openSymbolHandler", data); });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[12], __M([0,1,23,11,2]), function (require, exports, objects, search, configuration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function getExcludes(configuration) {
        var fileExcludes = configuration && configuration.files && configuration.files.exclude;
        var searchExcludes = configuration && configuration.search && configuration.search.exclude;
        if (!fileExcludes && !searchExcludes) {
            return null;
        }
        if (!fileExcludes || !searchExcludes) {
            return fileExcludes || searchExcludes;
        }
        var allExcludes = Object.create(null);
        allExcludes = objects.mixin(allExcludes, fileExcludes);
        allExcludes = objects.mixin(allExcludes, searchExcludes, true);
        return allExcludes;
    }
    exports.getExcludes = getExcludes;
    var QueryBuilder = (function () {
        function QueryBuilder(configurationService) {
            this.configurationService = configurationService;
        }
        QueryBuilder.prototype.text = function (contentPattern, options) {
            return this.query(search.QueryType.Text, contentPattern, options);
        };
        QueryBuilder.prototype.file = function (options) {
            return this.query(search.QueryType.File, null, options);
        };
        QueryBuilder.prototype.query = function (type, contentPattern, options) {
            if (options === void 0) { options = {}; }
            var configuration = this.configurationService.getConfiguration();
            var excludePattern = getExcludes(configuration);
            if (!options.excludePattern) {
                options.excludePattern = excludePattern;
            }
            else {
                objects.mixin(options.excludePattern, excludePattern, false /* no overwrite */);
            }
            return {
                type: type,
                folderResources: options.folderResources,
                extraFileResources: options.extraFileResources,
                filePattern: options.filePattern,
                excludePattern: options.excludePattern,
                includePattern: options.includePattern,
                maxResults: options.maxResults,
                fileEncoding: options.fileEncoding,
                contentPattern: contentPattern
            };
        };
        QueryBuilder = __decorate([
            __param(0, configuration_1.IConfigurationService)
        ], QueryBuilder);
        return QueryBuilder;
    }());
    exports.QueryBuilder = QueryBuilder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};









define(__m[13], __M([0,1,3,16,9,5,6,7,12,24,33,22,15,2,8,17,11,18]), function (require, exports, winjs_base_1, nls, paths, labels, quickOpenModel_1, quickopen_1, searchQuery_1, files_1, editor_1, groupService_1, editorService_1, configuration_1, instantiation_1, message_1, search_1, workspace_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var FileEntry = (function (_super) {
        __extends(FileEntry, _super);
        function FileEntry(name, description, resource, editorService, instantiationService, configurationService, contextService) {
            _super.call(this, editorService);
            this.instantiationService = instantiationService;
            this.configurationService = configurationService;
            this.resource = resource;
            this.name = name;
            this.description = description;
        }
        FileEntry.prototype.getLabel = function () {
            return this.name;
        };
        FileEntry.prototype.getAriaLabel = function () {
            return nls.localize(0, null, this.getLabel());
        };
        FileEntry.prototype.getDescription = function () {
            return this.description;
        };
        FileEntry.prototype.getIcon = function () {
            return 'file';
        };
        FileEntry.prototype.getResource = function () {
            return this.resource;
        };
        FileEntry.prototype.setRange = function (range) {
            this.range = range;
        };
        FileEntry.prototype.getInput = function () {
            var input = {
                resource: this.resource,
                options: {
                    pinned: !this.configurationService.getConfiguration().workbench.editor.enablePreviewFromQuickOpen
                }
            };
            if (this.range) {
                input.options.selection = this.range;
            }
            return input;
        };
        FileEntry = __decorate([
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, configuration_1.IConfigurationService),
            __param(6, workspace_1.IWorkspaceContextService)
        ], FileEntry);
        return FileEntry;
    }(quickopen_1.EditorQuickOpenEntry));
    exports.FileEntry = FileEntry;
    var OpenFileHandler = (function (_super) {
        __extends(OpenFileHandler, _super);
        function OpenFileHandler(editorService, editorGroupService, messageService, instantiationService, configurationService, contextService, textFileService, searchService) {
            _super.call(this);
            this.editorService = editorService;
            this.editorGroupService = editorGroupService;
            this.messageService = messageService;
            this.instantiationService = instantiationService;
            this.configurationService = configurationService;
            this.contextService = contextService;
            this.textFileService = textFileService;
            this.searchService = searchService;
            this.queryBuilder = this.instantiationService.createInstance(searchQuery_1.QueryBuilder);
        }
        OpenFileHandler.prototype.getResults = function (searchValue) {
            searchValue = searchValue.trim();
            var promise;
            // Respond directly to empty search
            if (!searchValue) {
                promise = winjs_base_1.TPromise.as([]);
            }
            else {
                promise = this.doFindResults(searchValue);
            }
            return promise.then(function (e) { return new quickOpenModel_1.QuickOpenModel(e); });
        };
        OpenFileHandler.prototype.doFindResults = function (searchValue) {
            var _this = this;
            var query = {
                folderResources: this.contextService.getWorkspace() ? [this.contextService.getWorkspace().resource] : [],
                extraFileResources: editor_1.getOutOfWorkspaceEditorResources(this.editorGroupService, this.contextService),
                filePattern: searchValue
            };
            return this.searchService.search(this.queryBuilder.file(query)).then(function (complete) {
                var results = [];
                for (var i = 0; i < complete.results.length; i++) {
                    var fileMatch = complete.results[i];
                    var label = paths.basename(fileMatch.resource.fsPath);
                    var description = labels.getPathLabel(paths.dirname(fileMatch.resource.fsPath), _this.contextService);
                    results.push(_this.instantiationService.createInstance(FileEntry, label, description, fileMatch.resource));
                }
                return results;
            });
        };
        OpenFileHandler.prototype.getGroupLabel = function () {
            return nls.localize(1, null);
        };
        OpenFileHandler.prototype.getAutoFocus = function (searchValue) {
            return {
                autoFocusFirstEntry: true
            };
        };
        OpenFileHandler = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, groupService_1.IEditorGroupService),
            __param(2, message_1.IMessageService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, workspace_1.IWorkspaceContextService),
            __param(6, files_1.ITextFileService),
            __param(7, search_1.ISearchService)
        ], OpenFileHandler);
        return OpenFileHandler;
    }(quickopen_1.QuickOpenHandler));
    exports.OpenFileHandler = OpenFileHandler;
});















define(__m[19], __M([0,1,3,10,20,7,6,25,5,15,8,18,26,2,27]), function (require, exports, winjs_base_1, nls, async_1, quickopen_1, quickOpenModel_1, filters, labels, editorService_1, instantiation_1, workspace_1, modeService_1, configuration_1, search_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var SymbolEntry = (function (_super) {
        __extends(SymbolEntry, _super);
        function SymbolEntry(name, parameters, description, resource, type, range, highlights, editorService, configurationService) {
            _super.call(this, editorService);
            this.configurationService = configurationService;
            this.name = name;
            this.parameters = parameters;
            this.description = description;
            this.resource = resource;
            this.type = type;
            this.range = range;
            this.setHighlights(highlights);
        }
        SymbolEntry.prototype.getLabel = function () {
            return this.name + this.parameters;
        };
        SymbolEntry.prototype.getAriaLabel = function () {
            return nls.localize(0, null, this.getLabel());
        };
        SymbolEntry.prototype.getName = function () {
            return this.name;
        };
        SymbolEntry.prototype.getParameters = function () {
            return this.parameters;
        };
        SymbolEntry.prototype.getDescription = function () {
            return this.description;
        };
        SymbolEntry.prototype.getType = function () {
            return this.type;
        };
        SymbolEntry.prototype.getIcon = function () {
            return this.type;
        };
        SymbolEntry.prototype.getInput = function () {
            var input = {
                resource: this.resource,
                options: {
                    pinned: !this.configurationService.getConfiguration().workbench.editor.enablePreviewFromQuickOpen
                }
            };
            if (this.range) {
                input.options.selection = {
                    startLineNumber: this.range.startLineNumber,
                    startColumn: this.range.startColumn
                };
            }
            return input;
        };
        SymbolEntry = __decorate([
            __param(7, editorService_1.IWorkbenchEditorService),
            __param(8, configuration_1.IConfigurationService)
        ], SymbolEntry);
        return SymbolEntry;
    }(quickopen_1.EditorQuickOpenEntry));
    var OpenSymbolHandler = (function (_super) {
        __extends(OpenSymbolHandler, _super);
        function OpenSymbolHandler(editorService, modeService, instantiationService, contextService) {
            _super.call(this);
            this.editorService = editorService;
            this.modeService = modeService;
            this.instantiationService = instantiationService;
            this.contextService = contextService;
            this.delayer = new async_1.ThrottledDelayer(OpenSymbolHandler.SEARCH_DELAY);
            this.options = Object.create(null);
        }
        OpenSymbolHandler.prototype.setOptions = function (options) {
            this.options = options;
        };
        OpenSymbolHandler.prototype.canRun = function () {
            return true;
        };
        OpenSymbolHandler.prototype.getResults = function (searchValue) {
            var _this = this;
            searchValue = searchValue.trim();
            var promise;
            // Respond directly to empty search
            if (!searchValue) {
                promise = winjs_base_1.TPromise.as([]);
            }
            else if (!this.options.skipDelay) {
                promise = this.delayer.trigger(function () { return _this.doGetResults(searchValue); }); // Run search with delay as needed
            }
            else {
                promise = this.doGetResults(searchValue);
            }
            return promise.then(function (e) { return new quickOpenModel_1.QuickOpenModel(e); });
        };
        OpenSymbolHandler.prototype.doGetResults = function (searchValue) {
            var _this = this;
            return search_1.getNavigateToItems(searchValue).then(function (bearings) {
                return _this.toQuickOpenEntries(bearings, searchValue);
            });
        };
        OpenSymbolHandler.prototype.toQuickOpenEntries = function (types, searchValue) {
            var _this = this;
            var results = [];
            // Convert to Entries
            types.forEach(function (element) {
                if (_this.options.skipLocalSymbols && !!element.containerName) {
                    return; // ignore local symbols if we are told so
                }
                // Find Highlights
                var highlights = filters.matchesFuzzy(searchValue, element.name);
                if (highlights) {
                    var resource = element.resourceUri;
                    if (resource.scheme === 'file') {
                        var path = labels.getPathLabel(resource, _this.contextService);
                        var container = void (0);
                        // Type is top level in module with path spec, use path info then (/folder/file.ts)
                        if (element.containerName === path) {
                            container = path;
                        }
                        else if (element.containerName === resource.toString() && element.containerName.indexOf('/') >= 0) {
                            container = element.containerName.substr(element.containerName.lastIndexOf('/') + 1);
                        }
                        else if (element.containerName && element.containerName.indexOf('.') >= 0) {
                            container = element.containerName.substr(element.containerName.lastIndexOf('.') + 1);
                        }
                        else {
                            container = element.containerName || path;
                        }
                        results.push(_this.instantiationService.createInstance(SymbolEntry, element.name, element.parameters, container, resource, element.type, element.range, highlights));
                    }
                }
            });
            // Sort (Standalone only)
            if (!this.options.skipSorting) {
                return results.sort(this.sort.bind(this, searchValue.toLowerCase()));
            }
            return results;
        };
        OpenSymbolHandler.prototype.sort = function (searchValue, elementA, elementB) {
            // Sort by Type if name is identical
            var elementAName = elementA.getName().toLowerCase();
            var elementBName = elementB.getName().toLowerCase();
            if (elementAName === elementBName) {
                var elementAType = elementA.getType();
                var elementBType = elementB.getType();
                return elementAType.localeCompare(elementBType);
            }
            return quickOpenModel_1.QuickOpenEntry.compare(elementA, elementB, searchValue);
        };
        OpenSymbolHandler.prototype.getGroupLabel = function () {
            return nls.localize(1, null);
        };
        OpenSymbolHandler.prototype.getEmptyLabel = function (searchString) {
            if (searchString.length > 0) {
                return nls.localize(2, null);
            }
            return nls.localize(3, null);
        };
        OpenSymbolHandler.prototype.getAutoFocus = function (searchValue) {
            return {
                autoFocusFirstEntry: true,
                autoFocusPrefixMatch: searchValue.trim()
            };
        };
        OpenSymbolHandler.SEARCH_DELAY = 500; // This delay accommodates for the user typing a word and then stops typing to start searching
        OpenSymbolHandler = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, modeService_1.IModeService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, workspace_1.IWorkspaceContextService)
        ], OpenSymbolHandler);
        return OpenSymbolHandler;
    }(quickopen_1.QuickOpenHandler));
    exports.OpenSymbolHandler = OpenSymbolHandler;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[28], __M([0,1,3,4,20,29,30,31,9,5,32,6,7,13,19,17,8,21,2]), function (require, exports, winjs_base_1, nls, async_1, types, platform_1, scorer, paths, labels, strings, quickOpenModel_1, quickopen_1, openFileHandler_1, openSymbolHandler, message_1, instantiation_1, contextService_1, configuration_1) {
    'use strict';
    // OpenSymbolHandler is used from an extension and must be in the main bundle file so it can load
    exports.OpenSymbolHandler = openSymbolHandler.OpenSymbolHandler;
    var OpenAnythingHandler = (function (_super) {
        __extends(OpenAnythingHandler, _super);
        function OpenAnythingHandler(messageService, contextService, instantiationService, configurationService) {
            _super.call(this);
            this.messageService = messageService;
            this.contextService = contextService;
            this.configurationService = configurationService;
            // Instantiate delegate handlers
            this.openSymbolHandler = instantiationService.createInstance(exports.OpenSymbolHandler);
            this.openFileHandler = instantiationService.createInstance(openFileHandler_1.OpenFileHandler);
            this.openSymbolHandler.setOptions({
                skipDelay: true,
                skipLocalSymbols: true,
                skipSorting: true // we sort combined with file results
            });
            this.resultsToSearchCache = Object.create(null);
            this.scorerCache = Object.create(null);
            this.delayer = new async_1.ThrottledDelayer(OpenAnythingHandler.SEARCH_DELAY);
        }
        OpenAnythingHandler.prototype.getResults = function (searchValue) {
            var _this = this;
            searchValue = searchValue.replace(/ /g, ''); // get rid of all whitespace
            // Help Windows users to search for paths when using slash
            if (platform_1.isWindows) {
                searchValue = searchValue.replace(/\//g, '\\');
            }
            // Cancel any pending search
            this.cancelPendingSearch();
            // Treat this call as the handler being in use
            this.isClosed = false;
            // Respond directly to empty search
            if (!searchValue) {
                return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel());
            }
            // Find a suitable range from the pattern looking for ":" and "#"
            var searchWithRange = this.extractRange(searchValue);
            if (searchWithRange) {
                searchValue = searchWithRange.search; // ignore range portion in query
            }
            // Check Cache first
            var cachedResults = this.getResultsFromCache(searchValue, searchWithRange ? searchWithRange.range : null);
            if (cachedResults) {
                return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel(cachedResults));
            }
            // The throttler needs a factory for its promises
            var promiseFactory = function () {
                var receivedFileResults = false;
                // Symbol Results (unless a range is specified)
                var resultPromises = [];
                if (!searchWithRange) {
                    var symbolSearchTimeoutPromiseFn_1 = function (timeout) {
                        return winjs_base_1.TPromise.timeout(timeout).then(function () {
                            // As long as the file search query did not return, push out the symbol timeout
                            // so that the symbol search has a chance to return results at least as long as
                            // the file search did not return.
                            if (!receivedFileResults) {
                                return symbolSearchTimeoutPromiseFn_1(OpenAnythingHandler.SYMBOL_SEARCH_SUBSEQUENT_TIMEOUT);
                            }
                            // Empty result since timeout was reached and file results are in
                            return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel());
                        });
                    };
                    var lookupPromise = _this.openSymbolHandler.getResults(searchValue);
                    var timeoutPromise = symbolSearchTimeoutPromiseFn_1(OpenAnythingHandler.SYMBOL_SEARCH_INITIAL_TIMEOUT);
                    // Timeout lookup after N seconds to not block file search results
                    resultPromises.push(winjs_base_1.TPromise.any([lookupPromise, timeoutPromise]).then(function (result) {
                        return result.value;
                    }));
                }
                else {
                    resultPromises.push(winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel())); // We need this empty promise because we are using the throttler below!
                }
                // File Results
                resultPromises.push(_this.openFileHandler.getResults(searchValue).then(function (results) {
                    receivedFileResults = true;
                    return results;
                }));
                // Join and sort unified
                _this.pendingSearch = winjs_base_1.TPromise.join(resultPromises).then(function (results) {
                    _this.pendingSearch = null;
                    // If the quick open widget has been closed meanwhile, ignore the result
                    if (_this.isClosed) {
                        return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel());
                    }
                    // Combine symbol results and file results
                    var result = results[0].entries.concat(results[1].entries);
                    // Sort
                    var normalizedSearchValue = strings.stripWildcards(searchValue).toLowerCase();
                    result.sort(function (elementA, elementB) { return quickOpenModel_1.QuickOpenEntry.compareByScore(elementA, elementB, searchValue, normalizedSearchValue, _this.scorerCache); });
                    // Apply Range
                    result.forEach(function (element) {
                        if (element instanceof openFileHandler_1.FileEntry) {
                            element.setRange(searchWithRange ? searchWithRange.range : null);
                        }
                    });
                    // Cache for fast lookup
                    _this.resultsToSearchCache[searchValue] = result;
                    // Cap the number of results to make the view snappy
                    var viewResults = result.length > OpenAnythingHandler.MAX_DISPLAYED_RESULTS ? result.slice(0, OpenAnythingHandler.MAX_DISPLAYED_RESULTS) : result;
                    // Apply highlights to file entries
                    viewResults.forEach(function (entry) {
                        if (entry instanceof openFileHandler_1.FileEntry) {
                            var _a = quickOpenModel_1.QuickOpenEntry.highlight(entry, searchValue, true /* fuzzy highlight */), labelHighlights = _a.labelHighlights, descriptionHighlights = _a.descriptionHighlights;
                            entry.setHighlights(labelHighlights, descriptionHighlights);
                        }
                    });
                    return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel(viewResults));
                }, function (error) {
                    _this.pendingSearch = null;
                    _this.messageService.show(message_1.Severity.Error, error);
                });
                return _this.pendingSearch;
            };
            // Trigger through delayer to prevent accumulation while the user is typing
            return this.delayer.trigger(promiseFactory);
        };
        OpenAnythingHandler.prototype.extractRange = function (value) {
            var range = null;
            // Find Line/Column number from search value using RegExp
            var patternMatch = OpenAnythingHandler.LINE_COLON_PATTERN.exec(value);
            if (patternMatch && patternMatch.length > 1) {
                var startLineNumber = parseInt(patternMatch[1], 10);
                // Line Number
                if (types.isNumber(startLineNumber)) {
                    range = {
                        startLineNumber: startLineNumber,
                        startColumn: 1,
                        endLineNumber: startLineNumber,
                        endColumn: 1
                    };
                    // Column Number
                    if (patternMatch.length > 3) {
                        var startColumn = parseInt(patternMatch[3], 10);
                        if (types.isNumber(startColumn)) {
                            range.startColumn = startColumn;
                            range.endColumn = startColumn;
                        }
                    }
                }
                else if (patternMatch[1] === '') {
                    range = {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: 1,
                        endColumn: 1
                    };
                }
            }
            if (range) {
                return {
                    search: value.substr(0, patternMatch.index),
                    range: range
                };
            }
            return null;
        };
        OpenAnythingHandler.prototype.getResultsFromCache = function (searchValue, range) {
            var _this = this;
            if (range === void 0) { range = null; }
            if (paths.isAbsolute(searchValue)) {
                return null; // bypass cache if user looks up an absolute path where matching goes directly on disk
            }
            // Find cache entries by prefix of search value
            var cachedEntries;
            for (var previousSearch in this.resultsToSearchCache) {
                // If we narrow down, we might be able to reuse the cached results
                if (searchValue.indexOf(previousSearch) === 0) {
                    if (searchValue.indexOf(paths.nativeSep) >= 0 && previousSearch.indexOf(paths.nativeSep) < 0) {
                        continue; // since a path character widens the search for potential more matches, require it in previous search too
                    }
                    cachedEntries = this.resultsToSearchCache[previousSearch];
                    break;
                }
            }
            if (!cachedEntries) {
                return null;
            }
            // Pattern match on results and adjust highlights
            var results = [];
            var normalizedSearchValueLowercase = strings.stripWildcards(searchValue).toLowerCase();
            for (var i = 0; i < cachedEntries.length; i++) {
                var entry = cachedEntries[i];
                // Check for file entries if range is used
                if (range && !(entry instanceof openFileHandler_1.FileEntry)) {
                    continue;
                }
                // Check if this entry is a match for the search value
                var resource = entry.getResource(); // can be null for symbol results!
                var targetToMatch = resource ? labels.getPathLabel(resource, this.contextService) : entry.getLabel();
                if (!scorer.matches(targetToMatch, normalizedSearchValueLowercase)) {
                    continue;
                }
                results.push(entry);
            }
            // Sort
            results.sort(function (elementA, elementB) { return quickOpenModel_1.QuickOpenEntry.compareByScore(elementA, elementB, searchValue, normalizedSearchValueLowercase, _this.scorerCache); });
            // Apply Range
            results.forEach(function (element) {
                if (element instanceof openFileHandler_1.FileEntry) {
                    element.setRange(range);
                }
            });
            // Cap the number of results to make the view snappy
            var viewResults = results.length > OpenAnythingHandler.MAX_DISPLAYED_RESULTS ? results.slice(0, OpenAnythingHandler.MAX_DISPLAYED_RESULTS) : results;
            // Apply highlights
            viewResults.forEach(function (entry) {
                var _a = quickOpenModel_1.QuickOpenEntry.highlight(entry, searchValue, true /* fuzzy highlight */), labelHighlights = _a.labelHighlights, descriptionHighlights = _a.descriptionHighlights;
                entry.setHighlights(labelHighlights, descriptionHighlights);
            });
            return viewResults;
        };
        OpenAnythingHandler.prototype.getGroupLabel = function () {
            return nls.localize(0, null);
        };
        OpenAnythingHandler.prototype.getAutoFocus = function (searchValue) {
            return {
                autoFocusFirstEntry: true
            };
        };
        OpenAnythingHandler.prototype.onClose = function (canceled) {
            this.isClosed = true;
            // Cancel any pending search
            this.cancelPendingSearch();
            // Clear Cache
            this.resultsToSearchCache = Object.create(null);
            this.scorerCache = Object.create(null);
            // Propagate
            this.openSymbolHandler.onClose(canceled);
            this.openFileHandler.onClose(canceled);
        };
        OpenAnythingHandler.prototype.cancelPendingSearch = function () {
            if (this.pendingSearch) {
                this.pendingSearch.cancel();
                this.pendingSearch = null;
            }
        };
        OpenAnythingHandler.LINE_COLON_PATTERN = /[#|:|\(](\d*)([#|:|,](\d*))?\)?$/;
        OpenAnythingHandler.SYMBOL_SEARCH_INITIAL_TIMEOUT = 500; // Ignore symbol search after a timeout to not block search results
        OpenAnythingHandler.SYMBOL_SEARCH_SUBSEQUENT_TIMEOUT = 100;
        OpenAnythingHandler.SEARCH_DELAY = 300; // This delay accommodates for the user typing a word and then stops typing to start searching
        OpenAnythingHandler.MAX_DISPLAYED_RESULTS = 512;
        OpenAnythingHandler = __decorate([
            __param(0, message_1.IMessageService),
            __param(1, contextService_1.IWorkspaceContextService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, configuration_1.IConfigurationService)
        ], OpenAnythingHandler);
        return OpenAnythingHandler;
    }(quickopen_1.QuickOpenHandler));
    exports.OpenAnythingHandler = OpenAnythingHandler;
});

}).call(this);
//# sourceMappingURL=openAnythingHandler.js.map
