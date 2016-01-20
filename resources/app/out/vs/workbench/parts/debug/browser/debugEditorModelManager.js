/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", 'vs/base/common/lifecycle', 'vs/editor/common/editorCommon', 'vs/workbench/parts/debug/common/debug', 'vs/editor/common/services/modelService'], function (require, exports, lifecycle, editorcommon, debug_1, modelService_1) {
    function toMap(arr) {
        var result = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            result[arr[i]] = true;
        }
        return result;
    }
    function createRange(startLineNUmber, startColumn, endLineNumber, endColumn) {
        return {
            startLineNumber: startLineNUmber,
            startColumn: startColumn,
            endLineNumber: endLineNumber,
            endColumn: endColumn
        };
    }
    var DebugEditorModelManager = (function () {
        function DebugEditorModelManager(modelService, debugService) {
            this.modelService = modelService;
            this.debugService = debugService;
            this.modelData = {};
            this.toDispose = [];
            this.registerListeners();
        }
        DebugEditorModelManager.prototype.getId = function () {
            return DebugEditorModelManager.ID;
        };
        DebugEditorModelManager.prototype.dispose = function () {
            for (var modelUrlStr in this.modelData) {
                if (this.modelData.hasOwnProperty(modelUrlStr)) {
                    var modelData = this.modelData[modelUrlStr];
                    lifecycle.disposeAll(modelData.toDispose);
                    modelData.model.deltaDecorations(modelData.breakpointDecorationIds, []);
                    modelData.model.deltaDecorations(modelData.currentStackDecorations, []);
                }
            }
            this.toDispose = lifecycle.disposeAll(this.toDispose);
            this.modelData = null;
        };
        DebugEditorModelManager.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.modelService.onModelAdded(this.onModelAdded, this));
            this.modelService.getModels().forEach(function (model) { return _this.onModelAdded(model); });
            this.toDispose.push(this.modelService.onModelRemoved(this.onModelRemoved, this));
            this.toDispose.push(this.debugService.getModel().addListener2(debug_1.ModelEvents.BREAKPOINTS_UPDATED, function () { return _this.onBreakpointsChanged(); }));
            this.toDispose.push(this.debugService.getViewModel().addListener2(debug_1.ViewModelEvents.FOCUSED_STACK_FRAME_UPDATED, function () { return _this.onFocusedStackFrameUpdated(); }));
        };
        DebugEditorModelManager.prototype.onModelAdded = function (model) {
            var _this = this;
            var modelUrlStr = model.getAssociatedResource().toString();
            var breakpoints = this.debugService.getModel().getBreakpoints().filter(function (bp) { return bp.source.uri.toString() === modelUrlStr; });
            var currentStackDecorations = model.deltaDecorations([], this.createCallStackDecorations(modelUrlStr));
            var breakPointDecorations = model.deltaDecorations([], this.createBreakpointDecorations(breakpoints));
            var toDispose = [model.addListener2(editorcommon.EventType.ModelDecorationsChanged, function (e) {
                    return _this.onModelDecorationsChanged(modelUrlStr, e);
                })];
            this.modelData[modelUrlStr] = {
                model: model,
                toDispose: toDispose,
                breakpointDecorationIds: breakPointDecorations,
                breakpointLines: breakpoints.map(function (bp) { return bp.lineNumber; }),
                breakpointDecorationsAsMap: toMap(breakPointDecorations),
                currentStackDecorations: currentStackDecorations,
                topStackFrameRange: null
            };
        };
        DebugEditorModelManager.prototype.onModelRemoved = function (model) {
            var modelUrlStr = model.getAssociatedResource().toString();
            if (this.modelData.hasOwnProperty(modelUrlStr)) {
                var modelData = this.modelData[modelUrlStr];
                delete this.modelData[modelUrlStr];
                lifecycle.disposeAll(modelData.toDispose);
            }
        };
        // call stack management. Represent data coming from the debug service.
        DebugEditorModelManager.prototype.onFocusedStackFrameUpdated = function () {
            var _this = this;
            Object.keys(this.modelData).forEach(function (modelUrlStr) {
                var modelData = _this.modelData[modelUrlStr];
                modelData.currentStackDecorations = modelData.model.deltaDecorations(modelData.currentStackDecorations, _this.createCallStackDecorations(modelUrlStr));
            });
        };
        DebugEditorModelManager.prototype.createCallStackDecorations = function (modelUrlStr) {
            var _this = this;
            var result = [];
            var focusedStackFrame = this.debugService.getViewModel().getFocusedStackFrame();
            var allThreads = this.debugService.getModel().getThreads();
            if (!focusedStackFrame || !allThreads[focusedStackFrame.threadId] || !allThreads[focusedStackFrame.threadId].callStack) {
                return result;
            }
            // only show decorations for the currently focussed thread.
            var thread = allThreads[focusedStackFrame.threadId];
            thread.callStack.filter(function (sf) { return sf.source.uri.toString() === modelUrlStr; }).forEach(function (sf) {
                var wholeLineRange = createRange(sf.lineNumber, sf.column, sf.lineNumber, Number.MAX_VALUE);
                // compute how to decorate the editor. Different decorations are used if this is a top stack frame, focussed stack frame,
                // an exception or a stack frame that did not change the line number (we only decorate the columns, not the whole line).
                if (sf === thread.callStack[0]) {
                    result.push({
                        options: DebugEditorModelManager.TOP_STACK_FRAME_MARGIN,
                        range: createRange(sf.lineNumber, sf.column, sf.lineNumber, sf.column + 1)
                    });
                    if (thread.stoppedReason === 'exception') {
                        result.push({
                            options: DebugEditorModelManager.TOP_STACK_FRAME_EXCEPTION_DECORATION,
                            range: wholeLineRange
                        });
                    }
                    else {
                        result.push({
                            options: DebugEditorModelManager.TOP_STACK_FRAME_DECORATION,
                            range: wholeLineRange
                        });
                        if (_this.modelData[modelUrlStr]) {
                            if (_this.modelData[modelUrlStr].topStackFrameRange && _this.modelData[modelUrlStr].topStackFrameRange.startLineNumber === wholeLineRange.startLineNumber &&
                                _this.modelData[modelUrlStr].topStackFrameRange.startColumn !== wholeLineRange.startColumn) {
                                result.push({
                                    options: DebugEditorModelManager.TOP_STACK_FRAME_COLUMN_DECORATION,
                                    range: wholeLineRange
                                });
                            }
                            _this.modelData[modelUrlStr].topStackFrameRange = wholeLineRange;
                        }
                    }
                }
                else if (sf === focusedStackFrame) {
                    result.push({
                        options: DebugEditorModelManager.FOCUSED_STACK_FRAME_MARGIN,
                        range: createRange(sf.lineNumber, sf.column, sf.lineNumber, sf.column + 1)
                    });
                    result.push({
                        options: DebugEditorModelManager.FOCUSED_STACK_FRAME_DECORATION,
                        range: wholeLineRange
                    });
                }
            });
            return result;
        };
        // breakpoints management. Represent data coming from the debug service and also send data back.
        DebugEditorModelManager.prototype.onModelDecorationsChanged = function (modelUrlStr, e) {
            var modelData = this.modelData[modelUrlStr];
            if (!e.addedOrChangedDecorations.some(function (d) { return modelData.breakpointDecorationsAsMap.hasOwnProperty(d.id); })) {
                // nothing to do, my decorations did not change.
                return;
            }
            var data = [];
            var enabledAndConditions = {};
            this.debugService.getModel().getBreakpoints().filter(function (bp) { return bp.source.uri.toString() === modelUrlStr; }).forEach(function (bp) {
                enabledAndConditions[bp.lineNumber] = {
                    enabled: bp.enabled,
                    condition: bp.condition
                };
            });
            var modelUrl = modelData.model.getAssociatedResource();
            for (var i = 0, len = modelData.breakpointDecorationIds.length; i < len; i++) {
                var decorationRange = modelData.model.getDecorationRange(modelData.breakpointDecorationIds[i]);
                // check if the line got deleted.
                if (decorationRange.endColumn - decorationRange.startColumn > 0) {
                    // since we know it is collapsed, it cannot grow to multiple lines
                    data.push({
                        uri: modelUrl,
                        lineNumber: decorationRange.startLineNumber,
                        enabled: enabledAndConditions[modelData.breakpointLines[i]].enabled,
                        condition: enabledAndConditions[modelData.breakpointLines[i]].condition
                    });
                }
            }
            this.debugService.setBreakpointsForModel(modelUrl, data);
        };
        DebugEditorModelManager.prototype.onBreakpointsChanged = function () {
            var _this = this;
            var breakpointsMap = {};
            this.debugService.getModel().getBreakpoints().forEach(function (bp) {
                var uriStr = bp.source.uri.toString();
                if (breakpointsMap[uriStr]) {
                    breakpointsMap[uriStr].push(bp);
                }
                else {
                    breakpointsMap[uriStr] = [bp];
                }
            });
            Object.keys(breakpointsMap).forEach(function (modelUriStr) {
                if (_this.modelData.hasOwnProperty(modelUriStr)) {
                    _this.updateBreakpoints(_this.modelData[modelUriStr], breakpointsMap[modelUriStr]);
                }
            });
            Object.keys(this.modelData).forEach(function (modelUriStr) {
                if (!breakpointsMap.hasOwnProperty(modelUriStr)) {
                    _this.updateBreakpoints(_this.modelData[modelUriStr], []);
                }
            });
        };
        DebugEditorModelManager.prototype.updateBreakpoints = function (modelData, newBreakpoints) {
            modelData.breakpointDecorationIds = modelData.model.deltaDecorations(modelData.breakpointDecorationIds, this.createBreakpointDecorations(newBreakpoints));
            modelData.breakpointDecorationsAsMap = toMap(modelData.breakpointDecorationIds);
            modelData.breakpointLines = newBreakpoints.map(function (bp) { return bp.lineNumber; });
        };
        DebugEditorModelManager.prototype.createBreakpointDecorations = function (breakpoints) {
            var activated = this.debugService.getModel().areBreakpointsActivated();
            var state = this.debugService.getState();
            var debugActive = state === debug_1.State.Running || state === debug_1.State.Stopped || state === debug_1.State.Initializing;
            return breakpoints.map(function (breakpoint) {
                return {
                    options: (!breakpoint.enabled || !activated) ? DebugEditorModelManager.BREAKPOINT_DISABLED_DECORATION :
                        debugActive && !breakpoint.verified ? DebugEditorModelManager.BREAKPOINT_UNVERIFIED_DECORATION :
                            breakpoint.condition ? DebugEditorModelManager.CONDITIONAL_BREAKPOINT_DECORATION : DebugEditorModelManager.BREAKPOINT_DECORATION,
                    range: createRange(breakpoint.lineNumber, 1, breakpoint.lineNumber, 2)
                };
            });
        };
        DebugEditorModelManager.ID = 'breakpointManager';
        // editor decorations
        DebugEditorModelManager.BREAKPOINT_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-glyph',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager.CONDITIONAL_BREAKPOINT_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-conditional-glyph',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager.BREAKPOINT_DISABLED_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-glyph-disabled',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager.BREAKPOINT_UNVERIFIED_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-glyph-unverified',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        // we need a separate decoration for glyph margin, since we do not want it on each line of a multi line statement.
        DebugEditorModelManager.TOP_STACK_FRAME_MARGIN = {
            glyphMarginClassName: 'debug-top-stack-frame-glyph',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager.FOCUSED_STACK_FRAME_MARGIN = {
            glyphMarginClassName: 'debug-focused-stack-frame-glyph',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager.TOP_STACK_FRAME_DECORATION = {
            isWholeLine: true,
            className: 'debug-top-stack-frame-line',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager.TOP_STACK_FRAME_EXCEPTION_DECORATION = {
            isWholeLine: true,
            className: 'debug-top-stack-frame-exception-line',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager.TOP_STACK_FRAME_COLUMN_DECORATION = {
            isWholeLine: false,
            className: 'debug-top-stack-frame-column',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager.FOCUSED_STACK_FRAME_DECORATION = {
            isWholeLine: true,
            className: 'debug-focused-stack-frame-line',
            stickiness: editorcommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        };
        DebugEditorModelManager = __decorate([
            __param(0, modelService_1.IModelService),
            __param(1, debug_1.IDebugService)
        ], DebugEditorModelManager);
        return DebugEditorModelManager;
    })();
    exports.DebugEditorModelManager = DebugEditorModelManager;
});
//# sourceMappingURL=debugEditorModelManager.js.map