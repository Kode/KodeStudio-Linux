'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const kromDebug_1 = require("./kromDebug");
const Net = require("net");
/*
 * Set the following compile time flag to true if the
 * debug adapter should run inside the extension host.
 * Please note: the test suite does no longer work in this mode.
 */
const EMBED_DEBUG_ADAPTER = false;
function activate(context) {
    const provider = new MockConfigurationProvider();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('krom', provider));
    context.subscriptions.push(provider);
}
exports.activate = activate;
function deactivate() {
    // nothing to do
}
exports.deactivate = deactivate;
class MockConfigurationProvider {
    /**
     * Message a debug configuration just before a debug session is being launched,
     * e.g. add all missing attributes to the debug configuration.
     */
    resolveDebugConfiguration(folder, config, token) {
        // if launch.json is missing or empty
        if (!config.type && !config.request && !config.name) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'markdown') {
                config.type = 'mock';
                config.name = 'Launch';
                config.request = 'launch';
                config.program = '${file}';
                config.stopOnEntry = true;
            }
        }
        if (folder) {
            config.projectDir = folder.uri.fsPath;
        }
        let kromExtension = vscode.extensions.getExtension('kodetech.krom');
        if (kromExtension) {
            config.kromDir = kromExtension.exports.findKrom();
        }
        if (EMBED_DEBUG_ADAPTER) {
            // start port listener on launch of first debug session
            if (!this._server) {
                // start listening on a random port
                this._server = Net.createServer(socket => {
                    const session = new kromDebug_1.KromDebugSession();
                    session.setRunAsServer(true);
                    session.start(socket, socket);
                }).listen(0);
            }
            // make VS Code connect to debug server instead of launching debug adapter
            config.debugServer = this._server.address().port;
        }
        return config;
    }
    dispose() {
        if (this._server) {
            this._server.close();
        }
    }
}
//# sourceMappingURL=extension.js.map