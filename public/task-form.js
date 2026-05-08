const STORAGE_KEY = 'taskDraft';

const token = localStorage.getItem('token');
if (!token) alert('⚠️ Token manquant : rafraîchis avec ?token=... ou stocke-le dans localStorage');

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value
    };

    const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(task)
    });

    const data = await res.json();
    document.getElementById('message').innerText = res.ok ? '✅ Tâche créée' : '❌ Erreur : ' + data.message;
});

// Restauration / sauvegarde auto (à garder)
const fields = ['title', 'description', 'priority', 'status'];
fields.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
        const draft = {};
        fields.forEach(f => draft[f] = document.getElementById(f).value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    });
});

document.getElementById('restoreBtn').addEventListener('click', () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        const draft = JSON.parse(raw);
        fields.forEach(f => document.getElementById(f).value = draft[f] || '');
    }
});

document.getElementById('clearBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    fields.forEach(f => document.getElementById(f).value = '');
});