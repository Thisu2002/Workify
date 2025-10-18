const express = require('express');
const router = express.Router();
const { createSession, getMentorSessions } = require('../controllers/mentoringController');
const auth = require('../middleware/auth');

router.post('/sessions', auth, createSession);
router.get('/sessions', auth, getMentorSessions);

module.exports = router;
