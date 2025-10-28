const express = require('express');
const router = express.Router();
const { authenticate } = require('../services/authService');

router.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  const result = authenticate(username, password, role);
  if (!result) return res.status(401).json({ error: 'Credenciais inválidas' });
  res.json(result);
});

module.exports = router;
