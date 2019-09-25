/* eslint-disable */
process.env.DATABASE_URL = '127.0.0.1:27017'
process.env.DATABASE_NAME = 'volet'
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiThings = require('chai-things')
const mongoose = require('mongoose')

chai.use(chaiThings)
chai.use(chaiHttp)
chai.should()

// Clearing DB function for beforeEach on tests
const clearDB = (callback) => {
  console.log('clearing dbs...')
  for (let i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany(() => {})
  }
  return
}

require('./factory')

console.log('Tests starting...')

before(() => {
  require('../lib/config/db')
})

after((done) => {
  clearDB()
  console.log('Tests done!')
  done()
})
