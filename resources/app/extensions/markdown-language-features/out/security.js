"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
class ExtensionContentSecurityPolicyArbiter {
    constructor(globalState, workspaceState) {
        this.globalState = globalState;
        this.workspaceState = workspaceState;
        this.old_trusted_workspace_key = 'trusted_preview_workspace:';
        this.security_level_key = 'preview_security_level:';
        this.should_disable_security_warning_key = 'preview_should_show_security_warning:';
    }
    getSecurityLevelForResource(resource) {
        // Use new security level setting first
        const level = this.globalState.get(this.security_level_key + this.getRoot(resource), undefined);
        if (typeof level !== 'undefined') {
            return level;
        }
        // Fallback to old trusted workspace setting
        if (this.globalState.get(this.old_trusted_workspace_key + this.getRoot(resource), false)) {
            return 2 /* AllowScriptsAndAllContent */;
        }
        return 0 /* Strict */;
    }
    setSecurityLevelForResource(resource, level) {
        return this.globalState.update(this.security_level_key + this.getRoot(resource), level);
    }
    shouldAllowSvgsForResource(resource) {
        const securityLevel = this.getSecurityLevelForResource(resource);
        return securityLevel === 1 /* AllowInsecureContent */ || securityLevel === 2 /* AllowScriptsAndAllContent */;
    }
    shouldDisableSecurityWarnings() {
        return this.workspaceState.get(this.should_disable_security_warning_key, false);
    }
    setShouldDisableSecurityWarning(disabled) {
        return this.workspaceState.update(this.should_disable_security_warning_key, disabled);
    }
    getRoot(resource) {
        if (vscode.workspace.workspaceFolders) {
            const folderForResource = vscode.workspace.getWorkspaceFolder(resource);
            if (folderForResource) {
                return folderForResource.uri;
            }
            if (vscode.workspace.workspaceFolders.length) {
                return vscode.workspace.workspaceFolders[0].uri;
            }
        }
        return resource;
    }
}
exports.ExtensionContentSecurityPolicyArbiter = ExtensionContentSecurityPolicyArbiter;
class PreviewSecuritySelector {
    constructor(cspArbiter, webviewManager) {
        this.cspArbiter = cspArbiter;
        this.webviewManager = webviewManager;
    }
    async showSecutitySelectorForResource(resource) {
        function markActiveWhen(when) {
            return when ? '• ' : '';
        }
        const currentSecurityLevel = this.cspArbiter.getSecurityLevelForResource(resource);
        const selection = await vscode.window.showQuickPick([
            {
                type: 0 /* Strict */,
                label: markActiveWhen(currentSecurityLevel === 0 /* Strict */) + localize(0, null),
                description: localize(1, null),
            }, {
                type: 3 /* AllowInsecureLocalContent */,
                label: markActiveWhen(currentSecurityLevel === 3 /* AllowInsecureLocalContent */) + localize(2, null),
                description: localize(3, null),
            }, {
                type: 1 /* AllowInsecureContent */,
                label: markActiveWhen(currentSecurityLevel === 1 /* AllowInsecureContent */) + localize(4, null),
                description: localize(5, null),
            }, {
                type: 2 /* AllowScriptsAndAllContent */,
                label: markActiveWhen(currentSecurityLevel === 2 /* AllowScriptsAndAllContent */) + localize(6, null),
                description: localize(7, null),
            }, {
                type: 'moreinfo',
                label: localize(8, null),
                description: ''
            }, {
                type: 'toggle',
                label: this.cspArbiter.shouldDisableSecurityWarnings()
                    ? localize(9, null)
                    : localize(10, null),
                description: localize(11, null)
            },
        ], {
            placeHolder: localize(12, null),
        });
        if (!selection) {
            return;
        }
        if (selection.type === 'moreinfo') {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://go.microsoft.com/fwlink/?linkid=854414'));
            return;
        }
        if (selection.type === 'toggle') {
            this.cspArbiter.setShouldDisableSecurityWarning(!this.cspArbiter.shouldDisableSecurityWarnings());
            return;
        }
        else {
            await this.cspArbiter.setSecurityLevelForResource(resource, selection.type);
        }
        this.webviewManager.refresh();
    }
}
exports.PreviewSecuritySelector = PreviewSecuritySelector;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/b4f62a65292c32b44a9c2ab7739390fd05d4df2a/extensions/markdown-language-features/out/security.js.map
