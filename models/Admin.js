const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    password: String,
    email: String,
});
const model = mongoose.model('Admin', schema);

module.exports = model;