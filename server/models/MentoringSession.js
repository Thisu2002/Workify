const mongoose = require("mongoose");

const MentoringSessionSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  candidateName: {
    type: String,
  },
  candidateAvatar: {
    type: String,
    default: "",
  },
  candidate_email: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
  },
  session_type: {
    type: String,
    required: true,
  },
  urgency: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "scheduled", "completed", "cancelled"],
    default: "pending",
  },
  message: {
    type: String,
    default: "",
  },
  skills: [{
    type: String,
  }],
  field: {
    type: String,
    default: "General Mentoring",
  },
  experience: {
    type: String,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  scheduledDate: {
    type: Date,
  },
  date_time: {
    type: String,
  },
  duration: {
    type: Number, // in minutes
    default: 60,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("MentoringSession", MentoringSessionSchema);
