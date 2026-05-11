const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    req.user = { id: "test123" }; // ← faux utilisateur pour tester
    next();
};

module.exports = { protect };