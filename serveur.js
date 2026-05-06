const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Nettoyer l'URL : on enlève tout ce qui est après le '?'
  const cleanUrl = req.url.split('?')[0];
  console.log('URL demandée (nettoyée) :', cleanUrl);

  // Servir le formulaire HTML
  if (cleanUrl === '/' || cleanUrl === '/task-form') {
    const filePath = path.join(__dirname, 'public', 'task-form.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Fichier HTML non trouvé');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  // Servir le JavaScript
  else if (cleanUrl === '/task-form.js') {
    const filePath = path.join(__dirname, 'public', 'task-form.js');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Fichier JS non trouvé');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  }
  else {
    res.writeHead(404);
    res.end('Page non trouvée');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ Serveur frontend sur http://localhost:${PORT}/task-form`);
});