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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/common/lifecycle', 'vs/base/common/objects', 'vs/base/common/event', 'vs/base/browser/dom', 'vs/base/parts/tree/browser/treeImpl', 'vs/base/parts/tree/browser/treeDefaults', 'vs/base/browser/ui/highlightedlabel/highlightedLabel', 'vs/editor/browser/editorBrowser', 'vs/editor/common/editorCommon', 'vs/platform/telemetry/common/telemetry', '../common/suggest', 'vs/platform/keybinding/common/keybindingService', 'vs/editor/common/modes/modesFilters', 'vs/base/common/arrays', 'vs/base/common/errors', 'vs/platform/instantiation/common/instantiation', 'vs/css!./suggest'], function (require, exports, nls, winjs_base_1, lifecycle_1, objects_1, event_1, dom_1, TreeImpl, TreeDefaults, HighlightedLabel, EditorBrowser, EditorCommon, telemetry_1, suggest_1, keybindingService_1, modesFilters_1, arrays_1, errors_1, instantiation_1) {
    var CompletionItem = (function () {
        function CompletionItem(group, suggestion, container) {
            this.group = group;
            this.id = '_completion_item_#' + CompletionItem._idPool++;
            this.support = container.support;
            this.suggestion = suggestion;
            this.container = container;
        }
        CompletionItem.prototype.resolveDetails = function (resource, position) {
            var _this = this;
            if (this._resolveDetails) {
                return this._resolveDetails;
            }
            if (!this.support || typeof this.support.getSuggestionDetails !== 'function') {
                return this._resolveDetails = winjs_base_1.TPromise.as(this);
            }
            return this._resolveDetails = this.support
                .getSuggestionDetails(resource, position, this.suggestion)
                .then(function (value) { return _this.suggestion = objects_1.assign(_this.suggestion, value); }, function (err) { return errors_1.isPromiseCanceledError(err) ? _this._resolveDetails = null : errors_1.onUnexpectedError(err); })
                .then(function () { return _this; });
        };
        CompletionItem._idPool = 0;
        return CompletionItem;
    })();
    var defaultCompare = function (a, b) { return (a.sortText || a.label).localeCompare((b.sortText || b.label)); };
    var CompletionGroup = (function () {
        function CompletionGroup(model, index, raw) {
            var _this = this;
            this.model = model;
            this.index = index;
            this.incomplete = false;
            this.size = 0;
            this.items = raw.reduce(function (items, result) {
                _this.incomplete = result.incomplete || _this.incomplete;
                _this.size += result.suggestions.length;
                return items.concat(result.suggestions
                    .map(function (suggestion) { return new CompletionItem(_this, suggestion, result); }));
            }, []);
            this.compare = defaultCompare;
            this.filter = modesFilters_1.DefaultFilter;
            if (this.items.length > 0) {
                var first = this.items[0];
                if (first.support) {
                    this.compare = first.support.getSorter && first.support.getSorter() || this.compare;
                    this.filter = first.support.getFilter && first.support.getFilter() || this.filter;
                }
            }
        }
        Object.defineProperty(CompletionGroup.prototype, "visibleCount", {
            get: function () {
                var _this = this;
                return this.items.reduce(function (r, i) { return r + (arrays_1.isFalsyOrEmpty(_this.filter(_this.model.currentWord, i.suggestion)) ? 0 : 1); }, 0);
            },
            enumerable: true,
            configurable: true
        });
        return CompletionGroup;
    })();
    var CompletionModel = (function () {
        function CompletionModel(raw, currentWord) {
            var _this = this;
            this.raw = raw;
            this.currentWord = currentWord;
            this.incomplete = false;
            this.size = 0;
            this.groups = raw
                .filter(function (s) { return !!s; })
                .map(function (suggestResults, index) {
                var group = new CompletionGroup(_this, index, suggestResults);
                _this.incomplete = group.incomplete || _this.incomplete;
                _this.size += group.size;
                return group;
            });
        }
        Object.defineProperty(CompletionModel.prototype, "items", {
            get: function () {
                return this.groups.reduce(function (r, groups) { return r.concat(groups.items); }, []);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompletionModel.prototype, "visibleCount", {
            get: function () {
                return this.groups.reduce(function (r, g) { return r + g.visibleCount; }, 0);
            },
            enumerable: true,
            configurable: true
        });
        return CompletionModel;
    })();
    // To be used as a tree element when we want to show a message
    var Message = (function () {
        function Message(parent, message) {
            this.parent = parent;
            this.message = message;
            // nothing to do
        }
        return Message;
    })();
    exports.Message = Message;
    var MessageRoot = (function () {
        function MessageRoot(message) {
            this.child = new Message(this, message);
        }
        return MessageRoot;
    })();
    exports.MessageRoot = MessageRoot;
    function isRoot(element) {
        return element instanceof MessageRoot || element instanceof CompletionModel;
    }
    var DataSource = (function () {
        function DataSource() {
        }
        DataSource.prototype.getId = function (tree, element) {
            if (element instanceof MessageRoot) {
                return 'messageroot';
            }
            else if (element instanceof Message) {
                return 'message' + element.message;
            }
            else if (element instanceof CompletionModel) {
                return 'root';
            }
            else if (element instanceof CompletionItem) {
                return element.id;
            }
            throw errors_1.illegalArgument('element');
        };
        DataSource.prototype.getParent = function (tree, element) {
            if (isRoot(element)) {
                return winjs_base_1.TPromise.as(null);
            }
            else if (element instanceof Message) {
                return winjs_base_1.TPromise.as(element.parent);
            }
            return winjs_base_1.TPromise.as(element.group.model);
        };
        DataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof MessageRoot) {
                return winjs_base_1.TPromise.as([element.child]);
            }
            else if (element instanceof CompletionModel) {
                return winjs_base_1.TPromise.as(element.items);
            }
            return winjs_base_1.TPromise.as([]);
        };
        DataSource.prototype.hasChildren = function (tree, element) {
            return isRoot(element);
        };
        return DataSource;
    })();
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller() {
            _super.apply(this, arguments);
        }
        /* protected */ Controller.prototype.onLeftClick = function (tree, element, event) {
            event.preventDefault();
            event.stopPropagation();
            if (!(element instanceof Message)) {
                tree.setSelection([element], { origin: 'mouse' });
            }
            return true;
        };
        return Controller;
    })(TreeDefaults.DefaultController);
    var Filter = (function () {
        function Filter(getState) {
            this.getState = getState;
        }
        Filter.prototype.isVisible = function (tree, element) {
            if (isRoot(element)) {
                return false;
            }
            else if (element instanceof Message) {
                return true;
            }
            var item = element;
            var filter = item.group.filter;
            var currentWord = item.group.model.currentWord;
            item.highlights = filter(currentWord, item.suggestion);
            return !arrays_1.isFalsyOrEmpty(item.highlights);
        };
        return Filter;
    })();
    var Sorter = (function () {
        function Sorter() {
        }
        Sorter.prototype.compare = function (tree, item, otherItem) {
            var group = item.group;
            var otherGroup = otherItem.group;
            var result = group.index - otherGroup.index;
            if (result !== 0) {
                return result;
            }
            return group.compare(item.suggestion, otherItem.suggestion);
        };
        return Sorter;
    })();
    var Renderer = (function () {
        function Renderer(widget, keybindingService) {
            this.widget = widget;
            var keybindings = keybindingService.lookupKeybindings('editor.action.triggerSuggest');
            this.triggerKeybindingLabel = keybindings.length === 0 ? '' : " (" + keybindingService.getLabelFor(keybindings[0]) + ")";
        }
        Renderer.prototype.getHeight = function (tree, element) {
            if (element instanceof CompletionItem) {
                if (element.suggestion.documentationLabel && tree.isFocused(element)) {
                    return 35;
                }
            }
            return 19;
        };
        Renderer.prototype.getTemplateId = function (tree, element) {
            return (element instanceof Message) ? 'message' : 'suggestion';
        };
        Renderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (templateId === 'message') {
                var span = dom_1.emmet('span');
                span.style.opacity = '0.7';
                container.appendChild(span);
                return { element: span };
            }
            var data = Object.create(null);
            data.root = container;
            data.icon = dom_1.append(container, dom_1.emmet('.icon'));
            data.colorspan = dom_1.append(data.icon, dom_1.emmet('span.colorspan'));
            var text = dom_1.append(container, dom_1.emmet('.text'));
            var main = dom_1.append(text, dom_1.emmet('.main'));
            data.highlightedLabel = new HighlightedLabel.HighlightedLabel(main);
            data.typeLabel = dom_1.append(main, dom_1.emmet('span.type-label'));
            var docs = dom_1.append(text, dom_1.emmet('.docs'));
            data.documentation = dom_1.append(docs, dom_1.emmet('span.docs-text'));
            data.documentationDetails = dom_1.append(docs, dom_1.emmet('span.docs-details.octicon.octicon-info'));
            data.documentationDetails.title = nls.localize('readMore', "Read More...{0}", this.triggerKeybindingLabel);
            return data;
        };
        Renderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            var _this = this;
            if (templateId === 'message') {
                templateData.element.textContent = element.message;
                return;
            }
            var data = templateData;
            var suggestion = element.suggestion;
            if (suggestion.type && suggestion.type.charAt(0) === '#') {
                data.root.setAttribute('aria-label', 'color');
                data.icon.className = 'icon customcolor';
                data.colorspan.style.backgroundColor = suggestion.type.substring(1);
            }
            else {
                data.root.setAttribute('aria-label', suggestion.type);
                data.icon.className = 'icon ' + suggestion.type;
                data.colorspan.style.backgroundColor = '';
            }
            data.highlightedLabel.set(suggestion.label, element.highlights);
            data.typeLabel.textContent = suggestion.typeLabel || '';
            data.documentation.textContent = suggestion.documentationLabel || '';
            if (suggestion.documentationLabel) {
                dom_1.show(data.documentationDetails);
                data.documentationDetails.onclick = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this.widget.toggleDetails();
                };
            }
            else {
                dom_1.hide(data.documentationDetails);
                data.documentationDetails.onclick = null;
            }
        };
        Renderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            if (templateId === 'message') {
                return;
            }
            var data = templateData;
            data.highlightedLabel.dispose();
        };
        Renderer = __decorate([
            __param(1, keybindingService_1.IKeybindingService)
        ], Renderer);
        return Renderer;
    })();
    function computeScore(suggestion, currentWord, currentWordLowerCase) {
        var suggestionLowerCase = suggestion.toLowerCase();
        var score = 0;
        for (var i = 0; i < currentWord.length && i < suggestion.length; i++) {
            if (currentWord[i] === suggestion[i]) {
                score += 2;
            }
            else if (currentWordLowerCase[i] === suggestionLowerCase[i]) {
                score += 1;
            }
            else {
                break;
            }
        }
        return score;
    }
    var State;
    (function (State) {
        State[State["Hidden"] = 0] = "Hidden";
        State[State["Loading"] = 1] = "Loading";
        State[State["Empty"] = 2] = "Empty";
        State[State["Open"] = 3] = "Open";
        State[State["Frozen"] = 4] = "Frozen";
        State[State["Details"] = 5] = "Details";
    })(State || (State = {}));
    var SuggestionDetails = (function () {
        function SuggestionDetails(container, widget) {
            this.widget = widget;
            this.el = dom_1.append(container, dom_1.emmet('.details'));
            var header = dom_1.append(this.el, dom_1.emmet('.header'));
            this.title = dom_1.append(header, dom_1.emmet('span.title'));
            this.back = dom_1.append(header, dom_1.emmet('span.go-back.octicon.octicon-x'));
            this.back.title = nls.localize('goback', "Go back");
            this.body = dom_1.append(this.el, dom_1.emmet('.body'));
            this.type = dom_1.append(this.body, dom_1.emmet('p.type'));
            this.docs = dom_1.append(this.body, dom_1.emmet('p.docs'));
            dom_1.addDisposableListener(this.docs, 'mousewheel', function (e) { return e.stopPropagation(); });
        }
        Object.defineProperty(SuggestionDetails.prototype, "element", {
            get: function () {
                return this.el;
            },
            enumerable: true,
            configurable: true
        });
        SuggestionDetails.prototype.render = function (item) {
            var _this = this;
            if (!item) {
                this.title.textContent = '';
                this.type.textContent = '';
                this.docs.textContent = '';
                return;
            }
            this.title.innerText = item.suggestion.label;
            this.type.innerText = item.suggestion.typeLabel;
            this.docs.innerText = item.suggestion.documentationLabel;
            this.back.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.widget.toggleDetails();
            };
        };
        SuggestionDetails.prototype.scrollDown = function (much) {
            if (much === void 0) { much = 8; }
            this.body.scrollTop += much;
        };
        SuggestionDetails.prototype.scrollUp = function (much) {
            if (much === void 0) { much = 8; }
            this.body.scrollTop -= much;
        };
        SuggestionDetails.prototype.pageDown = function () {
            this.scrollDown(80);
        };
        SuggestionDetails.prototype.pageUp = function () {
            this.scrollUp(80);
        };
        SuggestionDetails.prototype.dispose = function () {
            this.el.parentElement.removeChild(this.el);
            this.el = null;
        };
        return SuggestionDetails;
    })();
    var SuggestWidget = (function () {
        function SuggestWidget(editor, model, keybindingService, telemetryService, instantiationService) {
            var _this = this;
            this.editor = editor;
            this.model = model;
            this.allowEditorOverflow = true; // Editor.IContentWidget.allowEditorOverflow
            this._onDidVisibilityChange = new event_1.Emitter();
            this.isAuto = false;
            this.oldFocus = null;
            this.suggestionSupportsAutoAccept = keybindingService.createKey(suggest_1.CONTEXT_SUGGESTION_SUPPORTS_ACCEPT_ON_KEY, true);
            this.telemetryData = null;
            this.telemetryService = telemetryService;
            this.element = dom_1.emmet('.editor-widget.suggest-widget.monaco-editor-background');
            this.element.style.width = SuggestWidget.WIDTH + 'px';
            this.element.style.top = '0';
            this.element.style.left = '0';
            if (!this.editor.getConfiguration().iconsInSuggestions) {
                dom_1.addClass(this.element, 'no-icons');
            }
            this.messageElement = dom_1.append(this.element, dom_1.emmet('.message'));
            this.treeElement = dom_1.append(this.element, dom_1.emmet('.tree'));
            this.details = new SuggestionDetails(this.element, this);
            this.renderer = instantiationService.createInstance(Renderer, this);
            var configuration = {
                renderer: this.renderer,
                dataSource: new DataSource(),
                controller: new Controller(),
                filter: new Filter(function () { return _this.state; }),
                sorter: new Sorter()
            };
            var options = {
                twistiePixels: 0,
                alwaysFocused: true,
                verticalScrollMode: 'visible',
                useShadows: false
            };
            this.tree = new TreeImpl.Tree(this.treeElement, configuration, options);
            this.toDispose = [
                editor.addListener2(EditorCommon.EventType.ModelChanged, function () { return _this.onModelModeChanged(); }),
                editor.addListener2(EditorCommon.EventType.ModelModeChanged, function () { return _this.onModelModeChanged(); }),
                editor.addListener2(EditorCommon.EventType.ModelModeSupportChanged, function (e) { return e.suggestSupport && _this.onModelModeChanged(); }),
                suggest_1.SuggestRegistry.onDidChange(function () { return _this.onModelModeChanged(); }),
                editor.addListener2(EditorCommon.EventType.EditorTextBlur, function () { return _this.onEditorBlur(); }),
                this.tree.addListener2('selection', function (e) { return _this.onTreeSelection(e); }),
                this.tree.addListener2('focus', function (e) { return _this.onTreeFocus(e); }),
                this.editor.addListener2(EditorCommon.EventType.CursorSelectionChanged, function () { return _this.onCursorSelectionChanged(); }),
                this.model.onDidTrigger(function (e) { return _this.onDidTrigger(e); }),
                this.model.onDidSuggest(function (e) { return _this.onDidSuggest(e); }),
                this.model.onDidCancel(function (e) { return _this.onDidCancel(e); })
            ];
            this.onModelModeChanged();
            this.editor.addContentWidget(this);
            this.setState(State.Hidden);
        }
        Object.defineProperty(SuggestWidget.prototype, "onDidVisibilityChange", {
            get: function () { return this._onDidVisibilityChange.event; },
            enumerable: true,
            configurable: true
        });
        SuggestWidget.prototype.onCursorSelectionChanged = function () {
            if (this.state === State.Hidden) {
                return;
            }
            this.editor.layoutContentWidget(this);
        };
        SuggestWidget.prototype.onEditorBlur = function () {
            var _this = this;
            winjs_base_1.TPromise.timeout(150).done(function () {
                if (!_this.editor.isFocused()) {
                    _this.setState(State.Hidden);
                }
            });
        };
        SuggestWidget.prototype.onTreeSelection = function (e) {
            if (!e.selection || e.selection.length === 0) {
                return;
            }
            var element = e.selection[0];
            if (!element.hasOwnProperty('suggestions') && !(element instanceof MessageRoot) && !(element instanceof Message)) {
                var item = element;
                var navigator_1 = this.tree.getNavigator();
                this.telemetryData.selectedIndex = 0;
                this.telemetryData.wasCancelled = false;
                while (navigator_1.next() !== item) {
                    this.telemetryData.selectedIndex++;
                }
                this.submitTelemetryData();
                var container = item.container;
                var overwriteBefore = (typeof item.suggestion.overwriteBefore === 'undefined') ? container.currentWord.length : item.suggestion.overwriteBefore;
                var overwriteAfter = (typeof item.suggestion.overwriteAfter === 'undefined') ? 0 : Math.max(0, item.suggestion.overwriteAfter);
                this.model.accept(item.suggestion, overwriteBefore, overwriteAfter);
                this.editor.focus();
            }
        };
        SuggestWidget.prototype.onTreeFocus = function (e) {
            var _this = this;
            var focus = e.focus;
            var payload = e.payload;
            if (focus instanceof CompletionItem) {
                this.resolveDetails(focus);
                this.suggestionSupportsAutoAccept.set(!focus.suggestion.noAutoAccept);
            }
            var elementsToRefresh = [];
            if (this.oldFocus) {
                elementsToRefresh.push(this.oldFocus);
            }
            if (focus) {
                elementsToRefresh.push(focus);
            }
            this.oldFocus = focus;
            this.tree.refreshAll(elementsToRefresh).done(function () {
                _this.updateWidgetHeight();
                if (focus) {
                    return _this.tree.reveal(focus, (payload && payload.firstSuggestion) ? 0 : null);
                }
            }, errors_1.onUnexpectedError);
        };
        SuggestWidget.prototype.onModelModeChanged = function () {
            var model = this.editor.getModel();
            var supports = suggest_1.SuggestRegistry.all(model);
            this.shouldShowEmptySuggestionList = supports.some(function (s) { return s.shouldShowEmptySuggestionList(); });
        };
        SuggestWidget.prototype.setState = function (state) {
            this.state = state;
            dom_1.toggleClass(this.element, 'frozen', state === State.Frozen);
            switch (state) {
                case State.Hidden:
                    dom_1.hide(this.messageElement, this.details.element);
                    dom_1.show(this.treeElement);
                    this.hide();
                    return;
                case State.Loading:
                    this.messageElement.innerText = SuggestWidget.LOADING_MESSAGE;
                    dom_1.hide(this.treeElement, this.details.element);
                    dom_1.show(this.messageElement);
                    break;
                case State.Empty:
                    this.messageElement.innerText = SuggestWidget.NO_SUGGESTIONS_MESSAGE;
                    dom_1.hide(this.treeElement, this.details.element);
                    dom_1.show(this.messageElement);
                    break;
                case State.Open:
                    dom_1.hide(this.messageElement, this.details.element);
                    dom_1.show(this.treeElement);
                    break;
                case State.Frozen:
                    dom_1.hide(this.messageElement, this.details.element);
                    dom_1.show(this.treeElement);
                    break;
                case State.Details:
                    dom_1.hide(this.messageElement, this.treeElement);
                    dom_1.show(this.details.element);
                    break;
            }
            this.updateWidgetHeight();
            this.show();
        };
        SuggestWidget.prototype.onDidTrigger = function (e) {
            var _this = this;
            if (this.state !== State.Hidden) {
                return;
            }
            this.telemetryTimer = this.telemetryService.start('suggestWidgetLoadingTime');
            this.isAuto = !!e.auto;
            if (!this.isAuto) {
                this.loadingTimeout = setTimeout(function () {
                    _this.loadingTimeout = null;
                    _this.setState(State.Loading);
                }, 50);
            }
            if (!e.retrigger) {
                this.telemetryData = {
                    wasAutomaticallyTriggered: e.characterTriggered
                };
            }
        };
        SuggestWidget.prototype.onDidSuggest = function (e) {
            var _this = this;
            clearTimeout(this.loadingTimeout);
            var model = this.tree.getInput();
            var promise = winjs_base_1.TPromise.as(null);
            var visibleCount;
            if (model && model.raw === e.suggestions) {
                var oldCurrentWord = model.currentWord;
                model.currentWord = e.currentWord;
                visibleCount = model.visibleCount;
                if (!e.auto && visibleCount === 0) {
                    model.currentWord = oldCurrentWord;
                    if (model.visibleCount > 0) {
                        this.setState(State.Frozen);
                    }
                    else {
                        this.setState(State.Empty);
                    }
                    return;
                }
                else {
                    promise = this.tree.refresh();
                }
            }
            else {
                model = new CompletionModel(e.suggestions, e.currentWord);
                visibleCount = model.visibleCount;
                promise = this.tree.setInput(model);
            }
            if (visibleCount === 0) {
                if (e.auto) {
                    this.setState(State.Hidden);
                }
                else {
                    if (this.shouldShowEmptySuggestionList) {
                        this.setState(State.Empty);
                    }
                    else {
                        this.setState(State.Hidden);
                    }
                }
                if (this.telemetryTimer) {
                    this.telemetryTimer.data = { reason: 'empty' };
                    this.telemetryTimer.stop();
                    this.telemetryTimer = null;
                }
                return;
            }
            promise.done(function () {
                var navigator = _this.tree.getNavigator();
                var currentWord = e.currentWord;
                var currentWordLowerCase = currentWord.toLowerCase();
                var suggestions = model.items;
                var index = 0;
                var bestSuggestionIndex = -1;
                var bestSuggestion = suggestions[0];
                var bestScore = -1;
                var item;
                while (item = navigator.next()) {
                    var score = computeScore(item.suggestion.label, currentWord, currentWordLowerCase);
                    if (score > bestScore) {
                        bestScore = score;
                        bestSuggestion = item;
                        bestSuggestionIndex = index;
                    }
                }
                _this.tree.setFocus(bestSuggestion, { firstSuggestion: true });
                _this.telemetryData = _this.telemetryData || {};
                _this.telemetryData.suggestionCount = suggestions.length;
                _this.telemetryData.suggestedIndex = bestSuggestionIndex;
                _this.telemetryData.hintLength = currentWord.length;
                _this.setState(State.Open);
                if (_this.telemetryTimer) {
                    _this.telemetryTimer.data = { reason: 'results' };
                    _this.telemetryTimer.stop();
                    _this.telemetryTimer = null;
                }
            }, errors_1.onUnexpectedError);
        };
        SuggestWidget.prototype.onDidCancel = function (e) {
            clearTimeout(this.loadingTimeout);
            if (!e.retrigger) {
                this.setState(State.Hidden);
                if (this.telemetryData) {
                    this.telemetryData.selectedIndex = -1;
                    this.telemetryData.wasCancelled = true;
                    this.submitTelemetryData();
                }
            }
            if (this.telemetryTimer) {
                this.telemetryTimer.data = { reason: 'cancel' };
                this.telemetryTimer.stop();
                this.telemetryTimer = null;
            }
        };
        SuggestWidget.prototype.resolveDetails = function (item) {
            var _this = this;
            if (!item) {
                return;
            }
            if (this.currentSuggestionDetails) {
                this.currentSuggestionDetails.cancel();
            }
            this.currentSuggestionDetails = item.resolveDetails(this.editor.getModel().getAssociatedResource(), this.model.getRequestPosition() || this.editor.getPosition());
            this.currentSuggestionDetails.then(function () {
                _this.currentSuggestionDetails = undefined;
                return _this.tree.refresh(item).then(function () { return _this.updateWidgetHeight(); });
            })
                .done(null, function (err) { return !errors_1.isPromiseCanceledError(err) && errors_1.onUnexpectedError(err); });
        };
        SuggestWidget.prototype.selectNextPage = function () {
            switch (this.state) {
                case State.Hidden:
                    return false;
                case State.Details:
                    this.details.pageDown();
                    return true;
                case State.Loading:
                    return !this.isAuto;
                default:
                    this.tree.focusNextPage();
                    return true;
            }
        };
        SuggestWidget.prototype.selectNext = function () {
            switch (this.state) {
                case State.Hidden:
                    return false;
                case State.Details:
                    this.details.scrollDown();
                    return true;
                case State.Loading:
                    return !this.isAuto;
                default:
                    var focus_1 = this.tree.getFocus();
                    this.tree.focusNext(1);
                    if (focus_1 === this.tree.getFocus()) {
                        this.tree.focusFirst();
                    }
                    return true;
            }
        };
        SuggestWidget.prototype.selectPreviousPage = function () {
            switch (this.state) {
                case State.Hidden:
                    return false;
                case State.Details:
                    this.details.pageUp();
                    return true;
                case State.Loading:
                    return !this.isAuto;
                default:
                    this.tree.focusPreviousPage();
                    return true;
            }
        };
        SuggestWidget.prototype.selectPrevious = function () {
            switch (this.state) {
                case State.Hidden:
                    return false;
                case State.Details:
                    this.details.scrollUp();
                    return true;
                case State.Loading:
                    return !this.isAuto;
                default:
                    var focus_2 = this.tree.getFocus();
                    this.tree.focusPrevious(1);
                    if (focus_2 === this.tree.getFocus()) {
                        this.tree.focusLast();
                    }
                    return true;
            }
        };
        SuggestWidget.prototype.acceptSelectedSuggestion = function () {
            switch (this.state) {
                case State.Hidden:
                    return false;
                case State.Loading:
                    return !this.isAuto;
                default:
                    var focus_3 = this.tree.getFocus();
                    if (focus_3) {
                        this.tree.setSelection([focus_3]);
                    }
                    else {
                        this.model.cancel();
                    }
                    return true;
            }
        };
        SuggestWidget.prototype.toggleDetails = function () {
            if (this.state === State.Details) {
                this.setState(State.Open);
                this.editor.focus();
                return;
            }
            if (this.state !== State.Open) {
                return;
            }
            var item = this.tree.getFocus();
            if (!item || !item.suggestion.documentationLabel) {
                return;
            }
            this.setState(State.Details);
            this.editor.focus();
        };
        SuggestWidget.prototype.show = function () {
            var _this = this;
            this._onDidVisibilityChange.fire(true);
            this.tree.layout();
            this.renderDetails();
            this.editor.layoutContentWidget(this);
            winjs_base_1.TPromise.timeout(100).done(function () {
                dom_1.addClass(_this.element, 'visible');
            });
        };
        SuggestWidget.prototype.hide = function () {
            this._onDidVisibilityChange.fire(false);
            dom_1.removeClass(this.element, 'visible');
            this.editor.layoutContentWidget(this);
        };
        SuggestWidget.prototype.cancel = function () {
            if (this.state === State.Details) {
                this.toggleDetails();
            }
            else {
                this.model.cancel();
            }
        };
        SuggestWidget.prototype.getPosition = function () {
            if (this.state === State.Hidden) {
                return null;
            }
            return {
                position: this.editor.getPosition(),
                preference: [EditorBrowser.ContentWidgetPositionPreference.BELOW, EditorBrowser.ContentWidgetPositionPreference.ABOVE]
            };
        };
        SuggestWidget.prototype.getDomNode = function () {
            return this.element;
        };
        SuggestWidget.prototype.getId = function () {
            return SuggestWidget.ID;
        };
        SuggestWidget.prototype.submitTelemetryData = function () {
            this.telemetryService.publicLog('suggestWidget', this.telemetryData);
            this.telemetryData = null;
        };
        SuggestWidget.prototype.updateWidgetHeight = function () {
            var height = 0;
            if (this.state === State.Empty || this.state === State.Loading) {
                height = 19;
            }
            else if (this.state === State.Details) {
                height = 12 * 19;
            }
            else {
                var focus_4 = this.tree.getFocus();
                var focusHeight = focus_4 ? this.renderer.getHeight(this.tree, focus_4) : 19;
                height += focusHeight;
                var suggestionCount = (this.tree.getContentHeight() - focusHeight) / 19;
                height += Math.min(suggestionCount, 11) * 19;
            }
            this.element.style.height = height + 'px';
            this.tree.layout(height);
            this.editor.layoutContentWidget(this);
        };
        SuggestWidget.prototype.renderDetails = function () {
            if (this.state !== State.Details) {
                this.details.render(null);
            }
            else {
                this.details.render(this.tree.getFocus());
            }
        };
        SuggestWidget.prototype.dispose = function () {
            this.state = null;
            this.suggestionSupportsAutoAccept = null;
            this.currentSuggestionDetails = null;
            this.oldFocus = null;
            this.telemetryData = null;
            this.telemetryService = null;
            this.telemetryTimer = null;
            this.element = null;
            this.messageElement = null;
            this.treeElement = null;
            this.details.dispose();
            this.details = null;
            this.tree.dispose();
            this.tree = null;
            this.renderer = null;
            this.toDispose = lifecycle_1.disposeAll(this.toDispose);
            this._onDidVisibilityChange.dispose();
            this._onDidVisibilityChange = null;
        };
        SuggestWidget.ID = 'editor.widget.suggestWidget';
        SuggestWidget.WIDTH = 438;
        SuggestWidget.LOADING_MESSAGE = nls.localize('suggestWidget.loading', "Loading...");
        SuggestWidget.NO_SUGGESTIONS_MESSAGE = nls.localize('suggestWidget.noSuggestions', "No suggestions.");
        SuggestWidget = __decorate([
            __param(2, keybindingService_1.IKeybindingService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, instantiation_1.IInstantiationService)
        ], SuggestWidget);
        return SuggestWidget;
    })();
    exports.SuggestWidget = SuggestWidget;
});
//# sourceMappingURL=suggestWidget.js.map