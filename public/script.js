const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

const title = document.getElementById("title");
const description = document.getElementById("description");
const submit = document.getElementById("submit");
const id_projet = "projet123";

let notificationsEnMemoire = [];



title.addEventListener("input", () => {
    localStorage.setItem(`draft_title_${id_projet}`, title.value);
});

description.addEventListener("input", () => {
    localStorage.setItem(`draft_desc_${id_projet}`, description.value);
});

window.addEventListener("load", () => {
    const savedTitle = localStorage.getItem(`draft_title_${id_projet}`);
    const savedDesc = localStorage.getItem(`draft_desc_${id_projet}`);

    if (savedTitle || savedDesc) {
        const restore = confirm("Un brouillon a été trouvé. Voulez-vous le restaurer ?");
        if (restore) {
            if (savedTitle) title.value = savedTitle;
            if (savedDesc) description.value = savedDesc;
        } else {
            localStorage.removeItem(`draft_title_${id_projet}`);
            localStorage.removeItem(`draft_desc_${id_projet}`);
        }
    }
});

submit.addEventListener("click", async () => {
    if (!title.value.trim()) return;

    try {
        const data = {
            title: title.value,
            description: description.value
        };

        await api.post("/tasks", data);

        localStorage.removeItem(`draft_title_${id_projet}`);
        localStorage.removeItem(`draft_desc_${id_projet}`);

        title.value = "";
        description.value = "";

        alert("Tâche créée avec succès !");

    } catch (error) {
        console.error("Erreur lors de la création :", error);
    }
});



function showNotification(message) {
    const container = document.getElementById("notif-container");
    if (!container) return;

    const notif = document.createElement("div");
    notif.className = "notif-item";
    notif.textContent = message;

    container.prepend(notif);

    let archived = JSON.parse(localStorage.getItem("archived")) || [];
    archived.push({ message, date: new Date().toISOString() });
    localStorage.setItem("archived", JSON.stringify(archived));
}

async function fetchNotifications() {
    try {
        const res = await api.get("/notifications");
        const data = res.data;

        notificationsEnMemoire = data;

        const badge = document.getElementById("notif-badge");
        if (badge) badge.textContent = data.filter(n => !n.read).length;

        if (data.length > 0) {
            showNotification(data[0].message);
        }

    } catch (error) {
        console.error("Erreur polling :", error);
    }
}

async function markAsRead(id) {
    try {
        await api.patch(`/notifications/${id}/read`);

        const badge = document.getElementById("notif-badge");
        if (badge) {
            let current = parseInt(badge.textContent) || 0;
            if (current > 0) badge.textContent = current - 1;
        }

    } catch (error) {
        console.error("Erreur mark as read :", error);
    }
}

setInterval(fetchNotifications, 30000);
fetchNotifications();