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
define(["require", "exports", 'vs/base/common/eventEmitter', 'vs/base/browser/dom', 'vs/base/browser/builder', 'vs/css!./button'], function (require, exports, eventEmitter_1, DOM, builder_1) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(container) {
            var _this = this;
            _super.call(this);
            this.$el = builder_1.$('a.monaco-button').href('#').appendTo(container);
            this.$el.on('click', function (e) {
                if (!_this.enabled) {
                    DOM.EventHelper.stop(e);
                    return;
                }
                _this.emit('click', e);
            });
        }
        Button.prototype.getElement = function () {
            return this.$el.getHTMLElement();
        };
        Object.defineProperty(Button.prototype, "label", {
            set: function (value) {
                this.$el.text(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "enabled", {
            get: function () {
                return !this.$el.hasClass('disabled');
            },
            set: function (value) {
                if (value) {
                    this.$el.removeClass('disabled');
                }
                else {
                    this.$el.addClass('disabled');
                }
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.dispose = function () {
            if (this.$el) {
                this.$el.dispose();
                this.$el = null;
            }
            _super.prototype.dispose.call(this);
        };
        return Button;
    })(eventEmitter_1.EventEmitter);
    exports.Button = Button;
});
//# sourceMappingURL=button.js.map