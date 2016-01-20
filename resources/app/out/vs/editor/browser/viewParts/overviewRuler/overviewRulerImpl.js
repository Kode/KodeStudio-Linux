/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/browser', 'vs/base/browser/dom', 'vs/editor/common/editorCommon'], function (require, exports, Browser, DomUtils, EditorCommon) {
    function zoneEquals(a, b) {
        return (a.startLineNumber === b.startLineNumber
            && a.endLineNumber === b.endLineNumber
            && a.forceHeight === b.forceHeight
            && a.color === b.color
            && a.position === b.position);
    }
    function zonesEqual(a, b) {
        if (a === b) {
            return true;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (var i = 0, len = a.length; i < len; i++) {
            if (!zoneEquals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    var OverviewRulerImpl = (function () {
        function OverviewRulerImpl(canvasLeftOffset, cssClassName, scrollHeight, lineHeight, minimumHeight, maximumHeight, getVerticalOffsetForLine) {
            this._canvasLeftOffset = canvasLeftOffset;
            this._minimumHeight = minimumHeight;
            this._maximumHeight = maximumHeight;
            this._getVerticalOffsetForLine = getVerticalOffsetForLine;
            this._zones = [];
            this._renderedZones = [];
            this._useDarkColor = false;
            this._domNode = document.createElement('canvas');
            this._domNode.className = cssClassName;
            this._domNode.style.position = 'absolute';
            if (Browser.canUseTranslate3d) {
                this._domNode.style.transform = 'translate3d(0px, 0px, 0px)';
            }
            this._width = 0;
            this._height = 0;
            this._outerHeight = scrollHeight;
            this._lineHeight = lineHeight;
            this._lanesCount = 3;
        }
        OverviewRulerImpl.prototype.dispose = function () {
            this._zones = [];
        };
        OverviewRulerImpl.prototype.setLayout = function (position, render) {
            DomUtils.StyleMutator.setTop(this._domNode, position.top);
            DomUtils.StyleMutator.setRight(this._domNode, position.right);
            if (this._width !== position.width || this._height !== position.height) {
                this._width = position.width;
                this._height = position.height;
                this._domNode.width = this._width;
                this._domNode.height = this._height;
                if (render) {
                    this.render(true);
                }
            }
        };
        OverviewRulerImpl.prototype.getLanesCount = function () {
            return this._lanesCount;
        };
        OverviewRulerImpl.prototype.setLanesCount = function (newLanesCount, render) {
            this._lanesCount = newLanesCount;
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.setUseDarkColor = function (useDarkColor, render) {
            this._useDarkColor = useDarkColor;
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.getDomNode = function () {
            return this._domNode;
        };
        OverviewRulerImpl.prototype.getWidth = function () {
            return this._width;
        };
        OverviewRulerImpl.prototype.getHeight = function () {
            return this._height;
        };
        OverviewRulerImpl.prototype.setScrollHeight = function (scrollHeight, render) {
            this._outerHeight = scrollHeight;
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.setLineHeight = function (lineHeight, render) {
            this._lineHeight = lineHeight;
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.setZones = function (zones, render) {
            this._zones = zones;
            if (render) {
                this.render(false);
            }
        };
        OverviewRulerImpl.prototype._insertZone = function (colorsZones, y1, y2, minimumHeight, maximumHeight, color) {
            var ycenter = Math.floor((y1 + y2) / 2);
            var halfHeight = (y2 - ycenter);
            if (halfHeight > maximumHeight / 2) {
                halfHeight = maximumHeight / 2;
            }
            if (halfHeight < minimumHeight / 2) {
                halfHeight = minimumHeight / 2;
            }
            if (ycenter - halfHeight < 0) {
                ycenter = halfHeight;
            }
            if (ycenter + halfHeight > this._height) {
                ycenter = this._height - halfHeight;
            }
            colorsZones[color] = colorsZones[color] || [];
            colorsZones[color].push({
                from: ycenter - halfHeight,
                to: ycenter + halfHeight
            });
        };
        OverviewRulerImpl.prototype._getColorForZone = function (zone) {
            if (this._useDarkColor) {
                return zone.darkColor;
            }
            return zone.color;
        };
        OverviewRulerImpl.prototype._renderVerticalPatch = function (ctx, heightRatio, laneMask, xpos, width) {
            var colorsZones = {};
            var i, len, zone, y1, y2, zoneLineNumbers, zoneMaximumHeight;
            for (i = 0, len = this._zones.length; i < len; i++) {
                zone = this._zones[i];
                if (!(zone.position & laneMask)) {
                    continue;
                }
                y1 = this._getVerticalOffsetForLine(zone.startLineNumber);
                y2 = this._getVerticalOffsetForLine(zone.endLineNumber) + this._lineHeight;
                y1 *= heightRatio;
                y2 *= heightRatio;
                if (zone.forceHeight) {
                    y2 = y1 + zone.forceHeight;
                    this._insertZone(colorsZones, y1, y2, zone.forceHeight, zone.forceHeight, this._getColorForZone(zone));
                }
                else {
                    // Figure out if we can render this in one continuous zone
                    zoneLineNumbers = zone.endLineNumber - zone.startLineNumber + 1;
                    zoneMaximumHeight = zoneLineNumbers * this._maximumHeight;
                    if (y2 - y1 > zoneMaximumHeight) {
                        // We need to draw one zone per line
                        for (var lineNumber = zone.startLineNumber; lineNumber <= zone.endLineNumber; lineNumber++) {
                            y1 = this._getVerticalOffsetForLine(lineNumber);
                            y2 = y1 + this._lineHeight;
                            y1 *= heightRatio;
                            y2 *= heightRatio;
                            this._insertZone(colorsZones, y1, y2, this._minimumHeight, this._maximumHeight, this._getColorForZone(zone));
                        }
                    }
                    else {
                        this._insertZone(colorsZones, y1, y2, this._minimumHeight, zoneMaximumHeight, this._getColorForZone(zone));
                    }
                }
            }
            var sorter = function (a, b) {
                return a.from - b.from;
            };
            // Merge color zones
            var colorName, colorZones, currentFrom, currentTo;
            for (colorName in colorsZones) {
                if (colorsZones.hasOwnProperty(colorName)) {
                    colorZones = colorsZones[colorName];
                    // Merge & Render zones
                    colorZones.sort(sorter);
                    currentFrom = colorZones[0].from;
                    currentTo = colorZones[0].to;
                    ctx.fillStyle = colorName;
                    for (i = 1, len = colorZones.length; i < len; i++) {
                        if (currentTo >= colorZones[i].from) {
                            currentTo = Math.max(currentTo, colorZones[i].to);
                        }
                        else {
                            ctx.fillRect(xpos, currentFrom, width, currentTo - currentFrom);
                            currentFrom = colorZones[i].from;
                            currentTo = colorZones[i].to;
                        }
                    }
                    ctx.fillRect(xpos, currentFrom, width, currentTo - currentFrom);
                }
            }
        };
        OverviewRulerImpl.prototype.render = function (forceRender) {
            if (this._outerHeight === 0) {
                return false;
            }
            if (!OverviewRulerImpl.hasCanvas) {
                return false;
            }
            var shouldRender = forceRender || !zonesEqual(this._renderedZones, this._zones);
            if (shouldRender) {
                var heightRatio = this._height / this._outerHeight;
                var ctx = this._domNode.getContext('2d');
                ctx.clearRect(0, 0, this._width, this._height);
                var remainingWidth = this._width - this._canvasLeftOffset;
                if (this._lanesCount >= 3) {
                    this._renderThreeLanes(ctx, heightRatio, remainingWidth);
                }
                else if (this._lanesCount === 2) {
                    this._renderTwoLanes(ctx, heightRatio, remainingWidth);
                }
                else if (this._lanesCount === 1) {
                    this._renderOneLane(ctx, heightRatio, remainingWidth);
                }
            }
            this._renderedZones = this._zones;
            return shouldRender;
        };
        OverviewRulerImpl.prototype._renderOneLane = function (ctx, heightRatio, w) {
            this._renderVerticalPatch(ctx, heightRatio, EditorCommon.OverviewRulerLane.Left | EditorCommon.OverviewRulerLane.Center | EditorCommon.OverviewRulerLane.Right, this._canvasLeftOffset, w);
        };
        OverviewRulerImpl.prototype._renderTwoLanes = function (ctx, heightRatio, w) {
            var leftWidth = Math.floor(w / 2), rightWidth = w - leftWidth, leftOffset = this._canvasLeftOffset, rightOffset = this._canvasLeftOffset + leftWidth;
            this._renderVerticalPatch(ctx, heightRatio, EditorCommon.OverviewRulerLane.Left | EditorCommon.OverviewRulerLane.Center, leftOffset, leftWidth);
            this._renderVerticalPatch(ctx, heightRatio, EditorCommon.OverviewRulerLane.Right, rightOffset, rightWidth);
        };
        OverviewRulerImpl.prototype._renderThreeLanes = function (ctx, heightRatio, w) {
            var leftWidth = Math.floor(w / 3), rightWidth = Math.floor(w / 3), centerWidth = w - leftWidth - rightWidth, leftOffset = this._canvasLeftOffset, centerOffset = this._canvasLeftOffset + leftWidth, rightOffset = this._canvasLeftOffset + leftWidth + centerWidth;
            this._renderVerticalPatch(ctx, heightRatio, EditorCommon.OverviewRulerLane.Left, leftOffset, leftWidth);
            this._renderVerticalPatch(ctx, heightRatio, EditorCommon.OverviewRulerLane.Center, centerOffset, centerWidth);
            this._renderVerticalPatch(ctx, heightRatio, EditorCommon.OverviewRulerLane.Right, rightOffset, rightWidth);
        };
        OverviewRulerImpl.hasCanvas = (window.navigator.userAgent.indexOf('MSIE 8') === -1);
        return OverviewRulerImpl;
    })();
    exports.OverviewRulerImpl = OverviewRulerImpl;
});
//# sourceMappingURL=overviewRulerImpl.js.map