const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    Title : String,
    Describtion: String,

    assignedTo: {
        type: String,
        required: false
  }
});
module.exports = mongoose.model("Task",taskSchema);