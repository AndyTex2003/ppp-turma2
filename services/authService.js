const jwt = require('jsonwebtoken');
const db = require('./db');
const secret = 'minhachavesecreta123'; 

// Função que compara a senha em texto puro com a senha do DB
function comparePassword(inputPassword, storedPassword) {
    // Para um sistema de teste simples, a comparação direta é aceitável
    return inputPassword === storedPassword;
}

function login(username, password) {
    // 1. Encontra o usuário no banco de dados
    const user = db.users.find(u => u.username === username);

    // 2. Verifica credenciais
    if (!user || !comparePassword(password, user.password)) {
        // Lança um erro que será capturado na rota (Status 400)
        throw new Error('Nome de usuário ou senha inválidos');
    }

    // 3. Define o Payload do Token
    // CORREÇÃO CRUCIAL: Incluir a role (função) do usuário no token.
    const payload = { 
        userId: user.id, 
        username: user.username,
        role: user.role // <-- ESTA LINHA CORRIGE O 403 FORBIDDEN
    };
    
    // 4. Assina e retorna o token
    const token = jwt.sign(payload, secret, { expiresIn: '1h' }); 
    
    return token;
}

module.exports = { login };

