/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/objects'], function (require, exports, objects) {
    var Options;
    (function (Options) {
        Options.typeScriptOptions = Object.freeze({
            suggest: {
                alwaysAllWords: false,
                useCodeSnippetsOnMethodSuggest: false
            },
            validate: {
                enable: true,
                semanticValidation: true,
                syntaxValidation: true,
                _surpressSuperWithoutSuperTypeError: false,
                lint: {
                    comparisonOperatorsNotStrict: 'ignore',
                    curlyBracketsMustNotBeOmitted: 'ignore',
                    emptyBlocksWithoutComment: 'ignore',
                    functionsInsideLoops: 'ignore',
                    functionsWithoutReturnType: 'ignore',
                    missingSemicolon: 'ignore',
                    newOnLowercaseFunctions: 'ignore',
                    semicolonsInsteadOfBlocks: 'ignore',
                    tripleSlashReferenceAlike: 'ignore',
                    unknownTypeOfResults: 'ignore',
                    unusedFunctions: 'ignore',
                    unusedImports: 'ignore',
                    unusedMembers: 'ignore',
                    unusedVariables: 'ignore',
                    // the below lint checks are done by
                    // the TypeScript compiler and we can
                    // change the severity with this. Tho
                    // the default remains error
                    forcedTypeConversion: 'error',
                    mixedTypesArithmetics: 'error',
                    newOnReturningFunctions: 'error',
                    parametersDontMatchSignature: 'error',
                    parametersOptionalButNotLast: 'error',
                    primitivesInInstanceOf: 'error',
                    redeclaredVariables: 'error',
                    undeclaredVariables: 'error',
                    unknownModule: 'error',
                    unknownProperty: 'error',
                }
            }
        });
        Options.javaScriptOptions = Object.freeze({
            suggest: {
                alwaysAllWords: false,
                useCodeSnippetsOnMethodSuggest: false
            },
            validate: {
                enable: true,
                semanticValidation: true,
                syntaxValidation: true,
                _surpressSuperWithoutSuperTypeError: false,
                lint: {
                    comparisonOperatorsNotStrict: 'ignore',
                    curlyBracketsMustNotBeOmitted: 'ignore',
                    emptyBlocksWithoutComment: 'ignore',
                    forcedTypeConversion: 'warning',
                    functionsInsideLoops: 'ignore',
                    functionsWithoutReturnType: 'ignore',
                    missingSemicolon: 'ignore',
                    mixedTypesArithmetics: 'warning',
                    newOnLowercaseFunctions: 'warning',
                    newOnReturningFunctions: 'warning',
                    parametersDontMatchSignature: 'ignore',
                    parametersOptionalButNotLast: 'ignore',
                    primitivesInInstanceOf: 'error',
                    redeclaredVariables: 'warning',
                    semicolonsInsteadOfBlocks: 'ignore',
                    tripleSlashReferenceAlike: 'warning',
                    undeclaredVariables: 'warning',
                    unknownModule: 'ignore',
                    unknownProperty: 'ignore',
                    unknownTypeOfResults: 'warning',
                    unusedFunctions: 'ignore',
                    unusedImports: 'ignore',
                    unusedMembers: 'ignore',
                    unusedVariables: 'warning',
                }
            }
        });
        function withDefaultOptions(something, defaults) {
            return objects.mixin(objects.clone(defaults), something);
        }
        Options.withDefaultOptions = withDefaultOptions;
    })(Options || (Options = {}));
    return Options;
});
//# sourceMappingURL=options.js.map