import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  Message as MessageIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Check as CompleteIcon,
  VideoCameraFront as VideoIcon,
  CalendarToday as CalendarIcon
} from "@mui/icons-material";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import "../../styles/Recruiter.css";

const Sessions = ({ showSessionForm, setShowSessionForm }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    session_type: '',
    candidate_email: '',
    date_time: '',
    duration: '60',
    notes: ''
  });
  
  // State for fetched sessions
  const [mentorSessions, setMentorSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [completionNote, setCompletionNote] = useState('');

  // Fetch scheduled sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      console.log('🔄 Fetching scheduled mentoring sessions...');
      
      const response = await axios.get('http://localhost:5000/api/mentoring/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          status: 'scheduled'
        }
      });

      console.log('📥 Sessions received:', response.data);

      if (response.data.success) {
        // Clear any existing data first
        setMentorSessions([]);
        
        // Set the data from the API
        if (Array.isArray(response.data.data)) {
          setMentorSessions(response.data.data);
        } else {
          console.error('Expected array but got:', typeof response.data.data);
          setError('Invalid data format received from server');
        }
      } else {
        setError(response.data.message || 'Failed to load sessions');
      }
    } catch (error) {
      console.error('❌ Error fetching sessions:', error);
      setError(error.response?.data?.message || 'Failed to load sessions');
      enqueueSnackbar('Failed to load sessions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Refresh sessions after creating a new one
  const handleSessionCreated = () => {
    fetchSessions();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.session_type || !formData.candidate_email || !formData.date_time) {
        enqueueSnackbar('Please fill all required fields', { variant: 'error' });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Authentication required. Please log in again.', { variant: 'error' });
        return;
      }

      console.log('Submitting session with data:', formData);
      
      const response = await axios.post(
        'http://localhost:5000/api/mentoring/sessions', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        enqueueSnackbar('Session scheduled successfully!', { variant: 'success' });
        setShowSessionForm(false);
        // Reset form
        setFormData({
          session_type: '',
          candidate_email: '',
          date_time: '',
          duration: '60',
          notes: ''
        });
        // Refresh sessions list
        handleSessionCreated();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        'Could not schedule session. Please try again later.';
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleCancelSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/mentoring/sessions/${sessionId}`, 
        { status: 'cancelled' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMentorSessions(prev => prev.filter(session => session._id !== sessionId));
      enqueueSnackbar('Session cancelled', { variant: 'info' });
    } catch (error) {
      console.error('Error cancelling session:', error);
      enqueueSnackbar('Failed to cancel session', { variant: 'error' });
    }
  };

  const handleCompleteSession = (session) => {
    setSelectedSession(session);
    setShowNoteDialog(true);
  };

  const handleCloseDialog = () => {
    setShowNoteDialog(false);
    setSelectedSession(null);
    setCompletionNote('');
  };

  const handleSessionComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/mentoring/sessions/${selectedSession._id}`, 
        {
          status: 'completed',
          notes: completionNote
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMentorSessions(prev => prev.filter(session => session._id !== selectedSession._id));
      handleCloseDialog();
      enqueueSnackbar('Session marked as completed', { variant: 'success' });
    } catch (error) {
      console.error('Error completing session:', error);
      enqueueSnackbar('Failed to update session', { variant: 'error' });
    }
  };

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const isSessionSoon = (dateString) => {
    const sessionDate = new Date(dateString);
    const now = new Date();
    const diffTime = sessionDate - now;
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 24;
  };

  const SessionCard = ({ session, index }) => (
    <Slide in={!loading} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
      <Card sx={{ mb: 2, position: 'relative' }}>
        {session.scheduledDate && isSessionSoon(session.scheduledDate) && (
          <Chip
            label="Upcoming"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontWeight: 'bold'
            }}
          />
        )}
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={session.candidateAvatar} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="h6">
                  {session.candidateName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {session.candidate_email}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  {Array.isArray(session.skills) && session.skills.length > 0 ? (
                    session.skills.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={skill} 
                        size="small" 
                        sx={{ bgcolor: "#f0f8ff", color: "#3B5998" }}
                      />
                    ))
                  ) : (
                    <Chip 
                      label="General" 
                      size="small" 
                      sx={{ bgcolor: "#f0f8ff", color: "#3B5998" }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
            
            <Chip 
              label={session.session_type || session.requestType || 'Mentoring'}
              variant="outlined"
              color="primary" 
              sx={{ ml: 1 }}
            />
          </Box>

          <Box mb={2}>
            <Chip 
              icon={<CalendarIcon fontSize="small" />}
              label={`Scheduled: ${session.date_time ? formatDateTime(session.date_time) : 
                (session.scheduledDate ? formatDateTime(session.scheduledDate) : 'Not set')}`}
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip 
              label={`${session.duration || 60} mins`}
              variant="outlined"
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>

          {session.notes && (
            <Typography variant="body2" sx={{ mb: 2, bgcolor: '#f9f9f9', p: 1, borderRadius: 1 }}>
              <strong>Session Notes:</strong> {session.notes}
            </Typography>
          )}

          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => handleCancelSession(session._id)}
              color="error"
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              startIcon={<CompleteIcon />}
              onClick={() => handleCompleteSession(session)}
              color="success"
            >
              Mark Complete
            </Button>
            <Button
              variant="contained"
              startIcon={<VideoIcon />}
              sx={{ bgcolor: "#3B5998" }}
              href={`https://meet.google.com/lookup/${session._id ? session._id.substring(0, 10) : 'default-session'}`}
              target="_blank"
            >
              Start Session
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Slide>
  );

  const CreateSessionForm = () => (
    <Box>
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: 1.5,
        pt: 2,
        bgcolor: 'white'
      }}>
        <Box sx={{ 
          width: 45, 
          height: 45, 
          borderRadius: '50%', 
          bgcolor: '#3B5998', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mx: 'auto',
          mb: 1.5
        }}>
          <ScheduleIcon sx={{ fontSize: 22, color: 'white' }} />
        </Box>
        <Typography variant="h6" component="div" fontWeight="600" color="#2c3e50" sx={{ fontSize: '1.1rem' }}>
          Schedule New Session
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
          Set up a mentoring session with your candidate
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 1, pt: 1 }}>
        <Box component="form">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="#2c3e50" sx={{ mb: 0.8, fontWeight: 500, fontSize: '0.8rem' }}>
              Session Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select 
                name="session_type"
                value={formData.session_type}
                onChange={handleInputChange}
                displayEmpty
                sx={{ 
                  height: 38,
                  fontSize: '0.8rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    bgcolor: '#f8f9fa',
                    '&:hover': { 
                      bgcolor: '#e9ecef',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3B5998'
                      }
                    },
                    '&.Mui-focused': { 
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3B5998'
                      }
                    }
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary" fontSize="0.8rem">Choose session type</Typography>
                </MenuItem>
                <MenuItem value="cv-review">CV Review & Feedback</MenuItem>
                <MenuItem value="mock-interview">Mock Interview Practice</MenuItem>
                <MenuItem value="career-guidance">Career Guidance & Planning</MenuItem>
                <MenuItem value="technical-mentoring">Technical Skills Mentoring</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="#2c3e50" sx={{ mb: 0.8, fontWeight: 500, fontSize: '0.8rem' }}>
              Candidate Email
            </Typography>
            <TextField 
              fullWidth
              name="candidate_email"
              value={formData.candidate_email}
              onChange={handleInputChange}
              size="small"
              placeholder="candidate@example.com"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  height: 38,
                  fontSize: '0.8rem',
                  borderRadius: 1,
                  bgcolor: '#f8f9fa',
                  '&:hover': { 
                    bgcolor: '#e9ecef',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3B5998'
                    }
                  },
                  '&.Mui-focused': { 
                    bgcolor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3B5998'
                    }
                  }
                }
              }}
            />
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="#2c3e50" sx={{ mb: 0.8, fontWeight: 500, fontSize: '0.8rem' }}>
                Date & Time
              </Typography>
              <TextField 
                type="datetime-local" 
                name="date_time"
                value={formData.date_time}
                onChange={handleInputChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    height: 38,
                    fontSize: '0.8rem',
                    borderRadius: 1,
                    bgcolor: '#f8f9fa',
                    '&:hover': { 
                      bgcolor: '#e9ecef',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3B5998'
                      }
                    },
                    '&.Mui-focused': { 
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3B5998'
                      }
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="#2c3e50" sx={{ mb: 0.8, fontWeight: 500, fontSize: '0.8rem' }}>
                Duration
              </Typography>
              <FormControl fullWidth size="small">
                <Select 
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  defaultValue="60"
                  sx={{ 
                    height: 38,
                    fontSize: '0.8rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      bgcolor: '#f8f9fa',
                      '&:hover': { 
                        bgcolor: '#e9ecef',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3B5998'
                        }
                      },
                      '&.Mui-focused': { 
                        bgcolor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3B5998'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="30">30 minutes</MenuItem>
                  <MenuItem value="45">45 minutes</MenuItem>
                  <MenuItem value="60">60 minutes</MenuItem>
                  <MenuItem value="90">90 minutes</MenuItem>
                  <MenuItem value="120">2 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="#2c3e50" sx={{ mb: 0.8, fontWeight: 500, fontSize: '0.8rem' }}>
              Session Notes
            </Typography>
            <TextField 
              fullWidth
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              multiline
              rows={2}
              size="small"
              placeholder="Add agenda, topics to cover, or any special requirements..."
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.8rem',
                  borderRadius: 1,
                  bgcolor: '#f8f9fa',
                  '&:hover': { 
                    bgcolor: '#e9ecef',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3B5998'
                    }
                  },
                  '&.Mui-focused': { 
                    bgcolor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3B5998'
                    }
                  }
                }
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ 
          p: 1.5, 
          bgcolor: '#f0f8ff', 
          borderRadius: 1, 
          border: '1px solid #e3f2fd'
        }}>
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Box sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: 1, 
              bgcolor: '#3B5998', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              i
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="500" color="#2c3e50" sx={{ mb: 0.2, fontSize: '0.75rem' }}>
                Session Reminder
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, fontSize: '0.7rem' }}>
                Both you and the candidate will receive email notifications and calendar invites once scheduled.
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleCancelCreate} 
          color="inherit"
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          startIcon={<ScheduleIcon />}
          disabled={!formData.candidate_email || !formData.session_type || !formData.date_time}
        >
          Schedule Session
        </Button>
      </DialogActions>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress color="primary" size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading sessions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={fetchSessions}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // Clear the form and hide it when cancelled
  const handleCancelCreate = () => {
    setShowSessionForm(false);
    setFormData({
      session_type: '',
      candidate_email: '',
      date_time: '',
      duration: '60',
      notes: ''
    });
  };

  return (
    <Box>
      {showSessionForm ? (
        <CreateSessionForm />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Scheduled Sessions
            </Typography>
            <Button
              variant="contained"
              startIcon={<ScheduleIcon />}
              onClick={() => setShowSessionForm(true)}
              sx={{ 
                bgcolor: "#3B5998",
                '&:hover': { bgcolor: "#2d4373" }
              }}
            >
              New Session
            </Button>
          </Box>
          
          <Box display="flex" flexDirection="column">
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : mentorSessions.length > 0 ? (
              mentorSessions.map((session, index) => (
                <SessionCard key={session._id} session={session} index={index} />
              ))
            ) : (
              <Box textAlign="center" p={5}>
                <Typography variant="h6" color="text.secondary">
                  No scheduled sessions
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  You don't have any upcoming mentoring sessions.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setShowSessionForm(true)}
                >
                  Schedule Your First Session
                </Button>
              </Box>
            )}
          </Box>
          
          <Dialog open={showNoteDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Complete Session with {selectedSession?.candidateName}</DialogTitle>
            <DialogContent>
              <Box mt={2}>
                <TextField 
                  label="Session Notes" 
                  fullWidth 
                  multiline
                  rows={4}
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  placeholder="Add notes about the session, progress made, and recommendations for the candidate..."
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">
                Cancel
              </Button>
              <Button 
                onClick={handleSessionComplete} 
                variant="contained" 
                color="success"
                startIcon={<CompleteIcon />}
              >
                Complete Session
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Sessions;
