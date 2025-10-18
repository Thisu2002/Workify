const MentoringSession = require('../models/MentoringSession');

// Create a new mentoring session
exports.createSession = async (req, res) => {
    try {
        console.log('📝 Request body:', req.body);
        console.log('👤 User:', req.user);
        console.log('🔍 MentoringSession:', MentoringSession);
        console.log('🔍 Type:', typeof MentoringSession);
        console.log('🔍 Constructor name:', MentoringSession.constructor.name);
        console.log('🔍 Has create method:', typeof MentoringSession.create);
        
        // Check if mongoose is connected
        console.log('🔍 Mongoose connection readyState:', require('mongoose').connection.readyState);

        const { session_type, candidate_email, date_time, duration, notes } = req.body;

        if (!session_type || !candidate_email || !date_time) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        console.log('🚀 About to create session...');
        
        // Use .create() which is the proper Mongoose ways the proper Mongoose way
        const savedSession = await MentoringSession.create({
            mentor_id: req.user.id,
            session_type,
            candidate_email,
            date_time: new Date(date_time),
            duration: Number(duration),
            notes
        });

        console.log('✅ Saved session:', savedSession);

        res.status(201).json({
            success: true,
            message: 'Session scheduled successfully',
            data: savedSession
        });

    } catch (error) {
        console.error('❌ Create session error:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating session'
        });
    }
};

// Get all sessions for a mentor
exports.getMentorSessions = async (req, res) => {
    try {
        console.log('👤 Getting all sessions');
        
        // First, get total count
        const totalCount = await MentoringSession.countDocuments({});
        console.log('📊 Total sessions in database:', totalCount);
        
        // Get ALL sessions (remove the limit)
        const sessions = await MentoringSession.find({})
            .sort({ date_time: -1 }) // Sort by newest first
            .populate('mentor_id', 'firstName lastName email');

        console.log('✅ Found sessions:', sessions.length);
        console.log('📋 Session IDs:', sessions.map(s => s._id));
        
        // Log first few sessions for debugging
        if (sessions.length > 0) {
            console.log('🔍 First session:', {
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
        console.error('❌ Error fetching sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions'
        });
    }
};
