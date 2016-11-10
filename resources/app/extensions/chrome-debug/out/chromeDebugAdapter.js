/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
const vscode_chrome_debug_core_1 = require('vscode-chrome-debug-core');
const child_process_1 = require('child_process');
const utils = require('./utils');
const path = require('path');
const DefaultWebSourceMapPathOverrides = {
    'webpack:///./*': '${webRoot}/*',
    'webpack:///*': '*',
    'meteor://💻app/*': '${webRoot}/*',
};
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
                target: 'debug-html5',
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
                watch: false
            };
            return require(path.join(args.kha, 'Tools/khamake/out/main.js')).run(options, {
                info: message => {
                    vscode_chrome_debug_core_1.logger.log(message, true);
                }, error: message => {
                    vscode_chrome_debug_core_1.logger.error(message, true);
                }
            }).then((value) => {
                // Use vscode's electron
                const chromePath = args.runtimeExecutable;
                let chromeDir = chromePath;
                if (chromePath.lastIndexOf('/') >= 0) {
                    chromeDir = chromePath.substring(0, chromePath.lastIndexOf('/'));
                }
                else if (chromePath.lastIndexOf('\\') >= 0) {
                    chromeDir = chromePath.substring(0, chromePath.lastIndexOf('\\'));
                }
                // Use custom electron
                // const chromeDir = path.join(__dirname, '..', '..', '..', 'node_modules', 'electron', 'dist');
                // let chromePath = chromeDir;
                // if (process.platform === 'win32') chromePath = path.join(chromePath, 'electron.exe');
                // else if (process.platform === 'darwin') chromePath = path.join(chromePath, 'Electron.app', 'Contents', 'MacOS', 'Electron');
                // else chromePath = path.join(chromePath, 'electron');
                // Start with remote debugging enabled
                const port = args.port || Math.floor((Math.random() * 10000) + 10000);
                const chromeArgs = ['--chromedebug', '--remote-debugging-port=' + port];
                chromeArgs.push(path.resolve(args.cwd, args.file));
                let launchUrl;
                if (args.file) {
                    launchUrl = vscode_chrome_debug_core_1.utils.pathToFileURL(path.join(args.cwd, args.file, 'index.html'));
                }
                else if (args.url) {
                    launchUrl = args.url;
                }
                if (launchUrl) {
                    chromeArgs.push(launchUrl);
                }
                vscode_chrome_debug_core_1.logger.log(`spawn('${chromePath}', ${JSON.stringify(chromeArgs)})`);
                this._chromeProc = child_process_1.spawn(chromePath, chromeArgs, {
                    detached: true,
                    stdio: ['ignore'],
                    cwd: chromeDir
                });
                this._chromeProc.unref();
                this._chromeProc.on('error', (err) => {
                    const errMsg = 'Chrome error: ' + err;
                    vscode_chrome_debug_core_1.logger.error(errMsg);
                    this.terminateSession(errMsg);
                });
                return this.doAttach(port, launchUrl, args.address);
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
            // Don't return this promise, a failure shouldn't fail attach
            this.globalEvaluate({ expression: 'navigator.userAgent', silent: true })
                .then(evalResponse => vscode_chrome_debug_core_1.logger.log('Target userAgent: ' + evalResponse.result.value), err => vscode_chrome_debug_core_1.logger.log('Getting userAgent failed: ' + err.message));
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
}
ChromeDebugAdapter.PAGE_PAUSE_MESSAGE = 'Paused in Kode Studio';
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
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/e0006c407164ee12f30cc86dcc2562a8638862d7/extensions/chrome-debug/out/chromeDebugAdapter.js.map
