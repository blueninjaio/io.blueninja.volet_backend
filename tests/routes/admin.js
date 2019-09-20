/* eslint-disable */
require('../app')
const chai = require('chai')
const chance = require('chance').Chance();

const app = require('../../app')
const Admin = require('../../lib/models/admin')
chai.should()

const mainAdmin = {
  email: 'ken.yap@blueninja.io',
  password: 'kenyapblueninja',
}

const adminLogin = async () => {
  const admin = await Admin.findOne({ email: mainAdmin.email })
  const { body: { token } } = await chai.request(app)
    .post('/api/admin/login')
    .send({ email: admin.email, password: mainAdmin.password })

  return token
}

const adminCreateSuccess = 'Admin was successfully created'
const adminUpdatePassSuccess = 'Password has been successfully reset.'
const adminUpdateEmailSuccess = 'Email has been successfully changed.'

describe('#Admin Route', () => {
  // adding admin before being able to do any admin actions
  before(async () => {
    for(let i = 0; i < 10; i++) {
      const admin = new Admin({
        ...chai.create('admin', { email: chance.email() }),
      })
      await admin.save()
    }
    // create main admin
    await new Admin({
      ...mainAdmin,
    }).save()
  })

  describe('#GET /api/admin', () => {
    it ('should login and get all admins', async () => {
      const token = await adminLogin()

      const { body: getAdminsResponse } = await chai.request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${token}`)

      getAdminsResponse.users.should.have.length.above(1)
      getAdminsResponse.should.not.be.equal(null)
    })
  })

  describe('#POST /api/admin', () => {
    it ('should login and create an admin', async () => {
      const token = await adminLogin()

      const { body: response } = await chai.request(app)
        .post('/api/admin')
        .set('Authorization', `Bearer ${token}`)
        .send(chai.create('admin', { email: `${chance.word()}.${chance.word()}@${chance.domain()}` }))

      response.message.should.be.equal(adminCreateSuccess)
    })
  })

  describe('#GET /api/me', () => {
    it ('should verify admin login', async () => {
      const token = await adminLogin()

      const { body: response } = await chai.request(app)
        .get('/api/admin/me')
        .set('Authorization', `Bearer ${token}`)

      response.success.should.be.equal(true)
      response.user.email.should.be.equal(mainAdmin.email)
    })
  })

  describe('#POST /admin/changePassword', () => {
    it ('should change admin password', async () => {
      const token = await adminLogin()
      const newPassword = chance.word()

      const { body: response } = await chai.request(app)
        .post('/api/admin/changePassword')
        .set('Authorization', `Bearer ${token}`)
        .send({ old_password: mainAdmin.password, new_password: newPassword })

      response.success.should.be.equal(true)
      response.message.should.be.equal(adminUpdatePassSuccess)
    })
  })

  describe('#POST /admin/changeEmail', () => {
    it ('should fail to change admin email due to changePassword above', async () => {
      const token = await adminLogin()

      const { email, _id } = await Admin.findOne({ email: mainAdmin.email })
      const newEmail = chance.email()

      const { body: response } = await chai.request(app)
        .post('/api/admin/changeEmail')
        .set('Authorization', `Bearer ${token}`)
        .send({ _id, email: newEmail })

      const supposedAdmin = await Admin.findOne({ email: newEmail })
      response.message.should.not.be.equal(adminUpdateEmailSuccess)
      chai.expect(supposedAdmin).to.be.equal(null)
    })
  })
})
