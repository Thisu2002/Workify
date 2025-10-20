// Handle interview-related operations
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const Candidate_Job = require('../models/Candidate_Job');
const JobPost = require('../models/JobPost');
const Recruiter = require('../models/Recruiter');
const Company = require('../models/Company');

// Get upcoming interviews (based on interviewPending status)
router.get('/upcoming', auth, async (req, res) => {
  try {
    const candidateId = req.user.id;
    
    console.log('🔍 Fetching upcoming interviews for candidate:', candidateId);
    
    // Step 1: Find candidate_job records with interviewPending status
    const candidateJobs = await Candidate_Job.find({ 
      candidate_id: candidateId,
      current_status: { $regex: /interviewPending/i }
    });
    
    console.log('✅ Found candidate jobs with interviewPending status:', candidateJobs.length);
    
    if (candidateJobs.length === 0) {
      console.log('❌ No candidate jobs found with interviewPending status');
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No pending interviews found'
      });
    }
    
    // Step 2: Find corresponding Interview records
    const candidateJobIds = candidateJobs.map(cj => cj._id);
    console.log('🔎 Looking for interviews with candidate_job_ids:', candidateJobIds.map(id => id.toString()));
    
    const interviews = await Interview.find({ 
      candidate_job_id: { $in: candidateJobIds }
    }).sort({ scheduled_date: 1 });
    
    console.log('📅 Found scheduled interview records:', interviews.length);
    
    if (interviews.length === 0) {
      console.log('❌ No interview records found in interviews table');
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No scheduled interviews found'
      });
    }
    
    const upcomingInterviews = await Promise.all(
      interviews.map(async (interview) => {
        try {
          // Get the candidate_job that this interview belongs to
          const candidateJob = candidateJobs.find(cj => 
            cj._id.toString() === interview.candidate_job_id.toString()
          );
          
          if (!candidateJob) {
            console.log(`❌ Candidate_Job not found for interview ${interview._id}`);
            return null;
          }
          
          console.log(`✅ Processing interview for candidate_job: ${candidateJob._id}, status: ${candidateJob.current_status}`);
          
          // Get job and company details
          const jobPost = await JobPost.findById(candidateJob.job_id);
          if (!jobPost) {
            console.log(`❌ Job post not found for ID: ${candidateJob.job_id}`);
            return {
              id: interview._id,
              applicationId: candidateJob._id,
              jobTitle: 'Unknown Position',
              companyName: 'Unknown Company',
              date: interview.scheduled_date,
              time: interview.scheduled_time,
              stage: '1st Round',
              round: 1,
              format: interview.location ? 'On-site' : 'Online',
              location: interview.location || 'Online Meeting',
              link: interview.meeting_link || null,
              interviewer_notes: interview.interviewer_notes || '',
              candidate_job_status: candidateJob.current_status
            };
          }
          
          const recruiter = await Recruiter.findById(jobPost.recruiter_id);
          const company = recruiter ? await Company.findById(recruiter.company_id) : null;
          
          // Extract round from candidate_job status (e.g., "1_interviewPending" -> 1)
          const roundMatch = candidateJob.current_status.match(/(\d+)_interviewPending/i);
          const round = roundMatch ? parseInt(roundMatch[1]) : 1;
          
          // Determine round label
          let roundLabel = 'Interview';
          if (round === 1) roundLabel = '1st Round';
          else if (round === 2) roundLabel = '2nd Round'; 
          else if (round >= 3) roundLabel = 'Final Round';
          
          console.log(`✅ Successfully processed interview: ${jobPost.title} at ${company?.name || 'Unknown Company'} - ${roundLabel}`);
          
          return {
            id: interview._id,
            applicationId: candidateJob._id,
            jobTitle: jobPost.title || 'Unknown Position',
            companyName: company?.name || 'Unknown Company',
            date: interview.scheduled_date,
            time: interview.scheduled_time,
            stage: roundLabel,
            round: round,
            format: interview.location ? 'On-site' : 'Online',
            location: interview.location || 'Online Meeting',
            link: interview.meeting_link || null,
            interviewer_notes: interview.interviewer_notes || '',
            candidate_job_status: candidateJob.current_status
          };
        } catch (error) {
          console.error(`❌ Error processing interview ${interview._id}:`, error);
          return null;
        }
      })
    );
    
    const validInterviews = upcomingInterviews.filter(interview => interview !== null);
    
    console.log('🎉 Successfully formatted upcoming interviews:', validInterviews.length);
    
    return res.status(200).json({
      success: true,
      data: validInterviews
    });
    
  } catch (error) {
    console.error('❌ Error fetching upcoming interviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message
    });
  }
});

// Get past interviews (based on candidate_job status)
router.get('/past', auth, async (req, res) => {
  try {
    const candidateId = req.user.id;
    
    console.log('🔍 Fetching past interviews for candidate:', candidateId);
    
    // Step 1: Find candidate_job records that have completed interviews or are rejected
    const candidateJobs = await Candidate_Job.find({ 
      candidate_id: candidateId,
      $or: [
        { current_status: 'accepted' },
        { current_status: 'rejected' },
        { current_status: { $regex: /interviewCompleted/i } }
      ]
    });
    
    console.log('✅ Found candidate jobs for past interviews:', candidateJobs.length);
    
    if (candidateJobs.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Step 2: Find corresponding Interview records
    const candidateJobIds = candidateJobs.map(cj => cj._id);
    const interviews = await Interview.find({ 
      candidate_job_id: { $in: candidateJobIds }
    }).sort({ scheduled_date: -1 });
    
    console.log('📅 Found past interview records:', interviews.length);
    
    const pastInterviews = await Promise.all(
      interviews.map(async (interview) => {
        try {
          // Get the candidate_job that this interview belongs to
          const candidateJob = candidateJobs.find(cj => 
            cj._id.toString() === interview.candidate_job_id.toString()
          );
          
          if (!candidateJob) return null;
          
          const jobPost = await JobPost.findById(candidateJob.job_id);
          if (!jobPost) return null;
          
          const recruiter = await Recruiter.findById(jobPost.recruiter_id);
          const company = recruiter ? await Company.findById(recruiter.company_id) : null;
          
          // Determine outcome based on candidate_job status
          let outcome = 'Awaiting Feedback';
          if (candidateJob.current_status === 'accepted') {
            outcome = 'Advanced to Next Round';
          } else if (candidateJob.current_status === 'rejected') {
            outcome = 'No Longer in Consideration';
          } else if (candidateJob.current_status.includes('interviewCompleted')) {
            outcome = 'Interview Completed';
          }
          
          return {
            id: interview._id,
            jobTitle: jobPost.title || 'Unknown Position',
            companyName: company?.name || 'Unknown Company',
            date: interview.scheduled_date,
            outcome: outcome,
            round: 1,
            candidate_job_status: candidateJob.current_status
          };
        } catch (error) {
          console.error(`❌ Error processing past interview ${interview._id}:`, error);
          return null;
        }
      })
    );
    
    const validPastInterviews = pastInterviews.filter(interview => interview !== null);
    
    console.log('🎉 Successfully formatted past interviews:', validPastInterviews.length);
    
    return res.status(200).json({
      success: true,
      data: validPastInterviews
    });
    
  } catch (error) {
    console.error('❌ Error fetching past interviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching past interviews',
      error: error.message
    });
  }
});

// Create test interview with REAL candidate_job_id
router.post('/create-test-interview', auth, async (req, res) => {
  try {
    const candidateId = req.user.id;
    
    // Find a real candidate_job with interviewPending status
    const candidateJob = await Candidate_Job.findOne({ 
      candidate_id: candidateId,
      current_status: { $regex: /interviewPending/i }
    });
    
    if (!candidateJob) {
      return res.status(400).json({
        success: false,
        message: 'No candidate job found with interviewPending status. Please make sure you have an application with "1_interviewPending" status.'
      });
    }
    
    console.log('✅ Found candidate_job:', candidateJob._id, 'with status:', candidateJob.current_status);
    
    // Check if interview already exists
    const existingInterview = await Interview.findOne({
      candidate_job_id: candidateJob._id
    });
    
    if (existingInterview) {
      return res.json({
        success: true,
        message: 'Interview already exists for this application',
        interview: existingInterview
      });
    }
    
    // Create new interview with the REAL candidate_job_id
    const testInterview = new Interview({
      candidate_job_id: candidateJob._id,
      scheduled_date: new Date('2025-01-15T14:00:00.000Z'),
      scheduled_time: '2:00 PM',
      meeting_link: 'https://meet.google.com/abc-def-ghi',
      location: null,
      interviewer_notes: 'Technical interview focusing on React, Node.js, and system design'
    });
    
    const savedInterview = await testInterview.save();
    
    console.log('🎉 Test interview created with ID:', savedInterview._id);
    
    return res.json({
      success: true,
      message: 'Test interview created successfully',
      interview: savedInterview,
      candidateJob: {
        id: candidateJob._id,
        status: candidateJob.current_status
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating test interview:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;