const STORAGE_KEY = 'taskDraft';

const form = document.getElementById('taskForm');
const title = document.getElementById('title');
const description = document.getElementById('description');
const priority = document.getElementById('priority');
const status = document.getElementById('status');
const messageDiv = document.getElementById('message');

// Récupérer le token depuis l'URL et le stocker
const urlToken = new URLSearchParams(window.location.search).get('token');
if (urlToken) {
  localStorage.setItem('token', urlToken);
  messageDiv.innerText = '✅ Token stocké depuis l\'URL';
  setTimeout(() => messageDiv.innerText = '', 2000);
  // Nettoyer l'URL pour ne plus avoir ?token
  window.history.replaceState({}, '', '/task-form');
}

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

// SOUMISSION VERS L'API (avec token)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let token = localStorage.getItem('token');

  if (!token) {
    messageDiv.innerText = '❌ Vous devez être connecté (token manquant)';
    setTimeout(() => messageDiv.innerText = '', 3000);
    return;
  }

  const task = {
    title: title.value,
    description: description.value,
    priority: priority.value,
    status: status.value
  };

  try {
    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(task)
    });

    if (response.ok) {
      localStorage.removeItem(STORAGE_KEY);
      messageDiv.innerText = '✅ Tâche créée avec succès !';
      form.reset();
    } else {
      const error = await response.json();
      messageDiv.innerText = '❌ Erreur : ' + (error.message || 'Erreur inconnue');
    }
  } catch (err) {
    messageDiv.innerText = '❌ Erreur réseau : API indisponible ?';
  }

  setTimeout(() => messageDiv.innerText = '', 3000);
});