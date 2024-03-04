export default validateQuery;

import { buildClientSchema, validate } from "graphql"
import gql from "graphql-tag"

const schema = buildClientSchema(require("../schema.json"));

function validateQuery(query) {
  return validate(schema, gql(query));
}
