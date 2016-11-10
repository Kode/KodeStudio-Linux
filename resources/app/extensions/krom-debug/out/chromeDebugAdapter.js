/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
const vscode_chrome_debug_core_1 = require('vscode-chrome-debug-core');
const child_process_1 = require('child_process');
const utils = require('./utils');
const os = require('os');
const path = require('path');
const DefaultWebSourceMapPathOverrides = {
    'webpack:///./*': '${webRoot}/*',
    'webpack:///*': '*',
    'meteor://💻app/*': '${webRoot}/*',
};
function osDir() {
    if (os.platform() === 'darwin') {
        return path.join('macos', 'Krom.app', 'Contents', 'MacOS');
    }
    else if (os.platform() === 'win32') {
        return 'win32';
    }
    else {
        return 'linux';
    }
}
function osExt() {
    if (os.platform() === 'darwin') {
        return '';
    }
    else if (os.platform() === 'win32') {
        return '.exe';
    }
    else {
        return '';
    }
}
class ChromeDebugAdapter extends vscode_chrome_debug_core_1.ChromeDebugAdapter {
    initialize(args) {
        this._overlayHelper = new utils.DebounceHelper(/*timeoutMs=*/ 200);
        return super.initialize(args);
    }
    launch(args) {
        args.sourceMapPathOverrides = getSourceMapPathOverrides(args.webRoot, args.sourceMapPathOverrides);
        return super.launch(args).then(() => {
            vscode_chrome_debug_core_1.logger.log('Using Kha from ' + args.kha + '\n', true);
            let options = {
                from: args.cwd,
                to: path.join(args.cwd, 'build'),
                projectfile: 'khafile.js',
                target: 'krom',
                vr: 'none',
                pch: false,
                intermediate: '',
                graphics: 'direct3d9',
                visualstudio: 'vs2015',
                kha: '',
                haxe: '',
                ogg: '',
                aac: '',
                mp3: '',
                h264: '',
                webm: '',
                wmv: '',
                theora: '',
                kfx: '',
                krafix: '',
                ffmpeg: args.ffmpeg,
                nokrafix: false,
                embedflashassets: false,
                compile: false,
                run: false,
                init: false,
                name: 'Project',
                server: false,
                port: 8080,
                debug: false,
                silent: false,
                watch: true
            };
            require(path.join(args.kha, 'Tools/khamake/out/main.js')).run(options, {
                info: message => {
                    vscode_chrome_debug_core_1.logger.log(message, true);
                }, error: message => {
                    vscode_chrome_debug_core_1.logger.error(message, true);
                }
            }).then((value) => {
                // Check exists?
                const kromPath = path.join(args.krom, osDir(), 'Krom' + osExt());
                if (!kromPath) {
                    return vscode_chrome_debug_core_1.utils.errP(`Can't find Krom.`);
                }
                // Start with remote debugging enabled
                const port = args.port || 9224;
                const kromArgs = [path.join(args.cwd, 'build', 'krom'), path.join(args.cwd, 'build', 'krom-resources')];
                vscode_chrome_debug_core_1.logger.log(`spawn('${kromPath}', ${JSON.stringify(kromArgs)})`);
                this._chromeProc = child_process_1.spawn(kromPath, kromArgs, {
                    detached: true,
                    stdio: ['ignore'],
                    cwd: path.join(args.krom, osDir())
                });
                this._chromeProc.unref();
                this._chromeProc.on('error', (err) => {
                    const errMsg = 'Krom error: ' + err;
                    vscode_chrome_debug_core_1.logger.error(errMsg);
                    this.terminateSession(errMsg);
                });
                /*return new Promise<void>((resolve, reject) => {
                    resolve();
                });*/
                return this.doAttach(port, 'http://krom', args.address);
            }, (reason) => {
                vscode_chrome_debug_core_1.logger.error('Launch canceled.', true);
                return new Promise((resolve) => {
                });
            });
        });
    }
    attach(args) {
        args.sourceMapPathOverrides = getSourceMapPathOverrides(args.webRoot, args.sourceMapPathOverrides);
        return super.attach(args);
    }
    doAttach(port, targetUrl, address, timeout) {
        return super.doAttach(port, targetUrl, address, timeout).then(() => {
            // this.runScript();
        });
    }
    onPaused(notification) {
        this._overlayHelper.doAndCancel(() => this.chrome.Page.configureOverlay({ message: ChromeDebugAdapter.PAGE_PAUSE_MESSAGE }).catch(() => { }));
        super.onPaused(notification);
    }
    onResumed() {
        this._overlayHelper.wait(() => this.chrome.Page.configureOverlay({}).catch(() => { }));
        super.onResumed();
    }
    disconnect() {
        if (this._chromeProc) {
            this._chromeProc.kill('SIGINT');
            this._chromeProc = null;
        }
        return super.disconnect();
    }
    runScript() {
        let promise = this.chrome.Runtime.compileScript({ expression: 'let i = 4;\n while (true) {\n	let a = 3;\n	++a;\n	++i;\n }\n', sourceURL: 'test.js', persistScript: true, executionContextId: 1 });
        promise.then(response => {
            this.chrome.Runtime.runScript({ scriptId: response.scriptId, executionContextId: 1 });
        });
    }
}
ChromeDebugAdapter.PAGE_PAUSE_MESSAGE = 'Paused in Visual Studio Code';
exports.ChromeDebugAdapter = ChromeDebugAdapter;
function getSourceMapPathOverrides(webRoot, sourceMapPathOverrides) {
    return sourceMapPathOverrides ? resolveWebRootPattern(webRoot, sourceMapPathOverrides, /*warnOnMissing=*/ true) :
        resolveWebRootPattern(webRoot, DefaultWebSourceMapPathOverrides, /*warnOnMissing=*/ false);
}
/**
 * Returns a copy of sourceMapPathOverrides with the ${webRoot} pattern resolved in all entries.
 */
function resolveWebRootPattern(webRoot, sourceMapPathOverrides, warnOnMissing) {
    const resolvedOverrides = {};
    for (let pattern in sourceMapPathOverrides) {
        const replacePattern = sourceMapPathOverrides[pattern];
        resolvedOverrides[pattern] = replacePattern;
        const webRootIndex = replacePattern.indexOf('${webRoot}');
        if (webRootIndex === 0) {
            if (webRoot) {
                resolvedOverrides[pattern] = replacePattern.replace('${webRoot}', webRoot);
            }
            else if (warnOnMissing) {
                vscode_chrome_debug_core_1.logger.log('Warning: sourceMapPathOverrides entry contains ${webRoot}, but webRoot is not set');
            }
        }
        else if (webRootIndex > 0) {
            vscode_chrome_debug_core_1.logger.log('Warning: in a sourceMapPathOverrides entry, ${webRoot} is only valid at the beginning of the path');
        }
    }
    return resolvedOverrides;
}
exports.resolveWebRootPattern = resolveWebRootPattern;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/e0006c407164ee12f30cc86dcc2562a8638862d7/extensions/krom-debug/out/chromeDebugAdapter.js.map
