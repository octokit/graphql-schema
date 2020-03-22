module.exports = validateQuery;

const graphql = require("graphql");
const gql = require("graphql-tag");

const schema = graphql.buildClientSchema(require("../schema.json"));

function validateQuery(query) {
  return graphql.validate(schema, gql(query));
}
