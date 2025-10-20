const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAssignments, getCompletedAssignments, getPendingAssignments, sendAvailability, getJobCandidates, finishInterviews, getInterviewResults, testEndpoint } = require('../controllers/leadPanelistController');

// Add test route without auth middleware
router.get('/test', testEndpoint);

// New unified assignments endpoint
router.get('/assignments', auth, getAssignments);

// Send availability dates for a job post
router.post('/send-availability', auth, sendAvailability);

// Get candidates for a specific job
router.get('/job-candidates/:jobId', auth, getJobCandidates);

// Save interview feedback and results
router.post('/finish-interviews', auth, finishInterviews);

// Get interview results for completed job
router.get('/interview-results/:jobId', auth, getInterviewResults);

// Existing routes with auth middleware
router.get('/completed-assignments', auth, getCompletedAssignments);
router.get('/pending-assignments', auth, getPendingAssignments); 

module.exports = router;

