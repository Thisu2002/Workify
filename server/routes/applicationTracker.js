const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Candidate_Job = require('../models/Candidate_Job');
const JobPost = require('../models/JobPost');
const User = require('../models/User');

// Get candidate's applications - THIS IS ALL YOU NEED
router.get('/my-applications', auth, async (req, res) => {
  try {
    const candidateId = req.user.id;
    
    console.log('Fetching applications for candidate:', candidateId);
    
    const applications = await Candidate_Job.find({ candidate_id: candidateId })
      .populate('job_id', 'company_name job_title position location salary_range')
      .sort({ date_applied: -1 }); // Changed from applied_date to date_applied
    
    console.log('Found applications:', applications.length);
    
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      job_id: app.job_id._id,
      job: {
        company_name: app.job_id.company_name,
        job_title: app.job_id.job_title,
        position: app.job_id.position,
        location: app.job_id.location,
        salary_range: app.job_id.salary_range
      },
      current_status: app.current_status,
      current_round: app.current_round || 1, // Add fallback
      match_score: app.match_score,
      applied_date: app.date_applied, // Map date_applied to applied_date for frontend
      quiz_score: app.quiz_score,
      firstName: app.firstName,
      lastName: app.lastName
    }));
    
    return res.status(200).json({
      success: true,
      data: formattedApplications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// You can remove the /apply route since CV parser will handle it

module.exports = router;