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
define(["require", "exports", 'vs/base/common/errors', 'vs/base/browser/dom', 'vs/editor/browser/view/viewPart', 'vs/editor/browser/editorBrowser'], function (require, exports, errors, DomUtils, viewPart_1, EditorBrowser) {
    var ViewZones = (function (_super) {
        __extends(ViewZones, _super);
        function ViewZones(context, whitespaceManager) {
            _super.call(this, context);
            this._whitespaceManager = whitespaceManager;
            this.domNode = document.createElement('div');
            this.domNode.className = EditorBrowser.ClassNames.VIEW_ZONES;
            this.domNode.style.position = 'absolute';
            this.domNode.setAttribute('role', 'presentation');
            this.domNode.setAttribute('aria-hidden', 'true');
            this._zones = {};
        }
        ViewZones.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._whitespaceManager = null;
            this._zones = {};
        };
        // ---- begin view event handlers
        ViewZones.prototype.onConfigurationChanged = function (e) {
            var _this = this;
            if (e.lineHeight) {
                var id, zone, newComputedHeight, zone2Height = {};
                for (id in this._zones) {
                    if (this._zones.hasOwnProperty(id)) {
                        zone = this._zones[id];
                        newComputedHeight = this._heightInPixels(zone.delegate);
                        this._safeCallOnComputedHeight(zone.delegate, newComputedHeight);
                        zone2Height[id] = newComputedHeight;
                        this._whitespaceManager.changeWhitespace(parseInt(id, 10), newComputedHeight);
                    }
                }
                this._requestModificationFrame(function () {
                    for (id in _this._zones) {
                        if (_this._zones.hasOwnProperty(id)) {
                            if (zone2Height.hasOwnProperty(id)) {
                                // TODO@Alex - edit dom node properties only in render()
                                DomUtils.StyleMutator.setHeight(_this._zones[id].delegate.domNode, zone2Height[id]);
                            }
                        }
                    }
                });
                return true;
            }
            return false;
        };
        ViewZones.prototype.onLineMappingChanged = function () {
            var hadAChange = false, zone, id;
            for (id in this._zones) {
                if (this._zones.hasOwnProperty(id)) {
                    zone = this._zones[id];
                    var newAfterLineNumber = this._computeWhitespaceAfterLineNumber(zone.delegate);
                    hadAChange = this._whitespaceManager.changeAfterLineNumberForWhitespace(parseInt(id, 10), newAfterLineNumber) || hadAChange;
                }
            }
            return hadAChange;
        };
        ViewZones.prototype.onLayoutChanged = function (layoutInfo) {
            return true;
        };
        ViewZones.prototype.onScrollChanged = function (e) {
            return e.vertical;
        };
        ViewZones.prototype.onScrollWidthChanged = function (newScrollWidth) {
            return true;
        };
        ViewZones.prototype.onZonesChanged = function () {
            return true;
        };
        ViewZones.prototype.onModelLinesDeleted = function (e) {
            return true;
        };
        ViewZones.prototype.onModelLinesInserted = function (e) {
            return true;
        };
        // ---- end view event handlers
        ViewZones.prototype._getZoneOrdinal = function (zone) {
            if (typeof zone.afterColumn !== 'undefined') {
                return zone.afterColumn;
            }
            return 10000;
        };
        ViewZones.prototype._computeWhitespaceAfterLineNumber = function (zone) {
            if (zone.afterLineNumber === 0) {
                return 0;
            }
            var zoneAfterModelPosition;
            if (typeof zone.afterColumn !== 'undefined') {
                zoneAfterModelPosition = this._context.model.validateModelPosition({
                    lineNumber: zone.afterLineNumber,
                    column: zone.afterColumn
                });
            }
            else {
                var validAfterLineNumber = this._context.model.validateModelPosition({
                    lineNumber: zone.afterLineNumber,
                    column: 1
                }).lineNumber;
                zoneAfterModelPosition = {
                    lineNumber: validAfterLineNumber,
                    column: this._context.model.getModelLineMaxColumn(validAfterLineNumber)
                };
            }
            var viewPosition = this._context.model.convertModelPositionToViewPosition(zoneAfterModelPosition.lineNumber, zoneAfterModelPosition.column);
            return viewPosition.lineNumber;
        };
        ViewZones.prototype.addZone = function (zone) {
            var computedHeight = this._heightInPixels(zone);
            var whitespaceId = this._whitespaceManager.addWhitespace(this._computeWhitespaceAfterLineNumber(zone), this._getZoneOrdinal(zone), computedHeight);
            var myZone = {
                whitespaceId: whitespaceId,
                delegate: zone,
                isVisible: false
            };
            this._safeCallOnComputedHeight(myZone.delegate, computedHeight);
            this._requestModificationFrame(function () {
                if (!myZone.delegate.domNode.hasAttribute('monaco-view-zone')) {
                    // Do not position zone if it was removed in the meantime
                    return;
                }
                myZone.delegate.domNode.style.position = 'absolute';
                DomUtils.StyleMutator.setHeight(myZone.delegate.domNode, computedHeight);
                myZone.delegate.domNode.style.width = '100%';
                DomUtils.StyleMutator.setDisplay(myZone.delegate.domNode, 'none');
            });
            this._zones[myZone.whitespaceId.toString()] = myZone;
            myZone.delegate.domNode.setAttribute('monaco-view-zone', myZone.whitespaceId.toString());
            this.domNode.appendChild(myZone.delegate.domNode);
            return myZone.whitespaceId;
        };
        ViewZones.prototype.removeZone = function (id) {
            if (this._zones.hasOwnProperty(id.toString())) {
                var zone = this._zones[id.toString()];
                delete this._zones[id.toString()];
                this._whitespaceManager.removeWhitespace(zone.whitespaceId);
                zone.delegate.domNode.removeAttribute('monaco-visible-view-zone');
                zone.delegate.domNode.removeAttribute('monaco-view-zone');
                this._requestModificationFrame(function () {
                    if (zone.delegate.domNode.hasAttribute('monaco-view-zone')) {
                        // This dom node was added again as a view zone, so no need to mutate the DOM here
                        return;
                    }
                    if (zone.delegate.domNode.parentNode) {
                        zone.delegate.domNode.parentNode.removeChild(zone.delegate.domNode);
                    }
                });
                return true;
            }
            return false;
        };
        ViewZones.prototype.layoutZone = function (id) {
            var changed = false;
            if (this._zones.hasOwnProperty(id.toString())) {
                var zone = this._zones[id.toString()];
                var newComputedHeight = this._heightInPixels(zone.delegate);
                var newAfterLineNumber = this._computeWhitespaceAfterLineNumber(zone.delegate);
                var newOrdinal = this._getZoneOrdinal(zone.delegate);
                changed = this._whitespaceManager.changeWhitespace(zone.whitespaceId, newComputedHeight) || changed;
                changed = this._whitespaceManager.changeAfterLineNumberForWhitespace(zone.whitespaceId, newAfterLineNumber) || changed;
            }
            return changed;
        };
        ViewZones.prototype.shouldSuppressMouseDownOnViewZone = function (id) {
            if (this._zones.hasOwnProperty(id.toString())) {
                var zone = this._zones[id.toString()];
                return zone.delegate.suppressMouseDown;
            }
            return false;
        };
        ViewZones.prototype._heightInPixels = function (zone) {
            if (typeof zone.heightInPx === 'number') {
                return zone.heightInPx;
            }
            if (typeof zone.heightInLines === 'number') {
                return this._context.configuration.editor.lineHeight * zone.heightInLines;
            }
            return this._context.configuration.editor.lineHeight;
        };
        ViewZones.prototype._safeCallOnComputedHeight = function (zone, height) {
            if (typeof zone.onComputedHeight === 'function') {
                try {
                    zone.onComputedHeight(height);
                }
                catch (e) {
                    errors.onUnexpectedError(e);
                }
            }
        };
        ViewZones.prototype._safeCallOnDomNodeTop = function (zone, top) {
            if (typeof zone.onDomNodeTop === 'function') {
                try {
                    zone.onDomNodeTop(top);
                }
                catch (e) {
                    errors.onUnexpectedError(e);
                }
            }
        };
        ViewZones.prototype._render = function (ctx) {
            var _this = this;
            var visibleWhitespaces = this._whitespaceManager.getWhitespaceViewportData();
            this._requestModificationFrame(function () {
                var visibleZones = {}, i, len, hasVisibleZone = false;
                for (i = 0, len = visibleWhitespaces.length; i < len; i++) {
                    visibleZones[visibleWhitespaces[i].id.toString()] = visibleWhitespaces[i];
                    hasVisibleZone = true;
                }
                var id, zone;
                for (id in _this._zones) {
                    if (_this._zones.hasOwnProperty(id)) {
                        zone = _this._zones[id];
                        if (visibleZones.hasOwnProperty(id)) {
                            // zone is visible
                            DomUtils.StyleMutator.setTop(zone.delegate.domNode, (visibleZones[id].verticalOffset - ctx.bigNumbersDelta));
                            DomUtils.StyleMutator.setHeight(zone.delegate.domNode, visibleZones[id].height);
                            if (!zone.isVisible) {
                                DomUtils.StyleMutator.setDisplay(zone.delegate.domNode, 'block');
                                zone.delegate.domNode.setAttribute('monaco-visible-view-zone', 'true');
                                zone.isVisible = true;
                            }
                            _this._safeCallOnDomNodeTop(zone.delegate, ctx.getScrolledTopFromAbsoluteTop(visibleZones[id].verticalOffset));
                        }
                        else {
                            if (zone.isVisible) {
                                DomUtils.StyleMutator.setDisplay(zone.delegate.domNode, 'none');
                                zone.delegate.domNode.removeAttribute('monaco-visible-view-zone');
                                zone.isVisible = false;
                            }
                            _this._safeCallOnDomNodeTop(zone.delegate, ctx.getScrolledTopFromAbsoluteTop(-1000000));
                        }
                    }
                }
                if (hasVisibleZone) {
                    DomUtils.StyleMutator.setWidth(_this.domNode, ctx.scrollWidth);
                }
            });
        };
        return ViewZones;
    })(viewPart_1.ViewPart);
    exports.ViewZones = ViewZones;
});
//# sourceMappingURL=viewZones.js.map