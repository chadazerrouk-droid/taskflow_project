const Task = require('../models/task');
const Project = require('../models/Project');

// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let filter = {};

    if (projectId) {
      filter.project = projectId;
    } else {
      const projects = await Project.find({
        $or: [{ owner: req.user.id }, { members: req.user.id }]
      }).select('_id');
      filter.project = { $in: projects.map(p => p._id) };
    }

    const tasks = await Task.find(filter)
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority, project, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      project,
      assignedTo
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    const { title, description, priority, status, assignedTo } = req.body;
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    await task.deleteOne();
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    task.status = status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
};