require('./smoke')
require('./validate')

if (process.env.TRAVIS_EVENT_TYPE === 'cron') {
  console.log('🤖  Looking for schema updates ...')
  require('../bin/download')
}
