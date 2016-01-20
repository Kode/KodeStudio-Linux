/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
define(["require", "exports", 'vs/editor/browser/editorBrowser', 'vs/base/browser/browser', 'vs/base/common/lifecycle', 'vs/editor/browser/editorBrowserExtensions', 'vs/platform/thread/common/thread', 'vs/css!./workerStatusReporter'], function (require, exports, EditorBrowser, Browser, lifecycle, editorBrowserExtensions_1, thread_1) {
    var WorkerStatusReporter = (function () {
        function WorkerStatusReporter(editor, threadService) {
            this._threadService = threadService;
            this._threadService.addStatusListener(this);
            this._editor = editor;
            this._toDispose = [];
            this._domNodes = [];
            this._domNode = document.createElement('div');
            this._domNode.className = 'monaco-worker-status';
            if (Browser.canUseTranslate3d) {
                // Put the worker reporter in its own layer
                this._domNode.style.transform = 'translate3d(0px, 0px, 0px)';
            }
            this._editor.addOverlayWidget(this);
        }
        WorkerStatusReporter.prototype.getId = function () {
            return WorkerStatusReporter.ID;
        };
        WorkerStatusReporter.prototype.dispose = function () {
            this._threadService.removeStatusListener(this);
            this._toDispose = lifecycle.disposeAll(this._toDispose);
        };
        WorkerStatusReporter.prototype.getDomNode = function () {
            return this._domNode;
        };
        WorkerStatusReporter.prototype.getPosition = function () {
            return { preference: EditorBrowser.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER };
        };
        WorkerStatusReporter.prototype._ensureDomNodes = function (desiredCount) {
            // Remove extra dom nodes
            for (var i = this._domNodes.length - 1; i >= desiredCount; i++) {
                this._domNode.removeChild(this._domNodes[i]);
                this._domNodes.splice(i, 1);
            }
            // Create new dom nodes
            for (var i = this._domNodes.length; i < desiredCount; i++) {
                this._domNodes[i] = document.createElement('div');
                this._domNodes[i].className = 'worker';
                this._domNode.appendChild(this._domNodes[i]);
            }
        };
        WorkerStatusReporter.prototype.onThreadServiceStatus = function (status) {
            this._ensureDomNodes(status.workers.length);
            for (var i = 0; i < status.workers.length; i++) {
                var cnt = status.workers[i].queueSize;
                var workerStatus = 'idle';
                if (cnt > 5) {
                    workerStatus = 'flooded';
                }
                else if (cnt > 0) {
                    workerStatus = 'busy';
                }
                attr(this._domNodes[i], 'status', workerStatus);
            }
        };
        WorkerStatusReporter.ID = 'editor.contrib.workerStatusReporter';
        WorkerStatusReporter = __decorate([
            __param(1, thread_1.IThreadService)
        ], WorkerStatusReporter);
        return WorkerStatusReporter;
    })();
    function attr(target, attrName, attrValue) {
        target.setAttribute(attrName, attrValue);
    }
    if (false) {
        editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(WorkerStatusReporter);
    }
});
//# sourceMappingURL=workerStatusReporter.js.map