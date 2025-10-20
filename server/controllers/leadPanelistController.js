const JobPost = require('../models/JobPost');
const Panel = require('../models/Panel');

// Get assignments for lead panelist - following recruiterController pattern
exports.getAssignments = async (req, res) => {
  try {
    const leadPanelistId = req.user._id; // From auth middleware
    console.log('=== DEBUG: Fetching assignments for lead panelist:', leadPanelistId);
    
    // Verify user has lead_panelist role
    if (!req.user || !req.user.user_roles.includes('lead_panelist')) {
      console.log('=== DEBUG: User is not a lead panelist');
      return res.status(403).json({ error: 'Access denied. User is not a lead panelist.' });
    }
    
    // Find all panels where this user is the lead_panelist
    const panels = await Panel.find({ lead_panelist: leadPanelistId }).select('_id name members');
    console.log('=== DEBUG: Found panels:', panels);
    
    if (panels.length === 0) {
      console.log('=== DEBUG: No panels assigned to this lead panelist');
      return res.json({
        success: true,
        data: {
          new: [],
          pending: [],
          scheduled: [],
          completed: []
        }
      });
    }
    
    const panelIds = panels.map(panel => panel._id);
    console.log('=== DEBUG: Panel IDs:', panelIds);
    
    // Find all job posts that have any of these panels in their interview_rounds
    const jobPosts = await JobPost.find({
      'interview_rounds.panel_id': { $in: panelIds }
    })
    .populate('recruiter_id', 'firstName lastName')
    .populate('company_id', 'name')
    .populate({
      path: 'interview_rounds.panel_id',
      select: 'name members lead_panelist',
      populate: {
        path: 'members lead_panelist',
        select: 'firstName lastName avatarUrl'
      }
    })
    .select('title current_status interview_rounds num_applicants date_posted')
    .sort({ date_posted: -1 });
    
    console.log('=== DEBUG: Found job posts with details:', jobPosts.map(job => ({
      title: job.title,
      current_status: job.current_status,
      interview_rounds: job.interview_rounds.map(round => ({
        round_number: round.round_number,
        round_name: round.round_name,
        panel_id: round.panel_id,
        panel_name: round.panel_id?.name,
        available_dates: round.available_dates,
        final_date: round.final_date
      }))
    })));
    
    console.log('=== DEBUG: Found job posts:', jobPosts.length);
    
    // Classify job posts into tabs based on current_status - following recruiterController pattern
    const classifiedAssignments = {
      new: [],
      pending: [],
      scheduled: [],
      completed: []
    };
    
    // Import CandidateJob model for fetching candidate data
    const CandidateJob = require('../models/Candidate_Job');
    const User = require('../models/User');
    
    // Process each job and classify based on status
    for (const job of jobPosts) {
      const status = job.current_status;
      let tabType;
      
      // Classification logic matching the requirements
      if (status.includes("panelRequested")) {
        tabType = "new";
      } else if (status.includes("panelConfirmed") || status.includes("candidatesNotified")) {
        tabType = "pending";
      } else if (status.includes("scheduled")) {
        // Check if the interview date has passed to determine if it should be completed
        const relevantRound = job.interview_rounds.find(round => {
          if (!round.panel_id) return false;
          
          // Handle both populated and non-populated panel_id
          const roundPanelId = round.panel_id._id ? round.panel_id._id.toString() : round.panel_id.toString();
          return panelIds.some(panelId => panelId.toString() === roundPanelId);
        });
        
        const finalDate = relevantRound?.final_date;
        const currentDate = new Date();
        
        if (finalDate && new Date(finalDate) < currentDate) {
          // Interview date has passed - move to completed tab
          tabType = "completed";
        } else {
          // Interview date is upcoming - keep in scheduled tab
          tabType = "scheduled";
        }
      } else if (status.includes("completed")) {
        tabType = "completed";
      } else {
        // Default unknown statuses to new
        tabType = "new";
      }
      
      // Find the relevant round for this lead panelist's panel
      const relevantRound = job.interview_rounds.find(round => {
        if (!round.panel_id) return false;
        
        // Handle both populated and non-populated panel_id
        const roundPanelId = round.panel_id._id ? round.panel_id._id.toString() : round.panel_id.toString();
        return panelIds.some(panelId => panelId.toString() === roundPanelId);
      });
      
      console.log('=== DEBUG Job Processing:', {
        jobTitle: job.title,
        panelIds: panelIds,
        interviewRounds: job.interview_rounds.map(r => ({
          round_number: r.round_number,
          round_name: r.round_name,
          panel_id: r.panel_id
        })),
        relevantRound: relevantRound ? {
          round_number: relevantRound.round_number,
          round_name: relevantRound.round_name,
          panel_id: relevantRound.panel_id,
          final_date: relevantRound.final_date
        } : null
      });
      
      // Format job data following recruiterController pattern
      const formattedJob = formatJobForLeadPanelist(job, tabType, relevantRound, panels);
      console.log('=== DEBUG Formatted Job:', formattedJob);
      
      // Add to appropriate tab
      classifiedAssignments[tabType].push(formattedJob);
    }
    
    console.log('=== DEBUG: Classification results:', {
      new: classifiedAssignments.new.length,
      pending: classifiedAssignments.pending.length,
      scheduled: classifiedAssignments.scheduled.length,
      completed: classifiedAssignments.completed.length
    });
    
    res.status(200).json({
      success: true,
      data: classifiedAssignments
    });
    
  } catch (err) {
    console.error('=== ERROR in getAssignments:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Helper function to format job data for lead panelist display - following recruiterController pattern
const formatJobForLeadPanelist = (job, status, relevantRound, panels) => {
  // Find the panel info for this round
  let panelInfo = null;
  if (relevantRound?.panel_id) {
    // Handle populated panel_id
    if (relevantRound.panel_id._id) {
      // panel_id is populated - use it directly
      panelInfo = relevantRound.panel_id;
    } else {
      // panel_id is ObjectId - find in panels array
      panelInfo = panels.find(panel => 
        relevantRound.panel_id.toString() === panel._id.toString()
      );
    }
  }
  
  console.log('=== DEBUG formatJobForLeadPanelist:', {
    jobTitle: job.title,
    status: status,
    relevantRound: relevantRound,
    panelInfo: panelInfo,
    panels: panels.map(p => ({ id: p._id, name: p.name }))
  });
  
  let formattedJob = {
    id: job._id,
    jobTitle: job.title,
    round: relevantRound 
      ? `Round ${relevantRound.round_number}: ${relevantRound.round_name}`
      : "Round not defined",
    panel: panelInfo?.name || "Panel not assigned",
    panelId: panelInfo?._id || panelInfo?.id || null,
    applicationCount: job.num_applicants || 0,
    currentStatus: job.current_status,
    recruiter: job.recruiter_id ? `${job.recruiter_id.firstName || ''} ${job.recruiter_id.lastName || ''}`.trim() : 'Unknown',
    company: job.company_id?.name || 'Unknown Company',
    datePosted: job.date_posted
  };
  
  // Add status-specific fields following recruiterController pattern
  if (status === "new") {
    // For new assignments, show panel availability
    if (relevantRound?.available_dates && relevantRound.available_dates.length > 0) {
      const dates = relevantRound.available_dates
        .filter(d => d.date)
        .map(d => new Date(d.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }));
      formattedJob.panelAvailability = dates.length > 0 ? dates.join(", ") : "Waiting for available dates";
    } else {
      formattedJob.panelAvailability = "Waiting for available dates";
    }
  } else if (status === "pending" || status === "scheduled") {
    // For pending/scheduled, show the final interview date
    if (relevantRound?.final_date) {
      formattedJob.interviewDate = new Date(relevantRound.final_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    } else {
      formattedJob.interviewDate = "Date TBD";
    }
    
    // Add panel members info if available
    if (relevantRound?.panel_id?.members) {
      formattedJob.panelMembers = relevantRound.panel_id.members.map(member => ({
        name: `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown',
        avatar: member.avatarUrl || null
      }));
    }
  } else if (status === "completed") {
    // For completed assignments, show the date it was completed
    if (relevantRound?.final_date) {
      formattedJob.interviewDate = new Date(relevantRound.final_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } else {
      formattedJob.interviewDate = "Date not available";
    }
    
    // Add panel members info for completed assignments too
    if (relevantRound?.panel_id?.members) {
      formattedJob.panelMembers = relevantRound.panel_id.members.map(member => ({
        name: `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown',
        avatar: member.avatarUrl || null
      }));
    }
  }
  
  return formattedJob;
};

exports.getCompletedAssignments = async (req, res) => {
  try {
    console.log('Fetching only assignments with current_status="1_completed"...');
    
    // Only get jobs with exactly current_status="1_completed"
    const completedJobs = await JobPost.find({
      current_status: "1_completed"  // Exact match only
    })
    .select('_id title description location jobType current_status date_posted interview_rounds')
    .lean();

    console.log('Query result:', {
      count: completedJobs.length,
      jobs: completedJobs.map(j => ({
        title: j.title,
        current_status: j.current_status
      }))
    });

    return res.json(completedJobs);
  } catch (err) {
    console.error('Error in getCompletedAssignments:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPendingAssignments = async (req, res) => {
  try {
    console.log('[DEBUG] getPendingAssignments route handler called');
    console.log('Fetching assignments with current_status="1_panelRequested"...');
    
    // Basic test response to verify route is working
    if (process.env.NODE_ENV === 'development' || true) {
      console.log('Running query for pending jobs');
    }
    
    const pendingJobs = await JobPost.find({
      current_status: "1_panelConfirmed"
    })
    .select('_id title description location jobType current_status date_posted interview_rounds')
    .lean();

    console.log('Pending jobs query result:', {
      count: pendingJobs.length,
      jobs: pendingJobs.map(j => ({
        title: j.title,
        current_status: j.current_status,
        _id: j._id
      }))
    });

    return res.json(pendingJobs);
  } catch (err) {
    console.error('Error in getPendingAssignments:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Send availability dates for a job post
exports.sendAvailability = async (req, res) => {
  try {
    const { jobId, availableDates } = req.body;
    const leadPanelistId = req.user._id;
    
    console.log('=== DEBUG: Sending availability for job:', {
      jobId,
      availableDates,
      leadPanelistId
    });
    
    // Validate input
    if (!jobId || !availableDates || !Array.isArray(availableDates)) {
      return res.status(400).json({ 
        error: 'Invalid input. Job ID and available dates array are required.' 
      });
    }
    
    // Filter out null/empty dates and validate
    const validDates = availableDates
      .filter(date => date && date.trim() !== '')
      .map(date => new Date(date));
    
    if (validDates.length === 0) {
      return res.status(400).json({ 
        error: 'At least one valid date must be provided.' 
      });
    }
    
    console.log('=== DEBUG: Valid dates:', validDates);
    
    // Find the job post
    const jobPost = await JobPost.findById(jobId);
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found.' });
    }
    
    // Verify user has lead_panelist role
    if (!req.user || !req.user.user_roles.includes('lead_panelist')) {
      return res.status(403).json({ error: 'Access denied. User is not a lead panelist.' });
    }
    
    // Find the panel for this lead panelist
    const Panel = require('../models/Panel');
    const panel = await Panel.findOne({ lead_panelist: leadPanelistId });
    if (!panel) {
      return res.status(403).json({ error: 'No panel found for this lead panelist.' });
    }
    
    console.log('=== DEBUG: Found panel:', panel._id);
    
    // Find the relevant interview round that uses this panel
    const relevantRoundIndex = jobPost.interview_rounds.findIndex(round => 
      round.panel_id && round.panel_id.toString() === panel._id.toString()
    );
    
    if (relevantRoundIndex === -1) {
      return res.status(403).json({ 
        error: 'This panel is not assigned to any round for this job post.' 
      });
    }
    
    console.log('=== DEBUG: Found relevant round at index:', relevantRoundIndex);
    
    // Update the available_dates for the relevant round
    jobPost.interview_rounds[relevantRoundIndex].available_dates = validDates.map(date => ({ date }));
    
    // Update current_status from "panelRequested" to "panelConfirmed"
    // Handle different round numbers (1_panelRequested -> 1_panelConfirmed, etc.)
    const currentStatus = jobPost.current_status;
    if (currentStatus.includes('panelRequested')) {
      jobPost.current_status = currentStatus.replace('panelRequested', 'panelConfirmed');
      console.log('=== DEBUG: Updated status from', currentStatus, 'to', jobPost.current_status);
    } else {
      console.log('=== DEBUG: Current status does not contain "panelRequested":', currentStatus);
    }
    
    // Save the updated job post
    await jobPost.save();
    
    console.log('=== DEBUG: Successfully updated job post');
    
    res.status(200).json({
      success: true,
      message: 'Availability dates saved successfully.',
      data: {
        jobId: jobPost._id,
        updatedStatus: jobPost.current_status,
        availableDates: jobPost.interview_rounds[relevantRoundIndex].available_dates
      }
    });
    
  } catch (err) {
    console.error('=== ERROR in sendAvailability:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Add a simple test endpoint to verify route setup
exports.testEndpoint = async (req, res) => {
  console.log('Test endpoint called');
  return res.json({ message: 'Test endpoint working' });
};

// Get candidates for a specific job with status "interviewScheduled"
exports.getJobCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;
    const leadPanelistId = req.user._id;

    console.log('=== DEBUG: Fetching candidates for job:', jobId);

    // Verify user has lead_panelist role
    if (!req.user || !req.user.user_roles.includes('lead_panelist')) {
      return res.status(403).json({ error: 'Access denied. User is not a lead panelist.' });
    }

    // Import CandidateJob model
    const CandidateJob = require('../models/Candidate_Job');
    const Candidate = require('../models/Candidate');
    const User = require('../models/User');

    // First, let's check what candidates exist for this job with any status
    const allCandidatesForJob = await CandidateJob.find({
      job_id: jobId
    }).select('current_status candidate_id');
    
    console.log('=== DEBUG: All candidates for this job:', allCandidatesForJob.map(c => ({
      id: c._id,
      status: c.current_status,
      candidateId: c.candidate_id
    })));

    // Fetch only candidates with status "1_interviewScheduled"
    const candidateJobs = await CandidateJob.find({
      job_id: jobId,
      current_status: '1_interviewScheduled'
    });
    
    console.log('=== DEBUG: Found', candidateJobs.length, 'candidates with status: 1_interviewScheduled');

    console.log('=== DEBUG: Final candidate jobs found:', candidateJobs.length);

    // Format the response using data directly from Candidate_Job model
    const candidates = candidateJobs.map(candidateJob => ({
      _id: candidateJob._id,
      candidateName: `${candidateJob.firstName} ${candidateJob.lastName}`.trim() || 'N/A',
      candidateEmail: candidateJob.contact?.email || 'N/A',
      currentRound: candidateJob.round_status.length > 0 ? candidateJob.round_status.length : 1,
      roundStatus: candidateJob.round_status
    }));

    res.json({
      success: true,
      data: candidates
    });

  } catch (error) {
    console.error('=== ERROR in getJobCandidates:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
};

// Finish interviews and save feedback/results
exports.finishInterviews = async (req, res) => {
  try {
    const { jobId, candidateData } = req.body;
    const leadPanelistId = req.user._id;

    console.log('=== DEBUG: Finishing interviews for job:', jobId);
    console.log('=== DEBUG: Candidate data:', candidateData);

    // Verify user has lead_panelist role
    if (!req.user || !req.user.user_roles.includes('lead_panelist')) {
      return res.status(403).json({ error: 'Access denied. User is not a lead panelist.' });
    }

    if (!jobId || !candidateData || !Array.isArray(candidateData)) {
      return res.status(400).json({
        success: false,
        error: 'Job ID and candidate data are required'
      });
    }

    // Import CandidateJob model
    const CandidateJob = require('../models/Candidate_Job');

    // Process each candidate's feedback and result
    for (const candidate of candidateData) {
      const { candidateJobId, feedback, result } = candidate;

      if (!candidateJobId) continue;

      const candidateJob = await CandidateJob.findById(candidateJobId);
      if (!candidateJob) {
        console.log('=== DEBUG: Candidate job not found:', candidateJobId);
        continue;
      }

      // Get the current round index
      const currentRoundIndex = candidateJob.round_status.length > 0 ? candidateJob.round_status.length - 1 : 0;

      // Update or create round status entry
      if (candidateJob.round_status.length === 0) {
        candidateJob.round_status.push({
          round_feedback: feedback || '',
          round_result: result || ''
        });
      } else {
        candidateJob.round_status[currentRoundIndex].round_feedback = feedback || '';
        candidateJob.round_status[currentRoundIndex].round_result = result || '';
      }

      // Update overall status based on result using the correct format
      if (result === 'Selected') {
        // Change from any "interviewScheduled" status to "selected" with round number
        if (candidateJob.current_status.includes('interviewScheduled')) {
          candidateJob.current_status = candidateJob.current_status.replace('interviewScheduled', 'selected');
        } else {
          candidateJob.current_status = '1_selected'; // fallback
        }
      } else if (result === 'Rejected') {
        // Change from any "interviewScheduled" status to "rejected" with round number
        if (candidateJob.current_status.includes('interviewScheduled')) {
          candidateJob.current_status = candidateJob.current_status.replace('interviewScheduled', 'rejected');
        } else {
          candidateJob.current_status = '1_rejected'; // fallback
        }
      }

      await candidateJob.save();
      console.log('=== DEBUG: Updated candidate job:', candidateJobId);
    }

    // Update the job post status from "scheduled" to "completed"
    const JobPost = require('../models/JobPost');
    const jobPost = await JobPost.findById(jobId);
    
    if (jobPost) {
      // Change current_status from any "scheduled" to "completed" (regardless of round number)
      if (jobPost.current_status.includes('scheduled')) {
        const newStatus = jobPost.current_status.replace('scheduled', 'completed');
        console.log('=== DEBUG: Updating job status from', jobPost.current_status, 'to', newStatus);
        jobPost.current_status = newStatus;
        await jobPost.save();
        console.log('=== DEBUG: Job post status updated successfully');
      } else {
        console.log('=== DEBUG: Job post status does not contain "scheduled":', jobPost.current_status);
      }
    } else {
      console.log('=== DEBUG: Job post not found:', jobId);
    }

    res.json({
      success: true,
      message: 'Interview results saved successfully'
    });

  } catch (error) {
    console.error('=== ERROR in finishInterviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
};

// Get interview results for a completed job
exports.getInterviewResults = async (req, res) => {
  try {
    const { jobId } = req.params;
    const leadPanelistId = req.user._id;

    console.log('=== DEBUG: Fetching interview results for job:', jobId);

    // Verify user has lead_panelist role
    if (!req.user || !req.user.user_roles.includes('lead_panelist')) {
      return res.status(403).json({ error: 'Access denied. User is not a lead panelist.' });
    }

    // Import CandidateJob model
    const CandidateJob = require('../models/Candidate_Job');

    // Find all candidates for this job with status "selected" or "rejected" (any round)
    const candidateJobs = await CandidateJob.find({
      job_id: jobId,
      $or: [
        { current_status: { $regex: /selected/i } },
        { current_status: { $regex: /rejected/i } }
      ]
    });

    console.log('=== DEBUG: Found candidate jobs with selected/rejected status:', candidateJobs.length);

    // Format the response
    const interviewResults = candidateJobs.map(candidateJob => {
      // Get the latest round status (most recent feedback/result)
      const latestRoundStatus = candidateJob.round_status.length > 0 
        ? candidateJob.round_status[candidateJob.round_status.length - 1]
        : null;

      return {
        _id: candidateJob._id,
        candidateName: `${candidateJob.firstName} ${candidateJob.lastName}`.trim() || 'N/A',
        candidateEmail: candidateJob.contact?.email || 'N/A',
        feedback: latestRoundStatus?.round_feedback || 'No feedback provided',
        result: latestRoundStatus?.round_result || (candidateJob.current_status.includes('selected') ? 'Selected' : 'Rejected'),
        currentStatus: candidateJob.current_status
      };
    });

    console.log('=== DEBUG: Formatted interview results:', interviewResults.length);

    res.json({
      success: true,
      data: interviewResults
    });

  } catch (error) {
    console.error('=== ERROR in getInterviewResults:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
};
