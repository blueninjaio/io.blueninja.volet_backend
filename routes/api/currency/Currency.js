var mongoose = require('mongoose');  
var CurrencySchema = new mongoose.Schema({  
    name: String, 
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
})

mongoose.model('Currency', CurrencySchema)
module.exports = mongoose.model('Currency')