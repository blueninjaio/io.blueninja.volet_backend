/* eslint-disable */
require('../app')
const chai = require('chai')
const chance = require('chance').Chance();

const app = require('../../app')
const Merchant = require('../../lib/models/merchant')
const Admin = require('../../lib/models/admin')

chai.should()

const mainAdmin = {
  email: 'ken@blueninja.io',
  password: 'kenyapblueninja',
}

const mainMerchant = {
  email: 'ken@blueninja.io',
  password: 'kenyapblueninja',
}

const merchantLogin = async () => {
  const merchant = await Merchant.findOne({ email: mainMerchant.email })
  const { body: { token } } = await chai.request(app)
    .post('/api/merchants/login')
    .send({ login_input: mainMerchant.email, password: mainMerchant.password })

  return token
}

const adminLogin = async () => {
  const admin = await Admin.findOne({ email: mainAdmin.email })
  const { body: { token } } = await chai.request(app)
    .post('/api/admin/login')
    .send({ email: admin.email, password: mainAdmin.password })

  return token
}

describe('#Merchant Routes', () => {
  before(async () => {
    for(let i = 0; i < 10; i++) {
      const bank = new Merchant({
        ...chai.create('merchant'),
      })
      await bank.save()
    }
    await new Merchant({
      ...mainMerchant,
    }).save()
  })

  describe('#GET /api/merchants/', () => {
    it ('should retrieve all merchants', async () => {
      const adminToken = await adminLogin()

      const { body: response } = await chai.request(app)
        .get('/api/merchants/')
        .set('Authorization', `Bearer ${adminToken}`)

      response.merchants.should.not.be.equal(null)
      response.merchants.should.have.length.above(1)
    })
  })

  describe('#POST /api/merchants/login', () => {
    it ('should login the merchant', async () => {
      const { body: response } = await chai.request(app)
        .post('/api/merchants/login')
        .send({ login_input: mainMerchant.email, password: mainMerchant.password })

      response.token.should.not.be.equal(null)
      response.merchant.should.not.be.equal(null)
    })
  })

  describe('#POST /api/merchants/me', () => {
    it ('should get current merchant login information', async () => {
      const merchantToken = await merchantLogin()

      const { body: response } = await chai.request(app)
        .post('/api/merchants/me')
        .set('Authorization', `Bearer ${merchantToken}`)

      response.merchant.should.not.be.equal(null)
    })
  })

  describe('#POST /api/merchants/edit', () => {
    it ('should get merchant by id using admin creds', async () => {
      const { _id } = await Merchant.findOne({ email: mainMerchant.email })
      const adminToken = await adminLogin()

      const { body: response } = await chai.request(app)
        .post(`/api/merchants/${_id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      response.merchant.email.should.be.equal(mainMerchant.email)
    })
  })
})
