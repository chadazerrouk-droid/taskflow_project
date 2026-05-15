const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const memberRoutes = require('./routes/memberRoutes');
const activityRoutes = require('./routes/activityRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', memberRoutes);
app.use('/api/projects', activityRoutes);

app.get('/', (req, res) => {
  res.send('API TaskFlow est en ligne 🚀');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📂 Dossier public actif : http://localhost:${PORT}/project-details.html`);
});