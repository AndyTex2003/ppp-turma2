const express = require('express');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'segredo123';

// ===== Banco de dados fake =====
const users = [];
const genres = [];
const movies = [];
let genreIdCounter = 1;
let movieIdCounter = 1;

// ===== Middlewares =====
app.use(express.json());

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.sendStatus(403);
  next();
}

// ===== Rotas =====

// Registro de usuários
app.post('/users/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'Usuário já existe' });
  const user = { id: users.length + 1, username, password, role: 'user' };
  users.push(user);
  res.status(201).json(user);
});

// Registro de admin
app.post('/admins/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'Admin já existe' });
  const admin = { id: users.length + 1, username, password, role: 'admin' };
  users.push(admin);
  res.status(201).json(admin);
});

// Login (user ou admin)
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY);
  res.json({ token });
});

// ===== Gêneros =====
app.post('/genres/register', authMiddleware, adminMiddleware, (req, res) => {
  const { name } = req.body;
  if (genres.find(g => g.name === name)) return res.status(409).json({ error: 'Gênero já existe' });
  const genre = { id: genreIdCounter++, name };
  genres.push(genre);
  res.status(201).json(genre);
});

app.get('/genres', authMiddleware, (req, res) => res.json(genres));

app.delete('/genres/:id', authMiddleware, adminMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = genres.findIndex(g => g.id === id);
  if (index === -1) return res.sendStatus(404);
  genres.splice(index, 1);
  res.sendStatus(204);
});

// ===== Filmes =====
app.post('/movies/register', authMiddleware, adminMiddleware, (req, res) => {
  const { title, genreId, actorIds } = req.body;
  if (!title || !genreId || !actorIds) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  const movie = { id: movieIdCounter++, title, genreId, actorIds };
  movies.push(movie);
  res.status(201).json(movie);
});

app.get('/movies', authMiddleware, (req, res) => res.json(movies));

app.delete('/movies/:id', authMiddleware, adminMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return res.sendStatus(404);
  movies.splice(index, 1);
  res.sendStatus(204);
});

// ===== Rota admin protegida =====
app.get('/admins', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: 'Acesso permitido para admins' });
});

// ===== Rota principal =====
app.get('/', (req, res) => res.send('API de Filmes em execução!'));

// ===== Swagger embutido =====
const swaggerDocument = {
  "openapi": "3.0.0",
  "info": {
    "title": "API Catálogo de Filmes",
    "version": "1.0.0",
    "description": "API para registro e consulta de filmes e gêneros. Autenticação via JWT."
  },
  "paths": {
    "/auth/login": { "post": { "summary": "Login de usuário ou administrador" } },
    "/admins/register": { "post": { "summary": "Registrar administrador" } },
    "/users/register": { "post": { "summary": "Registrar usuário" } },
    "/movies/register": { "post": { "summary": "Registrar filme (admin)" } },
    "/movies": { "get": { "summary": "Listar filmes (autenticado)" } },
    "/movies/{id}": { "delete": { "summary": "Deletar filme (admin)" } },
    "/genres/register": { "post": { "summary": "Registrar gênero (admin)" } },
    "/genres": { "get": { "summary": "Listar gêneros (autenticado)" } },
    "/genres/{id}": { "delete": { "summary": "Deletar gênero (admin)" } }
  },
  "components": {
    "schemas": {},
    "securitySchemes": { "bearerAuth": { "type": "http", "scheme": "bearer", "bearerFormat": "JWT" } }
  },
  "security": [{ "bearerAuth": [] }]
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ===== Inicia servidor =====
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;