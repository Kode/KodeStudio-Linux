/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/platform/plugins/common/plugins', 'vs/platform/plugins/common/pluginsRegistry', 'vs/platform/keybinding/common/keybindingService', 'vs/base/common/actions', 'vs/nls'], function (require, exports, plugins_1, pluginsRegistry_1, keybindingService_1, actions_1, nls_1) {
    function isCommands(thing) {
        return Array.isArray(thing);
    }
    function isValidCommand(candidate, rejects) {
        if (!candidate) {
            rejects.push(nls_1.localize('nonempty', "expected non-empty value."));
            return false;
        }
        if (typeof candidate.command !== 'string') {
            rejects.push(nls_1.localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
            return false;
        }
        if (typeof candidate.title !== 'string') {
            rejects.push(nls_1.localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'title'));
            return false;
        }
        if (candidate.category && typeof candidate.category !== 'string') {
            rejects.push(nls_1.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'category'));
            return false;
        }
        return true;
    }
    var commandType = {
        type: 'object',
        properties: {
            command: {
                description: nls_1.localize('vscode.extension.contributes.commandType.command', 'Identifier of the command to execute'),
                type: 'string'
            },
            title: {
                description: nls_1.localize('vscode.extension.contributes.commandType.title', 'Title by which the command is represented in the UI.'),
                type: 'string'
            },
            category: {
                description: nls_1.localize('vscode.extension.contributes.commandType.category', '(Optional) category string by the command is grouped in the UI'),
                type: 'string'
            }
        }
    };
    var commandsExtPoint = pluginsRegistry_1.PluginsRegistry.registerExtensionPoint('commands', {
        description: nls_1.localize('vscode.extension.contributes.commands', "Contributes commands to the command palette."),
        oneOf: [
            commandType,
            {
                type: 'array',
                items: commandType
            }
        ]
    });
    var ActionsService = (function () {
        function ActionsService(pluginService, keybindingsService) {
            var _this = this;
            this._extensionsActions = [];
            this._pluginService = pluginService;
            this._keybindingsService = keybindingsService;
            commandsExtPoint.setHandler(function (extensions) {
                for (var _i = 0; _i < extensions.length; _i++) {
                    var d = extensions[_i];
                    _this._onDescription(d.value, d.collector);
                }
            });
        }
        ActionsService.prototype._onDescription = function (commands, collector) {
            if (isCommands(commands)) {
                for (var _i = 0; _i < commands.length; _i++) {
                    var command = commands[_i];
                    this._handleCommand(command, collector);
                }
            }
            else {
                this._handleCommand(commands, collector);
            }
        };
        ActionsService.prototype._handleCommand = function (command, collector) {
            var _this = this;
            var rejects = [];
            if (isValidCommand(command, rejects)) {
                // make sure this plugin is activated by this command
                var activationEvent = "onCommand:" + command.command;
                // action that (1) activates the plugin and dispatches the command
                var label = command.category ? nls_1.localize('category.label', "{0}: {1}", command.category, command.title) : command.title;
                var action = new actions_1.Action(command.command, label, undefined, true, function () {
                    return _this._pluginService.activateByEvent(activationEvent).then(function () {
                        return _this._keybindingsService.executeCommand(command.command);
                    });
                });
                this._extensionsActions.push(action);
            }
            if (rejects.length > 0) {
                collector.error(nls_1.localize('error', "Invalid `contributes.{0}`: {1}", commandsExtPoint.name, rejects.join('\n')));
            }
        };
        ActionsService.prototype.getActions = function () {
            return this._extensionsActions.slice(0);
        };
        ActionsService = __decorate([
            __param(0, plugins_1.IPluginService),
            __param(1, keybindingService_1.IKeybindingService)
        ], ActionsService);
        return ActionsService;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ActionsService;
});
//# sourceMappingURL=actionsService.js.map