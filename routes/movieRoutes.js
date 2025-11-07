const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); 
const { 
    createMovie, 
    listMovies, 
    getMovie, 
    deleteMovie 
} = require('../controllers/movieController');

// 1. Criar Filme (POST - Protegido: Admin)
router.post('/', [verifyToken, isAdmin], createMovie); 

// 2. Listar Filmes (GET - Protegido: Todos (Autenticado))
router.get('/', verifyToken, listMovies); 

// 3. Obter Detalhes de um Filme (GET - Público: Todos)
router.get('/:id', getMovie);

// 4. Deletar Filme (DELETE - Protegido: Admin)
router.delete('/:id', [verifyToken, isAdmin], deleteMovie);

module.exports = router;