import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  LinearProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Paper,
  CircularProgress
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  Message as MessageIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Notes as NotesIcon,
  Category as CategoryIcon
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
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sessions from backend
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      console.log('🔄 Fetching sessions from backend...');
      
      const response = await axios.get('http://localhost:5000/api/mentoring/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Response received:', response.data);
      console.log('📊 Sessions count from API:', response.data.count);
      console.log('📊 Total in DB:', response.data.totalInDB);

      if (response.data.success) {
        // Transform the data to match the expected format
        const transformedSessions = response.data.data.map(session => ({
          id: session._id,
          candidateName: session.candidate_email.split('@')[0], // Extract name from email
          candidateAvatar: `https://ui-avatars.com/api/?name=${session.candidate_email.split('@')[0]}&background=random`,
          sessionType: session.session_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          scheduledTime: new Date(session.date_time).toLocaleString(),
          duration: `${session.duration} min`,
          status: session.status.toLowerCase() === 'scheduled' ? 'upcoming' : session.status.toLowerCase(),
          progress: session.status.toLowerCase() === 'in-progress' ? 45 : 0,
          notes: session.notes,
          mentorName: session.mentor_id ? `${session.mentor_id.firstName} ${session.mentor_id.lastName}` : 'Unknown Mentor'
        }));
        
        console.log('🔄 Transformed sessions:', transformedSessions.length);
        setActiveSessions(transformedSessions);
      }
    } catch (error) {
      console.error('❌ Error fetching sessions:', error);
      setError(error.response?.data?.message || 'Failed to load sessions');
      enqueueSnackbar('Failed to load sessions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Refresh sessions after creating a new one
  const handleSessionCreated = () => {
    fetchSessions();
  };

  const SessionCard = ({ session }) => (
    <Grid item xs={12} md={6}>
      <Card className="session-card-modern">
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar src={session.candidateAvatar} />
            <Box flex={1}>
              <Typography variant="h6">{session.candidateName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {session.sessionType}
              </Typography>
            </Box>
            <Chip 
              label={session.status === "in-progress" ? "In Progress" : "Upcoming"}
              size="small"
              className={`status-chip ${session.status}`}
              sx={{ 
                bgcolor: session.status === "in-progress" ? "#e6f7fa" : "#f0f8ff",
                color: session.status === "in-progress" ? "#0288d1" : "#3B5998"
              }}
            />
          </Box>

          {session.status === "in-progress" && (
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={session.progress} 
                className="progress-bar"
              />
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body2">📅 {session.scheduledTime}</Typography>
            <Typography variant="body2">⏱️ {session.duration}</Typography>
          </Box>

          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<VideoCallIcon />}
              size="small"
              className="join-btn"
              sx={{ bgcolor: "#3B5998" }}
            >
              Join Session
            </Button>
            <Button
              variant="outlined"
              startIcon={<MessageIcon />}
              size="small"
            >
              Message
            </Button>
            <IconButton size="small" color="error">
              <CancelIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
  
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
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold"></Typography>
          <Typography variant="body2" color="text.secondary">
            
          </Typography>
        </Box>
        <Button 
          variant="contained"
          startIcon={<ScheduleIcon />}
          onClick={() => setShowSessionForm(true)}
        >
          Schedule Session
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading sessions...</Typography>
        </Box>
      ) : error ? (
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
      ) : activeSessions.length === 0 ? (
        <Box textAlign="center" p={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No sessions scheduled
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Schedule Session" to create your first mentoring session.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {activeSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </Grid>
      )}
      
      <Dialog 
        open={Boolean(showSessionForm)} 
        onClose={() => setShowSessionForm(false)} 
        maxWidth="md" 
        fullWidth
        scroll="body"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '650px',
            m: 2
          }
        }}
      >
        <CreateSessionForm />
        <DialogActions sx={{ 
          p: 2.5, 
          pt: 1.5,
          gap: 2,
          bgcolor: '#fafafa'
        }}>
          <Button 
            onClick={() => setShowSessionForm(false)}
            variant="outlined"
            sx={{ 
              height: 40,
              borderRadius: 1,
              borderColor: '#ddd',
              color: '#666',
              fontSize: '0.8rem',
              minWidth: 100,
              px: 2.5,
              '&:hover': {
                borderColor: '#bbb',
                bgcolor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={() => handleSubmit()}
            disabled={!formData.session_type || !formData.candidate_email || !formData.date_time}
            sx={{ 
              height: 40,
              borderRadius: 1,
              bgcolor: '#3B5998',
              fontSize: '0.8rem',
              minWidth: 140,
              px: 3,
              '&:hover': {
                bgcolor: '#2d4373'
              },
              boxShadow: '0 2px 8px rgba(59, 89, 152, 0.2)'
            }}
          >
            Schedule Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sessions;
