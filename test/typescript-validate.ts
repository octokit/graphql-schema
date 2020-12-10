import GraphqlSchema, { PullRequestState, validate, schema } from "..";

export default async function () {
  const query = `
    {
      viewer {
        login
      }
    }
  `;

  /* Testing default import */
  GraphqlSchema.validate(query);

  // Obtains schemas properly
  GraphqlSchema.schema.json;
  GraphqlSchema.schema.idl;

  /* Testing named imports */
  validate(query);

  // Obtains schemas properly
  schema.json;
  schema.idl;
}

const state: PullRequestState = "MERGED";

console.log(state);
