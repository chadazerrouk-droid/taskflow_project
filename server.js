const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const auth = require('./middleware/auth');
const tasksRoutes = require('./routes/tasks');
//const dashboardRoutes = require('./routes/dashboard');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/tasks', tasksRoutes);
//app.use('/api/dashboard', dashboardRoutes);

// Route test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Route register
// app.post('/api/register', async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;
//     const User = require('./models/User');
//     const bcrypt = require('bcryptjs');
    
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email déjà utilisé' });
//     }
    
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ fullName, email, password: hashedPassword });
//     await user.save();
    
//     res.status(201).json({ message: 'Utilisateur créé avec succès' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Route login
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const User = require('./models/User');
//     const bcrypt = require('bcryptjs');
//     const jwt = require('jsonwebtoken');
    
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
//     }
    
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
//     }
    
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     res.json({ token, user: { id: user._id, name: user.fullName, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
 // Dashboard route
// Dashboard route (version debug)
// Dashboard route (version mockée pour démo)
app.get('/api/dashboard', (req, res) => {
  res.json({
    totalActiveProjects: 1,
    assignedTasks: 4,
    completedTasks: 1,
    lateTasks: 1,
    tasksInProgress: [
      { title: "Tâche en retard", priority: "haute", dueDate: "2026-05-01", status: "en cours" },
      { title: "Tâche haute priorité", priority: "haute", dueDate: "2026-05-15", status: "en cours" },
      { title: "Tâche moyenne priorité", priority: "moyenne", dueDate: "2026-05-20", status: "en cours" }
    ]
  });
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});