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
  Stack,
  Button,
  Zoom,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
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
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState('All Jobs');

  const jobTitles = ["All Jobs", "Full Stack Developer", "iOS Developer", "Product Designer", "Design Lead"];
  const chartDataByJob = {
    "All Jobs": [
      { date: "17.07", Applications: 20, Shortlisted: 10, Rejected: 2 },
      { date: "18.07", Applications: 35, Shortlisted: 15, Rejected: 5 },
      { date: "19.07", Applications: 30, Shortlisted: 12, Rejected: 4 },
      { date: "20.07", Applications: 50, Shortlisted: 25, Rejected: 8 },
      { date: "21.07", Applications: 40, Shortlisted: 20, Rejected: 6 },
      { date: "22.07", Applications: 40, Shortlisted: 15, Rejected: 10 },
      { date: "23.07", Applications: 25, Shortlisted: 10, Rejected: 10 },
    ],
    "Full Stack Developer": [
      { date: "17.07", Applications: 8, Shortlisted: 4, Rejected: 1 },
      { date: "18.07", Applications: 12, Shortlisted: 6, Rejected: 2 },
      { date: "19.07", Applications: 10, Shortlisted: 5, Rejected: 1 },
      { date: "20.07", Applications: 18, Shortlisted: 9, Rejected: 3 },
      { date: "21.07", Applications: 15, Shortlisted: 7, Rejected: 2 },
      { date: "22.07", Applications: 14, Shortlisted: 6, Rejected: 4 },
      { date: "23.07", Applications: 9, Shortlisted: 4, Rejected: 3 },
    ],
    "iOS Developer": [
      { date: "17.07", Applications: 5, Shortlisted: 2, Rejected: 0 },
      { date: "18.07", Applications: 8, Shortlisted: 4, Rejected: 1 },
      { date: "19.07", Applications: 7, Shortlisted: 3, Rejected: 1 },
      { date: "20.07", Applications: 12, Shortlisted: 6, Rejected: 2 },
      { date: "21.07", Applications: 10, Shortlisted: 5, Rejected: 1 },
      { date: "22.07", Applications: 10, Shortlisted: 4, Rejected: 3 },
      { date: "23.07", Applications: 6, Shortlisted: 2, Rejected: 2 },
    ],
    // Add similar mock data for "Product Designer" and "Design Lead" if needed
    "Product Designer": [/* ... data ... */],
    "Design Lead": [/* ... data ... */],
  };

  const [profile, setProfile] = useState({
    name: "CreateTech Solutions",
    location: "Colombo 10, Sri Lanka",
    industry: "Software Development",
    description: "Leading provider of innovative tech solutions for businesses worldwide. 500+ employees, 10+ years in the industry."
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
                    Welcome back, Raveesha!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Hiring Manager • 3 years experience
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
                      value="28"
                      change="Open"
                    />
                  </Grid>
                  <Grid item>
                    <StatCard 
                      icon={<AssignmentInd />}
                      title="Applications"
                      value="102"
                      change="New this month"
                      color="#ffa502"
                    />
                  </Grid>
                  <Grid item>
                    <StatCard 
                      icon={<Schedule />}
                      title="Interviews"
                      value="14"
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
                <Button size="small" sx={{ color: "#3B5998", textTransform: "none" }}>
                  Last 7 days
                </Button>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Filter by Job</InputLabel>
                    <Select
                        value={selectedJobFilter}
                        label="Filter by Job"
                        onChange={(e) => setSelectedJobFilter(e.target.value)}
                      >
                      {jobTitles.map((title) => (
                        <MenuItem key={title} value={title}>
                          {title}
                        </MenuItem>
                      ))}
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
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={chartDataByJob[selectedJobFilter]}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Applications" stroke="#a259e6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Shortlisted" stroke="#3be6c6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Rejected" stroke="#e6a2a2" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              {/* Job List */}
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2" color="text.secondary">Job Title</Typography>
                  <Typography variant="subtitle2" color="text.secondary">Applications</Typography>
                </Box>
                {[
                  { title: "Full Stack Developer", applications: 30, shortlisted: true },
                  { title: "iOS Developer", applications: 27, shortlisted: true },
                  { title: "Product Designer", applications: 25, shortlisted: false },
                  { title: "Design Lead", applications: 20, shortlisted: false },
                ].map((job, idx) => (
                  <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" py={1} borderBottom={idx < 3 ? "1px solid #f0f0f0" : "none"}>
                    <Typography variant="body1">{job.title}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight="bold">{job.applications}</Typography>
                      {/* {job.shortlisted && (
                        <Chip label="L" size="small" sx={{ bgcolor: "#e6f7fa", color: "#3B5998", fontWeight: 700, fontSize: 12 }} />
                      )} */}
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
                    <Typography variant="body2" fontWeight="bold">64%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: "64%", height: 6, bgcolor: "#a259e6", borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#3be6c6">Shortlisted</Typography>
                    <Typography variant="body2" fontWeight="bold">18%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: "18%", height: 6, bgcolor: "#3be6c6", borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#f7b731">On-hold</Typography>
                    <Typography variant="body2" fontWeight="bold">10%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3, mb: 1 }}>
                    <Box sx={{ width: "10%", height: 6, bgcolor: "#f7b731", borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="#e6a2a2">Rejected</Typography>
                    <Typography variant="body2" fontWeight="bold">8%</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: 6, bgcolor: "#f0f0f0", borderRadius: 3 }}>
                    <Box sx={{ width: "8%", height: 6, bgcolor: "#e6a2a2", borderRadius: 3 }} />
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
                  <Typography variant="caption" color="text.secondary">Today</Typography>
                </Box>
                <Stack spacing={2}>
                  {[
                    {
                      name: "Kasun Herath",
                      job: "Applied for iOS Developer",
                      avatar: ""
                    },
                    {
                      name: "Shalitha Fonseka",
                      job: "Applied for Full Stack Developer",
                      avatar: ""
                    },
                    {
                      name: "Deesha Perera",
                      job: "Applied for Product Designer",
                      avatar: ""
                    },
                    {
                      name: "Nuwani Fernando",
                      job: "Applied for Design Lead",
                      avatar: ""
                    },
                  ].map((applicant, idx) => (
                    <Box key={idx} display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{applicant.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{applicant.job}</Typography>
                      </Box>
                    </Box>
                  ))}
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
