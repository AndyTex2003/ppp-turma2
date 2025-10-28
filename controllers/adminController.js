// Controller de Administrador
const Admin = require('../models/admin');
const { admins } = require('../services/db');

function registerAdmin(req, res) {
  const { username, password } = req.body;
  if (admins.find(a => a.username === username)) {
    return res.status(409).json({ error: 'Administrador já existe' });
  }
  const id = admins.length + 1;
  const admin = new Admin(id, username, password);
  admins.push(admin);
  res.status(201).json({ id: admin.id, username: admin.username });
}

function listAdmins(req, res) {
  res.json(admins.map(a => ({ id: a.id, username: a.username })));
}

module.exports = { registerAdmin, listAdmins };
