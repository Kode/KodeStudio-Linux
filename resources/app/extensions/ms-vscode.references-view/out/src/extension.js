'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class FileItem {
    constructor(uri, results) {
        this.uri = uri;
        this.results = results;
    }
}
class ReferenceItem {
    constructor(location, parent) {
        this.location = location;
        this.parent = parent;
    }
}
class ReferenceSearchModel {
    constructor(uri, position, items = new Array()) {
        this.uri = uri;
        this.position = position;
        this.items = items;
        //
    }
    get resolve() {
        if (!this._resolve) {
            this._resolve = this._doResolve();
        }
        return this._resolve;
    }
    reset() {
        this._resolve = undefined;
    }
    _doResolve() {
        return __awaiter(this, void 0, void 0, function* () {
            this.items.length = 0;
            const locations = yield vscode.commands.executeCommand('vscode.executeReferenceProvider', this.uri, this.position);
            if (locations) {
                let last;
                locations.sort(ReferenceSearchModel._compareLocations);
                for (const loc of locations) {
                    if (!last || last.uri.toString() !== loc.uri.toString()) {
                        last = new FileItem(loc.uri, []);
                        this.items.push(last);
                    }
                    last.results.push(new ReferenceItem(loc, last));
                }
            }
            return this;
        });
    }
    get(uri) {
        for (const item of this.items) {
            if (item.uri.toString() === uri.toString()) {
                return item;
            }
        }
        return undefined;
    }
    first() {
        for (const item of this.items) {
            if (item.uri.toString() === this.uri.toString()) {
                for (const ref of item.results) {
                    if (ref.location.range.contains(this.position)) {
                        return ref;
                    }
                }
                return undefined;
            }
        }
        return undefined;
    }
    remove(item) {
        if (item instanceof FileItem) {
            ReferenceSearchModel._del(this.items, item);
            return undefined;
        }
        else if (item instanceof ReferenceItem) {
            ReferenceSearchModel._del(item.parent.results, item);
            if (item.parent.results.length === 0) {
                ReferenceSearchModel._del(this.items, item.parent);
                return undefined;
            }
            else {
                return item.parent;
            }
        }
    }
    move(item, fwd) {
        const delta = fwd ? +1 : -1;
        const _move = (item) => {
            const idx = (this.items.indexOf(item) + delta + this.items.length) % this.items.length;
            return this.items[idx];
        };
        if (item instanceof FileItem) {
            if (fwd) {
                return item.results[0];
            }
            else {
                return ReferenceSearchModel._tail(_move(item).results);
            }
        }
        if (item instanceof ReferenceItem) {
            const idx = item.parent.results.indexOf(item) + delta;
            if (idx < 0) {
                return ReferenceSearchModel._tail(_move(item.parent).results);
            }
            else if (idx >= item.parent.results.length) {
                return _move(item.parent).results[0];
            }
            else {
                return item.parent.results[idx];
            }
        }
    }
    static _compareLocations(a, b) {
        if (a.uri.toString() < b.uri.toString()) {
            return -1;
        }
        else if (a.uri.toString() > b.uri.toString()) {
            return 1;
        }
        else if (a.range.start.isBefore(b.range.start)) {
            return -1;
        }
        else if (a.range.start.isAfter(b.range.start)) {
            return 1;
        }
        else {
            return 0;
        }
    }
    static _del(array, e) {
        const idx = array.indexOf(e);
        if (idx >= 0) {
            array.splice(idx, 1);
        }
    }
    static _tail(array) {
        return array[array.length - 1];
    }
}
class DataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    setModel(model) {
        this._model = model;
        this._onDidChangeTreeData.fire();
        vscode.commands.executeCommand('setContext', 'reference-list.hasResult', Boolean(this._model));
    }
    getModel() {
        return this._model;
    }
    getTreeItem(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (element instanceof FileItem) {
                // files
                const result = new vscode.TreeItem(element.uri);
                result.contextValue = 'reference-item';
                result.iconPath = vscode.ThemeIcon.File;
                result.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
                return result;
            }
            if (element instanceof ReferenceItem) {
                // references
                const { range } = element.location;
                const doc = yield vscode.workspace.openTextDocument(element.location.uri);
                const previewStart = range.start.with({ character: Math.max(0, range.start.character - 8) });
                const wordRange = doc.getWordRangeAtPosition(previewStart);
                const before = doc.getText(new vscode.Range(wordRange ? wordRange.start : previewStart, range.start)).replace(/^\s*/g, '');
                const inside = doc.getText(range);
                const previewEnd = range.end.translate(0, 31);
                const after = doc.getText(new vscode.Range(range.end, previewEnd)).replace(/\s*$/g, '');
                const label = {
                    label: before + inside + after,
                    highlights: [[before.length, before.length + inside.length]]
                };
                const result = new vscode.TreeItem2(label);
                result.collapsibleState = vscode.TreeItemCollapsibleState.None;
                result.contextValue = 'reference-item';
                result.command = {
                    title: 'Open Reference',
                    command: 'references-view.show',
                    arguments: [element]
                };
                return result;
            }
            throw new Error();
        });
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (element instanceof FileItem) {
                return element.results;
            }
            else if (this._model) {
                return (yield this._model.resolve).items;
            }
            else {
                return [];
            }
        });
    }
    getParent(element) {
        return element instanceof ReferenceItem
            ? element.parent
            : undefined;
    }
}
function activate(context) {
    const viewId = 'references-view.tree';
    const treeDataProvider = new DataProvider();
    const view = vscode.window.createTreeView(viewId, {
        treeDataProvider,
        showCollapseAll: true
    });
    const editorHighlights = new class {
        constructor() {
            this._decorationType = vscode.window.createTextEditorDecorationType({
                backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground')
            });
            this._editorListener = vscode.window.onDidChangeActiveTextEditor(this.highlight, this);
        }
        dispose() {
            this.clear();
            this._editorListener.dispose();
        }
        highlight() {
            const { activeTextEditor: editor } = vscode.window;
            const model = treeDataProvider.getModel();
            if (!editor || !model) {
                return;
            }
            const item = model.get(editor.document.uri);
            if (item) {
                editor.setDecorations(this._decorationType, item.results.map(ref => ref.location.range));
            }
        }
        clear() {
            const { activeTextEditor: editor } = vscode.window;
            if (editor) {
                editor.setDecorations(this._decorationType, []);
            }
        }
    };
    const findCommand = (editor) => __awaiter(this, void 0, void 0, function* () {
        editorHighlights.clear();
        if (editor.document.getWordRangeAtPosition(editor.selection.active)) {
            const model = new ReferenceSearchModel(editor.document.uri, editor.selection.active);
            treeDataProvider.setModel(model);
            yield Promise.all([
                vscode.commands.executeCommand(`${viewId}.focus`),
                model.resolve
            ]);
            editorHighlights.highlight();
            const selection = model.first();
            if (selection) {
                view.reveal(selection, { select: true, focus: true });
            }
        }
    });
    const refreshCommand = () => {
        const model = treeDataProvider.getModel();
        if (model) {
            model.reset();
            treeDataProvider._onDidChangeTreeData.fire();
            view.reveal(view.selection[0]);
        }
    };
    const clearCommand = () => {
        editorHighlights.clear();
        treeDataProvider.setModel(undefined);
    };
    const showRefCommand = (arg) => {
        if (arg instanceof ReferenceItem) {
            const { location } = arg;
            vscode.window.showTextDocument(location.uri, {
                selection: location.range.with({ end: location.range.start }),
                preserveFocus: true
            });
        }
    };
    const removeRefCommand = (arg) => {
        const model = treeDataProvider.getModel();
        if (model) {
            const next = model.move(arg, true);
            const parent = model.remove(arg);
            treeDataProvider._onDidChangeTreeData.fire(parent);
            if (next) {
                view.reveal(next, { select: true });
            }
        }
    };
    const moveCommand = (fwd) => {
        const model = treeDataProvider.getModel();
        if (!model) {
            return;
        }
        const selection = view.selection[0] || model.first();
        const next = model.move(selection, fwd);
        if (next) {
            view.reveal(next, { select: true });
            showRefCommand(next);
        }
    };
    context.subscriptions.push(view, editorHighlights, vscode.commands.registerTextEditorCommand('references-view.find', findCommand), vscode.commands.registerTextEditorCommand('references-view.refresh', refreshCommand), vscode.commands.registerTextEditorCommand('references-view.clear', clearCommand), vscode.commands.registerCommand('references-view.show', showRefCommand), vscode.commands.registerCommand('references-view.remove', removeRefCommand), vscode.commands.registerCommand('references-view.showNextReference', () => moveCommand(true)), vscode.commands.registerCommand('references-view.showPrevReference', () => moveCommand(false)));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map