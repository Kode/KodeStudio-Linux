/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nls = require("vscode-nls");
const path_1 = require("path");
const protocolDetection_1 = require("./protocolDetection");
const processTree_1 = require("./processTree");
const localize = nls.loadMessageBundle(__filename);
const POLL_INTERVAL = 1000;
const pids = [];
let autoAttacher;
function getPidFromSession(session) {
    return new Promise((resolve, e) => {
        setTimeout(_ => {
            // wait a maximum of 100 ms for response
            const timer = setTimeout(_ => {
                resolve(NaN);
            }, 100);
            // try to get the process ID from the debuggee
            if (session) {
                session.customRequest('evaluate', { expression: 'process.pid' }).then(reply => {
                    clearTimeout(timer);
                    resolve(parseInt(reply.result));
                }, e => {
                    clearTimeout(timer);
                    resolve(NaN);
                });
            }
            else {
                clearTimeout(timer);
                resolve(NaN);
            }
        }, session.type === 'node2' ? 500 : 100);
    });
}
exports.getPidFromSession = getPidFromSession;
function initializeAutoAttach(context) {
    context.subscriptions.push(vscode.debug.onDidStartDebugSession(session => {
        if (session.type === 'node' || session.type === 'node2') {
            // try to get pid from newly started node.js debug session
            pids.push(getPidFromSession(session));
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.startAutoAttach', rootPid => {
        if (typeof rootPid === 'number') {
            autoAttacher = pollProcesses(rootPid, true, (pid, cmdPath, args) => {
                const cmdName = path_1.basename(cmdPath, '.exe');
                if (cmdName === 'node') {
                    const name = localize(0, null, pid);
                    attachToProcess(undefined, name, pid, args);
                }
            });
            ;
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.stopAutoAttach', () => {
        if (autoAttacher) {
            autoAttacher.dispose();
            autoAttacher = undefined;
        }
    }));
}
exports.initializeAutoAttach = initializeAutoAttach;
function alreadyAttached(pid) {
    return Promise.all(pids).then(pids => {
        return pids.indexOf(pid) >= 0;
    });
}
function attachToProcess(folder, name, pid, args, baseConfig) {
    alreadyAttached(pid).then(isAttached => {
        if (isAttached) {
            // console.log(`ignore auto attach for ${pid}`);
        }
        else {
            pids.push(Promise.resolve(pid));
            const config = {
                type: 'node',
                request: 'attach',
                name: name,
                stopOnEntry: false,
                __autoAttach: true
            };
            if (baseConfig) {
                // selectively copy attributes
                if (baseConfig.timeout) {
                    config.timeout = baseConfig.timeout;
                }
                if (baseConfig.sourceMaps) {
                    config.sourceMaps = baseConfig.sourceMaps;
                }
                if (baseConfig.outFiles) {
                    config.outFiles = baseConfig.outFiles;
                }
                if (baseConfig.sourceMapPathOverrides) {
                    config.sourceMapPathOverrides = baseConfig.sourceMapPathOverrides;
                }
                if (baseConfig.smartStep) {
                    config.smartStep = baseConfig.smartStep;
                }
                if (baseConfig.skipFiles) {
                    config.skipFiles = baseConfig.skipFiles;
                }
                if (baseConfig.showAsyncStacks) {
                    config.sourceMaps = baseConfig.showAsyncStacks;
                }
                if (baseConfig.trace) {
                    config.trace = baseConfig.trace;
                }
            }
            let { usePort, protocol, port } = protocolDetection_1.analyseArguments(args);
            if (usePort) {
                config.processId = `${protocol}${port}`;
            }
            else {
                if (protocol && port > 0) {
                    config.processId = `${pid}${protocol}${port}`;
                }
                else {
                    config.processId = pid.toString();
                }
            }
            vscode.debug.startDebugging(folder, config);
        }
    });
}
exports.attachToProcess = attachToProcess;
/**
 * Poll for all subprocesses of given root process.
 */
function pollProcesses(rootPid, inTerminal, cb) {
    let stopped = false;
    function poll() {
        //const start = Date.now();
        findChildProcesses(rootPid, inTerminal, cb).then(_ => {
            //console.log(`duration: ${Date.now() - start}`);
            setTimeout(_ => {
                if (!stopped) {
                    poll();
                }
            }, POLL_INTERVAL);
        });
    }
    poll();
    return new vscode.Disposable(() => stopped = true);
}
function findChildProcesses(rootPid, inTerminal, cb) {
    function walker(node, terminal, terminalPids) {
        if (terminalPids.indexOf(node.pid) >= 0) {
            terminal = true; // found the terminal shell
        }
        let { protocol } = protocolDetection_1.analyseArguments(node.args);
        if (terminal && protocol) {
            cb(node.pid, node.command, node.args);
        }
        for (const child of node.children || []) {
            walker(child, terminal, terminalPids);
        }
    }
    return processTree_1.getProcessTree(rootPid).then(tree => {
        if (tree) {
            const terminals = vscode.window.terminals;
            if (terminals.length > 0) {
                Promise.all(terminals.map(terminal => terminal.processId)).then(terminalPids => {
                    walker(tree, !inTerminal, terminalPids);
                });
            }
        }
    });
}

//# sourceMappingURL=../../../out/node/extension/autoAttach.js.map
