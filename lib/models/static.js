const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    faq: String,
    policies: String
});
const model = mongoose.model('Static', schema);

module.exports = model;