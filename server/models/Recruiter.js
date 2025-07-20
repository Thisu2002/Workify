// models/Recruiter.js
const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // link back to User
    required: true
  },
  location: String
});

module.exports = mongoose.model('Recruiter', recruiterSchema);
