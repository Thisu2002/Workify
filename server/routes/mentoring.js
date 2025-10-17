const express = require('express');
const router = express.Router();
const { createSession } = require('../controllers/mentoringController');
const auth = require('../middleware/auth');

router.post('/sessions', auth, createSession);

module.exports = router;
