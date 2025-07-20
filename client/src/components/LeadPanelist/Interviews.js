import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Avatar, 
  Chip, Stack, Button, IconButton, TextField, InputAdornment,
  Tabs, Tab, Divider, Menu, MenuItem
} from '@mui/material';
import {
  Schedule, GroupWork, Search, FilterList, MoreVert,
  VideoCall, Message, Description, CheckCircle, AccessTime,
  Pending, CalendarToday
} from '@mui/icons-material';

const Interviews = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);

  const interviews = [
    {
      id: 1,
      candidate: {
        name: "Kasun Perera",
        position: "Senior Developer",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        experience: "8 years"
      },
      status: "in_progress",
      time: "10:00 AM - 11:00 AM",
      date: "2024-01-18",
      panel: "Technical Panel A",
      type: "Technical Round",
      meetingLink: "meet.google.com/abc-def-ghi",
      documents: ["Resume", "Portfolio"],
      interviewers: [
        { name: "Dr. Perera", avatar: "https://randomuser.me/api/portraits/men/42.jpg" },
        { name: "Mr. Silva", avatar: "https://randomuser.me/api/portraits/men/43.jpg" }
      ]
    },
    {
      id: 2,
      candidate: {
        name: "Malini Silva",
        position: "UX Designer",
        avatar: "https://randomuser.me/api/portraits/women/41.jpg",
        experience: "5 years"
      },
      status: "upcoming",
      time: "11:30 AM - 12:30 PM",
      date: "2024-01-18",
      panel: "Design Panel",
      type: "Portfolio Review",
      meetingLink: "meet.google.com/xyz-pqr-stu",
      documents: ["Portfolio", "Design Case Studies"],
      interviewers: [
        { name: "Ms. Fernando", avatar: "https://randomuser.me/api/portraits/women/42.jpg" },
        { name: "Mr. Gunawardena", avatar: "https://randomuser.me/api/portraits/men/44.jpg" }
      ]
    },
    {
      id: 3,
      candidate: {
        name: "Ashan Fernando",
        position: "DevOps Engineer",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        experience: "6 years"
      },
      status: "upcoming",
      time: "2:00 PM - 3:00 PM",
      date: "2024-01-18",
      panel: "Technical Panel B",
      type: "System Design",
      meetingLink: "meet.google.com/lmn-opq-rst",
      documents: ["Resume", "Projects"],
      interviewers: [
        { name: "Mr. Ranasinghe", avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
        { name: "Ms. Cooray", avatar: "https://randomuser.me/api/portraits/women/43.jpg" }
      ]
    }
  ];

  const getStatusChipProps = (status) => {
    const statusConfig = {
      in_progress: { label: 'In Progress', color: '#3B5998', bg: 'rgba(59, 89, 152, 0.1)' },
      upcoming: { label: 'Upcoming', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      completed: { label: 'Completed', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' }
    };
    return statusConfig[status];
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header & Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600} color="#0F2445">
          Scheduled Interviews
        </Typography>
        <Button
          variant="contained"
          startIcon={<CalendarToday />}
          sx={{ backgroundColor: '#3B5998' }}
        >
          View Calendar
        </Button>
      </Box>

      {/* Search & Filter */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search interviews..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ flex: 1 }}
        />
        <Button
          startIcon={<FilterList />}
          onClick={(e) => setFilterAnchor(e.currentTarget)}
          variant="outlined"
        >
          Filter
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ mb: 3 }}>
        <Tab label="All Interviews" />
        <Tab label="Today" />
        <Tab label="Upcoming" />
        <Tab label="Completed" />
      </Tabs>

      {/* Interview Cards */}
      <Grid container spacing={3}>
        {interviews.map(interview => (
          <Grid item xs={12} md={6} key={interview.id}>
            <Card 
              sx={{ 
                position: 'relative',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(231, 234, 245, 0.7)',
                '&:hover': { 
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" gap={2}>
                    <Avatar 
                      src={interview.candidate.avatar} 
                      sx={{ width: 56, height: 56, border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ color: '#0F2445', fontWeight: 600 }}>
                        {interview.candidate.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {interview.candidate.position} • {interview.candidate.experience}
                      </Typography>
                      <Chip
                        label={getStatusChipProps(interview.status).label}
                        size="small"
                        sx={{
                          backgroundColor: getStatusChipProps(interview.status).bg,
                          color: getStatusChipProps(interview.status).color,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Interview Details */}
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule fontSize="small" sx={{ color: '#64748b' }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.time} • {interview.date}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupWork fontSize="small" sx={{ color: '#64748b' }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.panel} • {interview.type}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Panel Members */}
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Interviewers:
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {interview.interviewers.map((interviewer, idx) => (
                      <Chip
                        key={idx}
                        avatar={<Avatar src={interviewer.avatar}>{interviewer.name[0]}</Avatar>}
                        label={interviewer.name}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Actions */}
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button
                    startIcon={<Description />}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#3B5998', color: '#3B5998' }}
                  >
                    Documents
                  </Button>
                  <Button
                    startIcon={<VideoCall />}
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: '#3B5998' }}
                  >
                    Join Meeting
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <MenuItem>All Types</MenuItem>
        <MenuItem>Technical Rounds</MenuItem>
        <MenuItem>HR Rounds</MenuItem>
        <MenuItem>System Design</MenuItem>
      </Menu>
    </Box>
  );
};

export default Interviews;
