const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");


router.get("/", async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const notif = new Notification({
            message: "Test notification"
        });

        await notif.save();

        res.json({
            message: "Notification créée",
            notif
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;