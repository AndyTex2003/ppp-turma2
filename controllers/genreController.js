function deleteGenre(req, res) {
  const id = parseInt(req.params.id);
  const index = genres.findIndex(g => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Gênero não encontrado' });
  }
  genres.splice(index, 1);
  res.status(204).send();
}
// Controller de Gênero
const Genre = require('../models/genre');
const { genres } = require('../services/db');

function registerGenre(req, res) {
  const { name } = req.body;
  if (genres.find(g => g.name === name)) {
    return res.status(409).json({ error: 'Gênero já existe' });
  }
  if (!global.genreId) global.genreId = 1;
  const id = global.genreId++;
  const genre = new Genre(id, name);
  genres.push(genre);
  res.status(201).json(genre);
}

function listGenres(req, res) {
  res.json(genres);
}

module.exports = { registerGenre, listGenres, deleteGenre };
