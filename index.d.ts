import { GraphQLError } from "graphql";

type JsonSchema = {
  [key: string]: any;
};

type Schema = {
  idl: string;
  json: JsonSchema;
};

declare module "@octokit/graphql-schema" {
  function validate(
    query: ReadonlyArray<string> | Readonly<string>
  ): ReadonlyArray<GraphQLError>;
  var schema: Schema;
}
