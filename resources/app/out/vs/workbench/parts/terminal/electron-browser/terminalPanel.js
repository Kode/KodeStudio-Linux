/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["vs/workbench/parts/terminal/electron-browser/terminalInstance","exports","vs/base/browser/dom","vs/base/common/lifecycle","vs/base/common/platform","require","xterm","vs/workbench/parts/terminal/electron-browser/terminalPanel","vs/base/browser/builder","vs/workbench/parts/terminal/electron-browser/terminalConfigHelper","vs/platform/configuration/common/configuration","vs/platform/instantiation/common/instantiation","vs/platform/telemetry/common/telemetry","vs/workbench/parts/terminal/electron-browser/terminal","vs/workbench/services/themes/common/themeService","vs/platform/workspace/common/workspace","vs/workbench/browser/panel","vs/base/common/winjs.base","vs/workbench/parts/terminal/electron-browser/terminalActions"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[0], __M([5,1,2,3,4,6]), function (require, exports, DOM, lifecycle, platform, xterm) {
    "use strict";
    var TerminalInstance = (function () {
        function TerminalInstance(terminalProcess, parentDomElement, contextService, terminalService, onExitCallback) {
            var _this = this;
            this.terminalProcess = terminalProcess;
            this.parentDomElement = parentDomElement;
            this.contextService = contextService;
            this.terminalService = terminalService;
            this.onExitCallback = onExitCallback;
            this.isExiting = false;
            this.toDispose = [];
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
                    data: data
                });
                return false;
            });
            this.terminalProcess.process.on('exit', function (exitCode) {
                // Prevent dispose functions being triggered multiple times
                if (!_this.isExiting) {
                    _this.isExiting = true;
                    _this.dispose();
                    if (exitCode) {
                        console.error('Integrated terminal exited with code ' + exitCode);
                    }
                    _this.onExitCallback(_this);
                }
            });
            this.toDispose.push(DOM.addDisposableListener(this.parentDomElement, 'mousedown', function (event) {
                // Drop selection and focus terminal on Linux to enable middle button paste when click
                // occurs on the selection itself.
                if (event.which === 2 && platform.isLinux) {
                    _this.focus(true);
                }
            }));
            this.toDispose.push(DOM.addDisposableListener(this.parentDomElement, 'mouseup', function (event) {
                if (event.which !== 3) {
                    _this.focus();
                }
            }));
            this.toDispose.push(DOM.addDisposableListener(this.parentDomElement, 'keyup', function (event) {
                // Keep terminal open on escape
                if (event.keyCode === 27) {
                    event.stopPropagation();
                }
            }));
            this.xterm.open(this.terminalDomElement);
            this.wrapperElement.appendChild(this.terminalDomElement);
            this.parentDomElement.appendChild(this.wrapperElement);
        }
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
            this.terminalDomElement.style.fontFamily = this.font.fontFamily;
            this.terminalDomElement.style.lineHeight = this.font.lineHeight;
            this.terminalDomElement.style.fontSize = this.font.fontSize;
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
define(__m[7], __M([5,1,2,3,4,8,18,10,11,12,13,14,15,16,17,9,0]), function (require, exports, DOM, lifecycle, platform, builder_1, terminalActions_1, configuration_1, instantiation_1, telemetry_1, terminal_1, themeService_1, workspace_1, panel_1, winjs_base_1, terminalConfigHelper_1, terminalInstance_1) {
    "use strict";
    var TerminalPanel = (function (_super) {
        __extends(TerminalPanel, _super);
        function TerminalPanel(telemetryService, configurationService, instantiationService, contextService, terminalService, themeService) {
            _super.call(this, terminal_1.TERMINAL_PANEL_ID, telemetryService);
            this.configurationService = configurationService;
            this.instantiationService = instantiationService;
            this.contextService = contextService;
            this.terminalService = terminalService;
            this.themeService = themeService;
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
            this.terminalContainer = document.createElement('div');
            DOM.addClass(this.terminalContainer, 'terminal-outer-container');
            this.parentDomElement.appendChild(this.themeStyleElement);
            this.parentDomElement.appendChild(this.terminalContainer);
            this.configurationHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform.platform, this.configurationService, parent);
            return this.terminalService.createNew();
        };
        TerminalPanel.prototype.createNewTerminalInstance = function (terminalProcess) {
            var _this = this;
            return this.createTerminal(terminalProcess).then(function () {
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
        TerminalPanel.prototype.createTerminal = function (terminalProcess) {
            var _this = this;
            return new winjs_base_1.TPromise(function (resolve) {
                var terminalInstance = new terminalInstance_1.TerminalInstance(terminalProcess, _this.terminalContainer, _this.contextService, _this.terminalService, _this.onTerminalInstanceExit.bind(_this));
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
            var theme = this.configurationHelper.getTheme(themeId);
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
            this.terminalInstances[this.terminalService.getActiveTerminalIndex()].setFont(this.configurationHelper.getFont());
            this.layout(new builder_1.Dimension(this.parentDomElement.offsetWidth, this.parentDomElement.offsetHeight));
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
            __param(2, instantiation_1.IInstantiationService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, terminal_1.ITerminalService),
            __param(5, themeService_1.IThemeService)
        ], TerminalPanel);
        return TerminalPanel;
    }(panel_1.Panel));
    exports.TerminalPanel = TerminalPanel;
});

}).call(this);
//# sourceMappingURL=terminalPanel.js.map
