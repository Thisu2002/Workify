import React, { useState } from 'react';
import {
  Box, Typography, Chip, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Avatar, Stack, TextField, InputAdornment, Paper,
  IconButton, Menu, MenuItem, Tab, Tabs, Select, MenuItem as MuiMenuItem
} from '@mui/material';
import {
  PersonAdd, Schedule, Message, Search, FilterList,
  MoreVert, CheckCircle, PendingActions, Block,
  Group, Assessment, Timeline
} from '@mui/icons-material';

const PanelManagement = () => {
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Panel modal state
  const [openCreate, setOpenCreate] = useState(false);
  const [panelName, setPanelName] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [status, setStatus] = useState("active");
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberAvatar, setMemberAvatar] = useState("");

  const metrics = {
    totalPanels: 8,
    activePanels: 5,
    totalPanelists: 24,
    averageInterviewsPerDay: 12,
    completionRate: 95,
    upcomingSessions: 15
  };

  const [panelAssignments] = useState([
    {
      id: 1,
      name: "Technical Interview Panel A",
      members: [
        { name: "Dr. Perera", role: "Senior Tech Lead", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
        { name: "Mr. Silva", role: "System Architect", avatar: "https://randomuser.me/api/portraits/men/42.jpg" },
        { name: "Ms. Dias", role: "Backend Specialist", avatar: "https://randomuser.me/api/portraits/women/41.jpg" }
      ],
      activeInterviews: 3,
      completedInterviews: 45,
      averageRating: 4.8,
      specialization: ["Backend", "System Design"],
      status: "active",
      nextSession: "2024-01-20 10:00"
    },
    {
      id: 2,
      name: "Design Assessment Panel",
      members: [
        { name: "Ms. Fernando", role: "UX Director", avatar: "https://randomuser.me/api/portraits/women/42.jpg" },
        { name: "Mr. Gunawardena", role: "Design Lead", avatar: "https://randomuser.me/api/portraits/men/43.jpg" }
      ],
      activeInterviews: 2,
      completedInterviews: 38,
      averageRating: 4.6,
      specialization: ["UI/UX", "Product Design"],
      status: "active",
      nextSession: "2024-01-21 14:00"
    },
    {
      id: 3,
      name: "Frontend Development Panel",
      members: [
        { name: "Ms. Peris", role: "Frontend Lead", avatar: "https://randomuser.me/api/portraits/women/43.jpg" },
        { name: "Mr. Mendis", role: "UI Engineer", avatar: "https://randomuser.me/api/portraits/men/44.jpg" }
      ],
      activeInterviews: 0,
      completedInterviews: 52,
      averageRating: 4.7,
      specialization: ["React", "Angular", "Frontend Architecture"],
      status: "inactive",
      nextSession: "2024-01-22 11:00"
    },
    
    
  ]);

  // Stats cards component
  const StatsCard = ({ icon, title, value, change }) => (
    <Paper elevation={0} sx={{
      width: 220,
      height: 150,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      boxSizing: 'border-box',
      p: 0
    }}>
      <Stack spacing={1} alignItems="center" justifyContent="center" width="100%">
        <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>{icon}</Avatar>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        {change && (
          <Typography variant="caption" color="success.main">
            {change}
          </Typography>
        )}
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          sx={{ backgroundColor: '#3B5998' }}
          onClick={() => setOpenCreate(true)}
        >
          Create New Panel
        </Button>
      </Box>

      {/* Create Panel Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Panel</DialogTitle>
        <DialogContent>
          <TextField
            label="Panel Name"
            value={panelName}
            onChange={e => setPanelName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Specializations (comma separated)"
            value={specializations}
            onChange={e => setSpecializations(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box mt={2} mb={2}>
            <Typography variant="subtitle2" mb={1}>Status</Typography>
            <Select
              value={status}
              onChange={e => setStatus(e.target.value)}
              fullWidth
            >
              <MuiMenuItem value="active">Active</MuiMenuItem>
              <MuiMenuItem value="inactive">Inactive</MuiMenuItem>
            </Select>
          </Box>
          <Box mt={2} mb={1}>
            <Typography variant="subtitle2">Add Members</Typography>
            <Stack direction="row" spacing={1} mb={1}>
              <TextField
                label="Name"
                value={memberName}
                onChange={e => setMemberName(e.target.value)}
                size="small"
              />
              <TextField
                label="Role"
                value={memberRole}
                onChange={e => setMemberRole(e.target.value)}
                size="small"
              />
              <TextField
                label="Avatar URL"
                value={memberAvatar}
                onChange={e => setMemberAvatar(e.target.value)}
                size="small"
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (memberName && memberRole) {
                    setMembers([...members, { name: memberName, role: memberRole, avatar: memberAvatar }]);
                    setMemberName("");
                    setMemberRole("");
                    setMemberAvatar("");
                  }
                }}
                sx={{ minWidth: 100 }}
              >
                Add Member
              </Button>
            </Stack>
            <Stack spacing={1}>
              {members.map((m, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={2}>
                  <Avatar src={m.avatar} sx={{ width: 32, height: 32 }} />
                  <Typography>{m.name} ({m.role})</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} color="secondary">Cancel</Button>
          <Button onClick={() => {
            setOpenCreate(false);
            setPanelName("");
            setSpecializations("");
            setStatus("active");
            setMembers([]);
          }} variant="contained" sx={{ backgroundColor: '#3B5998' }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Stats Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <StatsCard
            icon={<Group />}
            title="Total Panels"
            value={metrics.totalPanels}
            change="+2 this month"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            icon={<Assessment />}
            title="Active Panels"
            value={metrics.activePanels}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            icon={<Timeline />}
            title="Completion Rate"
            value={`${metrics.completionRate}%`}
            change="↑ 5% from last month"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            icon={<Schedule />}
            title="Upcoming Sessions"
            value={metrics.upcomingSessions}
          />
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search panels..."
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
      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Panels" />
        <Tab label="Active" />
        <Tab label="Inactive" />
      </Tabs>

      {/* Panels Grid */}
      <Grid container spacing={3}>
        {panelAssignments.map(panel => (
          <Grid item xs={12} md={6} key={panel.id}>
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
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#0F2445',
                        mb: 1
                      }}
                    >
                      {panel.name}
                    </Typography>
                    <Chip 
                      label={panel.status.toUpperCase()} 
                      size="small"
                      sx={{ 
                        backgroundColor: panel.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: panel.status === 'active' ? '#10b981' : '#6b7280',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                  </Box>
                  <IconButton 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(59, 89, 152, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(59, 89, 152, 0.2)' }
                    }}
                  >
                    <MoreVert fontSize="small" sx={{ color: '#3B5998' }} />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      mb: 1,
                      fontWeight: 500 
                    }}
                  >
                    Specializations:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {panel.specialization.map((spec, idx) => (
                      <Chip 
                        key={idx} 
                        label={spec} 
                        size="small" 
                        sx={{
                          backgroundColor: 'rgba(59, 89, 152, 0.08)',
                          color: '#3B5998',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          '&:hover': { backgroundColor: 'rgba(59, 89, 152, 0.15)' }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      mb: 1,
                      fontWeight: 500 
                    }}
                  >
                    Panel Members:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {panel.members.map((member, idx) => (
                      <Chip
                        key={idx}
                        avatar={
                          <Avatar 
                            src={member.avatar}
                            sx={{ 
                              border: '2px solid #fff',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                          >
                            {member.name[0]}
                          </Avatar>
                        }
                        label={member.name}
                        sx={{
                          backgroundColor: 'white',
                          border: '1px solid rgba(59, 89, 152, 0.2)',
                          '& .MuiChip-label': {
                            color: '#0F2445',
                            fontWeight: 500
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(59, 89, 152, 0.05)'
                          }
                        }}
                        title={member.role}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box 
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    borderTop: '1px solid rgba(231, 234, 245, 0.7)'
                  }}
                >
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#0F2445',
                        fontWeight: 600,
                        mb: 0.5
                      }}
                    >
                      Active Interviews: {panel.activeInterviews}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Schedule fontSize="small" />
                      {new Date(panel.nextSession).toLocaleString()}
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#3B5998',
                      color: '#3B5998',
                      '&:hover': {
                        borderColor: '#0F2445',
                        backgroundColor: 'rgba(59, 89, 152, 0.08)'
                      }
                    }}
                  >
                    Manage Panel
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
        <MenuItem>All Panels</MenuItem>
        <MenuItem>Technical Panels</MenuItem>
        <MenuItem>Design Panels</MenuItem>
        <MenuItem>Special Panels</MenuItem>
      </Menu>
    </Box>
  );
};

export default PanelManagement;
