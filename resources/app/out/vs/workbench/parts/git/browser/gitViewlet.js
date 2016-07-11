/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/winjs.base","vs/nls!vs/workbench/parts/git/browser/gitViewlet","vs/nls","vs/css!vs/workbench/parts/git/browser/gitViewlet","vs/base/common/eventEmitter","vs/base/browser/builder","vs/workbench/parts/git/common/git","vs/platform/instantiation/common/instantiation","vs/base/browser/dom","vs/base/common/platform","vs/platform/workspace/common/workspace","vs/base/common/lifecycle","vs/platform/message/common/message","vs/workbench/parts/git/browser/gitActions","vs/base/common/paths","vs/nls!vs/workbench/parts/git/browser/views/notroot/notrootView","vs/nls!vs/workbench/parts/git/browser/views/noworkspace/noworkspaceView","vs/workbench/parts/git/browser/views/disabled/disabledView","vs/css!vs/workbench/parts/git/browser/views/disabled/disabledView","vs/css!vs/workbench/parts/git/browser/views/empty/emptyView","vs/css!vs/workbench/parts/git/browser/views/gitless/gitlessView","vs/css!vs/workbench/parts/git/browser/views/huge/hugeView","vs/css!vs/workbench/parts/git/browser/views/notroot/notrootView","vs/workbench/parts/git/browser/views/gitless/gitlessView","vs/css!vs/workbench/parts/git/browser/views/noworkspace/noworkspaceView","vs/nls!vs/workbench/parts/git/browser/views/changes/changesView","vs/workbench/parts/git/browser/views/notroot/notrootView","vs/workbench/parts/git/browser/views/noworkspace/noworkspaceView","vs/workbench/parts/git/browser/views/huge/hugeView","vs/css!vs/workbench/parts/git/browser/media/gitViewlet","vs/css!vs/workbench/parts/git/browser/views/changes/changesView","vs/base/common/errors","vs/base/browser/ui/button/button","vs/workbench/parts/git/browser/views/changes/changesViewer","vs/nls!vs/workbench/parts/git/browser/views/changes/changesViewer","vs/base/common/severity","vs/workbench/parts/git/browser/views/empty/emptyView","vs/base/browser/ui/actionbar/actionbar","vs/nls!vs/workbench/parts/git/browser/views/disabled/disabledView","vs/workbench/parts/git/browser/views/changes/changesView","vs/base/common/keyCodes","vs/nls!vs/workbench/parts/git/browser/views/empty/emptyView","vs/workbench/parts/git/common/gitModel","vs/nls!vs/workbench/parts/git/browser/views/gitless/gitlessView","vs/platform/contextview/browser/contextView","vs/nls!vs/workbench/parts/git/browser/views/huge/hugeView","vs/workbench/common/editor","vs/base/parts/tree/browser/treeDefaults","vs/base/common/uri","vs/base/parts/tree/browser/tree","vs/base/browser/ui/countBadge/countBadge","vs/base/common/strings","vs/base/browser/keyboardEvent","vs/base/common/actions","vs/base/parts/tree/browser/treeImpl","vs/workbench/parts/git/browser/gitEditorInputs","vs/workbench/parts/files/common/files","vs/workbench/parts/output/common/output","vs/base/parts/tree/browser/treeDnd","vs/base/browser/ui/inputbox/inputBox","vs/workbench/services/editor/common/editorService","vs/platform/event/common/event","vs/workbench/services/group/common/groupService","vs/platform/configuration/common/configuration","vs/base/common/comparers","vs/platform/files/common/files","vs/workbench/parts/git/browser/gitViewlet","vs/workbench/browser/viewlet","vs/workbench/parts/git/browser/gitWorkbenchContributions","vs/platform/progress/common/progress","vs/platform/telemetry/common/telemetry"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[31], __M([5]), {});
define(__m[32], __M([5]), {});
define(__m[20], __M([5]), {});
define(__m[21], __M([5]), {});
define(__m[22], __M([5]), {});
define(__m[23], __M([5]), {});
define(__m[24], __M([5]), {});
define(__m[26], __M([5]), {});
define(__m[27], __M([4,3]), function(nls, data) { return nls.create("vs/workbench/parts/git/browser/views/changes/changesView", data); });
define(__m[36], __M([4,3]), function(nls, data) { return nls.create("vs/workbench/parts/git/browser/views/changes/changesViewer", data); });
define(__m[40], __M([4,3]), function(nls, data) { return nls.create("vs/workbench/parts/git/browser/views/disabled/disabledView", data); });
define(__m[43], __M([4,3]), function(nls, data) { return nls.create("vs/workbench/parts/git/browser/views/empty/emptyView", data); });
define(__m[45], __M([4,3]), function(nls, data) { return nls.create("vs/workbench/parts/git/browser/views/gitless/gitlessView", data); });
define(__m[47], __M([4,3]), function(nls, data) { return nls.create("vs/workbench/parts/git/browser/views/huge/hugeView", data); });
define(__m[17], __M([4,3]), function(nls, data) { return nls.create("vs/workbench/parts/git/browser/views/notroot/notrootView", data); });
define(__m[18], __M([4,3]), function(nls, data) { return nls.create("vs/workbench/parts/git/browser/views/noworkspace/noworkspaceView", data); });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(__m[19], __M([0,1,40,2,6,7,20]), function (require, exports, nls, winjs, ee, builder) {
    'use strict';
    var $ = builder.$;
    var DisabledView = (function (_super) {
        __extends(DisabledView, _super);
        function DisabledView() {
            _super.apply(this, arguments);
            this.ID = 'disabled';
        }
        Object.defineProperty(DisabledView.prototype, "element", {
            get: function () {
                if (!this._element) {
                    this.render();
                }
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        DisabledView.prototype.render = function () {
            this._element = $([
                '<div class="disabled-view">',
                '<p>', nls.localize(0, null), '</p>',
                '</div>'
            ].join('')).getHTMLElement();
        };
        DisabledView.prototype.focus = function () {
            return;
        };
        DisabledView.prototype.layout = function (dimension) {
            return;
        };
        DisabledView.prototype.setVisible = function (visible) {
            return winjs.TPromise.as(null);
        };
        DisabledView.prototype.getControl = function () {
            return null;
        };
        DisabledView.prototype.getActions = function () {
            return [];
        };
        DisabledView.prototype.getSecondaryActions = function () {
            return [];
        };
        return DisabledView;
    }(ee.EventEmitter));
    exports.DisabledView = DisabledView;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[25], __M([0,1,45,11,2,6,7,12,22]), function (require, exports, nls, platform, winjs, ee, builder, workspace_1) {
    'use strict';
    var $ = builder.$;
    var GitlessView = (function (_super) {
        __extends(GitlessView, _super);
        function GitlessView(contextService) {
            _super.call(this);
            this.ID = 'gitless';
            this._contextService = contextService;
        }
        Object.defineProperty(GitlessView.prototype, "element", {
            get: function () {
                if (!this._element) {
                    this.render();
                }
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        GitlessView.prototype.render = function () {
            var instructions;
            if (platform.isMacintosh) {
                instructions = nls.localize(0, null, '<a href="http://brew.sh/" tabindex="0" target="_blank">Homebrew</a>', '<a href="http://git-scm.com/download/mac" tabindex="0" target="_blank">git-scm.com</a>', '<a href="https://developer.apple.com/xcode/" tabindex="0" target="_blank">XCode</a>', '<code>git</code>');
            }
            else if (platform.isWindows) {
                instructions = nls.localize(1, null, '<a href="https://chocolatey.org/packages/git" tabindex="0" target="_blank">Chocolatey</a>', '<a href="http://git-scm.com/download/win" tabindex="0" target="_blank">git-scm.com</a>');
            }
            else if (platform.isLinux) {
                instructions = nls.localize(2, null, '<a href="http://git-scm.com/download/linux" tabindex="0" target="_blank">git-scm.com</a>');
            }
            else {
                instructions = nls.localize(3, null, '<a href="http://git-scm.com/download" tabindex="0" target="_blank">git-scm.com</a>');
            }
            this._element = $([
                '<div class="gitless-view">',
                '<p>', nls.localize(4, null), '</p>',
                '<p>', instructions, '</p>',
                '<p>', nls.localize(5, null, this._contextService.getConfiguration().env.appName), '</p>',
                '</div>'
            ].join('')).getHTMLElement();
        };
        GitlessView.prototype.focus = function () {
            return;
        };
        GitlessView.prototype.layout = function (dimension) {
            return;
        };
        GitlessView.prototype.setVisible = function (visible) {
            return winjs.TPromise.as(null);
        };
        GitlessView.prototype.getControl = function () {
            return null;
        };
        GitlessView.prototype.getActions = function () {
            return [];
        };
        GitlessView.prototype.getSecondaryActions = function () {
            return [];
        };
        GitlessView = __decorate([
            __param(0, workspace_1.IWorkspaceContextService)
        ], GitlessView);
        return GitlessView;
    }(ee.EventEmitter));
    exports.GitlessView = GitlessView;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





define(__m[28], __M([0,1,17,2,6,7,24]), function (require, exports, nls, winjs, ee, builder) {
    'use strict';
    var $ = builder.$;
    var NotRootView = (function (_super) {
        __extends(NotRootView, _super);
        function NotRootView() {
            _super.apply(this, arguments);
            this.ID = 'notroot';
        }
        Object.defineProperty(NotRootView.prototype, "element", {
            get: function () {
                if (!this._element) {
                    this.render();
                }
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        NotRootView.prototype.render = function () {
            this._element = $([
                '<div class="notroot-view">',
                '<p>', nls.localize(0, null), '</p>',
                '<p>', nls.localize(1, null), '</p>',
                '</div>'
            ].join('')).getHTMLElement();
        };
        NotRootView.prototype.focus = function () {
            return;
        };
        NotRootView.prototype.layout = function (dimension) {
            return;
        };
        NotRootView.prototype.setVisible = function (visible) {
            return winjs.TPromise.as(null);
        };
        NotRootView.prototype.getControl = function () {
            return null;
        };
        NotRootView.prototype.getActions = function () {
            return [];
        };
        NotRootView.prototype.getSecondaryActions = function () {
            return [];
        };
        return NotRootView;
    }(ee.EventEmitter));
    exports.NotRootView = NotRootView;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





define(__m[29], __M([0,1,18,2,6,7,26]), function (require, exports, nls, winjs, ee, builder) {
    'use strict';
    var $ = builder.$;
    var NoWorkspaceView = (function (_super) {
        __extends(NoWorkspaceView, _super);
        function NoWorkspaceView() {
            _super.apply(this, arguments);
            this.ID = 'noworkspace';
        }
        Object.defineProperty(NoWorkspaceView.prototype, "element", {
            get: function () {
                if (!this._element) {
                    this.render();
                }
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        NoWorkspaceView.prototype.render = function () {
            this._element = $([
                '<div class="noworkspace-view">',
                '<p>', nls.localize(0, null), '</p>',
                '<p>', nls.localize(1, null), '</p>',
                '</div>'
            ].join('')).getHTMLElement();
        };
        NoWorkspaceView.prototype.focus = function () {
            return;
        };
        NoWorkspaceView.prototype.layout = function (dimension) {
            return;
        };
        NoWorkspaceView.prototype.setVisible = function (visible) {
            return winjs.TPromise.as(null);
        };
        NoWorkspaceView.prototype.getControl = function () {
            return null;
        };
        NoWorkspaceView.prototype.getActions = function () {
            return [];
        };
        NoWorkspaceView.prototype.getSecondaryActions = function () {
            return [];
        };
        return NoWorkspaceView;
    }(ee.EventEmitter));
    exports.NoWorkspaceView = NoWorkspaceView;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[30], __M([0,1,47,2,6,10,8,33,34,23]), function (require, exports, nls, winjs, ee, dom, git_1, errors_1, button_1) {
    'use strict';
    var $ = dom.emmet;
    var HugeView = (function (_super) {
        __extends(HugeView, _super);
        function HugeView(gitService) {
            _super.call(this);
            this.gitService = gitService;
            this.ID = 'huge';
        }
        Object.defineProperty(HugeView.prototype, "element", {
            get: function () {
                if (!this._element) {
                    this.render();
                }
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        HugeView.prototype.render = function () {
            var _this = this;
            this._element = $('.huge-view');
            dom.append(this._element, $('p')).textContent = nls.localize(0, null);
            var settingP = dom.append(this._element, $('p'));
            dom.append(settingP, document.createTextNode(nls.localize(1, null)));
            dom.append(settingP, document.createTextNode(' '));
            var pre = dom.append(settingP, $('pre'));
            pre.style.display = 'inline';
            pre.textContent = 'git.allowLargeRepositories';
            var button = new button_1.Button(this._element);
            button.label = nls.localize(2, null);
            button.addListener2('click', function (e) {
                dom.EventHelper.stop(e);
                _this.gitService.allowHugeRepositories = true;
                _this.gitService.status().done(null, errors_1.onUnexpectedError);
            });
        };
        HugeView.prototype.focus = function () {
            return;
        };
        HugeView.prototype.layout = function (dimension) {
            return;
        };
        HugeView.prototype.setVisible = function (visible) {
            return winjs.TPromise.as(null);
        };
        HugeView.prototype.getControl = function () {
            return null;
        };
        HugeView.prototype.getActions = function () {
            return [];
        };
        HugeView.prototype.getSecondaryActions = function () {
            return [];
        };
        HugeView = __decorate([
            __param(0, git_1.IGitService)
        ], HugeView);
        return HugeView;
    }(ee.EventEmitter));
    exports.HugeView = HugeView;
});















define(__m[35], __M([0,1,2,36,11,16,37,10,66,39,52,51,60,49,8,44,15,46,9,14,42,12,50]), function (require, exports, winjs, nls, platform, paths, severity_1, dom, comparers, actionbar, countbadge, tree, treednd, treedefaults, git, gitmodel, gitactions, contextView_1, instantiation_1, message_1, keyCodes_1, workspace_1, uri_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var IGitService = git.IGitService;
    function toReadablePath(path) {
        if (!platform.isWindows) {
            return path;
        }
        return path.replace(/\//g, '\\');
    }
    var $ = dom.emmet;
    var ActionContainer = (function () {
        function ActionContainer(instantiationService) {
            this.cache = {};
            this.instantiationService = instantiationService;
        }
        ActionContainer.prototype.getAction = function (ctor) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var action = this.cache[ctor.ID];
            if (!action) {
                args.unshift(ctor);
                action = this.cache[ctor.ID] = this.instantiationService.createInstance.apply(this.instantiationService, args);
            }
            return action;
        };
        ActionContainer.prototype.dispose = function () {
            var _this = this;
            Object.keys(this.cache).forEach(function (k) {
                _this.cache[k].dispose();
            });
            this.cache = null;
        };
        return ActionContainer;
    }());
    exports.ActionContainer = ActionContainer;
    var DataSource = (function () {
        function DataSource() {
        }
        DataSource.prototype.getId = function (tree, element) {
            if (element instanceof gitmodel.StatusModel) {
                return 'root';
            }
            else if (element instanceof gitmodel.StatusGroup) {
                var statusGroup = element;
                switch (statusGroup.getType()) {
                    case git.StatusType.INDEX: return 'index';
                    case git.StatusType.WORKING_TREE: return 'workingTree';
                    case git.StatusType.MERGE: return 'merge';
                    default: throw new Error('Invalid group type');
                }
            }
            var status = element;
            return status.getId();
        };
        DataSource.prototype.hasChildren = function (tree, element) {
            if (element instanceof gitmodel.StatusModel) {
                return true;
            }
            else if (element instanceof gitmodel.StatusGroup) {
                var statusGroup = element;
                return statusGroup.all().length > 0;
            }
        };
        DataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof gitmodel.StatusModel) {
                var model = element;
                return winjs.TPromise.as(model.getGroups());
            }
            else if (element instanceof gitmodel.StatusGroup) {
                var statusGroup = element;
                return winjs.TPromise.as(statusGroup.all());
            }
            return winjs.TPromise.as([]);
        };
        DataSource.prototype.getParent = function (tree, element) {
            return winjs.TPromise.as(null);
        };
        return DataSource;
    }());
    exports.DataSource = DataSource;
    var ActionProvider = (function (_super) {
        __extends(ActionProvider, _super);
        function ActionProvider(instantiationService, gitService) {
            _super.call(this, instantiationService);
            this.gitService = gitService;
        }
        ActionProvider.prototype.hasActions = function (tree, element) {
            if (element instanceof gitmodel.FileStatus) {
                return true;
            }
            else if (element instanceof gitmodel.StatusGroup && element.all().length > 0) {
                return true;
            }
            return false;
        };
        ActionProvider.prototype.getActions = function (tree, element) {
            if (element instanceof gitmodel.StatusGroup) {
                return winjs.TPromise.as(this.getActionsForGroupStatusType(element.getType()));
            }
            else {
                return winjs.TPromise.as(this.getActionsForFileStatusType(element.getType()));
            }
        };
        ActionProvider.prototype.getActionsForFileStatusType = function (statusType) {
            switch (statusType) {
                case git.StatusType.INDEX:
                    return [this.getAction(gitactions.UnstageAction)];
                case git.StatusType.WORKING_TREE:
                    return [this.getAction(gitactions.UndoAction), this.getAction(gitactions.StageAction)];
                case git.StatusType.MERGE:
                    return [this.getAction(gitactions.StageAction)];
                default:
                    return [];
            }
        };
        ActionProvider.prototype.getActionsForGroupStatusType = function (statusType) {
            switch (statusType) {
                case git.StatusType.INDEX:
                    return [this.getAction(gitactions.GlobalUnstageAction)];
                case git.StatusType.WORKING_TREE:
                    return [this.getAction(gitactions.GlobalUndoAction), this.getAction(gitactions.GlobalStageAction)];
                case git.StatusType.MERGE:
                    return [this.getAction(gitactions.StageAction)];
                default:
                    return [];
            }
        };
        ActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return this.hasActions(tree, element);
        };
        ActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var _this = this;
            return this.getActions(tree, element).then(function (actions) {
                if (element instanceof gitmodel.FileStatus) {
                    var fileStatus = element;
                    var status = fileStatus.getStatus();
                    actions.push(new actionbar.Separator());
                    if (status !== git.Status.DELETED && status !== git.Status.INDEX_DELETED) {
                        actions.push(_this.getAction(gitactions.OpenFileAction));
                    }
                    actions.push(_this.getAction(gitactions.OpenChangeAction));
                }
                actions.reverse();
                return actions;
            });
        };
        ActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        ActionProvider = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, IGitService)
        ], ActionProvider);
        return ActionProvider;
    }(ActionContainer));
    exports.ActionProvider = ActionProvider;
    var Renderer = (function () {
        function Renderer(actionProvider, actionRunner, messageService, gitService, contextService) {
            this.actionProvider = actionProvider;
            this.actionRunner = actionRunner;
            this.messageService = messageService;
            this.gitService = gitService;
            this.contextService = contextService;
            // noop
        }
        Renderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        Renderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof gitmodel.StatusGroup) {
                switch (element.getType()) {
                    case git.StatusType.INDEX: return 'index';
                    case git.StatusType.WORKING_TREE: return 'workingTree';
                    case git.StatusType.MERGE: return 'merge';
                }
            }
            if (element instanceof gitmodel.FileStatus) {
                switch (element.getType()) {
                    case git.StatusType.INDEX: return 'file:index';
                    case git.StatusType.WORKING_TREE: return 'file:workingTree';
                    case git.StatusType.MERGE: return 'file:merge';
                }
            }
            return null;
        };
        Renderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (/^file:/.test(templateId)) {
                return this.renderFileStatusTemplate(Renderer.templateIdToStatusType(templateId), container);
            }
            else {
                return this.renderStatusGroupTemplate(Renderer.templateIdToStatusType(templateId), container);
            }
        };
        Renderer.prototype.renderStatusGroupTemplate = function (statusType, container) {
            var _this = this;
            var data = Object.create(null);
            data.root = dom.append(container, $('.status-group'));
            switch (statusType) {
                case git.StatusType.INDEX:
                    data.root.textContent = nls.localize(0, null);
                    break;
                case git.StatusType.WORKING_TREE:
                    data.root.textContent = nls.localize(1, null);
                    break;
                case git.StatusType.MERGE:
                    data.root.textContent = nls.localize(2, null);
                    break;
            }
            var wrapper = dom.append(container, $('.count-badge-wrapper'));
            data.count = new countbadge.CountBadge(wrapper);
            data.actionBar = new actionbar.ActionBar(container, { actionRunner: this.actionRunner });
            data.actionBar.push(this.actionProvider.getActionsForGroupStatusType(statusType), { icon: true, label: false });
            data.actionBar.addListener2('run', function (e) { return e.error && _this.onError(e.error); });
            return data;
        };
        Renderer.prototype.renderFileStatusTemplate = function (statusType, container) {
            var _this = this;
            var data = Object.create(null);
            data.root = dom.append(container, $('.file-status'));
            data.status = dom.append(data.root, $('span.status'));
            data.name = dom.append(data.root, $('a.name.plain'));
            data.folder = dom.append(data.root, $('span.folder'));
            var rename = dom.append(data.root, $('span.rename'));
            var arrow = dom.append(rename, $('span.rename-arrow'));
            arrow.textContent = '←';
            data.renameName = dom.append(rename, $('span.rename-name'));
            data.renameFolder = dom.append(rename, $('span.rename-folder'));
            data.actionBar = new actionbar.ActionBar(container, { actionRunner: this.actionRunner });
            data.actionBar.push(this.actionProvider.getActionsForFileStatusType(statusType), { icon: true, label: false });
            data.actionBar.addListener2('run', function (e) { return e.error && _this.onError(e.error); });
            return data;
        };
        Renderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (/^file:/.test(templateId)) {
                this.renderFileStatus(tree, element, templateData);
            }
            else {
                Renderer.renderStatusGroup(element, templateData);
            }
        };
        Renderer.renderStatusGroup = function (statusGroup, data) {
            data.actionBar.context = statusGroup;
            data.count.setCount(statusGroup.all().length);
        };
        Renderer.prototype.renderFileStatus = function (tree, fileStatus, data) {
            data.actionBar.context = {
                tree: tree,
                fileStatus: fileStatus
            };
            var repositoryRoot = this.gitService.getModel().getRepositoryRoot();
            var workspaceRoot = this.contextService.getWorkspace().resource.fsPath;
            var status = fileStatus.getStatus();
            var renamePath = fileStatus.getRename();
            var path = fileStatus.getPath();
            var lastSlashIndex = path.lastIndexOf('/');
            var name = lastSlashIndex === -1 ? path : path.substr(lastSlashIndex + 1, path.length);
            var folder = (lastSlashIndex === -1 ? '' : path.substr(0, lastSlashIndex));
            data.root.className = 'file-status ' + Renderer.statusToClass(status);
            data.status.textContent = Renderer.statusToChar(status);
            data.status.title = Renderer.statusToTitle(status);
            var resource = uri_1.default.file(paths.normalize(paths.join(repositoryRoot, path)));
            var isInWorkspace = paths.isEqualOrParent(resource.fsPath, workspaceRoot);
            var rename = '';
            var renameFolder = '';
            if (renamePath) {
                var renameLastSlashIndex = renamePath.lastIndexOf('/');
                rename = renameLastSlashIndex === -1 ? renamePath : renamePath.substr(renameLastSlashIndex + 1, renamePath.length);
                renameFolder = (renameLastSlashIndex === -1 ? '' : renamePath.substr(0, renameLastSlashIndex));
                data.renameName.textContent = name;
                data.renameFolder.textContent = folder;
                var resource_1 = uri_1.default.file(paths.normalize(paths.join(repositoryRoot, renamePath)));
                isInWorkspace = paths.isEqualOrParent(resource_1.fsPath, workspaceRoot);
            }
            if (isInWorkspace) {
                data.root.title = '';
            }
            else {
                data.root.title = nls.localize(3, null);
                data.root.className += ' out-of-workspace';
            }
            data.name.textContent = rename || name;
            data.name.title = renamePath || path;
            data.folder.textContent = toReadablePath(renameFolder || folder);
        };
        Renderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            if (/^file:/.test(templateId)) {
                Renderer.disposeFileStatusTemplate(templateData);
            }
        };
        Renderer.disposeFileStatusTemplate = function (templateData) {
            templateData.actionBar.dispose();
        };
        Renderer.statusToChar = function (status) {
            switch (status) {
                case git.Status.INDEX_MODIFIED: return nls.localize(4, null);
                case git.Status.MODIFIED: return nls.localize(5, null);
                case git.Status.INDEX_ADDED: return nls.localize(6, null);
                case git.Status.INDEX_DELETED: return nls.localize(7, null);
                case git.Status.DELETED: return nls.localize(8, null);
                case git.Status.INDEX_RENAMED: return nls.localize(9, null);
                case git.Status.INDEX_COPIED: return nls.localize(10, null);
                case git.Status.UNTRACKED: return nls.localize(11, null);
                case git.Status.IGNORED: return nls.localize(12, null);
                case git.Status.BOTH_DELETED: return nls.localize(13, null);
                case git.Status.ADDED_BY_US: return nls.localize(14, null);
                case git.Status.DELETED_BY_THEM: return nls.localize(15, null);
                case git.Status.ADDED_BY_THEM: return nls.localize(16, null);
                case git.Status.DELETED_BY_US: return nls.localize(17, null);
                case git.Status.BOTH_ADDED: return nls.localize(18, null);
                case git.Status.BOTH_MODIFIED: return nls.localize(19, null);
                default: return '';
            }
        };
        Renderer.statusToTitle = function (status) {
            switch (status) {
                case git.Status.INDEX_MODIFIED: return nls.localize(20, null);
                case git.Status.MODIFIED: return nls.localize(21, null);
                case git.Status.INDEX_ADDED: return nls.localize(22, null);
                case git.Status.INDEX_DELETED: return nls.localize(23, null);
                case git.Status.DELETED: return nls.localize(24, null);
                case git.Status.INDEX_RENAMED: return nls.localize(25, null);
                case git.Status.INDEX_COPIED: return nls.localize(26, null);
                case git.Status.UNTRACKED: return nls.localize(27, null);
                case git.Status.IGNORED: return nls.localize(28, null);
                case git.Status.BOTH_DELETED: return nls.localize(29, null);
                case git.Status.ADDED_BY_US: return nls.localize(30, null);
                case git.Status.DELETED_BY_THEM: return nls.localize(31, null);
                case git.Status.ADDED_BY_THEM: return nls.localize(32, null);
                case git.Status.DELETED_BY_US: return nls.localize(33, null);
                case git.Status.BOTH_ADDED: return nls.localize(34, null);
                case git.Status.BOTH_MODIFIED: return nls.localize(35, null);
                default: return '';
            }
        };
        Renderer.statusToClass = function (status) {
            switch (status) {
                case git.Status.INDEX_MODIFIED: return 'modified';
                case git.Status.MODIFIED: return 'modified';
                case git.Status.INDEX_ADDED: return 'added';
                case git.Status.INDEX_DELETED: return 'deleted';
                case git.Status.DELETED: return 'deleted';
                case git.Status.INDEX_RENAMED: return 'renamed';
                case git.Status.INDEX_COPIED: return 'copied';
                case git.Status.UNTRACKED: return 'untracked';
                case git.Status.IGNORED: return 'ignored';
                case git.Status.BOTH_DELETED: return 'conflict both-deleted';
                case git.Status.ADDED_BY_US: return 'conflict added-by-us';
                case git.Status.DELETED_BY_THEM: return 'conflict deleted-by-them';
                case git.Status.ADDED_BY_THEM: return 'conflict added-by-them';
                case git.Status.DELETED_BY_US: return 'conflict deleted-by-us';
                case git.Status.BOTH_ADDED: return 'conflict both-added';
                case git.Status.BOTH_MODIFIED: return 'conflict both-modified';
                default: return '';
            }
        };
        Renderer.templateIdToStatusType = function (templateId) {
            if (/index$/.test(templateId)) {
                return git.StatusType.INDEX;
            }
            else if (/workingTree$/.test(templateId)) {
                return git.StatusType.WORKING_TREE;
            }
            else {
                return git.StatusType.MERGE;
            }
        };
        Renderer.prototype.onError = function (error) {
            this.messageService.show(severity_1.default.Error, error);
        };
        Renderer = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, IGitService),
            __param(4, workspace_1.IWorkspaceContextService)
        ], Renderer);
        return Renderer;
    }());
    exports.Renderer = Renderer;
    var Filter = (function () {
        function Filter() {
        }
        Filter.prototype.isVisible = function (tree, element) {
            if (element instanceof gitmodel.StatusGroup) {
                var statusGroup = element;
                switch (statusGroup.getType()) {
                    case git.StatusType.INDEX:
                    case git.StatusType.MERGE:
                        return statusGroup.all().length > 0;
                    case git.StatusType.WORKING_TREE:
                        return true;
                }
            }
            return true;
        };
        return Filter;
    }());
    exports.Filter = Filter;
    var Sorter = (function () {
        function Sorter() {
        }
        Sorter.prototype.compare = function (tree, element, otherElement) {
            if (!(element instanceof gitmodel.FileStatus && otherElement instanceof gitmodel.FileStatus)) {
                return 0;
            }
            return Sorter.compareStatus(element, otherElement);
        };
        Sorter.compareStatus = function (element, otherElement) {
            var one = element.getPathComponents();
            var other = otherElement.getPathComponents();
            var lastOne = one.length - 1;
            var lastOther = other.length - 1;
            var endOne, endOther, onePart, otherPart;
            for (var i = 0;; i++) {
                endOne = lastOne === i;
                endOther = lastOther === i;
                if (endOne && endOther) {
                    return comparers.compareFileNames(one[i], other[i]);
                }
                else if (endOne) {
                    return -1;
                }
                else if (endOther) {
                    return 1;
                }
                else if ((onePart = one[i].toLowerCase()) !== (otherPart = other[i].toLowerCase())) {
                    return onePart < otherPart ? -1 : 1;
                }
            }
        };
        return Sorter;
    }());
    exports.Sorter = Sorter;
    var DragAndDrop = (function (_super) {
        __extends(DragAndDrop, _super);
        function DragAndDrop(instantiationService, gitService, messageService) {
            _super.call(this, instantiationService);
            this.gitService = gitService;
            this.messageService = messageService;
        }
        DragAndDrop.prototype.getDragURI = function (tree, element) {
            if (element instanceof gitmodel.StatusGroup) {
                var statusGroup = element;
                return 'git:' + statusGroup.getType();
            }
            else if (element instanceof gitmodel.FileStatus) {
                var status = element;
                return 'git:' + status.getType() + ':' + status.getPath();
            }
            return null;
        };
        DragAndDrop.prototype.onDragStart = function (tree, data, originalEvent) {
            // no-op
        };
        DragAndDrop.prototype.onDragOver = function (_tree, data, targetElement, originalEvent) {
            if (!this.gitService.isIdle()) {
                return tree.DRAG_OVER_REJECT;
            }
            if (!(data instanceof treednd.ElementsDragAndDropData)) {
                return tree.DRAG_OVER_REJECT;
            }
            var elements = data.getData();
            var element = elements[0];
            if (element instanceof gitmodel.StatusGroup) {
                var statusGroup = element;
                return this.onDrag(targetElement, statusGroup.getType());
            }
            else if (element instanceof gitmodel.FileStatus) {
                var status = element;
                return this.onDrag(targetElement, status.getType());
            }
            else {
                return tree.DRAG_OVER_REJECT;
            }
        };
        DragAndDrop.prototype.onDrag = function (targetElement, type) {
            if (type === git.StatusType.WORKING_TREE) {
                return this.onDragWorkingTree(targetElement);
            }
            else if (type === git.StatusType.INDEX) {
                return this.onDragIndex(targetElement);
            }
            else if (type === git.StatusType.MERGE) {
                return this.onDragMerge(targetElement);
            }
            else {
                return tree.DRAG_OVER_REJECT;
            }
        };
        DragAndDrop.prototype.onDragWorkingTree = function (targetElement) {
            if (targetElement instanceof gitmodel.StatusGroup) {
                var targetStatusGroup = targetElement;
                return targetStatusGroup.getType() === git.StatusType.INDEX ? tree.DRAG_OVER_ACCEPT_BUBBLE_DOWN : tree.DRAG_OVER_REJECT;
            }
            else if (targetElement instanceof gitmodel.FileStatus) {
                var targetStatus = targetElement;
                return targetStatus.getType() === git.StatusType.INDEX ? tree.DRAG_OVER_ACCEPT_BUBBLE_UP : tree.DRAG_OVER_REJECT;
            }
            else {
                return tree.DRAG_OVER_REJECT;
            }
        };
        DragAndDrop.prototype.onDragIndex = function (targetElement) {
            if (targetElement instanceof gitmodel.StatusGroup) {
                var targetStatusGroup = targetElement;
                return targetStatusGroup.getType() === git.StatusType.WORKING_TREE ? tree.DRAG_OVER_ACCEPT_BUBBLE_DOWN : tree.DRAG_OVER_REJECT;
            }
            else if (targetElement instanceof gitmodel.FileStatus) {
                var targetStatus = targetElement;
                return targetStatus.getType() === git.StatusType.WORKING_TREE ? tree.DRAG_OVER_ACCEPT_BUBBLE_UP : tree.DRAG_OVER_REJECT;
            }
            else {
                return tree.DRAG_OVER_REJECT;
            }
        };
        DragAndDrop.prototype.onDragMerge = function (targetElement) {
            if (targetElement instanceof gitmodel.StatusGroup) {
                var targetStatusGroup = targetElement;
                return targetStatusGroup.getType() === git.StatusType.INDEX ? tree.DRAG_OVER_ACCEPT_BUBBLE_DOWN : tree.DRAG_OVER_REJECT;
            }
            else if (targetElement instanceof gitmodel.FileStatus) {
                var targetStatus = targetElement;
                return targetStatus.getType() === git.StatusType.INDEX ? tree.DRAG_OVER_ACCEPT_BUBBLE_UP : tree.DRAG_OVER_REJECT;
            }
            else {
                return tree.DRAG_OVER_REJECT;
            }
        };
        DragAndDrop.prototype.drop = function (tree, data, targetElement, originalEvent) {
            var _this = this;
            var elements = data.getData();
            var element = elements[0];
            var files;
            if (element instanceof gitmodel.StatusGroup) {
                files = element.all();
            }
            else {
                files = elements;
            }
            var targetGroup = targetElement;
            // Add files to index
            if (targetGroup.getType() === git.StatusType.INDEX) {
                this.getAction(gitactions.StageAction).run(files).done(null, function (e) { return _this.onError(e); });
            }
            // Remove files from index
            if (targetGroup.getType() === git.StatusType.WORKING_TREE) {
                this.getAction(gitactions.UnstageAction).run(files).done(null, function (e) { return _this.onError(e); });
            }
        };
        DragAndDrop.prototype.onError = function (error) {
            this.messageService.show(severity_1.default.Error, error);
        };
        DragAndDrop = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, IGitService),
            __param(2, message_1.IMessageService)
        ], DragAndDrop);
        return DragAndDrop;
    }(ActionContainer));
    exports.DragAndDrop = DragAndDrop;
    var AccessibilityProvider = (function () {
        function AccessibilityProvider() {
        }
        AccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof gitmodel.FileStatus) {
                var fileStatus = element;
                var status_1 = fileStatus.getStatus();
                var path = fileStatus.getPath();
                var lastSlashIndex = path.lastIndexOf('/');
                var name_1 = lastSlashIndex === -1 ? path : path.substr(lastSlashIndex + 1, path.length);
                var folder = (lastSlashIndex === -1 ? '' : path.substr(0, lastSlashIndex));
                return nls.localize(36, null, name_1, folder, Renderer.statusToTitle(status_1));
            }
            if (element instanceof gitmodel.StatusGroup) {
                switch (element.getType()) {
                    case git.StatusType.INDEX: return nls.localize(37, null);
                    case git.StatusType.WORKING_TREE: return nls.localize(38, null);
                    case git.StatusType.MERGE: return nls.localize(39, null);
                }
            }
        };
        return AccessibilityProvider;
    }());
    exports.AccessibilityProvider = AccessibilityProvider;
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller(actionProvider, contextMenuService) {
            _super.call(this, { clickBehavior: treedefaults.ClickBehavior.ON_MOUSE_UP });
            this.actionProvider = actionProvider;
            this.contextMenuService = contextMenuService;
            this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.SHIFT_UP_ARROW, this.onUp.bind(this));
            this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.SHIFT_DOWN_ARROW, this.onDown.bind(this));
            this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.SHIFT_PAGE_UP, this.onPageUp.bind(this));
            this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.SHIFT_PAGE_DOWN, this.onPageDown.bind(this));
        }
        Controller.prototype.onLeftClick = function (tree, element, event) {
            // Status group should never get selected nor expanded/collapsed
            if (element instanceof gitmodel.StatusGroup) {
                event.preventDefault();
                event.stopPropagation();
                return true;
            }
            if (event.shiftKey) {
                var focus = tree.getFocus();
                if (!(focus instanceof gitmodel.FileStatus) || !(element instanceof gitmodel.FileStatus)) {
                    return;
                }
                var focusStatus = focus;
                var elementStatus = element;
                if (focusStatus.getType() !== elementStatus.getType()) {
                    return;
                }
                if (this.canSelect(tree, element)) {
                    tree.setFocus(element);
                    if (tree.isSelected(element)) {
                        tree.deselectRange(focusStatus, elementStatus);
                    }
                    else {
                        tree.selectRange(focusStatus, elementStatus);
                    }
                }
                return;
            }
            tree.setFocus(element);
            if (platform.isMacintosh ? event.metaKey : event.ctrlKey) {
                if (this.canSelect(tree, element)) {
                    tree.toggleSelection(element, { origin: 'mouse', originalEvent: event });
                }
                return;
            }
            return _super.prototype.onLeftClick.call(this, tree, element, event);
        };
        Controller.prototype.onEnter = function (tree, event) {
            var element = tree.getFocus();
            // Status group should never get selected nor expanded/collapsed
            if (element instanceof gitmodel.StatusGroup) {
                event.preventDefault();
                event.stopPropagation();
                return true;
            }
            return _super.prototype.onEnter.call(this, tree, event);
        };
        Controller.prototype.onSpace = function (tree, event) {
            var focus = tree.getFocus();
            if (!focus) {
                event.preventDefault();
                event.stopPropagation();
                return true;
            }
            if (!this.canSelect(tree, focus)) {
                return false;
            }
            tree.toggleSelection(focus, { origin: 'keyboard', originalEvent: event });
            event.preventDefault();
            event.stopPropagation();
            return true;
        };
        Controller.prototype.onContextMenu = function (tree, element, event) {
            var _this = this;
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
                return false;
            }
            event.preventDefault();
            event.stopPropagation();
            tree.setFocus(element);
            if (this.actionProvider.hasSecondaryActions(tree, element)) {
                var anchor = { x: event.posx + 1, y: event.posy };
                var context = {
                    selection: tree.getSelection(),
                    focus: element
                };
                this.contextMenuService.showContextMenu({
                    getAnchor: function () { return anchor; },
                    getActions: function () { return _this.actionProvider.getSecondaryActions(tree, element); },
                    getActionItem: this.actionProvider.getActionItem.bind(this.actionProvider, tree, element),
                    getActionsContext: function () { return context; },
                    onHide: function (wasCancelled) {
                        if (wasCancelled) {
                            tree.DOMFocus();
                        }
                    }
                });
                return true;
            }
            return false;
        };
        Controller.prototype.onLeft = function (tree, event) {
            return true;
        };
        Controller.prototype.onRight = function (tree, event) {
            return true;
        };
        Controller.prototype.onUp = function (tree, event) {
            var oldFocus = tree.getFocus();
            var base = _super.prototype.onUp.call(this, tree, event);
            if (!base || !event.shiftKey) {
                return false;
            }
            return this.shiftSelect(tree, oldFocus, event);
        };
        Controller.prototype.onPageUp = function (tree, event) {
            var oldFocus = tree.getFocus();
            var base = _super.prototype.onPageUp.call(this, tree, event);
            if (!base || !event.shiftKey) {
                return false;
            }
            return this.shiftSelect(tree, oldFocus, event);
        };
        Controller.prototype.onDown = function (tree, event) {
            var oldFocus = tree.getFocus();
            var base = _super.prototype.onDown.call(this, tree, event);
            if (!base || !event.shiftKey) {
                return false;
            }
            return this.shiftSelect(tree, oldFocus, event);
        };
        Controller.prototype.onPageDown = function (tree, event) {
            var oldFocus = tree.getFocus();
            var base = _super.prototype.onPageDown.call(this, tree, event);
            if (!base || !event.shiftKey) {
                return false;
            }
            return this.shiftSelect(tree, oldFocus, event);
        };
        Controller.prototype.canSelect = function (tree) {
            var elements = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                elements[_i - 1] = arguments[_i];
            }
            if (elements.some(function (e) { return e instanceof gitmodel.StatusGroup || e instanceof gitmodel.StatusModel; })) {
                return false;
            }
            return elements.every(function (e) {
                var first = tree.getSelection()[0];
                var clicked = e;
                return !first || (first.getType() === clicked.getType());
            });
        };
        Controller.prototype.shiftSelect = function (tree, oldFocus, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            var focus = tree.getFocus();
            if (focus === oldFocus) {
                return false;
            }
            var oldFocusIsSelected = tree.isSelected(oldFocus);
            var focusIsSelected = tree.isSelected(focus);
            if (oldFocusIsSelected && focusIsSelected) {
                tree.deselectRange(focus, oldFocus, payload);
            }
            else if (!oldFocusIsSelected && !focusIsSelected) {
                if (this.canSelect(tree, oldFocus, focus)) {
                    tree.selectRange(focus, oldFocus, payload);
                }
            }
            else if (oldFocusIsSelected) {
                if (this.canSelect(tree, focus)) {
                    tree.selectRange(focus, oldFocus, payload);
                }
            }
            else {
                tree.deselectRange(focus, oldFocus, payload);
            }
            return true;
        };
        Controller = __decorate([
            __param(1, contextView_1.IContextMenuService)
        ], Controller);
        return Controller;
    }(treedefaults.DefaultController));
    exports.Controller = Controller;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[41], __M([0,1,27,11,13,6,53,33,16,2,7,54,55,39,56,8,15,44,35,57,58,59,48,61,37,62,46,9,14,12,63,42,64,65,32]), function (require, exports, nls, Platform, Lifecycle, EventEmitter, Strings, Errors, paths, WinJS, Builder, keyboardEvent_1, Actions, ActionBar, TreeImpl, git, GitActions, GitModel, Viewer, GitEditorInputs, Files, output_1, WorkbenchEditorCommon, InputBox, severity_1, editorService_1, contextView_1, instantiation_1, message_1, workspace_1, event_1, keyCodes_1, groupService_1, configuration_1) {
    'use strict';
    var IGitService = git.IGitService;
    var $ = Builder.$;
    var ChangesView = (function (_super) {
        __extends(ChangesView, _super);
        function ChangesView(actionRunner, instantiationService, editorService, editorGroupService, messageService, contextViewService, contextService, gitService, outputService, eventService, configurationService) {
            var _this = this;
            _super.call(this);
            this.configurationService = configurationService;
            this.ID = 'changes';
            this.instantiationService = instantiationService;
            this.editorService = editorService;
            this.messageService = messageService;
            this.contextViewService = contextViewService;
            this.contextService = contextService;
            this.gitService = gitService;
            this.outputService = outputService;
            this.visible = false;
            this.currentDimension = null;
            this.actionRunner = actionRunner;
            this.toDispose = [
                this.smartCommitAction = this.instantiationService.createInstance(GitActions.SmartCommitAction, this),
                editorGroupService.onEditorsChanged(function () { return _this.onEditorsChanged(_this.editorService.getActiveEditorInput()).done(null, Errors.onUnexpectedError); }),
                this.gitService.addListener2(git.ServiceEvents.OPERATION_START, function (e) { return _this.onGitOperationStart(e); }),
                this.gitService.addListener2(git.ServiceEvents.OPERATION_END, function (e) { return _this.onGitOperationEnd(e); }),
                this.gitService.getModel().addListener2(git.ModelEvents.MODEL_UPDATED, this.onGitModelUpdate.bind(this))
            ];
        }
        Object.defineProperty(ChangesView.prototype, "element", {
            // IView
            get: function () {
                this.render();
                return this.$el.getHTMLElement();
            },
            enumerable: true,
            configurable: true
        });
        ChangesView.prototype.render = function () {
            var _this = this;
            if (this.$el) {
                return;
            }
            this.$el = $('.changes-view');
            this.$commitView = $('.commit-view').appendTo(this.$el);
            // Commit view
            this.commitInputBox = new InputBox.InputBox(this.$commitView.getHTMLElement(), this.contextViewService, {
                placeholder: nls.localize(3, null, ChangesView.COMMIT_KEYBINDING),
                validationOptions: {
                    showMessage: true,
                    validation: function (value) {
                        var config = _this.configurationService.getConfiguration('git');
                        if (!config.enableLongCommitWarning) {
                            return null;
                        }
                        if (/^[^\n]{51}/.test(value)) {
                            return {
                                content: ChangesView.LONG_COMMIT,
                                type: InputBox.MessageType.WARNING
                            };
                        }
                        return null;
                    }
                },
                ariaLabel: nls.localize(4, null, ChangesView.COMMIT_KEYBINDING),
                flexibleHeight: true
            });
            this.commitInputBox.onDidChange(function (value) { return _this.emit('change', value); });
            this.commitInputBox.onDidHeightChange(function (value) { return _this.emit('heightchange', value); });
            $(this.commitInputBox.inputElement).on('keydown', function (e) {
                var keyboardEvent = new keyboardEvent_1.StandardKeyboardEvent(e);
                if (keyboardEvent.equals(keyCodes_1.CommonKeybindings.CTRLCMD_ENTER) || keyboardEvent.equals(keyCodes_1.CommonKeybindings.CTRLCMD_S)) {
                    if (_this.smartCommitAction.enabled) {
                        _this.actionRunner.run(_this.smartCommitAction).done();
                    }
                    else {
                        _this.commitInputBox.showMessage({ content: ChangesView.NOTHING_TO_COMMIT, formatContent: true, type: InputBox.MessageType.INFO });
                    }
                }
            }).on('blur', function () {
                _this.commitInputBox.hideMessage();
            });
            // Status view
            this.$statusView = $('.status-view').appendTo(this.$el);
            var actionProvider = this.instantiationService.createInstance(Viewer.ActionProvider);
            var renderer = this.instantiationService.createInstance(Viewer.Renderer, actionProvider, this.actionRunner);
            var dnd = this.instantiationService.createInstance(Viewer.DragAndDrop);
            var controller = this.instantiationService.createInstance(Viewer.Controller, actionProvider);
            this.tree = new TreeImpl.Tree(this.$statusView.getHTMLElement(), {
                dataSource: new Viewer.DataSource(),
                renderer: renderer,
                filter: new Viewer.Filter(),
                sorter: new Viewer.Sorter(),
                accessibilityProvider: new Viewer.AccessibilityProvider(),
                dnd: dnd,
                controller: controller
            }, {
                indentPixels: 0,
                twistiePixels: 20,
                ariaLabel: nls.localize(5, null)
            });
            this.tree.setInput(this.gitService.getModel().getStatus());
            this.tree.expandAll(this.gitService.getModel().getStatus().getGroups());
            this.toDispose.push(this.tree.addListener2('selection', function (e) { return _this.onSelection(e); }));
            this.toDispose.push(this.commitInputBox.onDidHeightChange(function () { return _this.layout(); }));
        };
        ChangesView.prototype.focus = function () {
            var selection = this.tree.getSelection();
            if (selection.length > 0) {
                this.tree.reveal(selection[0], 0.5).done(null, Errors.onUnexpectedError);
            }
            this.commitInputBox.focus();
        };
        ChangesView.prototype.layout = function (dimension) {
            if (dimension === void 0) { dimension = this.currentDimension; }
            if (!dimension) {
                return;
            }
            this.currentDimension = dimension;
            this.commitInputBox.layout();
            var statusViewHeight = dimension.height - (this.commitInputBox.height + 12 /* margin */);
            this.$statusView.size(dimension.width, statusViewHeight);
            this.tree.layout(statusViewHeight);
            if (this.commitInputBox.height === 134) {
                this.$commitView.addClass('scroll');
            }
            else {
                this.$commitView.removeClass('scroll');
            }
        };
        ChangesView.prototype.setVisible = function (visible) {
            this.visible = visible;
            if (visible) {
                this.tree.onVisible();
                return this.onEditorsChanged(this.editorService.getActiveEditorInput());
            }
            else {
                this.tree.onHidden();
                return WinJS.TPromise.as(null);
            }
        };
        ChangesView.prototype.getControl = function () {
            return this.tree;
        };
        ChangesView.prototype.getActions = function () {
            var _this = this;
            if (!this.actions) {
                this.actions = [
                    this.smartCommitAction,
                    this.instantiationService.createInstance(GitActions.RefreshAction)
                ];
                this.actions.forEach(function (a) { return _this.toDispose.push(a); });
            }
            return this.actions;
        };
        ChangesView.prototype.getSecondaryActions = function () {
            var _this = this;
            if (!this.secondaryActions) {
                this.secondaryActions = [
                    this.instantiationService.createInstance(GitActions.SyncAction, GitActions.SyncAction.ID, GitActions.SyncAction.LABEL),
                    this.instantiationService.createInstance(GitActions.PullAction, GitActions.PullAction.ID, GitActions.PullAction.LABEL),
                    this.instantiationService.createInstance(GitActions.PullWithRebaseAction),
                    this.instantiationService.createInstance(GitActions.PushAction, GitActions.PushAction.ID, GitActions.PushAction.LABEL),
                    new ActionBar.Separator(),
                    this.instantiationService.createInstance(GitActions.PublishAction, GitActions.PublishAction.ID, GitActions.PublishAction.LABEL),
                    new ActionBar.Separator(),
                    this.instantiationService.createInstance(GitActions.CommitAction, this),
                    this.instantiationService.createInstance(GitActions.StageAndCommitAction, this),
                    this.instantiationService.createInstance(GitActions.UndoLastCommitAction, GitActions.UndoLastCommitAction.ID, GitActions.UndoLastCommitAction.LABEL),
                    new ActionBar.Separator(),
                    this.instantiationService.createInstance(GitActions.GlobalUnstageAction),
                    this.instantiationService.createInstance(GitActions.GlobalUndoAction),
                    new ActionBar.Separator(),
                    new Actions.Action('show.gitOutput', nls.localize(6, null), null, true, function () { return _this.outputService.getChannel('Git').show(); })
                ];
                this.secondaryActions.forEach(function (a) { return _this.toDispose.push(a); });
            }
            return this.secondaryActions;
        };
        // ICommitState
        ChangesView.prototype.getCommitMessage = function () {
            return Strings.trim(this.commitInputBox.value);
        };
        ChangesView.prototype.onEmptyCommitMessage = function () {
            this.commitInputBox.focus();
            this.commitInputBox.showMessage({ content: ChangesView.NEED_MESSAGE, formatContent: true, type: InputBox.MessageType.INFO });
        };
        // Events
        ChangesView.prototype.onGitModelUpdate = function () {
            var _this = this;
            if (this.tree) {
                this.tree.refresh().done(function () {
                    return _this.tree.expandAll(_this.gitService.getModel().getStatus().getGroups());
                });
            }
        };
        ChangesView.prototype.onEditorsChanged = function (input) {
            var _this = this;
            if (!this.tree) {
                return WinJS.TPromise.as(null);
            }
            var status = this.getStatusFromInput(input);
            if (!status) {
                this.tree.clearSelection();
            }
            if (this.visible && this.tree.getSelection().indexOf(status) === -1) {
                return this.tree.reveal(status, 0.5).then(function () {
                    _this.tree.setSelection([status], { origin: 'implicit' });
                });
            }
            return WinJS.TPromise.as(null);
        };
        ChangesView.prototype.onSelection = function (e) {
            var _this = this;
            if (e.payload && e.payload && e.payload.origin === 'implicit') {
                return;
            }
            if (e.selection.length !== 1) {
                return;
            }
            var element = e.selection[0];
            if (!(element instanceof GitModel.FileStatus)) {
                return;
            }
            if (e.payload && e.payload.origin === 'keyboard' && !e.payload.originalEvent.equals(keyCodes_1.CommonKeybindings.ENTER)) {
                return;
            }
            var isMouseOrigin = e.payload && (e.payload.origin === 'mouse');
            if (isMouseOrigin && (e.payload.originalEvent.metaKey || e.payload.originalEvent.shiftKey)) {
                return;
            }
            var isDoubleClick = isMouseOrigin && e.payload.originalEvent && e.payload.originalEvent.detail === 2;
            var status = element;
            this.gitService.getInput(status).done(function (input) {
                var options = new WorkbenchEditorCommon.TextDiffEditorOptions();
                if (isMouseOrigin) {
                    options.preserveFocus = true;
                    var originalEvent = e && e.payload && e.payload.origin === 'mouse' && e.payload.originalEvent;
                    if (originalEvent && originalEvent.detail === 2) {
                        options.preserveFocus = false;
                        originalEvent.preventDefault(); // focus moves to editor, we need to prevent default
                    }
                }
                options.forceOpen = true;
                options.pinned = isDoubleClick;
                var sideBySide = (e && e.payload && e.payload.originalEvent && e.payload.originalEvent.altKey);
                return _this.editorService.openEditor(input, options, sideBySide);
            }, function (e) {
                if (e.gitErrorCode === git.GitErrorCodes.CantOpenResource) {
                    _this.messageService.show(severity_1.default.Warning, e);
                    return;
                }
                _this.messageService.show(severity_1.default.Error, e);
            });
        };
        ChangesView.prototype.onGitOperationStart = function (operation) {
            if (operation.id === git.ServiceOperations.COMMIT) {
                if (this.commitInputBox) {
                    this.commitInputBox.disable();
                }
            }
        };
        ChangesView.prototype.onGitOperationEnd = function (e) {
            if (e.operation.id === git.ServiceOperations.COMMIT) {
                if (this.commitInputBox) {
                    this.commitInputBox.enable();
                    if (!e.error) {
                        this.commitInputBox.value = '';
                    }
                }
            }
        };
        // Misc
        ChangesView.prototype.getStatusFromInput = function (input) {
            if (!input) {
                return null;
            }
            if (input instanceof GitEditorInputs.GitDiffEditorInput) {
                return input.getFileStatus();
            }
            if (input instanceof GitEditorInputs.NativeGitIndexStringEditorInput) {
                return input.getFileStatus() || null;
            }
            if (input instanceof Files.FileEditorInput) {
                var fileInput = input;
                var resource = fileInput.getResource();
                var workspaceRoot = this.contextService.getWorkspace().resource.fsPath;
                if (!workspaceRoot || !paths.isEqualOrParent(resource.fsPath, workspaceRoot)) {
                    return null; // out of workspace not yet supported
                }
                var repositoryRoot = this.gitService.getModel().getRepositoryRoot();
                if (!repositoryRoot || !paths.isEqualOrParent(resource.fsPath, repositoryRoot)) {
                    return null; // out of repository not supported
                }
                var repositoryRelativePath = paths.normalize(paths.relative(repositoryRoot, resource.fsPath));
                var status = this.gitService.getModel().getStatus().getWorkingTreeStatus().find(repositoryRelativePath);
                if (status && (status.getStatus() === git.Status.UNTRACKED || status.getStatus() === git.Status.IGNORED)) {
                    return status;
                }
                status = this.gitService.getModel().getStatus().getMergeStatus().find(repositoryRelativePath);
                if (status) {
                    return status;
                }
            }
            return null;
        };
        ChangesView.prototype.dispose = function () {
            if (this.$el) {
                this.$el.dispose();
                this.$el = null;
            }
            this.toDispose = Lifecycle.dispose(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        ChangesView.COMMIT_KEYBINDING = Platform.isMacintosh ? 'Cmd+Enter' : 'Ctrl+Enter';
        ChangesView.NEED_MESSAGE = nls.localize(0, null, ChangesView.COMMIT_KEYBINDING);
        ChangesView.NOTHING_TO_COMMIT = nls.localize(1, null, ChangesView.COMMIT_KEYBINDING);
        ChangesView.LONG_COMMIT = nls.localize(2, null);
        ChangesView = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, message_1.IMessageService),
            __param(5, contextView_1.IContextViewService),
            __param(6, workspace_1.IWorkspaceContextService),
            __param(7, IGitService),
            __param(8, output_1.IOutputService),
            __param(9, event_1.IEventService),
            __param(10, configuration_1.IConfigurationService)
        ], ChangesView);
        return ChangesView;
    }(EventEmitter.EventEmitter));
    exports.ChangesView = ChangesView;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[38], __M([0,1,43,13,6,10,34,2,7,8,15,67,9,14,21]), function (require, exports, nls, Lifecycle, EventEmitter, DOM, button_1, WinJS, Builder, git, GitActions, files_1, instantiation_1, message_1) {
    'use strict';
    var IGitService = git.IGitService;
    var $ = Builder.$;
    var EmptyView = (function (_super) {
        __extends(EmptyView, _super);
        function EmptyView(controller, actionRunner, gitService, instantiationService, messageService, fileService) {
            _super.call(this);
            this.ID = 'empty';
            this.gitService = gitService;
            this.instantiationService = instantiationService;
            this.messageService = messageService;
            this.fileService = fileService;
            this.actionRunner = actionRunner;
            this.isVisible = false;
            this.needsRender = false;
            this.controller = controller;
            this.toDispose = [];
        }
        Object.defineProperty(EmptyView.prototype, "initAction", {
            get: function () {
                if (!this._initAction) {
                    this._initAction = this.instantiationService.createInstance(GitActions.InitAction);
                }
                return this._initAction;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmptyView.prototype, "element", {
            // IView
            get: function () {
                this.render();
                return this.$el.getHTMLElement();
            },
            enumerable: true,
            configurable: true
        });
        EmptyView.prototype.render = function () {
            var _this = this;
            if (this.$el) {
                return;
            }
            this.$el = $('.empty-view');
            $('p').appendTo(this.$el).text(EmptyView.EMPTY_MESSAGE);
            var initSection = $('.section').appendTo(this.$el);
            this.initButton = new button_1.Button(initSection);
            this.initButton.label = nls.localize(1, null);
            this.initButton.addListener2('click', function (e) {
                DOM.EventHelper.stop(e);
                _this.disableUI();
                _this.actionRunner.run(_this.initAction).done(function () {
                    _this.enableUI();
                });
            });
            this.toDispose.push(this.gitService.addListener2(git.ServiceEvents.OPERATION, function () { return _this.onGitOperation(); }));
        };
        EmptyView.prototype.disableUI = function () {
            if (this.urlInputBox) {
                this.urlInputBox.disable();
            }
            if (this.cloneButton) {
                this.cloneButton.enabled = false;
            }
            this.initButton.enabled = false;
        };
        EmptyView.prototype.enableUI = function () {
            if (this.gitService.getRunningOperations().length > 0) {
                return;
            }
            if (this.urlInputBox) {
                this.urlInputBox.enable();
                this.urlInputBox.validate();
            }
            this.initButton.enabled = true;
        };
        EmptyView.prototype.focus = function () {
            // no-op
        };
        EmptyView.prototype.layout = function (dimension) {
            // no-op
        };
        EmptyView.prototype.setVisible = function (visible) {
            this.isVisible = visible;
            return WinJS.TPromise.as(null);
        };
        EmptyView.prototype.getControl = function () {
            return null;
        };
        EmptyView.prototype.getActions = function () {
            return this.refreshAction ? [this.refreshAction] : [];
        };
        EmptyView.prototype.getSecondaryActions = function () {
            return [];
        };
        // Events
        EmptyView.prototype.onGitOperation = function () {
            if (this.gitService.getRunningOperations().length > 0) {
                this.disableUI();
            }
            else {
                this.enableUI();
            }
        };
        EmptyView.prototype.dispose = function () {
            if (this.$el) {
                this.$el.dispose();
                this.$el = null;
            }
            this.toDispose = Lifecycle.dispose(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        EmptyView.EMPTY_MESSAGE = nls.localize(0, null);
        EmptyView = __decorate([
            __param(2, IGitService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, message_1.IMessageService),
            __param(5, files_1.IFileService)
        ], EmptyView);
        return EmptyView;
    }(EventEmitter.EventEmitter));
    exports.EmptyView = EmptyView;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/














define(__m[68], __M([0,1,2,13,69,8,70,41,38,25,28,29,19,30,9,71,72,31]), function (require, exports, winjs, lifecycle, viewlet, git, contrib, changes, empty, gitless, notroot, noworkspace, disabledView_1, hugeView_1, instantiation_1, progress_1, telemetry_1) {
    'use strict';
    var IGitService = git.IGitService;
    var GitViewlet = (function (_super) {
        __extends(GitViewlet, _super);
        function GitViewlet(telemetryService, progressService, instantiationService, gitService) {
            var _this = this;
            _super.call(this, contrib.VIEWLET_ID, telemetryService);
            this.progressService = progressService;
            this.instantiationService = instantiationService;
            this.gitService = gitService;
            this.progressRunner = null;
            this.views = {};
            this.toDispose = [];
            var views = [
                this.instantiationService.createInstance(changes.ChangesView, this.getActionRunner()),
                this.instantiationService.createInstance(empty.EmptyView, this, this.getActionRunner()),
                this.instantiationService.createInstance(gitless.GitlessView),
                new notroot.NotRootView(),
                new noworkspace.NoWorkspaceView(),
                new disabledView_1.DisabledView(),
                this.instantiationService.createInstance(hugeView_1.HugeView)
            ];
            views.forEach(function (v) {
                _this.views[v.ID] = v;
                _this.toDispose.push(v);
            });
            this.toUnbind.push(this.gitService.addBulkListener2(function () { return _this.onGitServiceChanges(); }));
        }
        // GitView.IController
        GitViewlet.prototype.setView = function (id) {
            if (!this.$el) {
                return winjs.TPromise.as(null);
            }
            var view = this.views[id];
            if (!view) {
                return winjs.Promise.wrapError(new Error('Could not find view.'));
            }
            if (this.currentView === view) {
                return winjs.TPromise.as(null);
            }
            var promise = winjs.TPromise.as(null);
            if (this.currentView) {
                promise = this.currentView.setVisible(false);
            }
            var element = view.element;
            this.currentView = view;
            this.updateTitleArea();
            var el = this.$el.getHTMLElement();
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            el.appendChild(element);
            view.layout(this.currentDimension);
            return promise.then(function () { return view.setVisible(true); });
        };
        // Viewlet
        GitViewlet.prototype.create = function (parent) {
            _super.prototype.create.call(this, parent);
            this.$el = parent.div().addClass('git-viewlet');
            return winjs.TPromise.as(null);
        };
        GitViewlet.prototype.setVisible = function (visible) {
            var _this = this;
            if (visible) {
                this.onGitServiceChanges();
                this.gitService.status().done();
                return _super.prototype.setVisible.call(this, visible).then(function () {
                    if (_this.currentView) {
                        return _this.currentView.setVisible(visible);
                    }
                });
            }
            else {
                return (this.currentView ? this.currentView.setVisible(visible) : winjs.TPromise.as(null)).then(function () {
                    _super.prototype.setVisible.call(_this, visible);
                });
            }
        };
        GitViewlet.prototype.focus = function () {
            _super.prototype.focus.call(this);
            if (this.currentView) {
                this.currentView.focus();
            }
        };
        GitViewlet.prototype.layout = function (dimension) {
            if (dimension === void 0) { dimension = this.currentDimension; }
            this.currentDimension = dimension;
            if (this.currentView) {
                this.currentView.layout(dimension);
            }
        };
        GitViewlet.prototype.getActions = function () {
            return this.currentView ? this.currentView.getActions() : [];
        };
        GitViewlet.prototype.getSecondaryActions = function () {
            return this.currentView ? this.currentView.getSecondaryActions() : [];
        };
        GitViewlet.prototype.getControl = function () {
            if (!this.currentView) {
                return null;
            }
            return this.currentView.getControl();
        };
        // Event handlers
        GitViewlet.prototype.onGitServiceChanges = function () {
            if (this.progressRunner) {
                this.progressRunner.done();
            }
            if (this.gitService.getState() === git.ServiceState.NoGit) {
                this.setView('gitless');
                this.progressRunner = null;
            }
            else if (this.gitService.getState() === git.ServiceState.Disabled) {
                this.setView('disabled');
                this.progressRunner = null;
            }
            else if (this.gitService.getState() === git.ServiceState.NotARepo) {
                this.setView('empty');
                this.progressRunner = null;
            }
            else if (this.gitService.getState() === git.ServiceState.NotAWorkspace) {
                this.setView('noworkspace');
                this.progressRunner = null;
            }
            else if (this.gitService.getState() === git.ServiceState.NotAtRepoRoot) {
                this.setView('notroot');
                this.progressRunner = null;
            }
            else if (this.gitService.getState() === git.ServiceState.Huge) {
                this.setView('huge');
                this.progressRunner = null;
            }
            else if (this.gitService.isIdle()) {
                this.setView('changes');
                this.progressRunner = null;
            }
            else {
                this.progressRunner = this.progressService.show(true);
            }
        };
        GitViewlet.prototype.dispose = function () {
            this.toDispose = lifecycle.dispose(this.toDispose);
            this.views = null;
            _super.prototype.dispose.call(this);
        };
        GitViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, progress_1.IProgressService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, IGitService)
        ], GitViewlet);
        return GitViewlet;
    }(viewlet.Viewlet));
    exports.GitViewlet = GitViewlet;
});

}).call(this);
//# sourceMappingURL=gitViewlet.js.map
