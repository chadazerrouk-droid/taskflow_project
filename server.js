const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb://admin:example@localhost:27017/taskflow?authSource=admin")
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ MongoDB erreur:", err));



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

app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});



const taskRoutes = require("./routes/tasks");
app.use("/api/tasks", taskRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📌 Routes actives :`);
  console.log(`   POST /api/auth/register (temporaire)`);
  console.log(`   POST /api/auth/login (temporaire)`);
  console.log(`   GET  /api/tasks`);
  console.log(`   POST /api/tasks`);
  console.log(`   GET  /api/tasks/:id`);
  console.log(`   PUT  /api/tasks/:id`);
  console.log(`   DELETE /api/tasks/:id`);
  console.log(`   PATCH /api/tasks/:id/status`);
});
