const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    user_id: String,
    rating: Number,
    description: String,
    date_created: {
        type: Date,
        default: Date.now
    }
});

const model = mongoose.model('Feedback', schema);

module.exports = model;