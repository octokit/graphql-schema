#!/usr/bin/env node

const axios = require('axios')
require('dotenv').config()

if (!process.env.TRAVIS_REPO_SLUG) {
  console.log('❌ TRAVIS_REPO_SLUG not set')
  process.exit(1)
}

const repoName = process.env.TRAVIS_REPO_SLUG
const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    common: {
      authorization: `token ${process.env.GH_TOKEN}`
    }
  }
})

const schema = require('..').schema
const branchName = `cron/fixtures-changes/${new Date().toISOString().substr(0, 10)}`
let lastCommitSha

github.get('/user')

.then(response => {
  const login = response.data.login
  console.log(`🤖  Signed in as ${login}. Creating a pull request on ${repoName}`)

  console.log(`🤖  Looking for last commit sha of ${repoName}/git/refs/heads/master`)
  return github.get(`/repos/${repoName}/git/refs/heads/master`)
})

.then(response => {
  lastCommitSha = response.data.object.sha

  console.log(`🤖  Creating new branch: ${branchName} using last sha ${lastCommitSha}`)
  return github.post(`/repos/${repoName}/git/refs`, {
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
  console.log(`🤖  Getting sha’s for schema.graphql & schema.json`)
  const [owner, name] = repoName.split('/')
  return github.post(`/graphql`, {
    query: `{
  repository(owner: "${owner}", name: "${name}") {
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
  })
})

.then(response => {
  const graphqlSha = response.data.data.repository.graphql.oid
  const jsonSha = response.data.data.repository.json.oid

  return Promise.all([
    github.put(`/repos/${repoName}/contents/schema.graphql?ref=${branchName}`, {
      path: 'schema.graphql',
      content: Buffer.from(schema.idl).toString('base64'),
      sha: graphqlSha,
      message: 'updated schema.graphql',
      branch: branchName
    }),
    github.put(`/repos/${repoName}/contents/schema.json?ref=${branchName}`, {
      path: 'schema.json',
      content: Buffer.from(JSON.stringify(schema.json, null, 2)).toString('base64'),
      sha: jsonSha,
      message: 'updated schema.json',
      branch: branchName
    })
  ])
})


.then(response => {
  return github.post(`/repos/${repoName}/pulls`, {
    title: `🤖🚨  GitHub’s GraphQL Schema changes detected`,
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
