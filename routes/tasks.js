const express = require("express");
const router = express.Router({ mergeParams: true });
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const {
  validateTask,
  validateStatusUpdate,
} = require("../middleware/validateTask");

router.get("/", auth, async (req, res) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (req.params.projectId) filter.project = req.params.projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "name email");

    res.json({
      data: tasks,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", auth, validateTask, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      project: req.params.projectId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email",
    );
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", auth, validateTask, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/status", auth, validateStatusUpdate, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/assign", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId est requis" });
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true },
    );
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
