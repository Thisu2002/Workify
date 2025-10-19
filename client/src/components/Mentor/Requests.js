import React, { useState } from "react";
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
  MenuItem
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Event as EventIcon
} from "@mui/icons-material";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import "../../styles/Recruiter.css";

const Requests = () => {
  const [mentorRequests, setMentorRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    sessionType: '',
    dateTime: '',
    duration: 60,
    notes: ''
  });
  const { enqueueSnackbar } = useSnackbar();

  // Fetch mentoring requests from backend - only with status "pending"
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      console.log('🔄 Fetching pending mentoring requests...');
      
      // Explicitly request only pending status sessions
      const response = await axios.get('http://localhost:5000/api/mentoring/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          status: 'pending' // This will match both 'pending' and 'Pending' with our updated backend
        }
      });

      console.log('📥 Response received:', response.data);

      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          // Filter to include both 'pending' and 'Pending' in case the backend regex doesn't work
          const pendingSessions = response.data.data.filter(session => 
            session.status.toLowerCase() === 'pending'
          );
          setMentorRequests(pendingSessions);
          console.log(`📊 Pending requests count: ${pendingSessions.length}`);
        } else {
          console.error('Expected array but got:', typeof response.data.data);
          setError('Invalid data format received from server');
        }
      } else {
        setError(response.data.message || 'Failed to load requests');
      }
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      setError(error.response?.data?.message || 'Failed to load requests');
      enqueueSnackbar('Failed to load requests', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests on component mount
  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleAcceptRequest = (requestId) => {
    const request = mentorRequests.find(req => req._id === requestId);
    setSelectedRequest(request);
    setScheduleData({
      sessionType: request.requestType,
      dateTime: '',
      duration: 60,
      notes: ''
    });
    setShowScheduleDialog(true);
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/mentoring/sessions/${requestId}`, 
        { status: 'cancelled' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMentorRequests(prev => prev.filter(req => req._id !== requestId));
      enqueueSnackbar('Request declined', { variant: 'info' });
    } catch (error) {
      console.error('Error declining request:', error);
      enqueueSnackbar('Failed to decline request', { variant: 'error' });
    }
  };

  const handleCloseDialog = () => {
    setShowScheduleDialog(false);
    setSelectedRequest(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleSession = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/mentoring/sessions/${selectedRequest._id}`, 
        {
          status: 'scheduled',
          scheduledDate: scheduleData.dateTime,
          date_time: scheduleData.dateTime,
          duration: scheduleData.duration,
          notes: scheduleData.notes
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMentorRequests(prev => prev.filter(req => req._id !== selectedRequest._id));
      setShowScheduleDialog(false);
      setSelectedRequest(null);
      enqueueSnackbar('Session scheduled successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error scheduling session:', error);
      enqueueSnackbar('Failed to schedule session', { variant: 'error' });
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#96BEC5';
      default: return '#656565';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const RequestCard = ({ request, index }) => (
    <Slide in={!loading} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
      <Card className="request-card-modern" sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={request.candidateAvatar} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="h6" className="candidate-name">
                  {request.candidateName || 'Candidate'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.candidate_email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.experience ? `${request.experience} • ` : ''}{request.field || 'General Mentoring'}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  {Array.isArray(request.skills) && request.skills.length > 0 ? (
                    request.skills.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={skill} 
                        size="small" 
                        className="skill-chip"
                        sx={{ bgcolor: "#f0f8ff", color: "#3B5998" }}
                      />
                    ))
                  ) : (
                    <Chip 
                      label="General" 
                      size="small" 
                      className="skill-chip"
                      sx={{ bgcolor: "#f0f8ff", color: "#3B5998" }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Chip 
                label={request.urgency || 'medium'}
                size="small"
                sx={{ 
                  backgroundColor: getUrgencyColor(request.urgency || 'medium'),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(request.createdAt || request.requestDate || new Date())}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Chip 
              label={request.session_type || request.requestType || 'Mentoring Session'} 
              variant="outlined" 
              className="type-chip"
            />
            
            {request.date_time && (
              <Typography variant="body2" color="text.secondary">
                Preferred time: {new Date(request.date_time).toLocaleString()}
              </Typography>
            )}
          </Box>

          {request.notes && (
            <Typography variant="body2" className="request-message" paragraph>
              <strong>Notes:</strong> {request.notes}
            </Typography>
          )}

          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={() => handleDeclineRequest(request._id)}
              className="decline-btn"
            >
              Decline
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={() => handleAcceptRequest(request._id)}
              className="accept-btn"
              sx={{ bgcolor: "#3B5998" }}
            >
              Accept & Schedule
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Slide>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="body1">Loading requests...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading requests
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={fetchRequests}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Mentoring Requests
      </Typography>
      
      <Box display="flex" flexDirection="column">
        {mentorRequests.length > 0 ? (
          mentorRequests.map((request, index) => (
            <RequestCard key={request._id} request={request} index={index} />
          ))
        ) : (
          <Box textAlign="center" p={5}>
            <Typography variant="h6" color="text.secondary">
              No pending requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You've handled all mentoring requests. Great job!
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog open={showScheduleDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Session with {selectedRequest?.candidateName}</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Session Type</InputLabel>
              <Select 
                name="sessionType"
                value={scheduleData.sessionType}
                onChange={handleInputChange}
              >
                <MenuItem value="CV Review">CV Review</MenuItem>
                <MenuItem value="Interview Prep">Interview Prep</MenuItem>
                <MenuItem value="Career Guidance">Career Guidance</MenuItem>
                <MenuItem value="Technical Mentoring">Technical Mentoring</MenuItem>
              </Select>
            </FormControl>
            
            <TextField 
              label="Date & Time" 
              type="datetime-local" 
              fullWidth 
              margin="normal"
              name="dateTime"
              value={scheduleData.dateTime}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Duration</InputLabel>
              <Select 
                name="duration"
                value={scheduleData.duration}
                onChange={handleInputChange}
              >
                <MenuItem value="30">30 minutes</MenuItem>
                <MenuItem value="45">45 minutes</MenuItem>
                <MenuItem value="60">60 minutes</MenuItem>
                <MenuItem value="90">90 minutes</MenuItem>
              </Select>
            </FormControl>
            
            <TextField 
              label="Notes for Candidate" 
              fullWidth 
              margin="normal"
              multiline
              rows={3}
              name="notes"
              value={scheduleData.notes}
              onChange={handleInputChange}
              placeholder="Provide any preparation instructions or notes for the candidate..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleScheduleSession} 
            variant="contained" 
            color="primary"
            startIcon={<EventIcon />}
            disabled={!scheduleData.dateTime}
          >
            Schedule Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Requests;
