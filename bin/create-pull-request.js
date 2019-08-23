#!/usr/bin/env node

const { join: pathJoin } = require('path')
const { readFileSync } = require('fs')

require('dotenv').config()

if (!process.env.TRAVIS_REPO_SLUG) {
  console.log('❌ TRAVIS_REPO_SLUG not set')
  process.exit(1)
}

const repoName = process.env.TRAVIS_REPO_SLUG
const [owner, repo] = repoName.split('/')

const REQUEST_DEFAULTS = {
  headers: {
    authorization: `bearer ${process.env.GH_TOKEN}`
  },
  owner,
  repo
}
const request = require('@octokit/request').request.defaults(REQUEST_DEFAULTS)
const graphql = require('@octokit/graphql').graphql.defaults(REQUEST_DEFAULTS)

const schema = require('..').schema
// NOTE: require('..') does some magic caching that I couldn’t figure out to
//       workaround. When run as part of "npm test", require('../schema.json')
//       returns the old schema, not the updated one. It might be a racing
//       condition with the writeFileSync in download.js ¯\_(ツ)_/¯
schema.json = JSON.parse(readFileSync(pathJoin(__dirname, '..', 'schema.json'), 'utf8'))
const branchName = `cron/fixtures-changes/${new Date().toISOString().substr(0, 10)}`
let lastCommitSha

request('/user')

  .then(response => {
    const login = response.data.login
    console.log(`🤖  Signed in as ${login}. Creating a pull request on ${repoName}`)

    console.log(`🤖  Looking for last commit sha of ${repoName}/git/refs/heads/master`)
    return request('/repos/:owner/:repo/git/refs/heads/master')
  })

  .then(response => {
    lastCommitSha = response.data.object.sha

    console.log(`🤖  Creating new branch: ${branchName} using last sha ${lastCommitSha}`)
    return request('POST /repos/:owner/:repo/git/refs', {
      ref: `refs/heads/${branchName}`,
      sha: lastCommitSha
    })

      .catch(error => {
        // ignore if branch already exists
        if (error.response && error.response.data.message === 'Reference already exists') {
          console.log(`🤖  Branch ${branchName} already exists, moving on.`)
          return
        }

        throw error
      })
  })

  .then(response => {
    console.log('🤖  Getting sha’s for schema.graphql & schema.json')
    const query = `query getShas($owner: String!, $repo: String!) {
      repository(owner:$owner, name:$repo) {
        json: object(expression: "${branchName}:schema.json") {
          ... on Blob {
            oid
          }
        }
        graphql: object(expression: "${branchName}:schema.graphql") {
          ... on Blob {
            oid
          }
        }
      }
    }`

    return graphql(query, {
      owner,
      repo
    })
  })

  .then(response => {
    const graphqlSha = response.repository.graphql.oid
    const jsonSha = response.repository.json.oid
    console.log(`🤖  schema.graphql: ${graphqlSha}`)
    console.log(`🤖  schema.json: ${jsonSha}`)

    console.log('🤖  updating schema.graphql...')
    return request(`PUT /repos/:owner/:repo/contents/schema.graphql?ref=${branchName}`, {
      path: 'schema.graphql',
      content: Buffer.from(schema.idl).toString('base64'),
      sha: graphqlSha,
      message: 'updated schema.graphql',
      branch: branchName
    })

      .then(() => {
        console.log('🤖  schema.graphql updated')
      })

      .then(delayWriteOperiation)

      .then(() => {
        console.log('🤖  updating schema.json...')
        return request(`PUT /repos/:owner/:repo/contents/schema.json?ref=${branchName}`, {
          path: 'schema.json',
          content: Buffer.from(JSON.stringify(schema.json, null, 2)).toString('base64'),
          sha: jsonSha,
          message: 'updated schema.json',
          branch: branchName
        })
      })

      .then(delayWriteOperiation)

      .then(() => {
        console.log('🤖  schema.json updated')
      })
  })

  .then(() => {
    console.log('🤖  creating pull request...')
    return request('POST /repos/:owner/:repo/pulls', {
      title: '🤖🚨  GitHub’s GraphQL Schema changes detected',
      head: branchName,
      base: 'master',
      body: `Dearest humans,

My friend Travis asked me to let you know that they found API changes in their daily routine check.`
    })
  })

  .then(response => {
    console.log(`🤖  Pull request created: ${response.data.html_url}`)
  })

  .catch((error) => {
    if (!error.config) {
      console.log(error)
      process.exit(1)
    }

    console.log(`❌ ${error.config.method.toUpperCase()} ${error.config.url}`)
    console.log(error.message)
    console.log(error.response.data)
    process.exit(1)
  })

// 1s timeout for writing operations
function delayWriteOperiation () {
  return new Promise(resolve => setTimeout(resolve, 1000))
}
