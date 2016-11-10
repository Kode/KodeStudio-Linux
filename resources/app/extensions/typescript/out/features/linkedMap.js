/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
var LinkedMap = (function () {
    function LinkedMap() {
        this.map = Object.create(null);
        this.head = undefined;
        this.tail = undefined;
        this._length = 0;
    }
    LinkedMap.prototype.isEmpty = function () {
        return !this.head && !this.tail;
    };
    LinkedMap.prototype.length = function () {
        return this._length;
    };
    LinkedMap.prototype.get = function (key) {
        var item = this.map[key];
        if (!item) {
            return undefined;
        }
        return item.value;
    };
    LinkedMap.prototype.add = function (key, value, touch) {
        if (touch === void 0) { touch = false; }
        var item = this.map[key];
        if (item) {
            item.value = value;
            if (touch) {
                this.touch(item);
            }
        }
        else {
            item = { key: key, value: value, next: undefined, previous: undefined };
            if (touch) {
                this.addItemFirst(item);
            }
            else {
                this.addItemLast(item);
            }
            this.map[key] = item;
            this._length++;
        }
    };
    LinkedMap.prototype.remove = function (key) {
        var item = this.map[key];
        if (!item) {
            return undefined;
        }
        delete this.map[key];
        this.removeItem(item);
        this._length--;
        return item.value;
    };
    LinkedMap.prototype.shift = function () {
        if (!this.head && !this.tail) {
            return undefined;
        }
        var item = this.head;
        delete this.map[item.key];
        this.removeItem(item);
        this._length--;
        return item.value;
    };
    LinkedMap.prototype.addItemFirst = function (item) {
        // First time Insert
        if (!this.head && !this.tail) {
            this.tail = item;
        }
        else {
            item.next = this.head;
            this.head.previous = item;
        }
        this.head = item;
    };
    LinkedMap.prototype.addItemLast = function (item) {
        // First time Insert
        if (!this.head && !this.tail) {
            this.head = item;
        }
        else {
            item.previous = this.tail;
            this.tail.next = item;
        }
        this.tail = item;
    };
    LinkedMap.prototype.removeItem = function (item) {
        if (item === this.head && item === this.tail) {
            this.head = undefined;
            this.tail = undefined;
        }
        else if (item === this.head) {
            this.head = item.next;
        }
        else if (item === this.tail) {
            this.tail = item.previous;
        }
        else {
            var next = item.next;
            var previous = item.previous;
            next.previous = previous;
            previous.next = next;
        }
    };
    LinkedMap.prototype.touch = function (item) {
        if (item === this.head) {
            return;
        }
        var next = item.next;
        var previous = item.previous;
        // Unlink the item
        if (item === this.tail) {
            this.tail = previous;
        }
        else {
            // Both next and previous are not null since item was neither head nor tail.
            next.previous = previous;
            previous.next = next;
        }
        // Insert the node at head
        item.previous = undefined;
        item.next = this.head;
        this.head.previous = item;
        this.head = item;
    };
    return LinkedMap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkedMap;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/e0006c407164ee12f30cc86dcc2562a8638862d7/extensions/typescript/out/features/linkedMap.js.map
