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
define(["require", "exports", 'vs/editor/common/model/textModel', 'vs/editor/common/model/editableTextModel', 'vs/editor/common/editorCommon', 'vs/base/common/uri', 'vs/base/common/objects'], function (require, exports, textModel_1, editableTextModel_1, EditorCommon, uri_1, Objects) {
    var MODEL_ID = 0;
    var aliveModels = {};
    // var LAST_CNT = 0;
    // setInterval(() => {
    // 	var cnt = Object.keys(aliveModels).length;
    // 	if (cnt === LAST_CNT) {
    // 		return;
    // 	}
    // 	console.warn('ALIVE MODELS:');
    // 	console.log(Object.keys(aliveModels).join('\n'));
    // 	LAST_CNT = cnt;
    // }, 100);
    var Model = (function (_super) {
        __extends(Model, _super);
        /**
         * Instantiates a new model
         * @param rawText
         *   The raw text buffer. It may start with a UTF-16 BOM, which can be
         *   optionally preserved when doing a getValue call. The lines may be
         *   separated by different EOL combinations, such as \n or \r\n. These
         *   can also be preserved when doing a getValue call.
         * @param mode
         *   The language service name this model is bound to.
         * @param associatedResource
         *   The resource associated with this model. If the value is not provided an
         *   unique in memory URL is constructed as the associated resource.
         */
        function Model(rawText, modeOrPromise, associatedResource) {
            if (associatedResource === void 0) { associatedResource = null; }
            _super.call(this, [
                EditorCommon.EventType.ModelPropertiesChanged,
                EditorCommon.EventType.ModelDispose
            ], textModel_1.TextModel.toRawText(rawText), modeOrPromise);
            // Generate a new unique model id
            MODEL_ID++;
            this.id = '$model' + MODEL_ID;
            if (typeof associatedResource === 'undefined' || associatedResource === null) {
                this._associatedResource = uri_1.default.parse('inmemory://model/' + MODEL_ID);
            }
            else {
                this._associatedResource = associatedResource;
            }
            if (aliveModels[String(this._associatedResource)]) {
                throw new Error('Cannot instantiate a second Model with the same URI!');
            }
            this._extraProperties = {};
            this._attachedEditorCount = 0;
            aliveModels[String(this._associatedResource)] = true;
            // console.log('ALIVE MODELS: ' + Object.keys(aliveModels).join('\n'));
        }
        Model.prototype.getModeId = function () {
            return this.getMode().getId();
        };
        Model.prototype.destroy = function () {
            this.dispose();
        };
        Model.prototype.dispose = function () {
            this._isDisposing = true;
            delete aliveModels[String(this._associatedResource)];
            this.emit(EditorCommon.EventType.ModelDispose);
            _super.prototype.dispose.call(this);
            this._isDisposing = false;
            // console.log('ALIVE MODELS: ' + Object.keys(aliveModels).join('\n'));
        };
        Model.prototype.onBeforeAttached = function () {
            if (this._isDisposed) {
                throw new Error('Model.onBeforeAttached: Model is disposed');
            }
            this._attachedEditorCount++;
            // Warm up tokens for the editor
            this._warmUpTokens();
        };
        Model.prototype.onBeforeDetached = function () {
            if (this._isDisposed) {
                throw new Error('Model.onBeforeDetached: Model is disposed');
            }
            this._attachedEditorCount--;
            // Intentional empty (for now)
        };
        Model.prototype.isAttachedToEditor = function () {
            return this._attachedEditorCount > 0;
        };
        Model.prototype.getAssociatedResource = function () {
            if (this._isDisposed) {
                throw new Error('Model.getAssociatedResource: Model is disposed');
            }
            return this._associatedResource;
        };
        Model.prototype.setProperty = function (name, value) {
            if (this._isDisposed) {
                throw new Error('Model.setProperty: Model is disposed');
            }
            this._extraProperties[name] = value;
            this.emitModelPropertiesChangedEvent();
        };
        Model.prototype.getProperty = function (name) {
            if (this._isDisposed) {
                throw new Error('Model.getProperty: Model is disposed');
            }
            return this._extraProperties.hasOwnProperty(name) ? this._extraProperties[name] : null;
        };
        Model.prototype.getProperties = function () {
            if (this._isDisposed) {
                throw new Error('Model.getProperties: Model is disposed');
            }
            return Objects.clone(this._extraProperties);
        };
        Model.prototype.emitModelPropertiesChangedEvent = function () {
            var e = {
                properties: this._extraProperties
            };
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelPropertiesChanged, e);
            }
        };
        return Model;
    })(editableTextModel_1.EditableTextModel);
    exports.Model = Model;
});
//# sourceMappingURL=model.js.map