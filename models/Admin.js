const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    password: String,
    email: String,
    date_created: {
        type: Date,
        default: Date.now
    }
});
const model = mongoose.model('Admin', schema);

module.exports = model;