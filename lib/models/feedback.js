const { Schema, model } = require('mongoose');

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    description: String,
    date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Feedback', schema);