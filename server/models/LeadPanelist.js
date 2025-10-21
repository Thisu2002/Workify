const mongoose = require('mongoose');

const leadPanelistSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // link back to User
    required: true
  },
  
  location: { 
    type: String 
  },
  
  specialization: {
    type: String
  },
  
  experience_years: {
    type: Number
  },
  
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
});

module.exports = mongoose.model('LeadPanelist', leadPanelistSchema);
