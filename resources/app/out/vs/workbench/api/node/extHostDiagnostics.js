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
define(["require", "exports", 'vs/platform/thread/common/thread', 'vs/platform/markers/common/markers', 'vs/base/common/uri', 'vs/base/common/severity'], function (require, exports, thread_1, markers_1, uri_1, severity_1) {
    var DiagnosticCollection = (function () {
        function DiagnosticCollection(name, proxy) {
            this._name = name;
            this._proxy = proxy;
        }
        DiagnosticCollection.prototype.dispose = function () {
            var _this = this;
            if (!this._isDisposed) {
                this._proxy._changeAll(this.name, undefined).then(function () {
                    _this._proxy = undefined;
                    _this._isDisposed = true;
                });
            }
        };
        Object.defineProperty(DiagnosticCollection.prototype, "name", {
            get: function () {
                this._checkDisposed();
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        DiagnosticCollection.prototype.set = function (first, diagnostics) {
            this._checkDisposed();
            if (first instanceof uri_1.default) {
                // change markers of resource only (max 500)
                var data;
                if (diagnostics) {
                    data = [];
                    var len = diagnostics.length;
                    if (len > DiagnosticCollection._maxDiagnosticsPerFile) {
                        console.warn('diagnostics for %s will be capped to %d (actually is %d)', first.toString(), DiagnosticCollection._maxDiagnosticsPerFile, len);
                        len = DiagnosticCollection._maxDiagnosticsPerFile;
                    }
                    for (var i = 0; i < len; i++) {
                        data.push(DiagnosticCollection._toMarkerData(diagnostics[i]));
                    }
                }
                // set or reset for this resource
                return this._proxy._changeOne(this.name, first, data);
            }
            else {
                // change all marker of owner
                var entries = first;
                var data;
                if (entries) {
                    var total = 0;
                    data = [];
                    for (var _i = 0; _i < entries.length; _i++) {
                        var entry = entries[_i];
                        var uri = entry[0], diagnostics_1 = entry[1];
                        if (diagnostics_1) {
                            var len = diagnostics_1.length;
                            if (len > DiagnosticCollection._maxDiagnosticsPerFile) {
                                console.warn('diagnostics for %s will be capped to %d (actually is %d)', uri.toString(), DiagnosticCollection._maxDiagnosticsPerFile, len);
                                len = DiagnosticCollection._maxDiagnosticsPerFile;
                            }
                            for (var i = 0; i < len; i++) {
                                data.push({
                                    resource: uri,
                                    marker: DiagnosticCollection._toMarkerData(diagnostics_1[i])
                                });
                            }
                            total += len;
                            if (total > 10 * DiagnosticCollection._maxDiagnosticsPerFile) {
                                console.warn('too many diagnostics will cap to %d', 10 * DiagnosticCollection._maxDiagnosticsPerFile);
                                break;
                            }
                        }
                    }
                }
                // set or reset all
                this._proxy._changeAll(this.name, data);
            }
        };
        DiagnosticCollection.prototype.delete = function (uri) {
            return this.set(uri, undefined);
        };
        DiagnosticCollection.prototype.clear = function () {
            return this.set(undefined);
        };
        DiagnosticCollection.prototype._checkDisposed = function () {
            if (this._isDisposed) {
                throw new Error('illegal state - object is disposed');
            }
        };
        DiagnosticCollection._toMarkerData = function (diagnostic) {
            var range = diagnostic.range;
            return {
                startLineNumber: range.start.line + 1,
                startColumn: range.start.character + 1,
                endLineNumber: range.end.line + 1,
                endColumn: range.end.character + 1,
                message: diagnostic.message,
                source: diagnostic.source,
                severity: DiagnosticCollection._convertDiagnosticsSeverity(diagnostic.severity),
                code: String(diagnostic.code)
            };
        };
        DiagnosticCollection._convertDiagnosticsSeverity = function (severity) {
            switch (severity) {
                case 0: return severity_1.default.Error;
                case 1: return severity_1.default.Warning;
                case 2: return severity_1.default.Info;
                case 3: return severity_1.default.Ignore;
                default: return severity_1.default.Error;
            }
        };
        DiagnosticCollection._maxDiagnosticsPerFile = 250;
        return DiagnosticCollection;
    })();
    var ExtHostDiagnostics = (function () {
        function ExtHostDiagnostics(threadService) {
            this._proxy = threadService.getRemotable(MainThreadDiagnostics);
        }
        ExtHostDiagnostics.prototype.createDiagnosticCollection = function (name) {
            if (!name) {
                name = '_generated_diagnostic_collection_name_#' + ExtHostDiagnostics._idPool++;
            }
            return new DiagnosticCollection(name, this._proxy);
        };
        ExtHostDiagnostics._idPool = 0;
        return ExtHostDiagnostics;
    })();
    exports.ExtHostDiagnostics = ExtHostDiagnostics;
    var MainThreadDiagnostics = (function () {
        function MainThreadDiagnostics(markerService) {
            this._markerService = markerService;
        }
        MainThreadDiagnostics.prototype._changeOne = function (owner, resource, markers) {
            this._markerService.changeOne(owner, resource, markers);
            return undefined;
        };
        MainThreadDiagnostics.prototype._changeAll = function (owner, data) {
            this._markerService.changeAll(owner, data);
            return undefined;
        };
        MainThreadDiagnostics = __decorate([
            thread_1.Remotable.MainContext('MainThreadDiagnostics'),
            __param(0, markers_1.IMarkerService)
        ], MainThreadDiagnostics);
        return MainThreadDiagnostics;
    })();
    exports.MainThreadDiagnostics = MainThreadDiagnostics;
});
//# sourceMappingURL=extHostDiagnostics.js.map