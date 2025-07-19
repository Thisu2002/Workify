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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import {
  AssignmentInd,
  Star,
  Assessment,
  Schedule,
  VerifiedUser as VerifiedIcon,
  EmojiEvents as ExpertIcon,
  FiberManualRecord as OnlineIcon,
} from "@mui/icons-material";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, Legend } from "recharts";
import "../../styles/LeadPanelist.css";

const StatCard = ({ icon, title, value, change, color = '#96BEC5' }) => (
  <Zoom in={true} style={{ transitionDelay: '200ms' }}>
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

const Overview = () => {
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [profile, setProfile] = useState({
    name: "Dr. Samaraweera",
    position: "Lead Interview Panelist",
    experience: "8 years of interview experience",
    description: "Expert in technical interviews and candidate evaluation. Leading panel for software engineering roles.",
    photoUrl: "https://randomuser.me/api/portraits/men/42.jpg"
  });

  const [stats, setStats] = useState({
    totalPanels: 12,
    activeInterviews: 8,
    completedInterviews: 45,
    panelRating: 4.9,
    weekInterviews: 15,
    pendingFeedback: 3
  });

  const [upcomingInterviews] = useState([
    {
      id: 1,
      candidateName: 'Saman Perera',
      candidateAvatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      position: 'Senior React Developer',
      scheduledTime: '2024-01-18 10:00',
      duration: '60 min',
      panelId: 1,
      status: 'confirmed',
      interviewType: 'Technical Round',
      meetingLink: 'https://meet.google.com/abc-def-ghi'
    },
    {
      id: 2,
      candidateName: 'Sewwandi Silva',
      candidateAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      position: 'Design Lead',
      scheduledTime: '2024-01-18 14:00',
      duration: '90 min',
      panelId: 2,
      status: 'pending',
      interviewType: 'Portfolio Review',
      meetingLink: 'https://meet.google.com/xyz-abc-def'
    },
    {
      id: 3,
      candidateName: 'Malith Abeyrathne',
      candidateAvatar: 'https://randomuser.me/api/portraits/men/43.jpg',
      position: 'Full Stack Developer',
      scheduledTime: '2024-01-19 11:00',
      duration: '75 min',
      panelId: 1,
      status: 'confirmed',
      interviewType: 'System Design',
      meetingLink: 'https://meet.google.com/mno-pqr-stu'
    }
  ]);

  const [recentFeedback] = useState([
    {
      id: 1,
      candidateName: "Senura Nanayakkara",
      position: "Frontend Developer",
      rating: 4.2,
      feedback: "Strong technical skills, excellent problem-solving abilities",
      date: "2024-01-15",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg"
    },
    {
      id: 2,
      candidateName: "Amali Silva",
      position: "UX Designer",
      rating: 4.8,
      feedback: "Outstanding portfolio and design thinking process",
      date: "2024-01-14",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      id: 3,
      candidateName: "Kasun Perera",
      position: "Backend Developer",
      rating: 4.5,
      feedback: "Excellent system design knowledge and coding practices",
      date: "2024-01-13",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg"
    }
  ]);

  const [performanceMetrics] = useState({
    responseRate: 95,
    completionRate: 88,
    satisfactionScore: 92,
    averageRating: 4.7,
    weeklyInterviews: 15,
    monthlyInterviews: 45
  });

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
      {/* Header Section */}
      <Paper className="recruiter-dashboard-header" elevation={0}>
        <Box className="recruiter-header-content">
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar 
                src={profile.photoUrl}
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
                Welcome back, {profile.name.split(' ')[1]}!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {profile.position} • {profile.experience}
              </Typography>
              <Box display="flex" gap={1} >
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Lead Panelist" 
                  size="small" 
                  className="verified-badge"
                />
                <Chip 
                  icon={<ExpertIcon />} 
                  label="Senior Evaluator" 
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
                  icon={<AssignmentInd />}
                  title="Total Interviews"
                  value="125"
                  change="+15 this month"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<Assessment />}
                  title="Success Rate"
                  value="92%"
                  change="Above target"
                  color="#10b981"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<Star />}
                  title="Panel Rating"
                  value="4.9"
                  change="Top rated panel"
                  color="#ffa502"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      <Box className="recruiter-dashboard-content">
        <Box className="content-first-row" display="flex" flexDirection="row" p={1}>
          {/* Interview Activity Chart */}
          <Paper className="content-card job-posts" elevation={2} style={{ flex: 2, minWidth: 0 }}>
            <Box display="flex" flexDirection="column" width="100%" p={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Interview Activity
                </Typography>
                <Button size="small" sx={{ color: "#3B5998", textTransform: "none" }}>
                  Last 30 days
                </Button>
              </Box>
              
              {/* Legend */}
              <Stack direction="row" spacing={2} mb={2}>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 8, bgcolor: "#a259e6", borderRadius: 2, mr: 1 }} />
                  <Typography variant="caption">Scheduled Interviews</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 8, bgcolor: "#3be6c6", borderRadius: 2, mr: 1 }} />
                  <Typography variant="caption">Completed Interviews</Typography>
                </Box>
              </Stack>
              
              {/* Line Chart */}
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={[
                  { date: "Mon", Scheduled: 8, Completed: 6 },
                  { date: "Tue", Scheduled: 12, Completed: 10 },
                  { date: "Wed", Scheduled: 10, Completed: 8 },
                  { date: "Thu", Scheduled: 15, Completed: 12 },
                  { date: "Fri", Scheduled: 9, Completed: 7 }
                ]}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Scheduled" stroke="#a259e6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Completed" stroke="#3be6c6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Upcoming Interviews List */}
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2" color="text.secondary">Candidate</Typography>
                  <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                </Box>
                {upcomingInterviews.map((interview, idx) => (
                  <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" py={1} borderBottom={idx < 3 ? "1px solid #f0f0f0" : "none"}>
                    <Box>
                      <Typography variant="body1">{interview.candidateName}</Typography>
                      <Typography variant="caption" color="text.secondary">{interview.position}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">{interview.scheduledTime.split(' ')[1]}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Right Column Cards */}
          <Box className="" display="flex" flexDirection="column" gap={3} style={{ flex: 1, minWidth: 0 }}>
            {/* Performance Metrics Card */}
            <Paper className="content-card acquisitions-card" elevation={2} style={{ flex: 1, minWidth: 0 }}>
              <Box p={3}>
                <Box display="flex" justifyContent="space-between">
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
                    <Typography variant="body2" color="#3be6c6">Interview Completion</Typography>
                    <Typography variant="body2" fontWeight="bold">88%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: "88%", height: 6, bgcolor: "#3be6c6", borderRadius: 3 }} />
                  </Box>

                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#f7b731">Candidate Satisfaction</Typography>
                    <Typography variant="body2" fontWeight="bold">92%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: "92%", height: 6, bgcolor: "#f7b731", borderRadius: 3 }} />
                  </Box>

                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#ff6b6b">Feedback Submissions</Typography>
                    <Typography variant="body2" fontWeight="bold">96%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3 }}>
                    <Box sx={{ width: "96%", height: 6, bgcolor: "#ff6b6b", borderRadius: 3 }} />
                  </Box>

                  <Box mt={2} pt={2} borderTop="1px solid #f0f0f0">
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Monthly Overview
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Typography variant="h6" color="#0F2445">45</Typography>
                        <Typography variant="caption" color="text.secondary">Total Interviews</Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" color="#10b981">4.8</Typography>
                        <Typography variant="caption" color="text.secondary">Avg Rating</Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" color="#3B5998">92%</Typography>
                        <Typography variant="caption" color="text.secondary">Success Rate</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Paper>

            {/* Recent Evaluations Card */}
            <Paper className="content-card applicants-card" elevation={2} style={{ flex: 1, minWidth: 0 }}>
              <Box p={3}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                    Recent Evaluations
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Today</Typography>
                </Box>
                <Stack spacing={2}>
                  {recentFeedback.map((feedback) => (
                    <Box key={feedback.id} display="flex" alignItems="center" justifyContent="space-between" py={1} borderBottom="1px solid #f0f0f0">
                      <Box display="flex" alignItems="center">
                        <Avatar src={feedback.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                        <Box>
                          <Typography variant="body1">{feedback.candidateName}</Typography>
                          <Typography variant="caption" color="text.secondary">{feedback.position}</Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" fontWeight="medium">{feedback.rating}</Typography>
                        <Typography variant="caption" color="text.secondary">{feedback.date}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Right Most Column */}
          <Box className="" display="flex" flexDirection="column" gap={3} style={{ flex: 1, minWidth: 0 }}>
            {/* Lead Panelist Profile Card */}
            <Paper className="content-card company-profile" elevation={2} style={{ flex: 1, minWidth: 0, height: '100%' }}>
              <Box p={3} display="flex" flexDirection="column" height="100%">
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  Panelist Profile
                </Typography>
                
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar 
                    src={profile.photoUrl}
                    sx={{ width: 56, height: 56, border: '2px solid #96BEC5', mr: 2 }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {profile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {profile.position}
                    </Typography>
                  </Box>
                </Box>

                <Box flex={1} mb={3}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {profile.description}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip 
                      label="Technical Interviews" 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    <Chip 
                      label="Panel Lead" 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    <Chip 
                      label="Senior Evaluator" 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                  </Stack>
                </Box>
                
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ 
                    color: '#0F2445', 
                    borderColor: '#96BEC5', 
                    textTransform: 'none',
                    borderRadius: 2,
                    alignSelf: 'flex-start',
                    '&:hover': {
                      borderColor: '#0F2445',
                      backgroundColor: alpha('#0F2445', 0.1),
                    }
                  }}
                  onClick={handleEditOpen}
                >
                  Edit Profile
                </Button>
              </Box>
            </Paper>

            {/* Calendar Card - Moved here */}
            <Paper className="content-card calendar-card" elevation={2} style={{ flex: 1, minWidth: 0 }}>
              <Box p={3}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                    Interview Calendar
                  </Typography>
                  <Typography variant="caption" color="text.secondary">January 2024</Typography>
                </Box>
                
                {/* Calendar Grid */}
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <Grid item xs={1.7} key={day}>
                        <Typography variant="caption" align="center" display="block" fontWeight="bold">
                          {day}
                        </Typography>
                      </Grid>
                    ))}
                    
                    {[...Array(31)].map((_, index) => (
                      <Grid item xs={1.7} key={index}>
                        <Box
                          sx={{
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            position: 'relative',
                            cursor: 'pointer',
                            ...(index + 1 === 15 && {
                              bgcolor: '#e6f7fa',
                              color: '#0F2445',
                              fontWeight: 'bold'
                            }),
                            '&:hover': {
                              bgcolor: '#f5f5f5'
                            }
                          }}
                        >
                          <Typography variant="caption">
                            {index + 1}
                          </Typography>
                          {[5, 12, 15, 20].includes(index + 1) && (
                            <Box
                              sx={{
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                bgcolor: '#3B5998',
                                position: 'absolute',
                                bottom: 2
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Today's Schedule */}
                <Box mt={2} pt={2} borderTop="1px solid #f0f0f0">
                  <Typography variant="body2" fontWeight="medium" mb={1}>
                    Today's Schedule
                  </Typography>
                  { [
                    { time: '10:00 AM', candidate: 'Technical Interview - John Doe' },
                    { time: '02:30 PM', candidate: 'System Design - Sarah Smith' }
                  ].map((schedule, idx) => (
                    <Box key={idx} display="flex" gap={2} mb={1}>
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 70 }}>
                        {schedule.time}
                      </Typography>
                      <Typography variant="caption">
                        {schedule.candidate}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        {/* Edit profile form */}
      </Dialog>
    </Box>
  );
};

export default Overview;
