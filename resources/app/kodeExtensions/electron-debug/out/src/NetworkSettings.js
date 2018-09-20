"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class NetworkSettings {
    constructor(proxy, strictSSL) {
        this.proxy = proxy;
        this.strictSSL = strictSSL;
    }
}
exports.default = NetworkSettings;
function vscodeNetworkSettingsProvider(vsCode) {
    return () => {
        const config = vsCode.workspace.getConfiguration();
        const proxy = config.get('http.proxy');
        const strictSSL = config.get('http.proxyStrictSSL', true);
        return new NetworkSettings(proxy, strictSSL);
    };
}
exports.vscodeNetworkSettingsProvider = vscodeNetworkSettingsProvider;

//# sourceMappingURL=NetworkSettings.js.map
