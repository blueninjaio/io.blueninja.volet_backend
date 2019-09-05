const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    persona_id: String,
    persona_model: String,
    amount: Number
});
const model = mongoose.model('Volet', schema);

module.exports = model;