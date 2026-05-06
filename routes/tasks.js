const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// ➕ CRÉER une tâche
router.post("/", auth, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📖 LIRE toutes les tâches (SANS populate)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔍 LIRE une tâche spécifique (SANS populate)
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✏️ MODIFIER une tâche
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🗑️ SUPPRIMER une tâche
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔄 CHANGER le statut
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["à faire", "en cours", "terminé"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
