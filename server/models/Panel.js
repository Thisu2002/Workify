const mongoose = require("mongoose");

const panelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lead_panelist: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'User',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

module.exports = mongoose.model("Panel", panelSchema);
