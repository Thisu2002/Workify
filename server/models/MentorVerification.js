const mongoose = require('mongoose');

const mentorVerificationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  field: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String },
  linkedin: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Declined'], 
    default: 'Pending' 
  },
  reason: { type: String } // if declined
  },
{ timestamps: true }
);

module.exports = mongoose.model('MentorVerification', mentorVerificationSchema);
