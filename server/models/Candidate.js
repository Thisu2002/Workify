const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // link back to User
    required: true
  },
  location: String
});

module.exports = mongoose.model('Candidate', candidateSchema);
