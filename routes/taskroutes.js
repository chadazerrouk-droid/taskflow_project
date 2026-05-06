const express = require("express");
const router = express.Router();

const { createTask } = require("../controllers/taskcontroller");
const { create } = require("node:domain");
router.post("/tasks",createTask);
module.exports = router;