import { GraphQLError } from "graphql";

type JsonSchema = {
  [key: string]: any;
};

type Schema = {
  idl: string;
  json: JsonSchema;
};

type Validate = (query: ReadonlyArray<string> | Readonly<string>) => ReadonlyArray<GraphQLError>;

export const schema: Schema
export const validate: Validate

export type * from './schema.d.ts'
