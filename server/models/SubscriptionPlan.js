const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 }, // e.g., 4900 for 3 months
  billingCycle: { 
    type: String, 
    enum: ['quarterly', 'yearly'], 
    required: true 
  }, // 'quarterly' = 3 months, 'yearly' = 12 months
  features: [{ type: String }],
  trialDays: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);