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
    const [profile, setProfile] = useState({
      name: "Jane Silva",
      position: "Senior Business Manager",
      industry: "IT and Business Services, workify",
      description: "10+ years of experience in strategic business operations, growth planning, and client success. Based in USA."
    });
    // const navigate = useNavigate();

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
            <Paper className="manager-dashboard-header" elevation={0}>
        <Box className="manager-header-content">
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
              <Typography variant="h4" className="manager-welcome-text">
                Welcome back, Manager!
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
                  title="Mentor Verification Requests"
                  value="14"
                  change="New this month"
                  color="#ffa502"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<Domain />}
                  title="Company Registration Requests"
                  value="20"
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
          <Paper className="content-card manager-profile" elevation={2}>
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                <Avatar
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop"
                    sx={{ width: 80, height: 80, mb: 2 }}
                />
                <Typography variant="h6" fontWeight="bold">
                Jane Silva
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                    Business Manager, workify
                </Typography>
                <Chip 
                    label="Manager Level: Senior" 
                    className="it-services-chip"
                    color="primary" 
                    sx={{ mb: 2 }}
                />
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                    10+ years of experience in strategic business operations, growth planning, and client success. Based in Bangalore.
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


        <Paper className="content-card subscription" elevation={2}>
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
                        onClick={() => setActiveTab("subscriptions")}
                    >
                    View All
                </Button>
            </Box>

            <Box className="subscription-list">
                {[
                    {
                        label: "Total Subscriptions This Month",
                        value: 56,
                        color: "#10b981"
                    },
                    {
                        label: "Companies Pending Payment",
                        value: 12,
                        color: "#ef4444"
                    },
                    {
                        label: "Subscriptions Renewed",
                        value: 33,
                        color: "#3B5998"
                    }
                ].map((item, idx) => (
                    <Box
                        key={idx}
                        className="subscription-summary"
                        mb={2}
                        p={2}
                        sx={{ background: "#f4f7fa", borderLeft: `6px solid ${item.color}`, borderRadius: 2 }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold">{item.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {item.value} companies
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    </Paper>
        </Box>

        <Box className="content-second-row" display="flex" flexDirection="row" gap={3} mt={3}>
          {/* Statistic Chart Card */}
          <Paper className="content-card stats-card" elevation={2} style={{ flex: 1 }}>
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Application Statistics
              </Typography>
              {/* Example Bar Chart using recharts */}
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
            value={profile.name}
            onChange={handleProfileChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Position"
            name="position"
            value={profile.position}
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
