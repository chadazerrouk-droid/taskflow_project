const title = document.getElementById("title");
const description = document.getElementById("description");
const submit = document.getElementById("submit");
const id_projet = "projet123";

title.addEventListener("input", () => {
  localStorage.setItem(`draft_title_${id_projet}`, title.value);
});

description.addEventListener("input", () => {
  localStorage.setItem(`draft_desc_${id_projet}`, description.value);
});

window.addEventListener("load", () => {
  const savedTitle = localStorage.getItem(`draft_title_${id_projet}`);
  const savedDesc = localStorage.getItem(`draft_desc_${id_projet}`);

  if (savedTitle) title.value = savedTitle;
  if (savedDesc) description.value = savedDesc;

  const oldNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
  oldNotifs.forEach(n => showNotification(n, false));
});




function showNotification(notification, save = true) {

  const container = document.getElementById("notif-container");
  if (!container) return;

  const notif = document.createElement("div");
  notif.className = "notif-item";

  const message =
    typeof notification === "string"
      ? notification
      : notification.message;

  const id =
    typeof notification === "object"
      ? notification.id
      : null;

  notif.textContent = message;

  if (id) notif.dataset.id = id;

  notif.onclick = async () => {
    try {
      if (id) {
        await api.patch(`/notifications/${id}/read`);
      }
    } catch (err) {
      console.error("Erreur PATCH read :", err);
    }

    archiveNotification(notif);
    notif.remove();
  };

  container.appendChild(notif);


  if (save) {
    let stored = JSON.parse(localStorage.getItem("notifications")) || [];
    stored.push(message);
    localStorage.setItem("notifications", JSON.stringify(stored));
  }

  setTimeout(() => notif.remove(), 5000);
}



async function fetchNotifications() {
  try {
    const res = await api.get("/notifications");
    const data = res.data;

    const badge = document.getElementById("notif-badge");
    if (badge) badge.textContent = data.length;

    if (data.length > 0) {
      const latest = data[0];

      showNotification({
        id: latest._id,
        message: latest.message
      });
    }

  } catch (error) {
    console.error("Erreur polling :", error);
  }
}

fetchNotifications();
setInterval(fetchNotifications, 30000);


function archiveNotification(notification) {
  let archived = JSON.parse(localStorage.getItem("archived")) || [];

  archived.push({
    message: notification.textContent,
    date: new Date().toISOString()
  });

  localStorage.setItem("archived", JSON.stringify(archived));
}


submit.addEventListener("click", async () => {

  const data = {
    title: title.value,
    description: description.value,
  };

  showNotification("Tâche créée avec succès !");

  try {
    await api.post("/tasks", data);

    title.value = "";
    description.value = "";

    localStorage.removeItem(`draft_title_${id_projet}`);
    localStorage.removeItem(`draft_desc_${id_projet}`);

  } catch (error) {
    console.error("Erreur création tâche :", error);
    alert("Serveur non disponible");
  }
});

async function loadTasks() {
  try {
    const res = await api.get("/tasks");
    console.log("Tasks:", res.data);
  } catch (error) {
    console.error("Erreur tasks :", error);
  }
}

window.addEventListener("load", loadTasks);

