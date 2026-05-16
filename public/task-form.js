const API_URL = "http://localhost:5000/api/tasks";

let currentPage = 1;
const LIMIT = 5;

async function loadTasks() {
  const search = document.getElementById("searchInput")?.value || "";
  const status = document.getElementById("statusSelect")?.value || "";
  const priority = document.getElementById("prioritySelect")?.value || "";

  let url = `${API_URL}?page=${currentPage}&limit=${LIMIT}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;
  if (priority) url += `&priority=${priority}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayTasks(data.data || []);
    displayPagination(data.page, data.totalPages);
  } catch (err) {
    console.error("Erreur:", err);
    document.getElementById("tasksList").innerHTML =
      "<p>❌ Erreur chargement</p>";
  }
}

function displayTasks(tasks) {
  const container = document.getElementById("tasksList");
  if (!tasks.length) {
    container.innerHTML = "<p>Aucune tâche trouvée.</p>";
    return;
  }

  container.innerHTML = tasks
    .map(
      (task) => `
        <div class="task-card">
            <strong>📌 ${escapeHtml(task.title)}</strong> (${task.priority}) - ${task.status}<br>
            📁 Projet: ${task.project}<br>
            👤 Assignée à: ${task.assignedTo || "non assignée"}<br>
            🕒 Créée le: ${new Date(task.createdAt).toLocaleDateString()}<br>
            <button onclick="deleteTask('${task._id}')" class="danger">🗑️ Supprimer</button>
            <button onclick="updateStatus('${task._id}', 'en cours')" class="success">🔄 En cours</button>
            <button onclick="updateStatus('${task._id}', 'terminé')" class="success">✅ Terminer</button>
            <a href="task-form.html?id=${task._id}">✏️ Modifier</a>
        </div>
    `,
    )
    .join("");
}

function displayPagination(current, total) {
  const container = document.getElementById("paginationControls");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === current;
    btn.onclick = () => {
      currentPage = i;
      loadTasks();
    };
    container.appendChild(btn);
  }
}

window.deleteTask = async (id) => {
  if (confirm("Supprimer cette tâche ?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTasks();
  }
};

window.updateStatus = async (id, newStatus) => {
  await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  loadTasks();
};

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const applyBtn = document.getElementById("applyFiltersBtn");
  if (applyBtn)
    applyBtn.addEventListener("click", () => {
      currentPage = 1;
      loadTasks();
    });
  loadTasks();
});
