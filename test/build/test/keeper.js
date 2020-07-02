"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VaultKeeper {
    constructor(varName) {
        this.testKeys = JSON.parse(Buffer.from(varName, 'base64').toString());
    }
    get keys() {
        return this.testKeys;
    }
}
exports.VaultKeeper = VaultKeeper;
const frontTestKeys = process.env.FRONT_TEST_KEYS;
if (!frontTestKeys) {
    throw new Error('Critical environment variable `FRONT_TEST_KEYS` is missing');
}
const keeper = new VaultKeeper(frontTestKeys);
function getKeeper() {
    return keeper;
}
exports.getKeeper = getKeeper;
