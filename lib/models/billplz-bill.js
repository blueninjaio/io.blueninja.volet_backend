const { Schema, model } = require('mongoose');
//todo replace with redis caching
const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Bank' },
  bill_id: String,
  date_created: {
    type: Date,
    default: Date.now
  }
});
module.exports = model('BillPlzBill', schema);