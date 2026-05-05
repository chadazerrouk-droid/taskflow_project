const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/auth/register", (req, res) => {
  console.log("📝 Register called:", req.body);
  res.status(201).json({
    message: "User created successfully (temporaire)",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.temp_token_for_testing",
  });
});

app.post("/api/auth/login", (req, res) => {
  console.log("🔐 Login called:", req.body);
  res.status(200).json({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.temp_token_for_testing",
  });
});

// Route test
app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

// ============================================
// FIN ROUTES TEMPORAIRES
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📌 Routes temporaires actives :`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
});
