import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
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
  Domain,
  VerifiedUser as VerifiedIcon,
  EmojiEvents as ExpertIcon,
  FiberManualRecord as OnlineIcon
} from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
// import { useNavigate } from "react-router-dom";
import "../../styles/BusinessManager.css";

const Overview = ({ setActiveTab }) => {
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [stats, setStats] = useState({
      totalJobPosts: 0,
      pendingMentorRequests: 0,
      pendingCompanyRequests: 0
    });
    const [subscriptions, setSubscriptions] = useState([]);
    const [jobTrends, setJobTrends] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
  const fetchManager = async () => {
    try {
      const res = await axios.get('http://localhost:5000/manager/active');
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching manager:', err);
    }
  };
  fetchManager();
}, []);

    useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/manager/dashboardStats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };
  fetchStats();
}, []);

  useEffect(() => {
  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/manager/subscriptionPlans');
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
    }
  };
  fetchSubscriptions();
}, []);

  useEffect(() => {
  const fetchJobTrends = async () => {
    try {
      const res = await axios.get('http://localhost:5000/manager/jobPosts/trends');
      setJobTrends(res.data);
    } catch (err) {
      console.error('Error fetching job posting trends:', err);
    }
  };
  fetchJobTrends();
}, []);



      const StatCard = ({ icon, title, value, change, color = '#96BEC5' }) => (
        <Zoom in={!loading} style={{ transitionDelay: '200ms' }}>
          <Card className="manager-stat-card">
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

      const handleEditOpen = () => {
        if (!profile) return; // don't open editor when profile hasn't loaded
        setOpenEdit(true);
      };
      const handleEditClose = () => setOpenEdit(false);
      const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
      };
      
      const handleSave = async () => {
        try {
      if (!profile?._id) throw new Error('No profile id');
      await axios.put(`http://localhost:5000/manager/${profile._id}`, profile);
     alert('Profile updated successfully!');
     setOpenEdit(false);
   } catch (err) {
     console.error('Error updating profile:', err);
     alert('Failed to update profile');
   }
};


    return (
        <Box>
            <Paper className="manager-dashboard-header" elevation={0}>
        <Box className="manager-header-content">
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
              <Typography variant="h4" className="manager-welcome-text">
                {profile ? `Welcome back, ${profile.name}!` : 'Welcome back!'}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Business Manager
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
    value={stats.totalJobPosts}
  />
</Grid>
<Grid item>
  <StatCard 
    icon={<AssignmentInd />}
    title="Mentor Verification Requests"
    value={stats.pendingMentorRequests}
    change="New this month"
    color="#ffa502"
  />
</Grid>
<Grid item>
  <StatCard 
    icon={<Domain />}
    title="Company Registration Requests"
    value={stats.pendingCompanyRequests}
    change="New"
    color="#10b981"
  />
</Grid>

            </Grid>
          </Box>
        </Box>
      </Paper>

      <Box className="manager-dashboard-content">
        <Box className="content-first-row" display="flex" flexDirection="row" alignItems="space-between" p={1}>
          <Paper className="manager-content-card manager-profile" elevation={2}>
            {profile ? (
  <Box display="flex" flexDirection="column" alignItems="center" p={3}>
    <Avatar 
      src={profile?.avatarUrl || ""} 
      sx={{ width: 80, height: 80, mb: 2 }} 
    />
    <Typography variant="h6" fontWeight="bold">
      {profile?.name || "—"}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
      {profile?.position || ""} {profile?.position && profile?.industry ? '•' : ''} {profile?.industry || ""}
    </Typography>
    <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center" mb={1}>
      <Chip label={`Email: ${profile?.email || ""}`} color="primary" size="small" />
      <Chip label={`Contact: ${profile?.contactNumber || ""}`} color="primary" size="small" />
      <Chip label={`Status: ${profile?.status || "N/A"}`} color={profile?.status === 'Active' ? 'success' : 'default'} size="small" />
    </Box>
    <Typography variant="body2" align="center" sx={{ mb: 2 }}>
      {profile?.description || ""}
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
) : (
  <Typography>Loading manager profile...</Typography>
)}

        </Paper>


        <Paper className="manager-content-card subscription" elevation={2}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" p={3}>
                <Box className="subscription-card-header" display="flex" alignItems="center" width="100%" mb={2}>
                    <Typography variant="h6" className="section-title" fontWeight="bold">
                        Subscription Overview
                    </Typography>
                    <Button
                        className="new-button"
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ marginLeft: 'auto' }}
                        onClick={() => navigate('/businessmanager/subscription-plans')}

                    >
                    View All
                </Button>
            </Box>

            <Box className="subscription-list">
                {subscriptions.length > 0 ? (
  subscriptions.map((plan, idx) => (
    <Box
      key={plan._id || idx}
      className="subscription-summary"
      mb={2}
      p={2}
      sx={{
        background: "#f4f7fa",
        borderLeft: `6px solid #3B5998`,
        borderRadius: 2
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {plan.name} ({plan.billingCycle})
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {plan.subscribers} companies subscribed
      </Typography>
    </Box>
  ))
) : (
  <Typography color="text.secondary">
    No subscription plans available
  </Typography>
)}

            </Box>
        </Box>
    </Paper>
        </Box>

        <Box className="content-second-row" display="flex" flexDirection="row" gap={3} mt={3}>
          {/* Statistic Chart Card */}
          <Paper className="manager-content-card stats-card" elevation={2} style={{ flex: 1 }}>
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Application Statistics
              </Typography>
              {/* Example Bar Chart using recharts */}
              <ResponsiveContainer width="100%" height={200}>
  <BarChart data={jobTrends}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="postings" fill="#3B5998" radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

            </Box>
          </Paper>

        </Box>
      </Box>

      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Manager Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Company Name"
            name="name"
            value={profile?.name || ''}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Position"
            name="position"
            value={profile?.position || ''}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Industry"
            name="industry"
            value={profile?.industry || ''}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Description"
            name="description"
            value={profile?.description || ''}
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
}

export default Overview;
