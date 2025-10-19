import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  Grid,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  ListItemIcon,
  ListItem,
  ListItemText,
  Tab,
  Tabs
} from "@mui/material";
import { 
  Search,
  Star,
  ChatBubbleOutline,
  CalendarToday,
  AccessTime,
  Videocam,
  Link as LinkIcon
} from '@mui/icons-material';
import RequestForm from './RequestForm';
import axios from 'axios';

// Sample Mentor Data - In a real app, this would come from an API
const MOCK_MENTORS = [
  {
    id: '68f3c71adf8ad57f24a413c8',
    name: 'Diluni Amarasinghe',
    avatar: '',
    role: 'Senior Product Manager at Surge Global',
    bio: 'Passionate about building great products and helping aspiring PMs navigate their career path.',
    specialties: ['Resume Review', 'Product Strategy', 'Interview Prep', 'Career Growth']
  },
  {
    id: '68f3c71adf8ad57f24a413c9',
    name: 'Nudam Perera',
    avatar: '',
    role: 'Lead Software Engineer at Furtado',
    bio: 'Specializing in scalable systems and architecture. Happy to conduct mock technical interviews.',
    specialties: ['System Design', 'Technical Interviews', 'GoLang', 'React']
  },
  {
    id: '68f3c71adf8ad57f24a413c1',
    name: 'Tharushi Nethmini',
    avatar: '',
    role: 'Engineering Manager at TechCorp',
    bio: 'Focused on leadership, team building, and growing engineers from mid-level to senior roles.',
    specialties: ['Leadership', 'Salary Negotiation', 'Team Culture', 'Public Speaking']
  }
];

// Mock sessions data - will be replaced with API call
const MOCK_SESSIONS = [
  {
    id: 1,
    mentor: {
      name: 'Diluni Amarasinghe',
      avatar: '',
      role: 'Senior Product Manager at Surge Global'
    },
    session: {
      topic: 'Resume Review Session',
      date: 'Dec 15, 2024',
      time: '2:00 PM - 3:00 PM',
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      requestDate: '2024-12-10',
      message: 'I would like to get feedback on my resume for product manager roles.'
    }
  },
  {
    id: 2,
    mentor: {
      name: 'Nudam Perera',
      avatar: '',
      role: 'Lead Software Engineer at Furtado'
    },
    session: {
      topic: 'Technical Interview Prep',
      date: 'Dec 20, 2024',
      time: '10:00 AM - 11:00 AM',
      status: 'pending',
      meetingLink: '',
      requestDate: '2024-12-12',
      message: 'Need help preparing for technical interviews, especially system design.'
    }
  },
  {
    id: 3,
    mentor: {
      name: 'Tharushi Nethmini',
      avatar: '',
      role: 'Engineering Manager at TechCorp'
    },
    session: {
      topic: 'Career Growth Discussion',
      date: 'Dec 8, 2024',
      time: '4:00 PM - 5:00 PM',
      status: 'completed',
      meetingLink: '',
      requestDate: '2024-12-05',
      message: 'Want to discuss career progression and leadership opportunities.'
    }
  },
  {
    id: 4,
    mentor: {
      name: 'Diluni Amarasinghe',
      avatar: '',
      role: 'Senior Product Manager at Surge Global'
    },
    session: {
      topic: 'Interview Preparation',
      date: 'Dec 5, 2024',
      time: '3:00 PM - 4:00 PM',
      status: 'cancelled',
      meetingLink: '',
      requestDate: '2024-12-02',
      message: 'Mock interview for PM position at startup.'
    }
  }
];

const CareerAdvice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [showScheduledOnly, setShowScheduledOnly] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [sessionsTab, setSessionsTab] = useState(0); // 0: All, 1: Pending, 2: Scheduled, 3: Completed, 4: Cancelled
  const [sessions, setSessions] = useState(MOCK_SESSIONS); // Will be fetched from API

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/candidate/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch sessions when showing sessions view
  useEffect(() => {
    if (showScheduledOnly) {
      fetchSessions();
    }
  }, [showScheduledOnly]);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Replace with actual API call
        // const response = await axios.get('http://localhost:5000/api/mentoring/my-sessions', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setSessions(response.data);
        
        // For now, using mock data
        setSessions(MOCK_SESSIONS);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleRequestSession = (mentor) => {
    setSelectedMentor(mentor);
    setIsRequestFormOpen(true);
  };

  const handleCloseRequestForm = () => {
    setIsRequestFormOpen(false);
    setSelectedMentor(null);
  };

  const handleToggleShowScheduled = () => {
    setShowScheduledOnly(prev => !prev);
    if (!showScheduledOnly) {
      setSessionsTab(0); // Reset to "All" when switching to sessions view
    }
  };

  const handleSessionsTabChange = (event, newValue) => {
    setSessionsTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'scheduled': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getFilteredSessions = () => {
    switch (sessionsTab) {
      case 1: return sessions.filter(s => s.session.status === 'pending');
      case 2: return sessions.filter(s => s.session.status === 'scheduled');
      case 3: return sessions.filter(s => s.session.status === 'completed');
      case 4: return sessions.filter(s => s.session.status === 'cancelled');
      default: return sessions;
    }
  };

  const filteredMentors = MOCK_MENTORS.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderAllMentors = () => (
    <>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Get personalized advice from experienced professionals to accelerate your career.
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name, role, or specialty (e.g., 'Resume Review')"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />
      <Grid container spacing={3}>
        {filteredMentors.map(mentor => (
          <Grid item key={mentor.id} xs={12} sm={6} lg={4} sx={{ flexGrow: 1 }}>
            <Paper 
              elevation={2} 
              sx={{ p: 2.5, borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s, transform 0.2s', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={mentor.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{mentor.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{mentor.role}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ flexGrow: 1, mb: 2 }}>{mentor.bio}</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Can help with:</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {mentor.specialties.map(specialty => (
                    <Chip key={specialty} icon={<Star fontSize="small" />} label={specialty} size="small" variant="outlined" color="primary" />
                  ))}
                </Stack>
              </Box>
              <Button variant="contained" startIcon={<ChatBubbleOutline />} fullWidth sx={{ mt: 'auto' }} onClick={() => handleRequestSession(mentor)}>
                Request a Session
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {filteredMentors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" color="text.secondary">No mentors found matching your search.</Typography>
          </Box>
      )}
    </>
  );

  const renderScheduledSessions = () => {
    const filteredSessions = getFilteredSessions();
    
    return (
      <Box>
        {/* Sessions Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={sessionsTab} onChange={handleSessionsTabChange}>
            <Tab label={`All (${sessions.length})`} />
            <Tab label={`Pending (${sessions.filter(s => s.session.status === 'pending').length})`} />
            <Tab label={`Scheduled (${sessions.filter(s => s.session.status === 'scheduled').length})`} />
            <Tab label={`Completed (${sessions.filter(s => s.session.status === 'completed').length})`} />
            <Tab label={`Cancelled (${sessions.filter(s => s.session.status === 'cancelled').length})`} />
          </Tabs>
        </Box>

        {/* Sessions List */}
        {filteredSessions.length > 0 ? (
          filteredSessions.map(item => (
            <Paper key={item.id} elevation={2} sx={{ mb: 2, p: 2.5, borderRadius: 2 }}>
              <Grid container spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Grid item>
                  <Avatar src={item.mentor.avatar} sx={{ width: 50, height: 50 }}/>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">{item.session.topic}</Typography>
                  <Typography variant="body2" color="text.secondary">With {item.mentor.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Requested: {item.session.requestDate}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Chip 
                    label={item.session.status.charAt(0).toUpperCase() + item.session.status.slice(1)} 
                    color={getStatusColor(item.session.status)} 
                    size="small" 
                  />
                </Grid>
              </Grid>
              
              {item.session.message && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Your message:</strong> {item.session.message}
                  </Typography>
                </>
              )}

              {(item.session.status === 'scheduled' || item.session.status === 'completed') && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{xs: 1, sm: 3}} useFlexGap flexWrap="wrap">
                    <ListItem sx={{p:0}}>
                      <ListItemIcon sx={{minWidth: 36}}><CalendarToday fontSize="small" color="action"/></ListItemIcon>
                      <ListItemText primary={item.session.date} />
                    </ListItem>
                    <ListItem sx={{p:0}}>
                      <ListItemIcon sx={{minWidth: 36}}><AccessTime fontSize="small" color="action"/></ListItemIcon>
                      <ListItemText primary={item.session.time} />
                    </ListItem>
                  </Stack>
                </>
              )}

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {item.session.status === 'pending' && (
                  <Button variant="outlined" size="small" color="error">Cancel Request</Button>
                )}
                {item.session.status === 'scheduled' && (
                  <>
                    <Button variant="outlined" size="small">Reschedule</Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<Videocam />} 
                      href={item.session.meetingLink} 
                      target="_blank"
                      disabled={!item.session.meetingLink}
                    >
                      Join Meeting
                    </Button>
                  </>
                )}
                {item.session.status === 'completed' && (
                  <Button variant="outlined" size="small">Leave Feedback</Button>
                )}
              </Box>
            </Paper>
          ))
        ) : (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary">
              {sessionsTab === 0 ? 'You have no sessions yet.' : `You have no ${['all', 'pending', 'scheduled', 'completed', 'cancelled'][sessionsTab]} sessions.`}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Click 'All Mentors' to find and request a session with a mentor.
            </Typography>
          </Paper>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Page Header and View Toggle Button */}
      <Box sx={{ mb: 4 }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {showScheduledOnly ? 'Your Sessions' : 'Connect with Industry Mentors'}
            </Typography>
            <Button
                variant="contained"
                onClick={handleToggleShowScheduled}
                sx={{ backgroundColor: '#0a2048', color: '#ffffff', '&:hover': { backgroundColor: '#1a3668' } }}
            >
                {showScheduledOnly ? 'All Mentors' : 'My Sessions'}
            </Button>
        </Box>
      </Box>

      {/* Conditionally render the correct view */}
      {showScheduledOnly ? renderScheduledSessions() : renderAllMentors()}


      {/* Request Form Dialog */}
      {selectedMentor && (
        <RequestForm
          open={isRequestFormOpen}
          onClose={handleCloseRequestForm}
          mentor={selectedMentor}
          userProfile={userProfile}
        />
      )}
    </Box>
  );
};

export default CareerAdvice;