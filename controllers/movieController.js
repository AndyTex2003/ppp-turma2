function deleteMovie(req, res) {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }
  // Remover referência do gênero
  const movie = movies[index];
  const genre = genres.find(g => g.id === movie.genreId);
  if (genre) {
    genre.movieIds = genre.movieIds.filter(mid => mid !== id);
  }
  movies.splice(index, 1);
  res.status(204).send();
}
// Controller de Filme
const Movie = require('../models/movie');
const { movies, genres, actors } = require('../services/db');

function registerMovie(req, res) {
  const { title, genreId, actorIds } = req.body;
  if (!title || !genreId) {
    return res.status(400).json({ error: 'Título e gênero são obrigatórios' });
  }
  if (movies.find(m => m.title === title)) {
    return res.status(409).json({ error: 'Filme já existe' });
  }
  if (!global.movieId) global.movieId = 1;
  const id = global.movieId++;
  const movie = new Movie(id, title, genreId, actorIds);
  movies.push(movie);
  // Referenciar filme no gênero
  const genre = genres.find(g => g.id === genreId);
  if (genre) {
    genre.movieIds.push(id);
    res.status(201).json({
      id: movie.id,
      title: movie.title,
      genre: genre.name,
      actorIds: movie.actorIds
    });
  } else {
    res.status(400).json({ error: 'Gênero não encontrado' });
  }
}

function listMovies(req, res) {
  res.json(movies);
}

module.exports = { registerMovie, listMovies, deleteMovie };
