const express = require('express');
const router = express.Router();

const Admin = require('../controllers/adminController');

router.post('/admin/login', Admin.admin_login);

router.post('/register-admin', Admin.register_admin);

module.exports = router;