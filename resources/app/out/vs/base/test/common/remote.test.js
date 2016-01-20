/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/marshalling', 'vs/base/common/remote', 'vs/base/common/winjs.base'], function (require, exports, assert, marshalling_1, remote_1, winjs_base_1) {
    suite('Remote', function () {
        test('bug #17587:[plugin] Language plugin can\'t define a TokenTypeClassificationSupport#wordDefinition', function () {
            var contrib = new remote_1.ProxiesMarshallingContribution({
                callOnRemote: function () { return winjs_base_1.TPromise.as(true); }
            });
            var initial = {
                $__CREATE__PROXY__REQUEST: 'myId',
                member: /test/g
            };
            var transported = marshalling_1.demarshallObject(marshalling_1.marshallObject(initial, contrib), contrib);
            assert.equal(transported.$__IS_REMOTE_OBJ, true);
            assert(transported.member instanceof RegExp);
            assert.equal(transported.member.source, 'test');
            assert.equal(transported.member.global, true);
            assert.equal(transported.member.ignoreCase, false);
            assert.equal(transported.member.multiline, false);
        });
    });
});
//# sourceMappingURL=remote.test.js.map