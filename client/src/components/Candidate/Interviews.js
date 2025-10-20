import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Divider,
  IconButton,
  Popover,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import { 
  Event, 
  AccessTime, 
  Videocam, 
  LocationOn, 
  CheckCircle, 
  Cancel,
  CalendarToday,
  HourglassEmpty,
  Check
} from '@mui/icons-material';
import axios from 'axios';

// Imports for the Date Picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const Interviews = () => {
  // State for interviews data
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingIds, setConfirmingIds] = useState(new Set()); // Track which interviews are being confirmed
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // State for the calendar popover
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch interviews from backend
  const fetchInterviews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view interviews');
        return;
      }

      console.log('Fetching interviews...');
      
      // Fetch upcoming interviews
      const upcomingResponse = await axios.get('http://localhost:5000/api/interviews/upcoming', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch past interviews  
      const pastResponse = await axios.get('http://localhost:5000/api/interviews/past', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Upcoming interviews response:', upcomingResponse.data);
      console.log('Past interviews response:', pastResponse.data);
      
      if (upcomingResponse.data.success) {
        setUpcomingInterviews(upcomingResponse.data.data);
      } else {
        console.error('Failed to fetch upcoming interviews:', upcomingResponse.data.message);
      }
      
      if (pastResponse.data.success) {
        setPastInterviews(pastResponse.data.data);
      } else {
        console.error('Failed to fetch past interviews:', pastResponse.data.message);
      }
      
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError('Error loading interviews. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm interview (change status from interviewPending to interviewScheduled)
  const confirmInterview = async (interview) => {
    setConfirmingIds(prev => new Set([...prev, interview.id]));
    
    try {
      const token = localStorage.getItem('token');
      
      // Update candidate_job status
      const response = await axios.patch(
        `http://localhost:5000/api/interviews/confirm/${interview.applicationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Interview confirmed successfully!',
          severity: 'success'
        });
        
        // Update the local state to show the interview as confirmed
        setUpcomingInterviews(prev =>
          prev.map(item =>
            item.id === interview.id
              ? { ...item, candidate_job_status: item.candidate_job_status.replace('Pending', 'Scheduled') }
              : item
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to confirm interview');
      }
      
    } catch (error) {
      console.error('Error confirming interview:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error confirming interview',
        severity: 'error'
      });
    } finally {
      setConfirmingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(interview.id);
        return newSet;
      });
    }
  };

  // Fetch data when component loads
  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleOpenCalendar = (event, date) => {
    setAnchorEl(event.currentTarget);
    setSelectedDate(new Date(date));
  };

  const handleCloseCalendar = () => {
    setAnchorEl(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isCalendarOpen = Boolean(anchorEl);

  // Check if interview is already confirmed (scheduled)
  const isInterviewConfirmed = (interview) => {
    return interview.candidate_job_status && interview.candidate_job_status.includes('Scheduled');
  };

  const getOutcomeChip = (outcome) => {
    if (outcome === 'Advanced to Next Round') {
      return <Chip icon={<CheckCircle />} label={outcome} color="success" size="small" />;
    }
    if (outcome === 'No Longer in Consideration') {
      return <Chip icon={<Cancel />} label={outcome} color="error" size="small" />;
    }
    return <Chip icon={<HourglassEmpty />} label="Awaiting Feedback" color="warning" size="small" />;
  };

  // Show loading state
  if (isLoading) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </LocalizationProvider>
    );
  }

  // Show error state
  if (error) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button onClick={fetchInterviews} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        </Box>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header with Refresh Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            My Interviews
          </Typography>
          <Button variant="outlined" onClick={fetchInterviews} disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : 'Refresh'}
          </Button>
        </Box>

        {/* Upcoming Interviews Section */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Upcoming Interviews ({upcomingInterviews.length})
        </Typography>
        
        {upcomingInterviews.length === 0 ? (
          <Paper elevation={1} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No upcoming interviews scheduled.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Check your ApplicationTracker for interview updates!
            </Typography>
          </Paper>
        ) : (
          <List sx={{ mb: 4 }}>
            {upcomingInterviews.map((interview) => (
              <Paper 
                key={interview.id} 
                elevation={2} 
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  borderRadius: 2, 
                  transition: 'box-shadow 0.3s, transform 0.2s',
                  '&:hover': { 
                    boxShadow: 6, 
                    transform: 'translateY(-4px)' 
                  }
                }}
              >
                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div">
                        {interview.jobTitle}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        at {interview.companyName}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={interview.stage} 
                      color="primary" 
                      variant="outlined"
                    />
                    {isInterviewConfirmed(interview) && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Confirmed"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>
                </ListItem>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box display="flex" alignItems="center">
                    <Event sx={{ mr: 1, color: 'text.secondary' }} /> 
                    {new Date(interview.date).toDateString()} at {interview.time}
                  </Box>
                  <Box display="flex" alignItems="center">
                    {interview.format === 'On-site' ? 
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} /> : 
                      <Videocam sx={{ mr: 1, color: 'text.secondary' }} />
                    }
                    {interview.format === 'On-site' ? interview.location : interview.format}
                  </Box>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Left side - Confirm Button */}
                  <Button
                    variant={isInterviewConfirmed(interview) ? "outlined" : "contained"}
                    color={isInterviewConfirmed(interview) ? "success" : "primary"}
                    size="small"
                    startIcon={isInterviewConfirmed(interview) ? <CheckCircle /> : <Check />}
                    onClick={() => confirmInterview(interview)}
                    disabled={isInterviewConfirmed(interview) || confirmingIds.has(interview.id)}
                    sx={{ minWidth: '120px' }}
                  >
                    {confirmingIds.has(interview.id) ? (
                      <CircularProgress size={16} />
                    ) : isInterviewConfirmed(interview) ? (
                      'Confirmed'
                    ) : (
                      'Confirm'
                    )}
                  </Button>

                  {/* Right side - Calendar and Join Meeting buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={(event) => handleOpenCalendar(event, interview.date)}
                    >
                      <CalendarToday />
                    </IconButton>
                    {interview.link && interview.format !== 'On-site' && 
                      <Button 
                        variant="contained" 
                        size="small" 
                        href={interview.link} 
                        target="_blank"
                      >
                        Join Meeting
                      </Button>
                    }
                  </Box>
                </Box>
              </Paper>
            ))}
          </List>
        )}

        {/* Past Interviews Section */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Past Interviews ({pastInterviews.length})
        </Typography>
        
        {pastInterviews.length === 0 ? (
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No past interviews found.
            </Typography>
          </Paper>
        ) : (
          <List>
            {pastInterviews.map((interview) => (
              <Paper 
                key={interview.id} 
                elevation={1} 
                sx={{ mb: 2, p: 2, borderRadius: 2, opacity: 0.8 }}
              >
                <ListItem sx={{ p: 0 }}>
                  <ListItemText
                    primary={interview.jobTitle}
                    secondary={`at ${interview.companyName} on ${new Date(interview.date).toLocaleDateString()}`}
                  />
                  {getOutcomeChip(interview.outcome)}
                </ListItem>
              </Paper>
            ))}
          </List>
        )}

        {/* Calendar Popover */}
        <Popover
          open={isCalendarOpen}
          anchorEl={anchorEl}
          onClose={handleCloseCalendar}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={selectedDate}
            readOnly
            onChange={() => {}}
          />
        </Popover>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Interviews;