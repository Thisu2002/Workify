// models/JobPost.js
const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  skills: {
    type: [Number],
    //ref: 'Skill'
  },
  salary: {
    type: Number,
    required: true
  },
  date_posted: {
    type: Date,
    default: Date.now
  },
  status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    }
});

module.exports = mongoose.model('JobPost', jobPostSchema);
