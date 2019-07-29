const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: String,
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
});
const model = mongoose.model('Currency', schema);

module.exports = model;