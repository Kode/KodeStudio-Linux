/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/features/converter', 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, converter, ts) {
    var outlineTypeTable = Object.create(null);
    outlineTypeTable[ts.ScriptElementKind.moduleElement] = 'module';
    outlineTypeTable[ts.ScriptElementKind.classElement] = 'class';
    outlineTypeTable[ts.ScriptElementKind.enumElement] = 'enum';
    outlineTypeTable[ts.ScriptElementKind.interfaceElement] = 'interface';
    outlineTypeTable[ts.ScriptElementKind.memberFunctionElement] = 'method';
    outlineTypeTable[ts.ScriptElementKind.memberVariableElement] = 'property';
    outlineTypeTable[ts.ScriptElementKind.memberGetAccessorElement] = 'property';
    outlineTypeTable[ts.ScriptElementKind.memberSetAccessorElement] = 'property';
    outlineTypeTable[ts.ScriptElementKind.variableElement] = 'variable';
    outlineTypeTable[ts.ScriptElementKind.constElement] = 'variable';
    outlineTypeTable[ts.ScriptElementKind.localVariableElement] = 'variable';
    outlineTypeTable[ts.ScriptElementKind.variableElement] = 'variable';
    outlineTypeTable[ts.ScriptElementKind.functionElement] = 'function';
    outlineTypeTable[ts.ScriptElementKind.localFunctionElement] = 'function';
    function _compare(a, b) {
        if (a.range.startLineNumber < b.range.startLineNumber) {
            return -1;
        }
        else if (a.range.startLineNumber > b.range.startLineNumber) {
            return 1;
        }
        else if (a.range.startColumn < b.range.startColumn) {
            return -1;
        }
        else if (a.range.startColumn > b.range.startColumn) {
            return 1;
        }
        else {
            return 0;
        }
    }
    function compute(languageService, resource) {
        var isJavaScript = /\.js$/.test(resource.fsPath);
        return isJavaScript
            ? functionsAndGlobals(languageService, resource)
            : navigationBarItems(languageService, resource);
    }
    exports.compute = compute;
    function navigationBarItems(languageService, resource) {
        var sourceFile = languageService.getSourceFile(resource.toString()), items = languageService.getNavigationBarItems(sourceFile.fileName), parent = { type: '', label: '', range: undefined, children: [] };
        items
            .filter(function (item) { return item.text !== '<global>'; })
            .forEach(function (item) { return parent.children.push(_convert(sourceFile, item)); });
        return parent.children.sort(_compare);
    }
    function _convert(file, item) {
        var span = item.spans[0], range = converter.getRange(file, span);
        return {
            label: item.text,
            type: outlineTypeTable[item.kind] || 'variable',
            range: range,
            children: item.childItems.map(function (child) { return _convert(file, child); }).sort(_compare)
        };
    }
    function functionsAndGlobals(languageService, resource) {
        var stack = [], sourceFile = languageService.getSourceFile(resource.toString()), result = [];
        sourceFile.statements.forEach(function (statement) {
            if (statement.kind === 183 /* VariableStatement */) {
                // global variables
                statement.declarationList.declarations.forEach(function (declaration) {
                    result.push({
                        label: declaration.name.getText(),
                        type: 'variable',
                        range: converter.getRange(sourceFile, declaration.getStart(), declaration.getEnd())
                    });
                });
            }
            // walk all other elements and search for functions
            stack.push(statement);
        });
        while (stack.length) {
            var node = stack.pop(), label = '';
            if (node.kind === 203 /* FunctionDeclaration */) {
                // function farboo() {}
                label = node.name.text;
            }
            else if (node.kind === 165 /* FunctionExpression */) {
                // var a = function() {}, map(function(){}), { a: function() {}}
                if (node.name) {
                    label = node.name.text;
                }
                else if (node.parent.kind === 227 /* PropertyAssignment */
                    && node.parent.name) {
                    label = ts.getTextOfNode(node.parent.name) + ": function()";
                }
            }
            if (label) {
                result.push({
                    label: label,
                    type: 'function',
                    range: converter.getRange(sourceFile, node.getStart(), node.getEnd())
                });
            }
            stack.push.apply(stack, node.getChildren());
        }
        // add classes
        var items = languageService.getNavigationBarItems(sourceFile.fileName);
        for (var _i = 0; _i < items.length; _i++) {
            var item = items[_i];
            if (item.kind === ts.ScriptElementKind.classElement) {
                var entry = _convert(sourceFile, item);
                result.push(entry);
            }
        }
        return result.sort(_compare);
    }
});
//# sourceMappingURL=outline.js.map