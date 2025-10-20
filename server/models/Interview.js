// Store interview-specific details like time, meeting links, etc.
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidate_job_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Candidate_Job',
    required: true
  },
  scheduled_date: { 
    type: Date,
    required: true
  },
  scheduled_time: { 
    type: String,
    required: true
  },
  meeting_link: String,
  location: String,
  interviewer_notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model("Interview", interviewSchema);