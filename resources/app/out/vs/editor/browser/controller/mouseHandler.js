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
define(["require", "exports", 'vs/base/common/platform', 'vs/base/browser/browser', 'vs/editor/common/editorCommon', 'vs/base/browser/mouseEvent', 'vs/base/browser/dom', 'vs/editor/browser/controller/mouseTarget', 'vs/editor/common/viewModel/viewEventHandler', 'vs/base/common/lifecycle', 'vs/base/browser/globalMouseMoveMonitor', 'vs/editor/common/core/position', 'vs/editor/common/core/selection'], function (require, exports, Platform, Browser, EditorCommon, Mouse, DomUtils, MouseTarget, viewEventHandler_1, Lifecycle, GlobalMouseMoveMonitor, position_1, selection_1) {
    /**
     * Merges mouse events when mouse move events are throttled
     */
    function createMouseMoveEventMerger(mouseTargetFactory) {
        return function (lastEvent, currentEvent) {
            var r = new Mouse.StandardMouseEvent(currentEvent);
            var targetIsWidget = false;
            if (mouseTargetFactory) {
                targetIsWidget = mouseTargetFactory.mouseTargetIsWidget(r);
            }
            if (!targetIsWidget) {
                r.preventDefault();
            }
            return r;
        };
    }
    var EventGateKeeper = (function () {
        function EventGateKeeper(destination, condition) {
            var _this = this;
            this._destination = destination;
            this._condition = condition;
            this._retryTimer = -1;
            this.handler = function (value) { return _this._handle(value); };
        }
        EventGateKeeper.prototype.dispose = function () {
            if (this._retryTimer !== -1) {
                clearTimeout(this._retryTimer);
                this._retryTimer = -1;
                this._retryValue = null;
            }
        };
        EventGateKeeper.prototype._handle = function (value) {
            var _this = this;
            if (this._condition()) {
                if (this._retryTimer !== -1) {
                    clearTimeout(this._retryTimer);
                    this._retryTimer = -1;
                    this._retryValue = null;
                }
                this._destination(value);
            }
            else {
                this._retryValue = value;
                if (this._retryTimer === -1) {
                    this._retryTimer = setTimeout(function () {
                        _this._retryTimer = -1;
                        var tmp = _this._retryValue;
                        _this._retryValue = null;
                        _this._handle(tmp);
                    }, 10);
                }
            }
        };
        return EventGateKeeper;
    })();
    var MouseHandler = (function (_super) {
        __extends(MouseHandler, _super);
        function MouseHandler(context, viewController, viewHelper) {
            var _this = this;
            _super.call(this);
            this.context = context;
            this.viewController = viewController;
            this.viewHelper = viewHelper;
            this.mouseTargetFactory = new MouseTarget.MouseTargetFactory(this.context, viewHelper);
            this.listenersToRemove = [];
            this.hideTextAreaTimeout = -1;
            this.toDispose = [];
            this.mouseMoveMonitor = new GlobalMouseMoveMonitor.GlobalMouseMoveMonitor();
            this.toDispose.push(this.mouseMoveMonitor);
            this.lastMouseEvent = null;
            this.lastMouseDownPosition = null;
            this.currentSelection = selection_1.Selection.createSelection(1, 1, 1, 1);
            this.lastMouseDownPositionEqualCount = 0;
            this.lastMouseDownCount = 0;
            this.lastSetMouseDownCountTime = 0;
            this.onScrollTimeout = -1;
            this.layoutWidth = 0;
            this.layoutHeight = 0;
            this.lastMouseLeaveTime = -1;
            this.listenersToRemove.push(DomUtils.addListener(this.viewHelper.viewDomNode, 'contextmenu', function (e) { return _this._onContextMenu(e); }));
            this._mouseMoveEventHandler = new EventGateKeeper(function (e) { return _this._onMouseMove(e); }, function () { return !_this.viewHelper.isDirty(); });
            this.toDispose.push(this._mouseMoveEventHandler);
            this.listenersToRemove.push(DomUtils.addThrottledListener(this.viewHelper.viewDomNode, 'mousemove', this._mouseMoveEventHandler.handler, createMouseMoveEventMerger(this.mouseTargetFactory), MouseHandler.MOUSE_MOVE_MINIMUM_TIME));
            this._mouseDownThenMoveEventHandler = new EventGateKeeper(function (e) { return _this._onMouseDownThenMove(e); }, function () { return !_this.viewHelper.isDirty(); });
            this.toDispose.push(this._mouseDownThenMoveEventHandler);
            this.listenersToRemove.push(DomUtils.addListener(this.viewHelper.viewDomNode, 'mouseup', function (e) { return _this._onMouseUp(e); }));
            this.listenersToRemove.push(DomUtils.addNonBubblingMouseOutListener(this.viewHelper.viewDomNode, function (e) { return _this._onMouseLeave(e); }));
            this.listenersToRemove.push(DomUtils.addListener(this.viewHelper.viewDomNode, 'mousedown', function (e) { return _this._onMouseDown(e); }));
            this.context.addEventHandler(this);
        }
        MouseHandler.prototype.dispose = function () {
            this.context.removeEventHandler(this);
            this.listenersToRemove.forEach(function (element) {
                element();
            });
            this.listenersToRemove = [];
            this.toDispose = Lifecycle.disposeAll(this.toDispose);
            this._unhook();
            if (this.hideTextAreaTimeout !== -1) {
                window.clearTimeout(this.hideTextAreaTimeout);
                this.hideTextAreaTimeout = -1;
            }
        };
        MouseHandler.prototype.onLayoutChanged = function (layoutInfo) {
            this._layoutInfo = layoutInfo;
            return false;
        };
        MouseHandler.prototype.onScrollChanged = function (e) {
            if (this.mouseMoveMonitor.isMonitoring()) {
                this._hookedOnScroll(e);
            }
            return false;
        };
        MouseHandler.prototype.onCursorSelectionChanged = function (e) {
            this.currentSelection = e.selection;
            return false;
        };
        // --- end event handlers
        MouseHandler.prototype._createMouseTarget = function (e, testEventTarget) {
            var editorContent = DomUtils.getDomNodePosition(this.viewHelper.viewDomNode);
            return this.mouseTargetFactory.createMouseTarget(this._layoutInfo, editorContent, e, testEventTarget);
        };
        MouseHandler.prototype._onContextMenu = function (rawEvent) {
            var e = new Mouse.StandardMouseEvent(rawEvent);
            var t = this._createMouseTarget(e, true);
            var mouseEvent = {
                event: e,
                target: t
            };
            this.viewController.emitContextMenu(mouseEvent);
        };
        MouseHandler.prototype._onMouseMove = function (e) {
            if (this.mouseMoveMonitor.isMonitoring()) {
                // In selection/drag operation
                return;
            }
            var actualMouseMoveTime = e.timestamp;
            if (actualMouseMoveTime < this.lastMouseLeaveTime) {
                // Due to throttling, this event occured before the mouse left the editor, therefore ignore it.
                return;
            }
            var t = this._createMouseTarget(e, true);
            var mouseEvent = {
                event: e,
                target: t
            };
            this.viewController.emitMouseMove(mouseEvent);
        };
        MouseHandler.prototype._onMouseLeave = function (rawEvent) {
            this.lastMouseLeaveTime = (new Date()).getTime();
            var mouseEvent = {
                event: new Mouse.StandardMouseEvent(rawEvent),
                target: null
            };
            this.viewController.emitMouseLeave(mouseEvent);
        };
        MouseHandler.prototype._onMouseUp = function (rawEvent) {
            var e = new Mouse.StandardMouseEvent(rawEvent);
            var t = this._createMouseTarget(e, true);
            var mouseEvent = {
                event: e,
                target: t
            };
            this.viewController.emitMouseUp(mouseEvent);
        };
        MouseHandler.prototype._onMouseDown = function (rawEvent) {
            var _this = this;
            var e = new Mouse.StandardMouseEvent(rawEvent);
            var t = this._createMouseTarget(e, true);
            var targetIsContent = (t.type === EditorCommon.MouseTargetType.CONTENT_TEXT || t.type === EditorCommon.MouseTargetType.CONTENT_EMPTY);
            var targetIsGutter = (t.type === EditorCommon.MouseTargetType.GUTTER_GLYPH_MARGIN || t.type === EditorCommon.MouseTargetType.GUTTER_LINE_NUMBERS || t.type === EditorCommon.MouseTargetType.GUTTER_LINE_DECORATIONS);
            var targetIsLineNumbers = (t.type === EditorCommon.MouseTargetType.GUTTER_LINE_NUMBERS);
            var selectOnLineNumbers = this.context.configuration.editor.selectOnLineNumbers;
            var targetIsViewZone = (t.type === EditorCommon.MouseTargetType.CONTENT_VIEW_ZONE || t.type === EditorCommon.MouseTargetType.GUTTER_VIEW_ZONE);
            var shouldHandle = e.leftButton;
            if (Platform.isMacintosh && e.ctrlKey) {
                shouldHandle = false;
            }
            if (shouldHandle && (targetIsContent || (targetIsLineNumbers && selectOnLineNumbers))) {
                if (Browser.isIE11orEarlier) {
                    // IE does not want to focus when coming in from the browser's address bar
                    if (e.browserEvent.fromElement) {
                        e.preventDefault();
                        this.viewHelper.focusTextArea();
                    }
                    else {
                        // TODO@Alex -> cancel this if focus is lost
                        setTimeout(function () {
                            _this.viewHelper.focusTextArea();
                        });
                    }
                }
                else {
                    e.preventDefault();
                    this.viewHelper.focusTextArea();
                }
                this._updateMouse(t.type, e, e.shiftKey, e.detail);
                this._hook(t.type);
            }
            else if (targetIsGutter) {
                // Do not steal focus
                e.preventDefault();
            }
            else if (targetIsViewZone) {
                var viewZoneData = t.detail;
                if (this.viewHelper.shouldSuppressMouseDownOnViewZone(viewZoneData.viewZoneId)) {
                    e.preventDefault();
                }
            }
            var mouseEvent = {
                event: e,
                target: t
            };
            this.viewController.emitMouseDown(mouseEvent);
        };
        MouseHandler.prototype._hookedOnScroll = function (rawEvent) {
            var _this = this;
            if (this.onScrollTimeout === -1) {
                this.onScrollTimeout = window.setTimeout(function () {
                    _this.onScrollTimeout = -1;
                    _this._updateMouse(_this.monitoringStartTargetType, null, true);
                }, 10);
            }
        };
        MouseHandler.prototype._hook = function (startTargetType) {
            var _this = this;
            if (this.mouseMoveMonitor.isMonitoring()) {
                // Already monitoring
                return;
            }
            this.monitoringStartTargetType = startTargetType;
            this.mouseMoveMonitor.startMonitoring(createMouseMoveEventMerger(null), this._mouseDownThenMoveEventHandler.handler, function () {
                _this._unhook();
            });
        };
        MouseHandler.prototype._onMouseDownThenMove = function (e) {
            this._updateMouse(this.monitoringStartTargetType, e, true);
        };
        MouseHandler.prototype._unhook = function () {
            if (this.onScrollTimeout !== -1) {
                window.clearTimeout(this.onScrollTimeout);
                this.onScrollTimeout = -1;
            }
        };
        MouseHandler.prototype._getPositionOutsideEditor = function (editorContent, e) {
            var possibleLineNumber;
            if (e.posy < editorContent.top) {
                possibleLineNumber = this.viewHelper.getLineNumberAtVerticalOffset(Math.max(this.viewHelper.getScrollTop() - (editorContent.top - e.posy), 0));
                return {
                    lineNumber: possibleLineNumber,
                    column: 1
                };
            }
            if (e.posy > editorContent.top + editorContent.height) {
                possibleLineNumber = this.viewHelper.getLineNumberAtVerticalOffset(this.viewHelper.getScrollTop() + (e.posy - editorContent.top));
                return {
                    lineNumber: possibleLineNumber,
                    column: this.context.model.getLineMaxColumn(possibleLineNumber)
                };
            }
            possibleLineNumber = this.viewHelper.getLineNumberAtVerticalOffset(this.viewHelper.getScrollTop() + (e.posy - editorContent.top));
            if (e.posx < editorContent.left) {
                return {
                    lineNumber: possibleLineNumber,
                    column: 1
                };
            }
            if (e.posx > editorContent.left + editorContent.width) {
                return {
                    lineNumber: possibleLineNumber,
                    column: this.context.model.getLineMaxColumn(possibleLineNumber)
                };
            }
            return null;
        };
        MouseHandler.prototype._updateMouse = function (startTargetType, e, inSelectionMode, setMouseDownCount) {
            if (setMouseDownCount === void 0) { setMouseDownCount = 0; }
            e = e || this.lastMouseEvent;
            this.lastMouseEvent = e;
            var editorContent = DomUtils.getDomNodePosition(this.viewHelper.viewDomNode);
            var positionOutsideEditor = this._getPositionOutsideEditor(editorContent, e);
            var lineNumber, column;
            if (positionOutsideEditor) {
                lineNumber = positionOutsideEditor.lineNumber;
                column = positionOutsideEditor.column;
            }
            else {
                var t = this._createMouseTarget(e, true);
                var hintedPosition = t.position;
                if (!hintedPosition) {
                    //				console.info('Ignoring updateMouse');
                    return;
                }
                if (t.type === EditorCommon.MouseTargetType.CONTENT_VIEW_ZONE || t.type === EditorCommon.MouseTargetType.GUTTER_VIEW_ZONE) {
                    // Force position on view zones to go above or below depending on where selection started from
                    if (this.lastMouseDownCount > 0) {
                        var selectionStart = new position_1.Position(this.currentSelection.selectionStartLineNumber, this.currentSelection.selectionStartColumn);
                        var viewZoneData = t.detail;
                        var positionBefore = viewZoneData.positionBefore;
                        var positionAfter = viewZoneData.positionAfter;
                        if (positionBefore && positionAfter) {
                            if (positionBefore.isBefore(selectionStart)) {
                                hintedPosition = positionBefore;
                            }
                            else {
                                hintedPosition = positionAfter;
                            }
                        }
                    }
                }
                lineNumber = hintedPosition.lineNumber;
                column = hintedPosition.column;
            }
            if (setMouseDownCount) {
                // a. Invalidate multiple clicking if too much time has passed (will be hit by IE because the detail field of mouse events contains garbage in IE10)
                var currentTime = (new Date()).getTime();
                if (currentTime - this.lastSetMouseDownCountTime > MouseHandler.CLEAR_MOUSE_DOWN_COUNT_TIME) {
                    setMouseDownCount = 1;
                }
                this.lastSetMouseDownCountTime = currentTime;
                // b. Ensure that we don't jump from single click to triple click in one go (will be hit by IE because the detail field of mouse events contains garbage in IE10)
                if (setMouseDownCount > this.lastMouseDownCount + 1) {
                    setMouseDownCount = this.lastMouseDownCount + 1;
                }
                // c. Invalidate multiple clicking if the logical position is different
                var newMouseDownPosition = new position_1.Position(lineNumber, column);
                if (this.lastMouseDownPosition && this.lastMouseDownPosition.equals(newMouseDownPosition)) {
                    this.lastMouseDownPositionEqualCount++;
                }
                else {
                    this.lastMouseDownPositionEqualCount = 1;
                }
                this.lastMouseDownPosition = newMouseDownPosition;
                // Finally set the lastMouseDownCount
                this.lastMouseDownCount = Math.min(setMouseDownCount, this.lastMouseDownPositionEqualCount);
                // Overwrite the detail of the MouseEvent, as it will be sent out in an event and contributions might rely on it.
                e.detail = this.lastMouseDownCount;
            }
            if (startTargetType === EditorCommon.MouseTargetType.GUTTER_LINE_NUMBERS) {
                // If the dragging started on the gutter, then have operations work on the entire line
                if (e.altKey) {
                    if (inSelectionMode) {
                        this.viewController.lastCursorLineSelect('mouse', lineNumber, column);
                    }
                    else {
                        this.viewController.createCursor('mouse', lineNumber, column, true);
                    }
                }
                else {
                    if (inSelectionMode) {
                        this.viewController.lineSelectDrag('mouse', lineNumber, column);
                    }
                    else {
                        this.viewController.lineSelect('mouse', lineNumber, column);
                    }
                }
            }
            else if (this.lastMouseDownCount >= 4) {
                this.viewController.selectAll('mouse');
            }
            else if (this.lastMouseDownCount === 3) {
                if (e.altKey) {
                    if (inSelectionMode) {
                        this.viewController.lastCursorLineSelectDrag('mouse', lineNumber, column);
                    }
                    else {
                        this.viewController.lastCursorLineSelect('mouse', lineNumber, column);
                    }
                }
                else {
                    if (inSelectionMode) {
                        this.viewController.lineSelectDrag('mouse', lineNumber, column);
                    }
                    else {
                        this.viewController.lineSelect('mouse', lineNumber, column);
                    }
                }
            }
            else if (this.lastMouseDownCount === 2) {
                var preference = 'none';
                var visibleRangeForPosition = this.viewHelper.visibleRangeForPosition2(lineNumber, column);
                if (visibleRangeForPosition) {
                    var columnPosX = editorContent.left + visibleRangeForPosition.left;
                    if (e.posx > columnPosX) {
                        preference = 'right';
                    }
                    else if (e.posx < columnPosX) {
                        preference = 'left';
                    }
                }
                if (e.altKey) {
                    this.viewController.lastCursorWordSelect('mouse', lineNumber, column, preference);
                }
                else {
                    if (inSelectionMode) {
                        this.viewController.wordSelectDrag('mouse', lineNumber, column, preference);
                    }
                    else {
                        this.viewController.wordSelect('mouse', lineNumber, column, preference);
                    }
                }
            }
            else {
                if (e.altKey) {
                    if (!e.ctrlKey && !e.metaKey) {
                        // Do multi-cursor operations only when purely alt is pressed
                        if (inSelectionMode) {
                            this.viewController.lastCursorMoveToSelect('mouse', lineNumber, column);
                        }
                        else {
                            this.viewController.createCursor('mouse', lineNumber, column, false);
                        }
                    }
                }
                else {
                    if (inSelectionMode) {
                        this.viewController.moveToSelect('mouse', lineNumber, column);
                    }
                    else {
                        this.viewController.moveTo('mouse', lineNumber, column);
                    }
                }
            }
        };
        MouseHandler.CLEAR_MOUSE_DOWN_COUNT_TIME = 400; // ms
        MouseHandler.MOUSE_MOVE_MINIMUM_TIME = 100; // ms
        return MouseHandler;
    })(viewEventHandler_1.ViewEventHandler);
    exports.MouseHandler = MouseHandler;
});
//# sourceMappingURL=mouseHandler.js.map