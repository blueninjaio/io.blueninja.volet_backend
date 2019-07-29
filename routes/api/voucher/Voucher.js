var mongoose = require('mongoose');  
var VoucherSchema = new mongoose.Schema({  
    name: String, 
    description: String, 
    amount: Number,
    quantity: String, 
    expiry: String,
    usage: {
        type: Array, 
        default: []
    }
})

mongoose.model('Voucher', VoucherSchema)
module.exports = mongoose.model('Voucher')