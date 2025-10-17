const mongoose = require("mongoose");

const mentoringSessionSchema = new mongoose.Schema({
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true,
  },
  session_type: {
    type: String,
    required: true,
    enum: [
      "cv-review",
      "mock-interview",
      "career-guidance",
      "technical-mentoring",
    ],
  },
  candidate_email: {
    type: String,
    required: true,
  },
  date_time: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  notes: String,
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
}, {
  timestamps: true,
});
