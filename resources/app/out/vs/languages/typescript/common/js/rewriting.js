/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/common/js/textEdits'], function (require, exports, strings, ts, textEdits) {
    var IdentityTranslator = (function () {
        function IdentityTranslator() {
        }
        IdentityTranslator.prototype.to = function (thing) {
            return thing;
        };
        IdentityTranslator.prototype.from = function (thing) {
            return thing;
        };
        IdentityTranslator.prototype.info = function (range) {
            return {
                origin: undefined,
                isInserted: false,
                isOverlapping: false
            };
        };
        IdentityTranslator.Instance = new IdentityTranslator();
        return IdentityTranslator;
    })();
    exports.IdentityTranslator = IdentityTranslator;
    var $measurePerf = false;
    var $t1;
    var $perf;
    function translate(_rewriter, snapshot, sourceFile) {
        $perf = Object.create(null);
        $perf['_total'] = Date.now();
        var value = typeof snapshot === 'string' ? snapshot : snapshot.getText(0, snapshot.getLength());
        if (!sourceFile) {
            sourceFile = function () { return ts.createSourceFile('afile.ts', value, 2 /* Latest */, true); };
        }
        var context = new AnalyzerContext(sourceFile);
        for (var i = 0, len = _rewriter.length; i < len; i++) {
            $t1 = Date.now();
            _rewriter[i].computeEdits(context);
            $perf[_rewriter[i].name] = Date.now() - $t1;
        }
        if (context.edits.length === 0) {
            return { value: value, doEdits: [], undoEdits: [], derived: [] };
        }
        $t1 = Date.now();
        var result = textEdits.apply(context.edits, value);
        $perf['_apply'] = Date.now() - $t1;
        $perf['_total'] = Date.now() - $perf['_total'];
        $measurePerf && console.info($perf);
        $measurePerf && console.info(result.value);
        return result;
    }
    exports.translate = translate;
    var AnalyzerContext = (function () {
        function AnalyzerContext(sourceFile) {
            this.sourceFile = sourceFile();
            this.sourceUnitStart = this.sourceFile.getStart();
            this.edits = [];
        }
        AnalyzerContext.prototype.addEdit = function (edit) {
            this.edits.push(edit);
        };
        AnalyzerContext.prototype.newInsert = function (offsetOrText) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var offset;
            if (typeof offsetOrText === 'string') {
                offset = this.sourceUnitStart;
                args.unshift(offsetOrText);
            }
            else {
                offset = offsetOrText;
            }
            this.edits.push(new textEdits.Edit(offset, 0, strings.format.apply(strings, args)));
        };
        AnalyzerContext.prototype.newDerive = function (node, offsetOrText) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var offset;
            if (typeof offsetOrText === 'string') {
                offset = this.sourceUnitStart;
                args.unshift(offsetOrText);
            }
            else {
                offset = offsetOrText;
            }
            var edit = new textEdits.Edit(offset, 0, strings.format.apply(strings, args));
            edit.origin = new textEdits.TextSpan(node.getStart(), node.getWidth());
            this.edits.push(edit);
        };
        AnalyzerContext.prototype.newDelete = function (offset, length) {
            this.edits.push(new textEdits.Edit(offset, length, strings.empty));
        };
        AnalyzerContext.prototype.newReplace = function (offset, length, text) {
            this.edits.push(new textEdits.Edit(offset, length, text));
        };
        AnalyzerContext.prototype.newAppend = function (text) {
            this.edits.push(new textEdits.Edit(this.sourceFile.getFullWidth(), 0, text));
        };
        return AnalyzerContext;
    })();
    exports.AnalyzerContext = AnalyzerContext;
    var _variableNamePatternString = '_$steroids$_{0}_{1}', _variableNamePattern = /_\$steroids\$_(\d+)_(\d+)/g;
    function encodeVariableName(node) {
        return strings.format(_variableNamePatternString, node.getStart(), node.getEnd());
    }
    exports.encodeVariableName = encodeVariableName;
    function _doDecodeVariableName(name, sourceFile) {
        _variableNamePattern.lastIndex = 0;
        return name.replace(_variableNamePattern, function (m, g1, g2) { return sourceFile.getText(parseInt(g1), parseInt(g2)); });
    }
    function decodeVariableNames(name, sourceFile) {
        if (typeof name === 'string') {
            return _doDecodeVariableName(name, sourceFile);
        }
        else if (Array.isArray(name)) {
            var stack = name.slice(0);
            while (stack.length) {
                var element = stack.shift();
                element.text = element.text && _doDecodeVariableName(element.text, sourceFile);
                element.children && stack.push.apply(stack, element.children);
            }
        }
    }
    exports.decodeVariableNames = decodeVariableNames;
    function containsEncodedVariableName(text) {
        _variableNamePattern.lastIndex = 0;
        return _variableNamePattern.test(text);
    }
    exports.containsEncodedVariableName = containsEncodedVariableName;
});
//# sourceMappingURL=rewriting.js.map