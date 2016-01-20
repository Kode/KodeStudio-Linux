/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/uri', 'vs/base/common/errors', 'vs/base/common/winjs.base', 'vs/editor/common/core/range', 'vs/editor/common/modes/languageFeatureRegistry', 'vs/editor/common/services/modelService', 'vs/editor/common/editorCommonExtensions'], function (require, exports, uri_1, errors_1, winjs_base_1, range_1, languageFeatureRegistry_1, modelService_1, editorCommonExtensions_1) {
    var OutlineRegistry = new languageFeatureRegistry_1.default('outlineSupport');
    exports.OutlineRegistry = OutlineRegistry;
    function getOutlineEntries(model) {
        var groupLabels = Object.create(null);
        var entries = [];
        var promises = OutlineRegistry.all(model).map(function (support) {
            if (support.outlineGroupLabel) {
                for (var key in support.outlineGroupLabel) {
                    if (Object.prototype.hasOwnProperty.call(support.outlineGroupLabel, key)) {
                        groupLabels[key] = support.outlineGroupLabel[key];
                    }
                }
            }
            return support.getOutline(model.getAssociatedResource()).then(function (result) {
                if (Array.isArray(result)) {
                    entries.push.apply(entries, result);
                }
            }, function (err) {
                errors_1.onUnexpectedError(err);
            });
        });
        return winjs_base_1.TPromise.join(promises).then(function () {
            var flatEntries = [];
            flatten(flatEntries, entries, '');
            flatEntries.sort(compareEntriesUsingStart);
            return {
                entries: flatEntries,
                outlineGroupLabel: groupLabels
            };
        });
    }
    exports.getOutlineEntries = getOutlineEntries;
    function compareEntriesUsingStart(a, b) {
        return range_1.Range.compareRangesUsingStarts(a.range, b.range);
    }
    function flatten(bucket, entries, overrideContainerLabel) {
        for (var _i = 0; _i < entries.length; _i++) {
            var entry = entries[_i];
            bucket.push({
                type: entry.type,
                range: entry.range,
                label: entry.label,
                icon: entry.icon,
                containerLabel: entry.containerLabel || overrideContainerLabel
            });
            if (entry.children) {
                flatten(bucket, entry.children, entry.label);
            }
        }
    }
    editorCommonExtensions_1.CommonEditorRegistry.registerLanguageCommand('_executeDocumentSymbolProvider', function (accessor, args) {
        var resource = args.resource;
        if (!uri_1.default.isURI(resource)) {
            throw errors_1.illegalArgument('resource');
        }
        var model = accessor.get(modelService_1.IModelService).getModel(resource);
        if (!model) {
            throw errors_1.illegalArgument('resource');
        }
        return getOutlineEntries(model);
    });
});
//# sourceMappingURL=quickOpen.js.map