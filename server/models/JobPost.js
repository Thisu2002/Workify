const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  skills: {
    type: [Number], // skill IDs
  },
  salary: {
    type: Number,
  },
  jobType: {
    type: String
  },
  deadline: {
    type: String
  },
  date_posted: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  education_requirements: [
    {
      level: {
        type: String,
        enum: ['Diploma', 'Bachelors', 'Masters', 'PhD'],
      },
      field: {
        type: String,
      }
    }
  ],
  experience: {
    years: {
      type: Number,
    },
    description: {
      type: String
    }
  },
  qualifications: [
    {
      name: {
        type: String,
      },
      required: {
        type: Boolean,
      }
    }
  ],
  preferred_qualifications: [
    {
      name: {
        type: String,
        required: true
      },
      required: {
        type: Boolean,
        default: false
      }
    }
  ],
  comments: {
    type: String
  }
});

module.exports = mongoose.model('JobPost', jobPostSchema);
