const Post = require('../models/JobPost');
const jwt = require('jsonwebtoken');
const Panel = require('../models/Panel');

exports.getJobPosts = async (req, res) => {
    try {
        //const posts = await Post.find().populate('recruiter_id');
        const posts = await Post.find(); // Without populate

        //console.log("Fetched Job Posts:", posts);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching job posts', error: err.message });
    }
}

exports.postJob = async (req, res) => {
  const {
    title,
    description,
    location,
    salary,
    jobType,
    deadline,
    skills,
    education_requirements,
    experience,
    qualifications,
    preferred_qualifications,
    comments,
    interview_rounds,
    quiz
  } = req.body;

  //console.log("Received Job Post Data:", req.body);

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiter_id = decoded.id;

    const newPost = new Post({
      title,
      description,
      location,
      salary,
      jobType,
      deadline,
      skills,
      education_requirements,
      experience,
      qualifications,
      preferred_qualifications,
      comments,
      recruiter_id,
      interview_rounds,
      quiz
    });

    await newPost.save();

    res.status(201).json({ message: "Job Posted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Job Posting Failed", error: err.message });
  }
};

exports.changeJobStatus = async (req, res) => {
  const {jobId, status} = req.body;
  try {
    const post = await Post.findById(jobId);
    if (!post) {
      return res.status(404).json({ message: 'Job post not found' });
    }
    post.status = status;
    await post.save();
    res.status(200).json({ message: 'Job status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating job status', error: err.message });
  }
};

exports.fetchPanels = async (req, res) => {
  try {
    const panels = await Panel.find().select('_id name');
    res.status(200).json(panels);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching panels', error: err.message });
  }
};

// Get all unique candidates who applied to jobs from recruiter's company
exports.getAllCandidates = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    // Get recruiter to find company
    const Recruiter = require('../models/Recruiter');
    const recruiter = await Recruiter.findById(recruiterId);
    
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    // Find all job posts for this recruiter
    const jobPosts = await Post.find({ recruiter_id: recruiterId }).select('_id');
    const jobIds = jobPosts.map(job => job._id);

    // Find all applications for these jobs
    const CandidateJob = require('../models/Candidate_Job');
    const User = require('../models/User');
    const applications = await CandidateJob.find({ job_id: { $in: jobIds } })
      .populate('candidate_id', 'avatarUrl contact about')
      .populate('job_id', 'title');

    // Group by candidate to get unique candidates with aggregated data
    const candidateMap = new Map();

    for (const app of applications) {
      const candidateId = app.candidate_id._id.toString();
      
      if (!candidateMap.has(candidateId)) {
        // Fetch user email from User model
        const user = await User.findById(candidateId).select('email');
        
        candidateMap.set(candidateId, {
          _id: candidateId,
          firstName: app.firstName,
          lastName: app.lastName,
          email: user?.email || '',
          phone: app.candidate_id.contact?.phone || '',
          avatarUrl: app.candidate_id.avatarUrl || '',
          about: app.candidate_id.about || '',
          experience: app.experience,
          skills: app.skills,
          totalApplications: 0,
          applications: [],
          // Determine overall status priority
          overallStatus: 'new'
        });
      }

      const candidate = candidateMap.get(candidateId);
      candidate.totalApplications++;
      candidate.applications.push({
        jobId: app.job_id._id,
        jobTitle: app.job_id.title,
        currentStatus: app.current_status,
        appliedDate: app.date_applied,
        quizScore: app.quiz_score,
        matchScore: app.match_score,
        roundStatus: app.round_status
      });

      // Update overall status based on priority
      // Priority: selected > completed > interviewScheduled > shortlisted > new > rejected
      const statusPriority = { 
        '1_selected': 10, '2_selected': 10, '3_selected': 10,
        '1_completed': 8, '2_completed': 8, '3_completed': 8,
        '1_interviewScheduled': 6, '2_interviewScheduled': 6,
        '1_interviewPending': 5, '2_interviewPending': 5,
        '1_shortlisted': 4, '2_shortlisted': 4,
        'new': 2,
        '1_rejected': 1, '2_rejected': 1, '3_rejected': 1
      };
      const currentPriority = statusPriority[candidate.overallStatus] || 0;
      const newPriority = statusPriority[app.current_status] || 0;
      
      if (newPriority > currentPriority) {
        candidate.overallStatus = app.current_status;
      }
    }

    const candidates = Array.from(candidateMap.values());

    res.status(200).json({ 
      success: true,
      count: candidates.length,
      candidates 
    });

  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ message: 'Error fetching candidates', error: err.message });
  }
};

// Get applications filtered by status
exports.getApplicationsByStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    const { status } = req.query; // 'shortlisted', 'hired', 'rejected', 'new', 'applied', 'interviewed'

    // Find all job posts for this recruiter
    const jobPosts = await Post.find({ recruiter_id: recruiterId }).select('_id');
    const jobIds = jobPosts.map(job => job._id);

    // Build query
    const query = { job_id: { $in: jobIds } };
    if (status) {
      query.current_status = status;
    }

    // Find applications
    const CandidateJob = require('../models/Candidate_Job');
    const User = require('../models/User');
    const applications = await CandidateJob.find(query)
      .populate('candidate_id', 'avatarUrl contact about')
      .populate('job_id', 'title')
      .sort({ date_applied: -1 });

    // Format response with full application details
    const formattedApplications = await Promise.all(applications.map(async (app) => {
      // Fetch user email from User model
      const user = await User.findById(app.candidate_id._id).select('email');
      
      return {
        _id: app._id,
        candidateId: app.candidate_id._id,
        firstName: app.firstName,
        lastName: app.lastName,
        email: user?.email || '',
        phone: app.candidate_id.contact?.phone || '',
        avatarUrl: app.candidate_id.avatarUrl || '',
        about: app.about,
        jobId: app.job_id._id,
        jobTitle: app.job_id.title,
        experience: app.experience,
        skills: app.skills,
        education: app.education,
        currentStatus: app.current_status,
        roundStatus: app.round_status,
        appliedDate: app.date_applied,
        quizScore: app.quiz_score,
        matchScore: app.match_score
      };
    }));

    res.status(200).json({ 
      success: true,
      count: formattedApplications.length,
      status: status || 'all',
      applications: formattedApplications 
    });

  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
};
