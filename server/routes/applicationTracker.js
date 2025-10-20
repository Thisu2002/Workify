const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Candidate_Job = require('../models/Candidate_Job');
const JobPost = require('../models/JobPost');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Company = require('../models/Company');

// Get candidate's applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const candidateId = req.user.id;
    
    console.log('Fetching applications for candidate:', candidateId);
    
    const applications = await Candidate_Job.find({ candidate_id: candidateId })
      .sort({ date_applied: -1 });
    
    console.log('Found applications:', applications.length);
    
    if (applications.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    const formattedApplications = await Promise.all(
      applications.map(async (app) => {
        try {
          // Step 1: Get job post details
          const jobPost = await JobPost.findById(app.job_id);
          if (!jobPost) {
            console.log(`Job post not found for ID: ${app.job_id}`);
            return null;
          }
          
          console.log('JobPost found:', {
            id: jobPost._id,
            title: jobPost.title,
            recruiter_id: jobPost.recruiter_id
          });
          
          // Step 2: Get recruiter details
          const recruiter = await Recruiter.findById(jobPost.recruiter_id);
          if (!recruiter) {
            console.log(`Recruiter not found for ID: ${jobPost.recruiter_id}`);
            return {
              _id: app._id,
              job_id: app.job_id,
              job: {
                title: jobPost.title || 'Unknown Position',
                company_name: 'Unknown Company',
                location: jobPost.location || 'Unknown Location',
                salary: jobPost.salary || 'Not specified',
                jobType: jobPost.jobType || 'Unknown Type'
              },
              current_status: app.current_status,
              match_score: app.match_score || 0,
              applied_date: app.date_applied,
              quiz_score: app.quiz_score || 0
            };
          }
          
          console.log('Recruiter found:', {
            id: recruiter._id,
            company_id: recruiter.company_id
          });
          
          // Step 3: Get company details using the 'name' field
          const company = await Company.findById(recruiter.company_id);
          
          let companyName = 'Unknown Company';
          if (company) {
            companyName = company.name; // Using the correct field name from your model
            console.log('Company found:', {
              id: company._id,
              name: company.name,
              location: company.location
            });
          } else {
            console.log(`Company not found for ID: ${recruiter.company_id}`);
          }
          
          return {
            _id: app._id,
            job_id: app.job_id,
            job: {
              title: jobPost.title || 'Unknown Position',
              company_name: companyName,
              location: jobPost.location || 'Unknown Location',
              salary: jobPost.salary || 'Not specified',
              jobType: jobPost.jobType || 'Unknown Type',
              description: jobPost.description || '',
              deadline: jobPost.deadline
            },
            current_status: app.current_status,
            match_score: app.match_score || 0,
            applied_date: app.date_applied,
            quiz_score: app.quiz_score || 0,
            firstName: app.firstName,
            lastName: app.lastName
          };
          
        } catch (error) {
          console.error(`Error processing application ${app._id}:`, error);
          return {
            _id: app._id,
            job_id: app.job_id,
            job: {
              title: 'Error Loading Job',
              company_name: 'Error Loading Company',
              location: 'Unknown',
              salary: 'Unknown',
              jobType: 'Unknown'
            },
            current_status: app.current_status,
            match_score: app.match_score || 0,
            applied_date: app.date_applied,
            quiz_score: app.quiz_score || 0
          };
        }
      })
    );
    
    // Filter out any null results
    const validApplications = formattedApplications.filter(app => app !== null);
    
    console.log('Successfully formatted applications:', validApplications.length);
    
    return res.status(200).json({
      success: true,
      data: validApplications
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

module.exports = router;