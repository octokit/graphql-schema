import { strict, match } from "assert";

import { validate } from "../index.js";

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

strict.equal(goodQuery[0], undefined, "goodQuery validation returns no errors");
match(
  badQuery[0].message,
  /Cannot query field "foo" on type "User"/,
  "badQuery validation returns GraphQLError error",
);
