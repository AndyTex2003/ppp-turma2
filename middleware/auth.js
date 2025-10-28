// Middleware de autenticação JWT
const { verifyToken } = require('../services/authService');

function requireAuth(role) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Token inválido' });
    if (role && payload.role !== role) return res.status(403).json({ error: 'Acesso negado' });
    req.user = payload;
    next();
  };
}

module.exports = { requireAuth };
