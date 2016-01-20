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
define(["require", "exports", 'vs/workbench/parts/feedback/browser/feedback', 'vs/platform/contextview/browser/contextView', 'vs/platform/instantiation/common/instantiation', 'electron'], function (require, exports, feedback_1, contextView_1, instantiation_1, electron_1) {
    var TwitterFeedbackService = (function () {
        function TwitterFeedbackService() {
        }
        TwitterFeedbackService.prototype.submitFeedback = function (feedback) {
            var queryString = "?" + (feedback.sentiment === 1 ? 'hashtags=LoveVSCode&' : null) + "ref_src=twsrc%5Etfw&related=twitterapi%2Ctwitter&text=" + feedback.feedback + "&tw_p=tweetbutton&via=code";
            var url = TwitterFeedbackService.TWITTER_URL + queryString;
            electron_1.shell.openExternal(url);
        };
        TwitterFeedbackService.TWITTER_URL = 'https://twitter.com/intent/tweet';
        return TwitterFeedbackService;
    })();
    var FeedbackStatusbarItem = (function () {
        function FeedbackStatusbarItem(instantiationService, contextViewService) {
            this.instantiationService = instantiationService;
            this.contextViewService = contextViewService;
        }
        FeedbackStatusbarItem.prototype.render = function (element) {
            return this.instantiationService.createInstance(feedback_1.FeedbackDropdown, element, {
                contextViewProvider: this.contextViewService,
                feedbackService: this.instantiationService.createInstance(TwitterFeedbackService)
            });
        };
        FeedbackStatusbarItem = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, contextView_1.IContextViewService)
        ], FeedbackStatusbarItem);
        return FeedbackStatusbarItem;
    })();
    exports.FeedbackStatusbarItem = FeedbackStatusbarItem;
});
//# sourceMappingURL=feedbackStatusbarItem.js.map