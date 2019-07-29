const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    contact: String,
    f_name: String,
    l_name: String,
    email: String,
    password: String,
    push_token: String,
});

const model = mongoose.model('Merchant', schema);

module.exports = model;