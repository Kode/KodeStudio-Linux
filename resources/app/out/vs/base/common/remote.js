/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function createProxyFromCtor(remote, id, ctor) {
        var result = {
            $__IS_REMOTE_OBJ: true
        };
        for (var prop in ctor.prototype) {
            if (typeof ctor.prototype[prop] === 'function') {
                result[prop] = createMethodProxy(remote, id, prop);
            }
        }
        return result;
    }
    exports.createProxyFromCtor = createProxyFromCtor;
    function createMethodProxy(remote, proxyId, path) {
        return function () {
            var myArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                myArgs[_i - 0] = arguments[_i];
            }
            return remote.callOnRemote(proxyId, path, myArgs);
        };
    }
    var ProxiesMarshallingContribution = (function () {
        function ProxiesMarshallingContribution(remoteCom) {
            this._remoteCom = remoteCom;
        }
        ProxiesMarshallingContribution.prototype.canSerialize = function (obj) {
            return (typeof obj.$__CREATE__PROXY__REQUEST === 'string');
        };
        ProxiesMarshallingContribution.prototype.serialize = function (obj, serialize) {
            var desc = {
                methods: [],
                props: {}
            };
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (typeof obj[key] === 'function') {
                    desc.methods.push(key);
                }
                else {
                    desc.props[key] = serialize(obj[key]);
                }
            }
            return {
                $isProxyDescriptor: true,
                proxyId: obj.$__CREATE__PROXY__REQUEST,
                desc: desc
            };
        };
        ProxiesMarshallingContribution.prototype.canDeserialize = function (obj) {
            return obj.$isProxyDescriptor === true;
        };
        ProxiesMarshallingContribution.prototype.deserialize = function (obj, deserialize) {
            // this is an object
            var result = {
                $__IS_REMOTE_OBJ: true
            };
            var methods = obj.desc.methods;
            for (var i = 0; i < methods.length; i++) {
                result[methods[i]] = createMethodProxy(this._remoteCom, obj.proxyId, methods[i]);
            }
            var props = obj.desc.props;
            for (var prop in props) {
                if (hasOwnProperty.call(props, prop)) {
                    result[prop] = deserialize(props[prop]);
                }
            }
            return result;
        };
        return ProxiesMarshallingContribution;
    })();
    exports.ProxiesMarshallingContribution = ProxiesMarshallingContribution;
});
//# sourceMappingURL=remote.js.map