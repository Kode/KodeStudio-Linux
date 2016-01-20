/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/marshalling', 'vs/base/common/remote', 'vs/base/common/errors'], function (require, exports, winjs, marshalling, remote, errors) {
    var pendingRPCReplies = {};
    function createRPC(serializeAndSend) {
        var lastMessageId = 0;
        return function rpc(rpcId, method, args) {
            var req = String(++lastMessageId);
            var reply = {
                c: null,
                e: null,
                p: null
            };
            var r = new winjs.TPromise(function (c, e, p) {
                reply.c = c;
                reply.e = e;
                reply.p = p;
            }, function () {
                serializeAndSend({
                    cancel: req
                });
            });
            pendingRPCReplies[req] = reply;
            serializeAndSend({
                req: req,
                rpcId: rpcId,
                method: method,
                args: args
            });
            return r;
        };
    }
    ;
    function create(send) {
        var rpc = createRPC(serializeAndSend);
        var bigHandler = null;
        var invokedHandlers = Object.create(null);
        var r = {
            callOnRemote: rpc,
            registerBigHandler: function (_bigHandler) {
                bigHandler = _bigHandler;
            },
            handle: function (rawmsg) {
                var msg = marshalling.demarshallObject(rawmsg, proxiesMarshalling);
                if (msg.seq) {
                    if (!pendingRPCReplies.hasOwnProperty(msg.seq)) {
                        console.warn('Got reply to unknown seq');
                        return;
                    }
                    var reply = pendingRPCReplies[msg.seq];
                    delete pendingRPCReplies[msg.seq];
                    if (msg.err) {
                        reply.e(msg.err);
                        return;
                    }
                    reply.c(msg.res);
                    return;
                }
                if (msg.cancel) {
                    if (invokedHandlers[msg.cancel]) {
                        invokedHandlers[msg.cancel].cancel();
                    }
                    return;
                }
                if (msg.err) {
                    console.error(msg.err);
                    return;
                }
                var rpcId = msg.rpcId;
                if (!bigHandler) {
                    throw new Error('got message before big handler attached!');
                }
                var req = msg.req;
                invokedHandlers[req] = invokeHandler(rpcId, msg.method, msg.args);
                invokedHandlers[req].then(function (r) {
                    delete invokedHandlers[req];
                    serializeAndSend({
                        seq: req,
                        res: r
                    });
                }, function (err) {
                    delete invokedHandlers[req];
                    serializeAndSend({
                        seq: req,
                        err: errors.transformErrorForSerialization(err)
                    });
                });
            }
        };
        var proxiesMarshalling = new remote.ProxiesMarshallingContribution(r);
        function serializeAndSend(msg) {
            send(marshalling.marshallObject(msg, proxiesMarshalling));
        }
        function invokeHandler(rpcId, method, args) {
            try {
                return winjs.TPromise.as(bigHandler.handle(rpcId, method, args));
            }
            catch (err) {
                return winjs.TPromise.wrapError(err);
            }
        }
        return r;
    }
    exports.create = create;
    ;
});
//# sourceMappingURL=ipcRemoteCom.js.map