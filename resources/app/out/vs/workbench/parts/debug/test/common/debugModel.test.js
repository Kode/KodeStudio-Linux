/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", 'assert', 'vs/base/common/uri', 'vs/base/common/severity', 'vs/workbench/parts/debug/common/debugModel'], function (require, exports, assert, uri_1, severity_1, debugmodel) {
    suite('Debug - Model', function () {
        var model;
        setup(function () {
            model = new debugmodel.Model([], true, [], [], []);
        });
        teardown(function () {
            model = null;
        });
        // Breakpoints
        test('breakpoints simple', function () {
            var modelUri = uri_1.default.file('/myfolder/myfile.js');
            model.addBreakpoints([{ uri: modelUri, lineNumber: 5, enabled: true }, { uri: modelUri, lineNumber: 10, enabled: false }]);
            assert.equal(model.areBreakpointsActivated(), true);
            assert.equal(model.getBreakpoints().length, 2);
            model.removeBreakpoints(model.getBreakpoints());
            assert.equal(model.getBreakpoints().length, 0);
        });
        test('breakpoints toggling', function () {
            var modelUri = uri_1.default.file('/myfolder/myfile.js');
            model.addBreakpoints([{ uri: modelUri, lineNumber: 5, enabled: true }, { uri: modelUri, lineNumber: 10, enabled: false }]);
            model.addBreakpoints([{ uri: modelUri, lineNumber: 12, enabled: true, condition: 'fake condition' }]);
            assert.equal(model.getBreakpoints().length, 3);
            model.removeBreakpoints([model.getBreakpoints().pop()]);
            assert.equal(model.getBreakpoints().length, 2);
            model.toggleBreakpointsActivated();
            assert.equal(model.areBreakpointsActivated(), false);
            model.toggleBreakpointsActivated();
            assert.equal(model.areBreakpointsActivated(), true);
        });
        test('breakpoints two files', function () {
            var modelUri1 = uri_1.default.file('/myfolder/my file first.js');
            var modelUri2 = uri_1.default.file('/secondfolder/second/second file.js');
            model.addBreakpoints([{ uri: modelUri1, lineNumber: 5, enabled: true }, { uri: modelUri1, lineNumber: 10, enabled: false }]);
            model.addBreakpoints([{ uri: modelUri2, lineNumber: 1, enabled: true }, { uri: modelUri2, lineNumber: 2, enabled: true }, { uri: modelUri2, lineNumber: 3, enabled: false }]);
            assert.equal(model.getBreakpoints().length, 5);
            var bp = model.getBreakpoints()[0];
            var originalLineLumber = bp.lineNumber;
            var update = {};
            update[bp.getId()] = { line: 100, verified: false };
            model.updateBreakpoints(update);
            assert.equal(bp.lineNumber, 100);
            assert.equal(bp.desiredLineNumber, originalLineLumber);
            model.enableOrDisableAllBreakpoints(false);
            model.getBreakpoints().forEach(function (bp) {
                assert.equal(bp.enabled, false);
            });
            model.toggleEnablement(bp);
            assert.equal(bp.enabled, true);
            model.removeBreakpoints(model.getBreakpoints().filter(function (bp) { return bp.source.uri.toString() === modelUri1.toString(); }));
            assert.equal(model.getBreakpoints().length, 3);
        });
        // Threads
        test('threads simple', function () {
            var threadId = 1;
            var threadName = "firstThread";
            model.rawUpdate({
                threadId: threadId,
                thread: {
                    id: threadId,
                    name: threadName
                }
            });
            var threads = model.getThreads();
            assert.equal(threads[threadId].name, threadName);
            model.clearThreads(true);
            assert.equal(model.getThreads[threadId], null);
        });
        // Expressions
        function assertWatchExpressions(watchExpressions, expectedName) {
            assert.equal(watchExpressions.length, 2);
            watchExpressions.forEach(function (we) {
                assert.equal(we.available, false);
                assert.equal(we.reference, 0);
                assert.equal(we.name, expectedName);
            });
        }
        test('watch expressions', function () {
            assert.equal(model.getWatchExpressions().length, 0);
            var stackFrame = new debugmodel.StackFrame(1, 1, null, 'app.js', 1, 1);
            model.addWatchExpression(null, stackFrame, 'console').done();
            model.addWatchExpression(null, stackFrame, 'console').done();
            var watchExpressions = model.getWatchExpressions();
            assertWatchExpressions(watchExpressions, 'console');
            model.renameWatchExpression(null, stackFrame, watchExpressions[0].getId(), 'new_name').done();
            model.renameWatchExpression(null, stackFrame, watchExpressions[1].getId(), 'new_name').done();
            assertWatchExpressions(model.getWatchExpressions(), 'new_name');
            model.clearWatchExpressionValues();
            assertWatchExpressions(model.getWatchExpressions(), 'new_name');
            model.clearWatchExpressions();
            assert.equal(model.getWatchExpressions().length, 0);
        });
        test('repl expressions', function () {
            assert.equal(model.getReplElements().length, 0);
            var stackFrame = new debugmodel.StackFrame(1, 1, null, 'app.js', 1, 1);
            model.addReplExpression(null, stackFrame, 'myVariable').done();
            model.addReplExpression(null, stackFrame, 'myVariable').done();
            model.addReplExpression(null, stackFrame, 'myVariable').done();
            assert.equal(model.getReplElements().length, 3);
            model.getReplElements().forEach(function (re) {
                assert.equal(re.available, false);
                assert.equal(re.name, 'myVariable');
                assert.equal(re.reference, 0);
            });
            model.clearReplExpressions();
            assert.equal(model.getReplElements().length, 0);
        });
        // Repl output
        test('repl output', function () {
            model.logToRepl('first line', severity_1.default.Error);
            model.logToRepl('second line', severity_1.default.Warning);
            model.logToRepl('second line', severity_1.default.Warning);
            model.logToRepl('second line', severity_1.default.Error);
            var elements = model.getReplElements();
            assert.equal(elements.length, 3);
            assert.equal(elements[0].value, 'first line');
            assert.equal(elements[0].counter, 1);
            assert.equal(elements[0].severity, severity_1.default.Error);
            assert.equal(elements[0].grouped, false);
            assert.equal(elements[1].value, 'second line');
            assert.equal(elements[1].counter, 2);
            assert.equal(elements[1].severity, severity_1.default.Warning);
            assert.equal(elements[1].grouped, false);
            model.appendReplOutput('1', severity_1.default.Error);
            model.appendReplOutput('2', severity_1.default.Error);
            model.appendReplOutput('3', severity_1.default.Error);
            elements = model.getReplElements();
            assert.equal(elements.length, 4);
            assert.equal(elements[3].value, '123');
            assert.equal(elements[3].severity, severity_1.default.Error);
            var keyValueObject = { 'key1': 2, 'key2': 'value' };
            model.logToRepl(keyValueObject);
            var element = model.getReplElements()[4];
            assert.equal(element.value, 'Object');
            assert.deepEqual(element.valueObj, keyValueObject);
            model.clearReplExpressions();
            assert.equal(model.getReplElements().length, 0);
        });
        // Utils
        test('full expression name', function () {
            var type = 'node';
            assert.equal(debugmodel.getFullExpressionName(new debugmodel.Expression(null, false), type), null);
            assert.equal(debugmodel.getFullExpressionName(new debugmodel.Expression('son', false), type), 'son');
            var scope = new debugmodel.Scope(1, 'myscope', 1, false);
            var son = new debugmodel.Variable(new debugmodel.Variable(new debugmodel.Variable(scope, 0, 'grandfather', '75'), 0, 'father', '45'), 0, 'son', '20');
            assert.equal(debugmodel.getFullExpressionName(son, type), 'grandfather.father.son');
            var grandson = new debugmodel.Variable(son, 0, '/weird_name', '1');
            assert.equal(debugmodel.getFullExpressionName(grandson, type), 'grandfather.father.son[\'/weird_name\']');
        });
    });
});
//# sourceMappingURL=debugModel.test.js.map