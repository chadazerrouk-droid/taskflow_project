const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://admin:example@localhost:27017/taskflow?authSource=admin';

console.log('🔄 Connexion à MongoDB...');

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB CONNECTÉ avec succès !');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR de connexion :', err.message);
    process.exit(1);
  });