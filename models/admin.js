// Modelo de Administrador (herda de User)
const User = require('./user');
class Admin extends User {
  constructor(id, username, password) {
    super(id, username, password, 'admin');
  }
}
module.exports = Admin;
