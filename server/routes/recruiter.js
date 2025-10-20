const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

// Dashboard
router.get('/dashboard/stats', authMiddleware, recruiterController.getDashboardStats);

//router.get('/login', recruiterController.loginUser);
router.post('/postJob', recruiterController.postJob);
router.get('/jobPosts', recruiterController.getJobPosts);
router.post('/changeJobStatus', recruiterController.changeJobStatus);
router.get('/fetchPanels', recruiterController.fetchPanels);
router.get('/fetchCandidates/:jobId', jobController.fetchCandidates);
router.get('/fetchSkills', recruiterController.fetchSkills);

// New candidate endpoints for /recruiter/candidates page
router.get('/candidates/all', recruiterController.getAllCandidates);
router.get('/candidates/applications', recruiterController.getApplicationsByStatus);

// Interview endpoints
router.get('/interviews', recruiterController.getInterviewsByStatus);
router.post('/interviews/notify-candidates', recruiterController.notifyCandidates);
router.post('/interviews/proceed-to-interviews', recruiterController.proceedToInterviews);

module.exports = router;