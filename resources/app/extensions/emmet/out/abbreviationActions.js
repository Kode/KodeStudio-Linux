"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("./util");
const vscode_emmet_helper_1 = require("vscode-emmet-helper");
const trimRegex = /[\u00a0]*[\d|#|\-|\*|\u2022]+\.?/;
function wrapWithAbbreviation(args) {
    if (!util_1.validate(false)) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    const abbreviationPromise = (args && args['abbreviation']) ? Promise.resolve(args['abbreviation']) : vscode.window.showInputBox({ prompt: 'Enter Abbreviation' });
    const syntax = getSyntaxFromArgs({ language: editor.document.languageId });
    return abbreviationPromise.then(abbreviation => {
        if (!abbreviation || !abbreviation.trim() || !vscode_emmet_helper_1.isAbbreviationValid(syntax, abbreviation)) {
            return;
        }
        let expandAbbrList = [];
        editor.selections.forEach(selection => {
            let rangeToReplace = selection.isReversed ? new vscode.Range(selection.active, selection.anchor) : selection;
            if (rangeToReplace.isEmpty) {
                rangeToReplace = new vscode.Range(rangeToReplace.start.line, 0, rangeToReplace.start.line, editor.document.lineAt(rangeToReplace.start.line).text.length);
            }
            const firstLineOfSelection = editor.document.lineAt(rangeToReplace.start).text.substr(rangeToReplace.start.character);
            const matches = firstLineOfSelection.match(/^(\s*)/);
            const preceedingWhiteSpace = matches ? matches[1].length : 0;
            rangeToReplace = new vscode.Range(rangeToReplace.start.line, rangeToReplace.start.character + preceedingWhiteSpace, rangeToReplace.end.line, rangeToReplace.end.character);
            expandAbbrList.push({ syntax, abbreviation, rangeToReplace, textToWrap: ['\n\t\$TM_SELECTED_TEXT\n'] });
        });
        return expandAbbreviationInRange(editor, expandAbbrList, true);
    });
}
exports.wrapWithAbbreviation = wrapWithAbbreviation;
function wrapIndividualLinesWithAbbreviation(args) {
    if (!util_1.validate(false)) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    if (editor.selection.isEmpty) {
        vscode.window.showInformationMessage('Select more than 1 line and try again.');
        return;
    }
    const abbreviationPromise = (args && args['abbreviation']) ? Promise.resolve(args['abbreviation']) : vscode.window.showInputBox({ prompt: 'Enter Abbreviation' });
    const syntax = getSyntaxFromArgs({ language: editor.document.languageId });
    const lines = editor.document.getText(editor.selection).split('\n').map(x => x.trim());
    return abbreviationPromise.then(inputAbbreviation => {
        if (!inputAbbreviation || !inputAbbreviation.trim() || !vscode_emmet_helper_1.isAbbreviationValid(syntax, inputAbbreviation)) {
            return;
        }
        let { abbreviation, filters } = vscode_emmet_helper_1.extractAbbreviationFromText(inputAbbreviation);
        let input = {
            syntax,
            abbreviation,
            rangeToReplace: editor.selection,
            textToWrap: lines,
            filters
        };
        return expandAbbreviationInRange(editor, [input], true);
    });
}
exports.wrapIndividualLinesWithAbbreviation = wrapIndividualLinesWithAbbreviation;
function expandEmmetAbbreviation(args) {
    const syntax = getSyntaxFromArgs(args);
    if (!syntax || !util_1.validate()) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    let rootNode = util_1.parseDocument(editor.document);
    if (!rootNode) {
        return;
    }
    let abbreviationList = [];
    let firstAbbreviation;
    let allAbbreviationsSame = true;
    let getAbbreviation = (document, selection, position, isHtml) => {
        let rangeToReplace = selection;
        let abbr = document.getText(rangeToReplace);
        if (!rangeToReplace.isEmpty) {
            let { abbreviation, filters } = vscode_emmet_helper_1.extractAbbreviationFromText(abbr);
            return [rangeToReplace, abbreviation, filters];
        }
        // Expand cases like <div to <div></div> explicitly
        // else we will end up with <<div></div>
        if (isHtml) {
            const currentLine = editor.document.lineAt(position.line).text;
            const textTillPosition = currentLine.substr(0, position.character);
            let matches = textTillPosition.match(/<(\w+)$/);
            if (matches) {
                abbr = matches[1];
                rangeToReplace = new vscode.Range(position.translate(0, -(abbr.length + 1)), position);
                return [rangeToReplace, abbr, []];
            }
        }
        let { abbreviationRange, abbreviation, filters } = vscode_emmet_helper_1.extractAbbreviation(editor.document, position);
        return [new vscode.Range(abbreviationRange.start.line, abbreviationRange.start.character, abbreviationRange.end.line, abbreviationRange.end.character), abbreviation, filters];
    };
    editor.selections.forEach(selection => {
        let position = selection.isReversed ? selection.anchor : selection.active;
        let [rangeToReplace, abbreviation, filters] = getAbbreviation(editor.document, selection, position, syntax === 'html');
        if (!vscode_emmet_helper_1.isAbbreviationValid(syntax, abbreviation)) {
            vscode.window.showErrorMessage('Emmet: Invalid abbreviation');
            return;
        }
        let currentNode = util_1.getNode(rootNode, position);
        if (!isValidLocationForEmmetAbbreviation(currentNode, syntax, position)) {
            return;
        }
        if (!firstAbbreviation) {
            firstAbbreviation = abbreviation;
        }
        else if (allAbbreviationsSame && firstAbbreviation !== abbreviation) {
            allAbbreviationsSame = false;
        }
        abbreviationList.push({ syntax, abbreviation, rangeToReplace, filters });
    });
    return expandAbbreviationInRange(editor, abbreviationList, allAbbreviationsSame);
}
exports.expandEmmetAbbreviation = expandEmmetAbbreviation;
/**
 * Checks if given position is a valid location to expand emmet abbreviation.
 * Works only on html and css/less/scss syntax
 * @param currentNode parsed node at given position
 * @param syntax syntax of the abbreviation
 * @param position position to validate
 */
function isValidLocationForEmmetAbbreviation(currentNode, syntax, position) {
    if (!currentNode) {
        return !vscode_emmet_helper_1.isStyleSheet(syntax);
    }
    if (vscode_emmet_helper_1.isStyleSheet(syntax)) {
        if (currentNode.type !== 'rule') {
            return true;
        }
        const currentCssNode = currentNode;
        // Workaround for https://github.com/Microsoft/vscode/30188
        if (currentCssNode.parent
            && currentCssNode.parent.type === 'rule'
            && currentCssNode.selectorToken
            && currentCssNode.selectorToken.start.line !== currentCssNode.selectorToken.end.line) {
            return true;
        }
        // Position is valid if it occurs after the `{` that marks beginning of rule contents
        return currentCssNode.selectorToken && position.isAfter(currentCssNode.selectorToken.end);
    }
    const currentHtmlNode = currentNode;
    if (currentHtmlNode.close) {
        return util_1.getInnerRange(currentHtmlNode).contains(position);
    }
    return false;
}
exports.isValidLocationForEmmetAbbreviation = isValidLocationForEmmetAbbreviation;
/**
 * Expands abbreviations as detailed in expandAbbrList in the editor
 * @param editor
 * @param expandAbbrList
 * @param insertSameSnippet
 */
function expandAbbreviationInRange(editor, expandAbbrList, insertSameSnippet) {
    if (!expandAbbrList || expandAbbrList.length === 0) {
        return;
    }
    // Snippet to replace at multiple cursors are not the same
    // `editor.insertSnippet` will have to be called for each instance separately
    // We will not be able to maintain multiple cursors after snippet insertion
    let insertPromises = [];
    if (!insertSameSnippet) {
        expandAbbrList.forEach((expandAbbrInput) => {
            let expandedText = expandAbbr(expandAbbrInput);
            if (expandedText) {
                insertPromises.push(editor.insertSnippet(new vscode.SnippetString(expandedText), expandAbbrInput.rangeToReplace));
            }
        });
        return Promise.all(insertPromises).then(() => Promise.resolve(true));
    }
    // Snippet to replace at all cursors are the same
    // We can pass all ranges to `editor.insertSnippet` in a single call so that
    // all cursors are maintained after snippet insertion
    const anyExpandAbbrInput = expandAbbrList[0];
    let expandedText = expandAbbr(anyExpandAbbrInput);
    let allRanges = expandAbbrList.map(value => {
        return new vscode.Range(value.rangeToReplace.start.line, value.rangeToReplace.start.character, value.rangeToReplace.end.line, value.rangeToReplace.end.character);
    });
    if (expandedText) {
        return editor.insertSnippet(new vscode.SnippetString(expandedText), allRanges);
    }
}
/**
 * Expands abbreviation as detailed in given input.
 */
function expandAbbr(input) {
    const emmetConfig = vscode.workspace.getConfiguration('emmet');
    const expandOptions = vscode_emmet_helper_1.getExpandOptions(input.syntax, emmetConfig['syntaxProfiles'], emmetConfig['variables'], input.filters);
    if (input.textToWrap) {
        if (input.filters && input.filters.indexOf('t') > -1) {
            input.textToWrap = input.textToWrap.map(line => {
                return line.replace(trimRegex, '').trim();
            });
        }
        expandOptions['text'] = input.textToWrap;
        // Below fixes https://github.com/Microsoft/vscode/issues/29898
        // With this, Emmet formats inline elements as block elements
        // ensuring the wrapped multi line text does not get merged to a single line
        if (!input.rangeToReplace.isSingleLine) {
            expandOptions.profile['inlineBreak'] = 1;
        }
    }
    try {
        // Expand the abbreviation
        let expandedText = vscode_emmet_helper_1.expandAbbreviation(input.abbreviation, expandOptions);
        // If the expanded text is single line then we dont need the \t we added to $TM_SELECTED_TEXT earlier
        if (input.textToWrap && input.textToWrap.length === 1 && expandedText.indexOf('\n') === -1) {
            expandedText = expandedText.replace(/\s*\$TM_SELECTED_TEXT\s*/, '\$TM_SELECTED_TEXT');
        }
        return expandedText;
    }
    catch (e) {
        vscode.window.showErrorMessage('Failed to expand abbreviation');
    }
}
function getSyntaxFromArgs(args) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active.');
        return;
    }
    const mappedModes = util_1.getMappingForIncludedLanguages();
    let language = (!args || typeof args !== 'object' || !args['language']) ? editor.document.languageId : args['language'];
    let parentMode = (args && typeof args === 'object') ? args['parentMode'] : undefined;
    let excludedLanguages = vscode.workspace.getConfiguration('emmet')['excludeLanguages'] ? vscode.workspace.getConfiguration('emmet')['excludeLanguages'] : [];
    let syntax = vscode_emmet_helper_1.getEmmetMode((mappedModes[language] ? mappedModes[language] : language), excludedLanguages);
    if (!syntax) {
        syntax = vscode_emmet_helper_1.getEmmetMode((mappedModes[parentMode] ? mappedModes[parentMode] : parentMode), excludedLanguages);
    }
    // Final fallback to html
    if (!syntax) {
        syntax = vscode_emmet_helper_1.getEmmetMode('html', excludedLanguages);
    }
    return syntax;
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/emmet/out/abbreviationActions.js.map
