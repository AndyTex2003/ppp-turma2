const express = require('express');
const router = express.Router();
const { registerAdmin, listAdmins } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', registerAdmin);
router.get('/', requireAuth('admin'), listAdmins);

module.exports = router;
