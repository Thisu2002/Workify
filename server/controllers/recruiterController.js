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

    const { jobId } = req.query; 

    // Get recruiter to find company
    const Recruiter = require('../models/Recruiter');
    const recruiter = await Recruiter.findById(recruiterId);
    
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    // Find all job posts for this recruiter
    let jobQuery = { recruiter_id: recruiterId };
    if (jobId) {
      jobQuery._id = jobId; // Filter by specific job if provided
    }
    const jobPosts = await Post.find(jobQuery).select('_id');
    const jobIds = jobPosts.map(job => job._id);

    // Find all applications for these jobs
    const CandidateJob = require('../models/Candidate_Job');
    const User = require('../models/User');
    const Skill = require('../models/Skills');
    
    const applications = await CandidateJob.find({ job_id: { $in: jobIds } })
      .populate('candidate_id', 'avatarUrl contact about')
      .populate('job_id', 'title');

    // Fetch all skills once to map skill IDs to names
    const allSkills = await Skill.find();
    
    // Create a map with both numeric IDs and ObjectId strings for compatibility
    const skillMap = new Map();
    allSkills.forEach((skill, index) => {
      // Map by ObjectId string
      skillMap.set(skill._id.toString(), skill.name);
      // Map by numeric index (in case skills are stored as numbers 1, 2, 3...)
      skillMap.set(index + 1, skill.name);
    });

    // Helper function to map skill IDs to names
    const mapSkillsToNames = (skillIds) => {
      if (!skillIds || !Array.isArray(skillIds)) return [];
      return skillIds
        .map(id => {
          // Try both the ID directly and as string
          return skillMap.get(id) || skillMap.get(id.toString()) || `Skill ${id}`;
        })
        .filter(Boolean);
    };

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
          skills: mapSkillsToNames(app.skills), // Map skill IDs to names
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

    const { status, jobId } = req.query; // Filter by status and optional jobId

    // Find all job posts for this recruiter
    let jobQuery = { recruiter_id: recruiterId };
    if (jobId) {
      jobQuery._id = jobId; // Filter by specific job if provided
    }
    const jobPosts = await Post.find(jobQuery).select('_id');
    const jobIds = jobPosts.map(job => job._id);

    // Build query
    const query = { job_id: { $in: jobIds } };
    if (status) {
      query.current_status = status;
    }

    // Find applications
    const CandidateJob = require('../models/Candidate_Job');
    const User = require('../models/User');
    const Skill = require('../models/Skills');
    
    const applications = await CandidateJob.find(query)
      .populate('candidate_id', 'avatarUrl contact about')
      .populate('job_id', 'title')
      .sort({ date_applied: -1 });

    // Fetch all skills once to map skill IDs to names
    const allSkills = await Skill.find();
    
    // Create a map with both numeric IDs and ObjectId strings for compatibility
    const skillMap = new Map();
    allSkills.forEach((skill, index) => {
      // Map by ObjectId string
      skillMap.set(skill._id.toString(), skill.name);
      // Map by numeric index (in case skills are stored as numbers 1, 2, 3...)
      skillMap.set(index + 1, skill.name);
    });

    // Helper function to map skill IDs to names
    const mapSkillsToNames = (skillIds) => {
      if (!skillIds || !Array.isArray(skillIds)) return [];
      return skillIds
        .map(id => {
          // Try both the ID directly and as string
          return skillMap.get(id) || skillMap.get(id.toString()) || `Skill ${id}`;
        })
        .filter(Boolean);
    };

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
        skills: mapSkillsToNames(app.skills), // Map skill IDs to names
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

// Get interviews for the "New" tab - jobs with panel requested/confirmed status
exports.getNewInterviews = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    // Find job posts with panel requested or confirmed status
    const newInterviews = await Post.find({
      recruiter_id: recruiterId,
      current_status: {
        $in: ['1_panelRequested', '2_panelRequested', '3_panelRequested', '1_panelConfirmed', '2_panelConfirmed', '3_panelConfirmed']
      }
    })
    .populate({
      path: 'interview_rounds.panel_id',
      select: 'name members lead_panelist',
      populate: {
        path: 'members lead_panelist',
        select: 'firstName lastName avatarUrl'
      }
    });

    // Get application counts for each job
    const CandidateJob = require('../models/Candidate_Job');
    
    const interviewsWithDetails = await Promise.all(newInterviews.map(async (job) => {
      // Get current round from status
      const roundMatch = job.current_status.match(/^(\d+)_/);
      const currentRound = roundMatch ? parseInt(roundMatch[1]) : 1;
      
      // Find the interview round details
      const roundDetails = job.interview_rounds.find(round => round.round_number === currentRound);
      
      // Count applications for this job that are eligible for this round
      const applicationCount = await CandidateJob.countDocuments({
        job_id: job._id,
        current_status: { $not: /rejected|selected/ } // Exclude rejected and selected candidates
      });

      // Format available dates for display
      let panelAvailability = "Waiting for available dates";
      let availableDates = [];
      
      if (roundDetails?.available_dates && roundDetails.available_dates.length > 0) {
        // Format dates for display (e.g., "Jul 25, 26, 27")
        const dateStrings = roundDetails.available_dates.map(dateObj => {
          const date = new Date(dateObj.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        panelAvailability = dateStrings.join(', ');
        availableDates = roundDetails.available_dates;
      }

      return {
        _id: job._id,
        jobTitle: job.title,
        round: `Round ${currentRound}: ${roundDetails?.round_name || 'Interview'}`,
        roundNumber: currentRound,
        panel: roundDetails?.panel_id ? {
          _id: roundDetails.panel_id._id,
          name: roundDetails.panel_id.name,
          members: roundDetails.panel_id.members || [],
          leadPanelist: roundDetails.panel_id.lead_panelist
        } : null,
        status: job.current_status,
        applicationCount: applicationCount,
        datePosted: job.date_posted,
        panelAvailability: panelAvailability,
        availableDates: availableDates,
        isWaitingForDates: job.current_status.includes('panelRequested'),
        isReadyToNotify: job.current_status.includes('panelConfirmed') && availableDates.length > 0
      };
    }));

    res.status(200).json({
      success: true,
      count: interviewsWithDetails.length,
      interviews: interviewsWithDetails
    });

  } catch (err) {
    console.error('Error fetching new interviews:', err);
    res.status(500).json({ message: 'Error fetching new interviews', error: err.message });
  }
};

// Get interviews for the "Pending" tab - jobs with candidates notified
exports.getPendingInterviews = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    // Find job posts with candidates notified status
    const pendingInterviews = await Post.find({
      recruiter_id: recruiterId,
      current_status: {
        $in: ['1_candidatesNotified', '2_candidatesNotified', '3_candidatesNotified']
      }
    })
    .populate({
      path: 'interview_rounds.panel_id',
      select: 'name members lead_panelist',
      populate: {
        path: 'members lead_panelist',
        select: 'firstName lastName avatarUrl'
      }
    });

    // Get application and confirmation details for each job
    const CandidateJob = require('../models/Candidate_Job');
    const User = require('../models/User');
    
    const interviewsWithDetails = await Promise.all(pendingInterviews.map(async (job) => {
      // Get current round from status
      const roundMatch = job.current_status.match(/^(\d+)_/);
      const currentRound = roundMatch ? parseInt(roundMatch[1]) : 1;
      
      // Find the interview round details
      const roundDetails = job.interview_rounds.find(round => round.round_number === currentRound);
      
      // Get applications for this job and round
      const applications = await CandidateJob.find({
        job_id: job._id,
        current_status: job.current_status // Same status as job
      })
      .populate('candidate_id', 'firstName lastName avatarUrl contact');

      // Format candidates with their confirmation status
      const candidates = await Promise.all(applications.map(async (app) => {
        const user = await User.findById(app.candidate_id._id).select('email');
        return {
          _id: app.candidate_id._id,
          name: `${app.firstName} ${app.lastName}`,
          email: user?.email || '',
          phone: app.candidate_id.contact?.phone || '',
          avatarUrl: app.candidate_id.avatarUrl || '',
          confirmationStatus: 'Not Replied', // This will be updated based on candidate response
          // You can add interview_confirmation field to Candidate_Job model later
        };
      }));

      // Get the final interview date from interview_rounds
      let interviewDate = null;
      if (roundDetails?.final_date?.date) {
        const date = new Date(roundDetails.final_date.date);
        interviewDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      return {
        _id: job._id,
        jobTitle: job.title,
        round: `Round ${currentRound}: ${roundDetails?.round_name || 'Interview'}`,
        roundNumber: currentRound,
        panel: roundDetails?.panel_id ? {
          _id: roundDetails.panel_id._id,
          name: roundDetails.panel_id.name,
          members: roundDetails.panel_id.members || [],
          leadPanelist: roundDetails.panel_id.lead_panelist
        } : null,
        status: job.current_status,
        applicationCount: candidates.length,
        interviewDate: interviewDate,
        finalDateDetails: roundDetails?.final_date || null,
        candidates: candidates,
        datePosted: job.date_posted
      };
    }));

    res.status(200).json({
      success: true,
      count: interviewsWithDetails.length,
      interviews: interviewsWithDetails
    });

  } catch (err) {
    console.error('Error fetching pending interviews:', err);
    res.status(500).json({ message: 'Error fetching pending interviews', error: err.message });
  }
};

// Notify candidates about interview date and update status
exports.notifyCandidates = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    const { jobId, interviewDate, startTime, endTime } = req.body;

    if (!jobId || !interviewDate) {
      return res.status(400).json({ message: 'Job ID and interview date are required' });
    }

    // Find the job post
    const job = await Post.findOne({
      _id: jobId,
      recruiter_id: recruiterId
    });

    if (!job) {
      return res.status(404).json({ message: 'Job post not found or unauthorized' });
    }

    // Verify that the job is in panel confirmed status
    if (!job.current_status.includes('panelConfirmed')) {
      return res.status(400).json({ message: 'Job must be in panel confirmed status to notify candidates' });
    }

    // Get current round from status
    const roundMatch = job.current_status.match(/^(\d+)_/);
    const currentRound = roundMatch ? parseInt(roundMatch[1]) : 1;
    
    // Find the interview round to update
    const roundIndex = job.interview_rounds.findIndex(round => round.round_number === currentRound);
    
    if (roundIndex === -1) {
      return res.status(400).json({ message: 'Interview round not found' });
    }

    // Validate that the selected date is in the available dates
    const selectedDate = new Date(interviewDate);
    const roundDetails = job.interview_rounds[roundIndex];
    
    const isDateAvailable = roundDetails.available_dates?.some(availDate => {
      const availableDate = new Date(availDate.date);
      return availableDate.toDateString() === selectedDate.toDateString();
    });

    if (!isDateAvailable && roundDetails.available_dates?.length > 0) {
      return res.status(400).json({ message: 'Selected date is not in the available dates list' });
    }

    // Update job status from panelConfirmed to candidatesNotified
    const newStatus = job.current_status.replace('panelConfirmed', 'candidatesNotified');
    job.current_status = newStatus;
    
    // Set the final date in the interview round
    job.interview_rounds[roundIndex].final_date = {
      date: selectedDate,
      start_time: startTime || '09:00',
      end_time: endTime || '10:00'
    };
    
    await job.save();

    // Update all eligible candidate applications to the same status
    const CandidateJob = require('../models/Candidate_Job');
    
    // Update candidate applications that are eligible for this round (using currentRound from above)
    await CandidateJob.updateMany(
      {
        job_id: jobId,
        current_status: { $not: /rejected|selected/ } // Don't update rejected or already selected candidates
      },
      {
        current_status: newStatus
      }
    );

    // TODO: Send notification emails to candidates
    // This would involve:
    // 1. Get all candidate emails
    // 2. Send email with interview details
    // 3. Include confirmation link/form

    res.status(200).json({
      success: true,
      message: 'Candidates notified successfully',
      jobId: jobId,
      newStatus: newStatus,
      finalDate: {
        date: selectedDate,
        start_time: startTime || '09:00',
        end_time: endTime || '10:00'
      }
    });

  } catch (err) {
    console.error('Error notifying candidates:', err);
    res.status(500).json({ message: 'Error notifying candidates', error: err.message });
  }
};
