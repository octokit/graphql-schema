const assert = require('assert')

const main = require('../')

assert.equal(typeof main.validate, 'function')
assert.equal(typeof main.schema.json, 'object')
assert.equal(typeof main.schema.idl, 'string')
