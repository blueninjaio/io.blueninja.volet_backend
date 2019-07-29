var mongoose = require('mongoose');  
var MerchantSchema = new mongoose.Schema({  
  contact: String,
  f_name: String, 
  l_name: String, 
  email: String,
  password: String,
  push_token: String,
})

mongoose.model('Merchant', MerchantSchema)
module.exports = mongoose.model('Merchant')