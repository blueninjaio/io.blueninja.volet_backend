const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: String,
    description: String,
    amount: Number,
    quantity: String,
    expiry: String,
    usage: {
        type: Array,
        default: []
    }
});
const model = mongoose.model('Voucher', schema);

module.exports = model;