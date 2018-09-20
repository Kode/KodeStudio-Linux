"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DocumentMergeConflict {
    constructor(descriptor) {
        this.range = descriptor.range;
        this.current = descriptor.current;
        this.incoming = descriptor.incoming;
        this.commonAncestors = descriptor.commonAncestors;
        this.splitter = descriptor.splitter;
    }
    commitEdit(type, editor, edit) {
        if (edit) {
            this.applyEdit(type, editor, edit);
            return Promise.resolve(true);
        }
        return editor.edit((edit) => this.applyEdit(type, editor, edit));
    }
    applyEdit(type, editor, edit) {
        // Each conflict is a set of ranges as follows, note placements or newlines
        // which may not in in spans
        // [ Conflict Range             -- (Entire content below)
        //   [ Current Header ]\n       -- >>>>> Header
        //   [ Current Content ]        -- (content)
        //   [ Splitter ]\n             -- =====
        //   [ Incoming Content ]       -- (content)
        //   [ Incoming Header ]\n      -- <<<<< Incoming
        // ]
        if (type === 0 /* Current */) {
            // Replace [ Conflict Range ] with [ Current Content ]
            let content = editor.document.getText(this.current.content);
            this.replaceRangeWithContent(content, edit);
        }
        else if (type === 1 /* Incoming */) {
            let content = editor.document.getText(this.incoming.content);
            this.replaceRangeWithContent(content, edit);
        }
        else if (type === 2 /* Both */) {
            // Replace [ Conflict Range ] with [ Current Content ] + \n + [ Incoming Content ]
            const currentContent = editor.document.getText(this.current.content);
            const incomingContent = editor.document.getText(this.incoming.content);
            edit.replace(this.range, currentContent.concat(incomingContent));
        }
    }
    replaceRangeWithContent(content, edit) {
        if (this.isNewlineOnly(content)) {
            edit.replace(this.range, '');
            return;
        }
        // Replace [ Conflict Range ] with [ Current Content ]
        edit.replace(this.range, content);
    }
    isNewlineOnly(text) {
        return text === '\n' || text === '\r\n';
    }
}
exports.DocumentMergeConflict = DocumentMergeConflict;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/b4f62a65292c32b44a9c2ab7739390fd05d4df2a/extensions/merge-conflict/out/documentMergeConflict.js.map
