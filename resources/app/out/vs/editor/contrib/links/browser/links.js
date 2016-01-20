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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/common/platform', 'vs/base/common/errors', 'vs/base/common/uri', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/common/editorCommon', 'vs/platform/editor/common/editor', 'vs/platform/message/common/message', 'vs/base/common/severity', 'vs/base/common/keyCodes', 'vs/css!./links'], function (require, exports, nls, winjs_base_1, Platform, Errors, uri_1, editorCommonExtensions_1, editorAction_1, EditorCommon, editor_1, message_1, severity_1, keyCodes_1) {
    var LinkOccurence = (function () {
        function LinkOccurence(link, decorationId /*, changeAccessor:EditorCommon.IModelDecorationsChangeAccessor*/) {
            this.link = link;
            this.decorationId = decorationId;
        }
        LinkOccurence.decoration = function (link) {
            return {
                range: {
                    startLineNumber: link.range.startLineNumber,
                    startColumn: link.range.startColumn,
                    endLineNumber: link.range.startLineNumber,
                    endColumn: link.range.endColumn
                },
                options: LinkOccurence._getOptions(link, false)
            };
        };
        LinkOccurence._getOptions = function (link, isActive) {
            var result = '';
            if (link.extraInlineClassName) {
                result = link.extraInlineClassName + ' ';
            }
            if (isActive) {
                result += LinkDetector.CLASS_NAME_ACTIVE;
            }
            else {
                result += LinkDetector.CLASS_NAME;
            }
            return {
                stickiness: EditorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                inlineClassName: result,
                hoverMessage: LinkDetector.HOVER_MESSAGE_GENERAL
            };
        };
        LinkOccurence.prototype.activate = function (changeAccessor) {
            changeAccessor.changeDecorationOptions(this.decorationId, LinkOccurence._getOptions(this.link, true));
        };
        LinkOccurence.prototype.deactivate = function (changeAccessor) {
            changeAccessor.changeDecorationOptions(this.decorationId, LinkOccurence._getOptions(this.link, false));
        };
        return LinkOccurence;
    })();
    var LinkDetector = (function () {
        function LinkDetector(editor, editorService, messageService) {
            var _this = this;
            this.editor = editor;
            this.editorService = editorService;
            this.messageService = messageService;
            this.listenersToRemove = [];
            this.listenersToRemove.push(editor.addListener('change', function (e) { return _this.onChange(); }));
            this.listenersToRemove.push(editor.addListener(EditorCommon.EventType.ModelChanged, function (e) { return _this.onModelChanged(); }));
            this.listenersToRemove.push(editor.addListener(EditorCommon.EventType.ModelModeChanged, function (e) { return _this.onModelModeChanged(); }));
            this.listenersToRemove.push(editor.addListener(EditorCommon.EventType.ModelModeSupportChanged, function (e) {
                if (e.linkSupport) {
                    _this.onModelModeChanged();
                }
            }));
            this.listenersToRemove.push(this.editor.addListener(EditorCommon.EventType.MouseUp, function (e) { return _this.onEditorMouseUp(e); }));
            this.listenersToRemove.push(this.editor.addListener(EditorCommon.EventType.MouseMove, function (e) { return _this.onEditorMouseMove(e); }));
            this.listenersToRemove.push(this.editor.addListener(EditorCommon.EventType.KeyDown, function (e) { return _this.onEditorKeyDown(e); }));
            this.listenersToRemove.push(this.editor.addListener(EditorCommon.EventType.KeyUp, function (e) { return _this.onEditorKeyUp(e); }));
            this.timeoutPromise = null;
            this.computePromise = null;
            this.currentOccurences = {};
            this.activeLinkDecorationId = null;
            this.beginCompute();
        }
        LinkDetector.prototype.isComputing = function () {
            return winjs_base_1.TPromise.is(this.computePromise);
        };
        LinkDetector.prototype.onModelChanged = function () {
            this.lastMouseEvent = null;
            this.currentOccurences = {};
            this.activeLinkDecorationId = null;
            this.stop();
            this.beginCompute();
        };
        LinkDetector.prototype.onModelModeChanged = function () {
            this.stop();
            this.beginCompute();
        };
        LinkDetector.prototype.onChange = function () {
            var _this = this;
            if (!this.timeoutPromise) {
                this.timeoutPromise = winjs_base_1.TPromise.timeout(LinkDetector.RECOMPUTE_TIME);
                this.timeoutPromise.then(function () {
                    _this.timeoutPromise = null;
                    _this.beginCompute();
                });
            }
        };
        LinkDetector.prototype.beginCompute = function () {
            var _this = this;
            if (!this.editor.getModel()) {
                return;
            }
            var mode = this.editor.getModel().getMode();
            if (mode.linkSupport) {
                this.computePromise = mode.linkSupport.computeLinks(this.editor.getModel().getAssociatedResource());
                this.computePromise.then(function (links) {
                    _this.updateDecorations(links);
                    _this.computePromise = null;
                });
            }
        };
        LinkDetector.prototype.updateDecorations = function (links) {
            var _this = this;
            this.editor.changeDecorations(function (changeAccessor) {
                var oldDecorations = [];
                for (var decorationId in _this.currentOccurences) {
                    if (_this.currentOccurences.hasOwnProperty(decorationId)) {
                        var occurance = _this.currentOccurences[decorationId];
                        oldDecorations.push(occurance.decorationId);
                    }
                }
                var newDecorations = [];
                if (links) {
                    // Not sure why this is sometimes null
                    for (var i = 0; i < links.length; i++) {
                        newDecorations.push(LinkOccurence.decoration(links[i]));
                    }
                }
                var decorations = changeAccessor.deltaDecorations(oldDecorations, newDecorations);
                _this.currentOccurences = {};
                _this.activeLinkDecorationId = null;
                for (var i_1 = 0, len = decorations.length; i_1 < len; i_1++) {
                    var occurance = new LinkOccurence(links[i_1], decorations[i_1]);
                    _this.currentOccurences[occurance.decorationId] = occurance;
                }
            });
        };
        LinkDetector.prototype.onEditorKeyDown = function (e) {
            if (e.keyCode === LinkDetector.TRIGGER_KEY_VALUE && this.lastMouseEvent) {
                this.onEditorMouseMove(this.lastMouseEvent, e);
            }
        };
        LinkDetector.prototype.onEditorKeyUp = function (e) {
            if (e.keyCode === LinkDetector.TRIGGER_KEY_VALUE) {
                this.cleanUpActiveLinkDecoration();
            }
        };
        LinkDetector.prototype.onEditorMouseMove = function (mouseEvent, withKey) {
            var _this = this;
            this.lastMouseEvent = mouseEvent;
            if (this.isEnabled(mouseEvent, withKey)) {
                this.cleanUpActiveLinkDecoration(); // always remove previous link decoration as their can only be one
                var occurence = this.getLinkOccurence(mouseEvent.target.position);
                if (occurence) {
                    this.editor.changeDecorations(function (changeAccessor) {
                        occurence.activate(changeAccessor);
                        _this.activeLinkDecorationId = occurence.decorationId;
                    });
                }
            }
            else {
                this.cleanUpActiveLinkDecoration();
            }
        };
        LinkDetector.prototype.cleanUpActiveLinkDecoration = function () {
            if (this.activeLinkDecorationId) {
                var occurence = this.currentOccurences[this.activeLinkDecorationId];
                if (occurence) {
                    this.editor.changeDecorations(function (changeAccessor) {
                        occurence.deactivate(changeAccessor);
                    });
                }
                this.activeLinkDecorationId = null;
            }
        };
        LinkDetector.prototype.onEditorMouseUp = function (mouseEvent) {
            if (!this.isEnabled(mouseEvent)) {
                return;
            }
            var occurence = this.getLinkOccurence(mouseEvent.target.position);
            if (!occurence) {
                return;
            }
            this.openLinkOccurence(occurence, mouseEvent.event.altKey);
        };
        LinkDetector.prototype.openLinkOccurence = function (occurence, openToSide) {
            if (!this.editorService) {
                return;
            }
            var link = occurence.link;
            var absoluteUrl = link.url;
            var hashIndex = absoluteUrl.indexOf('#');
            var lineNumber = -1;
            var column = -1;
            if (hashIndex >= 0) {
                var hash = absoluteUrl.substr(hashIndex + 1);
                var selection = hash.split(',');
                if (selection.length > 0) {
                    lineNumber = Number(selection[0]);
                }
                if (selection.length > 1) {
                    column = Number(selection[1]);
                }
                if (lineNumber >= 0 || column >= 0) {
                    absoluteUrl = absoluteUrl.substr(0, hashIndex);
                }
            }
            var url;
            try {
                url = uri_1.default.parse(absoluteUrl);
            }
            catch (err) {
                // invalid url
                this.messageService.show(severity_1.default.Warning, nls.localize('invalid.url', 'Invalid URI: cannot open {0}', absoluteUrl));
                return;
            }
            var input = {
                resource: url
            };
            if (lineNumber >= 0) {
                input.options = {
                    selection: { startLineNumber: lineNumber, startColumn: column }
                };
            }
            this.editorService.openEditor(input, openToSide).done(null, Errors.onUnexpectedError);
        };
        LinkDetector.prototype.getLinkOccurence = function (position) {
            var decorations = this.editor.getModel().getDecorationsInRange({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            }, null, true);
            for (var i = 0; i < decorations.length; i++) {
                var decoration = decorations[i];
                var currentOccurence = this.currentOccurences[decoration.id];
                if (currentOccurence) {
                    return currentOccurence;
                }
            }
            return null;
        };
        LinkDetector.prototype.isEnabled = function (mouseEvent, withKey) {
            return mouseEvent.target.type === EditorCommon.MouseTargetType.CONTENT_TEXT &&
                (mouseEvent.event[LinkDetector.TRIGGER_MODIFIER] || (withKey && withKey.keyCode === LinkDetector.TRIGGER_KEY_VALUE)) &&
                !!this.editor.getModel().getMode().linkSupport;
        };
        LinkDetector.prototype.stop = function () {
            if (this.timeoutPromise) {
                this.timeoutPromise.cancel();
                this.timeoutPromise = null;
            }
            if (this.computePromise) {
                this.computePromise.cancel();
                this.computePromise = null;
            }
        };
        LinkDetector.prototype.dispose = function () {
            this.listenersToRemove.forEach(function (element) {
                element();
            });
            this.listenersToRemove = [];
            this.stop();
        };
        LinkDetector.RECOMPUTE_TIME = 1000; // ms
        LinkDetector.TRIGGER_KEY_VALUE = Platform.isMacintosh ? keyCodes_1.KeyCode.Meta : keyCodes_1.KeyCode.Ctrl;
        LinkDetector.TRIGGER_MODIFIER = Platform.isMacintosh ? 'metaKey' : 'ctrlKey';
        LinkDetector.HOVER_MESSAGE_GENERAL = Platform.isMacintosh ? nls.localize('links.navigate.mac', "Cmd + click to follow link") : nls.localize('links.navigate', "Ctrl + click to follow link");
        LinkDetector.CLASS_NAME = 'detected-link';
        LinkDetector.CLASS_NAME_ACTIVE = 'detected-link-active';
        return LinkDetector;
    })();
    var OpenLinkAction = (function (_super) {
        __extends(OpenLinkAction, _super);
        function OpenLinkAction(descriptor, editor, editorService, messageService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.UpdateOnCursorPositionChange);
            this._linkDetector = new LinkDetector(editor, editorService, messageService);
        }
        OpenLinkAction.prototype.dispose = function () {
            this._linkDetector.dispose();
            _super.prototype.dispose.call(this);
        };
        OpenLinkAction.prototype.getEnablementState = function () {
            if (this._linkDetector.isComputing()) {
                // optimistic enablement while state is being computed
                return true;
            }
            return !!this._linkDetector.getLinkOccurence(this.editor.getPosition());
        };
        OpenLinkAction.prototype.run = function () {
            var link = this._linkDetector.getLinkOccurence(this.editor.getPosition());
            if (link) {
                this._linkDetector.openLinkOccurence(link, false);
            }
            return winjs_base_1.TPromise.as(null);
        };
        OpenLinkAction.ID = 'editor.action.openLink';
        OpenLinkAction = __decorate([
            __param(2, editor_1.IEditorService),
            __param(3, message_1.IMessageService)
        ], OpenLinkAction);
        return OpenLinkAction;
    })(editorAction_1.EditorAction);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(OpenLinkAction, OpenLinkAction.ID, nls.localize('label', "Open Link")));
});
//# sourceMappingURL=links.js.map