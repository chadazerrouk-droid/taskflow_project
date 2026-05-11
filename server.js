const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const auth = require('./middleware/auth');
const tasksRoutes = require('./routes/tasks');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/tasks', tasksRoutes);

// Route test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Route register et login (déjà existantes)
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Dashboard route
app.get('/api/dashboard', async (req, res) => {
  try {
    const Task = require('./models/Task');
    const Project = require('./models/Project');
    const mongoose = require('mongoose');
    
    const userId = new mongoose.Types.ObjectId("69fa66bdd3708f7e4a44ba89");
    
    const taskAggregation = await Task.aggregate([
  { $match: { assignedTo: userId } },
  {
    $addFields: {
      isLate: {
        $and: [
          { $ne: ["$status", "terminé"] },
          { $lt: ["$dueDate", new Date()] },
          { $ne: ["$dueDate", null] }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      totalAssigned: { $sum: 1 },
      completed: { 
        $sum: { $cond: [{ $eq: ["$status", "terminé"] }, 1, 0] }
      },
      lateTasks: { 
        $sum: { $cond: ["$isLate", 1, 0] }
      }
    }
  }
]);
    
    const projectAggregation = await Project.aggregate([
      { $match: { status: "actif" } },
      { $group: {
          _id: null,
          total: { $sum: 1 }
        }
      }
    ]);
  // Tâches en cours triées par priorité (haute → moyenne → basse) puis par dueDate
const tasksInProgress = await Task.aggregate([
  { $match: { 
      assignedTo: userId,
      status: { $ne: "terminé" }
    } 
  },
  {
    $addFields: {
      priorityOrder: {
        $switch: {
          branches: [
            { case: { $eq: ["$priority", "haute"] }, then: 1 },
            { case: { $eq: ["$priority", "moyenne"] }, then: 2 },
            { case: { $eq: ["$priority", "basse"] }, then: 3 }
          ],
          default: 4
        }
      }
    }
  },
  { $sort: { priorityOrder: 1, dueDate: 1 } },
  { $project: { priorityOrder: 0 } }  // retire le champ temporaire
]);  
  res.json({
    totalActiveProjects: projectAggregation[0]?.total || 0,
    assignedTasks: taskAggregation[0]?.totalAssigned || 0,
    completedTasks: taskAggregation[0]?.completed || 0,
    lateTasks: taskAggregation[0]?.lateTasks || 0,
    tasksInProgress: tasksInProgress
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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