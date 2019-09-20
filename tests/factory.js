const chai = require('chai')
const factories = require('chai-factories')
const Chance = require('chance')

const chance = new Chance()
chai.use(factories)

// declaring a mock user
chai.factory('admin', {
  email: `${chance.word({ length: 3 })}.${chance.word({ length: 5 })}@${chance.domain()}`,
  password: chance.word({ length: 10 }),
})
