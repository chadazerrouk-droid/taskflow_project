const title = document.getElementById("title");
const description = document.getElementById("description");
const submit = document.getElementById("submit");

let count = 0;
let lastCount = 0;

title.addEventListener("input", () => {
  localStorage.setItem("draft_title", title.value);
});

description.addEventListener("input", () => {
  localStorage.setItem("draft_description", description.value);
});


window.addEventListener("load", () => {
  const savedTitle = localStorage.getItem("draft_title");
  const savedDesc = localStorage.getItem("draft_description");

  if (savedTitle) title.value = savedTitle;
  if (savedDesc) description.value = savedDesc;
  const oldNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
  oldNotifs.forEach(msg => showNotification(msg, false));
});


function showNotification(message, save = true) {
  const container = document.getElementById("notifications");
  if (!container) return;
  const notif = document.createElement("div");
  notif.textContent = message;
  notif.style.background = "lightblue";
  notif.style.margin = "5px";
  notif.style.padding = "10px";
  notif.style.borderRadius = "5px";

  container.appendChild(notif);

  count++;
  const badge = document.getElementById("badge");
  if (badge) badge.textContent = count;
  if (save) {
    let stored = JSON.parse(localStorage.getItem("notifications")) || [];
    stored.push(message);
    localStorage.setItem("notifications", JSON.stringify(stored));
  }
  setTimeout(() => {
    notif.remove();
  }, 4000);
}

submit.addEventListener("click", async () => {
  const data = {
    title: title.value,
    description: description.value,
  };


  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(data);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  showNotification("Tâche créée avec succès !");


  title.value = "";
  description.value = "";
  localStorage.removeItem("draft_title");
  localStorage.removeItem("draft_description");
});

async function loadTasks() {
  try {
    const res = await fetch("http://localhost:3000/tasks");
    const tasks = await res.json();
    console.log("Liste des tâches serveur :", tasks);
  } catch (error) {
    console.error("Erreur lors du chargement des tâches :", error);
  }
}
window.addEventListener("load", loadTasks);

async function fetchNotifications() {
  try {
    const res = await fetch("http://localhost:3000/notifications");
    const data = await res.json();
    if (data.length > lastCount) {
      if (lastCount !== 0) {
        const latest = data[data.length - 1];
        showNotification(`Serveur : ${latest.message}`);
      }
      lastCount = data.length;
    }
  } catch (error) {
    console.error("Erreur polling :", error);
  }
}
fetchNotifications();
setInterval(fetchNotifications, 30000);
