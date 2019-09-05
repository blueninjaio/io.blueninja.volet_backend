const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: String,
    number: String,
    expiry: String,
    date_created: {
        type: Date,
        default: Date.now
    },
});
const model = mongoose.model('Voucher', schema);

module.exports = model;