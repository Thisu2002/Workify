// In file: server/routes/jobs.js

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// This is a public route for anyone (candidates) to see open jobs
router.get('/open', jobController.getAllOpenJobs);
router.delete('/deleteJobPost', jobController.deleteJobPost);
router.get("/fetchJobPost/:jobId", jobController.fetchJobPost);
router.put("/changeJobStatus/:jobId", jobController.changeJobStatus);
router.post("/changeApplicationStatus", jobController.changeApplicationStatus);
// You will also add the route for recruiters to POST new jobs here
// const { createJobPost } = require('../controllers/jobController');
// router.post('/', authMiddleware, isRecruiter, createJobPost);

module.exports = router;