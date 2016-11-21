"use strict";
const path = require('path');
let korepath = path.join(__dirname, '..', '..', '..', 'Kore', 'Tools', 'koremake');
function init(options) {
    korepath = path.join(options.kha, 'Kore', 'Tools', 'koremake');
}
exports.init = init;
function get() {
    return korepath;
}
exports.get = get;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/7a90c381174c91af50b0a65fc8c20d61bb4f1be5/extensions/kha/Kha/Tools/khamake/out/korepath.js.map
