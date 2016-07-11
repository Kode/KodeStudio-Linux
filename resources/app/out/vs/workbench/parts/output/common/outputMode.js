/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["vs/workbench/parts/output/common/outputMode","require","exports","vs/platform/instantiation/common/instantiation","vs/editor/common/modes","vs/editor/common/modes/abstractMode","vs/base/common/async","vs/editor/common/services/compatWorkerService","vs/platform/workspace/common/workspace"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[0], __M([1,2,3,4,5,6,7,8]), function (require, exports, instantiation_1, modes, abstractMode_1, async_1, compatWorkerService_1, workspace_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var OutputMode = (function (_super) {
        __extends(OutputMode, _super);
        function OutputMode(descriptor, instantiationService, compatWorkerService, contextService) {
            var _this = this;
            _super.call(this, descriptor.id, compatWorkerService);
            this._modeWorkerManager = new abstractMode_1.ModeWorkerManager(descriptor, 'vs/workbench/parts/output/common/outputWorker', 'OutputWorker', null, instantiationService);
            modes.LinkProviderRegistry.register(this.getId(), {
                provideLinks: function (model, token) {
                    return async_1.wireCancellationToken(token, _this._provideLinks(model.uri));
                }
            });
            if (compatWorkerService.isInMainThread) {
                var workspace = contextService.getWorkspace();
                if (workspace) {
                    this._configure(workspace.resource);
                }
            }
        }
        OutputMode.prototype._worker = function (runner) {
            return this._modeWorkerManager.worker(runner);
        };
        OutputMode.prototype._configure = function (workspaceResource) {
            return this._worker(function (w) { return w.configure(workspaceResource); });
        };
        OutputMode.prototype._provideLinks = function (resource) {
            return this._worker(function (w) { return w.provideLinks(resource); });
        };
        OutputMode.$_configure = compatWorkerService_1.CompatWorkerAttr(OutputMode, OutputMode.prototype._configure);
        OutputMode.$_provideLinks = compatWorkerService_1.CompatWorkerAttr(OutputMode, OutputMode.prototype._provideLinks);
        OutputMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, compatWorkerService_1.ICompatWorkerService),
            __param(3, workspace_1.IWorkspaceContextService)
        ], OutputMode);
        return OutputMode;
    }(abstractMode_1.CompatMode));
    exports.OutputMode = OutputMode;
});

}).call(this);
//# sourceMappingURL=outputMode.js.map
