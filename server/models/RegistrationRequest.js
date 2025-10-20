// models/RegistrationRequest.js
const mongoose = require('mongoose');

const registrationRequestSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' },
  industry: { type: String },
  companySize: { type: String },
  address: { type: String },
  description: { type: String },
  subscriptionPlan: {
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
    name: String,
    price: Number,
    term: String
  },
  declineReason: { type: String, default: '' },
  passkey: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoosee.model('RegistrationRequest', registrationRequestSchema);
