const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getNotifications, createNotification, markAsRead } = require("../controllers/notificationController");

router.get("/", auth, getNotifications);
router.post("/", auth, createNotification);
router.patch("/:id/read", auth, markAsRead);

module.exports = router;