/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nls = require("vscode-nls");
const autoAttach_1 = require("./autoAttach");
const processTree_1 = require("./processTree");
const protocolDetection_1 = require("./protocolDetection");
const localize = nls.loadMessageBundle(__filename);
const POLL_INTERVAL = 1000;
class Cluster {
    constructor(_folder, _config) {
        this._folder = _folder;
        this._config = _config;
        this._subProcesses = new Set();
        this._childCounter = 1;
    }
    static prepareAutoAttachChildProcesses(folder, config) {
        this.clusters.set(config.name, new Cluster(folder, config));
    }
    static startSession(session) {
        const cluster = this.clusters.get(session.name);
        if (cluster) {
            cluster.startWatching(session);
        }
    }
    static stopSession(session) {
        const cluster = this.clusters.get(session.name);
        if (cluster) {
            cluster.stopWatching();
            this.clusters.delete(session.name);
        }
    }
    startWatching(session) {
        // get the process ID from the leader debuggee
        autoAttach_1.getPidFromSession(session).then(leaderPid => {
            // start polling for child processes under the leader
            this._poller = pollProcesses(leaderPid, false, (pid, cmd, args) => {
                // only attach to new child processes
                if (!this._subProcesses.has(pid)) {
                    this._subProcesses.add(pid);
                    const name = localize(0, null, this._config.name, this._childCounter++);
                    autoAttach_1.attachToProcess(this._folder, name, pid, args, this._config);
                }
            });
        });
    }
    stopWatching() {
        if (this._poller) {
            this._poller.dispose();
            this._poller = undefined;
        }
    }
}
Cluster.clusters = new Map();
exports.Cluster = Cluster;
/**
 * Poll for all subprocesses of given root process.
 */
function pollProcesses(rootPid, inTerminal, cb) {
    let stopped = false;
    function poll() {
        //const start = Date.now();
        findChildProcesses(rootPid, cb).then(_ => {
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
function findChildProcesses(rootPid, cb) {
    function walker(node) {
        if (node.pid !== rootPid) {
            let { protocol } = protocolDetection_1.analyseArguments(node.args);
            if (protocol) {
                cb(node.pid, node.command, node.args);
            }
        }
        for (const child of node.children || []) {
            walker(child);
        }
    }
    return processTree_1.getProcessTree(rootPid).then(tree => {
        if (tree) {
            walker(tree);
        }
    });
}

//# sourceMappingURL=../../../out/node/extension/cluster.js.map
