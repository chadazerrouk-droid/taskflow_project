const api = axios.create({
    baseURL: "http://localhost:3000/api",
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
function createTask() {
  fetch("http://localhost:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "Test",
      description: "Test task",
      assignedTo: "Zainab El kharraz"
    })
  })
  .then(res => res.json())
  .then(data => console.log(data));
}