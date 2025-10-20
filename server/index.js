const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const path = require('path');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', require('./routes/auth'));
app.use('/recruiter', require('./routes/recruiter'));
app.use('/candidate', require('./routes/candidate')); 
app.use('/manager', require('./routes/business_manager'));
app.use('/admin', require('./routes/admin'));

const jobRoutes = require('./routes/jobs'); 
app.use('/api/jobs', jobRoutes); 

// Mentoring routes
app.use('/api/mentoring', require('./routes/mentoring'));

// Import mentor routes
const mentorRoutes = require('./routes/mentors');
app.use('/api/mentors', mentorRoutes);

// Application tracking routes
const applicationTrackerRoutes = require('./routes/applicationTracker');
app.use('/api/applicationTracker', applicationTrackerRoutes);

//app.use('/user', require('./routes/user')); // Assuming you have a user route
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
