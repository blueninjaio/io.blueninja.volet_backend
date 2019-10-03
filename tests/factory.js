const chai = require('chai');
const factories = require('chai-factories');
const Chance = require('chance');

const chance = new Chance();
chai.use(factories);

// declaring a mock user
chai.factory('admin', {
  email: chance.email(),
  password: chance.word({ length: 10 }),
});

chai.factory('merchant', {
  contact: chance.name(),
  f_name: chance.first(),
  l_name: chance.last(),
  email: chance.email(),
  password: chance.word({ length: 10 }),
  photo_url: chance.url({ path: 'images' }),
  address: chance.address(),
  push_token: chance.word({ length: 20 }),
  credits: 0,
});

chai.factory('user', {
  contact: chance.name(),
  email: chance.email(),
  facebook_id: chance.word({ length: 25 }),
  google_id: chance.word({ length: 25 }),
  password: chance.word({ length: 10 }),
  f_name: chance.first(),
  l_name: chance.last(),
  photo_url: chance.url({ path: 'images' }),
  address: chance.address(),
  push_token: chance.word({ length : 20 }),
  credits: 0,
  savings_active: false,
  monthly_savings: 0,
  bank_accounts: [],
  cards: [],
  gps_coordinates: chance.coordinates(),
  is_agent: false,
  agent_applied: false,
  is_visible: true,
});

chai.factory('bank', {
  name: chance.name(),
  description: chance.word({ length: 120 }),
  isActive: chance.bool({ likelihood: 50 }),
});
