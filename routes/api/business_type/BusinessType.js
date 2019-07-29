var mongoose = require('mongoose');  
var BusinessTypeSchema = new mongoose.Schema({  
  name: String,
  isActive: {
    type: Boolean, 
    default: true
  }
})

mongoose.model('BusinessType', BusinessTypeSchema)
module.exports = mongoose.model('BusinessType')