const API_URL = "http://localhost:3000/api/tasks";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };
}

function getDraftKey(projectId) {
  return "task_draft_" + projectId;
}

function autoSave() {
  const projectId = document.getElementById("projectId").value.trim();
  if (!projectId) return;

  const draft = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
    projectId,
    date: new Date().toISOString()
  };

  localStorage.setItem(getDraftKey(projectId), JSON.stringify(draft));
}

function checkDraft() {
  const projectId = document.getElementById("projectId").value.trim();
  if (!projectId) return;

  const saved = localStorage.getItem(getDraftKey(projectId));
  document.getElementById("restoreBox").style.display = saved ? "block" : "none";
}

function restoreDraft() {
  const projectId = document.getElementById("projectId").value.trim();
  const saved = localStorage.getItem(getDraftKey(projectId));
  if (!saved) return;

  const draft = JSON.parse(saved);
  document.getElementById("title").value = draft.title || "";
  document.getElementById("description").value = draft.description || "";
  document.getElementById("priority").value = draft.priority || "moyenne";
  document.getElementById("status").value = draft.status || "à faire";
  document.getElementById("restoreBox").style.display = "none";
  showMessage("success", "Brouillon restauré ✅");
}

function discardDraft() {
  const projectId = document.getElementById("projectId").value.trim();
  localStorage.removeItem(getDraftKey(projectId));
  document.getElementById("restoreBox").style.display = "none";
  showMessage("success", "Brouillon ignoré");
}

function showMessage(type, text) {
  const msgDiv = document.getElementById("message");
  msgDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
  setTimeout(() => { msgDiv.innerHTML = ""; }, 3000);
}

async function submitTask(e) {
  e.preventDefault();

  const projectId = document.getElementById("projectId").value.trim();
  const taskData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
    project: projectId
  };

  if (!taskData.title || !taskData.project) {
    showMessage("error", "Le titre et l'ID projet sont obligatoires");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),  // ← token JWT inclus
      body: JSON.stringify(taskData)
    });

    if (response.ok) {
      const result = await response.json();
      showMessage("success", "Tâche créée ! ID: " + result._id);
      localStorage.removeItem(getDraftKey(projectId));

      // Reset formulaire
      document.getElementById("taskForm").reset();
    } else {
      const error = await response.json();
      showMessage("error", "Erreur: " + error.message);
    }
  } catch (err) {
    showMessage("error", "Erreur réseau: " + err.message);
  }
}

// Events
document.getElementById("taskForm").addEventListener("submit", submitTask);
document.getElementById("restoreBtn").addEventListener("click", restoreDraft);
document.getElementById("discardBtn").addEventListener("click", discardDraft);
document.getElementById("title").addEventListener("input", autoSave);
document.getElementById("description").addEventListener("input", autoSave);
document.getElementById("priority").addEventListener("change", autoSave);
document.getElementById("status").addEventListener("change", autoSave);
document.getElementById("projectId").addEventListener("input", () => {
  autoSave();
  checkDraft();
});