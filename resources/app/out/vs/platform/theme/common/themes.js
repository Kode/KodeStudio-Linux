/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls'], function (require, exports, nls) {
    (function (BaseTheme) {
        BaseTheme[BaseTheme["VS"] = 0] = "VS";
        BaseTheme[BaseTheme["VS_DARK"] = 1] = "VS_DARK";
        BaseTheme[BaseTheme["HIGH_CONTRAST"] = 2] = "HIGH_CONTRAST";
    })(exports.BaseTheme || (exports.BaseTheme = {}));
    var BaseTheme = exports.BaseTheme;
    exports.DEFAULT_THEME_ID = toId(BaseTheme.VS);
    function getBaseThemes(includeHighContrast) {
        if (includeHighContrast) {
            return [BaseTheme.VS, BaseTheme.VS_DARK, BaseTheme.HIGH_CONTRAST];
        }
        return [BaseTheme.VS, BaseTheme.VS_DARK];
    }
    exports.getBaseThemes = getBaseThemes;
    function toId(theme) {
        switch (theme) {
            case BaseTheme.VS:
                return 'vs';
            case BaseTheme.VS_DARK:
                return 'vs-dark';
        }
        return 'hc-black';
    }
    exports.toId = toId;
    function toLabel(theme) {
        switch (theme) {
            case BaseTheme.VS:
                return nls.localize('theme.vs', 'Light');
            case BaseTheme.VS_DARK:
                return nls.localize('theme.vs-dark', 'Dark');
        }
        return nls.localize('theme.hc', 'High Contrast');
    }
    exports.toLabel = toLabel;
    function isLightTheme(themeId) {
        return /vs($| )/.test(themeId);
    }
    exports.isLightTheme = isLightTheme;
    function getSyntaxThemeId(themeId) {
        return themeId.split(' ')[1];
    }
    exports.getSyntaxThemeId = getSyntaxThemeId;
    function getBaseThemeId(themeId) {
        return themeId.split(' ')[0];
    }
    exports.getBaseThemeId = getBaseThemeId;
});
//# sourceMappingURL=themes.js.map