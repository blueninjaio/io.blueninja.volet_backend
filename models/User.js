const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const schema = new Schema({
    contact: String,
    facebook_id: String,
    google_id: String,
    f_name: String,
    l_name: String,
    email: String,
    photo_url: String,
    push_token: String,
    user_type: {
        type: String,
        default: 'User'
    },
    password: String,
    credits: {
        type: Number,
        default: 0
    },
    monthly_savings: {
        type: Number,
        default: 0
    },
    savings_active: Boolean,
    date_created: {
        type: Date,
        default: Date.now
    },
    cards: [Schema.Types.ObjectId]
});
const model = mongoose.model('User', schema);

module.exports = model;