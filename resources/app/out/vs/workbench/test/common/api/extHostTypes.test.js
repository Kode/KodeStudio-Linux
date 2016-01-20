/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/workbench/api/node/extHostTypes'], function (require, exports, assert, types) {
    function assertToJSON(a, expected) {
        var raw = JSON.stringify(a);
        var actual = JSON.parse(raw);
        assert.deepEqual(actual, expected);
    }
    suite('ExtHostTypes', function () {
        test('Disposable', function () {
            var count = 0;
            var d = new types.Disposable(function () {
                count += 1;
                return 12;
            });
            d.dispose();
            assert.equal(count, 1);
            d.dispose();
            assert.equal(count, 1);
            types.Disposable.from(undefined, { dispose: function () { count += 1; } }).dispose();
            assert.equal(count, 2);
            assert.throws(function () {
                new types.Disposable(function () {
                    throw new Error();
                }).dispose();
            });
            new types.Disposable(undefined).dispose();
        });
        test('Position', function () {
            assert.throws(function () { return new types.Position(-1, 0); });
            assert.throws(function () { return new types.Position(0, -1); });
            var pos = new types.Position(0, 0);
            assert.throws(function () { return pos.line = -1; });
            assert.throws(function () { return pos.character = -1; });
            assert.throws(function () { return pos.line = 12; });
            var _a = pos.toJSON(), line = _a[0], character = _a[1];
            assert.equal(line, 0);
            assert.equal(character, 0);
        });
        test('Position, toJSON', function () {
            var pos = new types.Position(4, 2);
            assertToJSON(pos, [4, 2]);
        });
        test('Position, isBefore(OrEqual)?', function () {
            var p1 = new types.Position(1, 3);
            var p2 = new types.Position(1, 2);
            var p3 = new types.Position(0, 4);
            assert.ok(p1.isBeforeOrEqual(p1));
            assert.ok(!p1.isBefore(p1));
            assert.ok(p2.isBefore(p1));
            assert.ok(p3.isBefore(p2));
        });
        test('Position, isAfter(OrEqual)?', function () {
            var p1 = new types.Position(1, 3);
            var p2 = new types.Position(1, 2);
            var p3 = new types.Position(0, 4);
            assert.ok(p1.isAfterOrEqual(p1));
            assert.ok(!p1.isAfter(p1));
            assert.ok(p1.isAfter(p2));
            assert.ok(p2.isAfter(p3));
            assert.ok(p1.isAfter(p3));
        });
        test('Position, compareTo', function () {
            var p1 = new types.Position(1, 3);
            var p2 = new types.Position(1, 2);
            var p3 = new types.Position(0, 4);
            assert.equal(p1.compareTo(p1), 0);
            assert.equal(p2.compareTo(p1), -1);
            assert.equal(p1.compareTo(p2), 1);
            assert.equal(p2.compareTo(p3), 1);
            assert.equal(p1.compareTo(p3), 1);
        });
        test('Position, translate', function () {
            var p1 = new types.Position(1, 3);
            assert.ok(p1.translate() === p1);
            assert.ok(p1.translate(0, 0) === p1);
            assert.ok(p1.translate(0) === p1);
            assert.ok(p1.translate(undefined, 0) === p1);
            var res = p1.translate(-1);
            assert.equal(res.line, 0);
            assert.equal(res.character, 3);
            res = p1.translate(undefined, -1);
            assert.equal(res.line, 1);
            assert.equal(res.character, 2);
            res = p1.translate(11);
            assert.equal(res.line, 12);
            assert.equal(res.character, 3);
            assert.throws(function () { return p1.translate(-2); });
            assert.throws(function () { return p1.translate(0, -4); });
        });
        test('Position, with', function () {
            var p1 = new types.Position(1, 3);
            assert.ok(p1.with() === p1);
            assert.ok(p1.with(1) === p1);
            assert.ok(p1.with(undefined, 3) === p1);
            assert.ok(p1.with(1, 3) === p1);
            assert.throws(function () { return p1.with(-9); });
            assert.throws(function () { return p1.with(0, -9); });
        });
        test('Range', function () {
            assert.throws(function () { return new types.Range(-1, 0, 0, 0); });
            assert.throws(function () { return new types.Range(0, -1, 0, 0); });
            assert.throws(function () { return new types.Range(new types.Position(0, 0), undefined); });
            assert.throws(function () { return new types.Range(new types.Position(0, 0), null); });
            assert.throws(function () { return new types.Range(undefined, new types.Position(0, 0)); });
            assert.throws(function () { return new types.Range(null, new types.Position(0, 0)); });
            var range = new types.Range(1, 0, 0, 0);
            assert.throws(function () { return range.start = null; });
            assert.throws(function () { return range.start = new types.Position(0, 3); });
        });
        test('Range, toJSON', function () {
            var range = new types.Range(1, 2, 3, 4);
            assertToJSON(range, [[1, 2], [3, 4]]);
        });
        test('Range, sorting', function () {
            // sorts start/end
            var range = new types.Range(1, 0, 0, 0);
            assert.equal(range.start.line, 0);
            assert.equal(range.end.line, 1);
            range = new types.Range(0, 0, 1, 0);
            assert.equal(range.start.line, 0);
            assert.equal(range.end.line, 1);
        });
        test('Range, isEmpty|isSingleLine', function () {
            var range = new types.Range(1, 0, 0, 0);
            assert.ok(!range.isEmpty);
            assert.ok(!range.isSingleLine);
            range = new types.Range(1, 1, 1, 1);
            assert.ok(range.isEmpty);
            assert.ok(range.isSingleLine);
            range = new types.Range(0, 1, 0, 11);
            assert.ok(!range.isEmpty);
            assert.ok(range.isSingleLine);
            range = new types.Range(0, 0, 1, 1);
            assert.ok(!range.isEmpty);
            assert.ok(!range.isSingleLine);
        });
        test('Range, contains', function () {
            var range = new types.Range(1, 1, 2, 11);
            assert.ok(range.contains(range.start));
            assert.ok(range.contains(range.end));
            assert.ok(range.contains(range));
            assert.ok(!range.contains(new types.Range(1, 0, 2, 11)));
            assert.ok(!range.contains(new types.Range(0, 1, 2, 11)));
            assert.ok(!range.contains(new types.Range(1, 1, 2, 12)));
            assert.ok(!range.contains(new types.Range(1, 1, 3, 11)));
        });
        test('Range, intersection', function () {
            var range = new types.Range(1, 1, 2, 11);
            var res;
            res = range.intersection(range);
            assert.equal(res.start.line, 1);
            assert.equal(res.start.character, 1);
            assert.equal(res.end.line, 2);
            assert.equal(res.end.character, 11);
            res = range.intersection(new types.Range(2, 12, 4, 0));
            assert.equal(res, undefined);
            res = range.intersection(new types.Range(0, 0, 1, 0));
            assert.equal(res, undefined);
            res = range.intersection(new types.Range(0, 0, 1, 1));
            assert.ok(res.isEmpty);
            assert.equal(res.start.line, 1);
            assert.equal(res.start.character, 1);
            res = range.intersection(new types.Range(2, 11, 61, 1));
            assert.ok(res.isEmpty);
            assert.equal(res.start.line, 2);
            assert.equal(res.start.character, 11);
            assert.throws(function () { return range.intersection(null); });
            assert.throws(function () { return range.intersection(undefined); });
        });
        test('Range, union', function () {
            var ran1 = new types.Range(0, 0, 5, 5);
            assert.ok(ran1.union(new types.Range(0, 0, 1, 1)) === ran1);
            var res;
            res = ran1.union(new types.Range(2, 2, 9, 9));
            assert.ok(res.start === ran1.start);
            assert.equal(res.end.line, 9);
            assert.equal(res.end.character, 9);
            ran1 = new types.Range(2, 1, 5, 3);
            res = ran1.union(new types.Range(1, 0, 4, 2));
            assert.ok(res.end === ran1.end);
            assert.equal(res.start.line, 1);
            assert.equal(res.start.character, 0);
        });
        test('Range, with', function () {
            var range = new types.Range(1, 1, 2, 11);
            assert.ok(range.with(range.start) === range);
            assert.ok(range.with(undefined, range.end) === range);
            assert.ok(range.with(range.start, range.end) === range);
            assert.ok(range.with(new types.Position(1, 1)) === range);
            assert.ok(range.with(undefined, new types.Position(2, 11)) === range);
            var res = range.with(undefined, new types.Position(9, 8));
            assert.equal(res.end.line, 9);
            assert.equal(res.end.character, 8);
            assert.equal(res.start.line, 1);
            assert.equal(res.start.character, 1);
            assert.throws(function () { return range.with(null); });
            assert.throws(function () { return range.with(undefined, null); });
        });
        test('TextEdit', function () {
            assert.throws(function () { return new types.TextEdit(null, 'far'); });
            assert.throws(function () { return new types.TextEdit(undefined, 'far'); });
            var range = new types.Range(1, 1, 2, 11);
            var edit = new types.TextEdit(range, undefined);
            assert.equal(edit.newText, '');
            assertToJSON(edit, { range: [[1, 1], [2, 11]], newText: '' });
            edit = new types.TextEdit(range, null);
            assert.equal(edit.newText, '');
            edit = new types.TextEdit(range, '');
            assert.equal(edit.newText, '');
        });
        test('WorkspaceEdit', function () {
            var a = types.Uri.file('a.ts');
            var b = types.Uri.file('b.ts');
            var edit = new types.WorkspaceEdit();
            assert.ok(!edit.has(a));
            edit.set(a, [types.TextEdit.insert(new types.Position(0, 0), 'fff')]);
            assert.ok(edit.has(a));
            assert.equal(edit.size, 1);
            assertToJSON(edit, [['file://a.ts', [{ range: [[0, 0], [0, 0]], newText: 'fff' }]]]);
            edit.insert(b, new types.Position(1, 1), 'fff');
            edit.delete(b, new types.Range(0, 0, 0, 0));
            assert.ok(edit.has(b));
            assert.equal(edit.size, 2);
            assertToJSON(edit, [
                ['file://a.ts', [{ range: [[0, 0], [0, 0]], newText: 'fff' }]],
                ['file://b.ts', [{ range: [[1, 1], [1, 1]], newText: 'fff' }, { range: [[0, 0], [0, 0]], newText: '' }]]
            ]);
            edit.set(b, undefined);
            assert.ok(edit.has(b));
            assert.equal(edit.size, 2);
            edit.set(b, [types.TextEdit.insert(new types.Position(0, 0), 'ffff')]);
            assert.equal(edit.get(b).length, 1);
        });
        test('toJSON & stringify', function () {
            assertToJSON(new types.Selection(3, 4, 2, 1), { start: [2, 1], end: [3, 4], anchor: [3, 4], active: [2, 1] });
            assertToJSON(new types.Location(types.Uri.file('u.ts'), new types.Range(1, 2, 3, 4)), { uri: 'file://u.ts', range: [[1, 2], [3, 4]] });
            assertToJSON(new types.Location(types.Uri.file('u.ts'), new types.Position(3, 4)), { uri: 'file://u.ts', range: [[3, 4], [3, 4]] });
            var diag = new types.Diagnostic(new types.Range(0, 1, 2, 3), 'hello');
            assertToJSON(diag, { severity: 'Error', message: 'hello', range: [[0, 1], [2, 3]] });
            diag.source = 'me';
            assertToJSON(diag, { severity: 'Error', message: 'hello', range: [[0, 1], [2, 3]], source: 'me' });
            assertToJSON(new types.DocumentHighlight(new types.Range(2, 3, 4, 5)), { range: [[2, 3], [4, 5]], kind: 'Text' });
            assertToJSON(new types.DocumentHighlight(new types.Range(2, 3, 4, 5), types.DocumentHighlightKind.Read), { range: [[2, 3], [4, 5]], kind: 'Read' });
            assertToJSON(new types.SymbolInformation('test', types.SymbolKind.Boolean, new types.Range(0, 1, 2, 3)), {
                name: 'test',
                kind: 'Boolean',
                location: {
                    range: [[0, 1], [2, 3]]
                }
            });
            assertToJSON(new types.CodeLens(new types.Range(7, 8, 9, 10)), { range: [[7, 8], [9, 10]] });
            assertToJSON(new types.CodeLens(new types.Range(7, 8, 9, 10), { command: 'id', title: 'title' }), {
                range: [[7, 8], [9, 10]],
                command: { command: 'id', title: 'title' }
            });
            assertToJSON(new types.CompletionItem('complete'), { label: 'complete' });
            var item = new types.CompletionItem('complete');
            item.kind = types.CompletionItemKind.Interface;
            assertToJSON(item, { label: 'complete', kind: 'Interface' });
        });
    });
});
//# sourceMappingURL=extHostTypes.test.js.map