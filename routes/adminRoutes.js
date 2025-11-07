const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Acesso permitido ao Admin.' });
});

module.exports = router;