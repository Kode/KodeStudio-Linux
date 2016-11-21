"use strict";
const Html5Exporter_1 = require('./Html5Exporter');
class DebugHtml5Exporter extends Html5Exporter_1.Html5Exporter {
    constructor(options) {
        super(options);
    }
    sysdir() {
        return 'debug-html5';
    }
}
exports.DebugHtml5Exporter = DebugHtml5Exporter;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/7a90c381174c91af50b0a65fc8c20d61bb4f1be5/extensions/kha/Kha/Tools/khamake/out/Exporters/DebugHtml5Exporter.js.map
