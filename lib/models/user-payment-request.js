const { Schema, model } = require('mongoose');

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    payments: [{
        type: Schema.Types.ObjectId,
        ref: 'UserPayment'
    }],
    date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('UserPaymentRequest', schema);