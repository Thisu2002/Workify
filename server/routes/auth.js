// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginUser);
router.post('/signup', authController.signup);
router.post('/check-email', authController.checkEmail);


module.exports = router;