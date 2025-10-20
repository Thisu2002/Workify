const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCompletedAssignments, getPendingAssignments, testEndpoint } = require('../controllers/leadPanelistController');

// Add test route without auth middleware
router.get('/test', testEndpoint);

// Existing routes with auth middleware
router.get('/completed-assignments', auth, getCompletedAssignments);
router.get('/pending-assignments', auth, getPendingAssignments); 

module.exports = router;
