/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/workbench/parts/telemetry/node/nodeAppInsightsTelemetryAppender'], function (require, exports, assert, nodeAppInsightsTelemetryAppender_1) {
    var AppInsightsMock = (function () {
        function AppInsightsMock() {
            this.events = [];
            this.IsTrackingPageView = false;
            this.exceptions = [];
        }
        AppInsightsMock.prototype.trackEvent = function (eventName, properties, measurements) {
            this.events.push({
                eventName: eventName,
                properties: properties,
                measurements: measurements
            });
        };
        AppInsightsMock.prototype.trackPageView = function () {
            this.IsTrackingPageView = true;
        };
        AppInsightsMock.prototype.trackException = function (exception) {
            this.exceptions.push(exception);
        };
        return AppInsightsMock;
    })();
    var ContextServiceMock = (function () {
        function ContextServiceMock(key, asimovKey) {
            this.key = key;
            this.asimovKey = asimovKey;
        }
        ContextServiceMock.prototype.getConfiguration = function () {
            return {
                env: {
                    aiConfig: {
                        key: this.key,
                        asimovKey: this.asimovKey
                    }
                }
            };
        };
        return ContextServiceMock;
    })();
    suite('Telemetry - AppInsightsTelemetryAppender', function () {
        var appInsightsMock;
        var appender;
        setup(function () {
            appInsightsMock = new AppInsightsMock();
            appender = new nodeAppInsightsTelemetryAppender_1.NodeAppInsightsTelemetryAppender(null, new ContextServiceMock('123'), appInsightsMock);
        });
        teardown(function () {
            appender.dispose();
        });
        test('Simple event', function () {
            appender.log('testEvent');
            assert.equal(appInsightsMock.events.length, 1);
            assert.equal(appInsightsMock.events[0].eventName, nodeAppInsightsTelemetryAppender_1.NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX + 'testEvent');
        });
        test('Track UnhandledError as exception and events', function () {
            var sampleError = new Error('test');
            appender.log('UnhandledError', sampleError);
            assert.equal(appInsightsMock.events.length, 1);
            assert.equal(appInsightsMock.events[0].eventName, nodeAppInsightsTelemetryAppender_1.NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX + 'UnhandledError');
            assert.equal(appInsightsMock.exceptions.length, 1);
        });
        test('property limits', function () {
            var reallyLongPropertyName = 'abcdefghijklmnopqrstuvwxyz';
            for (var i = 0; i < 6; i++) {
                reallyLongPropertyName += 'abcdefghijklmnopqrstuvwxyz';
            }
            assert(reallyLongPropertyName.length > 150);
            var reallyLongPropertyValue = 'abcdefghijklmnopqrstuvwxyz012345678901234567890123';
            for (var i = 0; i < 21; i++) {
                reallyLongPropertyValue += 'abcdefghijklmnopqrstuvwxyz012345678901234567890123';
            }
            assert(reallyLongPropertyValue.length > 1024);
            var data = {};
            data[reallyLongPropertyName] = '1234';
            data['reallyLongPropertyValue'] = reallyLongPropertyValue;
            appender.log('testEvent', data);
            assert.equal(appInsightsMock.events.length, 1);
            for (var prop in appInsightsMock.events[0].properties) {
                assert(prop.length < 150);
                assert(appInsightsMock.events[0].properties[prop].length < 1024);
            }
        });
        test('Different data types', function () {
            var date = new Date();
            appender.log('testEvent', { favoriteDate: date, likeRed: false, likeBlue: true, favoriteNumber: 1, favoriteColor: 'blue', favoriteCars: ['bmw', 'audi', 'ford'] });
            assert.equal(appInsightsMock.events.length, 1);
            assert.equal(appInsightsMock.events[0].eventName, nodeAppInsightsTelemetryAppender_1.NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX + 'testEvent');
            assert.equal(appInsightsMock.events[0].properties['favoriteColor'], 'blue');
            assert.equal(appInsightsMock.events[0].measurements['likeRed'], 0);
            assert.equal(appInsightsMock.events[0].measurements['likeBlue'], 1);
            assert.equal(appInsightsMock.events[0].properties['favoriteDate'], date.toISOString());
            assert.equal(appInsightsMock.events[0].properties['favoriteCars'], JSON.stringify(['bmw', 'audi', 'ford']));
            assert.equal(appInsightsMock.events[0].measurements['favoriteNumber'], 1);
        });
        test('Nested data', function () {
            appender.log('testEvent', {
                window: {
                    title: 'some title',
                    measurements: {
                        width: 100,
                        height: 200
                    }
                },
                nestedObj: {
                    nestedObj2: {
                        nestedObj3: {
                            testProperty: 'test',
                        }
                    },
                    testMeasurement: 1
                }
            });
            assert.equal(appInsightsMock.events.length, 1);
            assert.equal(appInsightsMock.events[0].eventName, nodeAppInsightsTelemetryAppender_1.NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX + 'testEvent');
            assert.equal(appInsightsMock.events[0].properties['window.title'], 'some title');
            assert.equal(appInsightsMock.events[0].measurements['window.measurements.width'], 100);
            assert.equal(appInsightsMock.events[0].measurements['window.measurements.height'], 200);
            assert.equal(appInsightsMock.events[0].properties['nestedObj.nestedObj2.nestedObj3'], JSON.stringify({ "testProperty": "test" }));
            assert.equal(appInsightsMock.events[0].measurements['nestedObj.testMeasurement'], 1);
        });
        test('Test asimov', function () {
            appender = new nodeAppInsightsTelemetryAppender_1.NodeAppInsightsTelemetryAppender(null, new ContextServiceMock('123', 'AIF-123'), appInsightsMock);
            appender.log('testEvent');
            assert.equal(appInsightsMock.events.length, 2);
            assert.equal(appInsightsMock.events[0].eventName, nodeAppInsightsTelemetryAppender_1.NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX + 'testEvent');
            // test vortex
            assert.equal(appInsightsMock.events[1].eventName, nodeAppInsightsTelemetryAppender_1.NodeAppInsightsTelemetryAppender.EVENT_NAME_PREFIX + 'testEvent');
        });
    });
});
//# sourceMappingURL=appInsightsTelemetryAppender.test.js.map