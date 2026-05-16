const ALLOWED_PRIORITY = ["basse", "moyenne", "haute"];
const ALLOWED_STATUS = ["à faire", "en cours", "terminé"];

const validateTask = (req, res, next) => {
  const errors = [];
  const { title, priority, status } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("Le titre est obligatoire.");
  }

  if (!priority) {
    errors.push("La priorité est obligatoire.");
  } else if (!ALLOWED_PRIORITY.includes(priority)) {
    errors.push(
      `Priorité invalide. Valeurs acceptées : ${ALLOWED_PRIORITY.join(", ")}.`,
    );
  }

  if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
    errors.push(
      `Statut invalide. Valeurs acceptées : ${ALLOWED_STATUS.join(", ")}.`,
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res
      .status(400)
      .json({ success: false, errors: ["Le statut est obligatoire."] });
  }

  if (!ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({
      success: false,
      errors: [
        `Statut invalide. Valeurs acceptées : ${ALLOWED_STATUS.join(", ")}.`,
      ],
    });
  }

  next();
};

module.exports = { validateTask, validateStatusUpdate };
