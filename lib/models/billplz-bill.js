const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank' },
    bill_id: String,
    date_created: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('BillPlzBill', schema);