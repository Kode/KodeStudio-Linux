/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/winjs.base', 'vs/editor/test/common/servicesTestUtils', 'vs/editor/common/modes', 'vs/editor/common/modes/monarch/monarchCompile', 'vs/editor/common/modes/monarch/monarchLexer', 'vs/editor/test/common/modesTestUtils', 'vs/editor/common/model/model'], function (require, exports, assert, winjs_base_1, servicesUtil, modes, monarchCompile, monarchLexer, modesTestUtils_1, model_1) {
    function createOnElectricCharacter(mode) {
        return function onElectricCharacter(line, offset, state) {
            state = state || mode.tokenizationSupport.getInitialState();
            var lineTokens = mode.tokenizationSupport.tokenize(line, state);
            return mode.electricCharacterSupport.onElectricCharacter(modesTestUtils_1.createLineContext(line, lineTokens), offset);
        };
    }
    exports.createOnElectricCharacter = createOnElectricCharacter;
    function assertWords(actual, expected, message) {
        assert.deepEqual(actual, expected, message);
    }
    exports.assertWords = assertWords;
    function createOnEnter(mode) {
        return function onEnter(line, offset, state) {
            state = state || mode.tokenizationSupport.getInitialState();
            var lineTokens = mode.tokenizationSupport.tokenize(line, state);
            return mode.electricCharacterSupport.onEnter(modesTestUtils_1.createLineContext(line, lineTokens), offset);
        };
    }
    exports.createOnEnter = createOnEnter;
    function load(modeId, preloadModes) {
        if (preloadModes === void 0) { preloadModes = []; }
        var toLoad = [].concat(preloadModes).concat([modeId]);
        var modeService = servicesUtil.createMockModeService();
        var promises = toLoad.map(function (modeId) { return modeService.getOrCreateMode(modeId); });
        return winjs_base_1.TPromise.join(promises).then(function (modes) {
            return modes[modes.length - 1];
        });
    }
    exports.load = load;
    function assertTokenization(tokenizationSupport, tests) {
        var state = tokenizationSupport.getInitialState();
        for (var i = 0, len = tests.length; i < len; i++) {
            assert.ok(true, tests[i].line);
            var result = tokenizationSupport.tokenize(tests[i].line, state);
            if (tests[i].tokens) {
                assert.deepEqual(generateRelaxedTokens(result.tokens, tests[i].tokens), tests[i].tokens, JSON.stringify(result.tokens, null, '\t'));
            }
            state = result.endState;
        }
    }
    exports.assertTokenization = assertTokenization;
    var SimpleMode = (function () {
        function SimpleMode(id) {
            this._id = id;
        }
        SimpleMode.prototype.getId = function () {
            return this._id;
        };
        SimpleMode.prototype.toSimplifiedMode = function () {
            return this;
        };
        return SimpleMode;
    })();
    function createOnEnterAsserter(modeId, onEnterSupport) {
        var assertOne = function (oneLineAboveText, beforeText, afterText, expected) {
            var model = new model_1.Model([oneLineAboveText, beforeText + afterText].join('\n'), new SimpleMode(modeId));
            var actual = onEnterSupport.onEnter(model, { lineNumber: 2, column: beforeText.length + 1 });
            if (expected === modes.IndentAction.None) {
                assert.equal(actual, null, oneLineAboveText + '\\n' + beforeText + '|' + afterText);
            }
            else {
                assert.equal(actual.indentAction, expected, oneLineAboveText + '\\n' + beforeText + '|' + afterText);
            }
            model.dispose();
        };
        return {
            nothing: function (oneLineAboveText, beforeText, afterText) {
                assertOne(oneLineAboveText, beforeText, afterText, modes.IndentAction.None);
            },
            indents: function (oneLineAboveText, beforeText, afterText) {
                assertOne(oneLineAboveText, beforeText, afterText, modes.IndentAction.Indent);
            },
            outdents: function (oneLineAboveText, beforeText, afterText) {
                assertOne(oneLineAboveText, beforeText, afterText, modes.IndentAction.Outdent);
            },
            indentsOutdents: function (oneLineAboveText, beforeText, afterText) {
                assertOne(oneLineAboveText, beforeText, afterText, modes.IndentAction.IndentOutdent);
            }
        };
    }
    exports.createOnEnterAsserter = createOnEnterAsserter;
    function executeTests(tokenizationSupport, tests) {
        for (var i = 0, len = tests.length; i < len; i++) {
            assert.ok(true, 'TEST #' + i);
            executeTest(tokenizationSupport, tests[i]);
        }
    }
    exports.executeTests = executeTests;
    function executeMonarchTokenizationTests(name, language, tests) {
        var lexer = monarchCompile.compile(language);
        var modeService = servicesUtil.createMockModeService();
        var tokenizationSupport = monarchLexer.createTokenizationSupport(modeService, new SimpleMode('mock.mode'), lexer);
        executeTests(tokenizationSupport, tests);
    }
    exports.executeMonarchTokenizationTests = executeMonarchTokenizationTests;
    function generateRelaxedTokens(actualTokens, expectedTokens) {
        var r = actualTokens.map(function (token, index) {
            // Remove bracket if it's missing in expectedTokens too
            if (expectedTokens[index] && typeof expectedTokens[index].bracket !== 'undefined') {
                return {
                    startIndex: token.startIndex,
                    type: token.type,
                    bracket: token.bracket
                };
            }
            else {
                return {
                    startIndex: token.startIndex,
                    type: token.type
                };
            }
        });
        return r;
    }
    function executeTest(tokenizationSupport, tests) {
        var state = tokenizationSupport.getInitialState();
        for (var i = 0, len = tests.length; i < len; i++) {
            assert.ok(true, tests[i].line);
            var result = tokenizationSupport.tokenize(tests[i].line, state);
            if (tests[i].tokens) {
                assertTokens(result.tokens, tests[i].tokens, 'Tokenizing line ' + tests[i].line);
            }
            state = result.endState;
        }
    }
    function assertTokens(actual, expected, message) {
        assert.deepEqual(generateRelaxedTokens(actual, expected), expected, message + ': ' + JSON.stringify(actual, null, '\t'));
    }
});
//# sourceMappingURL=modesUtil.js.map