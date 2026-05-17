const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.get("/", protect, notificationController.getNotifications);
router.post("/", protect, notificationController.createNotification);
router.patch("/:id/read", protect, notificationController.markAsRead);

module.exports = router;