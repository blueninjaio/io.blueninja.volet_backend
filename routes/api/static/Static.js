var mongoose = require('mongoose');  
var StaticSchema = new mongoose.Schema({  
  faq: String, 
  policies: String,
})

mongoose.model('Static', StaticSchema)
module.exports = mongoose.model('Static')