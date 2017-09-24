/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//tslint:disable
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
let taskProvider;
function activate(_context) {
    if (!vscode.workspace.workspaceFolders) {
        return;
    }
    function onConfigurationChanged() {
        let autoDetect = vscode.workspace.getConfiguration('npm').get('autoDetect');
        if (taskProvider && autoDetect === 'off') {
            taskProvider.dispose();
            taskProvider = undefined;
        }
        else if (!taskProvider && autoDetect === 'on') {
            taskProvider = vscode.workspace.registerTaskProvider('npm', {
                provideTasks: () => {
                    return provideNpmScripts();
                },
                resolveTask(_task) {
                    return undefined;
                }
            });
        }
    }
    vscode.workspace.onDidChangeConfiguration(onConfigurationChanged);
    onConfigurationChanged();
}
exports.activate = activate;
function deactivate() {
    if (taskProvider) {
        taskProvider.dispose();
    }
}
exports.deactivate = deactivate;
function exists(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _reject) => {
            fs.exists(file, (value) => {
                resolve(value);
            });
        });
    });
}
function readFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data.toString());
            });
        });
    });
}
const buildNames = ['build', 'compile', 'watch'];
function isBuildTask(name) {
    for (let buildName of buildNames) {
        if (name.indexOf(buildName) !== -1) {
            return true;
        }
    }
    return false;
}
const testNames = ['test'];
function isTestTask(name) {
    for (let testName of testNames) {
        if (name === testName) {
            return true;
        }
    }
    return false;
}
function isNotPreOrPostScript(script) {
    return !(script.startsWith('pre') || script.startsWith('post'));
}
function provideNpmScripts() {
    return __awaiter(this, void 0, void 0, function* () {
        let emptyTasks = [];
        let allTasks = [];
        let folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            return emptyTasks;
        }
        const isSingleRoot = folders.length === 1;
        for (let i = 0; i < folders.length; i++) {
            let tasks = yield provideNpmScriptsForFolder(folders[i], isSingleRoot);
            allTasks.push(...tasks);
        }
        return allTasks;
    });
}
function provideNpmScriptsForFolder(folder, singleRoot) {
    return __awaiter(this, void 0, void 0, function* () {
        let rootPath = folder.uri.fsPath;
        let emptyTasks = [];
        let packageJson = path.join(rootPath, 'package.json');
        if (!(yield exists(packageJson))) {
            return emptyTasks;
        }
        try {
            var contents = yield readFile(packageJson);
            var json = JSON.parse(contents);
            if (!json.scripts) {
                return emptyTasks;
            }
            const result = [];
            Object.keys(json.scripts).filter(isNotPreOrPostScript).forEach(each => {
                const task = createTask(each, `run ${each}`, rootPath, folder.name, singleRoot);
                const lowerCaseTaskName = each.toLowerCase();
                if (isBuildTask(lowerCaseTaskName)) {
                    task.group = vscode.TaskGroup.Build;
                }
                else if (isTestTask(lowerCaseTaskName)) {
                    task.group = vscode.TaskGroup.Test;
                }
                result.push(task);
            });
            // always add npm install (without a problem matcher)
            result.push(createTask('install', 'install', rootPath, folder.name, singleRoot, []));
            return result;
        }
        catch (e) {
            return emptyTasks;
        }
    });
}
function createTask(script, cmd, rootPath, shortPath, singleRoot, matcher) {
    function getTaskName(script, shortPath, singleRoot) {
        if (singleRoot) {
            return script;
        }
        return `${script} - ${shortPath}`;
    }
    function getNpmCommandLine(cmd) {
        if (vscode.workspace.getConfiguration('npm').get('runSilent')) {
            return `npm --silent ${cmd}`;
        }
        return `npm ${cmd}`;
    }
    let kind = {
        type: 'npm',
        script: script
    };
    let taskName = getTaskName(script, shortPath, singleRoot);
    return new vscode.Task(kind, taskName, 'npm', new vscode.ShellExecution(getNpmCommandLine(cmd), { cwd: rootPath }), matcher);
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/npm/out/main.js.map
