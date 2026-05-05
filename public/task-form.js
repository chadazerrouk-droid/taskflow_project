const STORAGE_KEY = 'taskDraft';

const form = document.getElementById('taskForm');
const title = document.getElementById('title');
const description = document.getElementById('description');
const priority = document.getElementById('priority');
const status = document.getElementById('status');
const messageDiv = document.getElementById('message');

// Sauvegarde auto à chaque modification
[title, description, priority, status].forEach(field => {
  field.addEventListener('input', () => {
    const draft = {
      title: title.value,
      description: description.value,
      priority: priority.value,
      status: status.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    messageDiv.innerText = '✅ Brouillon sauvegardé';
    setTimeout(() => messageDiv.innerText = '', 1000);
  });
});

// Restaurer le brouillon
document.getElementById('restoreBtn').addEventListener('click', () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const draft = JSON.parse(raw);
    title.value = draft.title || '';
    description.value = draft.description || '';
    priority.value = draft.priority || 'moyenne';
    status.value = draft.status || 'à faire';
    messageDiv.innerText = '📂 Brouillon restauré';
  } else {
    messageDiv.innerText = 'Aucun brouillon trouvé';
  }
  setTimeout(() => messageDiv.innerText = '', 1500);
});

// Effacer le brouillon
document.getElementById('clearBtn').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  messageDiv.innerText = '🗑️ Brouillon effacé';
  setTimeout(() => messageDiv.innerText = '', 1000);
});

// À la soumission, supprimer le brouillon
form.addEventListener('submit', (e) => {
  e.preventDefault();
  localStorage.removeItem(STORAGE_KEY);
  messageDiv.innerText = '✅ Tâche envoyée (brouillon supprimé)';
  // Ici on appellera plus tard l'API pour créer la tâche
});