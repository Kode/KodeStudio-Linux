/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    var hasDifferentOriginAncestorFlag = false;
    var sameOriginWindowChainCache = null;
    function getParentWindowIfSameOrigin(w) {
        if (!w.parent || w.parent === w) {
            return null;
        }
        // Cannot really tell if we have access to the parent window unless we try to access something in it
        try {
            var location = w.location;
            var parentLocation = w.parent.location;
            if (location.protocol !== parentLocation.protocol || location.hostname !== parentLocation.hostname || location.port !== parentLocation.port) {
                hasDifferentOriginAncestorFlag = true;
                return null;
            }
        }
        catch (e) {
            hasDifferentOriginAncestorFlag = true;
            return null;
        }
        return w.parent;
    }
    function findIframeElementInParentWindow(parentWindow, childWindow) {
        var parentWindowIframes = parentWindow.document.getElementsByTagName('iframe');
        var iframe;
        for (var i = 0, len = parentWindowIframes.length; i < len; i++) {
            iframe = parentWindowIframes[i];
            if (iframe.contentWindow === childWindow) {
                return iframe;
            }
        }
        return null;
    }
    /**
     * Returns a chain of embedded windows with the same origin (which can be accessed programmatically).
     * Having a chain of length 1 might mean that the current execution environment is running outside of an iframe or inside an iframe embedded in a window with a different origin.
     * To distinguish if at one point the current execution environment is running inside a window with a different origin, see hasDifferentOriginAncestor()
     */
    function getSameOriginWindowChain() {
        if (!sameOriginWindowChainCache) {
            sameOriginWindowChainCache = [];
            var w = window, parent;
            do {
                parent = getParentWindowIfSameOrigin(w);
                if (parent) {
                    sameOriginWindowChainCache.push({
                        window: w,
                        iframeElement: findIframeElementInParentWindow(parent, w)
                    });
                }
                else {
                    sameOriginWindowChainCache.push({
                        window: w,
                        iframeElement: null
                    });
                }
                w = parent;
            } while (w);
        }
        return sameOriginWindowChainCache.slice(0);
    }
    exports.getSameOriginWindowChain = getSameOriginWindowChain;
    /**
     * Returns true if the current execution environment is chained in a list of iframes which at one point ends in a window with a different origin.
     * Returns false if the current execution environment is not running inside an iframe or if the entire chain of iframes have the same origin.
     */
    function hasDifferentOriginAncestor() {
        if (!sameOriginWindowChainCache) {
            getSameOriginWindowChain();
        }
        return hasDifferentOriginAncestorFlag;
    }
    exports.hasDifferentOriginAncestor = hasDifferentOriginAncestor;
    /**
     * Returns the position of `childWindow` relative to `ancestorWindow`
     */
    function getPositionOfChildWindowRelativeToAncestorWindow(childWindow, ancestorWindow) {
        if (!ancestorWindow || childWindow === ancestorWindow) {
            return {
                top: 0,
                left: 0
            };
        }
        var top = 0, left = 0;
        var windowChain = getSameOriginWindowChain();
        for (var i = 0; i < windowChain.length; i++) {
            var windowChainEl = windowChain[i];
            if (windowChainEl.window === ancestorWindow) {
                break;
            }
            if (!windowChainEl.iframeElement) {
                break;
            }
            var boundingRect = windowChainEl.iframeElement.getBoundingClientRect();
            top += boundingRect.top;
            left += boundingRect.left;
        }
        return {
            top: top,
            left: left
        };
    }
    exports.getPositionOfChildWindowRelativeToAncestorWindow = getPositionOfChildWindowRelativeToAncestorWindow;
});
//# sourceMappingURL=iframe.js.map