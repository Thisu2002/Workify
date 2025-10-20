const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const User = require('../models/User');
const Mentor = require('../models/Mentor'); // Add this import

// Define the MentoringSession model schema
const MentoringSessionSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateName: {
    type: String
  },
  candidateAvatar: {
    type: String,
    default: ''
  },
  candidate_email: {
    type: String,
    required: true
  },
  requestType: {
    type: String
  },
  session_type: {
    type: String
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  field: {
    type: String,
    default: 'General Mentoring'
  },
  experience: {
    type: String
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  scheduledDate: {
    type: Date
  },
  date_time: {
    type: String
  },
  duration: {
    type: Number,
    default: 60
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Create MentoringSession model if it doesn't exist
let MentoringSession;
try {
  MentoringSession = mongoose.model('MentoringSession');
} catch (error) {
  MentoringSession = mongoose.model('MentoringSession', MentoringSessionSchema);
}

// Get mentoring sessions - with status filter
router.get('/sessions', auth, async (req, res) => {
  try {
    const { status } = req.query;
    console.log('Request query status:', status);

    // Get the authenticated user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build query
    let query = {};
    
    // Apply role-based filtering
    if (user.user_roles.includes('mentor')) {
      // Check for mentorId in both formats
      query.$or = [
        { mentorId: req.user.id },
        { mentor_id: req.user.id } // Add this to check for mentor_id field
      ];
    } else if (user.user_roles.includes('candidate')) {
      query.candidateId = req.user.id;
    }
    
    // Apply status filter if provided using case-insensitive regex to handle both cases
    if (status) {
      // Case-insensitive query that matches both 'scheduled' and 'Scheduled'
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
      console.log(`Filtering sessions by status (case-insensitive): "${status}"`);
    }

    console.log('Database query:', JSON.stringify(query));

    // Execute query with explicit sort order to get newest first
    const sessions = await MentoringSession.find(query)
      .sort({ createdAt: -1 })
      .lean(); // Use lean for better performance
      
    console.log(`Found ${sessions.length} sessions with status: ${status || 'all'}`);
    
    // Log a sample session to see what fields are available
    if (sessions.length > 0) {
      console.log('Sample session data:', JSON.stringify(sessions[0]));
    }

    return res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Error in /sessions route:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update session status - ensure we normalize the status casing
router.put('/sessions/:id', auth, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const updates = { ...req.body };
    
    // Normalize status to lowercase
    if (updates.status) {
      updates.status = updates.status.toLowerCase();
      
      // If status is being changed to completed, ensure we have the message/feedback
      if (updates.status === 'completed' && updates.message) {
        console.log('Session completed with feedback:', updates.message);
      }
    }
    
    // Find the session
    const session = await MentoringSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Check permission (only mentor can update)
    if (session.mentorId && session.mentorId.toString() !== req.user.id.toString()) {
      // Also check mentor_id if mentorId is not available
      if (!session.mentor_id || session.mentor_id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this session'
        });
      }
    }
    
    // Apply updates
    Object.keys(updates).forEach(key => {
      session[key] = updates[key];
    });
    
    await session.save();
    console.log('Session updated successfully:', session);
    
    return res.json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create a new session - ensure consistent status casing
router.post('/sessions', auth, async (req, res) => {
  try {
    const { candidate_email, session_type, date_time, duration, notes, status } = req.body;
    
    // Validate input
    if (!candidate_email) {
      return res.status(400).json({
        success: false,
        message: 'Candidate email is required'
      });
    }
    
    // Find the candidate by email
    const candidate = await User.findOne({ email: candidate_email });
    
    // Create new session with specified status (normalize to lowercase)
    const newSession = new MentoringSession({
      mentorId: req.user.id,
      candidate_email,
      candidateId: candidate ? candidate._id : null,
      candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : null,
      candidateAvatar: candidate ? candidate.profilePicture : null,
      session_type: session_type || 'general',
      date_time,
      scheduledDate: date_time ? new Date(date_time) : null,
      duration: duration || 60,
      notes,
      status: (status || 'scheduled').toLowerCase() // Normalize to lowercase
    });
    
    await newSession.save();
    console.log('New session created:', newSession);
    
    return res.status(201).json({
      success: true,
      data: newSession
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add a migration utility to normalize existing status values
router.post('/normalize-status', auth, async (req, res) => {
  try {
    // Only allow admins to run this
    const user = await User.findById(req.user.id);
    if (!user || !user.user_roles.includes('admin')) {
      return res.status(403).json({ 
        success: false,
        message: 'Only admins can perform this operation' 
      });
    }

    // Get all sessions
    const sessions = await MentoringSession.find({});
    let updatedCount = 0;

    // Update each session with normalized status
    for (const session of sessions) {
      if (session.status) {
        const oldStatus = session.status;
        session.status = session.status.toLowerCase();
        
        if (oldStatus !== session.status) {
          await session.save();
          updatedCount++;
        }
      }
    }

    return res.json({
      success: true,
      message: `Normalized status for ${updatedCount} sessions`
    });
  } catch (error) {
    console.error('Error normalizing session status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create a mentoring request from candidate to mentor
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, sessionGoals, requestType } = req.body;
    
    console.log('Received request data:', { mentorId, sessionGoals, requestType }); // Debug log
    
    // Validate required fields
    if (!mentorId || !sessionGoals) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID and session goals are required'
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mentor ID format'
      });
    }

    // Get candidate information from authenticated user
    const candidate = await User.findById(req.user.id);
    if (!candidate || !candidate.user_roles.includes('candidate')) {
      return res.status(403).json({
        success: false,
        message: 'Only candidates can create mentoring requests'
      });
    }

    console.log('Candidate found:', candidate.firstName, candidate.lastName); // Debug log

    // Check if candidate already has a pending or scheduled request with this mentor
    const existingRequest = await MentoringSession.findOne({
      candidateId: req.user.id,
      mentorId: mentorId,
      status: { $in: ['pending', 'scheduled'] }
    });

    console.log('Existing request check:', existingRequest); // Debug log

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending or scheduled session with this mentor'
      });
    }

    // Verify mentor exists (check if it's a valid mentor ID)
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      // If not found in Mentor collection, check if it's a valid user with mentor role
      const mentorUser = await User.findById(mentorId);
      if (!mentorUser || !mentorUser.user_roles.includes('mentor')) {
        return res.status(404).json({
          success: false,
          message: 'Mentor not found'
        });
      }
    }

    console.log('Mentor verification passed'); // Debug log
    
    // Create new mentoring session with pending status
    const newSession = new MentoringSession({
      mentorId: mentorId,
      candidateId: req.user.id,
      candidate_email: candidate.email,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      candidateAvatar: candidate.profilePicture || '',
      session_type: requestType || 'General Mentoring',
      message: sessionGoals,
      status: 'pending',
      urgency: 'medium',
      requestDate: new Date(),
      field: 'General Mentoring'
    });
    
    const savedSession = await newSession.save();
    console.log('New session created:', savedSession); // Debug log
    
    return res.status(201).json({
      success: true,
      message: 'Mentoring request sent successfully',
      data: {
        sessionId: savedSession._id,
        mentorId: mentorId,
        status: 'pending',
        requestDate: savedSession.requestDate,
        session: savedSession
      }
    });
  } catch (error) {
    console.error('Error creating mentoring request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating request',
      error: error.message
    });
  }
});

// Get candidate's sessions
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const candidateId = req.user.id;
    
    const sessions = await MentoringSession.find({ candidateId })
      .sort({ createdAt: -1 });
    
    const formattedSessions = await Promise.all(sessions.map(async (session) => {
      let mentorName = 'Unknown Mentor';
      
      if (session.mentorId) {
        try {
          // First try Mentor collection
          const mentor = await Mentor.findById(session.mentorId);
          if (mentor) {
            mentorName = mentor.name;
          } else {
            // Fallback to User collection
            const mentorUser = await User.findById(session.mentorId);
            if (mentorUser) {
              mentorName = `${mentorUser.firstName || ''} ${mentorUser.lastName || ''}`.trim();
            }
          }
        } catch (error) {
          console.error('Error fetching mentor details:', error);
        }
      }
      
      return {
        _id: session._id,
        mentorId: session.mentorId,
        mentorName: mentorName,
        mentorAvatar: '',
        session_type: session.session_type,
        status: session.status,
        message: session.message,
        requestDate: session.requestDate,
        scheduledDate: session.scheduledDate,
        date_time: session.date_time,
        duration: session.duration,
        notes: session.notes
      };
    }));
    
    return res.status(200).json({
      success: true,
      data: formattedSessions
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching sessions'
    });
  }
});



module.exports = router;
