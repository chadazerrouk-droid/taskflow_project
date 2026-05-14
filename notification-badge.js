// notification-badge.js

const NOTIF_API = 'http://localhost:3000/api/notifications';
const STORAGE_KEY = 'read_notifications';

// Récupérer toutes les notifications
async function fetchNotifications() {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
        const response = await fetch(NOTIF_API, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Erreur fetch notifications:', error);
        return [];
    }
}

// Récupérer le nombre de notifications non lues
async function fetchUnreadCount() {
    const notifications = await fetchNotifications();
    const readIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const unread = notifications.filter(n => !readIds.includes(n._id));
    return unread.length;
}

// Mettre à jour le badge
async function updateBadge() {
    const count = await fetchUnreadCount();
    const badge = document.getElementById('notification-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Marquer une notification comme lue
async function markAsRead(notifId) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${NOTIF_API}/${notifId}/read`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const readIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (!readIds.includes(notifId)) {
            readIds.push(notifId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
        }
        
        updateBadge();
        renderNotificationsPanel();
    } catch (error) {
        console.error('Erreur mark as read:', error);
    }
}

// Afficher le panel des notifications
async function renderNotificationsPanel() {
    const notifications = await fetchNotifications();
    const readIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const panel = document.getElementById('notificationsList');
    const container = document.getElementById('notificationsPanel');
    
    if (!panel) return;
    
    if (notifications.length === 0) {
        panel.innerHTML = '<div style="padding: 15px; text-align: center; color: #999;">Aucune notification</div>';
        return;
    }
    
    panel.innerHTML = notifications.map(notif => {
        const isUnread = !readIds.includes(notif._id);
        return `
            <div class="notification-item ${isUnread ? 'unread' : ''}" onclick="markAsRead('${notif._id}')">
                <div class="notification-title">${notif.message || 'Notification'}</div>
                <div class="notification-date">${new Date(notif.createdAt).toLocaleString()}</div>
            </div>
        `;
    }).join('');
    
    // Rendre markAsRead accessible globalement
    window.markAsRead = markAsRead;
}

// Polling toutes les 30 secondes
function startPolling() {
    setInterval(() => {
        updateBadge();
        renderNotificationsPanel();
    }, 30000);
}

// Toggle panel
function toggleNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
        panel.classList.toggle('show');
        if (panel.classList.contains('show')) {
            renderNotificationsPanel();
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    startPolling();
    
    const icon = document.getElementById('notificationIcon');
    if (icon) {
        icon.addEventListener('click', toggleNotificationsPanel);
    }
    
    // Fermer le panel en cliquant ailleurs
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('notificationsPanel');
        const icon = document.getElementById('notificationIcon');
        if (panel && icon) {
            if (!icon.contains(e.target) && !panel.contains(e.target)) {
                panel.classList.remove('show');
            }
        }
    });
});