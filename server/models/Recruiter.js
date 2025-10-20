// models/Recruiter.js
const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // link back to User
    required: true
  },

  address: { type: String },
  
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // references the Company model
    required: true
  }
});

module.exports = mongoose.model('Recruiter', recruiterSchema);
