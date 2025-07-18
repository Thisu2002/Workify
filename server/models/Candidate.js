const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // SAME as user's _id
  location: [String] // Example field
});

module.exports = mongoose.model('Candidate', candidateSchema);
