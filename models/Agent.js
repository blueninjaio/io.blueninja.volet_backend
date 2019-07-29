const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    user_id: String,
    isPending: {
        type: Boolean,
        default: true
    },
    isApproved: Boolean,
    isDeclined: Boolean,
});

const model = mongoose.model('Agent', schema);
module.exports = model;