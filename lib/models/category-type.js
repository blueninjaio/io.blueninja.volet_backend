const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    title: String
});
const model = mongoose.model('CategoryType', schema);

module.exports = model;