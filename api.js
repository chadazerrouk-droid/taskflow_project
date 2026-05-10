const api = axios.create({
    baseURL: "http://localhost:3000",
});
api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("token");

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
async function createTask(taskData) {
  try{
    const response = await api.post("/tasks", {
      title: taskData.title,
      description: taskData.description,
      assignedTo: "Zainab Elkharraz" 
    });
    console.log("reponse du serveur : ", response.data);
    return response.data;
  }catch(error){
    console.error("Erreur lors de la création :", error);
  }
}