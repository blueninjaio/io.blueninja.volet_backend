const { Schema, model } = require('mongoose');

const schema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: Number,
    reason: {
        type: Schema.Types.ObjectId,
        ref: 'PaymentReason'
    },
    description: String,
    pending: Boolean,
    date_created: {
        type: Date,
        default: Date.now
    },
    date_modified: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('UserPayment', schema);