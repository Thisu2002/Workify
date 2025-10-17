const MentoringSession = require('../models/MentoringSession');

// Create a new mentoring session
exports.createSession = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('User:', req.user);

        const { session_type, candidate_email, date_time, duration, notes } = req.body;

        if (!session_type || !candidate_email || !date_time) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const newSession = new MentoringSession({
            mentor_id: req.user.id,
            session_type,
            candidate_email,
            date_time: new Date(date_time),
            duration: Number(duration),
            notes
        });

        const savedSession = await newSession.save();
        console.log('Saved session:', savedSession);

        res.status(201).json({
            success: true,
            message: 'Session scheduled successfully',
            data: savedSession
        });

    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating session'
        });
    }
};

// Get all sessions for a mentor
exports.getMentorSessions = async (req, res) => {
    try {
        const sessions = await MentoringSession.find({ mentor_id: req.user.id })
            .sort({ date_time: -1 });

        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions'
        });
    }
};
