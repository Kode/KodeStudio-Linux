/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/modes/languageFeatureRegistry', 'vs/base/common/errors', 'vs/base/common/uri', 'vs/editor/common/services/modelService', 'vs/base/common/winjs.base', 'vs/editor/common/core/range', 'vs/editor/common/editorCommonExtensions'], function (require, exports, languageFeatureRegistry_1, errors_1, uri_1, modelService_1, winjs_base_1, range_1, editorCommonExtensions_1) {
    exports.FormatRegistry = new languageFeatureRegistry_1.default('formattingSupport');
    exports.FormatOnTypeRegistry = new languageFeatureRegistry_1.default('formattingSupport');
    function formatRange(model, range, options) {
        var support = exports.FormatRegistry.ordered(model)
            .filter(function (s) { return typeof s.formatRange === 'function'; })[0];
        if (!support) {
            return winjs_base_1.TPromise.as(undefined);
        }
        return support.formatRange(model.getAssociatedResource(), range, options);
    }
    exports.formatRange = formatRange;
    function formatDocument(model, options) {
        var support = exports.FormatRegistry.ordered(model)[0];
        if (!support) {
            return winjs_base_1.TPromise.as(undefined);
        }
        if (typeof support.formatDocument !== 'function') {
            if (typeof support.formatRange === 'function') {
                return formatRange(model, model.getFullModelRange(), options);
            }
            else {
                return winjs_base_1.TPromise.as(undefined);
            }
        }
        return support.formatDocument(model.getAssociatedResource(), options);
    }
    exports.formatDocument = formatDocument;
    function formatAfterKeystroke(model, position, ch, options) {
        var support = exports.FormatOnTypeRegistry.ordered(model)[0];
        if (!support) {
            return winjs_base_1.TPromise.as(undefined);
        }
        if (support.autoFormatTriggerCharacters.indexOf(ch) < 0) {
            return winjs_base_1.TPromise.as(undefined);
        }
        return support.formatAfterKeystroke(model.getAssociatedResource(), position, ch, options);
    }
    exports.formatAfterKeystroke = formatAfterKeystroke;
    editorCommonExtensions_1.CommonEditorRegistry.registerLanguageCommand('_executeFormatRangeProvider', function (accessor, args) {
        var resource = args.resource, range = args.range, options = args.options;
        if (!uri_1.default.isURI(resource) || !range_1.Range.isIRange(range)) {
            throw errors_1.illegalArgument();
        }
        var model = accessor.get(modelService_1.IModelService).getModel(resource);
        if (!model) {
            throw errors_1.illegalArgument('resource');
        }
        return formatRange(model, range, options);
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerLanguageCommand('_executeFormatDocumentProvider', function (accessor, args) {
        var resource = args.resource, options = args.options;
        if (!uri_1.default.isURI(resource)) {
            throw errors_1.illegalArgument('resource');
        }
        var model = accessor.get(modelService_1.IModelService).getModel(resource);
        if (!model) {
            throw errors_1.illegalArgument('resource');
        }
        return formatDocument(model, options);
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeFormatOnTypeProvider', function (model, position, args) {
        var ch = args.ch, options = args.options;
        if (typeof ch !== 'string') {
            throw errors_1.illegalArgument('ch');
        }
        return formatAfterKeystroke(model, position, ch, options);
    });
});
//# sourceMappingURL=format.js.map