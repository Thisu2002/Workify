const MentoringSession = require('../models/MentoringSession');
const MentoringRequest = require('../models/MentoringRequest');
const mongoose = require('mongoose');

// Create a new mentoring session
exports.createSession = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('User:', req.user);
        console.log('MentoringSession:', MentoringSession);
        console.log('Type:', typeof MentoringSession);
        console.log('Constructor name:', MentoringSession.constructor.name);
        console.log('Has create method:', typeof MentoringSession.create);
        
        // Check if mongoose is connected
        console.log(' Mongoose connection readyState:', require('mongoose').connection.readyState);

        const { session_type, candidate_email, date_time, duration, notes } = req.body;

        if (!session_type || !candidate_email || !date_time) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        console.log('About to create session...');
        
        // Use .create() which is the proper Mongoose ways the proper Mongoose way
        const savedSession = await MentoringSession.create({
            mentor_id: req.user.id,
            session_type,
            candidate_email,
            date_time: new Date(date_time),
            duration: Number(duration),
            notes
        });

        // Update corresponding request status if it exists
        if (req.body.requestId) {
            await MentoringRequest.findByIdAndUpdate(
                req.body.requestId,
                { status: 'accepted' }
            );
        }

        console.log(' Saved session:', savedSession);

        res.status(201).json({
            success: true,
            message: 'Session scheduled successfully',
            data: savedSession
        });

    } catch (error) {
        console.error(' Create session error:', error);
        console.error(' Error name:', error.name);
        console.error(' Error message:', error.message);
        console.error(' Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating session'
        });
    }
};

// Get all sessions for a mentor
exports.getMentorSessions = async (req, res) => {
    try {
        console.log(' Getting all sessions');
        
        // First, get total count
        const totalCount = await MentoringSession.countDocuments({});
        console.log('Total sessions in database:', totalCount);
        
        // Get ALL sessions (remove the limit)
        const sessions = await MentoringSession.find({})
            .sort({ date_time: -1 }) // Sort by newest first
            .populate('mentor_id', 'firstName lastName email');

        console.log(' Found sessions:', sessions.length);
        console.log(' Session IDs:', sessions.map(s => s._id));
        
        // Log first few sessions for debugging
        if (sessions.length > 0) {
            console.log(' First session:', {
                id: sessions[0]._id,
                type: sessions[0].session_type,
                date: sessions[0].date_time,
                mentor: sessions[0].mentor_id
            });
        }

        res.status(200).json({
            success: true,
            data: sessions,
            count: sessions.length,
            totalInDB: totalCount
        });
    } catch (error) {
        console.error(' Error fetching sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions'
        });
    }
};

// Create a new mentoring request
exports.createRequest = async (req, res) => {
  try {
    const { request_type, experience, field, message, urgency, skills } = req.body;

    if (!request_type || !experience || !field || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: request_type, experience, field, message'
      });
    }

    // Assuming req.user is set by auth middleware and contains user info
    const candidate_id = req.user.id;
    const candidate_name = `${req.user.firstName} ${req.user.lastName}`;
    const candidate_avatar = req.user.avatar || ''; // Assuming avatar is in user model

    const newRequest = await MentoringRequest.create({
      candidate_id,
      candidate_name,
      candidate_avatar,
      request_type,
      experience,
      field,
      message,
      urgency: urgency || 'medium',
      skills: skills || []
    });

    res.status(201).json({
      success: true,
      message: 'Mentoring request submitted successfully',
      data: newRequest
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating request'
    });
  }
};

// Get all pending mentoring requests
exports.getRequests = async (req, res) => {
    try {
        console.log('Getting mentoring requests');
        
        // Get total count of pending requests
        const totalCount = await MentoringRequest.countDocuments({ status: 'pending' });
        console.log('Total pending requests in database:', totalCount);
        
        // Fetch only pending requests directly from DB
        const pendingRequests = await MentoringRequest.find({ status: 'pending' })
            .sort({ request_date: -1 })
            .lean();

        console.log('Found pending requests:', pendingRequests.length);
        
        // Log first request for debugging if available
        if (pendingRequests.length > 0) {
            console.log('First request:', {
                id: pendingRequests[0]._id,
                name: pendingRequests[0].candidate_name,
                type: pendingRequests[0].request_type
            });
        }

        // Transform the data to match frontend expectations
        const transformedRequests = pendingRequests.map(request => ({
            id: request._id,
            candidateName: request.candidate_name,
            candidateAvatar: request.candidate_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.candidate_name)}`,
            requestType: request.request_type.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            experience: request.experience,
            field: request.field,
            requestDate: new Date(request.request_date).toLocaleDateString(),
            message: request.message,
            urgency: request.urgency,
            skills: Array.isArray(request.skills) 
                ? request.skills 
                : request.skills.split(',').map(skill => skill.trim())
        }));

        res.status(200).json({
            success: true,
            data: transformedRequests,
            count: transformedRequests.length,
            totalInDB: totalCount
        });

    } catch (error) {
        console.error(' Error fetching requests:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching requests'
        });
    }
};
