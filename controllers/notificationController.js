exports.createNotification=(req,res) => {
    const {message, user} =req.body;
    res.json({
        message: "Notification crée",
        notification: {
            message,
            user,
            date: new Date()
        }
    });
};