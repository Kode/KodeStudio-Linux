/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", 'vs/platform/instantiation/common/instantiation'], function (require, exports, instantiation_1) {
    exports.VIEWLET_ID = 'workbench.view.debug';
    exports.DEBUG_SERVICE_ID = 'debugService';
    exports.CONTEXT_IN_DEBUG_MODE = 'inDebugMode';
    // events
    exports.ModelEvents = {
        BREAKPOINTS_UPDATED: 'BreakpointsUpdated',
        CALLSTACK_UPDATED: 'CallStackUpdated',
        WATCH_EXPRESSIONS_UPDATED: 'WatchExpressionsUpdated',
        REPL_ELEMENTS_UPDATED: 'ReplElementsUpdated'
    };
    exports.ViewModelEvents = {
        FOCUSED_STACK_FRAME_UPDATED: 'FocusedStackFrameUpdated',
        SELECTED_EXPRESSION_UPDATED: 'SelectedExpressionUpdated'
    };
    exports.ServiceEvents = {
        STATE_CHANGED: 'StateChanged'
    };
    exports.SessionEvents = {
        INITIALIZED: 'initialized',
        STOPPED: 'stopped',
        DEBUGEE_TERMINATED: 'terminated',
        SERVER_EXIT: 'exit',
        CONTINUED: 'continued',
        THREAD: 'thread',
        OUTPUT: 'output'
    };
    // service enums
    (function (State) {
        State[State["Disabled"] = 0] = "Disabled";
        State[State["Inactive"] = 1] = "Inactive";
        State[State["Initializing"] = 2] = "Initializing";
        State[State["Stopped"] = 3] = "Stopped";
        State[State["Running"] = 4] = "Running";
    })(exports.State || (exports.State = {}));
    var State = exports.State;
    exports.IDebugService = instantiation_1.createDecorator(exports.DEBUG_SERVICE_ID);
    // utils
    var _formatPIIRegexp = /{([^}]+)}/g;
    function formatPII(value, excludePII, args) {
        return value.replace(_formatPIIRegexp, function (match, group) {
            if (excludePII && group.length > 0 && group[0] !== '_') {
                return match;
            }
            return args.hasOwnProperty(group) ?
                args[group] :
                match;
        });
    }
    exports.formatPII = formatPII;
});
//# sourceMappingURL=debug.js.map