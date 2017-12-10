require('./smoke')
require('./validate')

if (process.env.TRAVIS_EVENT_TYPE === 'cron' &&
    process.env.TRAVIS_JOB_NUMBER &&
    process.env.TRAVIS_JOB_NUMBER.split('.')[1] === '1') {
  console.log('🤖  Looking for schema updates …')
  require('../bin/download')
}
