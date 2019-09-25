/* eslint-disable */
require('../app')
const chai = require('chai')
chai.should()
const Admin = require('../../lib/models/admin')

describe('#Admin Model', () => {
  // truncate Admin table before doing any tests
  beforeEach(async () => {
    await Admin.deleteMany({}, null)
  })

  describe('#Create Admin', () => {
    it ('Should create admin', async () => {
      const admin = new Admin({
        ...chai.create('admin')
      })

      await admin.save()
      const savedAdmin = await Admin.findOne({ email: admin.email })
      savedAdmin.should.not.equal(null)
    })
  })

  describe('#Verify Password', () => {
    it ('Should verify the password properly', async () => {
      const chaiAdmin = chai.create('admin')
      const admin = new Admin({
        ...chaiAdmin,
      })
      await admin.save()
      const foundAdmin = await Admin.findOne({ email: admin.email })
      foundAdmin.verifyPassword(chaiAdmin.password).should.be.equal(true)
    })
  })

  describe('#Update Password Hook', () => {
    it ('Should update password due to pre save hook', async () => {
      const admin = new Admin({
        ...chai.create('admin')
      })
      await admin.save()
      const oldPass = admin.password

      admin.password = 'lolololnewpass'
      await admin.save()
      const newPass = admin.password

      oldPass.should.not.equal(newPass)
    })
  })

  after(async () => {
    await Admin.deleteMany({}, null)
  })
})
