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
define(["require", "exports", 'vs/editor/common/viewModel/viewEventHandler'], function (require, exports, viewEventHandler_1) {
    var ViewPart = (function (_super) {
        __extends(ViewPart, _super);
        function ViewPart(context) {
            _super.call(this);
            this._context = context;
            this._context.addEventHandler(this);
            this._modificationBeforeRenderingRunners = [];
            this._modificationRunners = [];
        }
        ViewPart.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            this._modificationBeforeRenderingRunners = [];
            this._modificationRunners = [];
        };
        /**
         * Modify the DOM right before when the orchestrated rendering occurs.
         */
        ViewPart.prototype._requestModificationFrameBeforeRendering = function (runner) {
            this._modificationBeforeRenderingRunners.push(runner);
        };
        /**
         * Modify the DOM when the orchestrated rendering occurs.
         */
        ViewPart.prototype._requestModificationFrame = function (runner) {
            this._modificationRunners.push(runner);
        };
        ViewPart.prototype.onBeforeForcedLayout = function () {
            if (this._modificationBeforeRenderingRunners.length > 0) {
                for (var i = 0; i < this._modificationBeforeRenderingRunners.length; i++) {
                    this._modificationBeforeRenderingRunners[i]();
                }
                this._modificationBeforeRenderingRunners = [];
            }
        };
        ViewPart.prototype.onReadAfterForcedLayout = function (ctx) {
            if (!this.shouldRender) {
                return;
            }
            this._render(ctx);
        };
        ViewPart.prototype.onWriteAfterForcedLayout = function () {
            if (!this.shouldRender) {
                return;
            }
            this.shouldRender = false;
            this._executeModificationRunners();
        };
        ViewPart.prototype._executeModificationRunners = function () {
            if (this._modificationRunners.length > 0) {
                for (var i = 0; i < this._modificationRunners.length; i++) {
                    this._modificationRunners[i]();
                }
                this._modificationRunners = [];
            }
        };
        ViewPart.prototype._render = function (ctx) {
            throw new Error('Implement me!');
        };
        return ViewPart;
    })(viewEventHandler_1.ViewEventHandler);
    exports.ViewPart = ViewPart;
});
//# sourceMappingURL=viewPart.js.map