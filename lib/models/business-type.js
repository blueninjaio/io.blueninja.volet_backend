const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: String,
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = model('BusinessType', schema);
