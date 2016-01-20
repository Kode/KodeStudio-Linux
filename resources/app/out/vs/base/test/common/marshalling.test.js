/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/marshalling'], function (require, exports, assert, marshalling_1) {
    var ObjWithRegExp = (function () {
        function ObjWithRegExp(something) {
            this.member = something;
        }
        return ObjWithRegExp;
    })();
    suite('Marshalling', function () {
        test('bug #17587:[plugin] Language plugin can\'t define a TokenTypeClassificationSupport#wordDefinition', function () {
            var simpleMarshallingContrib = {
                canSerialize: function (obj) {
                    return obj instanceof ObjWithRegExp;
                },
                serialize: function (obj, serialize) {
                    return {
                        $ObjWithRegExp: true,
                        member: serialize(obj.member)
                    };
                },
                canDeserialize: function (obj) {
                    return (obj.$ObjWithRegExp === true);
                },
                deserialize: function (obj, deserialize) {
                    return new ObjWithRegExp(deserialize(obj.member));
                }
            };
            var initial = new ObjWithRegExp(/test/g);
            var transported = marshalling_1.demarshallObject(marshalling_1.marshallObject(initial, simpleMarshallingContrib), simpleMarshallingContrib);
            assert(transported instanceof ObjWithRegExp);
            assert(transported.member instanceof RegExp);
            assert.equal(transported.member.source, 'test');
            assert.equal(transported.member.global, true);
            assert.equal(transported.member.ignoreCase, false);
            assert.equal(transported.member.multiline, false);
        });
    });
});
//# sourceMappingURL=marshalling.test.js.map