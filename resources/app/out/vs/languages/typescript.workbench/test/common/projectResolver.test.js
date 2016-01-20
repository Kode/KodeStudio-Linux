/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/uri', 'vs/base/common/glob', 'vs/base/common/winjs.base', 'vs/platform/instantiation/common/instantiationService', 'vs/languages/typescript.workbench/common/projectResolver', 'vs/platform/test/common/nullThreadService', 'vs/platform/markers/common/markerService', 'vs/base/common/eventEmitter', 'vs/platform/files/common/files', 'vs/editor/common/services/modelService', 'vs/platform/message/common/message', 'vs/platform/search/common/search', 'vs/platform/telemetry/common/telemetry', 'vs/platform/workspace/common/workspace'], function (require, exports, assert, uri_1, glob, winjs, instantiation, ProjectResolver, nullThreadService_1, markerService, eventEmitter, Files, modelService_1, message_1, Search, telemetry_1, workspace_1) {
    function createContextService(resource) {
        if (resource === void 0) { resource = uri_1.default.file('/foo/bar'); }
        function getWorkspace() {
            return {
                resource: resource,
                id: undefined,
                mtime: undefined,
                name: undefined,
                uid: undefined
            };
        }
        ;
        return {
            serviceId: workspace_1.IWorkspaceContextService,
            getWorkspace: getWorkspace,
            getConfiguration: undefined,
            getOptions: undefined,
            toResource: undefined,
            toWorkspaceRelativePath: undefined,
            isInsideWorkspace: undefined
        };
    }
    function createModelService() {
        function getModel(r) {
            return null;
        }
        return {
            serviceId: modelService_1.IModelService,
            getModel: getModel,
            createModel: undefined,
            getModels: undefined,
            onModelAdded: undefined,
            onModelRemoved: undefined,
            onModelModeChanged: undefined,
            destroyModel: undefined
        };
    }
    function createMessageService() {
        return {
            serviceId: message_1.IMessageService,
            setStatusMessage: function () { return { dispose: function () { } }; },
            confirm: undefined,
            hideAll: undefined,
            show: undefined
        };
    }
    function createSearchService(index) {
        if (index === void 0) { index = Object.create(null); }
        function search(query) {
            var results = [];
            for (var key in index) {
                var resource = uri_1.default.file(key);
                if (glob.match(query.includePattern, resource.fsPath)) {
                    results.push({
                        resource: resource
                    });
                }
            }
            return winjs.PPromise.as({
                results: results
            });
        }
        return {
            serviceId: Search.ISearchService,
            search: search
        };
    }
    function createFileService(index) {
        if (index === void 0) { index = Object.create(null); }
        function resolveContent(resource) {
            if (!index[resource.fsPath]) {
                return winjs.TPromise.as(null);
            }
            var result = {
                resource: resource,
                value: index[resource.fsPath],
                charset: undefined,
                etag: undefined,
                mime: undefined,
                mtime: undefined,
                name: undefined
            };
            return winjs.TPromise.as(result);
        }
        function resolveContents(resources) {
            var result = [];
            resources.forEach(function (resource) {
                if (index[resource.fsPath]) {
                    result.push({
                        resource: resource,
                        value: index[resource.fsPath],
                        charset: undefined,
                        etag: undefined,
                        mime: undefined,
                        mtime: undefined,
                        name: undefined
                    });
                }
            });
            return winjs.TPromise.as(result);
        }
        return {
            serviceId: Files.IFileService,
            resolveContent: resolveContent,
            resolveContents: resolveContents,
            copyFile: undefined,
            createFile: undefined,
            createFolder: undefined,
            del: undefined,
            dispose: undefined,
            moveFile: undefined,
            rename: undefined,
            resolveFile: undefined,
            updateContent: undefined,
            updateOptions: undefined,
            importFile: undefined,
            watchFileChanges: undefined,
            unwatchFileChanges: undefined
        };
    }
    function createTelemetryService() {
        function publicLog() {
        }
        return {
            serviceId: telemetry_1.ITelemetryService,
            addTelemetryAppender: undefined,
            dispose: undefined,
            getAppenders: undefined,
            getAppendersCount: undefined,
            publicLog: publicLog,
            removeTelemetryAppender: undefined,
            start: undefined,
            getSessionId: undefined,
            getInstanceId: undefined,
            getMachineId: undefined,
            getTelemetryInfo: undefined,
            setInstantiationService: undefined
        };
    }
    var instantiationService;
    function setup() {
        instantiationService = instantiation.create({
            eventService: new eventEmitter.EventEmitter(),
            markerService: new markerService.MarkerService(nullThreadService_1.NULL_THREAD_SERVICE),
            fileService: createFileService(),
            searchService: createSearchService(),
            messageService: createMessageService(),
            modelService: createModelService(),
            contextService: createContextService(),
            telemetryService: createTelemetryService()
        });
    }
    suite('TS - Project Resolver', function () {
        setup();
        test('no workspace, no resolve', function () {
            var resolver = instantiationService
                .createChild({ contextService: createContextService(null) })
                .createInstance(ProjectResolver, null, null);
            var promise = resolver.resolveProjects();
            assert.ok(promise === undefined);
        });
        test('project -> expand files', function (done) {
            var fileChangesCount = 0, projectChangesCount = 0;
            var consumer = {
                acceptFileChanges: function (changes) {
                    fileChangesCount += changes.length;
                    return winjs.TPromise.as([]);
                },
                acceptProjectChanges: function (changes) {
                    projectChangesCount += changes.length;
                    return winjs.TPromise.as([]);
                }
            };
            var files = Object.create(null);
            files['jsconfig.json'] = '{}';
            files['a.js'] = 'a';
            files['b.js'] = 'b';
            files['c.d.ts'] = 'c';
            files['d.ts'] = 'd';
            var resolver = instantiationService.createChild({
                searchService: createSearchService(files),
                fileService: createFileService(files),
            }).createInstance(ProjectResolver, { files: '{**/*.js,**/*.d.ts}', projects: '**/jsconfig.json' }, consumer);
            resolver.resolveProjects().then(function (_) {
                assert.equal(fileChangesCount, 3);
                assert.equal(projectChangesCount, 2);
                done();
            }, function (err) {
                assert.ok(false, JSON.stringify(err, null, 4));
                done();
            });
        });
    });
});
//# sourceMappingURL=projectResolver.test.js.map