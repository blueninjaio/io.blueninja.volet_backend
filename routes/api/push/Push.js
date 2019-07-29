var mongoose = require('mongoose')
var PushSchema = new mongoose.Schema({  
  title: String, 
  description: String
})

mongoose.model('Push', PushSchema)
module.exports = mongoose.model('Push')