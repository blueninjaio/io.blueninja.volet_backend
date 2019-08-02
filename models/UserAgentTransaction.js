const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    from: String,
    to: String,
    type: String,
    amount: Number,
    date: String
});
const model = mongoose.model('UserAgentTransaction', schema);

module.exports = model;