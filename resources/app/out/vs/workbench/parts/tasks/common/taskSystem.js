/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    var TaskError = (function () {
        function TaskError(severity, message, code) {
            if (code === void 0) { code = -1; }
            this.severity = severity;
            this.message = message;
            this.code = code;
        }
        return TaskError;
    })();
    exports.TaskError = TaskError;
    var Triggers;
    (function (Triggers) {
        Triggers.shortcut = 'shortcut';
        Triggers.command = 'command';
    })(Triggers = exports.Triggers || (exports.Triggers = {}));
    (function (ShowOutput) {
        ShowOutput[ShowOutput["Always"] = 0] = "Always";
        ShowOutput[ShowOutput["Silent"] = 1] = "Silent";
        ShowOutput[ShowOutput["Never"] = 2] = "Never";
    })(exports.ShowOutput || (exports.ShowOutput = {}));
    var ShowOutput = exports.ShowOutput;
    var ShowOutput;
    (function (ShowOutput) {
        function fromString(value) {
            value = value.toLowerCase();
            if (value === 'always') {
                return ShowOutput.Always;
            }
            else if (value === 'silent') {
                return ShowOutput.Silent;
            }
            else if (value === 'never') {
                return ShowOutput.Never;
            }
            else {
                return undefined;
            }
        }
        ShowOutput.fromString = fromString;
    })(ShowOutput = exports.ShowOutput || (exports.ShowOutput = {}));
    var TaskSystemEvents;
    (function (TaskSystemEvents) {
        TaskSystemEvents.Active = 'active';
        TaskSystemEvents.Inactive = 'inactive';
    })(TaskSystemEvents = exports.TaskSystemEvents || (exports.TaskSystemEvents = {}));
    (function (TaskType) {
        TaskType[TaskType["SingleRun"] = 0] = "SingleRun";
        TaskType[TaskType["Watching"] = 1] = "Watching";
    })(exports.TaskType || (exports.TaskType = {}));
    var TaskType = exports.TaskType;
});
//# sourceMappingURL=taskSystem.js.map