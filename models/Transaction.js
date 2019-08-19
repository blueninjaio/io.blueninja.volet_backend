const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    user_type: String,
    from: String,
    to: String,
    business: String,
    business_type: String,
    type: String,
    amount: Number,
    date_created: {
        type: Date,
        default: Date.now
    }
});
const model = mongoose.model('Transaction', schema);

module.exports = model;