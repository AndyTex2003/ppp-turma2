// Modelo de Administrador (herda de User)
const User = require('./user');

class Admin extends User {
  constructor(id, username, password, role) { // <-- AGORA ACEITA 4 ARGUMENTOS
    super(id, username, password, 'admin'); // <-- FORÇA a role 'admin'
  }
}
module.exports = Admin;