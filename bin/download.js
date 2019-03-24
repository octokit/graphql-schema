#!/usr/bin/env node

const writeFileSync = require('fs').writeFileSync

require('dotenv').config()

if (!process.env.GH_TOKEN) {
  console.log('GH_TOKEN not set')
  process.exit(1)
}

const execa = require('execa')
const request = require('@octokit/request').defaults({
  headers: {
    authorization: `bearer ${process.env.GH_TOKEN}`
  }
})

const oldSchemaIdl = require('../').schema.idl
let newSchema = {
  json: null,
  idl: null
}

console.log('⌛  Loading GitHub GraphQL JSON schema …')
request('https://api.github.com/graphql')

  .then(response => {
    writeFileSync('schema.json', JSON.stringify(newSchema.json, null, 2))

    console.log('⌛  Loading GitHub GraphQL IDL schema …')
    return request('https://api.github.com/graphql', {
      headers: {
        accept: 'application/vnd.github.v4.idl'
      }
    })
  })

  .then(async response => {
    writeFileSync('schema.graphql', response.data.data)

    const { stdout } = await execa('git', ['status', 'schema.graphql'])
    if (/nothing to commit/.test(stdout)) {
      console.log(`✅  Schema is up-to-date`)
      return
    }

    console.log(`📼  New schema recorded`)

    if (process.env.TRAVIS_EVENT_TYPE === 'cron') {
      console.log('🤖  Fixture changes detected in cron job. Creating pull request ...')
      require('./create-pull-request')
    }
  })
