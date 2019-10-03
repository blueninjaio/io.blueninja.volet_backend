const { Schema, model } = require('mongoose');

const schema = new Schema({
  message: String,
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  voucher: { type: Schema.Types.ObjectId, ref: 'Voucher' }
});

module.exports = model('Notification', schema);