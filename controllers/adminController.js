// controllers/adminController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===============================
// Registrar um novo administrador
// ===============================
const registerAdmin = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se já existe um admin com o mesmo e-mail
    const adminExistente = await User.findOne({ email });
    if (adminExistente) {
      return res.status(400).json({ message: 'Administrador já cadastrado.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o novo admin
    const novoAdmin = new User({
      nome,
      email,
      senha: hashedPassword,
      role: 'admin', // define explicitamente o papel
    });

    await novoAdmin.save();

    return res.status(201).json({ message: 'Administrador registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar administrador:', error);
    return res.status(500).json({ message: 'Erro interno ao registrar administrador.' });
  }
};

// ===============================
// Login de administrador
// ===============================
const loginAdmin = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(400).json({ message: 'Administrador não encontrado ou credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'segredo_temporario',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login de administrador bem-sucedido!',
      token,
      role: admin.role,
    });
  } catch (error) {
    console.error('Erro ao fazer login do administrador:', error);
    return res.status(500).json({ message: 'Erro interno no login.' });
  }
};

// ===============================
// Dashboard / Rota protegida do admin
// ===============================
const getAdminDashboard = async (req, res) => {
  try {
    // Aqui poderíamos listar usuários, logs etc., mas para o teste basta retornar sucesso
    return res.status(200).json({
      message: 'Acesso autorizado ao painel do administrador.',
      adminId: req.user.id,
      role: req.user.role,
    });
  } catch (error) {
    console.error('Erro ao acessar o dashboard:', error);
    return res.status(500).json({ message: 'Erro interno ao acessar dashboard.' });
  }
};

// ===============================
// Exporta todas as funções
// ===============================
module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminDashboard,
};