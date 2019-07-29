var mongoose = require('mongoose');  
var FeedbackSchema = new mongoose.Schema({  
    user_id: String, 
    rating: Number,
    description: String
})

mongoose.model('Feedback', FeedbackSchema)
module.exports = mongoose.model('Feedback')