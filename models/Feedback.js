const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    user_id: String,
    rating: Number,
    description: String,
    dateCreated: String
});

const model = mongoose.model('Feedback', schema);

module.exports = model;