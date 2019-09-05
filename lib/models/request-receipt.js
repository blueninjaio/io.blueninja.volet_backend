const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const schema = new Schema({
    user_id: String,
    requests: [Schema.Types.ObjectId],
    date_created: {
        type: Date,
        default: Date.now
    },

});
const model = mongoose.model('PaymentRequest', schema);

module.exports = model;