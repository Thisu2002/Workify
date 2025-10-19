// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  website: { type: String },

  currentSubscription: {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'expired'], default: 'active' }
  },

  subscriptionHistory: [
    {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
      startDate: { type: Date },
      endDate: { type: Date },
      status: { type: String, enum: ['active', 'expired'], default: 'expired' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
