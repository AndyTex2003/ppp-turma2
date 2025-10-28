// Serviço de autenticação
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';
const { users, admins } = require('./db');

function authenticate(username, password, role) {
  const list = role === 'admin' ? admins : users;
  const user = list.find(u => u.username === username && u.password === password);
  if (!user) return null;
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  return { token };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { authenticate, verifyToken, SECRET };
