const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Notification = require("../models/Notification");

router.get("/", protect, async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", protect, async (req, res) => {
    try {
        const notif = new Notification({
            message: req.body.message || "Test notification"
        });
        await notif.save();
        res.json({ message: "Notification créée", notif });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/:id/read", protect, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;