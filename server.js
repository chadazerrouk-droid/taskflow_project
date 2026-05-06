const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", taskRoutes);

app.listen(5000, () => {
    console.log("Serveur prêt");
});
