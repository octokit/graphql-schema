# github-graphql-schema

> GitHub’s GraphQL Schema with validation. Automatically updated.

## Usage

```js
const {validate} = require('@gr2m/github-graphql-schema')
const errors = validate(`
{
  viewer {
    login
  }
}
`)

// errors is array. Contains errors if any
```

You can also load the current Schema directly as JSON or [IDL](https://en.wikipedia.org/wiki/Interface_description_language).

```js
const {schema} = require('@gr2m/github-graphql-schema')
schem.json // JSON version
schem.idl // IDL version
```

## Local setup

```
git clone https://github.com/gr2m/github-graphql-schema.git
cd github-graphql-schema
npm install
npm test
```

Update schema files (`GH_TOKEN` requires no scope)

```
GH_TOKEN=... bin/download.js
```

Create pull request (after schema files changed). This script is run daily on Travis CI. The token requires `public_repo` scope.

```
GH_TOKEN=... TRAVIS_REPO_SLUG=gr2m/github-graphql-schema bin/create-pull-request.js
```

## LICENSE

[MIT](LICENSE.md)
