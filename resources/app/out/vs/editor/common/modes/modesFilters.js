/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/filters', 'vs/base/common/arrays'], function (require, exports, Filters, arrays_1) {
    function wrapBaseFilter(filter) {
        return function (word, suggestion) {
            var result = filter(word, suggestion.filterText || suggestion.label);
            return arrays_1.isFalsyOrEmpty(result) ? undefined : result;
        };
    }
    exports.StrictPrefix = wrapBaseFilter(Filters.matchesStrictPrefix);
    exports.Prefix = wrapBaseFilter(Filters.matchesPrefix);
    exports.CamelCase = wrapBaseFilter(Filters.matchesCamelCase);
    exports.ContiguousSubString = wrapBaseFilter(Filters.matchesContiguousSubString);
    // Combined Filters
    function or(first, second) {
        return function (word, suggestion) { return first(word, suggestion) || second(word, suggestion); };
    }
    exports.or = or;
    function and(first, second) {
        return function (word, suggestion) { return first(word, suggestion) && second(word, suggestion); };
    }
    exports.and = and;
    exports.DefaultFilter = or(or(exports.Prefix, exports.CamelCase), exports.ContiguousSubString);
});
//# sourceMappingURL=modesFilters.js.map