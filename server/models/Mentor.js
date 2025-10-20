const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    //required: true
  },
  name: {
    type: String,
    //required: true
  },
  email: {
    type: String,
    //required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  field: {
    type: String,
    //required: true
  },
  role: {
    type: String,
    //required: true
  },
  company: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    //required: true
  },
  linkedin: { type: String },
  contactNumber: { type: String },
  specialties: [{
    type: String,
    //required: true
  }],
  experience: {
    type: String, // years of experience
    default: '0'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availability: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    slots: [{
      day: String, // 'monday', 'tuesday', etc.
      startTime: String, // '09:00'
      endTime: String // '17:00'
    }]
  }
}, {
  timestamps: true
});

// Index for search functionality
MentorSchema.index({ name: 'text', bio: 'text', specialties: 'text' });

module.exports = mongoose.model('Mentor', MentorSchema);