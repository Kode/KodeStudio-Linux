/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/base/common/errors', 'vs/base/browser/dom', 'vs/base/parts/tree/browser/treeImpl', 'vs/base/parts/tree/browser/treeDefaults', 'vs/editor/browser/editorBrowser', 'vs/workbench/parts/debug/browser/debugViewer'], function (require, exports, errors, dom, treeImpl_1, treeDefaults_1, editorbrowser, viewer) {
    var $ = dom.emmet;
    var debugTreeOptions = {
        indentPixels: 6,
        twistiePixels: 12
    };
    var MAX_ELEMENTS_SHOWN = 18;
    var DebugHoverWidget = (function () {
        function DebugHoverWidget(editor, debugService, instantiationService) {
            var _this = this;
            this.editor = editor;
            this.debugService = debugService;
            this.instantiationService = instantiationService;
            // editor.IContentWidget.allowEditorOverflow
            this.allowEditorOverflow = true;
            this.domNode = $('.debug-hover-widget monaco-editor-background');
            this.treeContainer = dom.append(this.domNode, $('.debug-hover-tree'));
            this.tree = new treeImpl_1.Tree(this.treeContainer, {
                dataSource: new viewer.VariablesDataSource(this.debugService),
                renderer: this.instantiationService.createInstance(VariablesHoverRenderer),
                controller: new DebugHoverController()
            }, debugTreeOptions);
            this.tree.addListener2('item:expanded', function () {
                _this.layoutTree();
            });
            this.tree.addListener2('item:collapsed', function () {
                _this.layoutTree();
            });
            this.valueContainer = dom.append(this.domNode, $('.debug-hover-value'));
            this.isVisible = false;
            this.showAtPosition = null;
            this.lastHoveringOver = null;
            this.highlightDecorations = [];
            this.editor.addContentWidget(this);
        }
        DebugHoverWidget.prototype.getId = function () {
            return DebugHoverWidget.ID;
        };
        DebugHoverWidget.prototype.getDomNode = function () {
            return this.domNode;
        };
        DebugHoverWidget.prototype.showAt = function (range) {
            var _this = this;
            var pos = range.getStartPosition();
            var model = this.editor.getModel();
            var wordAtPosition = model.getWordAtPosition(pos);
            var hoveringOver = wordAtPosition ? wordAtPosition.word : null;
            var focusedStackFrame = this.debugService.getViewModel().getFocusedStackFrame();
            if (!hoveringOver || !focusedStackFrame || (this.isVisible && hoveringOver === this.lastHoveringOver) ||
                (focusedStackFrame.source.uri.toString() !== model.getAssociatedResource().toString())) {
                return;
            }
            // string magic to get the parents of the variable (a and b for a.b.foo)
            var lineContent = model.getLineContent(pos.lineNumber);
            var namesToFind = lineContent.substring(0, lineContent.indexOf('.' + hoveringOver))
                .split('.').map(function (word) { return word.trim(); }).filter(function (word) { return !!word; });
            namesToFind.push(hoveringOver);
            namesToFind[0] = namesToFind[0].substring(namesToFind[0].lastIndexOf(' ') + 1);
            var variables = [];
            focusedStackFrame.getScopes(this.debugService).done(function (scopes) {
                // flatten out scopes lists
                return scopes.reduce(function (accum, scopes) { return accum.concat(scopes); }, [])
                    .filter(function (scope) { return !scope.expensive; })
                    .map(function (scope) { return scope.getChildren(_this.debugService).done(function (children) {
                    // look for our variable in the list. First find the parents of the hovered variable if there are any.
                    for (var i = 0; i < namesToFind.length && children; i++) {
                        // some languages pass the type as part of the name, so need to check if the last word of the name matches.
                        var filtered = children.filter(function (v) { return typeof v.name === 'string' && (namesToFind[i] === v.name || namesToFind[i] === v.name.substr(v.name.lastIndexOf(' ') + 1)); });
                        if (filtered.length !== 1) {
                            break;
                        }
                        if (i === namesToFind.length - 1) {
                            variables.push(filtered[0]);
                        }
                        else {
                            filtered[0].getChildren(_this.debugService).done(function (c) { return children = c; }, children = null);
                        }
                    }
                }, errors.onUnexpectedError); });
            }, errors.onUnexpectedError);
            // don't show if there are duplicates across scopes
            if (variables.length !== 1) {
                this.hide();
                return;
            }
            // show it
            this.highlightDecorations = this.editor.deltaDecorations(this.highlightDecorations, [{
                    range: {
                        startLineNumber: pos.lineNumber,
                        endLineNumber: pos.lineNumber,
                        startColumn: wordAtPosition.startColumn,
                        endColumn: wordAtPosition.endColumn
                    },
                    options: {
                        className: 'hoverHighlight'
                    }
                }]);
            this.lastHoveringOver = hoveringOver;
            this.doShow(pos, variables[0]);
        };
        DebugHoverWidget.prototype.doShow = function (position, expression) {
            var _this = this;
            if (expression.reference > 0) {
                this.valueContainer.hidden = true;
                this.treeContainer.hidden = false;
                this.tree.setInput(expression).then(function () {
                    _this.layoutTree();
                }).done(null, errors.onUnexpectedError);
            }
            else {
                this.treeContainer.hidden = true;
                this.valueContainer.hidden = false;
                viewer.renderExpressionValue(expression, false, this.valueContainer);
            }
            this.showAtPosition = position;
            this.isVisible = true;
            this.editor.layoutContentWidget(this);
        };
        DebugHoverWidget.prototype.layoutTree = function () {
            var navigator = this.tree.getNavigator();
            var visibleElementsCount = 0;
            while (navigator.next()) {
                visibleElementsCount++;
            }
            var height = Math.min(visibleElementsCount, MAX_ELEMENTS_SHOWN) * 18;
            if (this.treeContainer.clientHeight !== height) {
                this.treeContainer.style.height = height + "px";
                this.tree.layout();
            }
        };
        DebugHoverWidget.prototype.hide = function () {
            if (!this.isVisible) {
                // already not visible
                return;
            }
            this.isVisible = false;
            this.editor.deltaDecorations(this.highlightDecorations, []);
            this.highlightDecorations = [];
            this.editor.layoutContentWidget(this);
        };
        DebugHoverWidget.prototype.getPosition = function () {
            return this.isVisible ? {
                position: this.showAtPosition,
                preference: [
                    editorbrowser.ContentWidgetPositionPreference.ABOVE,
                    editorbrowser.ContentWidgetPositionPreference.BELOW
                ]
            } : null;
        };
        DebugHoverWidget.ID = 'debug.hoverWidget';
        return DebugHoverWidget;
    })();
    exports.DebugHoverWidget = DebugHoverWidget;
    var DebugHoverController = (function (_super) {
        __extends(DebugHoverController, _super);
        function DebugHoverController() {
            _super.apply(this, arguments);
        }
        /* protected */ DebugHoverController.prototype.onLeftClick = function (tree, element, eventish, origin) {
            if (origin === void 0) { origin = 'mouse'; }
            if (element.reference > 0) {
                _super.prototype.onLeftClick.call(this, tree, element, eventish, origin);
                tree.clearFocus();
                tree.deselect(element);
            }
            return true;
        };
        return DebugHoverController;
    })(treeDefaults_1.DefaultController);
    var VariablesHoverRenderer = (function (_super) {
        __extends(VariablesHoverRenderer, _super);
        function VariablesHoverRenderer() {
            _super.apply(this, arguments);
        }
        VariablesHoverRenderer.prototype.getHeight = function (tree, element) {
            return 18;
        };
        return VariablesHoverRenderer;
    })(viewer.VariablesRenderer);
});
//# sourceMappingURL=debugHover.js.map