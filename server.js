const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Nécessaire pour servir le HTML
const connectDB = require('./config/db');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// ✅ SERVIR LES FICHIERS STATIQUES (Important pour ton HTML)
// Cela permet d'accéder à ton fichier dans le dossier /public
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES API ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Route de base
app.get('/', (req, res) => {
  res.send('API TaskFlow est en ligne 🚀');
});

// --- DÉMARRAGE ---
const PORT = process.env.PORT || 5001; // Change 5000 par 5001
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📂 Dossier public actif : http://localhost:${PORT}/project-details.html`);
});