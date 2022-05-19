# graphql-schema

> GitHub’s GraphQL Schema with validation. Automatically updated.

![Test](https://github.com/zhouzi/graphql-schema/workflows/Test/badge.svg)

## Usage

### Validation

```js
const { validate } = require("github-graphql-schema");
const errors = validate(`
{
  viewer {
    login
  }
}
`);

// errors is array. Contains errors if any
```

You can also load the current Schema directly as JSON or [IDL](https://en.wikipedia.org/wiki/Interface_description_language).

```js
const { schema } = require("github-graphql-schema");
schema.json; // JSON version
schema.idl; // IDL version
```

### Schema as Types

```ts
import { graphql } from "@octokit/graphql";
import { Repository } from "github-graphql-schema";

const { repository } = await graphql<{ repository: Repository }>(
  `
    {
      repository(owner: "octokit", name: "graphql.js") {
        issues(last: 3) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  `,
  {
    headers: {
      authorization: `token secret123`,
    },
  }
);
```

## Local setup

```
git clone https://github.com/zhouzi/graphql-schema.git
cd graphql-schema
npm install
npm test
```

Update schema files (`GITHUB_TOKEN` requires no scope)

```
GITHUB_TOKEN=... npm run update
```

## See also

- [octokit/openapi](https://github.com/octokit/openapi) – GitHub's OpenAPI specification with `x-octokit` extension
- [octokit/webhooks](https://github.com/octokit/webhooks) – GitHub Webhooks specifications
- [octokit/app-permissions](https://github.com/octokit/app-permissions) – GitHub App permission specifications

## LICENSE

[MIT](LICENSE.md)
