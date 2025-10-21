const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/candidateController');
const authMiddleware = require('../middleware/auth'); // Make sure the path to your auth middleware is correct
const { parseCv, apply } = require('../controllers/cvController');
const { uploadCv } = require('../middleware/localUpload');

// @route   GET /api/candidate/profile
// @desc    Get the logged-in candidate's profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/candidate/profile
// @desc    Update the logged-in candidate's profile
// @access  Private
router.put('/profile', authMiddleware, updateProfile);

// POST /candidate/parse-cv - parse-only endpoint
router.post('/parse-cv', authMiddleware, uploadCv.single('cv'), parseCv);

// POST /candidate/apply - apply and save parsed fields
router.post('/apply', authMiddleware, uploadCv.single('cv'), apply);

module.exports = router;