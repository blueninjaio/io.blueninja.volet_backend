var mongoose = require('mongoose');  
var BankSchema = new mongoose.Schema({  
    name: String, 
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
})

mongoose.model('Bank', BankSchema)
module.exports = mongoose.model('Bank')