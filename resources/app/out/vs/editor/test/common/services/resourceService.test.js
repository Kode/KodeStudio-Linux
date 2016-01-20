/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/uri', 'vs/editor/common/services/resourceServiceImpl', 'vs/editor/common/model/mirrorModel', 'vs/editor/common/services/resourceService'], function (require, exports, assert, uri_1, Service, MirrorModel, resourceService) {
    suite('Editor Services - ResourceService', function () {
        test('insert, remove, all', function () {
            var service = new Service.ResourceService();
            service.insert(uri_1.default.parse('test://1'), MirrorModel.createMirrorModelFromString(null, 1, 'hi', null));
            assert.equal(service.all().length, 1);
            service.insert(uri_1.default.parse('test://2'), MirrorModel.createMirrorModelFromString(null, 1, 'hi', null));
            assert.equal(service.all().length, 2);
            assert.ok(service.contains(uri_1.default.parse('test://1')));
            assert.ok(service.contains(uri_1.default.parse('test://2')));
            service.remove(uri_1.default.parse('test://1'));
            service.remove(uri_1.default.parse('test://1'));
            service.remove(uri_1.default.parse('test://2'));
            assert.equal(service.all().length, 0);
        });
        test('event - add, remove', function () {
            var eventCnt = 0;
            var url = uri_1.default.parse('far');
            var element = MirrorModel.createMirrorModelFromString(null, 1, 'hi', null);
            var service = new Service.ResourceService();
            service.addListener(resourceService.ResourceEvents.ADDED, function () {
                eventCnt++;
                assert.ok(true);
            });
            service.addListener(resourceService.ResourceEvents.REMOVED, function () {
                eventCnt++;
                assert.ok(true);
            });
            service.insert(url, element);
            service.remove(url);
            assert.equal(eventCnt, 2, 'events');
        });
        test('event - propagation', function () {
            var eventCnt = 0;
            var url = uri_1.default.parse('far');
            var element = MirrorModel.createMirrorModelFromString(null, 1, 'hi', null);
            var event = {};
            var service = new Service.ResourceService();
            service.insert(url, element);
            service.addBulkListener(function (events) {
                eventCnt++;
                assert.equal(events.length, 1);
                assert.equal(events[0].getData().originalEvents.length, 1);
                assert.ok(events[0].getData().originalEvents[0].getData() === event);
            });
            element.emit('changed', event);
            assert.equal(eventCnt, 1, 'events');
        });
    });
});
//# sourceMappingURL=resourceService.test.js.map