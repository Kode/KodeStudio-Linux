/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/platform/platform', 'vs/base/common/uri'], function (require, exports, winjs, platform, uri_1) {
    (function (ChangeKind) {
        ChangeKind[ChangeKind["Changed"] = 0] = "Changed";
        ChangeKind[ChangeKind["Added"] = 1] = "Added";
        ChangeKind[ChangeKind["Removed"] = 2] = "Removed";
    })(exports.ChangeKind || (exports.ChangeKind = {}));
    var ChangeKind = exports.ChangeKind;
    exports.defaultLib = uri_1.default.create('ts', 'defaultlib', '/vs/text!vs/languages/typescript/common/lib/lib.d.ts');
    exports.defaultLibES6 = uri_1.default.create('ts', 'defaultlib', '/vs/text!vs/languages/typescript/common/lib/lib.es6.d.ts');
    function isDefaultLib(uri) {
        if (typeof uri === 'string') {
            return uri.indexOf('ts://defaultlib') === 0;
        }
        else {
            return uri.scheme === 'ts' && uri.authority === 'defaultlib';
        }
    }
    exports.isDefaultLib = isDefaultLib;
    exports.virtualProjectResource = uri_1.default.create('ts', 'projects', '/virtual/1');
    var DefaultProjectResolver = (function () {
        function DefaultProjectResolver() {
            this._needsProjectUpdate = false;
            this._fileChanges = [];
            this._projectChange = {
                kind: ChangeKind.Changed,
                resource: exports.virtualProjectResource,
                files: [],
                options: undefined
            };
        }
        DefaultProjectResolver.prototype.setConsumer = function (consumer) {
            this._consumer = consumer;
        };
        DefaultProjectResolver.prototype.resolveProjects = function () {
            var promises = [];
            if (this._fileChanges.length) {
                promises.push(this._consumer.acceptFileChanges(this._fileChanges.slice(0)));
                this._fileChanges.length = 0;
            }
            if (this._needsProjectUpdate) {
                promises.push(this._consumer.acceptProjectChanges([this._projectChange]));
                this._needsProjectUpdate = false;
            }
            return winjs.Promise.join(promises);
        };
        DefaultProjectResolver.prototype.resolveFiles = function () {
            return undefined;
        };
        DefaultProjectResolver.prototype.addExtraLib = function (content, filePath) {
            var resource = filePath
                ? uri_1.default.file(filePath)
                : uri_1.default.create('extralib', undefined, Date.now().toString());
            this._needsProjectUpdate = true;
            this._projectChange.files.push(resource);
            this._fileChanges.push({ kind: ChangeKind.Added, resource: resource, content: content });
        };
        DefaultProjectResolver.prototype.setCompilerOptions = function (options) {
            this._needsProjectUpdate = true;
            this._projectChange.options = options;
        };
        return DefaultProjectResolver;
    })();
    exports.DefaultProjectResolver = DefaultProjectResolver;
    var Defaults;
    (function (Defaults) {
        Defaults.ProjectResolver = new DefaultProjectResolver();
        function addExtraLib(content, filePath) {
            Defaults.ProjectResolver.addExtraLib(content, filePath);
        }
        Defaults.addExtraLib = addExtraLib;
        function setCompilerOptions(options) {
            Defaults.ProjectResolver.setCompilerOptions(options);
        }
        Defaults.setCompilerOptions = setCompilerOptions;
    })(Defaults = exports.Defaults || (exports.Defaults = {}));
    // ----- TypeScript extension ---------------------------------------------------------------
    var Extensions;
    (function (Extensions) {
        Extensions.Identifier = 'typescript';
        platform.Registry.add(Extensions.Identifier, Extensions);
        var projectResolver;
        function setProjectResolver(desc) {
            projectResolver = desc;
        }
        Extensions.setProjectResolver = setProjectResolver;
        function getProjectResolver() {
            return projectResolver;
        }
        Extensions.getProjectResolver = getProjectResolver;
    })(Extensions = exports.Extensions || (exports.Extensions = {}));
});
//# sourceMappingURL=typescript.js.map