import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import { Group, Person, FiberManualRecord as OnlineIcon } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SupervisorAccount as MentorIcon, Work as RecruiterIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
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

// ✅ Stat Card Component
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
  // ✅ These must be INSIDE your component
  const [activeTab, setActiveTab] = useState('overview');
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsersToday, setActiveUsersToday] = useState(0);
  const [recentActiveUsers, setRecentActiveUsers] = useState([]);
  const navigate = useNavigate();
  const [usageData, setUsageData] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [adminLastLogin, setAdminLastLogin] = useState(null);


    useEffect(() => {
    const fetchRecentActiveUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/recent-active-users');
        setRecentActiveUsers(res.data);
      } catch (err) {
        console.error('Error fetching recent active users:', err);
      }
    };
    fetchRecentActiveUsers();
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/user-count');
        setTotalUsers(res.data.totalUsers);
      } catch (err) {
        console.error('Error fetching user count:', err);
      }
    };
    fetchUserCount();
  }, []);

  useEffect(() => {
  const fetchActiveUsersToday = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/active-users-today');
      setActiveUsersToday(res.data.activeUsersToday);
    } catch (err) {
      console.error('Error fetching active users today:', err);
    }
  };
  fetchActiveUsersToday();
}, []);

  useEffect(() => {
  const fetchUsageData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/platform-usage');
      setUsageData(res.data);
    } catch (err) {
      console.error('Error fetching platform usage:', err);
    }
  };
  fetchUsageData();
}, []);

  useEffect(() => {
  const fetchAdminInfo = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/admin-user');
      setAdminName(`${res.data.firstName} ${res.data.lastName}`);
      setAdminLastLogin(res.data.lastLogin ? new Date(res.data.lastLogin) : null);
    } catch (err) {
      console.error('Error fetching admin info:', err);
    }
  };
  fetchAdminInfo();
}, []);



  // const recentActiveUsers = [...users]
  //   .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
  //   .slice(0, 10);

  return (
    <Box className="admin-dashboard-container">

      {/* Header */}
      <Paper className="admin-dashboard-header" elevation={0}>
        <Box className="admin-header-content">
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
            <Box sx={{ minHeight: '200px' }}>
              <Typography variant="h4" className="admin-welcome-text" sx={{ mt: 6 }}>
                Welcome back,<br />{adminName || 'Admin'}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
  {adminLastLogin 
    ? `Last login: ${adminLastLogin.toLocaleString()}`
    : 'Welcome to the platform'}
</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Technical Manager • Workify Platform
              </Typography>
            </Box>
            {/* ✅ Dynamic User Count */}
            <AdminStatCard
              icon={<Group sx={{ fontSize: 40, color: "#96BEC5" }} />}
              title="Total Users"
              value={totalUsers}
              change="+45 this month"
              color="#96BEC5"
            />
            <AdminStatCard
              icon={<Person sx={{ fontSize: 40, color: "#f59e0b" }} />}
              title="Active Users Today"
              value={activeUsersToday}
              change="+5% since yesterday"
              color="#f59e0b"
            />

          </Box>
        </Box>
      </Paper>

      {/* Usage Chart */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, mt: 5 }}>
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

      {/* Active Users */}
      <Paper className="admin-active-users" sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Active Users</Typography>
        <List className="admin-user-list">
  {recentActiveUsers.map((user, idx) => (
    <React.Fragment key={user.id}>
      <ListItem
        button
          onClick={() => navigate('/admin/users', { state: { selectedUserId: user.id } })}
      >
        <ListItemAvatar>
          {/* Use role-based icon */}
          <Avatar>
            {user.role.toLowerCase() === 'mentor' && <MentorIcon />}
            {user.role.toLowerCase() === 'recruiter' && <RecruiterIcon />}
            {user.role.toLowerCase() !== 'mentor' && user.role.toLowerCase() !== 'recruiter' && <Person />}
          </Avatar>
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
