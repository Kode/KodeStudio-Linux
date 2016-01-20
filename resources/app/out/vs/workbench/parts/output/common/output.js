/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/platform/platform', 'vs/platform/instantiation/common/instantiation'], function (require, exports, platform_1, instantiation_1) {
    /**
     * Mime type used by the output editor.
     */
    exports.OUTPUT_MIME = 'text/x-monaco-output';
    /**
     * Id used by the output editor.
     */
    exports.OUTPUT_MODE_ID = 'Log';
    /**
     * Output editor input id.
     */
    exports.OUTPUT_EDITOR_INPUT_ID = 'vs.output';
    /**
     * Output from any not defined channel is here
     */
    exports.DEFAULT_OUTPUT_CHANNEL = '';
    exports.Extensions = {
        OutputChannels: 'workbench.contributions.outputChannels'
    };
    exports.OUTPUT_SERVICE_ID = 'outputService';
    exports.IOutputService = instantiation_1.createDecorator(exports.OUTPUT_SERVICE_ID);
    var OutputChannelRegistry = (function () {
        function OutputChannelRegistry() {
            this.channels = [];
        }
        OutputChannelRegistry.prototype.registerChannel = function (name) {
            if (this.channels.indexOf(name) === -1) {
                this.channels.push(name);
            }
        };
        OutputChannelRegistry.prototype.getChannels = function () {
            return this.channels.slice(0);
        };
        return OutputChannelRegistry;
    })();
    platform_1.Registry.add(exports.Extensions.OutputChannels, new OutputChannelRegistry());
});
//# sourceMappingURL=output.js.map