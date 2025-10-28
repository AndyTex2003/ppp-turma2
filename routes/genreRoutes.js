const express = require('express');
const router = express.Router();
const { registerGenre, listGenres, deleteGenre } = require('../controllers/genreController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', requireAuth('admin'), registerGenre);
router.get('/', requireAuth(), listGenres);
router.delete('/:id', requireAuth('admin'), deleteGenre);

module.exports = router;
