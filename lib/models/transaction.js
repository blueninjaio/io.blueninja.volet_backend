const { Schema, model } = require('mongoose');

const schema = new Schema({
  user_type: String,
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: Schema.Types.ObjectId,
  business: String,
  business_type: String,
  type: String,
  amount: Number,
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Transaction', schema);