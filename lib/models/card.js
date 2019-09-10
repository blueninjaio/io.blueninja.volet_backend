const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: String,
    number: String,
    expiry: String,
    date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Card', schema);