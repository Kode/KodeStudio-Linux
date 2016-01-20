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
define(["require", "exports", 'vs/base/common/arrays', 'vs/languages/typescript/common/typescript', 'vs/base/common/paths', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/common/project/snapshots', 'vs/languages/typescript/common/js/rewriting', 'vs/languages/typescript/common/js/textEdits', 'vs/languages/typescript/common/lineMap', 'vs/editor/common/core/position'], function (require, exports, arrays, typescript, paths, ts, snapshots, rewriting, textEdits, LineMap, position_1) {
    var Script = (function () {
        function Script() {
            this._version = 0;
        }
        Script.prototype.update = function (value) {
            if (value !== this._value) {
                this._value = value;
                this._lineMap = undefined;
                this._snap = undefined;
                this._version += 1;
            }
            return this;
        };
        Script.prototype.version = function () {
            return this._version;
        };
        Script.prototype.snap = function () {
            if (!this._snap) {
                this._snap = snapshots.fromValue(this._value);
            }
            return this._snap;
        };
        Script.prototype.lineMap = function () {
            if (!this._lineMap) {
                this._lineMap = LineMap.create(this._value);
            }
            return this._lineMap;
        };
        return Script;
    })();
    exports.Script = Script;
    var LanguageServiceHost = (function () {
        function LanguageServiceHost(roots, scriptLookUp) {
            var _this = this;
            this._missing = createMissingFileManager();
            this._scriptLookUp = function (fileName) {
                var script = scriptLookUp(fileName);
                if (!script) {
                    _this._missing.addMissing(fileName);
                }
                return script;
            };
            this.setRoots(roots);
            this.setCompilationSettings(ts.getDefaultCompilerOptions());
        }
        LanguageServiceHost.prototype.addRoot = function (fileName) {
            if (!~this._roots.indexOf(fileName)) {
                this._roots.push(fileName);
                this._projectVersion = undefined;
                return true;
            }
        };
        LanguageServiceHost.prototype.addRootIfMissing = function (fileName) {
            if (this._missing.removeMissing(fileName)) {
                return this.addRoot(fileName);
            }
        };
        LanguageServiceHost.prototype.removeRoot = function (fileName) {
            var idx = this._roots.indexOf(fileName);
            if (~idx && !!this._roots.splice(idx, 1)) {
                this._projectVersion = undefined;
                return true;
            }
        };
        LanguageServiceHost.prototype.isRoot = function (fileName) {
            return this._roots.indexOf(fileName) >= 0;
        };
        LanguageServiceHost.prototype.setRoots = function (roots) {
            this._roots = roots;
            this._projectVersion = undefined;
        };
        LanguageServiceHost.prototype.setCompilationSettings = function (options) {
            this._projectVersion = undefined;
            this._compilerOptions = options || ts.getDefaultCompilerOptions();
            this._compilerOptions.allowNonTsExtensions = true; // because of JS* and mirror model we need this
            this._compilerOptions.module = 1 /* CommonJS */; // because of JS*
            this._compilerOptions.target = options && options.target !== undefined ? options.target : 2 /* Latest */; // because of JS*
        };
        LanguageServiceHost.prototype.getCompilationSettings = function () {
            return this._compilerOptions;
        };
        LanguageServiceHost.prototype.getMissingFileNamesSinceLastTime = function () {
            return this._missing.getMissingSinceLastTime();
        };
        LanguageServiceHost.prototype.getScriptFileNames = function () {
            return this._roots;
        };
        LanguageServiceHost.prototype.getScriptVersion = function (fileName) {
            var script = this._scriptLookUp(fileName);
            return script && script.version().toString();
        };
        LanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
            var script = this._scriptLookUp(fileName);
            return script && script.snap();
        };
        LanguageServiceHost.prototype.getScriptLineMap = function (fileName) {
            var script = this._scriptLookUp(fileName);
            return script && script.lineMap();
        };
        LanguageServiceHost.prototype.getCurrentDirectory = function () {
            return '';
        };
        LanguageServiceHost.prototype.getDefaultLibFileName = function (options) {
            if (!options || options.noLib) {
                return '';
            }
            else if (options.target === 2 /* ES6 */) {
                return typescript.defaultLibES6.toString();
            }
            else {
                return typescript.defaultLib.toString();
            }
        };
        return LanguageServiceHost;
    })();
    exports.LanguageServiceHost = LanguageServiceHost;
    var Project = (function () {
        function Project(projectService, resource, files, compilerOptions) {
            this.resource = resource;
            this.host = new LanguageServiceHost(files.map(function (r) { return r.toString(); }), projectService.lookUpScript.bind(projectService));
            this.host.setCompilationSettings(compilerOptions);
            this.languageService = ts.createLanguageService(this.host);
        }
        return Project;
    })();
    function createMissingFileManager() {
        var _missing = Object.create(null), _generation = 0;
        function addMissing(fileName) {
            _missing[fileName] = _missing[fileName] || _generation++;
        }
        function removeMissing(fileName) {
            if (_missing[fileName]) {
                delete _missing[fileName];
                return true;
            }
        }
        function getMissingSince(generation) {
            if (generation === void 0) { generation = 0; }
            var fileNames;
            for (var key in _missing) {
                if (_missing[key] >= generation) {
                    if (!fileNames) {
                        fileNames = [key];
                    }
                    else {
                        fileNames.push(key);
                    }
                }
            }
            return {
                generation: _generation,
                fileNames: fileNames
            };
        }
        var _lastTime = 0;
        function getMissingSinceLastTime() {
            var result = getMissingSince(_lastTime);
            _lastTime = result.generation;
            return result.fileNames;
        }
        return {
            addMissing: addMissing,
            removeMissing: removeMissing,
            getMissingSince: getMissingSince,
            getMissingSinceLastTime: getMissingSinceLastTime
        };
    }
    var ProjectService = (function () {
        function ProjectService() {
            this._scripts = Object.create(null);
            this._projects = Object.create(null);
            this._rewrittenProjects = Object.create(null);
            this._virtualProject = this._projects[paths.dirname(typescript.virtualProjectResource.fsPath)] = new Project(this, typescript.virtualProjectResource, [], undefined);
        }
        Object.defineProperty(ProjectService.prototype, "defaultRewriter", {
            set: function (value) {
                this._defaultRewriter = value;
            },
            enumerable: true,
            configurable: true
        });
        ProjectService.prototype.getProject = function (resource, rewriter) {
            if (rewriter === void 0) { rewriter = this._defaultRewriter; }
            var project = this._lookUpProject(resource);
            if (arrays.isFalsyOrEmpty(rewriter)) {
                return project;
            }
            var identifier = project.resource.toString() + rewriter.map(function (r) { return r.name; }).join(), rewrittenProject;
            rewrittenProject = this._rewrittenProjects[identifier] || new RewrittenProject(this, project, rewriter);
            return this._rewrittenProjects[identifier] = rewrittenProject;
        };
        ProjectService.prototype._lookUpProject = function (resource) {
            // TODO@Joh improve perf!
            var dirnames = paths.dirnames(resource.fsPath), iter = dirnames.next();
            while (!iter.done) {
                var dirname = iter.value;
                if (this._projects[dirname]
                    && this._projects[dirname].host.isRoot(resource.toString())) {
                    return this._projects[dirname];
                }
                iter = dirnames.next();
            }
            // If no configured project could be found we use a single
            // virtual project to deal with all other files.
            this._virtualProject.host.addRoot(resource.toString());
            return this._virtualProject;
        };
        ProjectService.prototype.projects = function () {
            var result = [];
            for (var key in this._projects) {
                result.push(this._projects[key]);
            }
            return result;
        };
        ProjectService.prototype.lookUpScript = function (fileName) {
            var script = this._scripts[fileName];
            return script;
        };
        Object.defineProperty(ProjectService.prototype, "version", {
            get: function () {
                return Object.keys(this._scripts).join('');
            },
            enumerable: true,
            configurable: true
        });
        ProjectService.prototype.scriptsNames = function () {
            return Object.keys(this._scripts);
        };
        ProjectService.prototype._forEachProject = function (callback) {
            for (var key in this._projects) {
                callback(this._projects[key]);
            }
            for (var key in this._rewrittenProjects) {
                callback(this._rewrittenProjects[key]);
            }
            callback(this._virtualProject);
        };
        ProjectService.prototype.getMissingScriptNamesSinceLastTime = function () {
            var allMissing = Object.create(null);
            this._forEachProject(function (project) {
                var missing = project.host.getMissingFileNamesSinceLastTime();
                if (missing) {
                    for (var _i = 0; _i < missing.length; _i++) {
                        var fileName = missing[_i];
                        allMissing[fileName] = 0;
                    }
                }
            });
            return Object.keys(allMissing);
        };
        ProjectService.prototype.getTotalLength = function () {
            var total = 0;
            for (var k in this._scripts) {
                total += this._scripts[k].snap().getLength();
            }
            return total;
        };
        // ---- sync'ing of files and projects -------------------------------------
        ProjectService.prototype._removeRewrittenProject = function (projectResource) {
            for (var key in this._rewrittenProjects) {
                if (this._rewrittenProjects[key].resource.toString() === projectResource.toString()) {
                    delete this._rewrittenProjects[key];
                }
            }
        };
        ProjectService.prototype._syncProject = function (kind, resource, files, options) {
            // console.log('SYNC project ', typescript.ChangeKind[kind], resource.fsPath, files.map(f => f.fsPath), options);
            var projectFolderName = paths.dirname(resource.fsPath);
            if (kind === typescript.ChangeKind.Added || kind === typescript.ChangeKind.Changed) {
                // replace/update the project when it was added/changed
                // *remove any rewritten project that relates to this project
                // *remove project files from virtual project
                if (kind === typescript.ChangeKind.Changed) {
                    this._projects[projectFolderName].host.setCompilationSettings(options);
                    this._projects[projectFolderName].host.setRoots(files.map(function (f) { return f.toString(); }));
                }
                else {
                    this._projects[projectFolderName] = new Project(this, resource, files, options);
                }
                this._removeRewrittenProject(resource);
                if (resource.toString() !== this._virtualProject.resource.toString()) {
                    for (var _i = 0; _i < files.length; _i++) {
                        resource = files[_i];
                        this._virtualProject.host.removeRoot(resource.toString());
                    }
                }
            }
            else if (kind === typescript.ChangeKind.Removed) {
                // remove project with this key and *all* rewritten projects that
                // relate to this project - via resource
                var project = this._projects[projectFolderName];
                if (project) {
                    delete this._projects[projectFolderName];
                    this._removeRewrittenProject(project.resource);
                }
            }
        };
        ProjectService.prototype._syncFile = function (kind, resource, content) {
            var fileName = resource.toString();
            if (kind === typescript.ChangeKind.Removed) {
                delete this._scripts[fileName];
            }
            else if (kind === typescript.ChangeKind.Changed) {
                var script = this._scripts[fileName] || new Script();
                this._scripts[fileName] = script.update(content);
            }
            else if (kind === typescript.ChangeKind.Added) {
                this._scripts[fileName] = new Script().update(content);
                this._forEachProject(function (project) { return project.host.addRootIfMissing(fileName); });
            }
        };
        return ProjectService;
    })();
    exports.ProjectService = ProjectService;
    // ---- rewriting
    var RewrittenProject = (function () {
        function RewrittenProject(projectService, project, rewriter) {
            var host = new RewritingLanguageServiceHost(project.host.getScriptFileNames(), projectService.lookUpScript.bind(projectService), project.languageService.getSourceFile.bind(project.languageService), rewriter);
            this.resource = project.resource;
            this.translations = host;
            this.host = host;
            this.host.setCompilationSettings(project.host.getCompilationSettings());
            this.languageService = ts.createLanguageService(this.host);
        }
        return RewrittenProject;
    })();
    var Translator = (function () {
        function Translator(textOperationResult, modified, original) {
            this._textOperationResult = textOperationResult;
            this._lineMapModified = LineMap.create(modified.getText(0, modified.getLength()));
            this._lineMapOriginal = LineMap.create(original.getText(0, original.getLength()));
        }
        Translator.prototype.to = function (thing) {
            if (position_1.Position.isIPosition(thing)) {
                return this._doTranslate(this._textOperationResult.doEdits, this._lineMapOriginal, this._lineMapModified, thing, textEdits.TranslationBehaviour.None);
            }
            else {
                var range = thing, startPosition = this._doTranslate(this._textOperationResult.doEdits, this._lineMapOriginal, this._lineMapModified, { lineNumber: range.startLineNumber, column: range.startColumn }, textEdits.TranslationBehaviour.None), endPosition = this._doTranslate(this._textOperationResult.doEdits, this._lineMapOriginal, this._lineMapModified, { lineNumber: range.endLineNumber, column: range.endColumn }, textEdits.TranslationBehaviour.None);
                return {
                    startLineNumber: startPosition.lineNumber,
                    startColumn: startPosition.column,
                    endLineNumber: endPosition.lineNumber,
                    endColumn: endPosition.column
                };
            }
        };
        Translator.prototype.from = function (thing) {
            if (position_1.Position.isIPosition(thing)) {
                return this._doTranslate(this._textOperationResult.undoEdits, this._lineMapModified, this._lineMapOriginal, thing, textEdits.TranslationBehaviour.None);
            }
            else {
                var range = thing, startPosition = this._doTranslate(this._textOperationResult.undoEdits, this._lineMapModified, this._lineMapOriginal, { lineNumber: range.startLineNumber, column: range.startColumn }, textEdits.TranslationBehaviour.StickLeft), endPosition = this._doTranslate(this._textOperationResult.undoEdits, this._lineMapModified, this._lineMapOriginal, { lineNumber: range.endLineNumber, column: range.endColumn }, textEdits.TranslationBehaviour.StickRight);
                return {
                    startLineNumber: startPosition.lineNumber,
                    startColumn: startPosition.column,
                    endLineNumber: endPosition.lineNumber,
                    endColumn: endPosition.column
                };
            }
        };
        Translator.prototype._doTranslate = function (_edits, from, to, position, behaviour) {
            var offset = from.getOffset(position), newOffset = textEdits.translate(_edits, offset, behaviour);
            return to.getPositionFromOffset(newOffset);
        };
        Translator.prototype.info = function (range) {
            var minChar = this._lineMapModified.getOffset(position_1.Position.startPosition(range)), limChar = this._lineMapModified.getOffset(position_1.Position.endPosition(range)), span;
            span = new textEdits.TextSpan(minChar, limChar - minChar);
            // origin
            var origin;
            // disabled because of https://monacotools.visualstudio.com/DefaultCollection/Monaco/_workitems/edit/17733
            // for (var i = 0; i < this._textOperationResult.derived.length; i += 2) {
            // 	if (this._textOperationResult.derived[i].contains(span)) {
            // 		var originSpan = this._textOperationResult.derived[i + 1];
            // 		origin = this._lineMapOriginal.getRangeFromSpan({ start: originSpan.offset, length: originSpan.length });
            // 		break;
            // 	}
            // }
            // inserted?
            var edits = this._textOperationResult.undoEdits, isInserted = false, isOverlapping = false;
            for (var i = 0, len = edits.length; i < len && !isInserted && !isOverlapping; i++) {
                if (edits[i].contains(span)) {
                    isInserted = true;
                }
                if (edits[i].overlaps(span)) {
                    isOverlapping = true;
                }
            }
            return {
                origin: origin,
                isInserted: isInserted,
                isOverlapping: isOverlapping
            };
        };
        return Translator;
    })();
    var RewritingLanguageServiceHost = (function (_super) {
        __extends(RewritingLanguageServiceHost, _super);
        function RewritingLanguageServiceHost(roots, scripts, sourceFiles, rewriter) {
            _super.call(this, roots, scripts);
            this._rewrittenSnapshots = Object.create(null);
            this._sourceFileLookUp = sourceFiles;
            this._syntaxRewriter = rewriter;
        }
        RewritingLanguageServiceHost.prototype.getTranslator = function (resource) {
            var fileName = resource.toString();
            var cached = this._getOrCreateRewrittenSnapshot(fileName);
            return cached && cached.translator || rewriting.IdentityTranslator.Instance;
        };
        RewritingLanguageServiceHost.prototype.getOriginal = function (resource) {
            return _super.prototype.getScriptSnapshot.call(this, resource.toString());
        };
        RewritingLanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
            var cached = this._getOrCreateRewrittenSnapshot(fileName);
            return cached && cached.script.snap() || _super.prototype.getScriptSnapshot.call(this, fileName);
        };
        RewritingLanguageServiceHost.prototype.getScriptLineMap = function (fileName) {
            var cached = this._getOrCreateRewrittenSnapshot(fileName);
            return cached && cached.script.lineMap() || _super.prototype.getScriptLineMap.call(this, fileName);
        };
        RewritingLanguageServiceHost.prototype._getOrCreateRewrittenSnapshot = function (fileName) {
            if (paths.extname(fileName) === '.ts') {
                return null;
            }
            if (!_super.prototype.getScriptSnapshot.call(this, fileName)) {
                return null;
            }
            var versionId = this.getScriptVersion(fileName), cached = this._rewrittenSnapshots[fileName];
            if (!cached || cached.versionId !== versionId) {
                var snapshot = _super.prototype.getScriptSnapshot.call(this, fileName), result = rewriting.translate(this._syntaxRewriter, snapshot, this._sourceFileLookUp.bind(this, fileName)), script = new Script().update(result.value);
                cached = {
                    script: script,
                    versionId: this.getScriptVersion(fileName),
                    translator: new Translator(result, script.snap(), snapshot)
                };
                this._rewrittenSnapshots[fileName] = cached;
            }
            return cached;
        };
        return RewritingLanguageServiceHost;
    })(LanguageServiceHost);
});
//# sourceMappingURL=projectService.js.map