/* eslint-disable */
require('../app')
const chai = require('chai')
const chance = require('chance').Chance();

const app = require('../../app')
const User = require('../../lib/models/user')
const Admin = require('../../lib/models/admin')

chai.should()

const mainAdmin = {
  email: 'ken@blueninja.io',
  password: 'kenyapblueninja',
}

const mainUser = {
  email: 'kenyap@blueninja.io',
  password: 'kenyapblueninja',
}

const adminLogin = async () => {
  const admin = await Admin.findOne({ email: mainAdmin.email })
  const { body: { token } } = await chai.request(app)
    .post('/api/admin/login')
    .send({ email: admin.email, password: mainAdmin.password })

  return token
}

const userLogin = async () => {
  const { body: { token } } = await chai.request(app)
    .post('/api/users/login')
    .send({ login_input: mainUser.email, password: mainUser.password })

  return token
}

describe('#User Route', () => {
  before(async () => {
    for(let i = 0; i < 10; i++) {
      const user = new User({
        ...chai.create('user'),
      })
      await user.save()
    }
    await Promise.all([
      new Admin({ ...mainAdmin }).save(),
      new User({ ...mainUser }).save(),
    ])
  })

  describe('#GET /api/users', () => {
    it ('should login as Admin and get all users', async () => {
      const token = await adminLogin()

      const { body: response } = await chai.request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)

      response.users.should.have.length.above(1)
    })
  })

  describe('#POST /api/users/login', () => {
    it ('should login for user', async () => {
      const { body: response } = await chai.request(app)
        .post('/api/users/login')
        .send({ login_input: mainUser.email, password: mainUser.password })

      response.user.should.not.be.equal(null)
    })
  })

  describe('#POST /api/users/me', () => {
    it ('should login and get current user details', async () => {
      const token = await userLogin()
      const { body: response } = await chai.request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)

      response.user.should.not.be.equal(null)
      response.user.email.should.be.equal(mainUser.email)
    })
  })

  describe('#POST /api/users/edit-savings', () => {
    it ('should edit savings for user', async () => {
      const token = await userLogin()
      const savings = {
        active: true,
        amount: 50,
      }
      const { body: response } = await chai.request(app)
        .post('/api/users/edit-savings')
        .set('Authorization', `Bearer ${token}`)
        .send(savings)

      const currentUser = await User.findOne({ email: mainUser.email })
      currentUser.monthly_savings.should.be.equal(savings.amount)
      currentUser.savings_active.should.be.equal(savings.active)
    })
  })

  describe('#POST /api/users/add-bank', () => {
    it ('should add a bank for user', async () => {
      const token = await userLogin()
      await chai.request(app)
        .post('/api/users/add-bank')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Ken Yap\'s Bank', number: '0108954294', bank: 'Ken Yap\'s Bank' })

      const currentUser = await User.findOne({ email: mainUser.email })
      currentUser.bank_accounts.should.have.lengthOf(1)
    })
  })
})
