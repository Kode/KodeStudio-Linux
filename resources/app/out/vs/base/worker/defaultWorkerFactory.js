/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/dom', 'vs/base/common/flags'], function (require, exports, dom, env) {
    function defaultGetWorkerUrl(workerId, label) {
        return require.toUrl('./' + workerId + '?' + encodeURIComponent(label));
    }
    var getWorkerUrl = env.getCrossOriginWorkerScriptUrl || defaultGetWorkerUrl;
    /**
     * A worker that uses HTML5 web workers so that is has
     * its own global scope and its own thread.
     */
    var WebWorker = (function () {
        function WebWorker(id, label, onMessageCallback) {
            this.id = id;
            this.worker = new Worker(getWorkerUrl('workerMain.js', label));
            this.worker.onmessage = function (ev) {
                onMessageCallback(ev.data);
            };
        }
        WebWorker.prototype.getId = function () {
            return this.id;
        };
        WebWorker.prototype.postMessage = function (msg) {
            this.worker.postMessage(msg);
        };
        WebWorker.prototype.terminate = function () {
            this.worker.terminate();
        };
        return WebWorker;
    })();
    /**
     * A worker that runs in an iframe and therefore does have its
     * own global scope, but no own thread.
     */
    var FrameWorker = (function () {
        function FrameWorker(id, onMessageCallback) {
            var _this = this;
            this.id = id;
            // Collect all messages sent to the worker until the iframe is loaded
            this.loaded = false;
            this.beforeLoadMessages = [];
            this.iframe = document.createElement('iframe');
            this.iframe.id = this.iframeId();
            this.iframe.src = require.toUrl('./workerMainCompatibility.html');
            this.iframe.frameborder = this.iframe.height = this.iframe.width = '0';
            this.iframe.style.display = 'none';
            dom.addListener(this.iframe, 'load', function () { return _this.onLoaded(); });
            this.onMessage = function (ev) {
                onMessageCallback(ev.data);
            };
            dom.addListener(window, 'message', this.onMessage);
            document.body.appendChild(this.iframe);
        }
        FrameWorker.prototype.iframeId = function () {
            return 'worker_iframe_' + this.id;
        };
        FrameWorker.prototype.onLoaded = function () {
            this.loaded = true;
            while (this.beforeLoadMessages.length > 0) {
                this.postMessage(this.beforeLoadMessages.shift());
            }
        };
        FrameWorker.prototype.getId = function () {
            return this.id;
        };
        FrameWorker.prototype.postMessage = function (msg) {
            if (this.loaded === true) {
                var iframe = window.frames[this.iframeId()];
                if (iframe.postMessage) {
                    iframe.postMessage(msg, '*');
                }
                else {
                    iframe.contentWindow.postMessage(msg, '*');
                }
            }
            else {
                this.beforeLoadMessages.push(msg);
            }
        };
        FrameWorker.prototype.terminate = function () {
            window.removeEventListener('message', this.onMessage);
            window.frames[this.iframeId()].close();
        };
        return FrameWorker;
    })();
    var DefaultWorkerFactory = (function () {
        function DefaultWorkerFactory() {
        }
        DefaultWorkerFactory.prototype.create = function (id, onMessageCallback, onCrashCallback) {
            if (onCrashCallback === void 0) { onCrashCallback = null; }
            var result = null;
            try {
                result = new WebWorker(id, 'service' + id, onMessageCallback);
            }
            catch (e) {
                result = new FrameWorker(id, onMessageCallback);
            }
            return result;
        };
        return DefaultWorkerFactory;
    })();
    exports.DefaultWorkerFactory = DefaultWorkerFactory;
});
//# sourceMappingURL=defaultWorkerFactory.js.map