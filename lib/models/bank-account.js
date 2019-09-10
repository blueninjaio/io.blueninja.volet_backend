const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: String,
    number: String,
    bank: { type: Schema.Types.ObjectId, ref: 'Bank' },
    date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('BankAccount', schema);