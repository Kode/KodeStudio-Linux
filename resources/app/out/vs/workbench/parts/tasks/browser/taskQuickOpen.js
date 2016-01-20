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
define(["require", "exports", 'vs/nls', 'vs/base/common/filters', 'vs/workbench/browser/quickopen', 'vs/base/parts/quickopen/common/quickOpen', 'vs/base/parts/quickopen/browser/quickOpenModel', 'vs/workbench/services/quickopen/common/quickOpenService', 'vs/workbench/parts/tasks/common/taskService'], function (require, exports, nls, Filters, Quickopen, QuickOpen, Model, quickOpenService_1, taskService_1) {
    var TaskEntry = (function (_super) {
        __extends(TaskEntry, _super);
        function TaskEntry(taskService, task, highlights) {
            if (highlights === void 0) { highlights = []; }
            _super.call(this, highlights);
            this.taskService = taskService;
            this.task = task;
        }
        TaskEntry.prototype.getLabel = function () {
            return this.task.name;
        };
        TaskEntry.prototype.run = function (mode, context) {
            if (mode === QuickOpen.Mode.PREVIEW) {
                return false;
            }
            this.taskService.run(this.task.id);
            return true;
        };
        return TaskEntry;
    })(Model.QuickOpenEntry);
    var QuickOpenHandler = (function (_super) {
        __extends(QuickOpenHandler, _super);
        function QuickOpenHandler(quickOpenService, taskService) {
            _super.call(this);
            this.quickOpenService = quickOpenService;
            this.taskService = taskService;
        }
        QuickOpenHandler.prototype.getResults = function (input) {
            var _this = this;
            return this.taskService.tasks().then(function (tasks) { return tasks
                .sort(function (a, b) { return a.name.localeCompare(b.name); })
                .map(function (task) { return ({ task: task, highlights: Filters.matchesContiguousSubString(input, task.name) }); })
                .filter(function (_a) {
                var highlights = _a.highlights;
                return !!highlights;
            })
                .map(function (_a) {
                var task = _a.task, highlights = _a.highlights;
                return new TaskEntry(_this.taskService, task, highlights);
            }); }, function (_) { return []; }).then(function (e) { return new Model.QuickOpenModel(e); });
        };
        QuickOpenHandler.prototype.getClass = function () {
            return null;
        };
        QuickOpenHandler.prototype.canRun = function () {
            return true;
        };
        QuickOpenHandler.prototype.getAutoFocus = function (input) {
            return {
                autoFocusFirstEntry: !!input
            };
        };
        QuickOpenHandler.prototype.onClose = function (canceled) {
            return;
        };
        QuickOpenHandler.prototype.getGroupLabel = function () {
            return null;
        };
        QuickOpenHandler.prototype.getEmptyLabel = function (searchString) {
            if (searchString.length > 0) {
                return nls.localize('noTasksMatching', "No tasks matching");
            }
            return nls.localize('noTasksFound', "No tasks found");
        };
        QuickOpenHandler = __decorate([
            __param(0, quickOpenService_1.IQuickOpenService),
            __param(1, taskService_1.ITaskService)
        ], QuickOpenHandler);
        return QuickOpenHandler;
    })(Quickopen.QuickOpenHandler);
    exports.QuickOpenHandler = QuickOpenHandler;
});
//# sourceMappingURL=taskQuickOpen.js.map