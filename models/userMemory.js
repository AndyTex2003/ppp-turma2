// models/userMemory.js
const { v4: uuidv4 } = require('uuid');

let users = [];

class UserMemoryModel {
  static async create({ username, password, role = 'user' }) {
    const newUser = {
      id: uuidv4(),
      username,
      password,
      role
    };
    users.push(newUser);
    return newUser;
  }

  static async findOne({ where }) {
    return users.find(u =>
      Object.entries(where).every(([key, value]) => u[key] === value)
    );
  }

  static async findAll() {
    return users;
  }

  static async destroy({ where }) {
    const index = users.findIndex(u =>
      Object.entries(where).every(([key, value]) => u[key] === value)
    );
    if (index !== -1) {
      users.splice(index, 1);
      return 1;
    }
    return 0;
  }

  // opcional: para testes, reinicia a memória
  static reset() {
    users = [];
  }
}

module.exports = UserMemoryModel;