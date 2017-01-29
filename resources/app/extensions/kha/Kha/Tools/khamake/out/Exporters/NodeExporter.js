"use strict";
const path = require('path');
const Html5Exporter_1 = require('./Html5Exporter');
class NodeExporter extends Html5Exporter_1.Html5Exporter {
    constructor(options) {
        super(options);
        this.removeSourceDirectory(path.join(options.kha, 'Backends', 'HTML5'));
        this.addSourceDirectory(path.join(options.kha, 'Backends', 'Node'));
    }
}
exports.NodeExporter = NodeExporter;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ebff2335d0f58a5b01ac50cb66737f4694ec73f3/extensions/kha/Kha/Tools/khamake/out/Exporters/NodeExporter.js.map
