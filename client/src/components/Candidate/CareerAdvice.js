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
  Tabs,
  CircularProgress,
  Alert
} from "@mui/material";
import { 
  Search,
  Star,
  ChatBubbleOutline,
  CalendarToday,
  AccessTime,
  Videocam,
  CheckCircle,
  Link as LinkIcon
} from '@mui/icons-material';
import RequestForm from './RequestForm';
import axios from 'axios';

const CareerAdvice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [showScheduledOnly, setShowScheduledOnly] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [sessionsTab, setSessionsTab] = useState(0);
  const [sessions, setSessions] = useState([]);
  
  // New state for mentors
  const [mentors, setMentors] = useState([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(false);
  const [mentorsError, setMentorsError] = useState(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

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
    fetchMentors();
    fetchSessions(); // Fetch sessions on component mount
  }, []);

  // Fetch sessions from backend
  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/mentoring/my-sessions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setSessions(response.data.data);
        } else {
          console.error('Failed to fetch sessions:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // New function to fetch mentors
  const fetchMentors = async () => {
    setIsLoadingMentors(true);
    setMentorsError(null);
    
    try {
      console.log('Fetching mentors...');
      const response = await axios.get('http://localhost:5000/api/mentors', {
        params: {
          search: searchTerm,
          limit: 50
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        console.log('Mentors fetched:', response.data.data);
        setMentors(response.data.data);
      } else {
        setMentorsError('Failed to fetch mentors');
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentorsError('Error loading mentors. Please try again.');
    } finally {
      setIsLoadingMentors(false);
    }
  };

  // Refetch mentors when search term changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!showScheduledOnly) {
        fetchMentors();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, showScheduledOnly]);

  // Check if mentor has existing pending or scheduled session
  const getMentorSessionStatus = (mentorId) => {
    const existingSession = sessions.find(session => {
      const sessionMentorId = session.mentorId || session.mentor?.id || session.mentor?._id;
      return (sessionMentorId === mentorId || sessionMentorId === mentorId.toString()) && 
             (session.status === 'pending' || session.status === 'scheduled');
    });
    
    if (existingSession) {
      console.log(`Found existing session for mentor ${mentorId}:`, existingSession);
      return existingSession.status;
    }
    console.log(`No existing session found for mentor ${mentorId}`);
    return null;
  };

  const handleRequestSession = (mentor) => {
    // Only allow if no pending/scheduled session exists
    const sessionStatus = getMentorSessionStatus(mentor._id || mentor.id);
    if (sessionStatus === 'pending' || sessionStatus === 'scheduled') {
      return; // Don't open form if already has active session
    }
    
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
      setSessionsTab(0);
    }
  };

  const handleSessionsTabChange = (event, newValue) => {
    setSessionsTab(newValue);
  };

  // Handle successful session request
  const handleSessionRequestSuccess = async (mentor, requestData) => {
    console.log('Session request success called with:', mentor, requestData);
    
    // Immediately add the session to local state to update UI instantly
    const newSession = {
      _id: Date.now(), // Temporary ID
      mentorId: mentor._id || mentor.id,
      mentorName: mentor.name, // Use mentor.name, not candidate name
      session_type: requestData.requestType || 'General Mentoring',
      status: 'pending',
      message: requestData.sessionGoals,
      requestDate: new Date()
    };
    
    // Add to sessions immediately to update button state
    setSessions(prevSessions => [newSession, ...prevSessions]);
    console.log('Added session to local state, button should now be disabled');
    
    // Also refresh from backend to get the real data
    setTimeout(async () => {
      await fetchSessions();
      console.log('Sessions refreshed from backend');
    }, 1000);
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
    let filteredSessions;
    
    switch (sessionsTab) {
      case 1: 
        filteredSessions = sessions.filter(s => (s.status || s.session?.status) === 'pending');
        break;
      case 2: 
        filteredSessions = sessions.filter(s => (s.status || s.session?.status) === 'scheduled');
        break;
      case 3: 
        filteredSessions = sessions.filter(s => (s.status || s.session?.status) === 'completed');
        break;
      case 4: 
        filteredSessions = sessions.filter(s => (s.status || s.session?.status) === 'cancelled');
        break;
      default: 
        filteredSessions = sessions;
        break;
    }
    
    // Sort sessions: pending first, then by request date (newest first)
    return filteredSessions.sort((a, b) => {
      const statusA = a.status || a.session?.status;
      const statusB = b.status || b.session?.status;
      
      // If one is pending and other is not, pending comes first
      if (statusA === 'pending' && statusB !== 'pending') return -1;
      if (statusB === 'pending' && statusA !== 'pending') return 1;
      
      // If both have same status or both are pending, sort by date (newest first)
      const dateA = new Date(a.requestDate || a.session?.requestDate || 0);
      const dateB = new Date(b.requestDate || b.session?.requestDate || 0);
      
      return dateB - dateA;
    });
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mentor.specialties && mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const renderAllMentors = () => {
    // Sort mentors: those with pending sessions first, then others
    const sortedMentors = filteredMentors.sort((a, b) => {
      const mentorIdA = a._id || a.id;
      const mentorIdB = b._id || b.id;
      
      const sessionStatusA = getMentorSessionStatus(mentorIdA);
      const sessionStatusB = getMentorSessionStatus(mentorIdB);
      
      // If one has pending session and other doesn't, pending comes first
      if (sessionStatusA === 'pending' && sessionStatusB !== 'pending') return -1;
      if (sessionStatusB === 'pending' && sessionStatusA !== 'pending') return 1;
      
      // If one has scheduled session and other has no session, scheduled comes first
      if (sessionStatusA === 'scheduled' && !sessionStatusB) return -1;
      if (sessionStatusB === 'scheduled' && !sessionStatusA) return 1;
      
      // Otherwise maintain original order (or sort alphabetically by name)
      return a.name.localeCompare(b.name);
    });

    return (
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

        {/* Loading State */}
        {isLoadingMentors && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {mentorsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {mentorsError}
            <Button onClick={fetchMentors} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        )}

        {/* Mentors Grid - Using sorted mentors */}
        {!isLoadingMentors && !mentorsError && (
          <Grid container spacing={3}>
            {sortedMentors.map(mentor => {
              const mentorId = mentor._id || mentor.id;
              const sessionStatus = getMentorSessionStatus(mentorId);
              const isRequested = sessionStatus === 'pending' || sessionStatus === 'scheduled';
              
              return (
                <Grid item key={mentorId} xs={12} md={6}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      transition: 'box-shadow 0.3s, transform 0.2s', 
                      '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                      opacity: isRequested ? 0.8 : 1,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      // Highlight pending sessions
                      border: sessionStatus === 'pending' ? '2px solid #ff9800' : 'none',
                      backgroundColor: sessionStatus === 'pending' ? '#fff3e0' : 'white'
                    }}
                  >
                    {/* Avatar and Basic Info */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar 
                        src={mentor.avatar} 
                        sx={{ width: 60, height: 60, flexShrink: 0 }}
                      >
                        {mentor.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ mb: 0.5, fontSize: '1.1rem' }}>
                          {mentor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {mentor.role}{mentor.company && ` at ${mentor.company}`}
                        </Typography>
                        {mentor.rating > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Star fontSize="small" color="warning" />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {mentor.rating.toFixed(1)} ({mentor.totalSessions} sessions)
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Bio */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2, 
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1
                      }}
                    >
                      {mentor.bio}
                    </Typography>

                    {/* Specialties */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Can help with:
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {mentor.specialties && mentor.specialties.slice(0, 3).map(specialty => (
                          <Chip 
                            key={specialty} 
                            icon={<Star fontSize="small" />} 
                            label={specialty} 
                            size="small" 
                            variant="outlined" 
                            color="primary" 
                          />
                        ))}
                        {mentor.specialties && mentor.specialties.length > 3 && (
                          <Chip 
                            label={`+${mentor.specialties.length - 3} more`}
                            size="small" 
                            variant="outlined" 
                            color="default"
                          />
                        )}
                      </Stack>
                    </Box>

                    {/* Action Button */}
                    <Box sx={{ mt: 'auto' }}>
                      <Button 
                        variant={isRequested ? "outlined" : "contained"} 
                        startIcon={isRequested ? <CheckCircle /> : <ChatBubbleOutline />} 
                        onClick={() => handleRequestSession(mentor)}
                        disabled={isRequested}
                        color={isRequested ? "success" : "primary"}
                        fullWidth
                        sx={{ py: 1.2 }}
                      >
                        {sessionStatus === 'pending' ? 'Request Pending' : 
                         sessionStatus === 'scheduled' ? 'Session Scheduled' : 
                         'Request a Session'}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}

        {!isLoadingMentors && !mentorsError && sortedMentors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">No mentors found matching your search.</Typography>
          </Box>
        )}
      </>
    );
  };

  const renderScheduledSessions = () => {
    const filteredSessions = getFilteredSessions();
    
    return (
      <Box>
        {/* Sessions Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={sessionsTab} onChange={handleSessionsTabChange}>
            <Tab label={`All (${sessions.length})`} />
            <Tab label={`Pending (${sessions.filter(s => (s.status || s.session?.status) === 'pending').length})`} />
            <Tab label={`Scheduled (${sessions.filter(s => (s.status || s.session?.status) === 'scheduled').length})`} />
            <Tab label={`Completed (${sessions.filter(s => (s.status || s.session?.status) === 'completed').length})`} />
            <Tab label={`Cancelled (${sessions.filter(s => (s.status || s.session?.status) === 'cancelled').length})`} />
          </Tabs>
        </Box>

        {/* Loading State */}
        {isLoadingSessions && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Sessions List */}
        {!isLoadingSessions && filteredSessions.length > 0 ? (
          filteredSessions.map(item => {
            const sessionStatus = item.status || item.session?.status;
            const mentorName = item.mentorName || item.mentor?.name;
            const sessionTopic = item.session_type || item.session?.topic;
            const sessionMessage = item.message || item.session?.message;
            const requestDate = item.requestDate ? new Date(item.requestDate).toLocaleDateString() : 
                              item.session?.requestDate || 'N/A';
            
            return (
              <Paper key={item._id || item.id} elevation={2} sx={{ mb: 2, p: 2.5, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Grid item>
                    <Avatar src={item.mentorAvatar || item.mentor?.avatar} sx={{ width: 50, height: 50 }}>
                      {mentorName ? mentorName.charAt(0) : 'M'}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">{sessionTopic}</Typography>
                    <Typography variant="body2" color="text.secondary">With {mentorName}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Requested: {requestDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Chip 
                      label={sessionStatus ? sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1) : 'Unknown'} 
                      color={getStatusColor(sessionStatus)} 
                      size="small" 
                    />
                  </Grid>
                </Grid>
                
                {sessionMessage && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Your message:</strong> {sessionMessage}
                    </Typography>
                  </>
                )}

                {(sessionStatus === 'scheduled' || sessionStatus === 'completed') && item.scheduledDate && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{xs: 1, sm: 3}} useFlexGap flexWrap="wrap">
                      <ListItem sx={{p:0}}>
                        <ListItemIcon sx={{minWidth: 36}}><CalendarToday fontSize="small" color="action"/></ListItemIcon>
                        <ListItemText primary={new Date(item.scheduledDate).toLocaleDateString()} />
                      </ListItem>
                      {item.date_time && (
                        <ListItem sx={{p:0}}>
                          <ListItemIcon sx={{minWidth: 36}}><AccessTime fontSize="small" color="action"/></ListItemIcon>
                          <ListItemText primary={item.date_time} />
                        </ListItem>
                      )}
                    </Stack>
                  </>
                )}

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  {sessionStatus === 'pending' && (
                    <Button variant="outlined" size="small" color="error">Cancel Request</Button>
                  )}
                  {sessionStatus === 'scheduled' && (
                    <>
                      <Button variant="outlined" size="small">Reschedule</Button>
                      <Button 
                        variant="contained" 
                        size="small" 
                        startIcon={<Videocam />} 
                        disabled={!item.meetingLink}
                      >
                        Join Meeting
                      </Button>
                    </>
                  )}
                  {sessionStatus === 'completed' && (
                    <Button variant="outlined" size="small">Leave Feedback</Button>
                  )}
                </Box>
              </Paper>
            );
          })
        ) : !isLoadingSessions ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary">
              {sessionsTab === 0 ? 'You have no sessions yet.' : `You have no ${['all', 'pending', 'scheduled', 'completed', 'cancelled'][sessionsTab]} sessions.`}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Click 'All Mentors' to find and request a session with a mentor.
            </Typography>
          </Paper>
        ) : null}
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
          onSuccess={handleSessionRequestSuccess}
        />
      )}
    </Box>
  );
};

export default CareerAdvice;