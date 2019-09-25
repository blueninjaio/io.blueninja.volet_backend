/* eslint-disable */
require('../app')
const chai = require('chai')
chai.should()
const Merchant = require('../../lib/models/merchant')

describe('#Merchant Model', () => {
  // truncate Merchant table before doing any tests
  beforeEach(async () => {
    await Merchant.deleteMany({}, null)
  })

  describe('#Create Merchant', () => {
    it ('Should create merchant', async () => {
      const merchant = new Merchant({
        ...chai.create('merchant')
      })

      await merchant.save()
      const savedMerchant = await Merchant.findOne({ email: merchant.email })
      savedMerchant.should.not.equal(null)
    })
  })

  describe('#Verify Password', () => {
    it ('Should verify the password properly', async () => {
      const chaiMerchant = chai.create('merchant')
      const merchant = new Merchant({
        ...chaiMerchant,
      })
      await merchant.save()
      const foundMerchant = await Merchant.findOne({ email: merchant.email })
      foundMerchant.verifyPassword(chaiMerchant.password).should.be.equal(true)
    })
  })

  describe('#Update Password Hook', () => {
    it ('Should update password due to pre save hook', async () => {
      const merchant = new Merchant({
        ...chai.create('admin')
      })
      await merchant.save()
      const oldPass = merchant.password

      merchant.password = 'lolololnewpass'
      await merchant.save()
      const newPass = merchant.password

      oldPass.should.not.equal(newPass)
    })
  })

  after(async () => {
    await Merchant.deleteMany({}, null)
  })
})
