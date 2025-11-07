const Movie = require('../models/movie');
const { movies, genres, actors } = require('../services/db');

// Variável global para ID de filme
if (!global.movieId) global.movieId = 1;

/**
 * Cria (registra) um novo filme.
 */
function createMovie(req, res) {
    const { title, genreId, actorIds } = req.body;
    
    // 1. Validação de campos obrigatórios
    if (!title || !genreId) {
        return res.status(400).json({ error: 'Título e gênero são obrigatórios' });
    }
    
    // 2. Validação de filme já existente
    if (movies.find(m => m.title === title)) {
        return res.status(409).json({ error: 'Filme já existe' });
    }

    // 3. Validação de Gênero existente
    const genre = genres.find(g => g.id === genreId);
    if (!genre) {
        return res.status(400).json({ error: 'Gênero não encontrado' });
    }

    // 4. Criação do filme
    const id = global.movieId++;
    const movie = new Movie(id, title, genreId, actorIds);
    movies.push(movie);
    
    // 5. Referenciar filme no gênero
    genre.movieIds.push(id);
    
    // 6. Resposta 201 Created
    res.status(201).json({
        id: movie.id,
        title: movie.title,
        genre: genre.name, 
        actorIds: movie.actorIds
    });
}

/**
 * Retorna a lista completa de filmes (protegida por autenticação).
 */
function listMovies(req, res) {
    res.json(movies);
}

/**
 * Retorna os detalhes de um filme específico pelo ID.
 */
function getMovie(req, res) { 
    const id = parseInt(req.params.id);
    const movie = movies.find(m => m.id === id); 

    if (!movie) {
        return res.status(404).json({ error: 'Filme não encontrado' });
    }

    res.status(200).json(movie);
}

/**
 * Deleta um filme pelo ID (protegido por Admin).
 */
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

// CRÍTICO: Exporta todas as funções com nomes diretos
module.exports = { 
    createMovie, 
    listMovies, 
    getMovie, 
    deleteMovie 
};
