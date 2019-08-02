const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    from: String,
    to: String,
    business: String,
    bType: String,
    type: String,
    amount: Number,
    date: String
});
const model = mongoose.model('MerchantTransaction', schema);

module.exports = model;