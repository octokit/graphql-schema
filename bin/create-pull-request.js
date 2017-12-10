#!/usr/bin/env node

const axios = require('axios')
require('dotenv').config()

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

github.get('/user')

.then(response => {
  const login = response.data.login
  console.log(`🤖  Signed in as ${login}. Creating a pull request on ${repoName}`)

  console.log(`🤖  Looking for last commit sha of ${repoName}/git/refs/heads/master`)
  return github.get(`/repos/${repoName}/git/refs/heads/master`)
})

.then(response => {
  const sha = response.data.object.sha

  console.log(`🤖  Creating new branch: ${branchName} using last sha ${sha}`)
  return github.post(`/repos/${repoName}/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha
  })
})

.then(response => {
  console.log(`🤖  Updating schema.graphql`)
  return github.get(`/repos/${repoName}/contents/schema.graphql`)
})

.then(response => {
  const sha = response.data.sha

  return github.put(`/repos/${repoName}/contents/schema.graphql?ref=${branchName}`, {
    path: 'schema.graphql',
    content: Buffer.from(schema.idl).toString('base64'),
    sha: sha,
    message: 'updated schema.graphql'
  })
})

.then(response => {
  console.log(`🤖  Updating schema.json`)
  return github.get(`/repos/${repoName}/contents/schema.json`)
})

.then(response => {
  const sha = response.data.sha

  return github.put(`/repos/${repoName}/contents/schema.json?ref=${branchName}`, {
    path: 'schema.json',
    content: Buffer.from(schema.json).toString('base64'),
    sha: sha,
    message: 'updated schema.json'
  })
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

.catch(console.log)
