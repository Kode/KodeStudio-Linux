/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/editorCommon'], function (require, exports, EditorCommon) {
    var ViewEventHandler = (function () {
        function ViewEventHandler() {
            this.shouldRender = true;
        }
        // --- begin event handlers
        ViewEventHandler.prototype.onLineMappingChanged = function () {
            return false;
        };
        ViewEventHandler.prototype.onModelFlushed = function () {
            return false;
        };
        ViewEventHandler.prototype.onModelDecorationsChanged = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onModelLinesDeleted = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onModelLineChanged = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onModelLinesInserted = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onModelTokensChanged = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onCursorPositionChanged = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onCursorSelectionChanged = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onCursorRevealRange = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onCursorScrollRequest = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onConfigurationChanged = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onLayoutChanged = function (layoutInfo) {
            return false;
        };
        ViewEventHandler.prototype.onScrollChanged = function (e) {
            return false;
        };
        ViewEventHandler.prototype.onZonesChanged = function () {
            return false;
        };
        ViewEventHandler.prototype.onScrollWidthChanged = function (scrollWidth) {
            return false;
        };
        ViewEventHandler.prototype.onScrollHeightChanged = function (scrollHeight) {
            return false;
        };
        ViewEventHandler.prototype.onViewFocusChanged = function (isFocused) {
            return false;
        };
        // --- end event handlers
        ViewEventHandler.prototype.handleEvents = function (events) {
            var i, len, e, data;
            for (i = 0, len = events.length; i < len; i++) {
                e = events[i];
                data = e.getData();
                switch (e.getType()) {
                    case EditorCommon.ViewEventNames.LineMappingChangedEvent:
                        this.shouldRender = this.onLineMappingChanged() || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.ModelFlushedEvent:
                        this.shouldRender = this.onModelFlushed() || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.LinesDeletedEvent:
                        this.shouldRender = this.onModelLinesDeleted(data) || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.LinesInsertedEvent:
                        this.shouldRender = this.onModelLinesInserted(data) || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.LineChangedEvent:
                        this.shouldRender = this.onModelLineChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.TokensChangedEvent:
                        this.shouldRender = this.onModelTokensChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.DecorationsChangedEvent:
                        this.shouldRender = this.onModelDecorationsChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.CursorPositionChangedEvent:
                        this.shouldRender = this.onCursorPositionChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.CursorSelectionChangedEvent:
                        this.shouldRender = this.onCursorSelectionChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.RevealRangeEvent:
                        this.shouldRender = this.onCursorRevealRange(data) || this.shouldRender;
                        break;
                    case EditorCommon.ViewEventNames.ScrollRequestEvent:
                        this.shouldRender = this.onCursorScrollRequest(data) || this.shouldRender;
                        break;
                    case EditorCommon.EventType.ConfigurationChanged:
                        this.shouldRender = this.onConfigurationChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.EventType.ViewLayoutChanged:
                        this.shouldRender = this.onLayoutChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.EventType.ViewScrollChanged:
                        this.shouldRender = this.onScrollChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.EventType.ViewZonesChanged:
                        this.shouldRender = this.onZonesChanged() || this.shouldRender;
                        break;
                    case EditorCommon.EventType.ViewScrollWidthChanged:
                        this.shouldRender = this.onScrollWidthChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.EventType.ViewScrollHeightChanged:
                        this.shouldRender = this.onScrollHeightChanged(data) || this.shouldRender;
                        break;
                    case EditorCommon.EventType.ViewFocusChanged:
                        this.shouldRender = this.onViewFocusChanged(data) || this.shouldRender;
                        break;
                    default:
                        console.info('View received unknown event: ');
                        console.info(e);
                }
            }
        };
        return ViewEventHandler;
    })();
    exports.ViewEventHandler = ViewEventHandler;
});
//# sourceMappingURL=viewEventHandler.js.map