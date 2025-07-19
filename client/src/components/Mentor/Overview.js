import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  alpha,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  Stack,
  Button,
  Zoom,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import {
  School,
  AccessTime,
  Star,
  Person,
  Schedule,
  Feedback,
  VerifiedUser as VerifiedIcon,
  EmojiEvents as ExpertIcon,
  FiberManualRecord as OnlineIcon
} from "@mui/icons-material";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, Legend } from "recharts";
import "../../styles/Recruiter.css";

const Overview = () => {
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [profile, setProfile] = useState({
    name: "Priyantha Hettiarachchi", 
    expertise: "Senior Tech Mentor",
    experience: "5 years mentoring experience",
    description: "Experienced mentor specializing in software development, career guidance, and interview preparation.",
    photoUrl: "https://randomuser.me/api/portraits/men/39.jpg" 
  });

  const StatCard = ({ icon, title, value, change, color = '#96BEC5' }) => (
    <Zoom in={!loading} style={{ transitionDelay: '200ms' }}>
      <Card className="recruiter-stat-card">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" className="stat-title">
                {title}
              </Typography>
              <Typography variant="h3" className="stat-value" sx={{ color }}>
                {value}
              </Typography>
              <Typography variant="caption" className="stat-change">
                {change}
              </Typography>
            </Box>
            <Box className="stat-icon" sx={{ backgroundColor: alpha(color, 0.1) }}>
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    setOpenEdit(false);
  };

  return (
    <Box>
      <Paper className="recruiter-dashboard-header" elevation={0}>
        <Box className="recruiter-header-content">
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar 
                src={profile.photoUrl} // Use photo URL from state
                sx={{ width: 80, height: 80, border: '3px solid #96BEC5' }}
              />
              <OnlineIcon 
                className="online-indicator"
                sx={{ 
                  position: 'absolute', 
                  bottom: 5, 
                  right: 5,
                  color: '#10b981',
                  backgroundColor: '#0F2445',
                  borderRadius: '50%',
                  fontSize: 16,
                  padding: '2px'
                }}
              />
            </Box>
            <Box>
              <Typography variant="h4" className="recruiter-welcome-text">
                Welcome back, {profile.name.split(' ')[0]}!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {profile.expertise} • {profile.experience}
              </Typography>
              <Box display="flex" gap={1} >
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Verified" 
                  size="small" 
                  className="verified-badge"
                />
                <Chip 
                  icon={<ExpertIcon />} 
                  label="Expert" 
                  size="small" 
                  className="expert-badge"
                />
              </Box>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Grid container spacing={2} wrap="nowrap">
              <Grid item xs={4}>
                <StatCard 
                  icon={<School />}
                  title="Total Sessions"
                  value="45"
                  change="+12 this month"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<Person />}
                  title="Pending Requests"
                  value="8"
                  change="New this week"
                  color="#ffa502"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<Star />}
                  title="Average Rating"
                  value="4.8"
                  change="Top rated mentor"
                  color="#10b981"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      <Box className="recruiter-dashboard-content">
        <Box className="content-first-row" display="flex" flexDirection="row" p={1}>
          {/* Sessions Activity Card */}
          <Paper className="content-card job-posts" elevation={2} style={{ flex: 2, minWidth: 0 }}>
            <Box display="flex" flexDirection="column" width="100%" p={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Session Activity
                </Typography>
                <Button size="small" sx={{ color: "#3B5998", textTransform: "none" }}>
                  Last 30 days
                </Button>
              </Box>
              {/* Legend */}
              <Stack direction="row" spacing={2} mb={2}>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 8, bgcolor: "#a259e6", borderRadius: 2, mr: 1 }} />
                  <Typography variant="caption">Requests</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 8, bgcolor: "#3be6c6", borderRadius: 2, mr: 1 }} />
                  <Typography variant="caption">Completed Sessions</Typography>
                </Box>
              </Stack>
              
              {/* Line Chart */}
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={[
                  { date: "Mon", Requests: 5, Completed: 3 },
                  { date: "Tue", Requests: 8, Completed: 5 },
                  { date: "Wed", Requests: 6, Completed: 4 },
                  { date: "Thu", Requests: 10, Completed: 7 },
                  { date: "Fri", Requests: 7, Completed: 5 }
                ]}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Requests" stroke="#a259e6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Completed" stroke="#3be6c6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Upcoming Sessions */}
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2" color="text.secondary">Upcoming Sessions</Typography>
                  <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                </Box>
                {[
                  { name: "Saman Anurapriya", type: "CV Review", time: "Today, 2:00 PM" },
                  { name: "Malith Kumara", type: "Mock Interview", time: "Today, 4:30 PM" },
                  { name: "Kamal Perera", type: "Career Guidance", time: "Tomorrow, 10:00 AM" },
                  { name: "Thisara Gamage", type: "Technical Mentoring", time: "Tomorrow, 3:00 PM" },
                ].map((session, idx) => (
                  <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" py={1} borderBottom={idx < 3 ? "1px solid #f0f0f0" : "none"}>
                    <Box>
                      <Typography variant="body1">{session.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{session.type}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">{session.time}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          <Box className="" display="flex" flexDirection="column" gap={3} style={{ flex: 1, minWidth: 0 }}>
            {/* Performance Stats */}
            <Paper className="content-card acquisitions-card" elevation={2} style={{ flex: 1, minWidth: 0 }}>
              <Box p={3}>
                <Box display="flex" justifyContent="space-between" >
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                    Performance Metrics
                  </Typography>
                  <Typography variant="caption" color="text.secondary">This Month</Typography>
                </Box>
                
                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#a259e6">Response Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">95%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: "95%", height: 6, bgcolor: "#a259e6", borderRadius: 3 }} />
                  </Box>
                  
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#3be6c6">Session Completion</Typography>
                    <Typography variant="body2" fontWeight="bold">88%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: "88%", height: 6, bgcolor: "#3be6c6", borderRadius: 3 }} />
                  </Box>
                  
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#f7b731">Satisfaction Score</Typography>
                    <Typography variant="body2" fontWeight="bold">92%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: "92%", height: 6, bgcolor: "#f7b731", borderRadius: 3 }} />
                  </Box>
                </Stack>
              </Box>
            </Paper>

            {/* Recent Feedback */}
            <Paper className="content-card applicants-card" elevation={2} style={{ flex: 1, minWidth: 0 }}>
              <Box p={3}>
                <Box display="flex" justifyContent="space-between" >
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                    Recent Feedback
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Last Week</Typography>
                </Box>
                <Stack spacing={2}>
                  {[
                    {
                      name: "Sandaruwan Perera",
                      feedback: "Excellent mentoring session. Very helpful!",
                      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
                      rating: "5.0"
                    },
                    {
                      name: "Malani Chandrasekara",
                      feedback: "Great advice on career progression. Thank you!",
                      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
                      rating: "4.8"
                    },
                    {
                      name: "Saman Perera",
                      feedback: "The mock interview was really well structured.",
                      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
                      rating: "4.9"
                    }
                  ].map((feedback, idx) => (
                    <Box key={idx} display="flex" alignItems="center" gap={2}>
                      <Avatar src={feedback.avatar} sx={{ width: 32, height: 32 }} />
                      <Box flex={1}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" fontWeight="bold">{feedback.name}</Typography>
                          <Chip label={feedback.rating} size="small" sx={{ bgcolor: "#e6f7fa", color: "#3B5998", height: 20, fontSize: 11 }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">{feedback.feedback}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Mentor Profile Card */}
          <Paper className="content-card company-profile" elevation={2} style={{ flex: 1, minWidth: 0 }}>
            <Box display="flex" flexDirection="column" alignItems="center" p={5} sx={{ flex: 1, height: "100%" }} >
              <Avatar
                src={profile.photoUrl} // Use photo URL from state
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                {profile.expertise}
              </Typography>
              <Chip 
                label="Software Development"
                className="it-services-chip"
                color="primary"
                sx={{ mb: 1 }} 
              />
              <Chip 
                label="Career Guidance"
                className="it-services-chip"
                color="primary"
                sx={{ mb: 2 }} 
              />
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                {profile.description}
              </Typography>
              <Button
                className="new-button"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleEditOpen}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Mentor Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Photo URL"
            name="photoUrl"
            value={profile.photoUrl}
            onChange={handleProfileChange}
            fullWidth
            helperText="Enter a URL for your profile photo"
          />
          <TextField
            margin="normal"
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Expertise"
            name="expertise"
            value={profile.expertise}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Experience"
            name="experience"
            value={profile.experience}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Description"
            name="description"
            value={profile.description}
            onChange={handleProfileChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Overview;
