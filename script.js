const title = document.getElementById("title");
const description = document.getElementById("description");
const submit = document.getElementById("submit");

let count = 0;
//brouillon

title.addEventListener("input", () => {
  localStorage.setItem("draft_title", title.value);
});

description.addEventListener("input", () => {
  localStorage.setItem("draft_description", description.value);
});

//restauration
window.addEventListener("load", () => {
  const savedTitle = localStorage.getItem("draft_title");
  const savedDesc = localStorage.getItem("draft_description");

  if (savedTitle) title.value = savedTitle;
  if (savedDesc) description.value = savedDesc;

  // charger anciennes notifications
  const oldNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
  oldNotifs.forEach(msg => showNotification(msg, false));
});

//notif

function showNotification(message, save = true) {
  const container = document.getElementById("notifications");

  const notif = document.createElement("div");
  notif.textContent = message;
  notif.style.background = "lightblue";
  notif.style.margin = "5px";
  notif.style.padding = "10px";

  container.appendChild(notif);

  count++;
  document.getElementById("badge").textContent = count;

  // sauvegarde localStorage
  if (save) {
    let stored = JSON.parse(localStorage.getItem("notifications")) || [];
    stored.push(message);
    localStorage.setItem("notifications", JSON.stringify(stored));
  }

  setTimeout(() => {
    notif.remove();
  }, 3000);
}
//bouton

submit.addEventListener("click", async() => {
   submit.addEventListener("click", () => {
        const data = {
        title: title.value,
        description: description.value,
    };

  // simulation "succès"
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(data);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        showNotification("Tâche créée avec succès !");

        title.value = "";
         description.value = "";
    });
});
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(task => {
    console.log(task);
  });
}
console.log("API TEST:", api);
