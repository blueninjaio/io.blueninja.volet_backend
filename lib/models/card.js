const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: String,
    number: String,
    expiry: String,
    date_created: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('Card', schema);