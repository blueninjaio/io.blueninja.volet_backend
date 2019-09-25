/* eslint-disable */
require('../app')
const chai = require('chai')
chai.should()
const User = require('../../lib/models/user')

describe('#User Model', () => {
  // truncate User table before doing any tests
  beforeEach(async () => {
    await User.deleteMany({}, null)
  })

  describe('#Create User', () => {
    it ('Should create user', async () => {
      const user = new User({
        ...chai.create('user')
      })

      await user.save()
      const savedUser = await User.findOne({ email: user.email })
      savedUser.should.not.equal(null)
    })
  })

  describe('#Verify Password', () => {
    it ('Should verify the password properly', async () => {
      const chaiUser = chai.create('user')
      const user = new User({
        ...chaiUser,
      })
      await user.save()
      const foundUser = await User.findOne({ email: user.email })
      foundUser.verifyPassword(chaiUser.password).should.be.equal(true)
    })
  })

  describe('#Update Password Hook', () => {
    it ('Should update password due to pre save hook', async () => {
      const user = new User({
        ...chai.create('admin')
      })
      await user.save()
      const oldPass = user.password

      user.password = 'lolololnewpass'
      await user.save()
      const newPass = user.password

      oldPass.should.not.equal(newPass)
    })
  })

  after(async () => {
    await User.deleteMany({}, null)
  })
})
