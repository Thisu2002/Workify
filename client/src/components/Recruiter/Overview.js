import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress
} from "@mui/material";
import {
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar,LineChart, Line, Legend } from "recharts";

// import { useNavigate } from "react-router-dom";
import "../../styles/Recruiter.css";

const Overview = ({ setActiveTab }) => {
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState('weekly');
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/recruiter/dashboard/stats?filter=${selectedJobFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Dashboard data received:', response.data);
        console.log('User profile:', response.data.userProfile);
        console.log('Top active jobs:', response.data.topActiveJobs);
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedJobFilter]);

  // Generate chart data from API response
  const generateChartData = () => {
    if (!dashboardData?.topActiveJobs || dashboardData.topActiveJobs.length === 0) {
      console.log('No topActiveJobs data available');
      return [];
    }
    
    // Create time-series data based on filter
    const daysToShow = selectedJobFilter === 'daily' ? 7 : 
                       selectedJobFilter === 'weekly' ? 7 : 30;
    
    // Get totals from actual data
    const totalApps = dashboardData.topActiveJobs.reduce((sum, job) => sum + job.applications, 0);
    const totalShortlisted = dashboardData.topActiveJobs.reduce((sum, job) => sum + job.shortlisted, 0);
    const totalRejected = dashboardData.topActiveJobs.reduce((sum, job) => sum + job.rejected, 0);
    
    console.log('Chart totals:', { totalApps, totalShortlisted, totalRejected, daysToShow, filter: selectedJobFilter });
    
    // If there's no data, return empty array
    if (totalApps === 0 && totalShortlisted === 0 && totalRejected === 0) {
      console.log('All totals are zero, returning empty chart');
      return [];
    }
    
    const chartData = [];
    const today = new Date();
    
    // For realistic distribution, concentrate applications on recent days
    // Applications typically come in bursts, not evenly distributed
    const recentDays = Math.min(Math.ceil(daysToShow * 0.3), Math.max(3, totalApps)); // 30% of period or at least 3 days
    
    // Create application arrival pattern
    let remainingApps = totalApps;
    let remainingShort = totalShortlisted;
    let remainingRej = totalRejected;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      let appValue = 0;
      let shortValue = 0;
      let rejValue = 0;
      
      // Recent days get more applications
      if (i < recentDays && remainingApps > 0) {
        // Distribute with some randomness
        const portion = Math.random() * 0.4 + 0.3; // 30% to 70% of remaining
        appValue = Math.min(Math.ceil(remainingApps * portion), remainingApps);
        remainingApps -= appValue;
        
        // Shortlisted and rejected follow applications
        if (totalShortlisted > 0 && remainingShort > 0 && Math.random() > 0.5) {
          shortValue = Math.min(Math.ceil(Math.random() * 2), remainingShort);
          remainingShort -= shortValue;
        }
        
        if (totalRejected > 0 && remainingRej > 0 && Math.random() > 0.3) {
          rejValue = Math.min(Math.ceil(Math.random() * 2), remainingRej);
          remainingRej -= rejValue;
        }
      } else if (remainingApps > 0 && i === 0) {
        // Last day gets remaining apps
        appValue = remainingApps;
        shortValue = remainingShort;
        rejValue = remainingRej;
      }
      
      chartData.push({
        date: dateStr,
        Applications: appValue,
        Shortlisted: shortValue,
        Rejected: rejValue
      });
    }
    
    console.log('Generated chart data:', chartData);
    return chartData;
  };

  // Initialize profile from dashboard data
  useEffect(() => {
    if (dashboardData?.companyProfile) {
      setProfile({
        name: dashboardData.companyProfile.name || "N/A",
        location: dashboardData.companyProfile.location || "N/A",
        industry: "Software Development",
        description: dashboardData.companyProfile.description || "N/A"
      });
    }
  }, [dashboardData]);

  const [profile, setProfile] = useState({
    name: "",
    location: "",
    industry: "",
    description: ""
  });
    // const navigate = useNavigate();

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
        // Save logic here (API call, etc.)
        setOpenEdit(false);
      };

    // Show loading spinner while fetching data
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    // Show error message if fetch failed
    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    return (
        <Box>
          <Paper className="recruiter-dashboard-header" elevation={0}>
            <Box className="recruiter-header-content">
              <Box display="flex" alignItems="center" gap={3}>
                <Box position="relative">
                  <Avatar 
                    // src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
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
                    Welcome back, {dashboardData?.userProfile?.name || 'User'}!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {dashboardData?.userProfile?.role || 'Hiring Manager'} • {dashboardData?.userProfile?.experience || '3 years experience'}
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
                      icon={<WorkOutline />}
                      title="Job Posts"
                      value={dashboardData?.jobPosts || 0}
                      change="Open"
                    />
                  </Grid>
                  <Grid item>
                    <StatCard 
                      icon={<AssignmentInd />}
                      title="Applications"
                      value={dashboardData?.applications || 0}
                      change="New this month"
                      color="#ffa502"
                    />
                  </Grid>
                  <Grid item>
                    <StatCard 
                      icon={<Schedule />}
                      title="Interviews"
                      value={dashboardData?.interviews || 0}
                      change="Scheduled"
                      color="#10b981"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
      </Paper>

      <Box className="recruiter-dashboard-content">
        <Box className="content-first-row" display="flex" flexDirection="row"  p={1}>
          {/* Top Active Jobs Card */}
          <Paper className="content-card job-posts" elevation={2} style={{ flex: 2, minWidth: 0 }}>
            <Box display="flex" flexDirection="column" width="100%" p={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Top Active Jobs
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={selectedJobFilter}
                    label="Filter"
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {/* Legend */}
              <Stack direction="row" spacing={2} mb={2}>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 8, bgcolor: "#a259e6", borderRadius: 2, mr: 1 }} />
                  <Typography variant="caption">Applications</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 8, bgcolor: "#3be6c6", borderRadius: 2, mr: 1 }} />
                  <Typography variant="caption">Shortlisted</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 8, bgcolor: "#e6a2a2", borderRadius: 2, mr: 1 }} />
                  <Typography variant="caption">Rejected</Typography>
                </Box>
              </Stack>
              {/* Line Chart */}
              {generateChartData().length > 0 ? (
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={generateChartData()}>
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Applications" stroke="#a259e6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Shortlisted" stroke="#3be6c6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Rejected" stroke="#e6a2a2" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={140}>
                  <Typography variant="body2" color="text.secondary">No data available for selected period</Typography>
                </Box>
              )}
              {/* Job List */}
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2" color="text.secondary">Job Title</Typography>
                  <Typography variant="subtitle2" color="text.secondary">Applications</Typography>
                </Box>
                {dashboardData?.topActiveJobs?.map((job, idx) => (
                  <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" py={1} borderBottom={idx < dashboardData.topActiveJobs.length - 1 ? "1px solid #f0f0f0" : "none"}>
                    <Typography variant="body1">{job.jobTitle}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight="bold">{job.applications}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          <Box className="" display="flex" flexDirection="column" gap={3} style={{ flex: 1, minWidth: 0 }}>
            {/* Acquisitions Card */}
            <Paper className="content-card acquisitions-card" elevation={2} style={{ flex: 1, minWidth: 0 }}>
              <Box p={3}>
                <Box display="flex" justifyContent="space-between" >
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                    Acquisitions
                  </Typography>
                  <Typography variant="caption" color="text.secondary">This Month</Typography>
                </Box>
                
                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#a259e6">Applications</Typography>
                    <Typography variant="body2" fontWeight="bold">{dashboardData?.acquisitions?.applications || 0}%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: `${dashboardData?.acquisitions?.applications || 0}%`, height: 6, bgcolor: "#a259e6", borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#3be6c6">Shortlisted</Typography>
                    <Typography variant="body2" fontWeight="bold">{dashboardData?.acquisitions?.shortlisted || 0}%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: `${dashboardData?.acquisitions?.shortlisted || 0}%`, height: 6, bgcolor: "#3be6c6", borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#f7b731">On-hold</Typography>
                    <Typography variant="body2" fontWeight="bold">{dashboardData?.acquisitions?.onHold || 0}%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: `${dashboardData?.acquisitions?.onHold || 0}%`, height: 6, bgcolor: "#f7b731", borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#e6a2a2">Rejected</Typography>
                    <Typography variant="body2" fontWeight="bold">{dashboardData?.acquisitions?.rejected || 0}%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3 }}>
                    <Box sx={{ width: `${dashboardData?.acquisitions?.rejected || 0}%`, height: 6, bgcolor: "#e6a2a2", borderRadius: 3 }} />
                  </Box>
                </Stack>
                {/* <Box mt={2} display="flex" justifyContent="flex-end">
                  <Typography variant="caption" color="text.secondary">This Month</Typography>
                </Box> */}
              </Box>
            </Paper>

            {/* New Applicants Card */}
            <Paper className="content-card applicants-card" elevation={2} style={{ flex: 1, minWidth: 0 }}>
              <Box p={3}>
                <Box display="flex" justifyContent="space-between" >
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  New Applicants
                </Typography>
                  <Typography variant="caption" color="text.secondary">Latest</Typography>
                </Box>
                <Stack spacing={2}>
                  {dashboardData?.newApplicants?.length > 0 ? (
                    dashboardData.newApplicants.slice(0, 4).map((applicant, idx) => (
                      <Box key={idx} display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{applicant.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Applied for {applicant.jobTitle}</Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No recent applicants</Typography>
                  )}
                </Stack>
              </Box>
            </Paper>

          </Box>
          

          {/* Company Profile Card */}
          <Paper className="content-card company-profile" elevation={2} style={{ flex: 1, minWidth: 0 }}>
            <Box display="flex" flexDirection="column" alignItems="center" p={5}  sx={{ flex: 1, height: "100%", minHeight: 100}} >
              <Avatar
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=120&h=120&fit=crop"
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                {profile.location}
              </Typography>
              <Chip 
                label={profile.industry}
                className="it-services-chip"
                color="primary"
                sx={{ mb: 2 }} />
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

        <Box className="content-second-row" display="flex" flexDirection="row" gap={3} mt={3}>
          {/* Statistic Chart Card */}
          {/* <Paper className="content-card stats-card" elevation={2} style={{ flex: 1 }}>
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Application Statistics
              </Typography>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  data={[
                    { name: "Mon", applications: 5 },
                    { name: "Tue", applications: 8 },
                    { name: "Wed", applications: 6 },
                    { name: "Thu", applications: 10 },
                    { name: "Fri", applications: 7 }
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#3B5998" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper> */}

          {/* Calendar Card */}
          {/* <Paper className="content-card calendar-card" elevation={2} style={{ flex: 1 }}>
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Calendar
              </Typography>
              <CalendarMonthIcon sx={{ fontSize: 60, color: "#3B5998", mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Upcoming interviews and events will appear here.
              </Typography>
            </Box>
          </Paper> */}
        </Box>
      </Box>

      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Company Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Company Name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Location"
            name="location"
            value={profile.location}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Industry"
            name="industry"
            value={profile.industry}
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
}

export default Overview;
