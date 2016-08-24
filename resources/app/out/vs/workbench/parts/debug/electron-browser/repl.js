/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/workbench/parts/debug/common/debugModel","vs/workbench/parts/debug/browser/debugActions","vs/nls!vs/workbench/parts/debug/electron-browser/repl","vs/workbench/parts/debug/common/replHistory","vs/css!vs/workbench/parts/debug/browser/media/repl","vs/nls!vs/workbench/parts/debug/electron-browser/replViewer","vs/workbench/parts/debug/electron-browser/replViewer","vs/base/common/errors","vs/base/browser/dom","vs/base/common/platform","vs/workbench/parts/debug/electron-browser/repl","vs/base/common/uri","vs/base/common/strings","vs/base/common/winjs.base","vs/base/common/severity","vs/base/browser/mouseEvent","vs/css!vs/workbench/parts/debug/electron-browser/repl","vs/workbench/parts/debug/electron-browser/debugViewer","vs/nls","vs/workbench/parts/debug/electron-browser/electronDebugActions","vs/workbench/services/editor/common/editorService","vs/platform/workspace/common/workspace","vs/base/browser/ui/actionbar/actionbar","vs/base/common/lifecycle","vs/base/parts/tree/browser/treeImpl","vs/platform/event/common/event","vs/workbench/common/events","vs/workbench/parts/debug/common/debug","vs/workbench/browser/panel","vs/platform/telemetry/common/telemetry","vs/platform/contextview/browser/contextView","vs/platform/instantiation/common/instantiation","vs/workbench/services/workspace/common/contextService","vs/platform/storage/common/storage","vs/base/common/keyCodes"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[6], __M([18]), {});

define(__m[7], __M([20,4]), function(nls, data) { return nls.create("vs/workbench/parts/debug/electron-browser/replViewer", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[5], __M([0,1]), function (require, exports) {
    "use strict";
    var MAX_HISTORY_ENTRIES = 50;
    /**
     * The repl history has the following characteristics:
     * - the history is stored in local storage up to N items
     * - every time a expression is evaluated, it is being added to the history
     * - when starting to navigate in history, the current expression is remembered to be able to go back
     * - when navigating in history and making changes to any expression, these changes are remembered until a expression is evaluated
     * - the navigation state is not remembered so that the user always ends up at the end of the history stack when evaluating a expression
     */
    var ReplHistory = (function () {
        function ReplHistory(history) {
            this.history = history;
            this.historyPointer = this.history.length;
            this.currentExpressionStoredMarkers = false;
            this.historyOverwrites = {};
        }
        ReplHistory.prototype.next = function () {
            return this.navigate(false);
        };
        ReplHistory.prototype.previous = function () {
            return this.navigate(true);
        };
        ReplHistory.prototype.navigate = function (previous) {
            // validate new pointer
            var newPointer = -1;
            if (previous && this.historyPointer > 0 && this.history.length > this.historyPointer - 1) {
                newPointer = this.historyPointer - 1;
            }
            else if (!previous && this.history.length > this.historyPointer + 1) {
                newPointer = this.historyPointer + 1;
            }
            if (newPointer >= 0) {
                // remember pointer for next navigation
                this.historyPointer = newPointer;
                // check for overwrite
                if (this.historyOverwrites && this.historyOverwrites[newPointer.toString()]) {
                    return this.historyOverwrites[newPointer.toString()];
                }
                return this.history[newPointer];
            }
            return null;
        };
        ReplHistory.prototype.remember = function (expression, fromPrevious) {
            var previousPointer;
            // this method is called after the user has navigated in the history. Therefor we need to
            // restore the value of the pointer from the point when the user started the navigation.
            if (fromPrevious) {
                previousPointer = this.historyPointer + 1;
            }
            else {
                previousPointer = this.historyPointer - 1;
            }
            // when the user starts to navigate in history, add the current expression to the history
            // once so that the user can always navigate back to it and does not loose its data.
            if (previousPointer === this.history.length && !this.currentExpressionStoredMarkers) {
                this.history.push(expression);
                this.currentExpressionStoredMarkers = true;
            }
            else {
                if (!this.historyOverwrites) {
                    this.historyOverwrites = {};
                }
                this.historyOverwrites[previousPointer.toString()] = expression;
            }
        };
        ReplHistory.prototype.evaluated = function (expression) {
            // clear current expression that was stored previously to support history navigation now on evaluate
            if (this.currentExpressionStoredMarkers) {
                this.history.pop();
            }
            // keep in local history if expression provided and not equal to previous expression stored in history
            if (expression && (this.history.length === 0 || this.history[this.history.length - 1] !== expression)) {
                this.history.push(expression);
            }
            // advance History Pointer to the end
            this.historyPointer = this.history.length;
            // reset marker
            this.currentExpressionStoredMarkers = false;
            // reset overwrites
            this.historyOverwrites = null;
        };
        ReplHistory.prototype.save = function () {
            // remove current expression from history since it was not evaluated
            if (this.currentExpressionStoredMarkers) {
                this.history.pop();
            }
            if (this.history.length > MAX_HISTORY_ENTRIES) {
                this.history = this.history.splice(this.history.length - MAX_HISTORY_ENTRIES, MAX_HISTORY_ENTRIES);
            }
            return this.history;
        };
        return ReplHistory;
    }());
    exports.ReplHistory = ReplHistory;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[8], __M([0,1,7,15,14,13,11,24,10,9,16,17,2,19,3,21,22,23]), function (require, exports, nls, winjs_base_1, strings, uri_1, platform_1, actionbar, dom, errors, severity_1, mouse, model, debugviewer, debugactions, electronDebugActions_1, editorService_1, workspace_1) {
    "use strict";
    var $ = dom.emmet;
    var ReplExpressionsDataSource = (function () {
        function ReplExpressionsDataSource(debugService) {
            this.debugService = debugService;
            // noop
        }
        ReplExpressionsDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        ReplExpressionsDataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof model.Model || element.reference > 0 || (element instanceof model.KeyValueOutputElement && element.getChildren().length > 0);
        };
        ReplExpressionsDataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof model.Model) {
                return winjs_base_1.TPromise.as(element.getReplElements());
            }
            if (element instanceof model.KeyValueOutputElement) {
                return winjs_base_1.TPromise.as(element.getChildren());
            }
            if (element instanceof model.ValueOutputElement) {
                return winjs_base_1.TPromise.as(null);
            }
            return element.getChildren(this.debugService);
        };
        ReplExpressionsDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return ReplExpressionsDataSource;
    }());
    exports.ReplExpressionsDataSource = ReplExpressionsDataSource;
    var ReplExpressionsRenderer = (function () {
        function ReplExpressionsRenderer(editorService, contextService) {
            this.editorService = editorService;
            this.contextService = contextService;
            // noop
        }
        ReplExpressionsRenderer.prototype.getHeight = function (tree, element) {
            return this.getHeightForString(element.value) + (element instanceof model.Expression ? this.getHeightForString(element.name) : 0);
        };
        ReplExpressionsRenderer.prototype.getHeightForString = function (s) {
            if (!s || !s.length || !this.width || this.width <= 0 || !this.characterWidth || this.characterWidth <= 0) {
                return 18;
            }
            var realLength = 0;
            for (var i = 0; i < s.length; i++) {
                realLength += strings.isFullWidthCharacter(s.charCodeAt(i)) ? 2 : 1;
            }
            return 18 * Math.ceil(realLength * this.characterWidth / this.width);
        };
        ReplExpressionsRenderer.prototype.setWidth = function (fullWidth, characterWidth) {
            this.width = fullWidth;
            this.characterWidth = characterWidth;
        };
        ReplExpressionsRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof model.Variable) {
                return ReplExpressionsRenderer.VARIABLE_TEMPLATE_ID;
            }
            if (element instanceof model.Expression) {
                return ReplExpressionsRenderer.INPUT_OUTPUT_PAIR_TEMPLATE_ID;
            }
            if (element instanceof model.ValueOutputElement) {
                return ReplExpressionsRenderer.VALUE_OUTPUT_TEMPLATE_ID;
            }
            if (element instanceof model.KeyValueOutputElement) {
                return ReplExpressionsRenderer.KEY_VALUE_OUTPUT_TEMPLATE_ID;
            }
            return null;
        };
        ReplExpressionsRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (templateId === ReplExpressionsRenderer.VARIABLE_TEMPLATE_ID) {
                var data = Object.create(null);
                data.expression = dom.append(container, $('.expression'));
                data.name = dom.append(data.expression, $('span.name'));
                data.value = dom.append(data.expression, $('span.value'));
                return data;
            }
            if (templateId === ReplExpressionsRenderer.INPUT_OUTPUT_PAIR_TEMPLATE_ID) {
                var data = Object.create(null);
                dom.addClass(container, 'input-output-pair');
                data.input = dom.append(container, $('.input.expression'));
                data.output = dom.append(container, $('.output.expression'));
                data.value = dom.append(data.output, $('span.value'));
                data.annotation = dom.append(data.output, $('span'));
                return data;
            }
            if (templateId === ReplExpressionsRenderer.VALUE_OUTPUT_TEMPLATE_ID) {
                var data = Object.create(null);
                dom.addClass(container, 'output');
                var expression = dom.append(container, $('.output.expression'));
                data.container = container;
                data.counter = dom.append(expression, $('div.counter'));
                data.value = dom.append(expression, $('span.value'));
                return data;
            }
            if (templateId === ReplExpressionsRenderer.KEY_VALUE_OUTPUT_TEMPLATE_ID) {
                var data = Object.create(null);
                dom.addClass(container, 'output');
                data.container = container;
                data.expression = dom.append(container, $('.output.expression'));
                data.key = dom.append(data.expression, $('span.name'));
                data.value = dom.append(data.expression, $('span.value'));
                data.annotation = dom.append(data.expression, $('span'));
                return data;
            }
        };
        ReplExpressionsRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === ReplExpressionsRenderer.VARIABLE_TEMPLATE_ID) {
                debugviewer.renderVariable(tree, element, templateData, false);
            }
            else if (templateId === ReplExpressionsRenderer.INPUT_OUTPUT_PAIR_TEMPLATE_ID) {
                this.renderInputOutputPair(tree, element, templateData);
            }
            else if (templateId === ReplExpressionsRenderer.VALUE_OUTPUT_TEMPLATE_ID) {
                this.renderOutputValue(element, templateData);
            }
            else if (templateId === ReplExpressionsRenderer.KEY_VALUE_OUTPUT_TEMPLATE_ID) {
                this.renderOutputKeyValue(tree, element, templateData);
            }
        };
        ReplExpressionsRenderer.prototype.renderInputOutputPair = function (tree, expression, templateData) {
            templateData.input.textContent = expression.name;
            debugviewer.renderExpressionValue(expression, templateData.value, false);
            if (expression.reference > 0) {
                templateData.annotation.className = 'annotation octicon octicon-info';
                templateData.annotation.title = nls.localize(0, null);
            }
        };
        ReplExpressionsRenderer.prototype.renderOutputValue = function (output, templateData) {
            // counter
            if (output.counter > 1) {
                templateData.counter.textContent = String(output.counter);
                templateData.counter.className = (output.severity === severity_1.default.Warning) ? 'counter warn' : (output.severity === severity_1.default.Error) ? 'counter error' : 'counter info';
            }
            else {
                templateData.counter.textContent = '';
                templateData.counter.className = 'counter';
            }
            // value
            dom.clearNode(templateData.value);
            var result = this.handleANSIOutput(output.value);
            if (typeof result === 'string') {
                templateData.value.textContent = result;
            }
            else {
                templateData.value.appendChild(result);
            }
            templateData.value.className = (output.severity === severity_1.default.Warning) ? 'warn' : (output.severity === severity_1.default.Error) ? 'error' : 'info';
        };
        ReplExpressionsRenderer.prototype.handleANSIOutput = function (text) {
            var tokensContainer;
            var currentToken;
            var buffer = '';
            for (var i = 0, len = text.length; i < len; i++) {
                // start of ANSI escape sequence (see http://ascii-table.com/ansi-escape-sequences.php)
                if (text.charCodeAt(i) === 27) {
                    var index = i;
                    var chr = (++index < len ? text.charAt(index) : null);
                    if (chr && chr === '[') {
                        var code = null;
                        chr = (++index < len ? text.charAt(index) : null);
                        if (chr && chr >= '0' && chr <= '9') {
                            code = chr;
                            chr = (++index < len ? text.charAt(index) : null);
                        }
                        if (chr && chr >= '0' && chr <= '9') {
                            code += chr;
                            chr = (++index < len ? text.charAt(index) : null);
                        }
                        if (code === null) {
                            code = '0';
                        }
                        if (chr === 'm') {
                            // only respect text-foreground ranges and ignore the values for "black" & "white" because those
                            // only make sense in combination with text-background ranges which we currently not support
                            var parsedMode = parseInt(code, 10);
                            var token = document.createElement('span');
                            if ((parsedMode >= 30 && parsedMode <= 37) || (parsedMode >= 90 && parsedMode <= 97)) {
                                token.className = 'code' + parsedMode;
                            }
                            else if (parsedMode === 1) {
                                token.className = 'code-bold';
                            }
                            // we need a tokens container now
                            if (!tokensContainer) {
                                tokensContainer = document.createElement('span');
                            }
                            // flush text buffer if we have any
                            if (buffer) {
                                this.insert(this.handleLinks(buffer), currentToken || tokensContainer);
                                buffer = '';
                            }
                            currentToken = token;
                            tokensContainer.appendChild(token);
                            i = index;
                        }
                    }
                }
                else {
                    buffer += text[i];
                }
            }
            // flush remaining text buffer if we have any
            if (buffer) {
                var res = this.handleLinks(buffer);
                if (typeof res !== 'string' || currentToken) {
                    if (!tokensContainer) {
                        tokensContainer = document.createElement('span');
                    }
                    this.insert(res, currentToken || tokensContainer);
                }
            }
            return tokensContainer || buffer;
        };
        ReplExpressionsRenderer.prototype.insert = function (arg, target) {
            if (typeof arg === 'string') {
                target.textContent = arg;
            }
            else {
                target.appendChild(arg);
            }
        };
        ReplExpressionsRenderer.prototype.handleLinks = function (text) {
            var _this = this;
            var linkContainer;
            var _loop_1 = function(pattern) {
                pattern.lastIndex = 0; // the holy grail of software development
                var match = pattern.exec(text);
                var resource = null;
                try {
                    resource = match && uri_1.default.file(match[1]);
                }
                catch (e) { }
                if (resource) {
                    linkContainer = document.createElement('span');
                    var textBeforeLink = text.substr(0, match.index);
                    if (textBeforeLink) {
                        var span = document.createElement('span');
                        span.textContent = textBeforeLink;
                        linkContainer.appendChild(span);
                    }
                    var link = document.createElement('a');
                    link.textContent = text.substr(match.index, match[0].length);
                    link.title = platform_1.isMacintosh ? nls.localize(1, null) : nls.localize(2, null);
                    linkContainer.appendChild(link);
                    link.onclick = function (e) { return _this.onLinkClick(new mouse.StandardMouseEvent(e), resource, Number(match[3]), Number(match[4])); };
                    var textAfterLink = text.substr(match.index + match[0].length);
                    if (textAfterLink) {
                        var span = document.createElement('span');
                        span.textContent = textAfterLink;
                        linkContainer.appendChild(span);
                    }
                    return "break"; // support one link per line for now
                }
            };
            for (var _i = 0, _a = ReplExpressionsRenderer.FILE_LOCATION_PATTERNS; _i < _a.length; _i++) {
                var pattern = _a[_i];
                var state_1 = _loop_1(pattern);
                if (state_1 === "break") break;
            }
            return linkContainer || text;
        };
        ReplExpressionsRenderer.prototype.onLinkClick = function (event, resource, line, column) {
            var selection = window.getSelection();
            if (selection.type === 'Range') {
                return; // do not navigate when user is selecting
            }
            event.preventDefault();
            this.editorService.openEditor({
                resource: resource,
                options: {
                    selection: {
                        startLineNumber: line,
                        startColumn: column
                    }
                }
            }, event.ctrlKey || event.metaKey).done(null, errors.onUnexpectedError);
        };
        ReplExpressionsRenderer.prototype.renderOutputKeyValue = function (tree, output, templateData) {
            // key
            if (output.key) {
                templateData.key.textContent = output.key + ":";
            }
            else {
                templateData.key.textContent = '';
            }
            // value
            debugviewer.renderExpressionValue(output.value, templateData.value, false);
            // annotation if any
            if (output.annotation) {
                templateData.annotation.className = 'annotation octicon octicon-info';
                templateData.annotation.title = output.annotation;
            }
            else {
                templateData.annotation.className = '';
                templateData.annotation.title = '';
            }
        };
        ReplExpressionsRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            // noop
        };
        ReplExpressionsRenderer.VARIABLE_TEMPLATE_ID = 'variable';
        ReplExpressionsRenderer.INPUT_OUTPUT_PAIR_TEMPLATE_ID = 'inputOutputPair';
        ReplExpressionsRenderer.VALUE_OUTPUT_TEMPLATE_ID = 'outputValue';
        ReplExpressionsRenderer.KEY_VALUE_OUTPUT_TEMPLATE_ID = 'outputKeyValue';
        ReplExpressionsRenderer.FILE_LOCATION_PATTERNS = [
            // group 0: the full thing :)
            // group 1: absolute path
            // group 2: drive letter on windows with trailing backslash or leading slash on mac/linux
            // group 3: line number
            // group 4: column number
            // eg: at Context.<anonymous> (c:\Users\someone\Desktop\mocha-runner\test\test.js:26:11)
            /((\/|[a-zA-Z]:\\)[^\(\)<>\'\"\[\]]+):(\d+):(\d+)/
        ];
        ReplExpressionsRenderer = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, workspace_1.IWorkspaceContextService)
        ], ReplExpressionsRenderer);
        return ReplExpressionsRenderer;
    }());
    exports.ReplExpressionsRenderer = ReplExpressionsRenderer;
    var ReplExpressionsAccessibilityProvider = (function () {
        function ReplExpressionsAccessibilityProvider() {
        }
        ReplExpressionsAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof model.Variable) {
                return nls.localize(3, null, element.name, element.value);
            }
            if (element instanceof model.Expression) {
                return nls.localize(4, null, element.name, element.value);
            }
            if (element instanceof model.ValueOutputElement) {
                return nls.localize(5, null, element.value);
            }
            if (element instanceof model.KeyValueOutputElement) {
                return nls.localize(6, null, element.key, element.value);
            }
            return null;
        };
        return ReplExpressionsAccessibilityProvider;
    }());
    exports.ReplExpressionsAccessibilityProvider = ReplExpressionsAccessibilityProvider;
    var ReplExpressionsActionProvider = (function () {
        function ReplExpressionsActionProvider(instantiationService) {
            this.instantiationService = instantiationService;
            // noop
        }
        ReplExpressionsActionProvider.prototype.hasActions = function (tree, element) {
            return false;
        };
        ReplExpressionsActionProvider.prototype.getActions = function (tree, element) {
            return winjs_base_1.TPromise.as([]);
        };
        ReplExpressionsActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return true;
        };
        ReplExpressionsActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            if (element instanceof model.Variable || element instanceof model.Expression) {
                actions.push(this.instantiationService.createInstance(debugactions.AddToWatchExpressionsAction, debugactions.AddToWatchExpressionsAction.ID, debugactions.AddToWatchExpressionsAction.LABEL, element));
                actions.push(new actionbar.Separator());
            }
            actions.push(new electronDebugActions_1.CopyAction(electronDebugActions_1.CopyAction.ID, electronDebugActions_1.CopyAction.LABEL));
            actions.push(this.instantiationService.createInstance(debugactions.ClearReplAction, debugactions.ClearReplAction.ID, debugactions.ClearReplAction.LABEL));
            return winjs_base_1.TPromise.as(actions);
        };
        ReplExpressionsActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        return ReplExpressionsActionProvider;
    }());
    exports.ReplExpressionsActionProvider = ReplExpressionsActionProvider;
    var ReplExpressionsController = (function (_super) {
        __extends(ReplExpressionsController, _super);
        function ReplExpressionsController(debugService, contextMenuService, actionProvider, replInput, focusOnContextMenu) {
            if (focusOnContextMenu === void 0) { focusOnContextMenu = true; }
            _super.call(this, debugService, contextMenuService, actionProvider, focusOnContextMenu);
            this.replInput = replInput;
            this.lastSelectedString = null;
        }
        ReplExpressionsController.prototype.onLeftClick = function (tree, element, eventish, origin) {
            if (origin === void 0) { origin = 'mouse'; }
            var mouseEvent = eventish;
            // input and output are one element in the tree => we only expand if the user clicked on the output.
            if ((element.reference > 0 || (element instanceof model.KeyValueOutputElement && element.getChildren().length > 0)) && mouseEvent.target.className.indexOf('input expression') === -1) {
                _super.prototype.onLeftClick.call(this, tree, element, eventish, origin);
                tree.clearFocus();
                tree.deselect(element);
            }
            var selection = window.getSelection();
            if (selection.type !== 'Range' || this.lastSelectedString === selection.toString()) {
                // only focus the input if the user is not currently selecting.
                this.replInput.focus();
            }
            this.lastSelectedString = selection.toString();
            return true;
        };
        ReplExpressionsController.prototype.onDown = function (tree, event) {
            if (tree.getFocus()) {
                return _super.prototype.onDown.call(this, tree, event);
            }
            var payload = { origin: 'keyboard', originalEvent: event };
            tree.focusLast(payload);
            tree.reveal(tree.getFocus()).done(null, errors.onUnexpectedError);
            return true;
        };
        return ReplExpressionsController;
    }(debugviewer.BaseDebugController));
    exports.ReplExpressionsController = ReplExpressionsController;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[12], __M([0,1,4,9,25,10,11,26,27,28,8,29,2,3,5,30,31,32,33,34,35,36,6]), function (require, exports, nls, errors, lifecycle, dom, platform, treeimpl, event_1, events_1, viewer, debug, debugModel_1, debugactions, replhistory, panel_1, telemetry_1, contextView_1, instantiation_1, contextService_1, storage_1, keyCodes_1) {
    "use strict";
    var $ = dom.emmet;
    var replTreeOptions = {
        indentPixels: 8,
        twistiePixels: 20,
        paddingOnRow: false,
        ariaLabel: nls.localize(0, null)
    };
    var HISTORY_STORAGE_KEY = 'debug.repl.history';
    var Repl = (function (_super) {
        __extends(Repl, _super);
        function Repl(debugService, contextMenuService, contextService, telemetryService, instantiationService, contextViewService, storageService, eventService) {
            _super.call(this, debug.REPL_ID, telemetryService);
            this.debugService = debugService;
            this.contextMenuService = contextMenuService;
            this.contextService = contextService;
            this.instantiationService = instantiationService;
            this.contextViewService = contextViewService;
            this.storageService = storageService;
            this.eventService = eventService;
            this.toDispose = [];
            this.registerListeners();
        }
        Repl.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.debugService.getModel().onDidChangeReplElements(function () {
                _this.onReplElementsUpdated();
            }));
            this.toDispose.push(this.eventService.addListener2(events_1.EventType.COMPOSITE_OPENED, function (e) {
                if (e.compositeId === debug.REPL_ID) {
                    var elements = _this.debugService.getModel().getReplElements();
                    if (elements.length > 0) {
                        return _this.reveal(elements[elements.length - 1]);
                    }
                }
            }));
        };
        Repl.prototype.onReplElementsUpdated = function () {
            var _this = this;
            if (this.tree) {
                if (this.refreshTimeoutHandle) {
                    return; // refresh already triggered
                }
                this.refreshTimeoutHandle = setTimeout(function () {
                    _this.refreshTimeoutHandle = null;
                    var scrollPosition = _this.tree.getScrollPosition();
                    _this.tree.refresh().then(function () {
                        if (scrollPosition === 0 || scrollPosition === 1) {
                            _this.tree.setScrollPosition(1); // keep scrolling to the end unless user scrolled up
                        }
                        // If the last repl element has children - auto expand it #6019
                        var elements = _this.debugService.getModel().getReplElements();
                        var lastElement = elements.length > 0 ? elements[elements.length - 1] : null;
                        if (lastElement instanceof debugModel_1.Expression && lastElement.reference > 0) {
                            return _this.tree.expand(elements[elements.length - 1]).then(function () {
                                return _this.tree.reveal(elements[elements.length - 1], 0);
                            });
                        }
                    }, errors.onUnexpectedError);
                }, Repl.REFRESH_DELAY);
            }
        };
        Repl.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            var container = dom.append(parent.getHTMLElement(), $('.repl'));
            this.treeContainer = dom.append(container, $('.repl-tree'));
            var replInputContainer = dom.append(container, $('.repl-input-wrapper'));
            this.replInput = dom.append(replInputContainer, $('input.repl-input'));
            this.replInput.type = 'text';
            this.toDispose.push(dom.addStandardDisposableListener(this.replInput, 'keydown', function (e) {
                if (e.equals(keyCodes_1.CommonKeybindings.ENTER)) {
                    _this.debugService.addReplExpression(_this.replInput.value);
                    Repl.HISTORY.evaluated(_this.replInput.value);
                    _this.replInput.value = '';
                    e.preventDefault();
                }
                else if (e.equals(keyCodes_1.CommonKeybindings.UP_ARROW) || e.equals(keyCodes_1.CommonKeybindings.DOWN_ARROW)) {
                    var historyInput = e.equals(keyCodes_1.CommonKeybindings.UP_ARROW) ? Repl.HISTORY.previous() : Repl.HISTORY.next();
                    if (historyInput) {
                        Repl.HISTORY.remember(_this.replInput.value, e.equals(keyCodes_1.CommonKeybindings.UP_ARROW));
                        _this.replInput.value = historyInput;
                        // always leave cursor at the end.
                        e.preventDefault();
                    }
                }
            }));
            this.toDispose.push(dom.addStandardDisposableListener(this.replInput, dom.EventType.FOCUS, function () { return dom.addClass(replInputContainer, 'synthetic-focus'); }));
            this.toDispose.push(dom.addStandardDisposableListener(this.replInput, dom.EventType.BLUR, function () { return dom.removeClass(replInputContainer, 'synthetic-focus'); }));
            this.characterWidthSurveyor = dom.append(container, $('.surveyor'));
            this.characterWidthSurveyor.textContent = Repl.HALF_WIDTH_TYPICAL;
            for (var i = 0; i < 10; i++) {
                this.characterWidthSurveyor.textContent += this.characterWidthSurveyor.textContent;
            }
            this.characterWidthSurveyor.style.fontSize = platform.isMacintosh ? '12px' : '14px';
            this.renderer = this.instantiationService.createInstance(viewer.ReplExpressionsRenderer);
            this.tree = new treeimpl.Tree(this.treeContainer, {
                dataSource: new viewer.ReplExpressionsDataSource(this.debugService),
                renderer: this.renderer,
                accessibilityProvider: new viewer.ReplExpressionsAccessibilityProvider(),
                controller: new viewer.ReplExpressionsController(this.debugService, this.contextMenuService, new viewer.ReplExpressionsActionProvider(this.instantiationService), this.replInput, false)
            }, replTreeOptions);
            if (!Repl.HISTORY) {
                Repl.HISTORY = new replhistory.ReplHistory(JSON.parse(this.storageService.get(HISTORY_STORAGE_KEY, storage_1.StorageScope.WORKSPACE, '[]')));
            }
            return this.tree.setInput(this.debugService.getModel());
        };
        Repl.prototype.layout = function (dimension) {
            if (this.tree) {
                this.renderer.setWidth(dimension.width - 25, this.characterWidthSurveyor.clientWidth / this.characterWidthSurveyor.textContent.length);
                this.tree.layout(dimension.height - 22);
                // refresh the tree because layout might require some elements be word wrapped differently
                this.tree.refresh().done(undefined, errors.onUnexpectedError);
            }
        };
        Repl.prototype.focus = function () {
            this.replInput.focus();
        };
        Repl.prototype.reveal = function (element) {
            return this.tree.reveal(element);
        };
        Repl.prototype.getActions = function () {
            var _this = this;
            if (!this.actions) {
                this.actions = [
                    this.instantiationService.createInstance(debugactions.ClearReplAction, debugactions.ClearReplAction.ID, debugactions.ClearReplAction.LABEL)
                ];
                this.actions.forEach(function (a) {
                    _this.toDispose.push(a);
                });
            }
            return this.actions;
        };
        Repl.prototype.shutdown = function () {
            this.storageService.store(HISTORY_STORAGE_KEY, JSON.stringify(Repl.HISTORY.save()), storage_1.StorageScope.WORKSPACE);
        };
        Repl.prototype.dispose = function () {
            // destroy container
            this.toDispose = lifecycle.dispose(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        Repl.HALF_WIDTH_TYPICAL = 'n';
        Repl.REFRESH_DELAY = 500; // delay in ms to refresh the repl for new elements to show
        Repl = __decorate([
            __param(0, debug.IDebugService),
            __param(1, contextView_1.IContextMenuService),
            __param(2, contextService_1.IWorkspaceContextService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, contextView_1.IContextViewService),
            __param(6, storage_1.IStorageService),
            __param(7, event_1.IEventService)
        ], Repl);
        return Repl;
    }(panel_1.Panel));
    exports.Repl = Repl;
});

}).call(this);
//# sourceMappingURL=repl.js.map
