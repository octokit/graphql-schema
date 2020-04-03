const assert = require("assert");

const validate = require("../").validate;

const goodQuery = validate(`
{
  viewer {
    login
  }
}
`);
const badQuery = validate(`
{
  viewer {
    foo
  }
}
`);

assert.strict.equal(
  goodQuery[0],
  undefined,
  "goodQuery validation returns no errors"
);
assert.match(
  badQuery[0].message,
  /Cannot query field "foo" on type "User"/,
  "badQuery validation returns GraphQLError error"
);
