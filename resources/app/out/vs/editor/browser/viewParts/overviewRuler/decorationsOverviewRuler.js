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
define(["require", "exports", 'vs/editor/browser/viewParts/overviewRuler/overviewRulerImpl', 'vs/editor/browser/view/viewPart', 'vs/editor/common/editorCommon', 'vs/platform/theme/common/themes'], function (require, exports, overviewRulerImpl_1, viewPart_1, EditorCommon, Themes) {
    var DecorationsOverviewRuler = (function (_super) {
        __extends(DecorationsOverviewRuler, _super);
        function DecorationsOverviewRuler(context, scrollHeight, getVerticalOffsetForLine) {
            _super.call(this, context);
            this._overviewRuler = new overviewRulerImpl_1.OverviewRulerImpl(1, 'decorationsOverviewRuler', scrollHeight, this._context.configuration.editor.lineHeight, DecorationsOverviewRuler.DECORATION_HEIGHT, DecorationsOverviewRuler.DECORATION_HEIGHT, getVerticalOffsetForLine);
            this._overviewRuler.setLanesCount(this._context.configuration.editor.overviewRulerLanes, false);
            var theme = this._context.configuration.editor.theme;
            this._overviewRuler.setUseDarkColor(!Themes.isLightTheme(theme), false);
            this._shouldUpdateDecorations = true;
            this._zonesFromDecorations = [];
            this._shouldUpdateCursorPosition = true;
            this._hideCursor = this._context.configuration.editor.hideCursorInOverviewRuler;
            this._shouldForceRender = false;
            this._zonesFromCursors = [];
            this._cursorPositions = [];
        }
        DecorationsOverviewRuler.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._overviewRuler.dispose();
        };
        // ---- begin view event handlers
        DecorationsOverviewRuler.prototype.onCursorPositionChanged = function (e) {
            this._shouldUpdateCursorPosition = true;
            this._cursorPositions = [e.position];
            this._cursorPositions = this._cursorPositions.concat(e.secondaryPositions);
            return true;
        };
        DecorationsOverviewRuler.prototype.onConfigurationChanged = function (e) {
            var prevLanesCount = this._overviewRuler.getLanesCount();
            var newLanesCount = this._context.configuration.editor.overviewRulerLanes;
            var shouldRender = false;
            if (e.lineHeight) {
                this._overviewRuler.setLineHeight(this._context.configuration.editor.lineHeight, false);
                this._shouldForceRender = true;
                shouldRender = true;
            }
            if (prevLanesCount !== newLanesCount) {
                this._overviewRuler.setLanesCount(newLanesCount, false);
                this._shouldForceRender = true;
                shouldRender = true;
            }
            if (e.hideCursorInOverviewRuler) {
                this._hideCursor = this._context.configuration.editor.hideCursorInOverviewRuler;
                this._shouldUpdateCursorPosition = true;
                shouldRender = true;
            }
            if (e.theme) {
                var theme = this._context.configuration.editor.theme;
                this._overviewRuler.setUseDarkColor(!Themes.isLightTheme(theme), false);
                this._shouldForceRender = true;
                shouldRender = true;
            }
            return shouldRender;
        };
        DecorationsOverviewRuler.prototype.onLayoutChanged = function (layoutInfo) {
            var _this = this;
            this._shouldForceRender = true;
            this._requestModificationFrame(function () {
                _this._overviewRuler.setLayout(layoutInfo.overviewRuler, false);
            });
            return true;
        };
        DecorationsOverviewRuler.prototype.onZonesChanged = function () {
            return true;
        };
        DecorationsOverviewRuler.prototype.onModelFlushed = function () {
            this._shouldUpdateCursorPosition = true;
            this._shouldUpdateDecorations = true;
            return true;
        };
        DecorationsOverviewRuler.prototype.onModelDecorationsChanged = function (e) {
            this._shouldUpdateDecorations = true;
            return true;
        };
        DecorationsOverviewRuler.prototype.onScrollHeightChanged = function (scrollHeight) {
            this._overviewRuler.setScrollHeight(scrollHeight, false);
            this._shouldForceRender = true;
            return true;
        };
        // ---- end view event handlers
        DecorationsOverviewRuler.prototype.getDomNode = function () {
            return this._overviewRuler.getDomNode();
        };
        DecorationsOverviewRuler.prototype._createZonesFromDecorations = function () {
            var decorations = this._context.model.getAllDecorations(), zones = [], i, len, dec;
            for (i = 0, len = decorations.length; i < len; i++) {
                dec = decorations[i];
                if (dec.options.overviewRuler.color) {
                    zones.push({
                        startLineNumber: dec.range.startLineNumber,
                        endLineNumber: dec.range.endLineNumber,
                        color: dec.options.overviewRuler.color,
                        darkColor: dec.options.overviewRuler.darkColor,
                        position: dec.options.overviewRuler.position
                    });
                }
            }
            return zones;
        };
        DecorationsOverviewRuler.prototype._createZonesFromCursors = function () {
            var zones = [], i, len, cursor;
            for (i = 0, len = this._cursorPositions.length; i < len; i++) {
                cursor = this._cursorPositions[i];
                zones.push({
                    forceHeight: 2,
                    startLineNumber: cursor.lineNumber,
                    endLineNumber: cursor.lineNumber,
                    color: DecorationsOverviewRuler._CURSOR_COLOR,
                    darkColor: DecorationsOverviewRuler._CURSOR_COLOR_DARK,
                    position: EditorCommon.OverviewRulerLane.Full
                });
            }
            return zones;
        };
        DecorationsOverviewRuler.prototype._render = function (ctx) {
            var _this = this;
            var shouldForceRender = this._shouldForceRender;
            this._shouldForceRender = false;
            // Update decorations if necessary
            var shouldRender = false;
            if (this._shouldUpdateDecorations || this._shouldUpdateCursorPosition) {
                if (this._shouldUpdateDecorations) {
                    this._shouldUpdateDecorations = false;
                    this._zonesFromDecorations = this._createZonesFromDecorations();
                }
                if (this._shouldUpdateCursorPosition) {
                    this._shouldUpdateCursorPosition = false;
                    if (this._hideCursor) {
                        this._zonesFromCursors = [];
                    }
                    else {
                        this._zonesFromCursors = this._createZonesFromCursors();
                    }
                }
                var allZones = [];
                allZones = allZones.concat(this._zonesFromCursors);
                allZones = allZones.concat(this._zonesFromDecorations);
                this._overviewRuler.setZones(allZones, false);
                shouldRender = true;
            }
            if (shouldRender || shouldForceRender) {
                this._requestModificationFrame(function () {
                    var hasRendered = _this._overviewRuler.render(shouldForceRender);
                    if (hasRendered && overviewRulerImpl_1.OverviewRulerImpl.hasCanvas && _this._overviewRuler.getLanesCount() > 0 && (_this._zonesFromDecorations.length > 0 || _this._zonesFromCursors.length > 0)) {
                        var ctx2 = _this._overviewRuler.getDomNode().getContext('2d');
                        ctx2.beginPath();
                        ctx2.lineWidth = 1;
                        ctx2.strokeStyle = 'rgba(197,197,197,0.8)';
                        ctx2.rect(0, 0, _this._overviewRuler.getWidth(), _this._overviewRuler.getHeight());
                        ctx2.stroke();
                    }
                });
            }
        };
        DecorationsOverviewRuler.DECORATION_HEIGHT = 6;
        DecorationsOverviewRuler._CURSOR_COLOR = 'rgba(0, 0, 102, 0.8)';
        DecorationsOverviewRuler._CURSOR_COLOR_DARK = 'rgba(152, 152, 152, 0.8)';
        return DecorationsOverviewRuler;
    })(viewPart_1.ViewPart);
    exports.DecorationsOverviewRuler = DecorationsOverviewRuler;
});
//# sourceMappingURL=decorationsOverviewRuler.js.map