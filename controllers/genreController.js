const Genre = require('../models/genre');
const { genres } = require('../services/db');

// Variável global para ID de gênero
if (!global.genreId) global.genreId = 1;

/**
 * Registra (cria) um novo gênero.
 */
function registerGenre(req, res) {
    const { name } = req.body;

    // 1. Validação de campo obrigatório
    if (!name) {
        return res.status(400).json({ error: 'Nome do gênero é obrigatório' });
    }

    // 2. Validação de gênero já existente
    if (genres.find(g => g.name.toLowerCase() === name.toLowerCase())) {
        return res.status(409).json({ error: 'Gênero já existe' });
    }

    // 3. Criação do gênero
    const id = global.genreId++;
    const newGenre = new Genre(id, name);
    genres.push(newGenre);

    // 4. Resposta 201 Created
    res.status(201).json({ 
        id: newGenre.id, 
        name: newGenre.name, 
        movieIds: newGenre.movieIds 
    });
}

/**
 * Lista todos os gêneros.
 */
function listGenres(req, res) {
    // Retorna a lista de gêneros completa
    res.status(200).json(genres);
}

/**
 * Deleta um gênero pelo ID.
 */
function deleteGenre(req, res) {
    const id = parseInt(req.params.id);
    const index = genres.findIndex(g => g.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Gênero não encontrado' });
    }

    const genre = genres[index];
    
    // 1. Verifica se existem filmes associados
    if (genre.movieIds.length > 0) {
        return res.status(400).json({ error: 'Não é possível deletar gênero com filmes associados.' });
    }

    // 2. Deleta o gênero
    genres.splice(index, 1);
    
    // 3. Resposta 204 No Content
    res.status(204).send();
}

// CRÍTICO: Exporta todas as funções
module.exports = {
    registerGenre,
    listGenres,
    deleteGenre
};
