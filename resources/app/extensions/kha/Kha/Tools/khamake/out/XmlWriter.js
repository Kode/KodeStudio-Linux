"use strict";
const fs = require('fs-extra');
function printElement(elem, data, indents) {
    for (let i = 0; i < indents; ++i)
        data += '\t';
    if (typeof elem === 'string') {
        data += '<!-- ' + elem + ' -->\n';
        return data;
    }
    data += '<' + elem.n;
    for (let a in elem) {
        if (a === 'n')
            continue;
        if (a === 'e')
            continue;
        data += ' ' + a + '="' + elem[a] + '"';
    }
    if (elem.e === undefined || elem.e.length === 0) {
        data += ' />\n';
    }
    else {
        data += '>\n';
        for (let e of elem.e) {
            data = printElement(e, data, indents + 1);
        }
        for (let i = 0; i < indents; ++i)
            data += '\t';
        data += '</' + elem.n + '>\n';
    }
    return data;
}
function writeXml(xml, path) {
    let data = '';
    data += '<?xml version="1.0" encoding="utf-8"?>\n';
    data += '<' + xml.n;
    for (let a in xml) {
        if (a === 'n')
            continue;
        if (a === 'e')
            continue;
        data += ' ' + a + '="' + xml[a] + '"';
    }
    data += '>\n';
    for (let e of xml.e) {
        data = printElement(e, data, 1);
    }
    data += '</' + xml.n + '>\n';
    fs.outputFileSync(path, data);
}
exports.writeXml = writeXml;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/7a90c381174c91af50b0a65fc8c20d61bb4f1be5/extensions/kha/Kha/Tools/khamake/out/XmlWriter.js.map
