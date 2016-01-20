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
define(["require", "exports", 'vs/editor/common/modes/abstractMode', 'vs/editor/common/modes/supports', 'vs/editor/common/modes/monarch/monarchDefinition', 'vs/editor/common/modes/monarch/monarchLexer', 'vs/editor/common/modes/supports/onEnter'], function (require, exports, abstractMode_1, Supports, MonarchDefinition, monarchLexer_1, onEnter_1) {
    /**
     * The MonarchMode creates a Monaco language mode given a certain language description
     */
    var MonarchMode = (function (_super) {
        __extends(MonarchMode, _super);
        function MonarchMode(descriptor, lexer, instantiationService, threadService, modeService, modelService) {
            _super.call(this, descriptor, instantiationService, threadService);
            this.tokenizationSupport = monarchLexer_1.createTokenizationSupport(modeService, this, lexer);
            this.electricCharacterSupport = new Supports.BracketElectricCharacterSupport(this, MonarchDefinition.createBracketElectricCharacterContribution(lexer));
            this.commentsSupport = new Supports.CommentsSupport(MonarchDefinition.createCommentsSupport(lexer));
            this.tokenTypeClassificationSupport = new Supports.TokenTypeClassificationSupport(MonarchDefinition.createTokenTypeClassificationSupportContribution(lexer));
            this.characterPairSupport = new Supports.CharacterPairSupport(this, MonarchDefinition.createCharacterPairContribution(lexer));
            this.suggestSupport = new Supports.ComposableSuggestSupport(this, MonarchDefinition.createSuggestSupport(modelService, this, lexer));
            this.onEnterSupport = new onEnter_1.OnEnterSupport(this.getId(), MonarchDefinition.createOnEnterSupportOptions(lexer));
        }
        return MonarchMode;
    })(abstractMode_1.AbstractMode);
    exports.MonarchMode = MonarchMode;
});
//# sourceMappingURL=monarch.js.map