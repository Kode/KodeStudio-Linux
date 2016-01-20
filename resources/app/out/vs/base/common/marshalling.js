/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/objects', 'vs/base/common/types'], function (require, exports, objects, types) {
    var marshallingContributions = [];
    function registerMarshallingContribution(contribution) {
        marshallingContributions.push(contribution);
    }
    exports.registerMarshallingContribution = registerMarshallingContribution;
    var currentDynamicContrib = null;
    function canSerialize(obj) {
        for (var _i = 0; _i < marshallingContributions.length; _i++) {
            var contrib = marshallingContributions[_i];
            if (contrib.canSerialize(obj)) {
                return true;
            }
        }
        if (currentDynamicContrib && currentDynamicContrib.canSerialize(obj)) {
            return true;
        }
    }
    exports.canSerialize = canSerialize;
    function serialize(obj) {
        return objects.cloneAndChange(obj, function (orig) {
            if (typeof orig === 'object') {
                for (var i = 0; i < marshallingContributions.length; i++) {
                    var contrib = marshallingContributions[i];
                    if (contrib.canSerialize(orig)) {
                        return contrib.serialize(orig, serialize);
                    }
                }
                if (currentDynamicContrib && currentDynamicContrib.canSerialize(orig)) {
                    return currentDynamicContrib.serialize(orig, serialize);
                }
            }
            return undefined;
        });
    }
    exports.serialize = serialize;
    function deserialize(obj) {
        return objects.cloneAndChange(obj, function (orig) {
            if (types.isObject(orig)) {
                for (var i = 0; i < marshallingContributions.length; i++) {
                    var contrib = marshallingContributions[i];
                    if (contrib.canDeserialize(orig)) {
                        return contrib.deserialize(orig, deserialize);
                    }
                }
                if (currentDynamicContrib && currentDynamicContrib.canDeserialize(orig)) {
                    return currentDynamicContrib.deserialize(orig, deserialize);
                }
            }
            return undefined;
        });
    }
    exports.deserialize = deserialize;
    registerMarshallingContribution({
        canSerialize: function (obj) {
            return obj instanceof RegExp;
        },
        serialize: function (regex, serialize) {
            var flags = '';
            if (regex.global) {
                flags += 'g';
            }
            else if (regex.ignoreCase) {
                flags += 'i';
            }
            else if (regex.multiline) {
                flags += 'm';
            }
            return {
                $isRegExp: true,
                source: regex.source,
                flags: flags
            };
        },
        canDeserialize: function (obj) {
            return obj.$isRegExp;
        },
        deserialize: function (obj, deserialize) {
            return new RegExp(obj.source, obj.flags);
        }
    });
    function marshallObject(obj, dynamicContrib) {
        if (dynamicContrib === void 0) { dynamicContrib = null; }
        currentDynamicContrib = dynamicContrib;
        var r = JSON.stringify(serialize(obj));
        currentDynamicContrib = null;
        return r;
    }
    exports.marshallObject = marshallObject;
    function demarshallObject(serialized, dynamicContrib) {
        if (dynamicContrib === void 0) { dynamicContrib = null; }
        currentDynamicContrib = dynamicContrib;
        var r = deserialize(JSON.parse(serialized));
        currentDynamicContrib = null;
        return r;
    }
    exports.demarshallObject = demarshallObject;
});
//# sourceMappingURL=marshalling.js.map