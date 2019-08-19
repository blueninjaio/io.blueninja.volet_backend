const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    contact: String,
    facebook_id: String,
    google_id: String,
    f_name: String,
    l_name: String,
    email: String,
    push_token: String,
    user_type: {
        type: String,
        default: 'User'
    },
    password: String,
    credits: String,
    date_created: {
        type: Date,
        default: Date.now
    }
});
const model = mongoose.model('User', schema);

module.exports = model;