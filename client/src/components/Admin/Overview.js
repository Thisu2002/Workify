import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Zoom
} from "@mui/material";
import { Group, Person, BarChart, AssignmentInd, Schedule, Feedback, WorkOutline,FiberManualRecord as OnlineIcon } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { alpha } from '@mui/material/styles'; // For background color
import "../../styles/Admin.css";

// Sample usage data for chart
const usageData = [
  { name: 'Jan', users: 800 },
  { name: 'Feb', users: 900 },
  { name: 'Mar', users: 950 },
  { name: 'Apr', users: 1000 },
  { name: 'May', users: 1100 },
  { name: 'Jun', users: 1200 },
];

// Total users stat
const totalUsers = 1200;

// Sample users with lastActive field
const users = [
  { name: "James Miller", role: "Recruiter", avatar: "https://randomuser.me/api/portraits/men/75.jpg", lastActive: "2025-07-14T09:30:00" },
  { name: "Priya Sharma", role: "Mentor", avatar: "https://randomuser.me/api/portraits/women/65.jpg", lastActive: "2025-07-14T08:45:00" },
  { name: "Alex Lee", role: "Lead Panelist", avatar: "https://randomuser.me/api/portraits/men/32.jpg", lastActive: "2025-07-13T17:20:00" }
];

// Sort and get the 10 most recently active users
const recentActiveUsers = [...users]
  .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
  .slice(0, 10);


const AdminStatCard = ({ icon, title, value, change, color = '#96BEC5', loading = false }) => (
  <Zoom in={!loading} style={{ transitionDelay: '200ms' }}>
    <Card className="admin-stat-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" className="stat-title">
              {title}
            </Typography>
            <Typography variant="h3" className="stat-value" sx={{ color }}>
              {value}
            </Typography>
            {change && (
              <Typography variant="caption" className="stat-change">
                {change}
              </Typography>
            )}
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
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Box className="admin-dashboard-container">
      {/* Navigation Bar */}
      {/* <Paper className="admin-navigation" elevation={0}>
        <Box className="admin-nav-container">
          {adminTabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span style={{ marginRight: 8 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </Box>
      </Paper> */}

      {/* Header */}
      <Paper className="admin-dashboard-header" elevation={0}>
        <Box className="admin-header-content" >
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
            <Box  sx={{ minHeight: '200px' }}>
              <Typography variant="h4" className="admin-welcome-text"  sx={{ mt: 6 }}>
                Welcome back,<br />Admin!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Hiring Manager • 3 years experience
              </Typography>
            </Box>
            {/* Admin Stat Card */}
            <AdminStatCard
              icon={<Group sx={{ fontSize: 40, color: "#96BEC5" }} />}
              title="Total Users"
              value={totalUsers}
              change="+45 this month"
              color="#96BEC5"
            />
          </Box>
        </Box>
      </Paper>

      {/* Usage Chart and Total Users */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 , mt: 5}}>
  <Paper className="admin-usage-chart" sx={{ flex: 1, p: 2, height: 250, maxWidth: 800 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Platform Usage</Typography>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={usageData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="#96BEC5" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
</Box>



      {/* Recent Active Users Section */}
      <Paper className="admin-active-users" sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Active Users</Typography>
        <List className="admin-user-list">
          {recentActiveUsers.map((user, idx) => (
            <React.Fragment key={idx}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={`${user.role} • Active ${new Date(user.lastActive).toLocaleString()}`}
                />
                <Chip label={user.role} size="small" />
              </ListItem>
              {idx < recentActiveUsers.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Overview;