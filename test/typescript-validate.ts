import { PullRequestState, validate, schema } from "../index.js";

export default async function () {
  const query = `
    {
      viewer {
        login
      }
    }
  `;

  /* Testing named imports */
  validate(query);

  // Obtains schemas properly
  schema.json;
  schema.idl;
}

const state: PullRequestState = "MERGED";

console.log(state);
