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
define(["require", "exports", 'vs/base/browser/browser', 'vs/base/browser/dom', 'vs/editor/browser/view/viewLayer', 'vs/editor/browser/editorBrowser'], function (require, exports, Browser, DomUtils, viewLayer_1, EditorBrowser) {
    var ViewOverlays = (function (_super) {
        __extends(ViewOverlays, _super);
        function ViewOverlays(context, layoutProvider) {
            _super.call(this, context);
            this._layoutProvider = layoutProvider;
            this._dynamicOverlays = [];
            this.domNode.className = 'view-overlays';
        }
        ViewOverlays.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._layoutProvider = null;
            for (var i = 0; i < this._dynamicOverlays.length; i++) {
                this._dynamicOverlays[i].dispose();
            }
            this._dynamicOverlays = null;
        };
        ViewOverlays.prototype.getDomNode = function () {
            return this.domNode;
        };
        ViewOverlays.prototype.addDynamicOverlay = function (overlay) {
            this._dynamicOverlays.push(overlay);
        };
        // ----- event handlers
        ViewOverlays.prototype.onViewFocusChanged = function (isFocused) {
            var _this = this;
            this._requestModificationFrame(function () {
                DomUtils.toggleClass(_this.domNode, 'focused', isFocused);
            });
            return false;
        };
        // ----- end event handlers
        ViewOverlays.prototype._createLine = function () {
            var r = new ViewOverlayLine(this._context, this._dynamicOverlays);
            return r;
        };
        ViewOverlays.prototype.onReadAfterForcedLayout = function (ctx) {
            var _this = this;
            // Overwriting to bypass `shouldRender` flag
            for (var i = 0; i < this._dynamicOverlays.length; i++) {
                this._dynamicOverlays[i].shouldCallRender2(ctx);
            }
            this._requestModificationFrame(function () {
                _this._viewOverlaysRender(ctx);
            });
            return null;
        };
        ViewOverlays.prototype._viewOverlaysRender = function (ctx) {
            _super.prototype._renderLines.call(this, ctx.linesViewportData);
        };
        ViewOverlays.prototype.onWriteAfterForcedLayout = function () {
            // Overwriting to bypass `shouldRender` flag
            this._executeModificationRunners();
        };
        return ViewOverlays;
    })(viewLayer_1.ViewLayer);
    exports.ViewOverlays = ViewOverlays;
    var ViewOverlayLine = (function () {
        function ViewOverlayLine(context, dynamicOverlays) {
            this._context = context;
            this._dynamicOverlays = dynamicOverlays;
            this._domNode = null;
            this._renderPieces = null;
        }
        ViewOverlayLine.prototype.getDomNode = function () {
            return this._domNode;
        };
        ViewOverlayLine.prototype.setDomNode = function (domNode) {
            this._domNode = domNode;
        };
        ViewOverlayLine.prototype.onContentChanged = function () {
            // Nothing
        };
        ViewOverlayLine.prototype.onLinesInsertedAbove = function () {
            // Nothing
        };
        ViewOverlayLine.prototype.onLinesDeletedAbove = function () {
            // Nothing
        };
        ViewOverlayLine.prototype.onLineChangedAbove = function () {
            // Nothing
        };
        ViewOverlayLine.prototype.onTokensChanged = function () {
            // Nothing
        };
        ViewOverlayLine.prototype.onConfigurationChanged = function (e) {
            // Nothing
        };
        ViewOverlayLine.prototype._piecesEqual = function (newPieces) {
            if (!this._renderPieces || this._renderPieces.length !== newPieces.length) {
                return false;
            }
            for (var i = 0, len = newPieces.length; i < len; i++) {
                if (this._renderPieces[i] !== newPieces[i]) {
                    return false;
                }
            }
            return true;
        };
        ViewOverlayLine.prototype.shouldUpdateHTML = function (lineNumber, inlineDecorations) {
            var newPieces = [];
            for (var i = 0; i < this._dynamicOverlays.length; i++) {
                var pieces = this._dynamicOverlays[i].render2(lineNumber);
                if (pieces && pieces.length > 0) {
                    newPieces = newPieces.concat(pieces);
                }
            }
            var piecesEqual = this._piecesEqual(newPieces);
            if (!piecesEqual) {
                this._renderPieces = newPieces;
            }
            return !piecesEqual;
        };
        ViewOverlayLine.prototype.getLineOuterHTML = function (out, lineNumber, deltaTop) {
            out.push('<div lineNumber="');
            out.push(lineNumber.toString());
            out.push('" style="top:');
            out.push(deltaTop.toString());
            out.push('px;height:');
            out.push(this._context.configuration.editor.lineHeight.toString());
            out.push('px;" class="');
            out.push(EditorBrowser.ClassNames.VIEW_LINE);
            out.push('">');
            out.push(this.getLineInnerHTML(lineNumber));
            out.push('</div>');
        };
        ViewOverlayLine.prototype.getLineInnerHTML = function (lineNumber) {
            return this._renderPieces.join('');
        };
        ViewOverlayLine.prototype.layoutLine = function (lineNumber, deltaTop) {
            var currentLineNumber = this._domNode.getAttribute('lineNumber');
            if (currentLineNumber !== lineNumber.toString()) {
                this._domNode.setAttribute('lineNumber', lineNumber.toString());
            }
            DomUtils.StyleMutator.setTop(this._domNode, deltaTop);
            DomUtils.StyleMutator.setHeight(this._domNode, this._context.configuration.editor.lineHeight);
        };
        return ViewOverlayLine;
    })();
    var ContentViewOverlays = (function (_super) {
        __extends(ContentViewOverlays, _super);
        function ContentViewOverlays(context, layoutProvider) {
            _super.call(this, context, layoutProvider);
            DomUtils.StyleMutator.setWidth(this.domNode, 0);
            DomUtils.StyleMutator.setHeight(this.domNode, 0);
        }
        ContentViewOverlays.prototype.onScrollWidthChanged = function (scrollWidth) {
            return true;
        };
        ContentViewOverlays.prototype._viewOverlaysRender = function (ctx) {
            _super.prototype._viewOverlaysRender.call(this, ctx);
            DomUtils.StyleMutator.setWidth(this.domNode, this._layoutProvider.getScrollWidth());
        };
        return ContentViewOverlays;
    })(ViewOverlays);
    exports.ContentViewOverlays = ContentViewOverlays;
    var MarginViewOverlays = (function (_super) {
        __extends(MarginViewOverlays, _super);
        function MarginViewOverlays(context, layoutProvider) {
            _super.call(this, context, layoutProvider);
            this._hasVerticalScroll = false;
            this._glyphMarginLeft = 0;
            this._glyphMarginWidth = 0;
            this._scrollHeight = layoutProvider.getScrollHeight();
            this.domNode.className = EditorBrowser.ClassNames.MARGIN_VIEW_OVERLAYS + ' monaco-editor-background';
            DomUtils.StyleMutator.setWidth(this.domNode, 1);
            this._hasVerticalScroll = true;
        }
        MarginViewOverlays.prototype._extraDomNodeHTML = function () {
            return [
                '<div class="',
                EditorBrowser.ClassNames.GLYPH_MARGIN,
                '" style="left:',
                String(this._glyphMarginLeft),
                'px;width:',
                String(this._glyphMarginWidth),
                'px;height:',
                String(this._scrollHeight),
                'px;"></div>'
            ].join('');
        };
        MarginViewOverlays.prototype._getGlyphMarginDomNode = function () {
            return this.domNode.children[0];
        };
        MarginViewOverlays.prototype.onScrollHeightChanged = function (scrollHeight) {
            var _this = this;
            this._scrollHeight = scrollHeight;
            this._requestModificationFrame(function () {
                var glyphMargin = _this._getGlyphMarginDomNode();
                if (glyphMargin) {
                    DomUtils.StyleMutator.setHeight(glyphMargin, _this._scrollHeight);
                }
            });
            return _super.prototype.onScrollHeightChanged.call(this, scrollHeight) || true;
        };
        MarginViewOverlays.prototype.onLayoutChanged = function (layoutInfo) {
            var _this = this;
            this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
            this._glyphMarginWidth = layoutInfo.glyphMarginWidth;
            this._scrollHeight = this._layoutProvider.getScrollHeight();
            this._requestModificationFrame(function () {
                DomUtils.StyleMutator.setWidth(_this.domNode, layoutInfo.contentLeft);
                var glyphMargin = _this._getGlyphMarginDomNode();
                if (glyphMargin) {
                    DomUtils.StyleMutator.setLeft(glyphMargin, layoutInfo.glyphMarginLeft);
                    DomUtils.StyleMutator.setWidth(glyphMargin, layoutInfo.glyphMarginWidth);
                }
            });
            return _super.prototype.onLayoutChanged.call(this, layoutInfo) || true;
        };
        MarginViewOverlays.prototype.onScrollChanged = function (e) {
            this._hasVerticalScroll = this._hasVerticalScroll || e.vertical;
            return _super.prototype.onScrollChanged.call(this, e);
        };
        MarginViewOverlays.prototype._viewOverlaysRender = function (ctx) {
            _super.prototype._viewOverlaysRender.call(this, ctx);
            if (this._hasVerticalScroll) {
                if (Browser.canUseTranslate3d) {
                    var transform = 'translate3d(0px, ' + ctx.linesViewportData.visibleRangesDeltaTop + 'px, 0px)';
                    DomUtils.StyleMutator.setTransform(this.domNode, transform);
                }
                else {
                    if (this._hasVerticalScroll) {
                        DomUtils.StyleMutator.setTop(this.domNode, ctx.linesViewportData.visibleRangesDeltaTop);
                    }
                }
                this._hasVerticalScroll = false;
            }
            var height = Math.min(this._layoutProvider.getTotalHeight(), 1000000);
            DomUtils.StyleMutator.setHeight(this.domNode, height);
        };
        return MarginViewOverlays;
    })(ViewOverlays);
    exports.MarginViewOverlays = MarginViewOverlays;
});
//# sourceMappingURL=viewOverlays.js.map