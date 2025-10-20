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

// Add a simple test endpoint to verify route setup
exports.testEndpoint = async (req, res) => {
  console.log('Test endpoint called');
  return res.json({ message: 'Test endpoint working' });
};
