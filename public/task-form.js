const STORAGE_KEY = 'taskDraft';

const token = localStorage.getItem('token');
const messageDiv = document.getElementById('message');

if (!token) {
    messageDiv.innerText = ' Token manquant : utilise token=... dans l\'URL ou connecte-toi';
}

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value
    };

    try {
        const res = await fetch('http://localhost:5000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(task)
        });

        if (!res.ok) {
            const error = await res.json();
            messageDiv.innerText = '❌ Erreur HTTP : ' + (error.message || res.status);
            return;
        }

        messageDiv.innerText = '✅ Tâche créée !';
        localStorage.removeItem(STORAGE_KEY);
        document.getElementById('taskForm').reset();
    } catch (err) {
        messageDiv.innerText = ' Erreur reseau : ' + err.message;
    }
});

// Sauvegarde auto
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
        messageDiv.innerText = '📂 Brouillon restauré';
        setTimeout(() => messageDiv.innerText = '', 1500);
    } else {
        messageDiv.innerText = 'Aucun brouillon trouvé';
    }
});

document.getElementById('clearBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    fields.forEach(f => document.getElementById(f).value = '');
    messageDiv.innerText = '🗑️ Brouillon effacé';
    setTimeout(() => messageDiv.innerText = '', 1000);
});