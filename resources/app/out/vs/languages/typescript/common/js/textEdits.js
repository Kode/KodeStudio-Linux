/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/base/common/arrays', 'vs/base/common/strings'], function (require, exports, arrays, strings) {
    var ITextSpan;
    (function (ITextSpan) {
        function contains(span, position) {
            return span.offset <= position && position <= span.offset + span.length;
        }
        ITextSpan.contains = contains;
        function overlaps(a, b) {
            return contains(a, b.offset) || contains(a, b.offset + b.length);
        }
        ITextSpan.overlaps = overlaps;
    })(ITextSpan = exports.ITextSpan || (exports.ITextSpan = {}));
    var TextSpan = (function () {
        function TextSpan(offset, length) {
            this.offset = offset;
            this.length = length;
            // empty
        }
        TextSpan.from = function (span) {
            return new TextSpan(span.offset, span.length);
        };
        Object.defineProperty(TextSpan.prototype, "end", {
            get: function () {
                return this.offset + this.length;
            },
            enumerable: true,
            configurable: true
        });
        TextSpan.prototype.equals = function (other) {
            return this.offset === other.offset && this.length === other.length;
        };
        TextSpan.prototype.contains = function (other) {
            return other.offset >= this.offset && other.offset < this.end && other.offset + other.length <= this.end;
        };
        TextSpan.prototype.overlaps = function (other) {
            return ITextSpan.overlaps(this, other);
        };
        return TextSpan;
    })();
    exports.TextSpan = TextSpan;
    var Edit = (function (_super) {
        __extends(Edit, _super);
        function Edit(offset, length, text) {
            _super.call(this, offset, length);
            this.text = text;
        }
        Object.defineProperty(Edit.prototype, "deltaLength", {
            get: function () {
                return this.text.length - this.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Edit.prototype, "deltaEnd", {
            get: function () {
                return this.end + this.deltaLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Edit.prototype, "deltaSpan", {
            get: function () {
                return new TextSpan(this.offset, this.deltaLength);
            },
            enumerable: true,
            configurable: true
        });
        Edit.prototype.isInsert = function () {
            return this.length === 0 && this.text.length > 0;
        };
        Edit.prototype.equals = function (other) {
            return this.text === other.text && _super.prototype.equals.call(this, other);
        };
        Edit.prototype.toString = function () {
            return strings.format('{0}-{1}/{2}', this.offset, this.length, this.text);
        };
        return Edit;
    })(TextSpan);
    exports.Edit = Edit;
    function compareAscending(a, b) {
        return -compareDecending(a, b);
    }
    exports.compareAscending = compareAscending;
    function compareDecending(a, b) {
        if (a.offset === b.offset) {
            return b.length - a.length;
        }
        return b.offset - a.offset;
    }
    exports.compareDecending = compareDecending;
    // /**
    //  * Inserts at the same offset will be merged into one
    //  * edit.
    //  */
    // function mergeInserts(edits:Edit[]):void {
    // 	var insertsAtOffset:collections.INumberDictionary<Edit> = {};
    // 	arrays.forEach(edits, function(edit, remove) {
    // 		if(edit.length !== 0) {
    // 			return;
    // 		}
    // 		var otherEdit = collections.lookupOrInsert(insertsAtOffset, edit.offset, edit);
    // 		if(otherEdit !== edit) {
    // 			otherEdit.text += edit.text;
    // 			remove();
    // 		}
    // 	});
    // }
    function apply(edits, value) {
        var derived = [];
        var inserts = Object.create(null);
        arrays.forEach(edits, function (edit, rm) {
            if (edit.isInsert()) {
                var other = inserts[edit.offset];
                if (!other) {
                    inserts[edit.offset] = edit;
                    if (edit.origin) {
                        derived.push(edit.deltaSpan);
                        derived.push(edit.origin);
                    }
                }
                else {
                    if (edit.origin) {
                        derived.push(new TextSpan(edit.offset + other.text.length, edit.deltaLength));
                        derived.push(edit.origin);
                    }
                    //TODO@Joh append || prepend text based on prio
                    other.text += edit.text;
                    rm();
                }
            }
        });
        var segements = [], end = value.length, deltas = [], inverse = [], edit;
        // merge inserts at the same offset and sort
        // so that we start with the highest offset
        edits.sort(compareDecending);
        for (var i = 0, len = edits.length; i < len; i++) {
            edit = edits[i];
            segements.push(value.substring(edit.end, end));
            segements.push(edit.text);
            end = edit.offset;
            deltas.push(edit.deltaLength);
            inverse.push(new Edit(edit.offset, edit.text.length, value.substr(edit.offset, edit.length)));
        }
        segements.push(value.substring(0, end));
        // adjust the offset of the inverse operations
        // by the accumlated delta length until them.
        // go backwards because we started with the
        // highest offset
        var delta = 0;
        for (var i = inverse.length - 1; i >= 0; i--) {
            inverse[i].offset += delta;
            delta += deltas[i];
        }
        return {
            value: segements.reverse().join(strings.empty),
            doEdits: edits,
            undoEdits: inverse,
            derived: derived
        };
    }
    exports.apply = apply;
    (function (TranslationBehaviour) {
        TranslationBehaviour[TranslationBehaviour["None"] = 0] = "None";
        TranslationBehaviour[TranslationBehaviour["StickLeft"] = 1] = "StickLeft";
        TranslationBehaviour[TranslationBehaviour["StickRight"] = 2] = "StickRight";
    })(exports.TranslationBehaviour || (exports.TranslationBehaviour = {}));
    var TranslationBehaviour = exports.TranslationBehaviour;
    /**
     * Translates the provided position based on the edits.
     */
    function translate(edits, pos, behaviour) {
        if (typeof behaviour === 'undefined') {
            behaviour = TranslationBehaviour.None;
        }
        edits.sort(compareAscending);
        var delta = 0, edit;
        for (var i = 0, len = edits.length; i < len; i++) {
            edit = edits[i];
            if (edit.end < pos) {
                // before: push out by delta length
                delta += edit.deltaLength;
            }
            else if (edit.offset > pos) {
                // after: ignore and stop
                break;
            }
            else if (edit.offset <= pos && edit.end >= pos) {
                // intersect: remap removed
                if (behaviour === TranslationBehaviour.None) {
                    delta += Math.min(0, edit.offset + (edit.length + edit.deltaLength) - pos);
                }
                else if (behaviour === TranslationBehaviour.StickLeft) {
                    // left: go to the start of the edit
                    delta += edit.offset - pos;
                }
                else if (behaviour === TranslationBehaviour.StickRight) {
                    // right: go to the end of the edit
                    delta += edit.end + edit.deltaLength - pos;
                }
            }
        }
        return pos + delta;
    }
    exports.translate = translate;
});
//# sourceMappingURL=textEdits.js.map