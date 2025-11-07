const express = require('express');
const router = express.Router();

// Serviços e Controllers Necessários
const authService = require('../services/authService'); // Importe o serviço de autenticação
// Removemos as importações de registerUser e registerAdmin para simplificar o carregamento

// Rota de Login (POST)
router.post('/login', (req, res) => { // A rota de login deve ser apenas '/login' dentro do /auth
    const { username, password } = req.body; // Usa USERNAME

    if (!username || !password) {
        return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
    }

    try {
        // Chama a lógica de login do serviço, que deve usar 'username' e 'password'
        const token = authService.login(username, password);
        // Responde com o token (Status 200)
        return res.status(200).json({ token });
    } catch (error) {
        // Se as credenciais estiverem erradas
        return res.status(400).json({ error: error.message });
    }
}); 

module.exports = router;