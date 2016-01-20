/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/uri', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/common/modulePaths', 'vs/languages/typescript/common/features/converter'], function (require, exports, uri_1, ts, modulePaths, converter) {
    function tripleSlashLinkFinder(sourceFile, offset) {
        // maybe inside ///-ref-comment
        for (var i = 0, len = sourceFile.referencedFiles.length; i < len; i++) {
            var reference = sourceFile.referencedFiles[i];
            if (offset >= reference.pos && offset < reference.end) {
                return {
                    path: reference.fileName,
                    external: false
                };
            }
        }
    }
    function importRequireLinkFinder(sourceFile, offset) {
        // check string literals inside import declarations
        var token = ts.getTokenAtPosition(sourceFile, offset);
        if (token.kind === 8 /* StringLiteral */ && token.parent.kind === 222 /* ExternalModuleReference */) {
            return {
                path: token.text,
                external: true
            };
        }
    }
    function requireFunctionLinkFinder(sourceFile, offset) {
        // check string literals inside require-calls
        var token = ts.getTokenAtPosition(sourceFile, offset);
        if (token.kind !== 8 /* StringLiteral */) {
            return;
        }
        if (token.parent.kind !== 160 /* CallExpression */) {
            return;
        }
        if (ts.getTextOfNode(token.parent.expression) !== 'require') {
            return;
        }
        return {
            path: token.text,
            external: true
        };
    }
    function amdDependencyArrayLinkFinder(sourceFile, offset) {
        // check string literals inside string arrays
        var token = ts.getTokenAtPosition(sourceFile, offset);
        if (token.kind !== 8 /* StringLiteral */) {
            return;
        }
        if (token.parent.kind !== 156 /* ArrayLiteralExpression */) {
            return;
        }
        return {
            path: token.text,
            external: true
        };
    }
    function findLink(sourceFile, filename, position, host, moduleRoot) {
        var offset = converter.getOffset(sourceFile, position), ref, finder = [tripleSlashLinkFinder, importRequireLinkFinder, requireFunctionLinkFinder, amdDependencyArrayLinkFinder];
        for (var i = 0; !ref && i < finder.length; i++) {
            ref = finder[i](sourceFile, offset);
        }
        if (!ref) {
            return null;
        }
        // potential paths
        var path = ref.external ?
            modulePaths.external(ref.path, filename, moduleRoot) :
            modulePaths.internal(ref.path, filename);
        var candidate;
        if (host.getScriptSnapshot(path.value)) {
            candidate = path.value;
        }
        else if (path.alternateValue && host.getScriptSnapshot(path.alternateValue)) {
            candidate = path.alternateValue;
        }
        if (!candidate) {
            return null;
        }
        return {
            resource: uri_1.default.parse(candidate),
            range: { startLineNumber: 1, startColumn: 1, endLineNumber: Number.MAX_VALUE, endColumn: Number.MAX_VALUE }
        };
    }
    exports.findLink = findLink;
});
//# sourceMappingURL=moduleLinks.js.map