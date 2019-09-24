const bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose');

const schema = new Schema({
  contact: String,
  email: String,
  facebook_id: String,
  google_id: String,
  password: String,
  f_name: String,
  l_name: String,
  photo_url: String,
  address: String,
  push_token: String,
  credits: {
    type: Number,
    default: 0
  },
  savings_active: Boolean,
  monthly_savings: {
    type: Number,
    default: 0
  },
  bank_accounts: [{ type: Schema.Types.ObjectId, ref: 'BankAccount' }],
  cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  gps_coordinates: String,
  is_agent: Boolean,
  agent_applied: Boolean,
  is_visible: Boolean,
  date_created: {
    type: Date,
    default: Date.now
  }
});
schema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, 8);
  }
  next();
});
schema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = model('User', schema);