/* eslint-disable */
require('../app')
const chai = require('chai')
const chance = require('chance').Chance();

const app = require('../../app')
const User = require('../../lib/models/user')

chai.should()

const mainUser = {
  email: 'kenyap@blueninja.io',
  password: 'kenyapblueninja',
}

const secondUser = {
  email: 'kenyappy@blueninja.io',
  password: 'kenyappyblueninja',
}

const userLogin = async () => {
  const { body } = await chai.request(app)
    .post('/api/users/login')
    .send({ login_input: mainUser.email, password: mainUser.password })

  return body
}

describe('#Payment Routes', () => {
  before(async () => {
    for(let i = 0; i < 10; i++) {
      const user = new User({
        ...chai.create('user'),
      })
      await user.save()
    }
    await Promise.all([
      new User({ ...mainUser }).save(),
      new User({ ...secondUser }).save(),
    ])
  })

  describe('#POST /api/volet/top-up', () => {
    it ('should topup for user', async () => {
      const { token } = await userLogin()
      const options = {
        amount: 100,
        redirect_url: 'https://www.google.com',
      }
      const { body: response } = await chai.request(app)
        .post('/api/volet/top-up')
        .set('Authorization', `Bearer ${token}`)
        .send(options)

      response.message.amount.should.be.equal(options.amount)
      response.message.email.should.be.equal(mainUser.email)
      response.message.redirect_url.should.be.equal(options.redirect_url)
    })
  })

  describe('#GET /api/volet/payments/send', () => {
    it ('should send money', async () => {
      const { token } = await userLogin()
      const user = await User.findOne({ email: mainUser.email })
      user.credits = 999
      await user.save()
      const { _id } = await User.findOne({ email: secondUser.email })
      const options = {
        to: _id,
        amount: 50,
        reason: 'Entertainment',
        description: 'free money, no bitching!',
        status: 'Completed',
      }
      const { body: response } = await chai.request(app)
        .post('/api/volet/payments/send')
        .set('Authorization', `Bearer ${token}`)
        .send(options)

      response.success.should.be.equal(true)
    })
  })

  describe('#GET /api/volet/payments', () => {
    it ('should get all payments for user', async () => {
      const { token, user } = await userLogin()

      const { body: response } = await chai.request(app)
        .get('/api/volet/payments')
        .set('Authorization', `Bearer ${token}`)

      // 1 length due to the test above
      response.payments.should.have.lengthOf(1)
    })
  })
})

//router.post('/volet/top-up', userAuth, catchAsyncErrors(topUpVolet));
//router.get('/volet/payments', userAuth, catchAsyncErrors(getPayments));
//router.post('/volet/payments/send', userAuth, catchAsyncErrors(sendPayment));
//router.post('/volet/payments/request', userAuth, catchAsyncErrors(requestPayment));
////todo accept request
//router.post('/volet/withdraw/agent', userAuth, catchAsyncErrors(withdrawFromAgent));
////router.post('/volet/withdraw/bank',          userAuth,               catchAsyncErrors(withdrawFromAgent));
//router.post('/volet/withdraw/accept', userAuth, catchAsyncErrors(acceptWithdrawal));
//router.post('/volet/withdraw/reject', userAuth, catchAsyncErrors(rejectWithdrawal));
