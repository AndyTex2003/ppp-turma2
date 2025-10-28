// Modelo de Usuário
class User {
  constructor(id, username, password, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role; // 'admin' ou 'user'
  }
}
module.exports = User;
