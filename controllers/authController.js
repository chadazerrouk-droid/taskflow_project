const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Inscription
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            token
        });
    } catch (error) {
        console.error('Erreur register:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// @desc    Connexion
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            token
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};