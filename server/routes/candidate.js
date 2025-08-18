const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/candidateController');
const authMiddleware = require('../middleware/auth'); // Make sure the path to your auth middleware is correct


// @route   GET /api/candidate/profile
// @desc    Get the logged-in candidate's profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/candidate/profile
// @desc    Update the logged-in candidate's profile
// @access  Private
router.put('/profile', authMiddleware, updateProfile);

const localUpload = require('../middleware/localUpload');
const candidateController = require('../controllers/candidateController');

router.post(
  '/upload-avatar',
  authMiddleware,
  localUpload.single('avatar'),
  candidateController.uploadAvatar
);

router.delete('/delete-avatar', authMiddleware, async (req, res) => {
  // Your logic to delete the avatar file and update the user profile
  // Example:
  // await Candidate.findByIdAndUpdate(req.user.id, { avatarUrl: '' });
  res.json({ msg: 'Avatar deleted' });
});

module.exports = router;