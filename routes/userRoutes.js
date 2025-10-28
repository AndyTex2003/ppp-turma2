const express = require('express');
const router = express.Router();
const { registerUser, listUsers } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', registerUser);
router.get('/', requireAuth('admin'), listUsers);

module.exports = router;
