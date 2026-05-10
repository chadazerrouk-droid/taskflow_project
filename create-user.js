const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const connectDB = require('./config/db');

const createUser = async () => {
  await connectDB();
  const password = '123456';
  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name: 'E1 User',
    email: 'e1@taskflow.com',
    password: hashed
  });

  await user.save();
  console.log('✅ Utilisateur créé avec succès');
  process.exit();
};

createUser();