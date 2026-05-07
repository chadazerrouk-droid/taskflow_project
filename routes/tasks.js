const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// 📖 LIRE toutes les tâches AVEC FILTRES ET PAGINATION
router.get("/", auth, async (req, res) => {
  try {
    // 1. Récupérer les paramètres de la requête
    const {
      status, // Filtrer par statut
      priority, // Filtrer par priorité
      assignedTo, // Filtrer par membre assigné
      search, // Recherche par mot-clé
      page = 1, // Page actuelle (défaut: 1)
      limit = 10, // Nombre d'éléments par page (défaut: 10)
    } = req.query;

    // 2. Construire le filtre dynamiquement
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // 'i' = insensible à la casse
    }

    // 3. Pagination : calculer le nombre d'éléments à sauter
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 4. Exécuter la requête avec pagination
    const tasks = await Task.find(filter).skip(skip).limit(parseInt(limit));

    // 5. Compter le nombre total de tâches (pour la pagination)
    const total = await Task.countDocuments(filter);

    // 6. Réponse avec données + métadonnées
    res.json({
      data: tasks,
      total: total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

// 🔍 LIRE une tâche spécifique
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

// 👥 ASSIGNER une tâche
router.patch("/:id/assign", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId est requis" });
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
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
