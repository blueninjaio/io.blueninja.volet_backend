const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: String,
    description: String
});

module.exports = model('Push', schema);