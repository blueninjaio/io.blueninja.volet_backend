/* eslint-disable */
require('../app')
const chai = require('chai')
const chance = require('chance').Chance();

const app = require('../../app')
const Bank = require('../../lib/models/bank')
const Admin = require('../../lib/models/admin')

chai.should()

const mainAdmin = {
  email: 'ken@blueninja.io',
  password: 'kenyapblueninja',
}

const adminLogin = async () => {
  const admin = await Admin.findOne({ email: mainAdmin.email })
  const { body: { token } } = await chai.request(app)
    .post('/api/admin/login')
    .send({ email: admin.email, password: mainAdmin.password })

  return token
}

describe('#Bank Route', () => {
  // adding admin before being able to do any admin actions
  before(async () => {
    for(let i = 0; i < 10; i++) {
      const bank = new Bank({
        ...chai.create('bank', { name: `Bank-${chance.name()}${i}`, isActive: chance.bool({ likelihood: 50 }) }),
      })
      await bank.save()
    }
    // create main admin
    await new Admin({
      ...mainAdmin,
    }).save()
  })

  describe('#GET /api/bank', () => {
    it ('should login and get all banks', async () => {
      const token = await adminLogin()

      const { body: response } = await chai.request(app)
        .get('/api/bank')
        .set('Authorization', `Bearer ${token}`)

      response.banks.should.have.length.above(1)
      response.should.not.be.equal(null)
    })
  })

  describe('#GET /api/bank/active', () => {
    it ('should login and get all active banks', async () => {
      const token = await adminLogin()

      const { body: response } = await chai.request(app)
        .get('/api/bank/active')
        .set('Authorization', `Bearer ${token}`)

      response.banks.should.have.length.above(1)
      response.should.not.be.equal(null)
    })
  })

  describe('#POST /api/bank', () => {
    it ('should login and create bank', async () => {
      const token = await adminLogin()

      const { status } = await chai.request(app)
        .post('/api/bank')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Ken Yap\'s Bank', description: chance.word({ length: 50 }) })

      status.should.be.equal(200)
    })
  })
})
