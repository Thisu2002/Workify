const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

router.get('/jobPosts', managerController.getJobPosts);


module.exports = router;