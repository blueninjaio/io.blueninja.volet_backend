var mongoose = require('mongoose');  
var ItemSchema = new mongoose.Schema({  
  business_id: String,
  name: String, 
  description: String, 
  price: {
      value: Number, 
      decimal: Number,
  }
})

mongoose.model('Item', ItemSchema)
module.exports = mongoose.model('Item')