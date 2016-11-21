"use strict";
const path = require('path');
const Html5Exporter_1 = require('./Html5Exporter');
class NodeExporter extends Html5Exporter_1.Html5Exporter {
    constructor(options) {
        super(options);
        this.removeSourceDirectory(path.join(options.kha, 'Backends', 'HTML5'));
        this.addSourceDirectory(path.join(options.kha, 'Backends', 'Node'));
    }
    sysdir() {
        return 'node';
    }
}
exports.NodeExporter = NodeExporter;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/7a90c381174c91af50b0a65fc8c20d61bb4f1be5/extensions/kha/Kha/Tools/khamake/out/Exporters/NodeExporter.js.map
