const express = require('express');
const router = express.Router();
const { registerMovie, listMovies, deleteMovie } = require('../controllers/movieController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', requireAuth('admin'), registerMovie);
router.get('/', requireAuth(), listMovies);
router.delete('/:id', requireAuth('admin'), deleteMovie);

module.exports = router;
