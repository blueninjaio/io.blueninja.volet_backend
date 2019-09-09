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
        type: String,
        enum: ['Food and Beverage', 'Transportation', 'Utilities', 'Shopping', 'Entertainment', 'Agent Withdrawal']
    },
    description: String,
    status: {
        type: String,
        enum: ['Requested', 'Rejected', 'Pending', 'Complete']
    },
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