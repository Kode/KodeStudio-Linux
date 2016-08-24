/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["exports","require","vs/base/browser/ui/list/listPaging","vs/base/common/event","vs/workbench/parts/extensions/electron-browser/extensionsList","vs/base/browser/dom","vs/base/common/lifecycle","vs/platform/instantiation/common/instantiation","vs/workbench/parts/extensions/electron-browser/extensionsActions","vs/css!vs/workbench/parts/extensions/electron-browser/media/extensionsViewlet","vs/base/browser/ui/actionbar/actionbar","vs/css!vs/base/browser/ui/list/list","vs/platform/message/common/message","vs/base/common/arrays","vs/workbench/parts/extensions/electron-browser/extensionsWidgets","vs/base/common/events","vs/base/browser/ui/list/listWidget","vs/nls!vs/workbench/parts/extensions/electron-browser/extensionsViewlet","vs/base/common/async","vs/base/common/winjs.base","vs/base/common/errors","vs/base/browser/event","vs/base/browser/keyboardEvent","vs/base/common/keyCodes","vs/workbench/browser/viewlet","vs/base/common/paging","vs/platform/telemetry/common/telemetry","vs/workbench/parts/extensions/electron-browser/extensions","vs/platform/extensionManagement/common/extensionManagement","vs/workbench/parts/extensions/electron-browser/extensionsInput","vs/platform/progress/common/progress","vs/workbench/services/editor/common/editorService","vs/workbench/parts/extensions/electron-browser/extensionsViewlet"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[2], __M([1,0,13,16,3,11]), function (require, exports, arrays_1, listWidget_1, event_1) {
    "use strict";
    var PagedRenderer = (function () {
        function PagedRenderer(renderer, modelProvider) {
            this.renderer = renderer;
            this.modelProvider = modelProvider;
        }
        Object.defineProperty(PagedRenderer.prototype, "templateId", {
            get: function () { return this.renderer.templateId; },
            enumerable: true,
            configurable: true
        });
        PagedRenderer.prototype.renderTemplate = function (container) {
            var data = this.renderer.renderTemplate(container);
            return { data: data, disposable: { dispose: function () { } } };
        };
        PagedRenderer.prototype.renderElement = function (index, _, data) {
            var _this = this;
            data.disposable.dispose();
            var model = this.modelProvider();
            if (model.isResolved(index)) {
                return this.renderer.renderElement(model.get(index), index, data.data);
            }
            var promise = model.resolve(index);
            data.disposable = { dispose: function () { return promise.cancel(); } };
            this.renderer.renderPlaceholder(index, data.data);
            promise.done(function (entry) { return _this.renderer.renderElement(entry, index, data.data); });
        };
        PagedRenderer.prototype.disposeTemplate = function (data) {
            data.disposable.dispose();
            data.disposable = null;
            this.renderer.disposeTemplate(data.data);
            data.data = null;
        };
        return PagedRenderer;
    }());
    var PagedList = (function () {
        function PagedList(container, delegate, renderers) {
            var _this = this;
            var pagedRenderers = renderers.map(function (r) { return new PagedRenderer(r, function () { return _this.model; }); });
            this.list = new listWidget_1.List(container, delegate, pagedRenderers);
        }
        Object.defineProperty(PagedList.prototype, "onDOMFocus", {
            get: function () { return this.list.onDOMFocus; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "onFocusChange", {
            get: function () {
                var _this = this;
                return event_1.mapEvent(this.list.onFocusChange, function (_a) {
                    var elements = _a.elements, indexes = _a.indexes;
                    return ({ elements: elements.map(function (e) { return _this._model.get(e); }), indexes: indexes });
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "onSelectionChange", {
            get: function () {
                var _this = this;
                return event_1.mapEvent(this.list.onSelectionChange, function (_a) {
                    var elements = _a.elements, indexes = _a.indexes;
                    return ({ elements: elements.map(function (e) { return _this._model.get(e); }), indexes: indexes });
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "model", {
            get: function () {
                return this._model;
            },
            set: function (model) {
                this._model = model;
                (_a = this.list).splice.apply(_a, [0, this.list.length].concat(arrays_1.range(model.length)));
                var _a;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "scrollTop", {
            get: function () {
                return this.list.scrollTop;
            },
            set: function (scrollTop) {
                this.list.scrollTop = scrollTop;
            },
            enumerable: true,
            configurable: true
        });
        PagedList.prototype.focusNext = function (n, loop) {
            this.list.focusNext(n, loop);
        };
        PagedList.prototype.focusPrevious = function (n, loop) {
            this.list.focusPrevious(n, loop);
        };
        PagedList.prototype.selectNext = function (n, loop) {
            this.list.selectNext(n, loop);
        };
        PagedList.prototype.selectPrevious = function (n, loop) {
            this.list.selectPrevious(n, loop);
        };
        PagedList.prototype.focusNextPage = function () {
            this.list.focusNextPage();
        };
        PagedList.prototype.focusPreviousPage = function () {
            this.list.focusPreviousPage();
        };
        PagedList.prototype.getFocus = function () {
            return this.list.getFocus();
        };
        PagedList.prototype.setSelection = function () {
            var indexes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                indexes[_i - 0] = arguments[_i];
            }
            (_a = this.list).setSelection.apply(_a, indexes);
            var _a;
        };
        PagedList.prototype.layout = function (height) {
            this.list.layout(height);
        };
        PagedList.prototype.reveal = function (index, relativeTop) {
            this.list.reveal(index, relativeTop);
        };
        return PagedList;
    }());
    exports.PagedList = PagedList;
});


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[4], __M([1,0,5,6,10,7,12,8,14,15]), function (require, exports, dom_1, lifecycle_1, actionbar_1, instantiation_1, message_1, extensionsActions_1, extensionsWidgets_1, events_1) {
    'use strict';
    var Delegate = (function () {
        function Delegate() {
        }
        Delegate.prototype.getHeight = function () { return 62; };
        Delegate.prototype.getTemplateId = function () { return 'extension'; };
        return Delegate;
    }());
    exports.Delegate = Delegate;
    var actionOptions = { icon: true, label: true };
    var Renderer = (function () {
        function Renderer(instantiationService, messageService) {
            this.instantiationService = instantiationService;
            this.messageService = messageService;
        }
        Object.defineProperty(Renderer.prototype, "templateId", {
            get: function () { return 'extension'; },
            enumerable: true,
            configurable: true
        });
        Renderer.prototype.renderTemplate = function (root) {
            var _this = this;
            var element = dom_1.append(root, dom_1.emmet('.extension'));
            var icon = dom_1.append(element, dom_1.emmet('img.icon'));
            var details = dom_1.append(element, dom_1.emmet('.details'));
            var header = dom_1.append(details, dom_1.emmet('.header'));
            var name = dom_1.append(header, dom_1.emmet('span.name'));
            var version = dom_1.append(header, dom_1.emmet('span.version'));
            var installCount = dom_1.append(header, dom_1.emmet('span.install-count'));
            var ratings = dom_1.append(header, dom_1.emmet('span.ratings'));
            var description = dom_1.append(details, dom_1.emmet('.description.ellipsis'));
            var footer = dom_1.append(details, dom_1.emmet('.footer'));
            var author = dom_1.append(footer, dom_1.emmet('.author.ellipsis'));
            var actionbar = new actionbar_1.ActionBar(footer, { animated: false });
            actionbar.addListener2(events_1.EventType.RUN, function (_a) {
                var error = _a.error;
                return error && _this.messageService.show(message_1.Severity.Error, error);
            });
            var versionWidget = this.instantiationService.createInstance(extensionsWidgets_1.Label, version, function (e) { return e.version; });
            var installCountWidget = this.instantiationService.createInstance(extensionsWidgets_1.InstallWidget, installCount, { small: true });
            var ratingsWidget = this.instantiationService.createInstance(extensionsWidgets_1.RatingsWidget, ratings, { small: true });
            var installAction = this.instantiationService.createInstance(extensionsActions_1.CombinedInstallAction);
            var updateAction = this.instantiationService.createInstance(extensionsActions_1.UpdateAction);
            var restartAction = this.instantiationService.createInstance(extensionsActions_1.EnableAction);
            actionbar.push([restartAction, updateAction, installAction], actionOptions);
            var disposables = [versionWidget, installCountWidget, ratingsWidget, installAction, updateAction, restartAction, actionbar];
            return {
                element: element, icon: icon, name: name, installCount: installCount, ratings: ratings, author: author, description: description, disposables: disposables,
                set extension(extension) {
                    versionWidget.extension = extension;
                    installCountWidget.extension = extension;
                    ratingsWidget.extension = extension;
                    installAction.extension = extension;
                    updateAction.extension = extension;
                    restartAction.extension = extension;
                }
            };
        };
        Renderer.prototype.renderPlaceholder = function (index, data) {
            dom_1.addClass(data.element, 'loading');
            data.icon.src = '';
            data.name.textContent = '';
            data.author.textContent = '';
            data.description.textContent = '';
            data.installCount.style.display = 'none';
            data.ratings.style.display = 'none';
            data.extension = null;
        };
        Renderer.prototype.renderElement = function (extension, index, data) {
            dom_1.removeClass(data.element, 'loading');
            data.icon.src = extension.iconUrl;
            if (!data.icon.complete) {
                data.icon.style.visibility = 'hidden';
                data.icon.onload = function () { return data.icon.style.visibility = 'inherit'; };
            }
            else {
                data.icon.style.visibility = 'inherit';
            }
            data.name.textContent = extension.displayName;
            data.author.textContent = extension.publisherDisplayName;
            data.description.textContent = extension.description;
            data.installCount.style.display = '';
            data.ratings.style.display = '';
            data.extension = extension;
        };
        Renderer.prototype.disposeTemplate = function (data) {
            data.disposables = lifecycle_1.dispose(data.disposables);
        };
        Renderer = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, message_1.IMessageService)
        ], Renderer);
        return Renderer;
    }());
    exports.Renderer = Renderer;
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









define(__m[32], __M([1,0,17,18,19,6,20,3,21,22,23,24,5,25,26,2,7,4,27,8,28,29,30,31,9]), function (require, exports, nls_1, async_1, winjs_base_1, lifecycle_1, errors_1, event_1, event_2, keyboardEvent_1, keyCodes_1, viewlet_1, dom_1, paging_1, telemetry_1, listPaging_1, instantiation_1, extensionsList_1, extensions_1, extensionsActions_1, extensionManagement_1, extensionsInput_1, progress_1, editorService_1) {
    'use strict';
    var ExtensionsViewlet = (function (_super) {
        __extends(ExtensionsViewlet, _super);
        function ExtensionsViewlet(telemetryService, galleryService, extensionService, progressService, instantiationService, editorService, extensionsWorkbenchService) {
            _super.call(this, extensions_1.VIEWLET_ID, telemetryService);
            this.galleryService = galleryService;
            this.extensionService = extensionService;
            this.progressService = progressService;
            this.instantiationService = instantiationService;
            this.editorService = editorService;
            this.extensionsWorkbenchService = extensionsWorkbenchService;
            this._onSearchChange = new event_1.Emitter();
            this.onSearchChange = this._onSearchChange.event;
            this.disposables = [];
            this.searchDelayer = new async_1.ThrottledDelayer(500);
        }
        ExtensionsViewlet.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            parent.addClass('extensions-viewlet');
            this.root = parent.getHTMLElement();
            var header = dom_1.append(this.root, dom_1.emmet('.header'));
            this.searchBox = dom_1.append(header, dom_1.emmet('input.search-box'));
            this.searchBox.placeholder = nls_1.localize(0, null);
            this.disposables.push(dom_1.addStandardDisposableListener(this.searchBox, dom_1.EventType.FOCUS, function () { return dom_1.addClass(_this.searchBox, 'synthetic-focus'); }));
            this.disposables.push(dom_1.addStandardDisposableListener(this.searchBox, dom_1.EventType.BLUR, function () { return dom_1.removeClass(_this.searchBox, 'synthetic-focus'); }));
            this.extensionsBox = dom_1.append(this.root, dom_1.emmet('.extensions'));
            var delegate = new extensionsList_1.Delegate();
            var renderer = this.instantiationService.createInstance(extensionsList_1.Renderer);
            this.list = new listPaging_1.PagedList(this.extensionsBox, delegate, [renderer]);
            var onRawKeyDown = event_2.domEvent(this.searchBox, 'keydown');
            var onKeyDown = event_1.mapEvent(onRawKeyDown, function (e) { return new keyboardEvent_1.StandardKeyboardEvent(e); });
            var onEnter = event_1.filterEvent(onKeyDown, function (e) { return e.keyCode === keyCodes_1.KeyCode.Enter; });
            var onEscape = event_1.filterEvent(onKeyDown, function (e) { return e.keyCode === keyCodes_1.KeyCode.Escape; });
            var onUpArrow = event_1.filterEvent(onKeyDown, function (e) { return e.keyCode === keyCodes_1.KeyCode.UpArrow; });
            var onDownArrow = event_1.filterEvent(onKeyDown, function (e) { return e.keyCode === keyCodes_1.KeyCode.DownArrow; });
            var onPageUpArrow = event_1.filterEvent(onKeyDown, function (e) { return e.keyCode === keyCodes_1.KeyCode.PageUp; });
            var onPageDownArrow = event_1.filterEvent(onKeyDown, function (e) { return e.keyCode === keyCodes_1.KeyCode.PageDown; });
            onEnter(this.onEnter, this, this.disposables);
            onEscape(this.onEscape, this, this.disposables);
            onUpArrow(this.onUpArrow, this, this.disposables);
            onDownArrow(this.onDownArrow, this, this.disposables);
            onPageUpArrow(this.onPageUpArrow, this, this.disposables);
            onPageDownArrow(this.onPageDownArrow, this, this.disposables);
            var onInput = event_2.domEvent(this.searchBox, 'input');
            onInput(function () { return _this.triggerSearch(); }, null, this.disposables);
            var onSelectedExtension = event_1.filterEvent(event_1.mapEvent(this.list.onSelectionChange, function (e) { return e.elements[0]; }), function (e) { return !!e; });
            onSelectedExtension(this.onExtensionSelected, this, this.disposables);
            return winjs_base_1.TPromise.as(null);
        };
        ExtensionsViewlet.prototype.setVisible = function (visible) {
            var _this = this;
            return _super.prototype.setVisible.call(this, visible).then(function () {
                if (visible) {
                    _this.searchBox.focus();
                    _this.searchBox.setSelectionRange(0, _this.searchBox.value.length);
                    _this.triggerSearch(true, true);
                }
                else {
                    _this.list.model = new paging_1.PagedModel([]);
                }
            });
        };
        ExtensionsViewlet.prototype.focus = function () {
            this.searchBox.focus();
        };
        ExtensionsViewlet.prototype.layout = function (_a) {
            var height = _a.height, width = _a.width;
            this.list.layout(height - 38);
            dom_1.toggleClass(this.root, 'narrow', width <= 300);
        };
        ExtensionsViewlet.prototype.getOptimalWidth = function () {
            return 400;
        };
        ExtensionsViewlet.prototype.getActions = function () {
            if (!this.primaryActions) {
                this.primaryActions = [
                    this.instantiationService.createInstance(extensionsActions_1.ClearExtensionsInputAction, extensionsActions_1.ClearExtensionsInputAction.ID, extensionsActions_1.ClearExtensionsInputAction.LABEL, this.onSearchChange)
                ];
            }
            return this.primaryActions;
        };
        ExtensionsViewlet.prototype.getSecondaryActions = function () {
            if (!this.secondaryActions) {
                this.secondaryActions = [
                    this.instantiationService.createInstance(extensionsActions_1.ShowInstalledExtensionsAction, extensionsActions_1.ShowInstalledExtensionsAction.ID, extensionsActions_1.ShowInstalledExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowOutdatedExtensionsAction, extensionsActions_1.ShowOutdatedExtensionsAction.ID, extensionsActions_1.ShowOutdatedExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowRecommendedExtensionsAction, extensionsActions_1.ShowRecommendedExtensionsAction.ID, extensionsActions_1.ShowRecommendedExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowPopularExtensionsAction, extensionsActions_1.ShowPopularExtensionsAction.ID, extensionsActions_1.ShowPopularExtensionsAction.LABEL)
                ];
            }
            return this.secondaryActions;
        };
        ExtensionsViewlet.prototype.search = function (text, immediate) {
            if (immediate === void 0) { immediate = false; }
            this.searchBox.value = text;
            this.triggerSearch(immediate);
        };
        ExtensionsViewlet.prototype.triggerSearch = function (immediate, suggestPopular) {
            var _this = this;
            if (immediate === void 0) { immediate = false; }
            if (suggestPopular === void 0) { suggestPopular = false; }
            var text = this.searchBox.value;
            this._onSearchChange.fire(text);
            this.searchDelayer.trigger(function () { return _this.doSearch(text, suggestPopular); }, immediate || !text ? 0 : 500);
        };
        ExtensionsViewlet.prototype.doSearch = function (text, suggestPopular) {
            var _this = this;
            if (text === void 0) { text = ''; }
            if (suggestPopular === void 0) { suggestPopular = false; }
            var progressRunner = this.progressService.show(true);
            var promise;
            if (!text) {
                promise = this.extensionsWorkbenchService.queryLocal()
                    .then(function (result) {
                    if (result.length === 0 && suggestPopular) {
                        _this.search('@popular', true);
                    }
                    return result;
                });
            }
            else if (/@outdated/i.test(text)) {
                promise = this.extensionsWorkbenchService.queryLocal()
                    .then(function (result) { return result.filter(function (e) { return e.outdated; }); });
            }
            else if (/@popular/i.test(text)) {
                promise = this.extensionsWorkbenchService.queryGallery({ sortBy: extensionManagement_1.SortBy.InstallCount });
            }
            else if (/@recommended/i.test(text)) {
                promise = this.extensionsWorkbenchService.getRecommendations();
            }
            else {
                promise = this.extensionsWorkbenchService.queryGallery({ text: text });
            }
            return async_1.always(promise, function () { return progressRunner.done(); })
                .then(function (result) { return new paging_1.PagedModel(result); })
                .then(function (model) {
                _this.list.model = model;
                _this.list.scrollTop = 0;
            });
        };
        ExtensionsViewlet.prototype.onExtensionSelected = function (extension) {
            this.editorService.openEditor(this.instantiationService.createInstance(extensionsInput_1.ExtensionsInput, extension))
                .done(null, errors_1.onUnexpectedError);
        };
        ExtensionsViewlet.prototype.onEnter = function () {
            (_a = this.list).setSelection.apply(_a, this.list.getFocus());
            var _a;
        };
        ExtensionsViewlet.prototype.onEscape = function () {
            this.searchBox.value = '';
            this.triggerSearch(true);
        };
        ExtensionsViewlet.prototype.onUpArrow = function () {
            this.list.focusPrevious();
            this.list.reveal(this.list.getFocus()[0]);
        };
        ExtensionsViewlet.prototype.onDownArrow = function () {
            this.list.focusNext();
            this.list.reveal(this.list.getFocus()[0]);
        };
        ExtensionsViewlet.prototype.onPageUpArrow = function () {
            this.list.focusPreviousPage();
            this.list.reveal(this.list.getFocus()[0]);
        };
        ExtensionsViewlet.prototype.onPageDownArrow = function () {
            this.list.focusNextPage();
            this.list.reveal(this.list.getFocus()[0]);
        };
        ExtensionsViewlet.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
            _super.prototype.dispose.call(this);
        };
        ExtensionsViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, extensionManagement_1.IExtensionGalleryService),
            __param(2, extensionManagement_1.IExtensionManagementService),
            __param(3, progress_1.IProgressService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, editorService_1.IWorkbenchEditorService),
            __param(6, extensions_1.IExtensionsWorkbenchService)
        ], ExtensionsViewlet);
        return ExtensionsViewlet;
    }(viewlet_1.Viewlet));
    exports.ExtensionsViewlet = ExtensionsViewlet;
});

}).call(this);
//# sourceMappingURL=extensionsViewlet.js.map
