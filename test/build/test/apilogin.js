"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const ChaiAsPromised = require("chai-as-promised");
require("mocha");
const index_1 = require("../lib/index");
chai.use(ChaiAsPromised);
chai.should();
describe("Login", function () {
    it("should fail a request with a bad key", function () {
        const inst = new index_1.Front("badkey");
        return inst.inbox
            .list()
            .then(function (_) {
            throw new Error("Should not have made request correctly!");
        })
            .catch((err) => {
            err.name.should.eq("FrontError");
            err.status.should.eq(401);
            err.title.should.eq("Unauthenticated");
        });
    });
});
