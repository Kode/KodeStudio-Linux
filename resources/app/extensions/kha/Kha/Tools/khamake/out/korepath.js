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
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ebff2335d0f58a5b01ac50cb66737f4694ec73f3/extensions/kha/Kha/Tools/khamake/out/korepath.js.map
