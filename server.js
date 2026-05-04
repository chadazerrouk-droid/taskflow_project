const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// IMPORTER LES MODÈLES
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

// IMPORTER LE MIDDLEWARE
const authMiddleware = require('./middleware/auth');

// Connexion à MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/taskflow';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// ========== ROUTE REGISTER (créer un compte) ==========
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer le nouvel utilisateur (le mot de passe sera hashé automatiquement par le schema)
    const user = new User({ fullName, email, password });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ========== ROUTE LOGIN (se connecter) ==========
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ========== ROUTE TEST (publique) ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur fonctionne' });
});

// ========== ROUTE TEST PROTÉGÉE ==========
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Accès autorisé', user: req.user });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});