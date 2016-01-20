/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/nls', 'vs/base/common/severity', 'vs/base/common/winjs.base', 'vs/base/browser/dom', 'vs/base/browser/keyboardEvent', 'vs/platform/keybinding/common/keybindingsRegistry', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/keybinding/common/keybindingResolver', 'vs/base/common/keyCodes', 'vs/css!./keybindings'], function (require, exports, nls, severity_1, winjs_base_1, DOM, keyboardEvent_1, keybindingsRegistry_1, keybindingService_1, keybindingResolver_1, keyCodes_1) {
    var KEYBINDING_CONTEXT_ATTR = 'data-keybinding-context';
    var KeybindingContext = (function () {
        function KeybindingContext(id, parent) {
            this._id = id;
            this._parent = parent;
            this._value = Object.create(null);
            this._value['_contextId'] = id;
        }
        KeybindingContext.prototype.setValue = function (key, value) {
            //		console.log('SET ' + key + ' = ' + value + ' ON ' + this._id);
            this._value[key] = value;
        };
        KeybindingContext.prototype.removeValue = function (key) {
            //		console.log('REMOVE ' + key + ' FROM ' + this._id);
            delete this._value[key];
        };
        KeybindingContext.prototype.getValue = function () {
            var r = this._parent ? this._parent.getValue() : Object.create(null);
            for (var key in this._value) {
                r[key] = this._value[key];
            }
            return r;
        };
        return KeybindingContext;
    })();
    exports.KeybindingContext = KeybindingContext;
    var KeybindingContextKey = (function () {
        function KeybindingContextKey(parent, key, defaultValue) {
            this._parent = parent;
            this._key = key;
            this._defaultValue = defaultValue;
            if (typeof this._defaultValue !== 'undefined') {
                this._parent.setContext(this._key, this._defaultValue);
            }
        }
        KeybindingContextKey.prototype.set = function (value) {
            this._parent.setContext(this._key, value);
        };
        KeybindingContextKey.prototype.reset = function () {
            if (typeof this._defaultValue === 'undefined') {
                this._parent.removeContext(this._key);
            }
            else {
                this._parent.setContext(this._key, this._defaultValue);
            }
        };
        return KeybindingContextKey;
    })();
    var AbstractKeybindingService = (function () {
        function AbstractKeybindingService(myContextId) {
            this.serviceId = keybindingService_1.IKeybindingService;
            this._myContextId = myContextId;
            this._instantiationService = null;
            this._messageService = null;
        }
        AbstractKeybindingService.prototype.setMessageService = function (messageService) {
            this._messageService = messageService;
        };
        AbstractKeybindingService.prototype.createKey = function (key, defaultValue) {
            return new KeybindingContextKey(this, key, defaultValue);
        };
        AbstractKeybindingService.prototype.setInstantiationService = function (instantiationService) {
            this._instantiationService = instantiationService;
        };
        AbstractKeybindingService.prototype.createScoped = function (domNode) {
            return new ScopedKeybindingService(this, domNode);
        };
        AbstractKeybindingService.prototype.setContext = function (key, value) {
            this.getContext(this._myContextId).setValue(key, value);
        };
        AbstractKeybindingService.prototype.removeContext = function (key) {
            this.getContext(this._myContextId).removeValue(key);
        };
        return AbstractKeybindingService;
    })();
    exports.AbstractKeybindingService = AbstractKeybindingService;
    var KeybindingService = (function (_super) {
        __extends(KeybindingService, _super);
        function KeybindingService(domNode) {
            var _this = this;
            this._lastContextId = -1;
            _super.call(this, (++this._lastContextId));
            this._domNode = domNode;
            this._contexts = Object.create(null);
            this._contexts[String(this._myContextId)] = new KeybindingContext(this._myContextId, null);
            this._toDispose = DOM.addDisposableListener(this._domNode, DOM.EventType.KEY_DOWN, function (e) {
                var keyEvent = new keyboardEvent_1.StandardKeyboardEvent(e);
                _this._dispatch(keyEvent);
            });
            this._createOrUpdateResolver(true);
            this._currentChord = 0;
            this._currentChordStatusMessage = null;
        }
        KeybindingService.prototype.dispose = function () {
            this._toDispose.dispose();
            this._toDispose = null;
        };
        KeybindingService.prototype.getLabelFor = function (keybinding) {
            return keybinding._toUSLabel();
        };
        KeybindingService.prototype.getHTMLLabelFor = function (keybinding) {
            return keybinding._toUSHTMLLabel();
        };
        KeybindingService.prototype.getElectronAcceleratorFor = function (keybinding) {
            return keybinding._toElectronAccelerator();
        };
        KeybindingService.prototype.updateResolver = function () {
            this._createOrUpdateResolver(false);
        };
        KeybindingService.prototype._createOrUpdateResolver = function (isFirstTime) {
            this._resolver = new keybindingResolver_1.KeybindingResolver(keybindingsRegistry_1.KeybindingsRegistry.getDefaultKeybindings(), this._getExtraKeybindings(isFirstTime));
        };
        KeybindingService.prototype._getExtraKeybindings = function (isFirstTime) {
            return [];
        };
        KeybindingService.prototype.getDefaultKeybindings = function () {
            return this._resolver.getDefaultKeybindings() + '\n\n' + this._getAllCommandsAsComment();
        };
        KeybindingService.prototype.customKeybindingsCount = function () {
            return 0;
        };
        KeybindingService.prototype.lookupKeybindings = function (commandId) {
            return this._resolver.lookupKeybinding(commandId);
        };
        KeybindingService.prototype._getAllCommandsAsComment = function () {
            var boundCommands = this._resolver.getDefaultBoundCommands();
            var unboundCommands = Object.keys(keybindingsRegistry_1.KeybindingsRegistry.getCommands()).filter(function (commandId) { return commandId[0] !== '_' && !boundCommands[commandId]; });
            unboundCommands.sort();
            var pretty = unboundCommands.join('\n// - ');
            return '// ' + nls.localize('unboundCommands', "Here are other available commands: ") + '\n// - ' + pretty;
        };
        KeybindingService.prototype._getCommandHandler = function (commandId) {
            return keybindingsRegistry_1.KeybindingsRegistry.getCommands()[commandId];
        };
        KeybindingService.prototype._dispatch = function (e) {
            var _this = this;
            var isModifierKey = (e.keyCode === keyCodes_1.KeyCode.Ctrl || e.keyCode === keyCodes_1.KeyCode.Shift || e.keyCode === keyCodes_1.KeyCode.Alt || e.keyCode === keyCodes_1.KeyCode.Meta);
            if (isModifierKey) {
                return;
            }
            var contextId = this._findContextAttr(e.target);
            var context = this.getContext(contextId);
            var contextValue = context.getValue();
            //		console.log(JSON.stringify(contextValue, null, '\t'));
            var resolveResult = this._resolver.resolve(contextValue, this._currentChord, e.asKeybinding());
            if (resolveResult && resolveResult.enterChord) {
                e.preventDefault();
                this._currentChord = resolveResult.enterChord;
                if (this._messageService) {
                    var firstPartLabel = this.getLabelFor(new keyCodes_1.Keybinding(this._currentChord));
                    this._currentChordStatusMessage = this._messageService.setStatusMessage(nls.localize('first.chord', "({0}) was pressed. Waiting for second key of chord...", firstPartLabel));
                }
                return;
            }
            if (this._messageService && this._currentChord) {
                if (!resolveResult || !resolveResult.commandId) {
                    var firstPartLabel = this.getLabelFor(new keyCodes_1.Keybinding(this._currentChord));
                    var chordPartLabel = this.getLabelFor(new keyCodes_1.Keybinding(e.asKeybinding()));
                    this._messageService.setStatusMessage(nls.localize('missing.chord', "The key combination ({0}, {1}) is not a command.", firstPartLabel, chordPartLabel), 10 * 1000 /* 10s */);
                    e.preventDefault();
                }
            }
            if (this._currentChordStatusMessage) {
                this._currentChordStatusMessage.dispose();
                this._currentChordStatusMessage = null;
            }
            this._currentChord = 0;
            if (resolveResult && resolveResult.commandId) {
                if (!/^\^/.test(resolveResult.commandId)) {
                    e.preventDefault();
                }
                var commandId = resolveResult.commandId.replace(/^\^/, '');
                this._invokeHandler(commandId, { context: contextValue }).done(undefined, function (err) {
                    _this._messageService.show(severity_1.default.Warning, err);
                });
            }
        };
        KeybindingService.prototype._invokeHandler = function (commandId, args) {
            var handler = this._getCommandHandler(commandId);
            if (!handler) {
                return winjs_base_1.TPromise.wrapError(new Error("No handler found for the command: '" + commandId + "'. Ensure there is an activation event defined, if you are an extension."));
            }
            try {
                var result = this._instantiationService.invokeFunction(handler, args);
                return winjs_base_1.TPromise.as(result);
            }
            catch (err) {
                return winjs_base_1.TPromise.wrapError(err);
            }
        };
        KeybindingService.prototype._findContextAttr = function (domNode) {
            while (domNode) {
                if (domNode.hasAttribute(KEYBINDING_CONTEXT_ATTR)) {
                    return parseInt(domNode.getAttribute(KEYBINDING_CONTEXT_ATTR), 10);
                }
                domNode = domNode.parentElement;
            }
            return this._myContextId;
        };
        KeybindingService.prototype.getContext = function (contextId) {
            return this._contexts[String(contextId)];
        };
        KeybindingService.prototype.createChildContext = function (parentContextId) {
            if (parentContextId === void 0) { parentContextId = this._myContextId; }
            var id = (++this._lastContextId);
            this._contexts[String(id)] = new KeybindingContext(id, this.getContext(parentContextId));
            return id;
        };
        KeybindingService.prototype.disposeContext = function (contextId) {
            delete this._contexts[String(contextId)];
        };
        KeybindingService.prototype.executeCommand = function (commandId, args) {
            if (args === void 0) { args = {}; }
            if (!args.context) {
                var contextId = this._findContextAttr(document.activeElement);
                var context = this.getContext(contextId);
                var contextValue = context.getValue();
                args.context = contextValue;
            }
            return this._invokeHandler(commandId, args);
        };
        return KeybindingService;
    })(AbstractKeybindingService);
    exports.KeybindingService = KeybindingService;
    var ScopedKeybindingService = (function (_super) {
        __extends(ScopedKeybindingService, _super);
        function ScopedKeybindingService(parent, domNode) {
            this._parent = parent;
            this._domNode = domNode;
            _super.call(this, this._parent.createChildContext());
            this._domNode.setAttribute(KEYBINDING_CONTEXT_ATTR, String(this._myContextId));
        }
        ScopedKeybindingService.prototype.dispose = function () {
            this._parent.disposeContext(this._myContextId);
            this._domNode.removeAttribute(KEYBINDING_CONTEXT_ATTR);
        };
        ScopedKeybindingService.prototype.getLabelFor = function (keybinding) {
            return this._parent.getLabelFor(keybinding);
        };
        ScopedKeybindingService.prototype.getHTMLLabelFor = function (keybinding) {
            return this._parent.getHTMLLabelFor(keybinding);
        };
        ScopedKeybindingService.prototype.getElectronAcceleratorFor = function (keybinding) {
            return this._parent.getElectronAcceleratorFor(keybinding);
        };
        ScopedKeybindingService.prototype.getDefaultKeybindings = function () {
            return this._parent.getDefaultKeybindings();
        };
        ScopedKeybindingService.prototype.customKeybindingsCount = function () {
            return this._parent.customKeybindingsCount();
        };
        ScopedKeybindingService.prototype.lookupKeybindings = function (commandId) {
            return this._parent.lookupKeybindings(commandId);
        };
        ScopedKeybindingService.prototype.getContext = function (contextId) {
            return this._parent.getContext(contextId);
        };
        ScopedKeybindingService.prototype.createChildContext = function (parentContextId) {
            if (parentContextId === void 0) { parentContextId = this._myContextId; }
            return this._parent.createChildContext(parentContextId);
        };
        ScopedKeybindingService.prototype.disposeContext = function (contextId) {
            this._parent.disposeContext(contextId);
        };
        ScopedKeybindingService.prototype.executeCommand = function (commandId, args) {
            return this._parent.executeCommand(commandId, args);
        };
        return ScopedKeybindingService;
    })(AbstractKeybindingService);
});
//# sourceMappingURL=keybindingServiceImpl.js.map