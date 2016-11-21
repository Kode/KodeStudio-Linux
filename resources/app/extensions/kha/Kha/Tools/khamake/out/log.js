"use strict";
let myInfo = function (text) {
    console.log(text);
};
let myError = function (text) {
    console.log(text);
};
function set(log) {
    myInfo = log.info;
    myError = log.error;
}
exports.set = set;
function silent() {
    myInfo = function () { };
    myError = function () { };
}
exports.silent = silent;
function info(text) {
    myInfo(text);
}
exports.info = info;
function error(text) {
    myError(text);
}
exports.error = error;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/7a90c381174c91af50b0a65fc8c20d61bb4f1be5/extensions/kha/Kha/Tools/khamake/out/log.js.map
