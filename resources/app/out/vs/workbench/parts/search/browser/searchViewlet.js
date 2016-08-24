/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/keyCodes","vs/nls!vs/workbench/parts/search/browser/searchViewlet","vs/base/common/strings","vs/base/browser/builder","vs/nls","vs/css!vs/workbench/parts/search/browser/media/searchviewlet","vs/nls!vs/workbench/parts/search/browser/searchResultsView","vs/workbench/parts/search/browser/patternInputWidget","vs/base/browser/ui/inputbox/inputBox","vs/nls!vs/workbench/parts/search/browser/patternInputWidget","vs/workbench/parts/search/common/searchQuery","vs/platform/search/common/search","vs/platform/configuration/common/configuration","vs/workbench/parts/search/browser/searchResultsView","vs/base/common/errors","vs/base/browser/dom","vs/base/common/winjs.base","vs/workbench/parts/search/common/searchModel","vs/platform/workspace/common/workspace","vs/workbench/parts/search/browser/searchActions","vs/platform/instantiation/common/instantiation","vs/base/common/event","vs/base/common/paths","vs/base/common/glob","vs/base/common/objects","vs/base/parts/tree/browser/actionsRenderer","vs/base/browser/ui/countBadge/countBadge","vs/base/browser/ui/fileLabel/fileLabel","vs/base/browser/ui/leftRightWidget/leftRightWidget","vs/base/parts/tree/browser/treeDefaults","vs/css!vs/workbench/parts/search/browser/searchViewlet","vs/base/browser/ui/checkbox/checkbox","vs/base/common/severity","vs/editor/common/core/range","vs/base/browser/ui/widget","vs/base/common/platform","vs/workbench/parts/search/browser/searchViewlet","vs/editor/common/editorCommon","vs/base/common/lifecycle","vs/base/browser/ui/aria/aria","vs/base/common/types","vs/base/browser/keyboardEvent","vs/base/browser/ui/findinput/findInput","vs/base/parts/tree/browser/treeImpl","vs/workbench/common/memento","vs/workbench/browser/actions/openSettings","vs/workbench/common/events","vs/workbench/services/group/common/groupService","vs/workbench/common/editor","vs/platform/files/common/files","vs/workbench/browser/viewlet","vs/workbench/parts/search/common/constants","vs/workbench/services/editor/common/editorService","vs/platform/storage/common/storage","vs/platform/contextview/browser/contextView","vs/platform/event/common/event","vs/platform/message/common/message","vs/platform/progress/common/progress","vs/platform/keybinding/common/keybinding","vs/platform/telemetry/common/telemetry","vs/workbench/parts/search/browser/searchWidget","vs/workbench/parts/search/common/replace","vs/workbench/browser/actionBarRegistry"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[7], __M([32]), {});
define(__m[11], __M([6,3]), function(nls, data) { return nls.create("vs/workbench/parts/search/browser/patternInputWidget", data); });
define(__m[8], __M([6,3]), function(nls, data) { return nls.create("vs/workbench/parts/search/browser/searchResultsView", data); });

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(__m[9], __M([0,1,11,4,5,36,25,33,10,2,23]), function (require, exports, nls, strings, builder_1, widget_1, glob_1, checkbox_1, inputBox_1, keyCodes_1, event_1) {
    "use strict";
    var PatternInputWidget = (function (_super) {
        __extends(PatternInputWidget, _super);
        function PatternInputWidget(parent, contextViewProvider, options) {
            if (options === void 0) { options = Object.create(null); }
            _super.call(this);
            this.contextViewProvider = contextViewProvider;
            this._onSubmit = this._register(new event_1.Emitter());
            this.onSubmit = this._onSubmit.event;
            this.onOptionChange = null;
            this.width = options.width || 100;
            this.placeholder = options.placeholder || '';
            this.ariaLabel = options.ariaLabel || nls.localize(0, null);
            this.toDispose = [];
            this.pattern = null;
            this.domNode = null;
            this.inputNode = null;
            this.inputBox = null;
            this.render();
            parent.appendChild(this.domNode);
        }
        PatternInputWidget.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.pattern.dispose();
            this.toDispose.forEach(function (element) {
                element();
            });
            this.toDispose = [];
        };
        PatternInputWidget.prototype.on = function (eventType, handler) {
            switch (eventType) {
                case 'keydown':
                case 'keyup':
                    builder_1.$(this.inputBox.inputElement).on(eventType, handler);
                    break;
                case PatternInputWidget.OPTION_CHANGE:
                    this.onOptionChange = handler;
                    break;
            }
            return this;
        };
        PatternInputWidget.prototype.setWidth = function (newWidth) {
            this.width = newWidth;
            this.domNode.style.width = this.width + 'px';
            this.contextViewProvider.layout();
            this.setInputWidth();
        };
        PatternInputWidget.prototype.getValue = function () {
            return this.inputBox.value;
        };
        PatternInputWidget.prototype.setValue = function (value) {
            if (this.inputBox.value !== value) {
                this.inputBox.value = value;
            }
        };
        PatternInputWidget.prototype.getGlob = function () {
            var pattern = this.getValue();
            var isGlobPattern = this.isGlobPattern();
            if (!pattern) {
                return void 0;
            }
            var glob = Object.create(null);
            var segments;
            if (isGlobPattern) {
                segments = glob_1.splitGlobAware(pattern, ',').map(function (s) { return s.trim(); }).filter(function (s) { return !!s.length; });
            }
            else {
                segments = pattern.split(',').map(function (s) { return strings.trim(s.trim(), '/'); }).filter(function (s) { return !!s.length; }).map(function (p) {
                    if (p[0] === '.') {
                        p = '*' + p; // convert ".js" to "*.js"
                    }
                    return strings.format('{{0}/**,**/{1}}', p, p); // convert foo to {foo/**,**/foo} to cover files and folders
                });
            }
            return segments.reduce(function (prev, cur) { glob[cur] = true; return glob; }, glob);
        };
        PatternInputWidget.prototype.select = function () {
            this.inputBox.select();
        };
        PatternInputWidget.prototype.focus = function () {
            this.inputBox.focus();
        };
        PatternInputWidget.prototype.isGlobPattern = function () {
            return this.pattern.checked;
        };
        PatternInputWidget.prototype.setIsGlobPattern = function (value) {
            this.pattern.checked = value;
            this.setInputWidth();
        };
        PatternInputWidget.prototype.setInputWidth = function () {
            var w = this.width - this.pattern.width();
            this.inputBox.width = w;
        };
        PatternInputWidget.prototype.render = function () {
            var _this = this;
            this.domNode = document.createElement('div');
            this.domNode.style.width = this.width + 'px';
            builder_1.$(this.domNode).addClass('monaco-findInput');
            this.inputBox = new inputBox_1.InputBox(this.domNode, this.contextViewProvider, {
                placeholder: this.placeholder || '',
                ariaLabel: this.ariaLabel || '',
                validationOptions: {
                    validation: null,
                    showMessage: true
                }
            });
            this.onkeyup(this.inputBox.inputElement, function (keyboardEvent) { return _this.onInputKeyUp(keyboardEvent); });
            this.pattern = new checkbox_1.Checkbox({
                actionClassName: 'pattern',
                title: nls.localize(1, null),
                isChecked: false,
                onChange: function (viaKeyboard) {
                    _this.onOptionChange(null);
                    if (!viaKeyboard) {
                        _this.inputBox.focus();
                    }
                    _this.setInputWidth();
                    if (_this.isGlobPattern()) {
                        _this.showGlobHelp();
                    }
                    else {
                        _this.inputBox.hideMessage();
                    }
                }
            });
            builder_1.$(this.pattern.domNode).on('mouseover', function () {
                if (_this.isGlobPattern()) {
                    _this.showGlobHelp();
                }
            });
            builder_1.$(this.pattern.domNode).on(['mouseleave', 'mouseout'], function () {
                _this.inputBox.hideMessage();
            });
            this.setInputWidth();
            var controls = document.createElement('div');
            controls.className = 'controls';
            controls.appendChild(this.pattern.domNode);
            this.domNode.appendChild(controls);
        };
        PatternInputWidget.prototype.showGlobHelp = function () {
            this.inputBox.showMessage({
                type: inputBox_1.MessageType.INFO,
                formatContent: true,
                content: nls.localize(2, null)
            }, true);
        };
        PatternInputWidget.prototype.onInputKeyUp = function (keyboardEvent) {
            switch (keyboardEvent.keyCode) {
                case keyCodes_1.KeyCode.Enter:
                    this._onSubmit.fire();
                    return;
                default:
                    return;
            }
        };
        PatternInputWidget.OPTION_CHANGE = 'optionChange';
        return PatternInputWidget;
    }(widget_1.Widget));
    exports.PatternInputWidget = PatternInputWidget;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[12], __M([0,1,26,13,14]), function (require, exports, objects, search, configuration_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[15], __M([0,1,8,4,37,16,24,17,5,18,27,28,29,30,31,64,19,20,35,2,21,22]), function (require, exports, nls, strings, platform, errors, paths, dom, builder_1, winjs_base_1, actionsRenderer_1, countBadge_1, fileLabel_1, leftRightWidget_1, treeDefaults_1, actionBarRegistry_1, searchModel_1, workspace_1, range_1, keyCodes_1, searchActions_1, instantiation_1) {
    "use strict";
    var SearchDataSource = (function () {
        function SearchDataSource() {
        }
        SearchDataSource.prototype.getId = function (tree, element) {
            if (element instanceof searchModel_1.FileMatch) {
                return element.id();
            }
            if (element instanceof searchModel_1.Match) {
                return element.id();
            }
            return 'root';
        };
        SearchDataSource.prototype.getChildren = function (tree, element) {
            var value = [];
            if (element instanceof searchModel_1.FileMatch) {
                value = element.matches();
            }
            else if (element instanceof searchModel_1.SearchResult) {
                value = element.matches();
            }
            return winjs_base_1.TPromise.as(value);
        };
        SearchDataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof searchModel_1.FileMatch || element instanceof searchModel_1.SearchResult;
        };
        SearchDataSource.prototype.getParent = function (tree, element) {
            var value = null;
            if (element instanceof searchModel_1.Match) {
                value = element.parent();
            }
            else if (element instanceof searchModel_1.FileMatch) {
                value = element.parent();
            }
            return winjs_base_1.TPromise.as(value);
        };
        return SearchDataSource;
    }());
    exports.SearchDataSource = SearchDataSource;
    var SearchSorter = (function () {
        function SearchSorter() {
        }
        SearchSorter.prototype.compare = function (tree, elementA, elementB) {
            if (elementA instanceof searchModel_1.FileMatch && elementB instanceof searchModel_1.FileMatch) {
                return elementA.resource().fsPath.localeCompare(elementB.resource().fsPath) || elementA.name().localeCompare(elementB.name());
            }
            if (elementA instanceof searchModel_1.Match && elementB instanceof searchModel_1.Match) {
                return range_1.Range.compareRangesUsingStarts(elementA.range(), elementB.range());
            }
        };
        return SearchSorter;
    }());
    exports.SearchSorter = SearchSorter;
    var SearchActionProvider = (function (_super) {
        __extends(SearchActionProvider, _super);
        function SearchActionProvider(viewlet, instantiationService) {
            _super.call(this);
            this.viewlet = viewlet;
            this.instantiationService = instantiationService;
        }
        SearchActionProvider.prototype.hasActions = function (tree, element) {
            var input = tree.getInput();
            return element instanceof searchModel_1.FileMatch || (input.searchModel.isReplaceActive() || element instanceof searchModel_1.Match) || _super.prototype.hasActions.call(this, tree, element);
        };
        SearchActionProvider.prototype.getActions = function (tree, element) {
            var _this = this;
            return _super.prototype.getActions.call(this, tree, element).then(function (actions) {
                var input = tree.getInput();
                if (element instanceof searchModel_1.FileMatch) {
                    actions.unshift(new searchActions_1.RemoveAction(tree, element));
                    if (input.searchModel.isReplaceActive() && element.count() > 0) {
                        actions.unshift(_this.instantiationService.createInstance(searchActions_1.ReplaceAllAction, tree, element, _this.viewlet));
                    }
                }
                if (element instanceof searchModel_1.Match) {
                    if (input.searchModel.isReplaceActive()) {
                        actions.unshift(_this.instantiationService.createInstance(searchActions_1.ReplaceAction, tree, element, _this.viewlet), new searchActions_1.RemoveAction(tree, element));
                    }
                }
                return actions;
            });
        };
        SearchActionProvider = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], SearchActionProvider);
        return SearchActionProvider;
    }(actionBarRegistry_1.ContributableActionProvider));
    var SearchRenderer = (function (_super) {
        __extends(SearchRenderer, _super);
        function SearchRenderer(actionRunner, viewlet, contextService, instantiationService) {
            _super.call(this, {
                actionProvider: instantiationService.createInstance(SearchActionProvider, viewlet),
                actionRunner: actionRunner
            });
            this.contextService = contextService;
            this.instantiationService = instantiationService;
        }
        SearchRenderer.prototype.getContentHeight = function (tree, element) {
            return 22;
        };
        SearchRenderer.prototype.renderContents = function (tree, element, domElement, previousCleanupFn) {
            var _this = this;
            // File
            if (element instanceof searchModel_1.FileMatch) {
                var fileMatch_1 = element;
                var container = builder_1.$('.filematch');
                var leftRenderer = void 0;
                var rightRenderer = void 0;
                var widget = void 0;
                leftRenderer = function (left) {
                    new fileLabel_1.FileLabel(left, fileMatch_1.resource(), _this.contextService);
                    return null;
                };
                rightRenderer = function (right) {
                    var len = fileMatch_1.count();
                    return new countBadge_1.CountBadge(right, len, len > 1 ? nls.localize(0, null, len) : nls.localize(1, null, len));
                };
                widget = new leftRightWidget_1.LeftRightWidget(container, leftRenderer, rightRenderer);
                container.appendTo(domElement);
                return widget.dispose.bind(widget);
            }
            else if (element instanceof searchModel_1.Match) {
                dom.addClass(domElement, 'linematch');
                var match = element;
                var elements = [];
                var preview = match.preview();
                elements.push('<span>');
                elements.push(strings.escape(preview.before));
                var searchModel = tree.getInput().searchModel;
                var showReplaceText = searchModel.isReplaceActive() && !!searchModel.replaceString;
                elements.push('</span><span class="' + (showReplaceText ? 'replace ' : '') + 'findInFileMatch">');
                elements.push(strings.escape(preview.inside));
                if (showReplaceText) {
                    elements.push('</span><span class="replaceMatch">');
                    elements.push(strings.escape(match.replaceString));
                }
                elements.push('</span><span>');
                elements.push(strings.escape(preview.after));
                elements.push('</span>');
                builder_1.$('a.plain')
                    .innerHtml(elements.join(strings.empty))
                    .title((preview.before + (showReplaceText ? match.replaceString : preview.inside) + preview.after).trim().substr(0, 999))
                    .appendTo(domElement);
            }
            return null;
        };
        SearchRenderer = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, instantiation_1.IInstantiationService)
        ], SearchRenderer);
        return SearchRenderer;
    }(actionsRenderer_1.ActionsRenderer));
    exports.SearchRenderer = SearchRenderer;
    var SearchAccessibilityProvider = (function () {
        function SearchAccessibilityProvider(contextService) {
            this.contextService = contextService;
        }
        SearchAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof searchModel_1.FileMatch) {
                var path = this.contextService.toWorkspaceRelativePath(element.resource()) || element.resource().fsPath;
                return nls.localize(2, null, element.count(), element.name(), paths.dirname(path));
            }
            if (element instanceof searchModel_1.Match) {
                var match = element;
                var input = tree.getInput();
                if (input.searchModel.isReplaceActive()) {
                    var preview = match.preview();
                    return nls.localize(3, null, preview.before + match.replaceString + preview.after);
                }
                return nls.localize(4, null, match.text());
            }
        };
        SearchAccessibilityProvider = __decorate([
            __param(0, workspace_1.IWorkspaceContextService)
        ], SearchAccessibilityProvider);
        return SearchAccessibilityProvider;
    }());
    exports.SearchAccessibilityProvider = SearchAccessibilityProvider;
    var SearchController = (function (_super) {
        __extends(SearchController, _super);
        function SearchController(viewlet, instantiationService) {
            var _this = this;
            _super.call(this, { clickBehavior: treeDefaults_1.ClickBehavior.ON_MOUSE_DOWN });
            this.viewlet = viewlet;
            this.instantiationService = instantiationService;
            if (platform.isMacintosh) {
                this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.CTRLCMD_BACKSPACE, function (tree, event) { _this.onDelete(tree, event); });
                this.upKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.WINCTRL_ENTER, this.onEnter.bind(this));
            }
            else {
                this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.DELETE, function (tree, event) { _this.onDelete(tree, event); });
                this.upKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.CTRLCMD_ENTER, this.onEnter.bind(this));
            }
            this.downKeyBindingDispatcher.set(searchActions_1.ReplaceAllAction.KEY_BINDING, function (tree, event) { _this.onReplaceAll(tree, event); });
            this.downKeyBindingDispatcher.set(searchActions_1.ReplaceAction.KEY_BINDING, function (tree, event) { _this.onReplace(tree, event); });
            this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.ESCAPE, function (tree, event) { _this.onEscape(tree, event); });
        }
        SearchController.prototype.onEscape = function (tree, event) {
            if (this.viewlet.cancelSearch()) {
                return true;
            }
            return _super.prototype.onEscape.call(this, tree, event);
        };
        SearchController.prototype.onDelete = function (tree, event) {
            var input = tree.getInput();
            var result = false;
            var element = tree.getFocus();
            if (element instanceof searchModel_1.FileMatch ||
                (element instanceof searchModel_1.Match && input.searchModel.isReplaceActive())) {
                new searchActions_1.RemoveAction(tree, element).run().done(null, errors.onUnexpectedError);
                result = true;
            }
            return result;
        };
        SearchController.prototype.onReplace = function (tree, event) {
            var input = tree.getInput();
            var result = false;
            var element = tree.getFocus();
            if (element instanceof searchModel_1.Match && input.searchModel.isReplaceActive()) {
                this.instantiationService.createInstance(searchActions_1.ReplaceAction, tree, element, this.viewlet).run().done(null, errors.onUnexpectedError);
                result = true;
            }
            return result;
        };
        SearchController.prototype.onReplaceAll = function (tree, event) {
            var result = false;
            var element = tree.getFocus();
            if (element instanceof searchModel_1.FileMatch && element.count() > 0) {
                this.instantiationService.createInstance(searchActions_1.ReplaceAllAction, tree, element, this.viewlet).run().done(null, errors.onUnexpectedError);
                result = true;
            }
            return result;
        };
        SearchController.prototype.onUp = function (tree, event) {
            if (tree.getNavigator().first() === tree.getFocus()) {
                this.viewlet.moveFocusFromResults();
                return true;
            }
            return _super.prototype.onUp.call(this, tree, event);
        };
        SearchController.prototype.onSpace = function (tree, event) {
            var element = tree.getFocus();
            if (element instanceof searchModel_1.Match) {
                return this.onEnter(tree, event);
            }
            _super.prototype.onSpace.call(this, tree, event);
        };
        SearchController = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], SearchController);
        return SearchController;
    }(treeDefaults_1.DefaultController));
    exports.SearchController = SearchController;
    var SearchFilter = (function () {
        function SearchFilter() {
        }
        SearchFilter.prototype.isVisible = function (tree, element) {
            return !(element instanceof searchModel_1.FileMatch) || element.matches().length > 0;
        };
        return SearchFilter;
    }());
    exports.SearchFilter = SearchFilter;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[38], __M([0,1,3,18,39,40,16,41,42,4,17,43,5,44,45,46,47,48,49,50,51,52,19,12,53,10,54,55,14,56,57,22,58,13,59,20,60,61,2,9,15,62,21,63,34,7]), function (require, exports, nls, winjs_base_1, editorCommon_1, lifecycle, errors, aria, types_1, strings, dom, keyboardEvent_1, builder_1, findInput_1, treeImpl_1, memento_1, openSettings_1, events_1, groupService_1, editor_1, files_1, viewlet_1, searchModel_1, searchQuery_1, constants_1, inputBox_1, editorService_1, storage_1, configuration_1, contextView_1, event_1, instantiation_1, message_1, search_1, progress_1, workspace_1, keybinding_1, telemetry_1, keyCodes_1, patternInputWidget_1, searchResultsView_1, searchWidget_1, searchActions_1, replace_1, severity_1) {
    'use strict';
    var SearchViewlet = (function (_super) {
        __extends(SearchViewlet, _super);
        function SearchViewlet(telemetryService, eventService, editorService, editorGroupService, progressService, messageService, storageService, contextViewService, instantiationService, configurationService, contextService, searchService, keybindingService, replaceService) {
            var _this = this;
            _super.call(this, constants_1.VIEWLET_ID, telemetryService);
            this.eventService = eventService;
            this.editorService = editorService;
            this.editorGroupService = editorGroupService;
            this.progressService = progressService;
            this.messageService = messageService;
            this.storageService = storageService;
            this.contextViewService = contextViewService;
            this.instantiationService = instantiationService;
            this.configurationService = configurationService;
            this.contextService = contextService;
            this.searchService = searchService;
            this.keybindingService = keybindingService;
            this.replaceService = replaceService;
            this.toDispose = [];
            this.viewletVisible = keybindingService.createKey('searchViewletVisible', true);
            this.callOnModelChange = [];
            this.queryBuilder = this.instantiationService.createInstance(searchQuery_1.QueryBuilder);
            this.viewletSettings = this.getMemento(storageService, memento_1.Scope.WORKSPACE);
            this.toUnbind.push(this.eventService.addListener2(files_1.EventType.FILE_CHANGES, function (e) { return _this.onFilesChanged(e); }));
            this.toUnbind.push(this.eventService.addListener2(events_1.EventType.UNTITLED_FILE_SAVED, function (e) { return _this.onUntitledFileSaved(e); }));
            this.toUnbind.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(e.config); }));
        }
        SearchViewlet.prototype.onConfigurationUpdated = function (configuration) {
            this.updateGlobalPatternExclusions(configuration);
        };
        SearchViewlet.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            this.viewModel = this.instantiationService.createInstance(searchModel_1.SearchModel);
            var builder;
            this.domNode = parent.div({
                'class': 'search-viewlet'
            }, function (div) {
                builder = div;
            });
            builder.div({ 'class': ['search-widgets-container'] }, function (div) {
                _this.searchWidgetsContainer = div;
            });
            this.createSearchWidget(this.searchWidgetsContainer);
            var filePatterns = this.viewletSettings['query.filePatterns'] || '';
            var patternExclusions = this.viewletSettings['query.folderExclusions'] || '';
            var exclusionsUsePattern = this.viewletSettings['query.exclusionsUsePattern'];
            var includesUsePattern = this.viewletSettings['query.includesUsePattern'];
            var patternIncludes = this.viewletSettings['query.folderIncludes'] || '';
            var onKeyUp = function (e) {
                if (e.keyCode === keyCodes_1.KeyCode.Enter) {
                    _this.onQueryChanged(true);
                }
                else if (e.keyCode === keyCodes_1.KeyCode.Escape) {
                    _this.cancelSearch();
                }
            };
            this.queryDetails = this.searchWidgetsContainer.div({ 'class': ['query-details'] }, function (builder) {
                builder.div({ 'class': 'more', 'tabindex': 0, 'role': 'button', 'title': nls.localize(0, null) })
                    .on(dom.EventType.CLICK, function (e) {
                    dom.EventHelper.stop(e);
                    _this.toggleFileTypes(true);
                }).on(dom.EventType.KEY_UP, function (e) {
                    var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                    if (event.equals(keyCodes_1.CommonKeybindings.ENTER) || event.equals(keyCodes_1.CommonKeybindings.SPACE)) {
                        dom.EventHelper.stop(e);
                        _this.toggleFileTypes();
                    }
                });
                //folder includes list
                builder.div({ 'class': 'file-types' }, function (builder) {
                    var title = nls.localize(1, null);
                    builder.element('h4', { text: title });
                    _this.inputPatternIncludes = new patternInputWidget_1.PatternInputWidget(builder.getContainer(), _this.contextViewService, {
                        ariaLabel: nls.localize(2, null)
                    });
                    _this.inputPatternIncludes.setIsGlobPattern(includesUsePattern);
                    _this.inputPatternIncludes.setValue(patternIncludes);
                    _this.inputPatternIncludes
                        .on(dom.EventType.KEY_UP, onKeyUp)
                        .on(dom.EventType.KEY_DOWN, function (e) {
                        var keyboardEvent = new keyboardEvent_1.StandardKeyboardEvent(e);
                        if (keyboardEvent.equals(keyCodes_1.CommonKeybindings.UP_ARROW)) {
                            dom.EventHelper.stop(e);
                            _this.searchWidget.focus(true, true);
                        }
                        else if (keyboardEvent.equals(keyCodes_1.CommonKeybindings.DOWN_ARROW)) {
                            dom.EventHelper.stop(e);
                            _this.inputPatternExclusions.focus();
                            _this.inputPatternExclusions.select();
                        }
                    }).on(findInput_1.FindInput.OPTION_CHANGE, function (e) {
                        _this.onQueryChanged(false);
                    });
                    _this.inputPatternIncludes.onSubmit(function () { return _this.onQueryChanged(true); });
                });
                //pattern exclusion list
                builder.div({ 'class': 'file-types' }, function (builder) {
                    var title = nls.localize(3, null);
                    builder.element('h4', { text: title });
                    _this.inputPatternExclusions = new patternInputWidget_1.PatternInputWidget(builder.getContainer(), _this.contextViewService, {
                        ariaLabel: nls.localize(4, null)
                    });
                    _this.inputPatternExclusions.setIsGlobPattern(exclusionsUsePattern);
                    _this.inputPatternExclusions.setValue(patternExclusions);
                    _this.inputPatternExclusions
                        .on(dom.EventType.KEY_UP, onKeyUp)
                        .on(dom.EventType.KEY_DOWN, function (e) {
                        var keyboardEvent = new keyboardEvent_1.StandardKeyboardEvent(e);
                        if (keyboardEvent.equals(keyCodes_1.CommonKeybindings.UP_ARROW)) {
                            dom.EventHelper.stop(e);
                            _this.inputPatternIncludes.focus();
                            _this.inputPatternIncludes.select();
                        }
                        else if (keyboardEvent.equals(keyCodes_1.CommonKeybindings.DOWN_ARROW)) {
                            dom.EventHelper.stop(e);
                            _this.selectTreeIfNotSelected();
                        }
                    }).on(findInput_1.FindInput.OPTION_CHANGE, function (e) {
                        _this.onQueryChanged(false);
                    });
                    _this.inputPatternExclusions.onSubmit(function () { return _this.onQueryChanged(true); });
                });
                // add hint if we have global exclusion
                _this.inputPatternGlobalExclusionsContainer = builder.div({ 'class': 'file-types global-exclude disabled' }, function (builder) {
                    var title = nls.localize(5, null);
                    builder.element('h4', { text: title });
                    _this.inputPatternGlobalExclusions = new inputBox_1.InputBox(builder.getContainer(), _this.contextViewService, {
                        actions: [_this.instantiationService.createInstance(searchActions_1.ConfigureGlobalExclusionsAction)],
                        ariaLabel: nls.localize(6, null)
                    });
                    _this.inputPatternGlobalExclusions.inputElement.readOnly = true;
                    builder_1.$(_this.inputPatternGlobalExclusions.inputElement).attr('aria-readonly', 'true');
                    builder_1.$(_this.inputPatternGlobalExclusions.inputElement).addClass('disabled');
                }).hide();
            }).getHTMLElement();
            this.messages = builder.div({ 'class': 'messages' }).hide().clone();
            this.createSearchResultsView(builder);
            this.actionRegistry = {};
            var actions = [new searchActions_1.CollapseAllAction(this), new searchActions_1.RefreshAction(this), new searchActions_1.ClearSearchResultsAction(this)];
            actions.forEach(function (action) {
                _this.actionRegistry[action.id] = action;
            });
            if (filePatterns !== '' || patternExclusions !== '' || patternIncludes !== '') {
                this.toggleFileTypes(true, true, true);
            }
            this.updateGlobalPatternExclusions(this.configurationService.getConfiguration());
            this.toUnbind.push(this.viewModel.searchResult.onChange(function (event) { return _this.onSearchResultsChanged(event); }));
            return winjs_base_1.TPromise.as(null);
        };
        Object.defineProperty(SearchViewlet.prototype, "searchAndReplaceWidget", {
            get: function () {
                return this.searchWidget;
            },
            enumerable: true,
            configurable: true
        });
        SearchViewlet.prototype.createSearchWidget = function (builder) {
            var _this = this;
            var contentPattern = this.viewletSettings['query.contentPattern'] || '';
            var isRegex = this.viewletSettings['query.regex'] === true;
            var isWholeWords = this.viewletSettings['query.wholeWords'] === true;
            var isCaseSensitive = this.viewletSettings['query.caseSensitive'] === true;
            this.searchWidget = new searchWidget_1.SearchWidget(builder, this.contextViewService, {
                value: contentPattern,
                isRegex: isRegex,
                isCaseSensitive: isCaseSensitive,
                isWholeWords: isWholeWords
            }, this.keybindingService, this.instantiationService);
            if (this.storageService.getBoolean(SearchViewlet.SHOW_REPLACE_STORAGE_KEY, storage_1.StorageScope.WORKSPACE, true)) {
                this.searchWidget.toggleReplace(true);
            }
            this.toUnbind.push(this.searchWidget);
            this.toUnbind.push(this.searchWidget.onSearchSubmit(function (refresh) { return _this.onQueryChanged(refresh); }));
            this.toUnbind.push(this.searchWidget.onSearchCancel(function () { return _this.cancelSearch(); }));
            this.toUnbind.push(this.searchWidget.searchInput.onDidOptionChange(function (viaKeyboard) { return _this.onQueryChanged(true, viaKeyboard); }));
            this.toUnbind.push(this.searchWidget.onReplaceToggled(function () { return _this.onReplaceToggled(); }));
            this.toUnbind.push(this.searchWidget.onReplaceStateChange(function (state) {
                _this.viewModel.replaceActive = state;
                _this.tree.refresh();
            }));
            this.toUnbind.push(this.searchWidget.onReplaceValueChanged(function (value) {
                _this.viewModel.replaceString = _this.searchWidget.getReplaceValue();
                _this.refreshInputs();
                _this.tree.refresh();
            }));
            this.toUnbind.push(this.searchWidget.onKeyDownArrow(function () {
                if (_this.showsFileTypes()) {
                    _this.toggleFileTypes(true, _this.showsFileTypes());
                }
                else {
                    _this.selectTreeIfNotSelected();
                }
            }));
            this.toUnbind.push(this.searchWidget.onReplaceAll(function () { return _this.replaceAll(); }));
        };
        SearchViewlet.prototype.onReplaceToggled = function () {
            this.layout(this.size);
            this.storageService.store(SearchViewlet.SHOW_REPLACE_STORAGE_KEY, this.searchAndReplaceWidget.isReplaceShown(), storage_1.StorageScope.WORKSPACE);
        };
        SearchViewlet.prototype.onSearchResultsChanged = function (event) {
            var _this = this;
            return this.refreshTree(event).then(function () {
                _this.searchWidget.setReplaceAllActionState(!_this.viewModel.searchResult.isEmpty());
            });
        };
        SearchViewlet.prototype.refreshTree = function (event) {
            var _this = this;
            if (!event) {
                return this.tree.refresh(this.viewModel.searchResult);
            }
            if (event.added || event.removed) {
                return this.tree.refresh(this.viewModel.searchResult).then(function () {
                    if (event.added) {
                        event.elements.forEach(function (element) {
                            _this.autoExpandFileMatch(element, true);
                        });
                    }
                });
            }
            else {
                if (event.elements.length === 1) {
                    return this.tree.refresh(event.elements[0]);
                }
                else {
                    return this.tree.refresh(event.elements);
                }
            }
        };
        SearchViewlet.prototype.refreshInputs = function () {
            var _this = this;
            this.viewModel.searchResult.matches().forEach(function (fileMatch) {
                _this.replaceService.refreshInput(fileMatch);
            });
        };
        SearchViewlet.prototype.replaceAll = function () {
            var _this = this;
            if (this.viewModel.searchResult.count() === 0) {
                return;
            }
            var progressRunner = this.progressService.show(100);
            var occurrences = this.viewModel.searchResult.count();
            var fileCount = this.viewModel.searchResult.fileCount();
            var replaceValue = this.searchWidget.getReplaceValue() || '';
            var afterReplaceAllMessage = replaceValue ? nls.localize(7, null, occurrences, fileCount, replaceValue)
                : nls.localize(8, null, occurrences, fileCount);
            var confirmation = {
                title: nls.localize(9, null),
                message: replaceValue ? nls.localize(10, null, occurrences, fileCount, replaceValue)
                    : nls.localize(11, null, occurrences, fileCount),
                primaryButton: nls.localize(12, null)
            };
            if (this.messageService.confirm(confirmation)) {
                this.searchWidget.setReplaceAllActionState(false);
                this.viewModel.searchResult.replaceAll(progressRunner).then(function () {
                    progressRunner.done();
                    _this.showMessage(afterReplaceAllMessage);
                }, function (error) {
                    progressRunner.done();
                    errors.isPromiseCanceledError(error);
                    _this.messageService.show(severity_1.default.Error, error);
                });
            }
        };
        SearchViewlet.prototype.showMessage = function (text) {
            return this.messages.empty().show().asContainer().div({ 'class': 'message', text: text });
        };
        SearchViewlet.prototype.createSearchResultsView = function (builder) {
            var _this = this;
            builder.div({ 'class': 'results' }, function (div) {
                _this.results = div;
                var dataSource = new searchResultsView_1.SearchDataSource();
                var renderer = _this.instantiationService.createInstance(searchResultsView_1.SearchRenderer, _this.getActionRunner(), _this);
                _this.tree = new treeImpl_1.Tree(div.getHTMLElement(), {
                    dataSource: dataSource,
                    renderer: renderer,
                    sorter: new searchResultsView_1.SearchSorter(),
                    filter: new searchResultsView_1.SearchFilter(),
                    controller: new searchResultsView_1.SearchController(_this, _this.instantiationService),
                    accessibilityProvider: _this.instantiationService.createInstance(searchResultsView_1.SearchAccessibilityProvider)
                }, {
                    ariaLabel: nls.localize(13, null)
                });
                _this.tree.setInput(_this.viewModel.searchResult);
                _this.toUnbind.push(renderer);
                _this.toUnbind.push(_this.tree.addListener2('selection', function (event) {
                    var element;
                    var keyboard = event.payload && event.payload.origin === 'keyboard';
                    if (keyboard) {
                        element = _this.tree.getFocus();
                    }
                    else {
                        element = event.selection[0];
                    }
                    var originalEvent = event.payload && event.payload.originalEvent;
                    var doubleClick = (event.payload && event.payload.origin === 'mouse' && originalEvent && originalEvent.detail === 2);
                    if (doubleClick) {
                        originalEvent.preventDefault(); // focus moves to editor, we need to prevent default
                    }
                    var sideBySide = (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey));
                    var focusEditor = (keyboard && originalEvent.keyCode === keyCodes_1.KeyCode.Enter) || doubleClick;
                    if (element instanceof searchModel_1.Match) {
                        var selectedMatch = element;
                        if (_this.currentSelectedFileMatch) {
                            _this.currentSelectedFileMatch.setSelectedMatch(null);
                        }
                        _this.currentSelectedFileMatch = selectedMatch.parent();
                        _this.currentSelectedFileMatch.setSelectedMatch(selectedMatch);
                        _this.onFocus(selectedMatch, !focusEditor, sideBySide, doubleClick);
                    }
                }));
            });
        };
        SearchViewlet.prototype.updateGlobalPatternExclusions = function (configuration) {
            if (this.inputPatternGlobalExclusionsContainer) {
                var excludes_1 = searchQuery_1.getExcludes(configuration);
                if (excludes_1) {
                    var exclusions = Object.getOwnPropertyNames(excludes_1).filter(function (exclude) { return excludes_1[exclude] === true || typeof excludes_1[exclude].when === 'string'; }).map(function (exclude) {
                        if (excludes_1[exclude] === true) {
                            return exclude;
                        }
                        return nls.localize(14, null, exclude, excludes_1[exclude].when);
                    });
                    if (exclusions.length) {
                        var values = exclusions.join(', ');
                        this.inputPatternGlobalExclusions.value = values;
                        this.inputPatternGlobalExclusions.inputElement.title = values;
                        this.inputPatternGlobalExclusionsContainer.show();
                    }
                    else {
                        this.inputPatternGlobalExclusionsContainer.hide();
                    }
                }
            }
        };
        SearchViewlet.prototype.setVisible = function (visible) {
            var promise;
            this.viewletVisible.set(visible);
            if (visible) {
                promise = _super.prototype.setVisible.call(this, visible);
                this.tree.onVisible();
            }
            else {
                this.tree.onHidden();
                promise = _super.prototype.setVisible.call(this, visible);
            }
            // Enable highlights if there are searchresults
            if (this.viewModel) {
                this.viewModel.searchResult.toggleHighlights(visible);
            }
            // Open focused element from results in case the editor area is otherwise empty
            if (visible && !this.editorService.getActiveEditor()) {
                var focus_1 = this.tree.getFocus();
                if (focus_1) {
                    this.onFocus(focus_1);
                }
            }
            return promise;
        };
        SearchViewlet.prototype.focus = function () {
            _super.prototype.focus.call(this);
            var selectedText = this.getSearchTextFromEditor();
            if (selectedText) {
                this.searchWidget.searchInput.setValue(selectedText);
            }
            this.searchWidget.focus();
        };
        SearchViewlet.prototype.moveFocusFromResults = function () {
            if (this.showsFileTypes()) {
                this.toggleFileTypes(true, true, false, true);
            }
            else {
                this.searchWidget.focus(true, true);
            }
        };
        SearchViewlet.prototype.reLayout = function () {
            if (this.isDisposed) {
                return;
            }
            this.searchWidget.setWidth(this.size.width - 25 /* container margin */);
            this.inputPatternExclusions.setWidth(this.size.width - 28 /* container margin */);
            this.inputPatternIncludes.setWidth(this.size.width - 28 /* container margin */);
            this.inputPatternGlobalExclusions.width = this.size.width - 28 /* container margin */ - 24 /* actions */;
            var searchResultContainerSize = this.size.height - dom.getTotalHeight(this.searchWidgetsContainer.getContainer()) - 6;
            this.results.style({ height: searchResultContainerSize + 'px' });
            this.tree.layout(searchResultContainerSize);
        };
        SearchViewlet.prototype.layout = function (dimension) {
            this.size = dimension;
            this.reLayout();
        };
        SearchViewlet.prototype.getControl = function () {
            return this.tree;
        };
        SearchViewlet.prototype.clearSearchResults = function () {
            this.viewModel.searchResult.clear();
            this.showEmptyStage();
            this.searchWidget.clear();
            this.viewModel.cancelSearch();
        };
        SearchViewlet.prototype.cancelSearch = function () {
            if (this.viewModel.cancelSearch()) {
                this.searchWidget.focus();
                return true;
            }
            return false;
        };
        SearchViewlet.prototype.selectTreeIfNotSelected = function () {
            if (this.tree.getInput()) {
                this.tree.DOMFocus();
                var selection = this.tree.getSelection();
                if (selection.length === 0) {
                    this.tree.focusNext();
                }
            }
        };
        SearchViewlet.prototype.getSearchTextFromEditor = function () {
            if (!this.editorService.getActiveEditor()) {
                return null;
            }
            var editorControl = this.editorService.getActiveEditor().getControl();
            if (!editorControl || !types_1.isFunction(editorControl.getEditorType) || editorControl.getEditorType() !== editorCommon_1.EditorType.ICodeEditor) {
                return null;
            }
            var range = editorControl.getSelection();
            if (range && !range.isEmpty() && range.startLineNumber === range.endLineNumber) {
                var searchText = editorControl.getModel().getLineContent(range.startLineNumber);
                searchText = searchText.substring(range.startColumn - 1, range.endColumn - 1);
                return searchText;
            }
            return null;
        };
        SearchViewlet.prototype.showsFileTypes = function () {
            return dom.hasClass(this.queryDetails, 'more');
        };
        SearchViewlet.prototype.toggleFileTypes = function (moveFocus, show, skipLayout, reverse) {
            var cls = 'more';
            show = typeof show === 'undefined' ? !dom.hasClass(this.queryDetails, cls) : Boolean(show);
            skipLayout = Boolean(skipLayout);
            if (show) {
                dom.addClass(this.queryDetails, cls);
                if (moveFocus) {
                    if (reverse) {
                        this.inputPatternExclusions.focus();
                        this.inputPatternExclusions.select();
                    }
                    else {
                        this.inputPatternIncludes.focus();
                        this.inputPatternIncludes.select();
                    }
                }
            }
            else {
                dom.removeClass(this.queryDetails, cls);
                if (moveFocus) {
                    this.searchWidget.focus();
                }
            }
            if (!skipLayout && this.size) {
                this.layout(this.size);
            }
        };
        SearchViewlet.prototype.searchInFolder = function (resource) {
            if (!this.showsFileTypes()) {
                this.toggleFileTypes(true, true);
            }
            var workspaceRelativePath = this.contextService.toWorkspaceRelativePath(resource);
            if (workspaceRelativePath) {
                this.inputPatternIncludes.setIsGlobPattern(false);
                this.inputPatternIncludes.setValue(workspaceRelativePath);
                this.searchWidget.focus(false);
            }
        };
        SearchViewlet.prototype.onQueryChanged = function (rerunQuery, preserveFocus) {
            var isRegex = this.searchWidget.searchInput.getRegex();
            var isWholeWords = this.searchWidget.searchInput.getWholeWords();
            var isCaseSensitive = this.searchWidget.searchInput.getCaseSensitive();
            var contentPattern = this.searchWidget.searchInput.getValue();
            var patternExcludes = this.inputPatternExclusions.getValue().trim();
            var exclusionsUsePattern = this.inputPatternExclusions.isGlobPattern();
            var patternIncludes = this.inputPatternIncludes.getValue().trim();
            var includesUsePattern = this.inputPatternIncludes.isGlobPattern();
            // store memento
            this.viewletSettings['query.contentPattern'] = contentPattern;
            this.viewletSettings['query.regex'] = isRegex;
            this.viewletSettings['query.wholeWords'] = isWholeWords;
            this.viewletSettings['query.caseSensitive'] = isCaseSensitive;
            this.viewletSettings['query.folderExclusions'] = patternExcludes;
            this.viewletSettings['query.exclusionsUsePattern'] = exclusionsUsePattern;
            this.viewletSettings['query.folderIncludes'] = patternIncludes;
            this.viewletSettings['query.includesUsePattern'] = includesUsePattern;
            if (!rerunQuery) {
                return;
            }
            if (contentPattern.length === 0) {
                return;
            }
            // Validate regex is OK
            if (isRegex) {
                var regExp = void 0;
                try {
                    regExp = new RegExp(contentPattern);
                }
                catch (e) {
                    return; // malformed regex
                }
                if (strings.regExpLeadsToEndlessLoop(regExp)) {
                    return; // endless regex
                }
            }
            var content = {
                pattern: contentPattern,
                isRegExp: isRegex,
                isCaseSensitive: isCaseSensitive,
                isWordMatch: isWholeWords
            };
            var excludes = this.inputPatternExclusions.getGlob();
            var includes = this.inputPatternIncludes.getGlob();
            var options = {
                folderResources: this.contextService.getWorkspace() ? [this.contextService.getWorkspace().resource] : [],
                extraFileResources: editor_1.getOutOfWorkspaceEditorResources(this.editorGroupService, this.contextService),
                excludePattern: excludes,
                maxResults: SearchViewlet.MAX_TEXT_RESULTS,
                includePattern: includes
            };
            this.onQueryTriggered(this.queryBuilder.text(content, options), patternExcludes, patternIncludes);
            if (!preserveFocus) {
                this.searchWidget.focus(false); // focus back to input field
            }
        };
        SearchViewlet.prototype.autoExpandFileMatch = function (fileMatch, alwaysExpandIfOneResult) {
            var length = fileMatch.matches().length;
            if (length < 10 || (alwaysExpandIfOneResult && this.viewModel.searchResult.count() === 1 && length < 50)) {
                this.tree.expand(fileMatch).done(null, errors.onUnexpectedError);
            }
            else {
                this.tree.collapse(fileMatch).done(null, errors.onUnexpectedError);
            }
        };
        SearchViewlet.prototype.onQueryTriggered = function (query, excludePattern, includePattern) {
            var _this = this;
            this.viewModel.cancelSearch();
            // Progress total is 100%
            var progressTotal = 100;
            var progressRunner = this.progressService.show(progressTotal);
            var progressWorked = 0;
            this.loading = true;
            this.searchWidget.searchInput.clearMessage();
            this.showEmptyStage();
            var handledMatches = Object.create(null);
            var autoExpand = function (alwaysExpandIfOneResult) {
                // Auto-expand / collapse based on number of matches:
                // - alwaysExpandIfOneResult: expand file results if we have just one file result and less than 50 matches on a file
                // - expand file results if we have more than one file result and less than 10 matches on a file
                var matches = _this.viewModel.searchResult.matches();
                matches.forEach(function (match) {
                    if (handledMatches[match.id()]) {
                        return; // if we once handled a result, do not do it again to keep results stable (the user might have expanded/collapsed meanwhile)
                    }
                    handledMatches[match.id()] = true;
                    _this.autoExpandFileMatch(match, alwaysExpandIfOneResult);
                });
            };
            var isDone = false;
            var onComplete = function (completed) {
                isDone = true;
                // Complete up to 100% as needed
                if (completed) {
                    progressRunner.worked(progressTotal - progressWorked);
                    setTimeout(function () { return progressRunner.done(); }, 200);
                }
                else {
                    progressRunner.done();
                }
                _this.onSearchResultsChanged().then(function () { return autoExpand(true); });
                _this.viewModel.replaceString = _this.searchWidget.getReplaceValue();
                var hasResults = !_this.viewModel.searchResult.isEmpty();
                _this.loading = false;
                _this.actionRegistry['refresh'].enabled = true;
                _this.actionRegistry['vs.tree.collapse'].enabled = hasResults;
                _this.actionRegistry['clearSearchResults'].enabled = hasResults;
                if (completed && completed.limitHit) {
                    _this.searchWidget.searchInput.showMessage({
                        content: nls.localize(15, null),
                        type: inputBox_1.MessageType.WARNING
                    });
                }
                if (!hasResults) {
                    var hasExcludes = !!excludePattern;
                    var hasIncludes = !!includePattern;
                    var message = void 0;
                    if (!completed) {
                        message = nls.localize(16, null);
                    }
                    else if (hasIncludes && hasExcludes) {
                        message = nls.localize(17, null, includePattern, excludePattern);
                    }
                    else if (hasIncludes) {
                        message = nls.localize(18, null, includePattern);
                    }
                    else if (hasExcludes) {
                        message = nls.localize(19, null, excludePattern);
                    }
                    else {
                        message = nls.localize(20, null);
                    }
                    // Indicate as status to ARIA
                    aria.status(message);
                    _this.tree.onHidden();
                    _this.results.hide();
                    var div = _this.showMessage(message);
                    if (!completed) {
                        builder_1.$(div).a({
                            'class': ['pointer', 'prominent'],
                            text: nls.localize(21, null)
                        }).on(dom.EventType.CLICK, function (e) {
                            dom.EventHelper.stop(e, false);
                            _this.onQueryChanged(true);
                        });
                    }
                    else if (hasIncludes || hasExcludes) {
                        builder_1.$(div).a({
                            'class': ['pointer', 'prominent'],
                            'tabindex': '0',
                            text: nls.localize(22, null)
                        }).on(dom.EventType.CLICK, function (e) {
                            dom.EventHelper.stop(e, false);
                            _this.inputPatternExclusions.setValue('');
                            _this.inputPatternIncludes.setValue('');
                            _this.onQueryChanged(true);
                        });
                    }
                    else {
                        builder_1.$(div).a({
                            'class': ['pointer', 'prominent'],
                            'tabindex': '0',
                            text: nls.localize(23, null)
                        }).on(dom.EventType.CLICK, function (e) {
                            dom.EventHelper.stop(e, false);
                            var action = _this.instantiationService.createInstance(openSettings_1.OpenGlobalSettingsAction, openSettings_1.OpenGlobalSettingsAction.ID, openSettings_1.OpenGlobalSettingsAction.LABEL);
                            action.run().done(function () { return action.dispose(); }, errors.onUnexpectedError);
                        });
                    }
                }
                else {
                    _this.viewModel.searchResult.toggleHighlights(true); // show highlights
                    // Indicate as status to ARIA
                    aria.status(nls.localize(24, null, _this.viewModel.searchResult.count(), _this.viewModel.searchResult.fileCount()));
                }
            };
            var onError = function (e) {
                if (errors.isPromiseCanceledError(e)) {
                    onComplete(null);
                }
                else {
                    _this.loading = false;
                    isDone = true;
                    progressRunner.done();
                    _this.messageService.show(2 /* ERROR */, e);
                }
            };
            var total = 0;
            var worked = 0;
            var visibleMatches = 0;
            var onProgress = function (p) {
                // Progress
                if (p.total) {
                    total = p.total;
                }
                if (p.worked) {
                    worked = p.worked;
                }
            };
            // Handle UI updates in an interval to show frequent progress and results
            var uiRefreshHandle = setInterval(function () {
                if (isDone) {
                    window.clearInterval(uiRefreshHandle);
                    return;
                }
                // Progress bar update
                var fakeProgress = true;
                if (total > 0 && worked > 0) {
                    var ratio = Math.round((worked / total) * 100);
                    if (ratio > progressWorked) {
                        progressRunner.worked(ratio - progressWorked);
                        progressWorked = ratio;
                        fakeProgress = false;
                    }
                }
                // Fake progress up to 90%
                if (fakeProgress && progressWorked < 90) {
                    progressWorked++;
                    progressRunner.worked(1);
                }
                // Search result tree update
                var count = _this.viewModel.searchResult.fileCount();
                if (visibleMatches !== count) {
                    visibleMatches = count;
                    _this.tree.refresh().then(function () {
                        autoExpand(false);
                    }).done(null, errors.onUnexpectedError);
                }
                if (count > 0) {
                    // since we have results now, enable some actions
                    if (!_this.actionRegistry['vs.tree.collapse'].enabled) {
                        _this.actionRegistry['vs.tree.collapse'].enabled = true;
                    }
                }
            }, 200);
            this.searchWidget.setReplaceAllActionState(false);
            this.replaceService.disposeAllInputs();
            this.viewModel.search(query).done(onComplete, onError, onProgress);
        };
        SearchViewlet.prototype.showEmptyStage = function () {
            // disable 'result'-actions
            this.actionRegistry['refresh'].enabled = false;
            this.actionRegistry['vs.tree.collapse'].enabled = false;
            this.actionRegistry['clearSearchResults'].enabled = false;
            // clean up ui
            this.replaceService.disposeAllInputs();
            this.messages.hide();
            this.results.show();
            this.tree.onVisible();
            this.currentSelectedFileMatch = null;
        };
        SearchViewlet.prototype.onFocus = function (lineMatch, preserveFocus, sideBySide, pinned) {
            if (!(lineMatch instanceof searchModel_1.Match)) {
                return winjs_base_1.TPromise.as(true);
            }
            this.telemetryService.publicLog('searchResultChosen');
            return (this.viewModel.isReplaceActive() && !!this.viewModel.replaceString) ? this.replaceService.openReplacePreviewEditor(lineMatch, preserveFocus, sideBySide, pinned) : this.open(lineMatch, preserveFocus, sideBySide, pinned);
        };
        SearchViewlet.prototype.open = function (element, preserveFocus, sideBySide, pinned) {
            var selection = this.getSelectionFrom(element);
            var resource = element instanceof searchModel_1.Match ? element.parent().resource() : element.resource();
            return this.editorService.openEditor({
                resource: resource,
                options: {
                    preserveFocus: preserveFocus,
                    pinned: pinned,
                    selection: selection,
                    revealIfVisible: true
                }
            }, sideBySide);
        };
        SearchViewlet.prototype.getSelectionFrom = function (element) {
            var match = null;
            if (element instanceof searchModel_1.Match) {
                match = element;
            }
            if (element instanceof searchModel_1.FileMatch && element.count() > 0) {
                match = element.matches()[element.matches().length - 1];
            }
            if (match) {
                var range = match.range();
                if (this.viewModel.isReplaceActive()) {
                    var replaceString = match.replaceString;
                    return {
                        startLineNumber: range.startLineNumber,
                        startColumn: range.startColumn + replaceString.length,
                        endLineNumber: range.startLineNumber,
                        endColumn: range.startColumn + replaceString.length
                    };
                }
                return range;
            }
            return void 0;
        };
        SearchViewlet.prototype.onUntitledFileSaved = function (e) {
            if (!this.viewModel) {
                return;
            }
            var matches = this.viewModel.searchResult.matches();
            for (var i = 0, len = matches.length; i < len; i++) {
                if (e.resource.toString() === matches[i].resource().toString()) {
                    this.viewModel.searchResult.remove(matches[i]);
                }
            }
        };
        SearchViewlet.prototype.onFilesChanged = function (e) {
            if (!this.viewModel) {
                return;
            }
            var matches = this.viewModel.searchResult.matches();
            for (var i = 0, len = matches.length; i < len; i++) {
                if (e.contains(matches[i].resource(), files_1.FileChangeType.DELETED)) {
                    this.viewModel.searchResult.remove(matches[i]);
                }
            }
        };
        SearchViewlet.prototype.getActions = function () {
            return [
                this.actionRegistry['refresh'],
                this.actionRegistry['vs.tree.collapse'],
                this.actionRegistry['clearSearchResults']
            ];
        };
        SearchViewlet.prototype.dispose = function () {
            this.isDisposed = true;
            this.toDispose = lifecycle.dispose(this.toDispose);
            if (this.tree) {
                this.tree.dispose();
            }
            this.searchWidget.dispose();
            this.inputPatternIncludes.dispose();
            this.inputPatternExclusions.dispose();
            this.viewModel.dispose();
            _super.prototype.dispose.call(this);
        };
        SearchViewlet.MAX_TEXT_RESULTS = 2048;
        SearchViewlet.SHOW_REPLACE_STORAGE_KEY = 'vs.search.show.replace';
        SearchViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, event_1.IEventService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, progress_1.IProgressService),
            __param(5, message_1.IMessageService),
            __param(6, storage_1.IStorageService),
            __param(7, contextView_1.IContextViewService),
            __param(8, instantiation_1.IInstantiationService),
            __param(9, configuration_1.IConfigurationService),
            __param(10, workspace_1.IWorkspaceContextService),
            __param(11, search_1.ISearchService),
            __param(12, keybinding_1.IKeybindingService),
            __param(13, replace_1.IReplaceService)
        ], SearchViewlet);
        return SearchViewlet;
    }(viewlet_1.Viewlet));
    exports.SearchViewlet = SearchViewlet;
});

}).call(this);
//# sourceMappingURL=searchViewlet.js.map
