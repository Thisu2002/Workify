// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // link back to User
    required: true
  },
  privileges: [String] // Example field
});

module.exports = mongoose.model('Admin', adminSchema);
