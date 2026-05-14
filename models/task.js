const mongoose = require("mongoose");

<<<<<<< HEAD
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["basse", "moyenne", "haute"],
      default: "moyenne",
    },
    status: {
      type: String,
      enum: ["à faire", "en cours", "terminé"],
      default: "à faire",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
=======
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['basse', 'moyenne', 'haute'], default: 'moyenne' },
  status: { type: String, enum: ['à faire', 'en cours', 'terminé'], default: 'à faire' },
 project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
>>>>>>> 921164f396600b3bc82a44031776098310546fdc

module.exports = mongoose.model("Task", taskSchema);
