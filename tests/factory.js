const chai = require('chai')
const factories = require('chai-factories')
const Chance = require('chance')

const chance = new Chance()
chai.use(factories)

// declaring a mock user
chai.factory('admin', {
  email: chance.email(),
  password: chance.word({ length: 10 }),
})

chai.factory('merchant', {
  contact: chance.word({ length: 10 }),
  f_name: chance.first(),
  l_name: chance.last(),
  email: chance.email(),
  password: chance.word({ length: 10 }),
  photo_url: chance.url({path: 'images'}),
  address: chance.address(),
  push_token: chance.word({ length: 20 }),
  credits: 0,
})
