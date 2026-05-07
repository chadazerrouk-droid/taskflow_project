const Task = require("../models/Task");
exports.createTask = async(req,res) =>{
    const{title , description , assignedTo} = req.body;

    try{
        const task = new Task({
            title,
            description,
            assignedTo
        
        });
        await task.save();
        res.json({
            message: "Task crée avec succès",
            task
        });
    }catch(error){
        res.status(500).json({
            message: "Erreur lors de la création",
            error : error.message
        });
    }
};
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération",
            error: error.message
        });
    }
};