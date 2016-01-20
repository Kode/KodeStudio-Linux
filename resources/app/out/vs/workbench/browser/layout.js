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
define(["require", "exports", 'vs/base/browser/builder', 'vs/workbench/common/constants', 'vs/workbench/common/events', 'vs/base/browser/ui/sash/sash', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/services/part/common/partService', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/storage/common/storage', 'vs/platform/contextview/browser/contextView', 'vs/platform/event/common/event'], function (require, exports, builder_1, constants_1, events_1, sash_1, editorService_1, partService_1, contextService_1, storage_1, contextView_1, event_1) {
    var DEFAULT_MIN_PART_WIDTH = 170;
    var HIDE_SIDEBAR_WIDTH_THRESHOLD = 50;
    var LAYOUT_RELATED_PREFERENCES = [
        constants_1.Preferences.THEME
    ];
    var LayoutOptions = (function () {
        function LayoutOptions() {
            this.margin = new builder_1.Box(0, 0, 0, 0);
        }
        LayoutOptions.prototype.setMargin = function (margin) {
            this.margin = margin;
            return this;
        };
        return LayoutOptions;
    })();
    exports.LayoutOptions = LayoutOptions;
    /**
     * The workbench layout is responsible to lay out all parts that make the Monaco Workbench.
     */
    var WorkbenchLayout = (function () {
        function WorkbenchLayout(parent, workbenchContainer, activitybar, editor, sidebar, statusbar, quickopen, options, storageService, eventService, contextViewService, editorService, contextService, partService) {
            this.storageService = storageService;
            this.eventService = eventService;
            this.contextViewService = contextViewService;
            this.editorService = editorService;
            this.contextService = contextService;
            this.partService = partService;
            this.parent = parent;
            this.workbenchContainer = workbenchContainer;
            this.activitybar = activitybar;
            this.editor = editor;
            this.sidebar = sidebar;
            this.statusbar = statusbar;
            this.quickopen = quickopen;
            this.options = options || new LayoutOptions();
            this.toUnbind = [];
            this.computedStyles = null;
            this.sash = new sash_1.Sash(this.workbenchContainer.getHTMLElement(), this, {
                baseSize: 5
            });
            this.sidebarWidth = this.storageService.getInteger(WorkbenchLayout.sashWidthSettingsKey, storage_1.StorageScope.GLOBAL, -1);
            this.registerListeners();
            this.registerSashListeners();
        }
        WorkbenchLayout.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.eventService.addListener(storage_1.StorageEventType.STORAGE, function (e) { return _this.onPreferenceChange(e); }));
            this.toUnbind.push(this.eventService.addListener(events_1.EventType.EDITOR_INPUT_CHANGING, function (e) { return _this.onEditorInputChanging(e); }));
        };
        WorkbenchLayout.prototype.registerSashListeners = function () {
            var _this = this;
            var startX = 0;
            this.sash.addListener('start', function (e) {
                _this.startSidebarWidth = _this.sidebarWidth;
                startX = e.startX;
            });
            this.sash.addListener('change', function (e) {
                var doLayout = false;
                var sidebarPosition = _this.partService.getSideBarPosition();
                var isSidebarHidden = _this.partService.isSideBarHidden();
                var newSashWidth = (sidebarPosition === partService_1.Position.LEFT) ? _this.startSidebarWidth + e.currentX - startX : _this.startSidebarWidth - e.currentX + startX;
                // Sidebar visible
                if (!isSidebarHidden) {
                    // Automatically hide side bar when a certain threshold is met
                    if (newSashWidth + HIDE_SIDEBAR_WIDTH_THRESHOLD < _this.computedStyles.sidebar.minWidth) {
                        var dragCompensation = DEFAULT_MIN_PART_WIDTH - HIDE_SIDEBAR_WIDTH_THRESHOLD;
                        _this.partService.setSideBarHidden(true);
                        startX = (sidebarPosition === partService_1.Position.LEFT) ? Math.max(_this.computedStyles.activitybar.minWidth, e.currentX - dragCompensation) : Math.min(e.currentX + dragCompensation, _this.workbenchSize.width - _this.computedStyles.activitybar.minWidth);
                        _this.sidebarWidth = _this.startSidebarWidth; // when restoring sidebar, restore to the sidebar width we started from
                    }
                    else {
                        _this.sidebarWidth = Math.max(_this.computedStyles.sidebar.minWidth, newSashWidth); // Sidebar can not become smaller than MIN_PART_WIDTH
                        doLayout = newSashWidth >= _this.computedStyles.sidebar.minWidth;
                    }
                }
                else {
                    if ((sidebarPosition === partService_1.Position.LEFT && e.currentX - startX >= _this.computedStyles.sidebar.minWidth) ||
                        (sidebarPosition === partService_1.Position.RIGHT && startX - e.currentX >= _this.computedStyles.sidebar.minWidth)) {
                        _this.startSidebarWidth = _this.computedStyles.sidebar.minWidth - (sidebarPosition === partService_1.Position.LEFT ? e.currentX - startX : startX - e.currentX);
                        _this.sidebarWidth = _this.computedStyles.sidebar.minWidth;
                        _this.partService.setSideBarHidden(false);
                    }
                }
                if (doLayout) {
                    _this.layout();
                }
            });
            this.sash.addListener('end', function () {
                _this.storageService.store(WorkbenchLayout.sashWidthSettingsKey, _this.sidebarWidth, storage_1.StorageScope.GLOBAL);
            });
        };
        WorkbenchLayout.prototype.onEditorInputChanging = function (e) {
            // Make sure that we layout properly in case we detect that the sidebar is large enought to cause
            // multiple opened editors to go below minimal size. The fix is to trigger a layout for any editor
            // input change that falls into this category.
            if (this.workbenchSize && this.sidebarWidth) {
                var visibleEditors = this.editorService.getVisibleEditors().length;
                if (visibleEditors > 1 && this.workbenchSize.width - this.sidebarWidth < visibleEditors * DEFAULT_MIN_PART_WIDTH) {
                    this.layout();
                }
            }
        };
        WorkbenchLayout.prototype.onPreferenceChange = function (e) {
            if (e.key && LAYOUT_RELATED_PREFERENCES.indexOf(e.key) >= 0) {
                // Recompute Styles
                this.computeStyle();
                this.editor.getLayout().computeStyle();
                this.sidebar.getLayout().computeStyle();
                // Trigger Layout
                this.layout();
            }
        };
        WorkbenchLayout.prototype.computeStyle = function () {
            var sidebarStyle = this.sidebar.getContainer().getComputedStyle();
            var editorStyle = this.editor.getContainer().getComputedStyle();
            var activitybarStyle = this.activitybar.getContainer().getComputedStyle();
            this.computedStyles = {
                activitybar: {
                    minWidth: parseInt(activitybarStyle.getPropertyValue('min-width'), 10) || 0
                },
                sidebar: {
                    minWidth: parseInt(sidebarStyle.getPropertyValue('min-width'), 10) || DEFAULT_MIN_PART_WIDTH
                },
                editor: {
                    minWidth: parseInt(editorStyle.getPropertyValue('min-width'), 10) || DEFAULT_MIN_PART_WIDTH
                },
                statusbar: {
                    height: 0
                }
            };
            if (this.statusbar) {
                var statusbarStyle = this.statusbar.getContainer().getComputedStyle();
                this.computedStyles.statusbar.height = parseInt(statusbarStyle.getPropertyValue('height'), 10) || 18;
            }
        };
        WorkbenchLayout.prototype.layout = function (forceStyleReCompute) {
            if (forceStyleReCompute) {
                this.computeStyle();
                this.editor.getLayout().computeStyle();
                this.sidebar.getLayout().computeStyle();
            }
            if (!this.computedStyles) {
                this.computeStyle();
            }
            this.workbenchSize = this.getWorkbenchArea();
            var isSidebarHidden = this.partService.isSideBarHidden();
            var sidebarPosition = this.partService.getSideBarPosition();
            // Sidebar
            var sidebarWidth;
            if (isSidebarHidden) {
                sidebarWidth = 0;
            }
            else if (this.sidebarWidth !== -1) {
                sidebarWidth = Math.max(this.computedStyles.sidebar.minWidth, this.sidebarWidth);
            }
            else {
                sidebarWidth = this.workbenchSize.width / 5;
                this.sidebarWidth = sidebarWidth;
            }
            var sidebarSize = new builder_1.Dimension(sidebarWidth, this.workbenchSize.height - this.computedStyles.statusbar.height);
            // Activity Bar
            var activityBarMinWidth = this.computedStyles.activitybar.minWidth;
            var activityBarSize = new builder_1.Dimension(activityBarMinWidth, sidebarSize.height);
            // Editor
            var editorSize = {
                width: 0,
                height: 0,
                remainderLeft: 0,
                remainderRight: 0
            };
            var editorDimension = new builder_1.Dimension(this.workbenchSize.width - sidebarSize.width - activityBarSize.width, sidebarSize.height);
            editorSize.width = editorDimension.width;
            editorSize.height = this.editorHeight = editorDimension.height;
            // Sidebar hidden
            if (isSidebarHidden) {
                editorSize.width = Math.min(this.workbenchSize.width - activityBarSize.width, this.workbenchSize.width - activityBarMinWidth);
                if (sidebarPosition === partService_1.Position.LEFT) {
                    editorSize.remainderLeft = Math.round((this.workbenchSize.width - editorSize.width + activityBarSize.width) / 2);
                    editorSize.remainderRight = this.workbenchSize.width - editorSize.width - editorSize.remainderLeft;
                }
                else {
                    editorSize.remainderRight = Math.round((this.workbenchSize.width - editorSize.width + activityBarSize.width) / 2);
                    editorSize.remainderLeft = this.workbenchSize.width - editorSize.width - editorSize.remainderRight;
                }
            }
            // Assert Sidebar and Editor Size to not overflow
            var editorMinWidth = this.computedStyles.editor.minWidth;
            var visibleEditorCount = this.editorService.getVisibleEditors().length;
            if (visibleEditorCount > 1) {
                editorMinWidth *= visibleEditorCount;
            }
            if (editorSize.width < editorMinWidth) {
                var diff = editorMinWidth - editorSize.width;
                editorSize.width = editorMinWidth;
                sidebarSize.width -= diff;
                sidebarSize.width = Math.max(DEFAULT_MIN_PART_WIDTH, sidebarSize.width);
            }
            if (!isSidebarHidden) {
                this.sidebarWidth = sidebarSize.width;
                this.storageService.store(WorkbenchLayout.sashWidthSettingsKey, this.sidebarWidth, storage_1.StorageScope.GLOBAL);
            }
            // Workbench
            this.workbenchContainer
                .position(this.options.margin.top, this.options.margin.right, this.options.margin.bottom, this.options.margin.left, 'relative')
                .size(this.workbenchSize.width, this.workbenchSize.height);
            // Bug on Chrome: Sometimes Chrome wants to scroll the workbench container on layout changes. The fix is to reset scrollTop in this case.
            if (this.workbenchContainer.getHTMLElement().scrollTop > 0) {
                this.workbenchContainer.getHTMLElement().scrollTop = 0;
            }
            // Editor Part
            this.editor.getContainer().size(editorSize.width, editorSize.height);
            if (isSidebarHidden) {
                this.editor.getContainer().position(0, editorSize.remainderRight, 0, editorSize.remainderLeft);
            }
            else if (sidebarPosition === partService_1.Position.LEFT) {
                this.editor.getContainer().position(0, 0, 0, sidebarSize.width + activityBarSize.width);
            }
            else {
                this.editor.getContainer().position(0, sidebarSize.width, 0, 0);
            }
            // Activity Bar Part
            this.activitybar.getContainer().size(null, activityBarSize.height);
            if (sidebarPosition === partService_1.Position.LEFT) {
                this.activitybar.getContainer().getHTMLElement().style.right = '';
                this.activitybar.getContainer().position(0, null, 0, 0);
            }
            else {
                this.activitybar.getContainer().getHTMLElement().style.left = '';
                this.activitybar.getContainer().position(0, 0, 0, null);
            }
            // Sidebar Part
            this.sidebar.getContainer().size(sidebarSize.width, sidebarSize.height);
            if (sidebarPosition === partService_1.Position.LEFT) {
                this.sidebar.getContainer().position(0, editorSize.width, 0, activityBarSize.width);
            }
            else {
                this.sidebar.getContainer().position(0, null, 0, editorSize.width);
            }
            // Statusbar Part
            if (this.statusbar) {
                this.statusbar.getContainer().position(this.workbenchSize.height - this.computedStyles.statusbar.height);
            }
            // Quick open
            this.quickopen.layout(this.workbenchSize);
            // Sash
            this.sash.layout();
            // Propagate to Part Layouts
            this.editor.layout(new builder_1.Dimension(editorSize.width, editorSize.height));
            this.sidebar.layout(sidebarSize);
            // Propagate to Context View
            if (this.contextViewService) {
                this.contextViewService.layout();
            }
        };
        WorkbenchLayout.prototype.getWorkbenchArea = function () {
            // Client Area: Parent
            var clientArea = this.parent.getClientArea();
            // Workbench: Client Area - Margins
            return clientArea.substract(this.options.margin);
        };
        WorkbenchLayout.prototype.getVerticalSashTop = function (sash) {
            return 0;
        };
        WorkbenchLayout.prototype.getVerticalSashLeft = function (sash) {
            var isSidebarHidden = this.partService.isSideBarHidden();
            var sidebarPosition = this.partService.getSideBarPosition();
            var activitybarWidth = this.computedStyles.activitybar.minWidth;
            if (sidebarPosition === partService_1.Position.LEFT) {
                return !isSidebarHidden ? this.sidebarWidth + activitybarWidth : activitybarWidth;
            }
            return !isSidebarHidden ? this.workbenchSize.width - this.sidebarWidth - activitybarWidth : this.workbenchSize.width - activitybarWidth;
        };
        WorkbenchLayout.prototype.getVerticalSashHeight = function (sash) {
            return this.editorHeight;
        };
        WorkbenchLayout.prototype.dispose = function () {
            while (this.toUnbind.length) {
                this.toUnbind.pop()();
            }
        };
        WorkbenchLayout.sashWidthSettingsKey = 'workbench.sidebar.width';
        WorkbenchLayout = __decorate([
            __param(8, storage_1.IStorageService),
            __param(9, event_1.IEventService),
            __param(10, contextView_1.IContextViewService),
            __param(11, editorService_1.IWorkbenchEditorService),
            __param(12, contextService_1.IWorkspaceContextService),
            __param(13, partService_1.IPartService)
        ], WorkbenchLayout);
        return WorkbenchLayout;
    })();
    exports.WorkbenchLayout = WorkbenchLayout;
});
//# sourceMappingURL=layout.js.map