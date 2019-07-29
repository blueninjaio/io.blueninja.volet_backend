var mongoose = require('mongoose');  
var PaymentMethodSchema = new mongoose.Schema({  
    name: String, 
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
})

mongoose.model('PaymentMethod', PaymentMethodSchema)
module.exports = mongoose.model('PaymentMethod')