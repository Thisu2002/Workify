const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const jobController = require('../controllers/jobController');

//router.get('/login', recruiterController.loginUser);
router.post('/postJob', recruiterController.postJob);
router.get('/jobPosts', recruiterController.getJobPosts);
router.post('/changeJobStatus', recruiterController.changeJobStatus);
router.get('/fetchPanels', recruiterController.fetchPanels);
router.get('/fetchCandidates/:jobId', jobController.fetchCandidates);

// New candidate endpoints for /recruiter/candidates page
router.get('/candidates/all', recruiterController.getAllCandidates);
router.get('/candidates/applications', recruiterController.getApplicationsByStatus);

module.exports = router;