const assert = require("assert");

const main = require("../");

assert.strict.equal(typeof main.validate, "function");
assert.strict.equal(typeof main.schema.json, "object");
assert.strict.equal(typeof main.schema.idl, "string");
