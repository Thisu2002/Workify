const JobPost = require('../models/JobPost');

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
      current_status: "1_panelRequested"
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
