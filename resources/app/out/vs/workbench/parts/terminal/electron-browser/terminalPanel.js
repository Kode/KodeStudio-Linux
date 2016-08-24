/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["vs/nls!vs/workbench/parts/terminal/electron-browser/terminalInstance","vs/nls!vs/workbench/parts/terminal/electron-browser/terminalPanel","vs/workbench/parts/terminal/electron-browser/terminalInstance","require","exports","vs/base/browser/dom","vs/base/common/lifecycle","vs/platform/message/common/message","os","xterm","vs/base/common/winjs.base","vs/base/browser/keyboardEvent","vs/editor/common/config/commonEditorConfig","vs/editor/contrib/toggleTabFocusMode/common/toggleTabFocusMode","vs/workbench/parts/terminal/electron-browser/terminalPanel","vs/base/common/platform","vs/nls","vs/platform/theme/common/themes","vs/platform/configuration/common/configuration","vs/platform/contextview/browser/contextView","vs/platform/instantiation/common/instantiation","vs/platform/keybinding/common/keybinding","vs/platform/telemetry/common/telemetry","vs/workbench/parts/terminal/electron-browser/terminalConfigHelper","vs/workbench/parts/terminal/electron-browser/terminal","vs/workbench/services/themes/common/themeService","vs/platform/workspace/common/workspace","vs/workbench/parts/terminal/electron-browser/terminalActions","vs/workbench/browser/panel","vs/base/browser/ui/actionbar/actionbar","vs/base/browser/mouseEvent","vs/base/browser/builder"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[0], __M([16,1]), function(nls, data) { return nls.create("vs/workbench/parts/terminal/electron-browser/terminalInstance", data); });

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[2], __M([3,4,5,6,0,8,9,7,11,12,13]), function (require, exports, DOM, lifecycle, nls, os, xterm, message_1, keyboardEvent_1, commonEditorConfig_1, toggleTabFocusMode_1) {
    "use strict";
    var TerminalInstance = (function () {
        function TerminalInstance(terminalProcess, parentDomElement, contextMenuService, contextService, instantiationService, keybindingService, terminalService, messageService, terminalFocusContextKey, onExitCallback) {
            var _this = this;
            this.terminalProcess = terminalProcess;
            this.parentDomElement = parentDomElement;
            this.contextMenuService = contextMenuService;
            this.contextService = contextService;
            this.instantiationService = instantiationService;
            this.keybindingService = keybindingService;
            this.terminalService = terminalService;
            this.messageService = messageService;
            this.terminalFocusContextKey = terminalFocusContextKey;
            this.onExitCallback = onExitCallback;
            this.isExiting = false;
            var self = this;
            this.toDispose = [];
            this.toggleTabFocusModeKeybindings = self.keybindingService.lookupKeybindings(toggleTabFocusMode_1.ToggleTabFocusModeAction.ID);
            this.wrapperElement = document.createElement('div');
            DOM.addClass(this.wrapperElement, 'terminal-wrapper');
            this.terminalDomElement = document.createElement('div');
            this.xterm = xterm();
            this.terminalProcess.process.on('message', function (message) {
                if (message.type === 'data') {
                    _this.xterm.write(message.content);
                }
            });
            this.xterm.on('data', function (data) {
                _this.terminalProcess.process.send({
                    event: 'input',
                    data: _this.sanitizeInput(data)
                });
                return false;
            });
            this.xterm.attachCustomKeydownHandler(function (event) {
                // Allow the toggle tab mode keybinding to pass through the terminal so that focus can
                // be escaped
                var standardKeyboardEvent = new keyboardEvent_1.StandardKeyboardEvent(event);
                if (self.toggleTabFocusModeKeybindings.some(function (k) { return standardKeyboardEvent.equals(k.value); })) {
                    event.preventDefault();
                    return false;
                }
                // If tab focus mode is on, tab is not passed to the terminal
                if (commonEditorConfig_1.TabFocus.getTabFocusMode() && event.keyCode === 9) {
                    return false;
                }
            });
            this.terminalProcess.process.on('exit', function (exitCode) {
                // Prevent dispose functions being triggered multiple times
                if (!_this.isExiting) {
                    _this.isExiting = true;
                    _this.dispose();
                    if (exitCode) {
                        _this.messageService.show(message_1.Severity.Error, nls.localize(0, null, exitCode));
                    }
                    _this.onExitCallback(_this);
                }
            });
            this.xterm.open(this.terminalDomElement);
            var xtermHelper = this.xterm.element.querySelector('.xterm-helpers');
            var focusTrap = document.createElement('div');
            focusTrap.setAttribute('tabindex', '0');
            DOM.addClass(focusTrap, 'focus-trap');
            focusTrap.addEventListener('focus', function (event) {
                var currentElement = focusTrap;
                while (!DOM.hasClass(currentElement, 'part')) {
                    currentElement = currentElement.parentElement;
                }
                var hidePanelElement = currentElement.querySelector('.hide-panel-action');
                hidePanelElement.focus();
            });
            xtermHelper.insertBefore(focusTrap, this.xterm.textarea);
            this.toDispose.push(DOM.addDisposableListener(this.xterm.textarea, 'focus', function (event) {
                self.terminalFocusContextKey.set(true);
            }));
            this.toDispose.push(DOM.addDisposableListener(this.xterm.textarea, 'blur', function (event) {
                self.terminalFocusContextKey.reset();
            }));
            this.toDispose.push(DOM.addDisposableListener(this.xterm.element, 'focus', function (event) {
                self.terminalFocusContextKey.set(true);
            }));
            this.toDispose.push(DOM.addDisposableListener(this.xterm.element, 'blur', function (event) {
                self.terminalFocusContextKey.reset();
            }));
            this.wrapperElement.appendChild(this.terminalDomElement);
            this.parentDomElement.appendChild(this.wrapperElement);
        }
        TerminalInstance.prototype.sanitizeInput = function (data) {
            return typeof data === 'string' ? data.replace(TerminalInstance.eolRegex, os.EOL) : data;
        };
        TerminalInstance.prototype.layout = function (dimension) {
            if (!this.font || !this.font.charWidth || !this.font.charHeight) {
                return;
            }
            if (!dimension.height) {
                return;
            }
            var cols = Math.floor(dimension.width / this.font.charWidth);
            var rows = Math.floor(dimension.height / this.font.charHeight);
            if (this.xterm) {
                this.xterm.resize(cols, rows);
            }
            if (this.terminalProcess.process.connected) {
                this.terminalProcess.process.send({
                    event: 'resize',
                    cols: cols,
                    rows: rows
                });
            }
        };
        TerminalInstance.prototype.toggleVisibility = function (visible) {
            DOM.toggleClass(this.wrapperElement, 'active', visible);
        };
        TerminalInstance.prototype.setFont = function (font) {
            this.font = font;
        };
        TerminalInstance.prototype.setCursorBlink = function (blink) {
            if (this.xterm && this.xterm.cursorBlink !== blink) {
                this.xterm.cursorBlink = blink;
                this.xterm.refresh(0, this.xterm.rows - 1);
            }
        };
        TerminalInstance.prototype.focus = function (force) {
            if (!this.xterm) {
                return;
            }
            var text = window.getSelection().toString();
            if (!text || force) {
                this.xterm.focus();
            }
        };
        TerminalInstance.prototype.dispose = function () {
            if (this.wrapperElement) {
                this.parentDomElement.removeChild(this.wrapperElement);
                this.wrapperElement = null;
            }
            if (this.xterm) {
                this.xterm.destroy();
                this.xterm = null;
            }
            if (this.terminalProcess) {
                this.terminalService.killTerminalProcess(this.terminalProcess);
                this.terminalProcess = null;
            }
            this.toDispose = lifecycle.dispose(this.toDispose);
        };
        TerminalInstance.eolRegex = /\r?\n/g;
        return TerminalInstance;
    }());
    exports.TerminalInstance = TerminalInstance;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[14], __M([3,4,5,6,1,15,31,17,18,19,20,21,7,22,23,24,25,26,27,28,29,30,2,10]), function (require, exports, DOM, lifecycle, nls, platform, builder_1, themes_1, configuration_1, contextView_1, instantiation_1, keybinding_1, message_1, telemetry_1, terminalConfigHelper_1, terminal_1, themeService_1, workspace_1, terminalActions_1, panel_1, actionbar_1, mouseEvent_1, terminalInstance_1, winjs_base_1) {
    "use strict";
    var TerminalPanel = (function (_super) {
        __extends(TerminalPanel, _super);
        function TerminalPanel(telemetryService, configurationService, contextMenuService, instantiationService, keybindingService, contextService, terminalService, themeService, messageService) {
            _super.call(this, terminal_1.TERMINAL_PANEL_ID, telemetryService);
            this.configurationService = configurationService;
            this.contextMenuService = contextMenuService;
            this.instantiationService = instantiationService;
            this.keybindingService = keybindingService;
            this.contextService = contextService;
            this.terminalService = terminalService;
            this.themeService = themeService;
            this.messageService = messageService;
            this.toDispose = [];
            this.terminalInstances = [];
        }
        TerminalPanel.prototype.layout = function (dimension) {
            if (!dimension) {
                return;
            }
            var activeIndex = this.terminalService.getActiveTerminalIndex();
            if (activeIndex !== -1 && this.terminalInstances.length > 0) {
                this.terminalInstances[this.terminalService.getActiveTerminalIndex()].layout(dimension);
            }
        };
        TerminalPanel.prototype.getActions = function () {
            var _this = this;
            if (!this.actions) {
                this.actions = [
                    this.instantiationService.createInstance(terminalActions_1.SwitchTerminalInstanceAction, terminalActions_1.SwitchTerminalInstanceAction.ID, terminalActions_1.SwitchTerminalInstanceAction.LABEL),
                    this.instantiationService.createInstance(terminalActions_1.CreateNewTerminalAction, terminalActions_1.CreateNewTerminalAction.ID, terminalActions_1.CreateNewTerminalAction.PANEL_LABEL),
                    this.instantiationService.createInstance(terminalActions_1.KillTerminalAction, terminalActions_1.KillTerminalAction.ID, terminalActions_1.KillTerminalAction.PANEL_LABEL)
                ];
                this.actions.forEach(function (a) {
                    _this.toDispose.push(a);
                });
            }
            return this.actions;
        };
        TerminalPanel.prototype.getContextMenuActions = function () {
            var _this = this;
            if (!this.contextMenuActions) {
                this.contextMenuActions = [
                    this.instantiationService.createInstance(terminalActions_1.CreateNewTerminalAction, terminalActions_1.CreateNewTerminalAction.ID, nls.localize(0, null)),
                    new actionbar_1.Separator(),
                    this.instantiationService.createInstance(terminalActions_1.CopyTerminalSelectionAction, terminalActions_1.CopyTerminalSelectionAction.ID, nls.localize(1, null)),
                    this.instantiationService.createInstance(terminalActions_1.TerminalPasteAction, terminalActions_1.TerminalPasteAction.ID, nls.localize(2, null))
                ];
                this.contextMenuActions.forEach(function (a) {
                    _this.toDispose.push(a);
                });
            }
            return this.contextMenuActions;
        };
        TerminalPanel.prototype.getActionItem = function (action) {
            if (action.id === terminalActions_1.SwitchTerminalInstanceAction.ID) {
                return this.instantiationService.createInstance(terminalActions_1.SwitchTerminalInstanceActionItem, action);
            }
            return _super.prototype.getActionItem.call(this, action);
        };
        TerminalPanel.prototype.create = function (parent) {
            _super.prototype.create.call(this, parent);
            this.parentDomElement = parent.getHTMLElement();
            this.terminalService.initConfigHelper(parent);
            DOM.addClass(this.parentDomElement, 'integrated-terminal');
            this.themeStyleElement = document.createElement('style');
            this.fontStyleElement = document.createElement('style');
            this.terminalContainer = document.createElement('div');
            DOM.addClass(this.terminalContainer, 'terminal-outer-container');
            this.parentDomElement.appendChild(this.themeStyleElement);
            this.parentDomElement.appendChild(this.fontStyleElement);
            this.parentDomElement.appendChild(this.terminalContainer);
            this.attachEventListeners();
            this.configurationHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform.platform, this.configurationService, parent);
            return this.terminalService.createNew();
        };
        TerminalPanel.prototype.attachEventListeners = function () {
            var _this = this;
            this.toDispose.push(DOM.addDisposableListener(this.parentDomElement, 'mousedown', function (event) {
                if (_this.terminalInstances.length === 0) {
                    return;
                }
                if (event.which === 2 && platform.isLinux) {
                    // Drop selection and focus terminal on Linux to enable middle button paste when click
                    // occurs on the selection itself.
                    _this.terminalInstances[_this.terminalService.getActiveTerminalIndex()].focus(true);
                }
                else if (event.which === 3) {
                    // Trigger the context menu on right click
                    var anchor_1 = _this.parentDomElement;
                    if (event instanceof MouseEvent) {
                        var standardEvent = new mouseEvent_1.StandardMouseEvent(event);
                        anchor_1 = { x: standardEvent.posx, y: standardEvent.posy };
                    }
                    _this.contextMenuService.showContextMenu({
                        getAnchor: function () { return anchor_1; },
                        getActions: function () { return winjs_base_1.TPromise.as(_this.getContextMenuActions()); },
                        getActionsContext: function () { return _this.parentDomElement; },
                        getKeyBinding: function (action) {
                            var opts = _this.keybindingService.lookupKeybindings(action.id);
                            if (opts.length > 0) {
                                return opts[0]; // only take the first one
                            }
                            return null;
                        }
                    });
                }
            }));
            this.toDispose.push(DOM.addDisposableListener(this.parentDomElement, 'mouseup', function (event) {
                if (_this.terminalInstances.length === 0) {
                    return;
                }
                if (event.which !== 3) {
                    _this.terminalInstances[_this.terminalService.getActiveTerminalIndex()].focus();
                }
            }));
            this.toDispose.push(DOM.addDisposableListener(this.parentDomElement, 'keyup', function (event) {
                if (event.keyCode === 27) {
                    // Keep terminal open on escape
                    event.stopPropagation();
                }
            }));
        };
        TerminalPanel.prototype.createNewTerminalInstance = function (terminalProcess, terminalFocusContextKey) {
            var _this = this;
            return this.createTerminal(terminalProcess, terminalFocusContextKey).then(function () {
                _this.updateConfig();
                _this.focus();
            });
        };
        TerminalPanel.prototype.closeActiveTerminal = function () {
            return this.closeTerminal(this.terminalService.getActiveTerminalIndex());
        };
        TerminalPanel.prototype.closeTerminal = function (index) {
            var self = this;
            return new winjs_base_1.TPromise(function (resolve) {
                self.onTerminalInstanceExit(self.terminalInstances[index]);
            });
        };
        TerminalPanel.prototype.setVisible = function (visible) {
            var _this = this;
            if (visible) {
                if (this.terminalInstances.length > 0) {
                    this.updateConfig();
                    this.updateTheme();
                }
                else {
                    return _super.prototype.setVisible.call(this, visible).then(function () {
                        _this.terminalService.createNew();
                    });
                }
            }
            return _super.prototype.setVisible.call(this, visible);
        };
        TerminalPanel.prototype.createTerminal = function (terminalProcess, terminalFocusContextKey) {
            var _this = this;
            return new winjs_base_1.TPromise(function (resolve) {
                var terminalInstance = new terminalInstance_1.TerminalInstance(terminalProcess, _this.terminalContainer, _this.contextMenuService, _this.contextService, _this.instantiationService, _this.keybindingService, _this.terminalService, _this.messageService, terminalFocusContextKey, _this.onTerminalInstanceExit.bind(_this));
                _this.terminalInstances.push(terminalInstance);
                _this.setActiveTerminal(_this.terminalInstances.length - 1);
                _this.toDispose.push(_this.themeService.onDidThemeChange(_this.updateTheme.bind(_this)));
                _this.toDispose.push(_this.configurationService.onDidUpdateConfiguration(_this.updateConfig.bind(_this)));
                _this.updateTheme();
                _this.updateConfig();
                resolve(terminalInstance);
            });
        };
        TerminalPanel.prototype.setActiveTerminal = function (newActiveIndex) {
            this.terminalInstances.forEach(function (terminalInstance, i) {
                terminalInstance.toggleVisibility(i === newActiveIndex);
            });
        };
        TerminalPanel.prototype.onTerminalInstanceExit = function (terminalInstance) {
            var index = this.terminalInstances.indexOf(terminalInstance);
            if (index !== -1) {
                this.terminalInstances[index].dispose();
                this.terminalInstances.splice(index, 1);
            }
            if (this.terminalInstances.length > 0) {
                this.setActiveTerminal(this.terminalService.getActiveTerminalIndex());
            }
            if (this.terminalInstances.length === 0) {
                this.terminalService.hide();
            }
            else {
                this.terminalService.focus();
            }
        };
        TerminalPanel.prototype.updateTheme = function (themeId) {
            var _this = this;
            if (!themeId) {
                themeId = this.themeService.getTheme();
            }
            var baseThemeId = themes_1.getBaseThemeId(themeId);
            if (baseThemeId === this.currentBaseThemeId) {
                return;
            }
            this.currentBaseThemeId = baseThemeId;
            var theme = this.configurationHelper.getTheme(baseThemeId);
            var css = '';
            theme.forEach(function (color, index) {
                var rgba = _this.convertHexCssColorToRgba(color, 0.996);
                css += (".monaco-workbench .panel.integrated-terminal .xterm .xterm-color-" + index + " { color: " + color + "; }") +
                    (".monaco-workbench .panel.integrated-terminal .xterm .xterm-color-" + index + "::selection { background-color: " + rgba + "; }") +
                    (".monaco-workbench .panel.integrated-terminal .xterm .xterm-bg-color-" + index + " { background-color: " + color + "; }") +
                    (".monaco-workbench .panel.integrated-terminal .xterm .xterm-bg-color-" + index + "::selection { color: " + color + "; }");
            });
            this.themeStyleElement.innerHTML = css;
        };
        /**
         * Converts a CSS hex color (#rrggbb) to a CSS rgba color (rgba(r, g, b, a)).
         */
        TerminalPanel.prototype.convertHexCssColorToRgba = function (hex, alpha) {
            var r = parseInt(hex.substr(1, 2), 16);
            var g = parseInt(hex.substr(3, 2), 16);
            var b = parseInt(hex.substr(5, 2), 16);
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        };
        TerminalPanel.prototype.updateConfig = function () {
            this.updateFont();
            this.updateCursorBlink();
        };
        TerminalPanel.prototype.updateFont = function () {
            if (this.terminalInstances.length === 0) {
                return;
            }
            var newFont = this.configurationHelper.getFont();
            DOM.toggleClass(this.parentDomElement, 'enable-ligatures', this.configurationHelper.getFontLigaturesEnabled());
            if (!this.font || this.fontsDiffer(this.font, newFont)) {
                this.fontStyleElement.innerHTML = '.monaco-workbench .panel.integrated-terminal .xterm {' +
                    ("font-family: " + newFont.fontFamily + ";") +
                    ("font-size: " + newFont.fontSize + ";") +
                    ("line-height: " + newFont.lineHeight + ";") +
                    '}';
                this.font = newFont;
            }
            this.terminalInstances[this.terminalService.getActiveTerminalIndex()].setFont(newFont);
            this.layout(new builder_1.Dimension(this.parentDomElement.offsetWidth, this.parentDomElement.offsetHeight));
        };
        TerminalPanel.prototype.fontsDiffer = function (a, b) {
            return a.charHeight !== b.charHeight ||
                a.charWidth !== b.charWidth ||
                a.fontFamily !== b.fontFamily ||
                a.fontSize !== b.fontSize ||
                a.lineHeight !== b.lineHeight;
        };
        TerminalPanel.prototype.updateCursorBlink = function () {
            var _this = this;
            this.terminalInstances.forEach(function (instance) {
                instance.setCursorBlink(_this.configurationHelper.getCursorBlink());
            });
        };
        TerminalPanel.prototype.focus = function () {
            var activeIndex = this.terminalService.getActiveTerminalIndex();
            if (activeIndex !== -1 && this.terminalInstances.length > 0) {
                this.terminalInstances[activeIndex].focus(true);
            }
        };
        TerminalPanel.prototype.dispose = function () {
            this.toDispose = lifecycle.dispose(this.toDispose);
            while (this.terminalInstances.length > 0) {
                this.terminalInstances.pop().dispose();
            }
            _super.prototype.dispose.call(this);
        };
        TerminalPanel = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, configuration_1.IConfigurationService),
            __param(2, contextView_1.IContextMenuService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, keybinding_1.IKeybindingService),
            __param(5, workspace_1.IWorkspaceContextService),
            __param(6, terminal_1.ITerminalService),
            __param(7, themeService_1.IThemeService),
            __param(8, message_1.IMessageService)
        ], TerminalPanel);
        return TerminalPanel;
    }(panel_1.Panel));
    exports.TerminalPanel = TerminalPanel;
});

}).call(this);
//# sourceMappingURL=terminalPanel.js.map
