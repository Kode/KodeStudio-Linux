"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class NestedError extends Error {
    constructor(message, err = null) {
        super(message);
        this.message = message;
        this.err = err;
    }
}
exports.NestedError = NestedError;

//# sourceMappingURL=NestedError.js.map
