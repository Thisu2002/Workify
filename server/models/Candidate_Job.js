const mongoose = require("mongoose");

const candidateJobSchema = new mongoose.Schema({
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPost",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  address: {
    type: String,
  },
  skills: {
    type: [Number], // skill IDs
  },
  date_applied: {
    type: Date,
    default: Date.now,
  },
  education: [
    {
      level: {
        type: String,
      },
      field: {
        type: String,
      },
    },
  ],
  experience: {
    years: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  qualifications: [
    {
      name: {
        type: String,
      },
      required: {
        type: Boolean,
      },
    },
  ],
  match_score: {
    type: Number,
  },
  quiz_score: {
    type: Number,
  },
  round_status: [
    {
      round_number: { type: Number },
      round_result: { type: String },
      round_feedback: { type: String },
    },
  ],
  current_status: { type: String, default: "new" },
});

module.exports = mongoose.model("Candidate_Job", candidateJobSchema);
