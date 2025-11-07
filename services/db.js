// services/db.js - CORRIGIDO
// Banco de dados em memória
const users = []; // Ponto Único de armazenamento para Usuários e Administradores
// O array 'admins' foi removido para evitar confusão de armazenamento.

const movies = [];
const genres = [];
const actors = [];

module.exports = {
  users, // APENAS este array é exportado para conter todos os Users/Admins
  movies,
  genres,
  actors
};