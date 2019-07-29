var mongoose = require('mongoose');  
var VoletSchema = new mongoose.Schema({  
    persona_id: String, 
    persona_model: String,
    amount: Number
})

mongoose.model('Volet', VoletSchema)
module.exports = mongoose.model('Volet')