const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // ← AJOUT
const memberRoutes = require('./routes/memberRoutes');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Routes API
app.get('/', (req, res) => {
  res.send('API TaskFlow est en ligne 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes); // ← AJOUT
app.use('/api/projects', memberRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});