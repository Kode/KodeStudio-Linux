/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var logger = require('../logger');
var utils = require('../utils');
var chromeUtils = require('./chromeUtils');
exports.getChromeTargetWebSocketURL = function (address, port, targetFilter, targetUrl) {
    // Take the custom targetFilter, default to taking all targets
    targetFilter = targetFilter || (function (target) { return true; });
    return _getTargets(address, port, targetFilter).then(function (targets) {
        if (!targets.length) {
            return utils.errP('Got a response from the target app, but no target pages found');
        }
        var target = _selectTarget(targets, targetUrl);
        logger.verbose("Attaching to target: " + JSON.stringify(target));
        var wsUrl = target.webSocketDebuggerUrl;
        logger.verbose("WebSocket Url: " + wsUrl);
        return wsUrl;
    });
};
function _getTargets(address, port, targetFilter) {
    var url = "http://" + address + ":" + port + "/json";
    logger.log("Discovering targets via " + url);
    return utils.getURL(url).then(function (jsonResponse) {
        try {
            var responseArray = JSON.parse(jsonResponse);
            if (Array.isArray(responseArray)) {
                return responseArray
                    .filter(targetFilter);
            }
        }
        catch (e) {
        }
        return utils.errP("Response from the target seems invalid: " + jsonResponse);
    }, function (e) {
        return utils.errP('Cannot connect to the target: ' + e.message);
    });
}
function _selectTarget(targets, targetUrl) {
    if (targetUrl) {
        // If a url was specified, try to filter to that url
        var filteredTargets = chromeUtils.getMatchingTargets(targets, targetUrl);
        if (filteredTargets.length) {
            // If all possible targets appear to be attached to have some other devtool attached, then fail
            var targetsWithWSURLs = filteredTargets.filter(function (target) { return !!target.webSocketDebuggerUrl; });
            if (targetsWithWSURLs.length === 0) {
                throw new Error("Can't attach to this target that may have Chrome DevTools attached - " + filteredTargets[0].url);
            }
            targets = targetsWithWSURLs;
        }
        else {
            throw new Error("Can't find a target that matches: " + targetUrl + ". Available pages: " + JSON.stringify(targets.map(function (target) { return target.url; })));
        }
    }
    if (targets.length > 1) {
        logger.log('Warning: Found more than one valid target page. Attaching to the first one. Available pages: ' + JSON.stringify(targets.map(function (target) { return target.url; })));
    }
    return targets[0];
}
//# sourceMappingURL=chromeTargetDiscoveryStrategy.js.map