# TaskFlow 

Application web fullstack de gestion de projets collaboratifs.

## Groupe

| Membre | Rôle | Fonctionnalités |
|--------|------|-----------------|
| Chada Zerrouk (E1) | Sécurité | Authentification JWT/bcrypt + Gestion des projets CRUD |
| Maroua Mahrach (E2) | Git & Coordination | Gestion des tâches + Filtrage, recherche, pagination |
| Maroua Chakron (E3) | Docker & MongoDB | Assignation des tâches + Tableau de bord |
| Zainab Elkharraz (E4) | UI & LocalStorage | Notifications + Brouillons |
| Basma Aroudam (E5) | Agrégations & monitoring | Gestion des membres + Historique des activités |

## Stack technique

- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB + Mongoose
- **Authentification** : JWT + bcrypt
- **Frontend** : HTML, CSS, JavaScript vanilla
- **Infrastructure** : Docker + Docker Compose
- **Versioning** : Git + GitHub (Conventional Commits)

## Installation

### Prérequis
- Node.js
- Docker & Docker Compose

### Lancer le projet

```bash
# Cloner le dépôt
git clone https://github.com/chadazerrouk-droid/taskflow_project.git
cd taskflow_project

# Créer le fichier .env
cp .env.example .env

# Lancer avec Docker
docker-compose up --build
```

### Sans Docker

```bash
npm install
node server.js
```

## Variables d'environnement

Créer un fichier `.env` à la racine :
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
## Répartition des fonctionnalités

| Membre | Fonctionnalité 1 | Fonctionnalité 2 | Rôle transverse |
|--------|-----------------|-----------------|-----------------|
| E1 - Chada Zerrouk | Authentification JWT/bcrypt | Gestion des projets CRUD | Sécurité |
| E2 - Maroua Mahrach | Gestion des tâches CRUD | Filtrage, recherche, pagination | Git & Coordination |
| E3 - Maroua Chakron | Assignation des tâches | Tableau de bord agrégations | Docker & MongoDB |
| E4 - Zainab Elkharraz | Notifications + Polling | Brouillons LocalStorage | UI & LocalStorage |
| E5 - Basma Aroudam | Gestion des membres | Historique des activités | Agrégations & monitoring |

## API Routes

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |

### Projets
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/projects | Liste paginée |
| POST | /api/projects | Créer un projet |
| GET | /api/projects/:id | Détail d'un projet |
| PUT | /api/projects/:id | Modifier un projet |
| DELETE | /api/projects/:id | Supprimer avec cascade |

### Tâches
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/tasks | Liste avec filtres et pagination |
| POST | /api/tasks | Créer une tâche |
| GET | /api/tasks/:id | Détail d'une tâche |
| PUT | /api/tasks/:id | Modifier une tâche |
| DELETE | /api/tasks/:id | Supprimer une tâche |
| PATCH | /api/tasks/:id/status | Changer le statut |
| PATCH | /api/tasks/:id/assign | Assigner à un membre |

### Membres
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/projects/:id/members/invite | Inviter par email |
| GET | /api/projects/:id/members | Liste des membres |
| DELETE | /api/projects/:id/members/:memberId | Retirer un membre |

### Notifications
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/notifications | Liste des notifications |
| POST | /api/notifications | Créer une notification |
| PATCH | /api/notifications/:id/read | Marquer comme lue |

### Dashboard
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/dashboard | Métriques agrégées |

### Activités
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/projects/:id/activities | Historique du projet |

## Workflow Git

- `main` — code stable et validé
- `develop` — intégration du travail de l'équipe
- `feature/*` — une branche par membre

Les fusions vers `develop` se font uniquement via **Pull Requests** relues par au moins un membre.

## Convention de commits
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
refactor: refactoring
chore: maintenance
## Structure du projet
taskflow/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   ├── dashboardController.js
│   └── memberController.js
├── middleware/
│   ├── authMiddleware.js
│   └── validateTask.js
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   ├── Notification.js
│   └── Activity.js
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── tasks.js
│   ├── memberRoutes.js
│   ├── activityRoutes.js
│   ├── notificationRoutes.js
│   └── dashboardRoutes.js
├── public/
│   ├── login.html
│   ├── task-form.html
│   ├── task-form.js
│   ├── tasks.html
│   └── style.css
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── server.js