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
router.get('/fetchSkills', recruiterController.fetchSkills);

module.exports = router;