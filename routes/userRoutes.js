const express = require('express');
const router = express.Router();
// Importa o controller de usuário
const { registerUser } = require('../controllers/userController'); 
const { verifyToken } = require('../middlewares/authMiddleware'); 

// 1. Rota de Registro de Usuário (POST - Pública)
// ESTA É A LINHA 8 QUE ESTAVA FALHANDO
router.post('/register', registerUser);

// 2. Rota de Perfil (Exemplo de rota protegida)
router.get('/profile', verifyToken, (req, res) => {
    // Rota de exemplo para verificar se o token funciona
    res.status(200).json({ 
        message: "Perfil do usuário autenticado",
        userId: req.user.id,
        userRole: req.user.role 
    });
});

module.exports = router;