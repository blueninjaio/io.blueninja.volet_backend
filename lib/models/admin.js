const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  password: String,
  email: String,
  date_created: {
    type: Date,
    default: Date.now
  }
});

schema.pre('save', function (next) {
  const admin = this;
  if (admin.isModified('password')) {
    admin.password = bcrypt.hashSync(admin.password, 8);
  }
  next();
});
schema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', schema);