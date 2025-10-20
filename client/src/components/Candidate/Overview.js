import React, { useState, useEffect } from 'react';
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
  Button,
  Zoom,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  AddCircle,
  AccessTime,
  Star,
  CheckCircle,
  Add,
  Person,
  WorkOutline,
  AssignmentInd,
  Schedule,
  Feedback,
  EventNote,
  VerifiedUser as VerifiedIcon,
  EmojiEvents as ExpertIcon,
  FiberManualRecord as OnlineIcon,
  School
} from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import axios from 'axios';
import "../../styles/Recruiter.css";

const Overview = React.memo(() => {
    const [loading, setLoading] = useState(false);
    const [upcomingInterviewsCount, setUpcomingInterviewsCount] = useState(0);
    const [jobsAppliedCount, setJobsAppliedCount] = useState(0);
    
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch upcoming interviews (both pending and scheduled)
        const interviewsResponse = await axios.get('http://localhost:5000/api/interviews/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch job applications
        const applicationsResponse = await axios.get('http://localhost:5000/api/applicationTracker/my-applications', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (interviewsResponse.data.success) {
          // Count only scheduled interviews (confirmed ones)
          const scheduledInterviews = interviewsResponse.data.data.filter(interview => 
            interview.candidate_job_status && interview.candidate_job_status.includes('Scheduled')
          );
          setUpcomingInterviewsCount(scheduledInterviews.length);
        }

        if (applicationsResponse.data.success) {
          setJobsAppliedCount(applicationsResponse.data.data.length);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data when component mounts
    useEffect(() => {
      fetchDashboardData();
    }, []);
    
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
                  {loading ? '...' : value}
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

    return (
        <Box>
            <Paper className="recruiter-dashboard-header" elevation={0}>
        <Box className="recruiter-header-content">
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar 
                src=""
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
                Welcome back, Sajani Upeksha
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Aspiring Software Engineer • 3 years experience
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip 
                  icon={<School />} 
                  label="Graduate" 
                  size="small"
                />
                <Chip 
                  icon={<WorkOutline />} 
                  label="Experienced" 
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Grid container spacing={2} wrap="nowrap">
              <Grid item xs={4}>
                <StatCard 
                  icon={<AssignmentInd />}
                  title="Upcoming Interviews"
                  value={upcomingInterviewsCount}
                />
              </Grid>
              <Grid item xs={4}>
                <StatCard 
                  icon={<WorkOutline />}
                  title="Jobs Applied"
                  value={jobsAppliedCount}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
        </Box>
    );
})

export default Overview;
