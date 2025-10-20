const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: false, // handled manually for some role pairs
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {  
        type: String,
        required: false, 
        trim: true
    },
    user_roles: {
        type: [String],
        enum: ['admin', 'candidate', 'recruiter', 'mentor', 'business_manager', 'lead_panelist', 'company'],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);
