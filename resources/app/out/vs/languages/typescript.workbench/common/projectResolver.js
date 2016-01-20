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
define(["require", "exports", 'vs/base/common/glob', 'vs/nls', 'vs/base/common/objects', 'vs/languages/typescript/common/typescript', 'vs/base/common/lifecycle', 'vs/base/common/errors', 'vs/base/common/collections', 'vs/base/common/async', 'vs/base/common/winjs.base', 'vs/base/common/severity', 'vs/base/common/uri', 'vs/base/common/paths', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/editor/common/services/modelService', 'vs/platform/event/common/event', 'vs/platform/files/common/files', 'vs/platform/markers/common/markers', 'vs/platform/message/common/message', 'vs/platform/search/common/search', 'vs/platform/telemetry/common/telemetry', 'vs/platform/workspace/common/workspace'], function (require, exports, glob, nls, objects, typescript, lifecycle, errors, collections, async, winjs, severity_1, uri_1, paths, ts, modelService_1, event_1, Files, markers_1, message_1, search_1, telemetry_1, workspace_1) {
    var defaultExcludeSegments = [
        '/.git/',
        '/node_modules/',
        '/bower_components/',
        '/jspm_packages/',
        '/tmp/',
        '/temp/',
    ];
    var ProjectFileEventListener = (function () {
        function ProjectFileEventListener(_baseDir, files, exclude) {
            this._baseDir = _baseDir;
            this._baseDir = paths.normalize(this._baseDir, true);
            if (Array.isArray(files)) {
                this._includes = [];
                for (var _i = 0; _i < files.length; _i++) {
                    var relativePath = files[_i];
                    this._includes.push(paths.normalize(paths.join(this._baseDir, relativePath), true));
                }
            }
            if (Array.isArray(exclude)) {
                this._excludes = [];
                for (var _a = 0; _a < exclude.length; _a++) {
                    var relativePath = exclude[_a];
                    this._excludes.push(paths.normalize(paths.join(this._baseDir, relativePath), true));
                }
            }
        }
        ProjectFileEventListener.prototype.handleChange = function (resource) {
            // hard-coded list of folders to ignore
            for (var _i = 0, _a = ProjectFileEventListener._ignores; _i < _a.length; _i++) {
                var ignore = _a[_i];
                if (resource.fsPath.indexOf(ignore) !== -1) {
                    return false;
                }
            }
            // must be in the project dir
            if (this._baseDir && resource.fsPath.indexOf(this._baseDir) !== 0) {
                return false;
            }
            // the resource is not on the include list
            if (this._includes && this._includes.indexOf(resource.fsPath) < 0) {
                return false;
            }
            // the resource matches an item from the exclude list
            if (this._excludes && this._excludes
                .some(function (exclude) { return resource.fsPath.indexOf(exclude) === 0; })) {
                return false;
            }
            return true;
        };
        ProjectFileEventListener._ignores = defaultExcludeSegments.map(function (s) { return paths.normalize(s, true); });
        return ProjectFileEventListener;
    })();
    var VirtualProjectFileEventListener = (function (_super) {
        __extends(VirtualProjectFileEventListener, _super);
        function VirtualProjectFileEventListener() {
            _super.apply(this, arguments);
        }
        VirtualProjectFileEventListener.prototype.handleChange = function (resource) {
            return /\.d\.ts$/.test(resource.fsPath) && _super.prototype.handleChange.call(this, resource);
        };
        return VirtualProjectFileEventListener;
    })(ProjectFileEventListener);
    var ProjectResolver = (function () {
        function ProjectResolver(configuration, consumer, fileService, searchService, eventService, markerService, messageService, modelService, telemetryService, contextService) {
            this._fileChangeEvents = [];
            this._projectFileEventListener = Object.create(null);
            this._projectPromises = Object.create(null);
            this._pendingFiles = Object.create(null);
            this._fileService = fileService;
            this._searchService = searchService;
            this._eventService = eventService;
            this._markerService = markerService;
            this._messageService = messageService;
            this._modelService = modelService;
            this._telemetryService = telemetryService;
            this._workspace = contextService.getWorkspace() && contextService.getWorkspace().resource;
            this._consumer = consumer;
            this._configuration = configuration;
            this._fileChangesHandler = new async.RunOnceScheduler(this._processFileChangesEvents.bind(this), 1000);
            this._unbindListener = this._eventService.addListener(Files.EventType.FILE_CHANGES, this._onFileChangesEvent.bind(this));
        }
        ProjectResolver.prototype.dispose = function () {
            lifecycle.cAll(this._unbindListener);
        };
        ProjectResolver.prototype.setConsumer = function (consumer) {
            this._consumer = consumer;
        };
        ProjectResolver.prototype.resolveProjects = function () {
            var _this = this;
            if (this._workspace) {
                var result = this._resolve;
                if (!result) {
                    result = this._resolve = this._doResolve();
                    async.always(this._resolve, function () { return _this._resolve = null; });
                }
                return new async.ShallowCancelThenPromise(result);
            }
        };
        ProjectResolver.prototype.resolveFiles = function (resources) {
            var _this = this;
            // fetch only file-resources from disk
            resources = resources.filter(function (resource) { return resource.scheme === 'file'; });
            if (resources.length) {
                var handle = this._messageService.setStatusMessage(nls.localize('resolve.files.N', "Loading additional files..."), undefined, 250);
                var result = this._fileService.resolveContents(resources).then(function (contents) {
                    var changes = contents.map(function (c) {
                        return {
                            kind: typescript.ChangeKind.Added,
                            content: c.value,
                            resource: c.resource
                        };
                    });
                    return _this._consumer.acceptFileChanges(changes)
                        .then(undefined, function (err) { return _this._messageService.show(severity_1.default.Warning, err); });
                });
                return async.always(result, function () { return handle.dispose(); });
            }
        };
        ProjectResolver.prototype._doResolve = function () {
            var _this = this;
            var $perf = {
                start: Date.now(),
                d: 0,
                projects: 0,
                files: 0
            };
            var p = this.projectDiscovery().then(function (_) {
                // [read] all tsconfig.json files
                var promises = [];
                for (var key in _this._projectPromises) {
                    promises.push(_this._projectPromises[key]);
                    delete _this._projectPromises[key];
                }
                return winjs.TPromise.join(promises);
            }).then(function (projectChanges) {
                // [send] all project changes to worker
                $perf.projects = projectChanges.length;
                if (projectChanges.length) {
                    return _this._consumer.acceptProjectChanges(projectChanges).then(function (projectsIndex) {
                        // TODO@Alex AllThreads returns falsy result
                        _this._projectsIndex = projectsIndex[0];
                    });
                }
            }).then(function (_) {
                // [read] all project source files, persist change kind
                var toFetch = [], changes = [], pendingFiles = objects.clone(_this._pendingFiles);
                for (var key in _this._pendingFiles) {
                    var kind = _this._pendingFiles[key].kind;
                    var resource = _this._pendingFiles[key].resource;
                    if (_this._pendingFiles[key].kind === typescript.ChangeKind.Removed) {
                        changes.push({ kind: kind, resource: resource, content: undefined });
                    }
                    else {
                        // changed or added
                        toFetch.push(resource);
                        $perf.files += 1;
                    }
                    delete _this._pendingFiles[key];
                }
                if (toFetch.length) {
                    return _this._fileService.resolveContents(toFetch).then(function (contents) {
                        contents.forEach(function (fileContent) {
                            changes.push({
                                resource: fileContent.resource,
                                content: fileContent.value,
                                kind: pendingFiles[fileContent.resource.toString()].kind
                            });
                            delete pendingFiles[fileContent.resource.toString()];
                        });
                        // if (toFetch.length !== contents.length) {
                        // 	console.warn('files that are MISSING: ', Object.keys(pendingFiles));
                        // }
                        // [send] all project source files
                        return _this._consumer.acceptFileChanges(changes)
                            .then(undefined, function (err) { return _this._messageService.show(severity_1.default.Warning, err); });
                    });
                }
                else if (changes.length) {
                    // [send] all project source files
                    return _this._consumer.acceptFileChanges(changes)
                        .then(undefined, function (err) { return _this._messageService.show(severity_1.default.Warning, err); });
                }
            }).then(function (_) {
                // perf numbers
                $perf.d = Date.now() - $perf.start;
                // console.log('[ts] resolve done', $perf);
            });
            return p;
        };
        ProjectResolver.prototype.projectDiscovery = function () {
            var _this = this;
            if (!this._projectDiscovery) {
                this._projectDiscovery = this._searchResources(this._configuration.projects).then(function (result) {
                    _this._resolveProject(typescript.virtualProjectResource, typescript.ChangeKind.Added);
                    for (var _i = 0, _a = result.resources; _i < _a.length; _i++) {
                        var resource = _a[_i];
                        _this._resolveProject(resource, typescript.ChangeKind.Added);
                    }
                });
                // TODO@Joh count how often this fails and stop trying
                this._projectDiscovery.done(undefined, function (err) {
                    _this._projectDiscovery = null;
                    console.error(err);
                });
            }
            return this._projectDiscovery;
        };
        ProjectResolver.prototype._searchResources = function (globPattern, maxResults, root, excludes) {
            if (maxResults === void 0) { maxResults = 1500; }
            if (root === void 0) { root = this._workspace; }
            var includePattern = {};
            includePattern[globPattern] = true;
            var excludePattern = Object.create(null);
            excludePattern[ProjectResolver._defaultExcludePattern] = true;
            // add custom exclude patterns
            if (Array.isArray(excludes)) {
                for (var _i = 0; _i < excludes.length; _i++) {
                    var exclude = excludes[_i];
                    exclude = exclude.replace(/^[\\\/]/, '').replace(/[\\\/]$/, '');
                    excludePattern[(exclude + "/**")] = true;
                }
            }
            return this._searchService.search({
                folderResources: [root],
                type: search_1.QueryType.File,
                maxResults: maxResults,
                includePattern: includePattern,
                excludePattern: excludePattern,
            }).then(function (complete) {
                return {
                    resources: complete.results.map(function (r) { return r.resource; }),
                    limitReached: complete.limitHit
                };
            });
        };
        ProjectResolver.prototype._resolveProject = function (resource, kind) {
            var dirname = paths.dirname(resource.fsPath);
            var p = this._doResolveProject(resource, kind);
            this._projectPromises[dirname] = this._projectPromises[dirname] && this._projectPromises[dirname].then(function (_) { return p; }, function (_) { return p; }) || p;
            p.done(undefined, function (err) {
                if (!errors.isPromiseCanceledError(err)) {
                    console.error(resource.toString(), kind, err);
                }
            });
        };
        ProjectResolver.prototype._doResolveProject = function (resource, kind) {
            return resource.toString() === typescript.virtualProjectResource.toString()
                ? this._doResolveVirtualProject(kind)
                : this._doResolveProjectFile(resource, kind);
        };
        ProjectResolver.prototype._doResolveProjectFile = function (resource, kind) {
            var _this = this;
            // remove markers
            this._markerService.remove('ts.projectResolver', [resource]);
            // removed project
            if (kind === typescript.ChangeKind.Removed) {
                delete this._projectFileEventListener[resource.toString()];
                return winjs.TPromise.as({ kind: kind, resource: resource, files: undefined, options: undefined });
            }
            // added or changed project
            var data = {
                kind: kind,
                resource: resource,
                files: [],
                options: ts.getDefaultCompilerOptions()
            };
            var fileLimitReached = false;
            return this._fileService.resolveContent(resource).then(function (content) {
                var parsed = ts.parseConfigFileText(resource.fsPath, content.value), basePath = paths.dirname(resource.fsPath);
                if (parsed.error) {
                    _this._markerService.changeOne('ts.projectResolver', resource, [{
                            message: parsed.error.messageText.toString(),
                            code: parsed.error.code.toString(),
                            severity: severity_1.default.Error,
                            startLineNumber: 1,
                            startColumn: 1,
                            endLineNumber: 1,
                            endColumn: 1
                        }]);
                    return winjs.TPromise.wrapError(errors.canceled());
                }
                // compiler options
                data.options = ts.parseConfigFile(parsed.config, { readDirectory: function () { return []; } }, basePath).options;
                // add/replace project event listener
                _this._projectFileEventListener[resource.toString()] = new ProjectFileEventListener(basePath, parsed.config['files'], parsed.config['exclude']);
                // files
                if (Array.isArray(parsed.config['files'])) {
                    var files = parsed.config['files']
                        .map(function (path) { return paths.join(basePath, path); })
                        .map(function (path) { return uri_1.default.file(path); });
                    data.files = files;
                    if (data.files.length > _this._configuration.maxFilesPerProject) {
                        data.files.length = _this._configuration.maxFilesPerProject;
                        fileLimitReached = true;
                    }
                }
                else {
                    // glob
                    // we also get into this when the files property isn't formulated
                    // properly. This isn't über-correct but nice to the user
                    return _this._searchResources(_this._configuration.files, _this._configuration.maxFilesPerProject, uri_1.default.file(basePath), parsed.config['exclude']).then(function (result) {
                        fileLimitReached = result.limitReached;
                        data.files = result.resources;
                    });
                }
            }).then(function (_) {
                if (kind === typescript.ChangeKind.Added) {
                    // add all files of this project to the fetch list
                    data.files.forEach(function (resource) { return _this._pendingFiles[resource.toString()] = { resource: resource, kind: kind }; });
                    // send telemetry info about compiler options and number of files
                    _this._telemetryService.publicLog('js.project', {
                        compilerOptions: data.options,
                        fileCount: data.files.length
                    });
                }
                if (fileLimitReached) {
                    // send another telemetry event when there a too many files
                    _this._telemetryService.publicLog('js.project.fileLimitReached', { maxFilesPerProject: _this._configuration.maxFilesPerProject });
                }
                return data;
            });
        };
        ProjectResolver.prototype._doResolveVirtualProject = function (kind) {
            // when starting we optimistically configure the virtual
            // project with the first 50 d.ts files we find in the
            // workspace
            var _this = this;
            this._projectFileEventListener[typescript.virtualProjectResource.toString()] =
                new VirtualProjectFileEventListener(undefined, undefined, undefined);
            var excludePattern = Object.create(null);
            excludePattern[ProjectResolver._defaultExcludePatternForVirtualProject] = true;
            return this._searchService.search({
                folderResources: [this._workspace],
                type: search_1.QueryType.File,
                maxResults: 50,
                includePattern: { '**/*.d.ts': true },
                excludePattern: excludePattern
            }).then(function (result) {
                var files = [];
                for (var _i = 0, _a = result.results; _i < _a.length; _i++) {
                    var match = _a[_i];
                    files.push(match.resource);
                    _this._pendingFiles[match.resource.toString()] = { resource: match.resource, kind: kind };
                }
                return {
                    files: files,
                    resource: typescript.virtualProjectResource,
                    kind: typescript.ChangeKind.Changed,
                    options: undefined
                };
            });
        };
        ProjectResolver.prototype._onFileChangesEvent = function (e) {
            (_a = this._fileChangeEvents).push.apply(_a, e.changes);
            this._fileChangesHandler.schedule();
            var _a;
        };
        ProjectResolver.prototype._processFileChangesEvents = function () {
            var _this = this;
            var projectEvents = Object.create(null);
            var changes = this._fileChangeEvents.slice(0);
            this._fileChangeEvents.length = 0;
            var isAffectedByChanges = false;
            changes.forEach(function (change) {
                var kind;
                if (glob2.match(_this._configuration.projects, change.resource.fsPath)) {
                    // update projects
                    kind = ProjectResolver._asChangeKind(change.type);
                    collections.lookupOrInsert(projectEvents, change.resource.toString(), []).push(kind);
                    isAffectedByChanges = true;
                }
                else if (glob2.match(_this._configuration.files, change.resource.fsPath)) {
                    kind = ProjectResolver._asChangeKind(change.type);
                    if (kind === typescript.ChangeKind.Changed && _this._modelService.getModel(change.resource)) {
                        // we have already seen this change
                        return;
                    }
                    collections.forEach(_this._projectFileEventListener, function (entry) {
                        if (!entry.value.handleChange(change.resource)) {
                            // this listener is not interested in this change
                            // so we can return early
                            return;
                        }
                        _this._pendingFiles[change.resource.toString()] = { kind: kind, resource: change.resource };
                        isAffectedByChanges = true;
                        // in case this file as added or removed we need to tell
                        // project it has changed
                        if (kind === typescript.ChangeKind.Added || kind === typescript.ChangeKind.Removed) {
                            collections.lookupOrInsert(projectEvents, entry.key, []).push(typescript.ChangeKind.Changed);
                        }
                    });
                }
            });
            // trigger project resolution for those that were collected earlier
            for (var project in projectEvents) {
                var value = projectEvents[project];
                var lastKind = void 0;
                for (var _i = 0; _i < value.length; _i++) {
                    var kind = value[_i];
                    if (kind !== lastKind) {
                        lastKind = kind;
                        this._resolveProject(uri_1.default.parse(project), kind);
                    }
                }
            }
            if (isAffectedByChanges) {
                this.resolveProjects();
            }
        };
        ProjectResolver._lookUpProjects = function (resource, index) {
            var dirnames = paths.dirnames(resource.fsPath), element = dirnames.next(), result;
            while (!element.done) {
                var project = index[element.value];
                if (project) {
                    if (!result) {
                        result = [];
                    }
                    result.push(project);
                }
                element = dirnames.next();
            }
            return result;
        };
        ProjectResolver._asChangeKind = function (fileChangeType) {
            switch (fileChangeType) {
                case Files.FileChangeType.UPDATED: return typescript.ChangeKind.Changed;
                case Files.FileChangeType.ADDED: return typescript.ChangeKind.Added;
                case Files.FileChangeType.DELETED: return typescript.ChangeKind.Removed;
            }
            throw new Error('unknown change type');
        };
        ProjectResolver._defaultExcludePattern = "{" + defaultExcludeSegments.map(function (s) { return ("**" + s + "**"); }).join(',') + "}";
        ProjectResolver._defaultExcludePatternForVirtualProject = "{**/lib*.d.ts," + defaultExcludeSegments.map(function (s) { return ("**" + s + "**"); }).join(',') + "}";
        ProjectResolver = __decorate([
            __param(2, Files.IFileService),
            __param(3, search_1.ISearchService),
            __param(4, event_1.IEventService),
            __param(5, markers_1.IMarkerService),
            __param(6, message_1.IMessageService),
            __param(7, modelService_1.IModelService),
            __param(8, telemetry_1.ITelemetryService),
            __param(9, workspace_1.IWorkspaceContextService)
        ], ProjectResolver);
        return ProjectResolver;
    })();
    var glob2;
    (function (glob2) {
        var prefix1 = '**/*.';
        function match(pattern, path) {
            if (pattern[0] === '{' && pattern[pattern.length - 1] === '}') {
                var parts = pattern.substr(1, pattern.length - 2).split(',');
                return parts.some(function (part) { return matchOne(part, path); });
            }
            else {
                return matchOne(pattern, path);
            }
        }
        glob2.match = match;
        function matchOne(pattern, path) {
            var offset = -1;
            if (pattern.indexOf(prefix1) === 0) {
                offset = prefix1.length;
            }
            if (offset === -1) {
                return glob.match(pattern, path);
            }
            var suffix = pattern.substring(offset);
            if (suffix.match(/[.\\\/*]/)) {
                return glob.match(pattern, path);
            }
            // endWith check
            offset = path.lastIndexOf(suffix);
            if (offset === -1) {
                return false;
            }
            else {
                return offset + suffix.length === path.length;
            }
        }
    })(glob2 || (glob2 = {}));
    return ProjectResolver;
});
//# sourceMappingURL=projectResolver.js.map