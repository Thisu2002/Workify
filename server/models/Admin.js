// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // SAME as user's _id
  privileges: [String] // Example field
});

module.exports = mongoose.model('Admin', adminSchema);
