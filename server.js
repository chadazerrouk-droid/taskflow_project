global.crypto = require('crypto');
global.crypto = crypto;
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
//const taskRoutes = require('./routes/taskRoutes');
//const dashboardRoutes = require('./routes/dashboardRoutes');
//const memberRoutes = require('./routes/memberRoutes');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes API (ta structure modulaire)
app.get('/', (req, res) => {
  res.send('API TaskFlow est en ligne 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
//app.use('/api/tasks', taskRoutes);
//app.use('/api/dashboard', dashboardRoutes);
// memberRoutes est déjà inclus dans projectRoutes, pas besoin de le remettre ici

// Ajout (optionnel) venu de develop – ex: route health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});