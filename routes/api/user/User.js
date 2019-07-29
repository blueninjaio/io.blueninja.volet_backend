var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  contact: String, 
  facebook_id: String, 
  google_id: String,
  f_name: String, 
  l_name: String, 
  email: String,
  push_token: String,
  user_type: {
    type: String, 
    default: 'User'
  },
  password: String
})

mongoose.model('User', UserSchema)
module.exports = mongoose.model('User')