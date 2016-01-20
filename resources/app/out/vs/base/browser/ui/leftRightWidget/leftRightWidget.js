/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/builder', 'vs/css!./leftRightWidget'], function (require, exports, Builder) {
    var $ = Builder.$;
    var LeftRightWidget = (function () {
        function LeftRightWidget(container, renderLeftFn, renderRightFn) {
            this.$el = $('.monaco-left-right-widget').appendTo(container);
            this.toDispose = [
                renderRightFn($('.right').appendTo(this.$el).getHTMLElement()),
                renderLeftFn($('span.left').appendTo(this.$el).getHTMLElement())
            ].filter(function (x) { return !!x; });
        }
        LeftRightWidget.prototype.dispose = function () {
            if (this.$el) {
                this.$el.destroy();
                this.$el = null;
            }
        };
        return LeftRightWidget;
    })();
    exports.LeftRightWidget = LeftRightWidget;
});
//# sourceMappingURL=leftRightWidget.js.map