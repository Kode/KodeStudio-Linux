"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_1 = require("vscode");
const testUtils_1 = require("./testUtils");
const updateImageSize_1 = require("../updateImageSize");
const path = require("path");
suite('Tests for Emmet actions on html tags', () => {
    teardown(testUtils_1.closeAllEditors);
    const filePath = path.join(__dirname, '../../../../resources/linux/code.png');
    test('update image css with multiple cursors in css file', () => {
        const cssContents = `
		.one {
			margin: 10px;
			padding: 10px;
			background-image: url(https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png);
		}
		.two {
			background-image: url(https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png);
			height: 42px;
		}
		.three {
			background-image: url(${filePath});
			width: 42px;
		}
	`;
        const expectedContents = `
		.one {
			margin: 10px;
			padding: 10px;
			background-image: url(https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png);
			width: 32px;
			height: 32px;
		}
		.two {
			background-image: url(https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png);
			width: 32px;
			height: 32px;
		}
		.three {
			background-image: url(${filePath});
			height: 1024px;
			width: 1024px;
		}
	`;
        return testUtils_1.withRandomFileEditor(cssContents, 'css', (editor, doc) => {
            editor.selections = [
                new vscode_1.Selection(4, 50, 4, 50),
                new vscode_1.Selection(7, 50, 7, 50),
                new vscode_1.Selection(11, 50, 11, 50)
            ];
            return updateImageSize_1.updateImageSize().then(() => {
                assert.equal(doc.getText(), expectedContents);
                return Promise.resolve();
            });
        });
    });
    test('update image size in css in html file with multiple cursors', () => {
        const htmlWithCssContents = `
		<html>
			<style>
				.one {
					margin: 10px;
					padding: 10px;
					background-image: url(https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png);
				}
				.two {
					background-image: url(https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png);
					height: 42px;
				}
				.three {
					background-image: url(${filePath});
					width: 42px;
				}
			</style>
		</html>
	`;
        const expectedContents = `
		<html>
			<style>
				.one {
					margin: 10px;
					padding: 10px;
					background-image: url(https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png);
					width: 32px;
					height: 32px;
				}
				.two {
					background-image: url(https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png);
					width: 32px;
					height: 32px;
				}
				.three {
					background-image: url(${filePath});
					height: 1024px;
					width: 1024px;
				}
			</style>
		</html>
	`;
        return testUtils_1.withRandomFileEditor(htmlWithCssContents, 'html', (editor, doc) => {
            editor.selections = [
                new vscode_1.Selection(6, 50, 6, 50),
                new vscode_1.Selection(9, 50, 9, 50),
                new vscode_1.Selection(13, 50, 13, 50)
            ];
            return updateImageSize_1.updateImageSize().then(() => {
                assert.equal(doc.getText(), expectedContents);
                return Promise.resolve();
            });
        });
    });
    test('update image size in img tag in html file with multiple cursors', () => {
        const htmlwithimgtag = `
		<html>
			<img id="one" src="${filePath}" />
			<img id="two" src="https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png" width="56" />
			<img id="three" src="https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png" height="56" />
		</html>
	`;
        const expectedContents = `
		<html>
			<img id="one" src="${filePath}" width="1024" height="1024" />
			<img id="two" src="https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png" width="32" height="32" />
			<img id="three" src="https://github.com/Microsoft/vscode/blob/master/resources/linux/code.png" height="32" width="32" />
		</html>
	`;
        return testUtils_1.withRandomFileEditor(htmlwithimgtag, 'html', (editor, doc) => {
            editor.selections = [
                new vscode_1.Selection(2, 50, 2, 50),
                new vscode_1.Selection(3, 50, 3, 50),
                new vscode_1.Selection(4, 50, 4, 50)
            ];
            return updateImageSize_1.updateImageSize().then(() => {
                assert.equal(doc.getText(), expectedContents);
                return Promise.resolve();
            });
        });
    });
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/emmet/out/test/updateImageSize.test.js.map
