/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", 'vs/nls', 'vs/base/common/severity', 'vs/base/common/errors', 'vs/base/browser/dom', 'vs/base/common/lifecycle', 'vs/base/common/actions', 'vs/platform/plugins/common/plugins', 'vs/platform/instantiation/common/instantiation', 'vs/platform/message/common/message', 'vs/workbench/parts/extensions/electron-browser/extensionsActions', 'vs/workbench/parts/extensions/common/extensions'], function (require, exports, nls, severity_1, errors, dom, lifecycle, actions_1, plugins_1, instantiation_1, message_1, extensionsActions_1, extensions_1) {
    var $ = dom.emmet;
    var ExtensionsStatusbarItem = (function () {
        function ExtensionsStatusbarItem(pluginService, messageService, extensionsService, instantiationService) {
            var _this = this;
            this.messageService = messageService;
            this.extensionsService = extensionsService;
            this.instantiationService = instantiationService;
            this.toDispose = [];
            this.messageCount = 0;
            pluginService.onReady().then(function () {
                _this.status = pluginService.getPluginsStatus();
                Object.keys(_this.status).forEach(function (key) {
                    _this.messageCount += _this.status[key].messages.filter(function (message) { return message.type > severity_1.default.Info; }).length;
                });
                _this.render(_this.container);
            });
        }
        ExtensionsStatusbarItem.prototype.render = function (container) {
            var _this = this;
            this.container = container;
            if (this.messageCount > 0) {
                this.domNode = dom.append(container, $('a.extensions-statusbar'));
                var issueLabel = this.messageCount > 1 ? nls.localize('issues', "issues") : nls.localize('issue', "issue");
                var extensionLabel = nls.localize('extension', "extension");
                this.domNode.title = this.messageCount + " " + extensionLabel + " " + issueLabel;
                this.domNode.textContent = this.messageCount + " " + issueLabel;
                this.toDispose.push(dom.addDisposableListener(this.domNode, 'click', function () {
                    _this.extensionsService.getInstalled().done(function (installed) {
                        Object.keys(_this.status).forEach(function (key) {
                            _this.status[key].messages.forEach(function (m) {
                                if (m.type > severity_1.default.Info) {
                                    var extension = installed.filter(function (ext) { return ext.path === m.source; }).pop();
                                    var actions = [message_1.CloseAction];
                                    if (extension) {
                                        var actionLabel = nls.localize('uninstall', "Uninstall") + ' ' + (extension.name ? extension.name : 'Extension');
                                        actions.push(new actions_1.Action('extensions.uninstall2', actionLabel, null, true, function () { return _this.instantiationService.createInstance(extensionsActions_1.UninstallAction).run(extension); }));
                                    }
                                    _this.messageService.show(m.type, {
                                        message: (m.source ? '[' + m.source + ']: ' : '') + m.message,
                                        actions: actions
                                    });
                                }
                            });
                        });
                    }, errors.onUnexpectedError);
                }));
            }
            return {
                dispose: function () { return lifecycle.disposeAll(_this.toDispose); }
            };
        };
        ExtensionsStatusbarItem = __decorate([
            __param(0, plugins_1.IPluginService),
            __param(1, message_1.IMessageService),
            __param(2, extensions_1.IExtensionsService),
            __param(3, instantiation_1.IInstantiationService)
        ], ExtensionsStatusbarItem);
        return ExtensionsStatusbarItem;
    })();
    exports.ExtensionsStatusbarItem = ExtensionsStatusbarItem;
});
//# sourceMappingURL=extensionsWidgets.js.map