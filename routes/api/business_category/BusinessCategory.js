var mongoose = require('mongoose');  
var BusinessCategorySchema = new mongoose.Schema({  
  name: String,
  isActive: {
    type: Boolean,
    default: true
  }
})

mongoose.model('BusinessCategory', BusinessCategorySchema)
module.exports = mongoose.model('BusinessCategory')