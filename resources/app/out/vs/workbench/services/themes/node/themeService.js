/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/nls', 'vs/base/common/paths', 'vs/platform/theme/common/themes', 'vs/platform/plugins/common/pluginsRegistry', 'vs/platform/instantiation/common/instantiation', 'vs/base/node/plist', 'vs/base/node/pfs'], function (require, exports, winjs_base_1, nls, Paths, Themes, pluginsRegistry_1, instantiation_1, plist, pfs) {
    exports.IThemeService = instantiation_1.createDecorator('themeService');
    // implementation
    var defaultBaseTheme = Themes.toId(Themes.BaseTheme.VS_DARK);
    var themesExtPoint = pluginsRegistry_1.PluginsRegistry.registerExtensionPoint('themes', {
        description: nls.localize('vscode.extension.contributes.themes', 'Contributes textmate color themes.'),
        type: 'array',
        default: [{ label: '{{label}}', uiTheme: 'vs-dark', path: './themes/{{id}}.tmTheme.' }],
        items: {
            type: 'object',
            default: { label: '{{label}}', uiTheme: 'vs-dark', path: './themes/{{id}}.tmTheme.' },
            properties: {
                label: {
                    description: nls.localize('vscode.extension.contributes.themes.label', 'Label of the color theme as shown in the UI.'),
                    type: 'string'
                },
                uiTheme: {
                    description: nls.localize('vscode.extension.contributes.themes.uiTheme', 'Base theme defining the colors around the editor: \'vs\' is the light color theme, \'vs-dark\' is the dark color theme.'),
                    enum: ['vs', 'vs-dark']
                },
                path: {
                    description: nls.localize('vscode.extension.contributes.themes.path', 'Path of the tmTheme file. The path is relative to the extension folder and is typically \'./themes/themeFile.tmTheme\'.'),
                    type: 'string'
                }
            }
        }
    });
    var ThemeService = (function () {
        function ThemeService(pluginService) {
            var _this = this;
            this.pluginService = pluginService;
            this.serviceId = exports.IThemeService;
            this.knownThemes = [];
            themesExtPoint.setHandler(function (extensions) {
                for (var _i = 0; _i < extensions.length; _i++) {
                    var ext = extensions[_i];
                    _this.onThemes(ext.description.extensionFolderPath, ext.description.id, ext.value, ext.collector);
                }
            });
        }
        ThemeService.prototype.getTheme = function (themeId) {
            return this.getThemes().then(function (allThemes) {
                var themes = allThemes.filter(function (t) { return t.id === themeId; });
                if (themes.length > 0) {
                    return themes[0];
                }
                return null;
            });
        };
        ThemeService.prototype.loadThemeCSS = function (themeId) {
            return this.getTheme(themeId).then(function (theme) {
                if (theme) {
                    return loadTheme(theme);
                }
                return null;
            });
        };
        ThemeService.prototype.getThemes = function () {
            var _this = this;
            return this.pluginService.onReady().then(function (isReady) {
                return _this.knownThemes;
            });
        };
        ThemeService.prototype.onThemes = function (extensionFolderPath, extensionId, themes, collector) {
            var _this = this;
            if (!Array.isArray(themes)) {
                collector.error(nls.localize('reqarray', "Extension point `{0}` must be an array.", themesExtPoint.name));
                return;
            }
            themes.forEach(function (theme) {
                if (!theme.path || (typeof theme.path !== 'string')) {
                    collector.error(nls.localize('reqpath', "Expected string in `contributes.{0}.path`. Provided value: {1}", themesExtPoint.name, String(theme.path)));
                    return;
                }
                var normalizedAbsolutePath = Paths.normalize(Paths.join(extensionFolderPath, theme.path));
                if (normalizedAbsolutePath.indexOf(extensionFolderPath) !== 0) {
                    collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", themesExtPoint.name, normalizedAbsolutePath, extensionFolderPath));
                }
                var themeSelector = toCssSelector(extensionId + '-' + Paths.normalize(theme.path));
                _this.knownThemes.push({
                    id: (theme.uiTheme || defaultBaseTheme) + " " + themeSelector,
                    label: theme.label || Paths.basename(theme.path),
                    description: theme.description,
                    path: normalizedAbsolutePath
                });
            });
        };
        return ThemeService;
    })();
    exports.ThemeService = ThemeService;
    function toCssSelector(str) {
        return str.replace(/[^_\-a-zA-Z0-9]/g, '-');
    }
    function loadTheme(theme) {
        if (theme.styleSheetContent) {
            _applyRules(theme.styleSheetContent);
        }
        return pfs.readFile(theme.path).then(function (content) {
            var parseResult = plist.parse(content.toString());
            if (parseResult.errors && parseResult.errors.length) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize('error.cannotparse', "Problems parsing plist file: {0}", parseResult.errors.join(', '))));
            }
            var styleSheetContent = _processThemeObject(theme.id, parseResult.value);
            theme.styleSheetContent = styleSheetContent;
            _applyRules(styleSheetContent);
            return true;
        }, function (error) {
            return winjs_base_1.TPromise.wrapError(nls.localize('error.cannotloadtheme', "Unable to load {0}", theme.path));
        });
    }
    function _processThemeObject(themeId, themeDocument) {
        var cssRules = [];
        var themeSettings = themeDocument.settings;
        var editorSettings = {
            background: void 0,
            foreground: void 0,
            caret: void 0,
            invisibles: void 0,
            lineHighlight: void 0,
            selection: void 0
        };
        var themeSelector = Themes.getBaseThemeId(themeId) + "." + Themes.getSyntaxThemeId(themeId);
        if (Array.isArray(themeSettings)) {
            themeSettings.forEach(function (s, index, arr) {
                if (index === 0 && !s.scope) {
                    editorSettings = s.settings;
                }
                else {
                    var scope = s.scope;
                    var settings = s.settings;
                    if (scope && settings) {
                        var rules = scope.split(',');
                        var statements = _settingsToStatements(settings);
                        rules.forEach(function (rule) {
                            rule = rule.trim().replace(/ /g, '.'); // until we have scope hierarchy in the editor dom: replace spaces with .
                            cssRules.push(".monaco-editor." + themeSelector + " .token." + rule + " { " + statements + " }");
                        });
                    }
                }
            });
        }
        if (editorSettings.background) {
            var background = new Color(editorSettings.background);
            //cssRules.push(`.monaco-editor.${themeSelector} { background-color: ${background}; }`);
            cssRules.push(".monaco-editor." + themeSelector + " .monaco-editor-background { background-color: " + background + "; }");
            cssRules.push(".monaco-editor." + themeSelector + " .glyph-margin { background-color: " + background + "; }");
            cssRules.push(".monaco-workbench." + themeSelector + " .monaco-editor-background { background-color: " + background + "; }");
        }
        if (editorSettings.foreground) {
            var foreground = new Color(editorSettings.foreground);
            cssRules.push(".monaco-editor." + themeSelector + " { color: " + foreground + "; }");
            cssRules.push(".monaco-editor." + themeSelector + " .token { color: " + foreground + "; }");
        }
        if (editorSettings.selection) {
            var selection = new Color(editorSettings.selection);
            cssRules.push(".monaco-editor." + themeSelector + " .focused .selected-text { background-color: " + selection + "; }");
            cssRules.push(".monaco-editor." + themeSelector + " .selected-text { background-color: " + selection.transparent(0.5) + "; }");
        }
        if (editorSettings.lineHighlight) {
            var lineHighlight = new Color(editorSettings.lineHighlight);
            cssRules.push(".monaco-editor." + themeSelector + " .current-line { background-color: " + lineHighlight + "; }");
        }
        if (editorSettings.caret) {
            var caret = new Color(editorSettings.caret);
            cssRules.push(".monaco-editor." + themeSelector + " .cursor { background-color: " + caret + "; }");
        }
        if (editorSettings.invisibles) {
            var invisibles = new Color(editorSettings.invisibles);
            cssRules.push(".monaco-editor." + themeSelector + " .token.whitespace { color: " + invisibles + " !important; }");
        }
        return cssRules.join('\n');
    }
    function _settingsToStatements(settings) {
        var statements = [];
        for (var settingName in settings) {
            var value = settings[settingName];
            switch (settingName) {
                case 'foreground':
                    var foreground = new Color(value);
                    statements.push("color: " + foreground + ";");
                    break;
                case 'background':
                    // do not support background color for now, see bug 18924
                    //let background = new Color(value);
                    //statements.push(`background-color: ${background};`);
                    break;
                case 'fontStyle':
                    var segments = value.split(' ');
                    segments.forEach(function (s) {
                        switch (value) {
                            case 'italic':
                                statements.push("font-style: italic;");
                                break;
                            case 'bold':
                                statements.push("font-weight: bold;");
                                break;
                            case 'underline':
                                statements.push("text-decoration: underline;");
                                break;
                        }
                    });
            }
        }
        return statements.join(' ');
    }
    var className = 'contributedColorTheme';
    function _applyRules(styleSheetContent) {
        var themeStyles = document.head.getElementsByClassName(className);
        if (themeStyles.length === 0) {
            var elStyle = document.createElement('style');
            elStyle.type = 'text/css';
            elStyle.className = className;
            elStyle.innerHTML = styleSheetContent;
            document.head.appendChild(elStyle);
        }
        else {
            themeStyles[0].innerHTML = styleSheetContent;
        }
    }
    var Color = (function () {
        function Color(arg) {
            if (typeof arg === 'string') {
                this.parsed = Color.parse(arg);
            }
            else {
                this.parsed = arg;
            }
            this.str = null;
        }
        Color.parse = function (color) {
            function parseHex(str) {
                return parseInt('0x' + str);
            }
            if (color.charAt(0) === '#' && color.length >= 7) {
                var r = parseHex(color.substr(1, 2));
                var g = parseHex(color.substr(3, 2));
                var b = parseHex(color.substr(5, 2));
                var a = color.length === 9 ? parseHex(color.substr(7, 2)) / 0xff : 1;
                return { r: r, g: g, b: b, a: a };
            }
            return { r: 255, g: 0, b: 0, a: 1 };
        };
        Color.prototype.toString = function () {
            if (!this.str) {
                var p = this.parsed;
                this.str = "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + +p.a.toFixed(2) + ")";
            }
            return this.str;
        };
        Color.prototype.transparent = function (factor) {
            var p = this.parsed;
            return new Color({ r: p.r, g: p.g, b: p.b, a: p.a * factor });
        };
        return Color;
    })();
});
//# sourceMappingURL=themeService.js.map