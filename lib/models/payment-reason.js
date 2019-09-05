const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: String,
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
});
module.exports = mongoose.model('PaymentReason', schema);