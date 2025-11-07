const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===============================================
// Registrar Usuário
// ===============================================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // o teste espera texto “já existe” na mensagem
      return res.status(400).json({ message: 'Usuário já existe com este e-mail.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    return res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Erro no registerUser:', err);
    res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
  }
};

// ===============================================
// Login
// ===============================================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'segredo_temporario',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      role: user.role,
    });
  } catch (err) {
    console.error('Erro no loginUser:', err);
    res.status(500).json({ message: 'Erro interno ao fazer login.' });
  }
};
