const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  console.log('URL demandée :', cleanUrl);

  const pages = {
    '/': 'login.html',
    '/login': 'login.html',
    '/task-form': 'task-form.html',
    '/dashboard': 'dashboard.html',
    '/tasks': 'tasks.html',
    '/project-details': 'project-details.html',
    '/test': 'test.html'
  };

  if (pages[cleanUrl]) {
    const filePath = path.join(__dirname, 'public', pages[cleanUrl]);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Fichier HTML non trouvé');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (cleanUrl.endsWith('.js')) {
    const filePath = path.join(__dirname, 'public', cleanUrl);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('JS non trouvé'); }
      else { res.writeHead(200, { 'Content-Type': 'application/javascript' }); res.end(data); }
    });
  } else if (cleanUrl.endsWith('.css')) {
    const filePath = path.join(__dirname, 'public', cleanUrl);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('CSS non trouvé'); }
      else { res.writeHead(200, { 'Content-Type': 'text/css' }); res.end(data); }
    });
  } else {
    res.writeHead(404);
    res.end('Page non trouvée');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ Serveur frontend sur http://localhost:${PORT}`);
});