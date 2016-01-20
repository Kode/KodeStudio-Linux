/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/builder'], function (require, exports, Builder) {
    var $ = Builder.$;
    /**
     * A helper that will execute a provided function when the provided HTMLElement receives
     *  dragover event for 800ms. If the drag is aborted before, the callback will not be triggered.
     */
    var DelayedDragHandler = (function () {
        function DelayedDragHandler(container, callback) {
            var _this = this;
            $(container).on('dragover', function () {
                if (!_this.timeout) {
                    _this.timeout = setTimeout(function () {
                        callback();
                        delete _this.timeout;
                    }, 800);
                }
            });
            $(container).on(['dragleave', 'drop', 'dragend'], function () { return _this.clearDragTimeout(); });
        }
        DelayedDragHandler.prototype.clearDragTimeout = function () {
            if (this.timeout) {
                clearTimeout(this.timeout);
                delete this.timeout;
            }
        };
        DelayedDragHandler.prototype.dispose = function () {
            this.clearDragTimeout();
        };
        return DelayedDragHandler;
    })();
    exports.DelayedDragHandler = DelayedDragHandler;
});
//# sourceMappingURL=dnd.js.map