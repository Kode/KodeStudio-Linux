/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/browser', 'vs/base/common/types', 'vs/base/common/eventEmitter', 'vs/base/browser/mouseEvent', 'vs/base/browser/keyboardEvent', 'vs/base/common/errors', 'vs/base/browser/browserService'], function (require, exports, Browser, Types, Emitter, mouseEvent, keyboardEvent, errors, browserService) {
    function clearNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    exports.clearNode = clearNode;
    /**
     * Calls JSON.Stringify with a replacer to break apart any circular references.
     * This prevents JSON.stringify from throwing the exception
     *  "Uncaught TypeError: Converting circular structure to JSON"
     */
    function safeStringifyDOMAware(obj) {
        var seen = [];
        return JSON.stringify(obj, function (key, value) {
            // HTML elements are never going to serialize nicely
            if (value instanceof Element) {
                return '[Element]';
            }
            if (Types.isObject(value) || Array.isArray(value)) {
                if (seen.indexOf(value) !== -1) {
                    return '[Circular]';
                }
                else {
                    seen.push(value);
                }
            }
            return value;
        });
    }
    exports.safeStringifyDOMAware = safeStringifyDOMAware;
    function isInDOM(node) {
        while (node) {
            if (node === document.body) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    exports.isInDOM = isInDOM;
    var _blank = ' '.charCodeAt(0);
    var lastStart, lastEnd;
    function _findClassName(node, className) {
        var classes = node.className;
        if (!classes) {
            lastStart = -1;
            return;
        }
        className = className.trim();
        var classesLen = classes.length, classLen = className.length;
        if (classLen === 0) {
            lastStart = -1;
            return;
        }
        if (classesLen < classLen) {
            lastStart = -1;
            return;
        }
        if (classes === className) {
            lastStart = 0;
            lastEnd = classesLen;
            return;
        }
        var idx = -1, idxEnd;
        while ((idx = classes.indexOf(className, idx + 1)) >= 0) {
            idxEnd = idx + classLen;
            // a class that is followed by another class
            if ((idx === 0 || classes.charCodeAt(idx - 1) === _blank) && classes.charCodeAt(idxEnd) === _blank) {
                lastStart = idx;
                lastEnd = idxEnd + 1;
                return;
            }
            // last class
            if (idx > 0 && classes.charCodeAt(idx - 1) === _blank && idxEnd === classesLen) {
                lastStart = idx - 1;
                lastEnd = idxEnd;
                return;
            }
            // equal - duplicate of cmp above
            if (idx === 0 && idxEnd === classesLen) {
                lastStart = 0;
                lastEnd = idxEnd;
                return;
            }
        }
        lastStart = -1;
    }
    /**
     * @param node a dom node
     * @param className a class name
     * @return true if the className attribute of the provided node contains the provided className
     */
    function hasClass(node, className) {
        _findClassName(node, className);
        return lastStart !== -1;
    }
    exports.hasClass = hasClass;
    /**
     * Adds the provided className to the provided node. This is a no-op
     * if the class is already set.
     * @param node a dom node
     * @param className a class name
     */
    function addClass(node, className) {
        if (!node.className) {
            node.className = className;
        }
        else {
            _findClassName(node, className); // see if it's already there
            if (lastStart === -1) {
                node.className = node.className + ' ' + className;
            }
        }
    }
    exports.addClass = addClass;
    /**
     * Removes the className for the provided node. This is a no-op
     * if the class isn't present.
     * @param node a dom node
     * @param className a class name
     */
    function removeClass(node, className) {
        _findClassName(node, className);
        if (lastStart === -1) {
            return; // Prevent styles invalidation if not necessary
        }
        else {
            node.className = node.className.substring(0, lastStart) + node.className.substring(lastEnd);
        }
    }
    exports.removeClass = removeClass;
    /**
     * @param node a dom node
     * @param className a class name
     * @param shouldHaveIt
     */
    function toggleClass(node, className, shouldHaveIt) {
        _findClassName(node, className);
        if (lastStart !== -1 && !shouldHaveIt) {
            removeClass(node, className);
        }
        if (lastStart === -1 && shouldHaveIt) {
            addClass(node, className);
        }
    }
    exports.toggleClass = toggleClass;
    exports.StyleMutator = {
        setMaxWidth: function (domNode, maxWidth) {
            var desiredValue = maxWidth + 'px';
            if (domNode.style.maxWidth !== desiredValue) {
                domNode.style.maxWidth = desiredValue;
            }
        },
        setWidth: function (domNode, width) {
            var desiredValue = width + 'px';
            if (domNode.style.width !== desiredValue) {
                domNode.style.width = desiredValue;
            }
        },
        setHeight: function (domNode, height) {
            var desiredValue = height + 'px';
            if (domNode.style.height !== desiredValue) {
                domNode.style.height = desiredValue;
            }
        },
        setTop: function (domNode, top) {
            var desiredValue = top + 'px';
            if (domNode.style.top !== desiredValue) {
                domNode.style.top = desiredValue;
            }
        },
        setLeft: function (domNode, left) {
            var desiredValue = left + 'px';
            if (domNode.style.left !== desiredValue) {
                domNode.style.left = desiredValue;
            }
        },
        setBottom: function (domNode, bottom) {
            var desiredValue = bottom + 'px';
            if (domNode.style.bottom !== desiredValue) {
                domNode.style.bottom = desiredValue;
            }
        },
        setRight: function (domNode, right) {
            var desiredValue = right + 'px';
            if (domNode.style.right !== desiredValue) {
                domNode.style.right = desiredValue;
            }
        },
        setFontSize: function (domNode, fontSize) {
            var desiredValue = fontSize + 'px';
            if (domNode.style.fontSize !== desiredValue) {
                domNode.style.fontSize = desiredValue;
            }
        },
        setLineHeight: function (domNode, lineHeight) {
            var desiredValue = lineHeight + 'px';
            if (domNode.style.lineHeight !== desiredValue) {
                domNode.style.lineHeight = desiredValue;
            }
        },
        setTransform: null,
        setDisplay: function (domNode, desiredValue) {
            if (domNode.style.display !== desiredValue) {
                domNode.style.display = desiredValue;
            }
        },
        setVisibility: function (domNode, desiredValue) {
            if (domNode.style.visibility !== desiredValue) {
                domNode.style.visibility = desiredValue;
            }
        },
    };
    // Define setTransform
    function setWebkitTransform(domNode, desiredValue) {
        if (domNode.getAttribute('data-transform') !== desiredValue) {
            domNode.setAttribute('data-transform', desiredValue);
            domNode.style.webkitTransform = desiredValue;
        }
    }
    function setTransform(domNode, desiredValue) {
        if (domNode.getAttribute('data-transform') !== desiredValue) {
            domNode.setAttribute('data-transform', desiredValue);
            domNode.style.transform = desiredValue;
        }
    }
    (function () {
        var testDomNode = document.createElement('div');
        if (typeof testDomNode.style.webkitTransform !== 'undefined') {
            exports.StyleMutator.setTransform = setWebkitTransform;
        }
        else {
            exports.StyleMutator.setTransform = setTransform;
        }
    })();
    function addListener(node, type, handler, useCapture) {
        var wrapHandler = function (e) {
            e = e || window.event;
            handler(e);
        };
        if (Types.isFunction(node.addEventListener)) {
            node.addEventListener(type, wrapHandler, useCapture || false);
            return function () {
                if (!wrapHandler) {
                    // Already removed
                    return;
                }
                node.removeEventListener(type, wrapHandler, useCapture || false);
                // Prevent leakers from holding on to the dom node or handler func
                wrapHandler = null;
                node = null;
                handler = null;
            };
        }
        node.attachEvent('on' + type, wrapHandler);
        return function () { node.detachEvent('on' + type, wrapHandler); };
    }
    exports.addListener = addListener;
    function addDisposableListener(node, type, handler, useCapture) {
        var dispose = addListener(node, type, handler, useCapture);
        return {
            dispose: dispose
        };
    }
    exports.addDisposableListener = addDisposableListener;
    function _wrapAsStandardMouseEvent(handler) {
        return function (e) {
            return handler(new mouseEvent.StandardMouseEvent(e));
        };
    }
    function _wrapAsStandardKeyboardEvent(handler) {
        return function (e) {
            return handler(new keyboardEvent.StandardKeyboardEvent(e));
        };
    }
    exports.addStandardDisposableListener = function addStandardDisposableListener(node, type, handler, useCapture) {
        var wrapHandler = handler;
        if (type === 'click') {
            wrapHandler = _wrapAsStandardMouseEvent(handler);
        }
        else if (type === 'keydown' || type === 'keypress' || type === 'keyup') {
            wrapHandler = _wrapAsStandardKeyboardEvent(handler);
        }
        node.addEventListener(type, wrapHandler, useCapture || false);
        return {
            dispose: function () {
                if (!wrapHandler) {
                    // Already removed
                    return;
                }
                node.removeEventListener(type, wrapHandler, useCapture || false);
                // Prevent leakers from holding on to the dom node or handler func
                wrapHandler = null;
                node = null;
                handler = null;
            }
        };
    };
    function addNonBubblingMouseOutListener(node, handler) {
        return addListener(node, 'mouseout', function (e) {
            // Mouse out bubbles, so this is an attempt to ignore faux mouse outs coming from children elements
            var toElement = (e.relatedTarget || e.toElement);
            while (toElement && toElement !== node) {
                toElement = toElement.parentNode;
            }
            if (toElement === node) {
                return;
            }
            handler(e);
        });
    }
    exports.addNonBubblingMouseOutListener = addNonBubblingMouseOutListener;
    function addDisposableNonBubblingMouseOutListener(node, handler) {
        var dispose = addNonBubblingMouseOutListener(node, handler);
        return {
            dispose: dispose
        };
    }
    exports.addDisposableNonBubblingMouseOutListener = addDisposableNonBubblingMouseOutListener;
    var _animationFrame = (function () {
        var emulatedRequestAnimationFrame = function (callback) {
            return setTimeout(function () { return callback(new Date().getTime()); }, 0);
        };
        var nativeRequestAnimationFrame = self.requestAnimationFrame
            || self.msRequestAnimationFrame
            || self.webkitRequestAnimationFrame
            || self.mozRequestAnimationFrame
            || self.oRequestAnimationFrame;
        var emulatedCancelAnimationFrame = function (id) { };
        var nativeCancelAnimationFrame = self.cancelAnimationFrame || self.cancelRequestAnimationFrame
            || self.msCancelAnimationFrame || self.msCancelRequestAnimationFrame
            || self.webkitCancelAnimationFrame || self.webkitCancelRequestAnimationFrame
            || self.mozCancelAnimationFrame || self.mozCancelRequestAnimationFrame
            || self.oCancelAnimationFrame || self.oCancelRequestAnimationFrame;
        var isNative = !!nativeRequestAnimationFrame;
        var request = nativeRequestAnimationFrame || emulatedRequestAnimationFrame;
        var cancel = nativeCancelAnimationFrame || nativeCancelAnimationFrame;
        return {
            isNative: isNative,
            request: function (callback) {
                return request(callback);
            },
            cancel: function (id) {
                return cancel(id);
            }
        };
    })();
    var AnimationFrameQueueItem = (function () {
        function AnimationFrameQueueItem(runner, priority) {
            this._runner = runner;
            this.priority = priority;
            this._canceled = false;
        }
        AnimationFrameQueueItem.prototype.dispose = function () {
            this._canceled = true;
        };
        AnimationFrameQueueItem.prototype.execute = function () {
            if (this._canceled) {
                return;
            }
            try {
                this._runner();
            }
            catch (e) {
                errors.onUnexpectedError(e);
            }
        };
        // Sort by priority (largest to lowest)
        AnimationFrameQueueItem.sort = function (a, b) {
            return b.priority - a.priority;
        };
        return AnimationFrameQueueItem;
    })();
    (function () {
        /**
         * The runners scheduled at the next animation frame
         */
        var NEXT_QUEUE = [];
        /**
         * The runners scheduled at the current animation frame
         */
        var CURRENT_QUEUE = null;
        /**
         * A flag to keep track if the native requestAnimationFrame was already called
         */
        var animFrameRequested = false;
        /**
         * A flag to indicate if currently handling a native requestAnimationFrame callback
         */
        var inAnimationFrameRunner = false;
        var animationFrameRunner = function () {
            animFrameRequested = false;
            CURRENT_QUEUE = NEXT_QUEUE;
            NEXT_QUEUE = [];
            inAnimationFrameRunner = true;
            while (CURRENT_QUEUE.length > 0) {
                CURRENT_QUEUE.sort(AnimationFrameQueueItem.sort);
                var top = CURRENT_QUEUE.shift();
                top.execute();
            }
            inAnimationFrameRunner = false;
        };
        exports.scheduleAtNextAnimationFrame = function (runner, priority) {
            if (priority === void 0) { priority = 0; }
            var item = new AnimationFrameQueueItem(runner, priority);
            NEXT_QUEUE.push(item);
            if (!animFrameRequested) {
                animFrameRequested = true;
                // TODO@Alex: also check if it is electron
                if (Browser.isChrome) {
                    var handle;
                    _animationFrame.request(function () {
                        clearTimeout(handle);
                        animationFrameRunner();
                    });
                    // This is a fallback in-case chrome dropped
                    // the request for an animation frame. This
                    // is sick but was spotted in the wild
                    handle = setTimeout(animationFrameRunner, 1000);
                }
                else {
                    _animationFrame.request(animationFrameRunner);
                }
            }
            return item;
        };
        exports.runAtThisOrScheduleAtNextAnimationFrame = function (runner, priority) {
            if (inAnimationFrameRunner) {
                var item = new AnimationFrameQueueItem(runner, priority);
                CURRENT_QUEUE.push(item);
                return item;
            }
            else {
                return exports.scheduleAtNextAnimationFrame(runner, priority);
            }
        };
    })();
    var MINIMUM_TIME_MS = 16;
    var DEFAULT_EVENT_MERGER = function (lastEvent, currentEvent) {
        return currentEvent;
    };
    function timeoutThrottledListener(node, type, handler, eventMerger, minimumTimeMs) {
        if (eventMerger === void 0) { eventMerger = DEFAULT_EVENT_MERGER; }
        if (minimumTimeMs === void 0) { minimumTimeMs = MINIMUM_TIME_MS; }
        var lastEvent = null, lastHandlerTime = 0, timeout = -1;
        function invokeHandler() {
            timeout = -1;
            lastHandlerTime = (new Date()).getTime();
            handler(lastEvent);
            lastEvent = null;
        }
        ;
        var unbinder = addListener(node, type, function (e) {
            lastEvent = eventMerger(lastEvent, e);
            var elapsedTime = (new Date()).getTime() - lastHandlerTime;
            if (elapsedTime >= minimumTimeMs) {
                if (timeout !== -1) {
                    window.clearTimeout(timeout);
                }
                invokeHandler();
            }
            else {
                if (timeout === -1) {
                    timeout = window.setTimeout(invokeHandler, minimumTimeMs - elapsedTime);
                }
            }
        });
        return function () {
            if (timeout !== -1) {
                window.clearTimeout(timeout);
            }
            unbinder();
        };
    }
    function addThrottledListener(node, type, handler, eventMerger, minimumTimeMs) {
        return timeoutThrottledListener(node, type, handler, eventMerger, minimumTimeMs);
    }
    exports.addThrottledListener = addThrottledListener;
    function addDisposableThrottledListener(node, type, handler, eventMerger, minimumTimeMs) {
        var dispose = addThrottledListener(node, type, handler, eventMerger, minimumTimeMs);
        return {
            dispose: dispose
        };
    }
    exports.addDisposableThrottledListener = addDisposableThrottledListener;
    function getComputedStyle(el) {
        return document.defaultView.getComputedStyle(el, null);
    }
    exports.getComputedStyle = getComputedStyle;
    // Adapted from WinJS
    // Converts a CSS positioning string for the specified element to pixels.
    var convertToPixels = (function () {
        var pixelsRE = /^-?\d+(\.\d+)?(px)?$/i;
        var numberRE = /^-?\d+(\.\d+)?/i;
        return function (element, value) {
            return parseFloat(value) || 0;
        };
    })();
    function getDimension(element, cssPropertyName, jsPropertyName) {
        var computedStyle = getComputedStyle(element);
        var value = '0';
        if (computedStyle) {
            if (computedStyle.getPropertyValue) {
                value = computedStyle.getPropertyValue(cssPropertyName);
            }
            else {
                // IE8
                value = computedStyle.getAttribute(jsPropertyName);
            }
        }
        return convertToPixels(element, value);
    }
    var sizeUtils = {
        getBorderLeftWidth: function (element) {
            return getDimension(element, 'border-left-width', 'borderLeftWidth');
        },
        getBorderTopWidth: function (element) {
            return getDimension(element, 'border-top-width', 'borderTopWidth');
        },
        getBorderRightWidth: function (element) {
            return getDimension(element, 'border-right-width', 'borderRightWidth');
        },
        getBorderBottomWidth: function (element) {
            return getDimension(element, 'border-bottom-width', 'borderBottomWidth');
        },
        getPaddingLeft: function (element) {
            return getDimension(element, 'padding-left', 'paddingLeft');
        },
        getPaddingTop: function (element) {
            return getDimension(element, 'padding-top', 'paddingTop');
        },
        getPaddingRight: function (element) {
            return getDimension(element, 'padding-right', 'paddingRight');
        },
        getPaddingBottom: function (element) {
            return getDimension(element, 'padding-bottom', 'paddingBottom');
        },
        getMarginLeft: function (element) {
            return getDimension(element, 'margin-left', 'marginLeft');
        },
        getMarginTop: function (element) {
            return getDimension(element, 'margin-top', 'marginTop');
        },
        getMarginRight: function (element) {
            return getDimension(element, 'margin-right', 'marginRight');
        },
        getMarginBottom: function (element) {
            return getDimension(element, 'margin-bottom', 'marginBottom');
        },
        __commaSentinel: false
    };
    // ----------------------------------------------------------------------------------------
    // Position & Dimension
    function getTopLeftOffset(element) {
        // Adapted from WinJS.Utilities.getPosition
        // and added borders to the mix
        var offsetParent = element.offsetParent, top = element.offsetTop, left = element.offsetLeft;
        while ((element = element.parentNode) !== null && element !== document.body && element !== document.documentElement) {
            top -= element.scrollTop;
            var c = getComputedStyle(element);
            if (c) {
                left -= c.direction !== 'rtl' ? element.scrollLeft : -element.scrollLeft;
            }
            if (element === offsetParent) {
                left += sizeUtils.getBorderLeftWidth(element);
                top += sizeUtils.getBorderTopWidth(element);
                top += element.offsetTop;
                left += element.offsetLeft;
                offsetParent = element.offsetParent;
            }
        }
        return {
            left: left,
            top: top
        };
    }
    exports.getTopLeftOffset = getTopLeftOffset;
    function getDomNodePosition(domNode) {
        var r = getTopLeftOffset(domNode);
        return {
            left: r.left,
            top: r.top,
            width: domNode.clientWidth,
            height: domNode.clientHeight
        };
    }
    exports.getDomNodePosition = getDomNodePosition;
    // Adapted from WinJS
    // Gets the width of the content of the specified element. The content width does not include borders or padding.
    function getContentWidth(element) {
        var border = sizeUtils.getBorderLeftWidth(element) + sizeUtils.getBorderRightWidth(element);
        var padding = sizeUtils.getPaddingLeft(element) + sizeUtils.getPaddingRight(element);
        return element.offsetWidth - border - padding;
    }
    exports.getContentWidth = getContentWidth;
    // Adapted from WinJS
    // Gets the width of the element, including margins.
    function getTotalWidth(element) {
        var margin = sizeUtils.getMarginLeft(element) + sizeUtils.getMarginRight(element);
        return element.offsetWidth + margin;
    }
    exports.getTotalWidth = getTotalWidth;
    // Adapted from WinJS
    // Gets the height of the content of the specified element. The content height does not include borders or padding.
    function getContentHeight(element) {
        var border = sizeUtils.getBorderTopWidth(element) + sizeUtils.getBorderBottomWidth(element);
        var padding = sizeUtils.getPaddingTop(element) + sizeUtils.getPaddingBottom(element);
        return element.offsetHeight - border - padding;
    }
    exports.getContentHeight = getContentHeight;
    // Adapted from WinJS
    // Gets the height of the element, including its margins.
    function getTotalHeight(element) {
        var margin = sizeUtils.getMarginTop(element) + sizeUtils.getMarginBottom(element);
        return element.offsetHeight + margin;
    }
    exports.getTotalHeight = getTotalHeight;
    // Adapted from WinJS
    // Gets the left coordinate of the specified element relative to the specified parent.
    function getRelativeLeft(element, parent) {
        if (element === null) {
            return 0;
        }
        var left = element.offsetLeft;
        var e = element.parentNode;
        while (e !== null) {
            left -= e.offsetLeft;
            if (e === parent) {
                break;
            }
            e = e.parentNode;
        }
        return left;
    }
    exports.getRelativeLeft = getRelativeLeft;
    // Adapted from WinJS
    // Gets the top coordinate of the element relative to the specified parent.
    function getRelativeTop(element, parent) {
        if (element === null) {
            return 0;
        }
        var top = element.offsetTop;
        var e = element.parentNode;
        while (e !== null) {
            top -= e.offsetTop;
            if (e === parent) {
                break;
            }
            e = e.parentNode;
        }
        return top;
    }
    exports.getRelativeTop = getRelativeTop;
    // ----------------------------------------------------------------------------------------
    function isAncestor(testChild, testAncestor) {
        while (testChild) {
            if (testChild === testAncestor) {
                return true;
            }
            testChild = testChild.parentNode;
        }
        return false;
    }
    exports.isAncestor = isAncestor;
    function findParentWithClass(node, clazz, stopAtClazz) {
        while (node) {
            if (hasClass(node, clazz)) {
                return node;
            }
            if (stopAtClazz && hasClass(node, stopAtClazz)) {
                return null;
            }
            node = node.parentNode;
        }
        return null;
    }
    exports.findParentWithClass = findParentWithClass;
    function createStyleSheet() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'screen';
        document.getElementsByTagName('head')[0].appendChild(style);
        return style;
    }
    exports.createStyleSheet = createStyleSheet;
    var sharedStyle = createStyleSheet();
    function getDynamicStyleSheetRules(style) {
        if (style && style.sheet && style.sheet.rules) {
            // Chrome, IE
            return style.sheet.rules;
        }
        if (style && style.sheet && style.sheet.cssRules) {
            // FF
            return style.sheet.cssRules;
        }
        return [];
    }
    function createCSSRule(selector, cssText, style) {
        if (style === void 0) { style = sharedStyle; }
        if (!style || !cssText) {
            return;
        }
        style.sheet.insertRule(selector + '{' + cssText + '}', 0);
    }
    exports.createCSSRule = createCSSRule;
    function getCSSRule(selector, style) {
        if (style === void 0) { style = sharedStyle; }
        if (!style) {
            return null;
        }
        var rules = getDynamicStyleSheetRules(style);
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            var normalizedSelectorText = rule.selectorText.replace(/::/gi, ':');
            if (normalizedSelectorText === selector) {
                return rule;
            }
        }
        return null;
    }
    exports.getCSSRule = getCSSRule;
    function removeCSSRulesWithPrefix(ruleName, style) {
        if (style === void 0) { style = sharedStyle; }
        if (!style) {
            return;
        }
        var rules = getDynamicStyleSheetRules(style);
        var toDelete = [];
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            var normalizedSelectorText = rule.selectorText.replace(/::/gi, ':');
            if (normalizedSelectorText.indexOf(ruleName) === 0) {
                toDelete.push(i);
            }
        }
        for (var i = toDelete.length - 1; i >= 0; i--) {
            style.sheet.deleteRule(toDelete[i]);
        }
    }
    exports.removeCSSRulesWithPrefix = removeCSSRulesWithPrefix;
    function isHTMLElement(o) {
        return browserService.getService().isHTMLElement(o);
    }
    exports.isHTMLElement = isHTMLElement;
    exports.EventType = {
        // Mouse
        CLICK: 'click',
        DBLCLICK: 'dblclick',
        MOUSE_UP: 'mouseup',
        MOUSE_DOWN: 'mousedown',
        MOUSE_OVER: 'mouseover',
        MOUSE_MOVE: 'mousemove',
        MOUSE_OUT: 'mouseout',
        CONTEXT_MENU: 'contextmenu',
        // Keyboard
        KEY_DOWN: 'keydown',
        KEY_PRESS: 'keypress',
        KEY_UP: 'keyup',
        // HTML Document
        LOAD: 'load',
        UNLOAD: 'unload',
        ABORT: 'abort',
        ERROR: 'error',
        RESIZE: 'resize',
        SCROLL: 'scroll',
        // Form
        SELECT: 'select',
        CHANGE: 'change',
        SUBMIT: 'submit',
        RESET: 'reset',
        FOCUS: 'focus',
        BLUR: 'blur',
        INPUT: 'input',
        // Local Storage
        STORAGE: 'storage',
        // Drag
        DRAG_START: 'dragstart',
        DRAG: 'drag',
        DRAG_ENTER: 'dragenter',
        DRAG_LEAVE: 'dragleave',
        DRAG_OVER: 'dragover',
        DROP: 'drop',
        DRAG_END: 'dragend',
        // Animation
        ANIMATION_START: Browser.isWebKit ? 'webkitAnimationStart' : 'animationstart',
        ANIMATION_END: Browser.isWebKit ? 'webkitAnimationEnd' : 'animationend',
        ANIMATION_ITERATION: Browser.isWebKit ? 'webkitAnimationIteration' : 'animationiteration'
    };
    exports.EventHelper = {
        stop: function (e, cancelBubble) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                // IE8
                e.returnValue = false;
            }
            if (cancelBubble) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                else {
                    // IE8
                    e.cancelBubble = true;
                }
            }
        }
    };
    function selectTextInInputElement(textArea) {
        // F12 has detected in their automated tests that selecting throws sometimes,
        // the root cause remains a mistery. Bug #378257 filled against IE.
        try {
            var scrollState = saveParentsScrollTop(textArea);
            textArea.select();
            if (textArea.setSelectionRange) {
                // on iOS Safari, .select() moves caret to the end of the text instead of selecting
                // see http://stackoverflow.com/questions/3272089/programmatically-selecting-text-in-an-input-field-on-ios-devices-mobile-safari
                textArea.setSelectionRange(0, 9999);
            }
            restoreParentsScrollTop(textArea, scrollState);
        }
        catch (e) {
        }
    }
    exports.selectTextInInputElement = selectTextInInputElement;
    function saveParentsScrollTop(node) {
        var r = [];
        for (var i = 0; node && node.nodeType === node.ELEMENT_NODE; i++) {
            r[i] = node.scrollTop;
            node = node.parentNode;
        }
        return r;
    }
    exports.saveParentsScrollTop = saveParentsScrollTop;
    function restoreParentsScrollTop(node, state) {
        for (var i = 0; node && node.nodeType === node.ELEMENT_NODE; i++) {
            if (node.scrollTop !== state[i]) {
                node.scrollTop = state[i];
            }
            node = node.parentNode;
        }
    }
    exports.restoreParentsScrollTop = restoreParentsScrollTop;
    function trackFocus(element) {
        var hasFocus = false, loosingFocus = false;
        var eventEmitter = new Emitter.EventEmitter(), unbind = [], result = null;
        // fill result
        result = {
            addFocusListener: function (fn) {
                var h = eventEmitter.addListener('focus', fn);
                unbind.push(h);
                return h;
            },
            addBlurListener: function (fn) {
                var h = eventEmitter.addListener('blur', fn);
                unbind.push(h);
                return h;
            },
            dispose: function () {
                while (unbind.length > 0) {
                    unbind.pop()();
                }
            }
        };
        var onFocus = function (event) {
            loosingFocus = false;
            if (!hasFocus) {
                hasFocus = true;
                eventEmitter.emit('focus', {});
            }
        };
        var onBlur = function (event) {
            if (hasFocus) {
                loosingFocus = true;
                window.setTimeout(function () {
                    if (loosingFocus) {
                        loosingFocus = false;
                        hasFocus = false;
                        eventEmitter.emit('blur', {});
                    }
                }, 0);
            }
        };
        // bind
        unbind.push(addListener(element, exports.EventType.FOCUS, onFocus, true));
        unbind.push(addListener(element, exports.EventType.BLUR, onBlur, true));
        return result;
    }
    exports.trackFocus = trackFocus;
    function removeScriptTags(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var scripts = div.getElementsByTagName('script');
        var i = scripts.length;
        while (i--) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
        return div.innerHTML;
    }
    exports.removeScriptTags = removeScriptTags;
    ;
    function append(parent, child) {
        parent.appendChild(child);
        return child;
    }
    exports.append = append;
    var SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
    // Similar to builder, but much more lightweight
    function emmet(description) {
        var match = SELECTOR_REGEX.exec(description);
        if (!match) {
            throw new Error('Bad use of emmet');
        }
        var result = document.createElement(match[1] || 'div');
        match[3] && (result.id = match[3]);
        match[4] && (result.className = match[4].replace(/\./g, ' ').trim());
        return result;
    }
    exports.emmet = emmet;
    ;
    function show() {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i - 0] = arguments[_i];
        }
        for (var _a = 0; _a < elements.length; _a++) {
            var element = elements[_a];
            element.style.display = null;
        }
    }
    exports.show = show;
    function hide() {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i - 0] = arguments[_i];
        }
        for (var _a = 0; _a < elements.length; _a++) {
            var element = elements[_a];
            element.style.display = 'none';
        }
    }
    exports.hide = hide;
});
//# sourceMappingURL=dom.js.map