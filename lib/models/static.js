const { Schema, model } = require('mongoose');

const schema = new Schema({
    faq: String,
    policies: String
});

module.exports = model('Static', schema);