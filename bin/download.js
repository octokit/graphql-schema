#!/usr/bin/env node

const writeFileSync = require('fs').writeFileSync
const gitDiff = require('git-diff')
const axios = require('axios')

require('dotenv').config()

if (!process.env.GH_TOKEN) {
  console.log('GH_TOKEN not set')
  process.exit(1)
}

const oldSchemaIdl = require('../').schema.idl
let newSchema = {
  json: null,
  idl: null
}

console.log('⌛  Loading GitHub GraphQL schema …')
Promise.all([
  axios.get('https://api.github.com/graphql', {
    headers: {
      Authorization: `bearer ${process.env.GH_TOKEN}`
    }
  }),
  axios.get('https://api.github.com/graphql', {
    headers: {
      Accept: 'application/vnd.github.v4.idl',
      Authorization: `bearer ${process.env.GH_TOKEN}`
    }
  })
])

.then(responses => {
  newSchema.json = responses[0].data.data
  newSchema.idl = responses[1].data.data
  const diff = gitDiff(oldSchemaIdl, newSchema.idl)

  if (!diff) {
    console.log(`✅  Schema is up-to-date`)
    return
  }

  writeFileSync('schema.json', JSON.stringify(newSchema.json, null, 2))
  writeFileSync('schema.graphql', newSchema.idl)
  console.log(`📼  New schema recorded`)

  if (process.env.TRAVIS_EVENT_TYPE === 'cron') {
    console.log('🤖  Fixture changes detected in cron job. Creating pull request ...')
    require('./create-pull-request')
  }
})

.catch(console.log)
