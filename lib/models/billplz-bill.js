const { Schema, model } = require('mongoose');

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Bank' },
  bill_id: String,
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('BillPlzBill', schema);
