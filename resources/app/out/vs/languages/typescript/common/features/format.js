/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/features/converter'], function (require, exports, converter) {
    function formatDocument(languageService, resource, options) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename);
        return languageService.getFormattingEditsForDocument(filename, createFormatCodeOptions(options)).map(function (edit) {
            return {
                text: edit.newText,
                range: converter.getRange(sourceFile, edit.span)
            };
        });
    }
    exports.formatDocument = formatDocument;
    function formatRange(languageService, resource, range, options) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), minChar = converter.getStartOffset(sourceFile, range), limChar = converter.getEndOffset(sourceFile, range);
        return languageService.getFormattingEditsForRange(filename, minChar, limChar, createFormatCodeOptions(options)).map(function (edit) {
            // convert TypeScript edit into Monaco edit
            return {
                text: edit.newText,
                range: converter.getRange(sourceFile, edit.span)
            };
        });
    }
    exports.formatRange = formatRange;
    function formatAfterKeystroke(languageService, resource, position, ch, options) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, position);
        return languageService.getFormattingEditsAfterKeystroke(filename, offset, ch, createFormatCodeOptions(options)).map(function (edit) {
            // convert TypeScript edit into Monaco edit
            return {
                text: edit.newText,
                range: converter.getRange(sourceFile, edit.span)
            };
        });
    }
    exports.formatAfterKeystroke = formatAfterKeystroke;
    function createFormatCodeOptions(options) {
        return {
            IndentSize: options.tabSize,
            TabSize: options.tabSize,
            NewLineCharacter: '\n',
            ConvertTabsToSpaces: options.insertSpaces,
            InsertSpaceAfterCommaDelimiter: true,
            InsertSpaceAfterSemicolonInForStatements: true,
            InsertSpaceBeforeAndAfterBinaryOperators: true,
            InsertSpaceAfterKeywordsInControlFlowStatements: true,
            InsertSpaceAfterFunctionKeywordForAnonymousFunctions: true,
            InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
            PlaceOpenBraceOnNewLineForFunctions: false,
            PlaceOpenBraceOnNewLineForControlBlocks: false
        };
    }
});
//# sourceMappingURL=format.js.map