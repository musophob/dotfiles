/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
function decorate(decorator) {
    return (target, key, descriptor) => {
        let fnKey = null;
        let fn = null;
        if (typeof descriptor.value === "function") {
            fnKey = "value";
            fn = descriptor.value;
        }
        else if (typeof descriptor.get === "function") {
            fnKey = "get";
            fn = descriptor.get;
        }
        if (!fn || !fnKey) {
            throw new Error("not supported");
        }
        descriptor[fnKey] = decorator(fn, key);
    };
}
function _memoize(fn, key) {
    const memoizeKey = `$memoize$${key}`;
    return function (...args) {
        if (!this.hasOwnProperty(memoizeKey)) {
            Object.defineProperty(this, memoizeKey, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: fn.apply(this, args)
            });
        }
        return this[memoizeKey];
    };
}
exports.memoize = decorate(_memoize);
function _throttle(fn, key) {
    const currentKey = `$throttle$current$${key}`;
    const nextKey = `$throttle$next$${key}`;
    const trigger = function (...args) {
        if (this[nextKey]) {
            return this[nextKey];
        }
        if (this[currentKey]) {
            this[nextKey] = util_1.done(this[currentKey]).then(() => {
                this[nextKey] = undefined;
                return trigger.apply(this, args);
            });
            return this[nextKey];
        }
        this[currentKey] = fn.apply(this, args);
        const clear = () => (this[currentKey] = undefined);
        util_1.done(this[currentKey]).then(clear, clear);
        return this[currentKey];
    };
    return trigger;
}
exports.throttle = decorate(_throttle);
function _sequentialize(fn, key) {
    const currentKey = `__$sequence$${key}`;
    return function (...args) {
        const currentPromise = this[currentKey] || Promise.resolve(null);
        const run = () => __awaiter(this, void 0, void 0, function* () { return fn.apply(this, args); });
        this[currentKey] = currentPromise.then(run, run);
        return this[currentKey];
    };
}
exports.sequentialize = decorate(_sequentialize);
function debounce(delay) {
    return decorate((fn, key) => {
        const timerKey = `$debounce$${key}`;
        return function (...args) {
            clearTimeout(this[timerKey]);
            this[timerKey] = setTimeout(() => fn.apply(this, args), delay);
        };
    });
}
exports.debounce = debounce;
//# sourceMappingURL=decorators.js.map