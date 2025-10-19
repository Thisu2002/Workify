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
  contact: {
    phone: {
      type: String,
    },
    location: {
      type: String, default: ''
    },
    linkedIn: {
      type: String, default: ''
    },
    email: {
      type: String, default: ''
    }
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
      degree: {
        type: String, default: ''
      },
      school: {
        type: String, default: ''
      },
      dates: {
        type: String, default: ''
      },
      gpa: {
        type: Number,
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
      round_confirmation: { type: String, default: "not_replied", enum: ["not_replied", "confirmed"] },
      round_result: { type: String },
      round_feedback: { type: String },
    },
  ],
  current_status: { type: String, default: "new" },
  work_experience: [
    {
      title: { type: String, default:'' },
      company: { type: String, default:'' },
      dates: { type: String , default:'' },
      description: { type: String , default:'' }
    },
  ],
});

module.exports = mongoose.model("Candidate_Job", candidateJobSchema);
