/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/lib/typescriptServices', 'vs/base/common/severity', 'vs/languages/typescript/common/features/converter', 'vs/languages/typescript/common/lint/lint'], function (require, exports, ts, severity_1, converter, lint) {
    function getSyntacticDiagnostics(languageService, resource, compilerOptions, options, isJavaScript) {
        var markers = [];
        if (options.validate.enable && options.validate.syntaxValidation) {
            var filename = resource.toString(), diagnostics = languageService.getSyntacticDiagnostics(filename);
            if (isJavaScript) {
                var sourceFile = languageService.getSourceFile(filename);
                diagnostics.push.apply(diagnostics, _getJavaScriptSemanticDiagnostics(sourceFile, compilerOptions));
            }
            var classifier = createDiagnosticClassifier(options);
            for (var i = 0; i < diagnostics.length; i++) {
                _asMarker(diagnostics[i], classifier, markers);
            }
        }
        return markers;
    }
    exports.getSyntacticDiagnostics = getSyntacticDiagnostics;
    function getSemanticDiagnostics(languageService, resource, options) {
        var markers = [], hasMissingFiles = false;
        if (options.validate.enable && options.validate.semanticValidation) {
            var diagnostics = languageService.getSemanticDiagnostics(resource.toString()), unresolved = [], classifier = createDiagnosticClassifier(options);
            for (var i = 0; i < diagnostics.length; i++) {
                _asMarker(diagnostics[i], classifier, markers);
                hasMissingFiles = hasMissingFiles || diagnostics[i].code === 2307 || diagnostics[i].code === 6053;
            }
        }
        return {
            markers: markers,
            hasMissingFiles: hasMissingFiles
        };
    }
    exports.getSemanticDiagnostics = getSemanticDiagnostics;
    function getExtraDiagnostics(languageService, resource, options) {
        if (options.validate.enable === false || options.validate.semanticValidation === false) {
            return [];
        }
        return lint.check(options, languageService, resource).map(function (error) {
            return {
                message: error.message,
                severity: error.severity,
                startLineNumber: error.range.startLineNumber,
                startColumn: error.range.startColumn,
                endLineNumber: error.range.endLineNumber,
                endColumn: error.range.endColumn,
            };
        });
    }
    exports.getExtraDiagnostics = getExtraDiagnostics;
    var _categorySeverity = Object.create(null);
    _categorySeverity[ts.DiagnosticCategory.Error] = severity_1.default.Error;
    _categorySeverity[ts.DiagnosticCategory.Warning] = severity_1.default.Warning;
    _categorySeverity[ts.DiagnosticCategory.Message] = severity_1.default.Info;
    function createDiagnosticClassifier(options) {
        var map = Object.create(null);
        map[2403] = severity_1.default.fromValue(options.validate.lint.redeclaredVariables);
        map[2403] = severity_1.default.fromValue(options.validate.lint.redeclaredVariables);
        map[2304] = severity_1.default.fromValue(options.validate.lint.undeclaredVariables);
        map[2339] = severity_1.default.fromValue(options.validate.lint.unknownProperty);
        map[2459] = severity_1.default.fromValue(options.validate.lint.unknownProperty);
        map[2460] = severity_1.default.fromValue(options.validate.lint.unknownProperty);
        map[2306] = severity_1.default.fromValue(options.validate.lint.unknownModule);
        map[2307] = severity_1.default.fromValue(options.validate.lint.unknownModule);
        map[2322] = severity_1.default.fromValue(options.validate.lint.forcedTypeConversion);
        map[2323] = severity_1.default.fromValue(options.validate.lint.forcedTypeConversion);
        map[2345] = severity_1.default.fromValue(options.validate.lint.forcedTypeConversion);
        map[2362] = severity_1.default.fromValue(options.validate.lint.mixedTypesArithmetics);
        map[2363] = severity_1.default.fromValue(options.validate.lint.mixedTypesArithmetics);
        map[2365] = severity_1.default.fromValue(options.validate.lint.mixedTypesArithmetics);
        map[2356] = severity_1.default.fromValue(options.validate.lint.mixedTypesArithmetics);
        map[2357] = severity_1.default.fromValue(options.validate.lint.mixedTypesArithmetics);
        map[2359] = severity_1.default.fromValue(options.validate.lint.primitivesInInstanceOf);
        map[2358] = severity_1.default.fromValue(options.validate.lint.primitivesInInstanceOf);
        map[2350] = severity_1.default.fromValue(options.validate.lint.newOnReturningFunctions);
        map[2346] = severity_1.default.fromValue(options.validate.lint.parametersDontMatchSignature);
        map[1016] = severity_1.default.fromValue(options.validate.lint.parametersOptionalButNotLast);
        map[2335] = options.validate._surpressSuperWithoutSuperTypeError ? severity_1.default.Ignore : severity_1.default.Error;
        return function (diagnostic) {
            var result = map[diagnostic.code];
            return typeof result !== 'undefined' ? result : _categorySeverity[diagnostic.category];
        };
    }
    exports.createDiagnosticClassifier = createDiagnosticClassifier;
    function _asMarker(diagnostic, classifier, markers) {
        var severity = classifier(diagnostic);
        if (severity === severity_1.default.Ignore) {
            return;
        }
        var range = converter.getRange(diagnostic.file, diagnostic.start, diagnostic.start + diagnostic.length);
        markers.push({
            severity: severity,
            message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
            code: diagnostic.code.toString(),
            startLineNumber: range.startLineNumber,
            startColumn: range.startColumn,
            endLineNumber: range.endLineNumber,
            endColumn: range.endColumn
        });
    }
    // typescript checks
    function _getJavaScriptSemanticDiagnostics(sourceFile, options) {
        var diagnostics = [];
        walk(sourceFile);
        return diagnostics;
        function walk(node) {
            if (!node) {
                return false;
            }
            switch (node.kind) {
                case 78 /* ExportKeyword */:
                case 85 /* ImportKeyword */:
                    if (options.target !== 2 /* ES6 */) {
                        diagnostics.push(createDiagnosticForNode(node, true));
                        return;
                    }
                    break;
                // fall through on purpose
                case 211 /* ImportEqualsDeclaration */:
                    diagnostics.push(createDiagnosticForNode(node));
                    return true;
                case 217 /* ExportAssignment */:
                    if (node.isExportEquals) {
                        diagnostics.push(createDiagnosticForNode(node));
                    }
                    else if (options.target !== 2 /* ES6 */) {
                        diagnostics.push(createDiagnosticForNode(node, true));
                    }
                    return true;
                case 204 /* ClassDeclaration */:
                    var classDeclaration = node;
                    if (options.target !== 2 /* ES6 */) {
                        diagnostics.push(createDiagnosticForNode(classDeclaration, true));
                        return;
                    }
                    if (checkModifiers(classDeclaration.modifiers) ||
                        checkTypeParameters(classDeclaration.typeParameters)) {
                        return true;
                    }
                    break;
                case 225 /* HeritageClause */:
                    var heritageClause = node;
                    if (heritageClause.token === 102 /* ImplementsKeyword */) {
                        diagnostics.push(createDiagnosticForNode(node));
                        return true;
                    }
                    break;
                case 205 /* InterfaceDeclaration */:
                    diagnostics.push(createDiagnosticForNode(node));
                    return true;
                case 208 /* ModuleDeclaration */:
                    diagnostics.push(createDiagnosticForNode(node));
                    return true;
                case 206 /* TypeAliasDeclaration */:
                    diagnostics.push(createDiagnosticForNode(node));
                    return true;
                case 166 /* ArrowFunction */:
                    if (options.target !== 2 /* ES6 */) {
                        diagnostics.push(createDiagnosticForNode(node, true));
                    }
                case 136 /* MethodDeclaration */:
                case 135 /* MethodSignature */:
                case 137 /* Constructor */:
                case 138 /* GetAccessor */:
                case 139 /* SetAccessor */:
                case 165 /* FunctionExpression */:
                case 203 /* FunctionDeclaration */:
                case 203 /* FunctionDeclaration */:
                    var functionDeclaration = node;
                    if (checkModifiers(functionDeclaration.modifiers) ||
                        checkTypeParameters(functionDeclaration.typeParameters) ||
                        checkTypeAnnotation(functionDeclaration.type)) {
                        return true;
                    }
                    break;
                case 183 /* VariableStatement */:
                    if (options.target !== 2 /* ES6 */) {
                        if (/^const|^let/.test(node.getText())) {
                            diagnostics.push(createDiagnosticForNode(node, true));
                            return;
                        }
                    }
                    var variableStatement = node;
                    if (checkModifiers(variableStatement.modifiers)) {
                        return true;
                    }
                    break;
                case 201 /* VariableDeclaration */:
                    var variableDeclaration = node;
                    if (checkTypeAnnotation(variableDeclaration.type)) {
                        return true;
                    }
                    break;
                case 160 /* CallExpression */:
                case 161 /* NewExpression */:
                    var expression = node;
                    if (expression.typeArguments && expression.typeArguments.length > 0) {
                        var start = expression.typeArguments.pos;
                        diagnostics.push(createFileDiagnostic(sourceFile, start, expression.typeArguments.end - start));
                        return true;
                    }
                    break;
                case 131 /* Parameter */:
                    var parameter = node;
                    if (parameter.modifiers) {
                        var start = parameter.modifiers.pos;
                        diagnostics.push(createFileDiagnostic(sourceFile, start, parameter.modifiers.end - start));
                        return true;
                    }
                    if (parameter.questionToken) {
                        diagnostics.push(createDiagnosticForNode(parameter.questionToken));
                        return true;
                    }
                    if (parameter.type) {
                        diagnostics.push(createDiagnosticForNode(parameter.type));
                        return true;
                    }
                    if (options.target !== 2 /* ES6 */) {
                        if (parameter.initializer || parameter.dotDotDotToken) {
                            diagnostics.push(createDiagnosticForNode(parameter.initializer || parameter.dotDotDotToken, true));
                        }
                    }
                    break;
                case 134 /* PropertyDeclaration */:
                    diagnostics.push(createDiagnosticForNode(node));
                    return true;
                case 207 /* EnumDeclaration */:
                    diagnostics.push(createDiagnosticForNode(node));
                    return true;
                case 163 /* TypeAssertionExpression */:
                    var typeAssertionExpression = node;
                    diagnostics.push(createDiagnosticForNode(typeAssertionExpression.type));
                    return true;
                case 228 /* ShorthandPropertyAssignment */:
                    if (options.target !== 2 /* ES6 */) {
                        diagnostics.push(createDiagnosticForNode(node, true));
                    }
                    return true;
                case 132 /* Decorator */:
                    if (!options.experimentalDecorators) {
                        var diag = createDiagnosticForNode(node);
                        diag.messageText = 'Decorators is an experimental feature which must be enabled explicitly. Use a jsconfig.json file and the \'experimentalDecorators\' switch.';
                        diag.category = ts.DiagnosticCategory.Warning;
                        diagnostics.push(diag);
                    }
                    return true;
            }
            return ts.forEachChild(node, walk);
        }
        function checkTypeParameters(typeParameters) {
            if (typeParameters) {
                var start = typeParameters.pos;
                diagnostics.push(createFileDiagnostic(sourceFile, start, typeParameters.end - start));
                return true;
            }
            return false;
        }
        function checkTypeAnnotation(type) {
            if (type) {
                diagnostics.push(createDiagnosticForNode(type));
                return true;
            }
            return false;
        }
        function checkModifiers(modifiers) {
            if (modifiers) {
                modifiers.forEach(function (modifier) {
                    switch (modifier.kind) {
                        case 108 /* PublicKeyword */:
                        case 106 /* PrivateKeyword */:
                        case 107 /* ProtectedKeyword */:
                        case 115 /* DeclareKeyword */:
                            diagnostics.push(createDiagnosticForNode(modifier));
                            return true;
                        // These are all legal modifiers.
                        case 109 /* StaticKeyword */:
                        case 78 /* ExportKeyword */:
                        case 70 /* ConstKeyword */:
                        case 73 /* DefaultKeyword */:
                    }
                });
            }
            return false;
        }
        function createDiagnosticForNode(node, target) {
            if (target === void 0) { target = false; }
            return createFileDiagnostic(node.getSourceFile(), node.getStart(), node.getEnd() - node.getStart(), target);
        }
        function createFileDiagnostic(file, start, length, target) {
            if (target === void 0) { target = false; }
            return {
                file: file,
                start: start,
                length: length,
                messageText: !target
                    ? 'This can only be used in ts files.'
                    : 'This can only be used with ES6. Make sure to have a jsconfig.json file which sets the target to ES6.',
                category: ts.DiagnosticCategory.Error,
                code: -1
            };
        }
    }
});
//# sourceMappingURL=diagnostics.js.map