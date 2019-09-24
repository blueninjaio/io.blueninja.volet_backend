const { Schema, model } = require('mongoose');

const schema = new Schema({
  business_id: String,
  name: String,
  description: String,
  price: {
    value: Number,
    decimal: Number
  }
});

module.exports = model('Item', schema);
