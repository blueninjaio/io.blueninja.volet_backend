const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: String,
    number: String,
    bank: {type: mongoose.Schema.Types.ObjectId, ref: 'Bank'},
    date_created: {
        type: Date,
        default: Date.now
    },
});
const model = mongoose.model('BankAccount', schema);

module.exports = model;