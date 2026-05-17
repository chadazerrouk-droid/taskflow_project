# TaskFlow — Application de gestion de projets collaboratifs

## Description
TaskFlow est une application web fullstack de gestion de projets collaboratifs développée avec JavaScript, Express, MongoDB et Docker.

## Lancer le projet
```bash
docker-compose up --build
```

## Équipe et répartition des fonctionnalités

| Étudiant | Nom complet | Fonctionnalités | Rôle transverse |
|----------|-------------|-----------------|-----------------|
| E1 | Chada Zerrouk | Authentification des utilisateurs (JWT/bcrypt) · Gestion des projets (CRUD) | Sécurité |
| E2 | Maroua Mahrach : Chef de projet | Gestion des tâches (CRUD) · Filtrage, recherche et pagination | Git & Coordination |
| E3 | Maroua Chakroun | Assignation des tâches aux membres · Tableau de bord avec agrégations MongoDB | Docker & MongoDB |
| E4 | Zainab Elkharraz | Notifications et polling · Sauvegarde automatique des brouillons | UI & LocalStorage |
| E5 | Bassma Aroudam | Gestion des membres et invitations · Historique des activités | Agrégations & monitoring |

## Stack technique
- **Backend** : Node.js · Express.js
- **Base de données** : MongoDB dans Docker
- **Authentification** : JWT + bcryptjs
- **Conteneurisation** : Docker Compose
