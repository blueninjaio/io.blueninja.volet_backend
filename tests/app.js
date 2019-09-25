/* eslint-disable */
// process.env.DATABASE_URL = 'mongodb+srv://root:123qweasd@cluster0-rbv9n.mongodb.net'
process.env.DATABASE_URL = 'mongodb://localhost:27017'
process.env.DATABASE_NAME = 'volet'
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiThings = require('chai-things')
const mongoose = require('mongoose')

chai.use(chaiThings)
chai.use(chaiHttp)
chai.should()

require('./factory')

console.log('Tests starting...')

before(() => {
  require('../lib/config/db')
})

after(async (done) => {
  console.log('Tests done!')
  done()
})
