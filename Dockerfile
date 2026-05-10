# Utilise une version stable de Node
FROM node:20

# Dossier de travail dans le conteneur
WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des modules
RUN npm install

# Copie tout le reste du code
COPY . .

# Port exposé
EXPOSE 5001

# Commande de démarrage
CMD ["npm", "start"]