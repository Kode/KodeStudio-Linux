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
define(["require", "exports", 'vs/base/common/strings', 'vs/workbench/parts/files/common/files', 'vs/workbench/browser/parts/editor/baseEditor'], function (require, exports, strings, files_1, baseEditor_1) {
    /**
     * A variant of the editor input action contributor to contribute only to inputs that match a set of given mimes
     * and implement the FileEditorInput API. This is useful to dynamically contribute editor actions to specific
     * file types.
     */
    var FileEditorInputActionContributor = (function (_super) {
        __extends(FileEditorInputActionContributor, _super);
        function FileEditorInputActionContributor(mimes) {
            _super.call(this);
            this.mimes = mimes;
        }
        /* We override toId() to make the caching of actions based on the mime of the input if given */
        FileEditorInputActionContributor.prototype.toId = function (context) {
            var id = _super.prototype.toId.call(this, context);
            var mime = this.getMimeFromContext(context);
            if (mime) {
                id += mime;
            }
            return id;
        };
        FileEditorInputActionContributor.prototype.getMimeFromContext = function (context) {
            if (context && context.input && context.input instanceof files_1.FileEditorInput) {
                var fileInput = context.input;
                return fileInput.getMime();
            }
            return null;
        };
        FileEditorInputActionContributor.prototype.hasMime = function (context) {
            var mime = this.getMimeFromContext(context);
            if (mime) {
                var mimes = mime.split(',');
                for (var i = 0; i < mimes.length; i++) {
                    if (this.mimes.indexOf(strings.trim(mimes[i])) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        };
        FileEditorInputActionContributor.prototype.hasActions = function (context) {
            if (!this.hasMime(context)) {
                return false;
            }
            return _super.prototype.hasActions.call(this, context);
        };
        FileEditorInputActionContributor.prototype.hasSecondaryActions = function (context) {
            if (!this.hasMime(context)) {
                return false;
            }
            return _super.prototype.hasSecondaryActions.call(this, context);
        };
        return FileEditorInputActionContributor;
    })(baseEditor_1.EditorInputActionContributor);
    exports.FileEditorInputActionContributor = FileEditorInputActionContributor;
    /**
     * A lightweight descriptor of an editor for files. Optionally allows to specify a list of mime types the editor
     * should be used for. This allows for fine grained contribution of editors to the Platform based on mime types. Wildcards
     * can be used (e.g. text/*) to register an editor on a wider range of mime types.
     */
    var FileEditorDescriptor = (function (_super) {
        __extends(FileEditorDescriptor, _super);
        function FileEditorDescriptor(id, name, moduleId, ctorName, mimetypes) {
            _super.call(this, id, name, moduleId, ctorName);
            this.mimetypes = mimetypes;
        }
        FileEditorDescriptor.prototype.getMimeTypes = function () {
            return this.mimetypes;
        };
        return FileEditorDescriptor;
    })(baseEditor_1.EditorDescriptor);
    exports.FileEditorDescriptor = FileEditorDescriptor;
});
//# sourceMappingURL=files.js.map