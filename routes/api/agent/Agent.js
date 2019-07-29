var mongoose = require('mongoose');  
var AgentSchema = new mongoose.Schema({  
  user_id: String, 
  isPending: {
      type: Boolean, 
      default: true
  },
  isApproved: Boolean, 
  isDeclined: Boolean,
})

mongoose.model('Agent', AgentSchema)
module.exports = mongoose.model('Agent')