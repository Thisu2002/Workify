const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');

//router.get('/login', recruiterController.loginUser);
router.post('/postJob', recruiterController.postJob);
router.get('/jobPosts', recruiterController.getJobPosts);
router.post('/changeJobStatus', recruiterController.changeJobStatus);
router.get('/fetchPanels', recruiterController.fetchPanels);


module.exports = router;