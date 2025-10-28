// Controller de Usuário
const User = require('../models/user');
const { users } = require('../services/db');

function registerUser(req, res) {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Usuário já existe' });
  }
  const id = users.length + 1;
  const user = new User(id, username, password, 'user');
  users.push(user);
  res.status(201).json({ id: user.id, username: user.username });
}

function listUsers(req, res) {
  res.json(users.map(u => ({ id: u.id, username: u.username })));
}

module.exports = { registerUser, listUsers };
