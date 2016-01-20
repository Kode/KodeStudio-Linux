/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/uri', 'assert', 'vs/languages/typescript/common/project/projectService', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/common/typescript'], function (require, exports, uri_1, assert, project, ts, typescript) {
    suite('TS - ProjectService', function () {
        var projectService;
        setup(function () {
            projectService = new project.ProjectService();
            projectService._syncFile(typescript.ChangeKind.Added, uri_1.default.file('/one/file1.ts'), "var a = 1234;");
            projectService._syncFile(typescript.ChangeKind.Added, uri_1.default.file('/one/file2.ts'), "var b = 1234;");
        });
        test('virtual project', function () {
            var project = projectService.getProject(uri_1.default.file('/some/file.ts'));
            assert.ok(!!project);
            assert.equal(project.resource.toString(), 'ts://projects/virtual/1');
            assert.ok(project.host.getCompilationSettings().allowNonTsExtensions);
            assert.equal(project.host.getCompilationSettings().module, 1 /* CommonJS */);
            assert.ok(project === projectService.getProject(uri_1.default.file('/some/other/file.ts')));
        });
        test('configured projects', function () {
            projectService._syncProject(typescript.ChangeKind.Added, uri_1.default.file('/one/tsconfig.json'), [uri_1.default.file('/one/file1.ts')], ts.getDefaultCompilerOptions());
            var project = projectService.getProject(uri_1.default.file('/one/file1.ts'));
            assert.equal(project.host.getCompilationSettings().module, 1 /* CommonJS */);
            assert.ok(project.host.getCompilationSettings().allowNonTsExtensions);
            assert.ok(project.host.isRoot('file:///one/file1.ts'));
        });
        test('projects can access any file', function () {
            projectService._syncProject(typescript.ChangeKind.Added, uri_1.default.file('/one/tsconfig.json'), [uri_1.default.file('/one/file1.ts')], ts.getDefaultCompilerOptions());
            var project = projectService.getProject(uri_1.default.file('/one/file1.ts'));
            assert.deepEqual(project.host.getScriptFileNames(), ['file:///one/file1.ts']);
            assert.ok(!!project.host.getScriptSnapshot('file:///one/file2.ts'));
        });
        test('configured projects take roots from virtual', function () {
            var virtualProject = projectService.getProject(uri_1.default.file('/one/file1.ts'));
            assert.equal(virtualProject.resource.toString(), 'ts://projects/virtual/1');
            assert.ok(virtualProject.host.isRoot('file:///one/file1.ts'));
            projectService._syncProject(typescript.ChangeKind.Added, uri_1.default.file('/one/tsconfig.json'), [uri_1.default.file('/one/file1.ts')], ts.getDefaultCompilerOptions());
            var configuredProject = projectService.getProject(uri_1.default.file('/one/file1.ts'));
            assert.ok(virtualProject !== configuredProject);
            assert.ok(!virtualProject.host.isRoot('file:///one/file1.ts'));
            assert.ok(configuredProject.host.isRoot('file:///one/file1.ts'));
        });
    });
});
//# sourceMappingURL=projectService.test.js.map