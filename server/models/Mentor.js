const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  field: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String },
  linkedin: { type: String },
  contactNumber: { type: String },
});

module.exports = mongoose.model('Mentor', mentorSchema);
