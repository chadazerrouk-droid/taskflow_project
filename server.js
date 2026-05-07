const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();


app.use(cors());
app.use(express.json());

app.get("/",(req,res) =>{
    res.send("API TaskFlow fonctionne !");
});

app.use("/tasks", taskRoutes);
app.use("/notifications",notificationRoutes);
mongoose.connect("mongodb://127.0.0.1:27017/taskflow")
.then(() => {
    console.log("MongoDB connecté");
})
.catch((error) => {
    console.log(error);
});

app.listen(3000, () => {
    console.log("Serveur prêt http://localhost:3000");
});

