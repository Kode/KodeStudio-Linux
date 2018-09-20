"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const ElectronExtDownloader_1 = require("./ElectronExtDownloader");
const platform_1 = require("./platform");
const NetworkSettings_1 = require("./NetworkSettings");
const util = require("./common");
const vscode = require("vscode");
const Core = require("vscode-chrome-debug-core");
const utils_1 = require("./utils");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const extensionId = 'kodetech.electron-debug';
        const extension = vscode.extensions.getExtension(extensionId);
        util.setExtensionPath(extension.extensionPath);
        let platformInfo;
        try {
            platformInfo = yield platform_1.PlatformInformation.GetCurrent();
        }
        catch (error) {
            // eventStream.post(new ActivationFailure());
        }
        let networkSettingsProvider = NetworkSettings_1.vscodeNetworkSettingsProvider(vscode);
        if (!vscode.env.appName.includes('Kode')) {
            yield ensureRuntimeDependencies(extension, platformInfo, networkSettingsProvider);
        }
        context.subscriptions.push(vscode.commands.registerCommand('extension.electron-debug.toggleSkippingFile', toggleSkippingFile));
        context.subscriptions.push(vscode.commands.registerCommand('extension.electron-debug.toggleSmartStep', toggleSmartStep));
        context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('electron', new ChromeConfigurationProvider()));
    });
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
const DEFAULT_CONFIG = {
    type: 'electron',
    request: 'launch',
    name: localize('chrome.launch.name', 'Launch Electron against the workspace'),
    appDir: '${workspaceFolder}'
};
class ChromeConfigurationProvider {
    provideDebugConfigurations(folder, token) {
        return Promise.resolve([DEFAULT_CONFIG]);
    }
    /**
     * Try to add all missing attributes to the debug configuration being launched.
     */
    resolveDebugConfiguration(folder, config, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // if launch.json is missing or empty
            if (!config.type && !config.request && !config.name) {
                // Return null so it will create a launch.json and fall back on provideDebugConfigurations - better to point the user towards the config
                // than try to work automagically.
                return null;
            }
            if (config.request === 'attach') {
                const discovery = new Core.chromeTargetDiscoveryStrategy.ChromeTargetDiscovery(new Core.NullLogger(), new Core.telemetry.NullTelemetryReporter());
                let targets;
                try {
                    targets = yield discovery.getAllTargets(config.address || '127.0.0.1', config.port, utils_1.targetFilter, config.url || config.urlFilter);
                }
                catch (e) {
                    // Target not running?
                }
                if (targets && targets.length > 1) {
                    const selectedTarget = yield pickTarget(targets);
                    if (!selectedTarget) {
                        // Quickpick canceled, bail
                        return null;
                    }
                    config.websocketUrl = selectedTarget.websocketDebuggerUrl;
                }
            }
            if (vscode.env.appName.includes('Kode')) {
                let exec = process.execPath;
                if (exec.indexOf('Kode Studio Helper') >= 0) {
                    const dir = exec.substring(0, exec.lastIndexOf('/'));
                    exec = path_1.join(dir, '..', '..', '..', '..', 'MacOS', 'Electron');
                }
                config.electronPath = exec;
            }
            else {
                const electronDir = path_1.join(vscode.extensions.getExtension('kodetech.electron-debug').extensionPath, '.electron', '2.0.2');
                if (process.platform === 'darwin') {
                    config.electronPath = path_1.join(electronDir, 'Electron.app', 'Contents', 'MacOS', 'Electron');
                }
                else if (process.platform === 'win32') {
                    config.electronPath = path_1.join(electronDir, 'electron.exe');
                }
                else {
                    config.electronPath = path_1.join(electronDir, 'electron');
                }
            }
            return config;
        });
    }
}
exports.ChromeConfigurationProvider = ChromeConfigurationProvider;
function toggleSkippingFile(path) {
    if (!path) {
        const activeEditor = vscode.window.activeTextEditor;
        path = activeEditor && activeEditor.document.fileName;
    }
    if (path && vscode.debug.activeDebugSession) {
        const args = typeof path === 'string' ? { path } : { sourceReference: path };
        vscode.debug.activeDebugSession.customRequest('toggleSkipFileStatus', args);
    }
}
function toggleSmartStep() {
    if (vscode.debug.activeDebugSession) {
        vscode.debug.activeDebugSession.customRequest('toggleSmartStep');
    }
}
function pickTarget(targets) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = targets.map(target => ({
            label: unescapeTargetTitle(target.title),
            detail: target.url,
            websocketDebuggerUrl: target.webSocketDebuggerUrl
        }));
        const placeHolder = localize('chrome.targets.placeholder', 'Select a tab');
        const selected = yield vscode.window.showQuickPick(items, { placeHolder, matchOnDescription: true, matchOnDetail: true });
        return selected;
    });
}
function unescapeTargetTitle(title) {
    return title
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, `'`)
        .replace(/&quot;/g, '"');
}
function ensureRuntimeDependencies(extension, platformInfo, networkSettingsProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        return util.installFileExists(util.InstallFileType.Lock)
            .then(exists => {
            if (!exists) {
                const downloader = new ElectronExtDownloader_1.ElectronExtDownloader(networkSettingsProvider, extension.packageJSON, platformInfo);
                return downloader.installRuntimeDependencies();
            }
            else {
                return true;
            }
        });
    });
}

//# sourceMappingURL=extension.js.map
