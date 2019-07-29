var mongoose = require('mongoose');  
var AdminSchema = new mongoose.Schema({  
  password: String,
  email: String,
})

mongoose.model('Admin', AdminSchema)
module.exports = mongoose.model('Admin')