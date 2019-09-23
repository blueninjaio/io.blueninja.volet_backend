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

const adminLogin = async () => {
  const admin = await Admin.findOne({ email: mainAdmin.email })
  const { body: { token } } = await chai.request(app)
    .post('/api/admin/login')
    .send({ email: admin.email, password: mainAdmin.password })

  return token
}

describe('#User Route', () => {
  // adding admin before being able to do any admin actions
  before(async () => {
    for(let i = 0; i < 10; i++) {
      const user = new User({
        ...chai.create('user'),
      })
      await user.save()
    }
    // create main admin
    await new Admin({
      ...mainAdmin,
    }).save()
  })

  describe('#GET /api/users', () => {
    // router.get('/users', adminAuth, catchAsyncErrors(getUsers));
    it ('should login as Admin and get all users', async () => {
      const token = await adminLogin()

      const { body: response } = await chai.request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)

      response.users.should.have.length.above(1)
    })
  })
})

// router.get('/users', adminAuth, catchAsyncErrors(getUsers));
// router.post('/users/login', catchAsyncErrors(loginUser));
// router.post('/users/forget-password', existingTAC, catchAsyncErrors(forgetUserPassword));
// router.post('/users/reset-password', userAuth, userTAC, catchAsyncErrors(resetUserPassword));
// router.get('/users/me', userAuth, catchAsyncErrors(getUserInfo));
// router.post('/users/edit', userAuth, imageUpload, catchAsyncErrors(editUserInfo));
// router.post('/users/edit-savings', userAuth, catchAsyncErrors(editSavingsPlan));//done
// router.post('/users/add-bank', userAuth, catchAsyncErrors(addBank));
// router.post('/users/get-by-contact', userAuth, catchAsyncErrors(getUsersByMobile));
// router.get('/users/agents', userAuth, catchAsyncErrors(getUserAgents));//done
