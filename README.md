# graphql-schema

> GitHub’s GraphQL Schema with validation. Automatically updated.

[![Build Status](https://travis-ci.org/octokit/graphql-schema.svg?branch=master)](https://travis-ci.org/octokit/graphql-schema)
[![Greenkeeper badge](https://badges.greenkeeper.io/octokit/graphql-schema.svg)](https://greenkeeper.io/)

## Usage

```js
const {validate} = require('@octokit/graphql-schema')
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
const {schema} = require('@octokit/graphql-schema')
schema.json // JSON version
schema.idl // IDL version
```

## Local setup

```
git clone https://github.com/octokit/graphql-schema.git
cd graphql-schema
npm install
npm test
```

Update schema files (`GH_TOKEN` requires no scope)

```
GH_TOKEN=... bin/download.js
```

Create pull request (after schema files changed). This script is run daily on Travis CI. The token requires `public_repo` scope.

```
GH_TOKEN=... TRAVIS_REPO_SLUG=octokit/graphql-schema bin/create-pull-request.js
```

## See also

- [octokit/routes](https://github.com/octokit/routes) – GitHub REST API route specifications
- [octokit/webhooks](https://github.com/octokit/webhooks) – GitHub Webhooks specifications

## LICENSE

[MIT](LICENSE.md)
