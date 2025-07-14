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
import "../styles/Recruiter.css";

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
    <Box className="recruiter-dashboard-container">

      {/* Navigation */}
      <Paper className="recruiter-navigation" elevation={0}>
        <Box className="recruiter-nav-container">
          {[
            {
              id: 'overview',
              label: 'Overview',
              icon: <Person />
            },
            {
              id: 'jobs',
              label: 'Job Posts',
              icon: <WorkOutline />
            },
            {
              id: 'applications',
              label: 'Applications',
              icon: <AssignmentInd />
            },
            {
              id: 'interviews',
              label: 'Interviews',
              icon: <Schedule />
            },
            {
              id: 'feedback',
              label: 'Feedback',
              icon: <Feedback />
            }
          ].map((tab) => (
            <Button
              key={tab.id}
              className={`recruiter-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              startIcon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
              sx={{ position: 'relative' }}
            >
              {tab.label}
              {/* {tab.badge > 0 && (
                <Chip 
                  label={tab.badge} 
                  size="small" 
                  className="nav-badge"
                />
              )} */}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Top Welcome Section
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Avatar
            alt="Recruiter"
            src="https://randomuser.me/api/portraits/men/75.jpg"
            sx={{ width: 80, height: 80 }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h5">
            Welcome <strong>back, Recruiter!</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hiring Manager • 5 years experience
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip label="Verified" color="success" size="small" sx={{ mr: 1 }} />
            <Chip label="Recruiter" color="info" size="small" />
          </Box>
        </Grid>

        {/* Summary Stat Cards 
        <Grid item container xs={12} md={4} spacing={2}>
          <Grid item xs={4}>
            <Paper className="recruiter-stat-card">
              <Typography variant="body2">Total Job Posts</Typography>
              <Typography variant="h6">28</Typography>
              <Typography variant="caption" color="success.main">+5 this month</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className="recruiter-stat-card">
              <Typography variant="body2">Applications Received</Typography>
              <Typography variant="h6">102</Typography>
              <Typography variant="caption">New this week</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className="recruiter-stat-card">
              <Typography variant="body2">Interviews Scheduled</Typography>
              <Typography variant="h6">14</Typography>
              <Typography variant="caption">Ongoing</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid> */}

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
                Welcome back, Sajani Lankathilaka!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Software Engineer • 3 years experience
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
                  label="Job Seeker" 
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
                  title="Jobs Applied"
                  value="28"
                  change="+5 this month"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<EventNote />}
                  title="Upcoming Interviews"
                  value="11"
                  change="New this month"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<Schedule />}
                  title="Saved Jobs"
                  value="14"
                  change="Ongoing"
                  color="#10b981"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      {/* Overview Cards
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={3}>
          <Paper className="recruiter-overview-card">
            <Typography variant="body2">Open Job Posts</Typography>
            <Typography variant="h5">8</Typography>
            <Chip icon={<AddCircle />} label="2 new this week" size="small" />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="recruiter-overview-card">
            <Typography variant="body2">Pending Applications</Typography>
            <Typography variant="h5">35</Typography>
            <Chip icon={<AddCircle />} label="+7 this week" size="small" />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="recruiter-overview-card">
            <Typography variant="body2">Shortlisted Candidates</Typography>
            <Typography variant="h5">12</Typography>
            <Chip icon={<Star />} label="Promising profiles" size="small" />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="recruiter-overview-card">
            <Typography variant="body2">Upcoming Interviews</Typography>
            <Typography variant="h5">5</Typography>
            <Chip icon={<AccessTime />} label="Next at 3PM" size="small" />
          </Paper>
        </Grid>
      </Grid> */}

      {/* Recent Activity */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
        <List>
          <ListItem sx={{ mb: 1 }}>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText
              primary="Interview feedback submitted for James Miller"
              secondary="1 hour ago"
            />
          </ListItem>
          <ListItem sx={{ mb: 1 }}>
            <ListItemIcon><AddCircle color="primary" /></ListItemIcon>
            <ListItemText
              primary="New job post: Senior UI/UX Designer"
              secondary="Today at 9:00 AM"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><EventNote color="warning" /></ListItemIcon>
            <ListItemText
              primary="Interview scheduled with Priya Sharma"
              secondary="Tomorrow at 11:00 AM"
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default CandidateDashboard;
