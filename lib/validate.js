export default validateQuery;

import { readFileSync } from "node:fs";
import { buildClientSchema, validate } from "graphql";
import gql from "graphql-tag";

const schema = buildClientSchema(
  JSON.parse(readFileSync(new URL("../schema.json", import.meta.url), "utf8")),
);

function validateQuery(query) {
  return validate(schema, gql(query));
}
