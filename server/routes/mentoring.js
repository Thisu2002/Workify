const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const User = require('../models/User');

// Define MentoringSession schema
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
    type: String,
    required: true
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
    type: Number, // in minutes
    default: 60
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Create model if it doesn't exist
let MentoringSession;
try {
  MentoringSession = mongoose.model('MentoringSession');
} catch (error) {
  MentoringSession = mongoose.model('MentoringSession', MentoringSessionSchema);
}

// Get mentoring sessions with specific status (pending, scheduled, etc.)
router.get('/sessions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { status } = req.query;
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let query = {};
    
    // Set query based on user role
    if (user.user_roles && user.user_roles.includes('mentor')) {
      query.mentorId = req.user.id;
    } else if (user.user_roles && user.user_roles.includes('candidate')) {
      query.candidateId = req.user.id;
    } else {
      return res.status(403).json({
        success: false,
        message: 'User must be a mentor or candidate'
      });
    }
    
    // Add status filter - explicitly use the status parameter from query
    if (status) {
      query.status = status;
      console.log(`Filtering sessions by status: ${status}`);
    }
    
    console.log('Final query:', query);
    
    const sessions = await MentoringSession.find(query)
      .sort({ createdAt: -1 });
    
    console.log(`Found ${sessions.length} sessions matching query`);
    
    return res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Error fetching mentoring sessions:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions'
    });
  }
});

// Create a new session directly (status: pending)
router.post('/sessions', auth, async (req, res) => {
  try {
    const { candidate_email, session_type, date_time, duration, notes } = req.body;
    
    // Validate required fields
    if (!candidate_email || !session_type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: candidate_email and session_type are required'
      });
    }
    
    // Find mentor
    const mentor = await User.findById(req.user.id);
    if (!mentor || !mentor.user_roles.includes('mentor')) {
      return res.status(403).json({
        success: false,
        message: 'Only mentors can create sessions'
      });
    }
    
    // Find candidate by email
    const candidate = await User.findOne({ email: candidate_email });
    
    // Create new session with pending status
    const newSession = new MentoringSession({
      mentorId: req.user.id,
      candidate_email: candidate_email,
      candidateId: candidate ? candidate._id : null,
      candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : null,
      candidateAvatar: candidate ? candidate.profilePicture : null,
      session_type: session_type,
      date_time: date_time || null,
      scheduledDate: date_time ? new Date(date_time) : null,
      duration: duration || 60,
      notes: notes || '',
      status: 'pending' // Always create with pending status
    });
    
    const savedSession = await newSession.save();
    console.log('Created new pending session:', savedSession);
    
    return res.status(201).json({
      success: true,
      data: savedSession
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating session'
    });
  }
});

// Update a session
router.put('/sessions/:id', auth, async (req, res) => {
  try {
    const { status, scheduledDate, date_time, duration, notes } = req.body;
    
    // Find the session
    const session = await MentoringSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Authorization check (only mentor can update their own sessions)
    if (session.mentorId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }
    
    // Update fields if provided
    if (status) session.status = status;
    if (scheduledDate) {
      session.scheduledDate = new Date(scheduledDate);
      if (!session.date_time) session.date_time = scheduledDate;
    }
    if (date_time) {
      session.date_time = date_time;
      session.scheduledDate = new Date(date_time);
    }
    if (duration) session.duration = parseInt(duration);
    if (notes !== undefined) session.notes = notes;
    
    // Save the updated session
    const updatedSession = await session.save();
    
    return res.json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating session'
    });
  }
});

// Create a mentoring request from candidate to mentor
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, sessionGoals, requestType } = req.body;
    
    // Validate required fields
    if (!mentorId || !sessionGoals) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID and session goals are required'
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
    
    // Get candidate profile for additional info
    const candidateProfile = await require('../models/Candidate').findById(req.user.id);
    
    // Create new mentoring session with pending status
    const newSession = new MentoringSession({
      mentorId: mentorId,
      candidateId: req.user.id,
      candidate_email: candidate.email,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      candidateAvatar: candidateProfile?.avatarUrl || '',
      session_type: requestType || 'General Mentoring',
      message: sessionGoals,
      status: 'pending',
      urgency: 'medium',
      requestDate: new Date()
    });
    
    const savedSession = await newSession.save();
    
    return res.status(201).json({
      success: true,
      message: 'Mentoring request sent successfully',
      data: savedSession
    });
  } catch (error) {
    console.error('Error creating mentoring request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating request'
    });
  }
});



module.exports = router;
