// models/Skills.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  id: Number,
  name: String
});

module.exports = mongoose.model('Skill', skillSchema);
