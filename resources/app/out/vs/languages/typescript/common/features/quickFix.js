/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/network', 'vs/base/common/strings', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/common/features/converter', 'vs/nls', 'vs/base/common/arrays'], function (require, exports, network, strings, ts, converter, nls, arrays) {
    function evaluate(languageService, resource, range, quickFix) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, { lineNumber: range.endLineNumber, column: range.endColumn }), token = ts.findTokenOnLeftOfPosition(sourceFile, offset);
        if (!token || token.getWidth() === 0) {
            return null;
        }
        var command = quickFix.command.arguments[0];
        switch (command.type) {
            case 'rename': {
                var start = sourceFile.getLineAndCharacterOfPosition(token.getStart());
                var end = sourceFile.getLineAndCharacterOfPosition(token.getEnd());
                var renameRange = { startLineNumber: start.line + 1, startColumn: start.character + 1, endLineNumber: end.line + 1, endColumn: end.character + 1 };
                return {
                    edits: [{ resource: resource, range: renameRange, newText: command.name }]
                };
            }
            case 'addglobal': {
                var content = strings.format('/* global {0} */\n', command.name);
                var renameRange = { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 };
                return {
                    edits: [{ resource: resource, range: renameRange, newText: content }]
                };
            }
        }
        return null;
    }
    exports.evaluate = evaluate;
    function isMarker(obj) {
        return !!obj.code;
    }
    function compute(languageService, resource, range) {
        // so far only support quick fixes on markers
        if (!isMarker(range)) {
            return [];
        }
        var marker = range;
        var code = 0;
        try {
            code = parseInt(marker.code);
        }
        catch (e) {
        }
        var proposals = [];
        switch (code) {
            case 2339:
                computeRenameProposals(languageService, resource, marker, proposals);
                break;
            case 2304:
                computeRenameProposals(languageService, resource, marker, proposals);
                computeAddTypeDefinitionProposals(languageService, resource, marker, proposals);
                break;
        }
        return proposals;
    }
    exports.compute = compute;
    function computeRenameProposals(languageService, resource, range, result) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, { lineNumber: range.endLineNumber, column: range.endColumn }), token = ts.findTokenOnLeftOfPosition(sourceFile, offset);
        if (!token || token.getWidth() === 0) {
            return;
        }
        var currentWord = ts.getTextOfNode(token);
        currentWord = currentWord.substring(0, currentWord.length - (token.getEnd() - offset));
        var completion = languageService.getCompletionsAtPosition(filename, offset);
        if (!completion || arrays.isFalsyOrEmpty(completion.entries)) {
            return;
        }
        var fixes = [];
        completion.entries.forEach(function (entry) {
            if (entry.name === currentWord) {
                return;
            }
            switch (entry.kind) {
                case ts.ScriptElementKind.classElement:
                case ts.ScriptElementKind.interfaceElement:
                case ts.ScriptElementKind.typeElement:
                case ts.ScriptElementKind.enumElement:
                case ts.ScriptElementKind.variableElement:
                case ts.ScriptElementKind.localVariableElement:
                case ts.ScriptElementKind.functionElement:
                case ts.ScriptElementKind.localFunctionElement:
                case ts.ScriptElementKind.memberFunctionElement:
                case ts.ScriptElementKind.memberGetAccessorElement:
                case ts.ScriptElementKind.memberSetAccessorElement:
                case ts.ScriptElementKind.memberVariableElement:
                case ts.ScriptElementKind.constructorImplementationElement:
                case ts.ScriptElementKind.callSignatureElement:
                case ts.ScriptElementKind.indexSignatureElement:
                case ts.ScriptElementKind.constructSignatureElement:
                case ts.ScriptElementKind.parameterElement:
                case ts.ScriptElementKind.primitiveType:
                    var score = strings.difference(currentWord, entry.name);
                    if (score < currentWord.length / 2 /*score_lim*/) {
                        return;
                    }
                    fixes.push({
                        command: {
                            id: 'ts.renameTo',
                            title: nls.localize('typescript.quickfix.rename', "Rename to '{0}'", entry.name),
                            arguments: [{ type: 'rename', name: entry.name }]
                        },
                        score: score
                    });
            }
        });
        // Sort in descending order.
        fixes.sort(function (a, b) {
            return b.score - a.score;
        });
        var max = Math.min(3, fixes.length);
        for (var i = 0; i < max; i++) {
            result.push(fixes[i]);
        }
    }
    var angularDD = 'angularjs/angular.d.ts';
    var jqueryDD = 'jquery/jquery.d.ts';
    var nodejsDD = 'node/node.d.ts';
    var mochaDD = 'mocha/mocha.d.ts';
    var underscoreDD = 'underscore/underscore.d.ts';
    var knockoutDD = 'knockout/knockout.d.ts';
    var backboneDD = 'backbone/backbone.d.ts';
    var d3DD = 'd3/d3.d.ts';
    var qunitDD = 'qunit/qunit.d.ts';
    var reactDD = 'react/react.d.ts';
    var emberDD = 'ember/ember.d.ts';
    var lodashDD = 'lodash/lodash.d.ts';
    var mustacheDD = 'mustache/mustache.d.ts';
    var asyncDD = 'async/async.d.ts';
    var browserifyDD = 'browserify/browserify.d.ts';
    var cordovaDD = 'cordova/cordova.d.ts';
    var sinonDD = 'sinon/sinon.d.ts';
    var jasmineDD = 'jasmine/jasmine.d.ts';
    var handlebarsDD = 'handlebars/handlebars.d.ts';
    // exported for tests
    exports.typingsMap = {
        'angular': angularDD,
        '$': jqueryDD, 'jquery': jqueryDD, 'jQuery': jqueryDD,
        'process': nodejsDD, '__dirname': nodejsDD,
        'describe': [mochaDD, jasmineDD],
        'it': [mochaDD, jasmineDD],
        '_': [underscoreDD, lodashDD],
        'ko': knockoutDD,
        'Backbone': backboneDD,
        'd3': d3DD,
        'QUnit': qunitDD,
        'React': reactDD,
        'Ember': emberDD, 'Em': emberDD,
        'Handlebars': handlebarsDD,
        'Mustache': mustacheDD,
        'async': asyncDD,
        'browserify': browserifyDD,
        'cordova': cordovaDD,
        'sinon': sinonDD,
    };
    function computeAddTypeDefinitionProposals(languageService, resource, range, result) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, { lineNumber: range.endLineNumber, column: range.endColumn }), token = ts.findTokenOnLeftOfPosition(sourceFile, offset);
        if (!token || token.getWidth() === 0 || (network.schemas.inMemory === resource.scheme)) {
            return;
        }
        var currentWord = ts.getTextOfNode(token);
        if (exports.typingsMap.hasOwnProperty(currentWord)) {
            var mapping = exports.typingsMap[currentWord];
            var dtsRefs = Array.isArray(mapping) ? mapping : [mapping];
            dtsRefs.forEach(function (dtsRef, idx) {
                result.push({
                    command: {
                        id: 'ts.downloadDts',
                        title: nls.localize('typescript.quickfix.typeDefinitions', "Download type definition {0}", dtsRef.split('/')[1]),
                        arguments: [{ type: 'typedefinitions', name: dtsRef }]
                    },
                    score: idx
                });
            });
        }
        if (strings.endsWith(resource.path, '.js')) {
            result.push({
                command: {
                    id: 'ts.addAsGlobal',
                    title: nls.localize('typescript.quickfix.addAsGlobal', "Mark '{0}' as global", currentWord),
                    arguments: [{ type: 'addglobal', name: currentWord }]
                },
                score: 1
            });
        }
    }
});
//# sourceMappingURL=quickFix.js.map