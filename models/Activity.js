const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  actionType: {
    type: String,
    enum: [
      'PROJECT_CREATED',
      'TASK_CREATED',
      'TASK_DELETED',
      'TASK_STATUS_CHANGED',
      'MEMBER_ADDED',
      'MEMBER_REMOVED',
      'PROJECT_UPDATED'
    ],
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);