const { Schema, model } = require('mongoose');

const schema = new Schema({
  code: String,
  name: String,
  description: String,
  amount: Number,
  quantity: String,
  expiry: Date,
  usage: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = model('Voucher', schema);