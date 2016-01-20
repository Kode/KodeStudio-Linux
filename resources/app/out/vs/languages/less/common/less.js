/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/editor/common/modes/monarch/monarch', 'vs/editor/common/modes/monarch/monarchCompile', 'vs/languages/less/common/lessTokenTypes', 'vs/editor/common/modes/supports', 'vs/platform/thread/common/threadService', 'vs/platform/instantiation/common/descriptors', 'vs/editor/common/services/modeService', 'vs/platform/instantiation/common/instantiation', 'vs/platform/thread/common/thread', 'vs/editor/common/services/modelService'], function (require, exports, winjs, Monarch, Compile, lessTokenTypes, supports, threadService_1, descriptors_1, modeService_1, instantiation_1, thread_1, modelService_1) {
    exports.language = {
        displayName: 'LESS',
        name: 'less',
        // TODO@Martin: This definition does not work with umlauts for example
        wordDefinition: /(#?-?\d*\.\d\w*%?)|([@#!.:]?[\w-?]+%?)|[@#!.]/g,
        defaultToken: '',
        lineComment: '//',
        blockCommentStart: '/*',
        blockCommentEnd: '*/',
        identifier: '-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',
        identifierPlus: '-?-?([a-zA-Z:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',
        brackets: [
            { open: '{', close: '}', token: 'punctuation.curly' },
            { open: '[', close: ']', token: 'punctuation.bracket' },
            { open: '(', close: ')', token: 'punctuation.parenthesis' },
            { open: '<', close: '>', token: 'punctuation.angle' }
        ],
        tokenizer: {
            root: [
                { include: '@nestedJSBegin' },
                ['[ \\t\\r\\n]+', ''],
                { include: '@comments' },
                { include: '@keyword' },
                { include: '@strings' },
                { include: '@numbers' },
                ['[*_]?[a-zA-Z\\-\\s]+(?=:.*(;|(\\\\$)))', lessTokenTypes.TOKEN_PROPERTY, '@attribute'],
                ['url(\\-prefix)?\\(', { token: 'function', bracket: '@open', next: '@urldeclaration' }],
                ['[{}()\\[\\]]', '@brackets'],
                ['[,:;]', 'punctuation'],
                ['#@identifierPlus', lessTokenTypes.TOKEN_SELECTOR + '.id'],
                ['&', lessTokenTypes.TOKEN_SELECTOR_TAG],
                ['\\.@identifierPlus(?=\\()', lessTokenTypes.TOKEN_SELECTOR + '.class', '@attribute'],
                ['\\.@identifierPlus', lessTokenTypes.TOKEN_SELECTOR + '.class'],
                ['@identifierPlus', lessTokenTypes.TOKEN_SELECTOR_TAG],
                { include: '@operators' },
                ['@(@identifier(?=[:,\\)]))', 'variable', '@attribute'],
                ['@(@identifier)', 'variable'],
                ['@', 'key', '@atRules']
            ],
            nestedJSBegin: [
                ['``', 'punctuation.backtick'],
                ['`', { token: 'punctuation.backtick', bracket: '@open', next: '@nestedJSEnd', nextEmbedded: 'text/javascript' }],
            ],
            nestedJSEnd: [
                ['`', { token: 'punctuation.backtick', bracket: '@close', next: '@pop' }],
                ['.', { token: '@rematch', next: '@javascript_block' }],
            ],
            javascript_block: [
                ['`', { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
            ],
            operators: [
                ['[<>=\\+\\-\\*\\/\\^\\|\\~]', 'operator']
            ],
            keyword: [
                ['(@[\\s]*import|![\\s]*important|true|false|when|iscolor|isnumber|isstring|iskeyword|isurl|ispixel|ispercentage|isem|hue|saturation|lightness|alpha|lighten|darken|saturate|desaturate|fadein|fadeout|fade|spin|mix|round|ceil|floor|percentage)\\b', 'keyword']
            ],
            urldeclaration: [
                { include: '@strings' },
                ['[^)\r\n]+', 'string'],
                ['\\)', { token: 'tag', bracket: '@close', next: '@pop' }],
            ],
            attribute: [
                { include: '@nestedJSBegin' },
                { include: '@comments' },
                { include: '@strings' },
                { include: '@numbers' },
                { include: '@keyword' },
                ['[a-zA-Z\\-]+(?=\\()', lessTokenTypes.TOKEN_VALUE, '@attribute'],
                ['>', 'operator', '@pop'],
                ['@identifier', lessTokenTypes.TOKEN_VALUE],
                { include: '@operators' },
                ['@(@identifier)', 'variable'],
                ['[)\\}]', '@brackets', '@pop'],
                ['[{}()\\[\\]>]', '@brackets'],
                ['[;]', 'punctuation', '@pop'],
                ['[,=:]', 'punctuation'],
                ['\\s', ''],
                ['.', lessTokenTypes.TOKEN_VALUE]
            ],
            comments: [
                ['\\/\\*', 'comment', '@comment'],
                ['\\/\\/+.*', 'comment'],
            ],
            comment: [
                ['\\*\\/', 'comment', '@pop'],
                ['.', 'comment'],
            ],
            numbers: [
                ['(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?', { token: lessTokenTypes.TOKEN_VALUE + '.numeric', next: '@units' }],
                ['#[0-9a-fA-F_]+(?!\\w)', lessTokenTypes.TOKEN_VALUE + '.rgb-value']
            ],
            units: [
                ['((em|ex|ch|rem|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)\\b)?', lessTokenTypes.TOKEN_VALUE + '.unit', '@pop']
            ],
            strings: [
                ['~?"', { token: 'string.punctuation', bracket: '@open', next: '@stringsEndDoubleQuote' }],
                ['~?\'', { token: 'string.punctuation', bracket: '@open', next: '@stringsEndQuote' }]
            ],
            stringsEndDoubleQuote: [
                ['\\\\"', 'string'],
                ['"', { token: 'string.punctuation', next: '@popall', bracket: '@close' }],
                ['.', 'string']
            ],
            stringsEndQuote: [
                ['\\\\\'', 'string'],
                ['\'', { token: 'string.punctuation', next: '@popall', bracket: '@close' }],
                ['.', 'string']
            ],
            atRules: [
                { include: '@comments' },
                { include: '@strings' },
                ['[()]', 'punctuation'],
                ['[\\{;]', 'punctuation', '@pop'],
                ['.', 'key']
            ]
        }
    };
    var LESSMode = (function (_super) {
        __extends(LESSMode, _super);
        function LESSMode(descriptor, instantiationService, threadService, modeService, modelService) {
            var _this = this;
            _super.call(this, descriptor, Compile.compile(exports.language), instantiationService, threadService, modeService, modelService);
            this.modeService = modeService;
            this.extraInfoSupport = this;
            this.referenceSupport = new supports.ReferenceSupport(this, {
                tokens: [lessTokenTypes.TOKEN_PROPERTY + '.less', lessTokenTypes.TOKEN_VALUE + '.less', 'variable.less', lessTokenTypes.TOKEN_SELECTOR + '.class.less', lessTokenTypes.TOKEN_SELECTOR + '.id.less', 'selector.less'],
                findReferences: function (resource, position, /*unused*/ includeDeclaration) { return _this.findReferences(resource, position); } });
            this.logicalSelectionSupport = this;
            this.declarationSupport = new supports.DeclarationSupport(this, {
                tokens: ['variable.less', lessTokenTypes.TOKEN_SELECTOR + '.class.less', lessTokenTypes.TOKEN_SELECTOR + '.id.less', 'selector.less'],
                findDeclaration: function (resource, position) { return _this.findDeclaration(resource, position); } });
            this.outlineSupport = this;
            this.suggestSupport = new supports.SuggestSupport(this, {
                triggerCharacters: [],
                excludeTokens: ['comment.less', 'string.less'],
                suggest: function (resource, position) { return _this.suggest(resource, position); } });
        }
        LESSMode.prototype._getWorkerDescriptor = function () {
            return descriptors_1.createAsyncDescriptor2('vs/languages/less/common/lessWorker', 'LessWorker');
        };
        LESSMode.prototype._worker = function (runner) {
            var _this = this;
            // TODO@Alex: workaround for missing `bundles` config, before instantiating the lessWorker, we ensure the cssWorker has been loaded
            return this.modeService.getOrCreateMode('css').then(function (cssMode) {
                return cssMode._worker(function (worker) { return winjs.TPromise.as(true); });
            }).then(function () {
                return _super.prototype._worker.call(_this, runner);
            });
        };
        LESSMode.prototype.findReferences = function (resource, position) {
            return this._worker(function (w) { return w.findReferences(resource, position); });
        };
        LESSMode.prototype.getRangesToPosition = function (resource, position) {
            return this._worker(function (w) { return w.getRangesToPosition(resource, position); });
        };
        LESSMode.prototype.computeInfo = function (resource, position) {
            return this._worker(function (w) { return w.computeInfo(resource, position); });
        };
        LESSMode.prototype.getOutline = function (resource) {
            return this._worker(function (w) { return w.getOutline(resource); });
        };
        LESSMode.prototype.findDeclaration = function (resource, position) {
            return this._worker(function (w) { return w.findDeclaration(resource, position); });
        };
        LESSMode.prototype.findColorDeclarations = function (resource) {
            return this._worker(function (w) { return w.findColorDeclarations(resource); });
        };
        LESSMode.$findReferences = threadService_1.OneWorkerAttr(LESSMode, LESSMode.prototype.findReferences);
        LESSMode.$getRangesToPosition = threadService_1.OneWorkerAttr(LESSMode, LESSMode.prototype.getRangesToPosition);
        LESSMode.$computeInfo = threadService_1.OneWorkerAttr(LESSMode, LESSMode.prototype.computeInfo);
        LESSMode.$getOutline = threadService_1.OneWorkerAttr(LESSMode, LESSMode.prototype.getOutline);
        LESSMode.$findDeclaration = threadService_1.OneWorkerAttr(LESSMode, LESSMode.prototype.findDeclaration);
        LESSMode.$findColorDeclarations = threadService_1.OneWorkerAttr(LESSMode, LESSMode.prototype.findColorDeclarations);
        LESSMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService),
            __param(3, modeService_1.IModeService),
            __param(4, modelService_1.IModelService)
        ], LESSMode);
        return LESSMode;
    })(Monarch.MonarchMode);
    exports.LESSMode = LESSMode;
});
//# sourceMappingURL=less.js.map