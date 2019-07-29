const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    business_id: String,
    name: String,
    description: String,
    price: {
        value: Number,
        decimal: Number,
    }
});
const model = mongoose.model('Item', schema);

module.exports = model;