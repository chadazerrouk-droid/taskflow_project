
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["actif", "en pause", "archivé"],
      default: "actif",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ✅ AJOUTE CETTE LIGNE (CRUCIAL POUR LA MISSION F8)
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;