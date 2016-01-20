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
define(["require", "exports", 'vs/nls', 'vs/base/common/severity', 'vs/base/common/strings', 'vs/base/common/winjs.base', 'vs/editor/common/modes/abstractModeWorker', 'vs/languages/css/common/services/cssLanguageService', 'vs/languages/css/common/services/languageFacts', './services/occurrences', 'vs/languages/css/common/services/intelliSense', 'vs/languages/css/common/parser/cssNodes', 'vs/languages/css/common/level', 'vs/languages/css/common/parser/cssParser', 'vs/languages/css/common/services/selectorPrinting', 'vs/languages/css/common/services/lint', 'vs/languages/css/common/services/lintRules', 'vs/editor/common/modes/supports', 'vs/platform/markers/common/markers', 'vs/editor/common/services/resourceService'], function (require, exports, nls, severity_1, strings, winjs, abstractModeWorker_1, languageService, languageFacts, occurrences, cssIntellisense, nodes, _level, parser, selectorPrinting, lint, lintRules, supports, markers_1, resourceService_1) {
    var CSSWorker = (function (_super) {
        __extends(CSSWorker, _super);
        function CSSWorker(mode, participants, resourceService, markerService) {
            _super.call(this, mode, participants, resourceService, markerService);
            this.languageService = this.createLanguageService(resourceService, mode.getId());
            this.lintSettings = {};
            this.validationEnabled = true;
        }
        CSSWorker.prototype._createInPlaceReplaceSupport = function () {
            return new supports.WorkerInplaceReplaceSupport(this.resourceService, this);
        };
        CSSWorker.prototype.createLanguageService = function (resourceService, modeId) {
            return new languageService.CSSLanguageService(resourceService, this.createParser.bind(this), modeId);
        };
        CSSWorker.prototype.createParser = function () {
            return new parser.Parser();
        };
        /**
         * @return true if you want to revalidate your models
         */
        CSSWorker.prototype._doConfigure = function (raw) {
            if (raw) {
                this.validationEnabled = raw.validate;
                if (raw.lint) {
                    this.lintSettings = lintRules.sanitize(raw.lint);
                }
                else {
                    this.lintSettings = {};
                }
                return winjs.TPromise.as(true);
            }
            return winjs.TPromise.as(false);
        };
        CSSWorker.prototype.doValidate = function (resource) {
            var _this = this;
            if (!this.validationEnabled) {
                this.markerService.changeOne(this._getMode().getId(), resource, []);
                return;
            }
            this.languageService.join().then(function () {
                var modelMirror = _this.resourceService.get(resource), node = _this.languageService.getStylesheet(resource), entries = [];
                entries.push.apply(entries, nodes.ParseErrorCollector.entries(node));
                entries.push.apply(entries, _this.collectLintEntries(node));
                var markerData = entries
                    .filter(function (entry) { return entry.getLevel() !== _level.Level.Ignore; })
                    .map(function (entry) { return _this._createMarkerData(modelMirror, entry); });
                _this.markerService.changeOne(_this._getMode().getId(), resource, markerData);
            });
        };
        CSSWorker.prototype._createMarkerData = function (model, marker) {
            var range = model.getRangeFromOffsetAndLength(marker.getOffset(), marker.getLength());
            return {
                code: marker.getRule().id,
                message: marker.getMessage(),
                severity: marker.getLevel() === _level.Level.Warning ? severity_1.default.Warning : severity_1.default.Error,
                startLineNumber: range.startLineNumber,
                startColumn: range.startColumn,
                endLineNumber: range.endLineNumber,
                endColumn: range.endColumn
            };
        };
        CSSWorker.prototype.collectLintEntries = function (stylesheet) {
            return lint.LintVisitor.entries(stylesheet, this.lintSettings);
        };
        CSSWorker.prototype.createIntellisense = function () {
            return new cssIntellisense.CSSIntellisense();
        };
        CSSWorker.prototype.doSuggest = function (resource, position) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource);
                var result = _this.createIntellisense().getCompletionsAtPosition(_this.languageService, model, resource, position);
                return result;
            });
        };
        CSSWorker.prototype.getRangesToPosition = function (resource, position) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource), offset = model.getOffsetFromPosition(position), styleSheet = _this.languageService.getStylesheet(resource), path = nodes.getNodePath(styleSheet, offset), result = [];
                for (var i = 0; i < path.length; i++) {
                    var node = path[i];
                    if (node.offset === -1 || node.length === -1) {
                        continue;
                    }
                    if (node.parent && node.parent.offset === node.offset && node.parent.length === node.length) {
                        continue;
                    }
                    result.push({
                        type: 'node',
                        range: _this._range(node, model)
                    });
                }
                return result;
            });
        };
        CSSWorker.prototype.getOutline = function (resource) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource), stylesheet = _this.languageService.getStylesheet(resource), result = [];
                stylesheet.accept(function (node) {
                    var entry = {
                        label: null,
                        type: 'rule',
                        range: null,
                        children: []
                    };
                    if (node instanceof nodes.Selector) {
                        entry.label = node.getText();
                    }
                    else if (node instanceof nodes.VariableDeclaration) {
                        entry.label = node.getName();
                        entry.type = 'variable';
                    }
                    else if (node instanceof nodes.MixinDeclaration) {
                        entry.label = node.getName();
                        entry.type = 'method';
                    }
                    else if (node instanceof nodes.FunctionDeclaration) {
                        entry.label = node.getName();
                        entry.type = 'function';
                    }
                    else if (node instanceof nodes.Keyframe) {
                        entry.label = nls.localize('literal.keyframes', "@keyframes {0}", node.getName());
                    }
                    else if (node instanceof nodes.FontFace) {
                        entry.label = nls.localize('literal.fontface', "@font-face");
                    }
                    if (entry.label) {
                        entry.range = _this._range(node, model, true);
                        result.push(entry);
                    }
                    return true;
                });
                return result;
            });
        };
        CSSWorker.prototype.computeInfo = function (resource, position) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource), offset = model.getOffsetFromPosition(position), stylesheet = _this.languageService.getStylesheet(resource), nodepath = nodes.getNodePath(stylesheet, offset);
                for (var i = 0; i < nodepath.length; i++) {
                    var node = nodepath[i];
                    if (node instanceof nodes.Selector) {
                        return {
                            htmlContent: [selectorPrinting.selectorToHtml(node)],
                            range: _this._range(node, model)
                        };
                    }
                    if (node instanceof nodes.SimpleSelector) {
                        return {
                            htmlContent: [selectorPrinting.simpleSelectorToHtml(node)],
                            range: _this._range(node, model)
                        };
                    }
                }
                return null;
            });
        };
        CSSWorker.prototype.findDeclaration = function (resource, position) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource), offset = model.getOffsetFromPosition(position), node = occurrences.findDeclaration(_this.languageService.getStylesheet(resource), offset);
                if (!node) {
                    return null;
                }
                return {
                    resource: resource,
                    range: _this._range(node, model, true)
                };
            });
        };
        CSSWorker.prototype.findOccurrences = function (resource, position, strict) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource), offset = model.getOffsetFromPosition(position), nodes = occurrences.findOccurrences(_this.languageService.getStylesheet(resource), offset);
                return nodes.map(function (occurrence) {
                    return {
                        range: _this._range(occurrence.node, model),
                        kind: occurrence.kind
                    };
                });
            });
        };
        CSSWorker.prototype.findReferences = function (resource, position) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource), offset = model.getOffsetFromPosition(position), nodes = occurrences.findOccurrences(_this.languageService.getStylesheet(resource), offset);
                return nodes.map(function (occurrence) {
                    return {
                        resource: model.getAssociatedResource(),
                        range: _this._range(occurrence.node, model)
                    };
                });
            });
        };
        CSSWorker.prototype.navigateValueSetFallback = function (resource, range, up) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource);
                var offset = model.getOffsetFromPosition({ lineNumber: range.startLineNumber, column: range.startColumn });
                var styleSheet = _this.languageService.getStylesheet(resource);
                var node = nodes.getNodeAtOffset(styleSheet, offset);
                if (!node) {
                    return;
                }
                var declaration = nodes.getParentDeclaration(node);
                if (!declaration) {
                    return;
                }
                var entry = languageFacts.getProperties()[declaration.getFullPropertyName()];
                if (!entry || !entry.values) {
                    return;
                }
                var values = entry.values.filter(function (value) { return languageFacts.isCommonValue(value); }).map(function (v) { return v.name; });
                var isColor = (entry.restrictions.indexOf('color') >= 0);
                if (isColor) {
                    values = values.concat(Object.getOwnPropertyNames(languageFacts.colors), Object.getOwnPropertyNames(languageFacts.colorKeywords));
                }
                var text = node.getText();
                for (var i = 0, len = values.length; i < len; i++) {
                    if (strings.equalsIgnoreCase(values[i], text)) {
                        var nextIdx = i;
                        if (up) {
                            nextIdx = (i + 1) % len;
                        }
                        else {
                            nextIdx = i - 1;
                            if (nextIdx < 0) {
                                nextIdx = len - 1;
                            }
                        }
                        var result = {
                            value: values[nextIdx],
                            range: _this._range(node, model)
                        };
                        return result;
                    }
                }
                // if none matches, take the first one
                if (values.length > 0) {
                    var result = {
                        value: values[0],
                        range: _this._range(node, model)
                    };
                    return result;
                }
                return null;
            });
        };
        CSSWorker.prototype.findColorDeclarations = function (resource) {
            var _this = this;
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource), styleSheet = _this.languageService.getStylesheet(resource), result = [];
                styleSheet.accept(function (node) {
                    if (languageFacts.isColorValue(node)) {
                        result.push({
                            range: _this._range(node, model),
                            value: node.getText()
                        });
                    }
                    return true;
                });
                return result;
            });
        };
        CSSWorker.prototype._range = function (node, model, empty) {
            if (empty === void 0) { empty = false; }
            if (empty) {
                var position = model.getPositionFromOffset(node.offset);
                return {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                };
            }
            else {
                return model.getRangeFromOffsetAndLength(node.offset, node.length);
            }
        };
        CSSWorker.prototype.getFixesForUnknownProperty = function (property) {
            var propertyName = property.getName();
            var result = [];
            for (var p in languageFacts.getProperties()) {
                var score = strings.difference(propertyName, p);
                if (score >= propertyName.length / 2 /*score_lim*/) {
                    result.push({
                        command: {
                            id: 'css.renameProptery',
                            title: nls.localize('css.quickfix.rename', "Rename to '{0}'", p),
                            arguments: [{ type: 'rename', name: p }]
                        },
                        score: score
                    });
                }
            }
            // Sort in descending order.
            result.sort(function (a, b) {
                return b.score - a.score;
            });
            return result.slice(0, 3 /*max_result*/);
        };
        CSSWorker.prototype.getQuickFixes = function (resource, marker) {
            var _this = this;
            if (marker.code !== lintRules.Rules.UnknownProperty.id) {
                return winjs.TPromise.as([]);
            }
            return this.languageService.join().then(function () {
                var model = _this.resourceService.get(resource), offset = model.getOffsetFromPosition({ column: marker.startColumn, lineNumber: marker.startLineNumber }), stylesheet = _this.languageService.getStylesheet(resource), nodepath = nodes.getNodePath(stylesheet, offset);
                for (var i = nodepath.length - 1; i >= 0; i--) {
                    var node = nodepath[i];
                    if (node instanceof nodes.Declaration) {
                        var property = node.getProperty();
                        if (property && property.offset === offset && property.length === marker.endColumn - marker.startColumn) {
                            return _this.getFixesForUnknownProperty(property);
                        }
                    }
                }
                return [];
            });
        };
        CSSWorker.prototype.runQuickFixAction = function (resource, range, quickFix) {
            var _a = quickFix.command.arguments[0], type = _a.type, name = _a.name;
            switch (type) {
                case 'rename': {
                    return winjs.TPromise.as({
                        edits: [{ resource: resource, range: range, newText: name }]
                    });
                }
            }
            return null;
        };
        CSSWorker = __decorate([
            __param(2, resourceService_1.IResourceService),
            __param(3, markers_1.IMarkerService)
        ], CSSWorker);
        return CSSWorker;
    })(abstractModeWorker_1.AbstractModeWorker);
    exports.CSSWorker = CSSWorker;
});
//# sourceMappingURL=cssWorker.js.map