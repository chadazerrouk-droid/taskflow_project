const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  actionType: { type: String, required: true }, // ex: "INVITE_MEMBER"
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // L'auteur
  description: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);