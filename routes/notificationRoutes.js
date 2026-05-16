const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.get("/", auth, notificationController.getNotifications);
router.post("/", auth, notificationController.createNotification);
router.patch("/:id/read", auth, notificationController.markAsRead);

module.exports = router;