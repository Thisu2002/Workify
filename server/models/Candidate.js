const mongoose = require('mongoose');

// Sub-schemas for better organization
const ContactSchema = new mongoose.Schema({
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  age: { type: String, default: '' }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  company: { type: String, default: '' },
  dates: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  school: { type: String, default: '' },
  dates: { type: String, default: '' }
}, { _id: false });

// The main schema
const candidateSchema = new mongoose.Schema({
  // This _id MUST match the User's _id
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This creates the link to the User model
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  contact: {
    type: ContactSchema,
    default: () => ({})
  },
  skills: {
    type: [String],
    default: []
  },
  experience: {
    type: [ExperienceSchema],
    default: []
  },
  education: {
    type: [EducationSchema],
    default: []
  },
});

module.exports = mongoose.model('Candidate', candidateSchema);