const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Criar Gênero
router.post('/register', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Nome é obrigatório.' });

    const newGenre = await Genre.create({ name });
    res.status(201).json(newGenre);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar gênero.' });
  }
});

// Listar Gêneros
router.get('/', verifyToken, async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar gêneros.' });
  }
});

module.exports = router;
