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
  FiberManualRecord as OnlineIcon
} from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import "../../styles/Recruiter.css";

const Overview = () => {
    const [loading, setLoading] = useState(false);
    
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

    return (
        <Box>
            <Paper className="recruiter-dashboard-header" elevation={0}>
        <Box className="recruiter-header-content">
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
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
                Welcome back, Recruiter!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Hiring Manager • 3 years experience
              </Typography>
              <Box display="flex" gap={1} mt={1}>
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
                  icon={<WorkOutline />}
                  title="Total Job Posts"
                  value="28"
                  change="+5 this month"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<AssignmentInd />}
                  title="Applications Received"
                  value="102"
                  change="New this month"
                  color="#ffa502"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<Schedule />}
                  title="Interviews Scheduled"
                  value="14"
                  change="Ongoing"
                  color="#10b981"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      <Box className="recruiter-dashboard-content">
        <Box className="content-first-row" display="flex" flexDirection="row" alignItems="space-between" p={1}>
          <Paper className="content-card company-profile" elevation={2}>
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Avatar
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=120&h=120&fit=crop"
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold">
                Acme Tech Solutions
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                Bangalore, India
              </Typography>
              <Chip 
                label="IT Services" 
                className="it-services-chip"
                color="primary" 
                // size="small" 
                sx={{ mb: 2 }} />
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                Leading provider of innovative tech solutions for businesses worldwide. 500+ employees, 10+ years in the industry.
              </Typography>
              <Button className="new-button" variant="contained" color="primary" size="small">
                Edit Profile
              </Button>
            </Box>
          </Paper>

          <Paper className="content-card job-posts" elevation={2}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" p={3} >
                <Box className="jobpost-card-header" display="flex" alignItems="center" width="100%" mb={2}>
                  {/* <WorkOutline sx={{ fontSize: 32, color: "#3B5998", mr: 1 }} /> */}
                  <Typography variant="h6" className="section-title" fontWeight="bold">
                    Open Job Posts
                  </Typography>
                  <Button className="new-button" variant="contained" color="primary" size="small" sx={{ marginLeft: 'auto' }}>
                    View All Jobs
                  </Button>
                </Box>
                {/* Short list of open jobs */}
                <Box className="job-posts-list">
                  {[
                    { title: "Frontend Developer", applications: 12, location: "Remote" },
                    { title: "Backend Engineer", applications: 8, location: "Bangalore" },
                    { title: "UI/UX Designer", applications: 5, location: "Remote" }
                  ].map((job, idx) => (
                    <Box key={idx} className="job-post-summary" mb={2} p={2} sx={{ background: "#f4f7fa", borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.location} &nbsp;|&nbsp; {job.applications} applications
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>  
          </Paper>
        </Box>
        
      </Box>
        </Box>
    );
}

export default Overview;
