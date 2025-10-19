import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Person, Chat, RateReview, CheckCircle, Close } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

// 1. Updated steps for requesting a session
const steps = ['Your Details', 'Session Goals', 'Review & Submit'];

// Mock user data - this would come from a user context or props
const MOCK_USER = {
  name: 'Nethmini Lankathilaka',
  email: 'nethmini.l@email.com',
  phone: '070 4324312'
};

// 2. The component now accepts a `mentor` prop instead of `job`
const ApplyForm = ({ open, onClose, mentor, userProfile }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 3. Replaced resume/cover letter state with state for session goals
  const [sessionGoals, setSessionGoals] = useState('');
  const [requestType, setRequestType] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  
  // Add state variables for user information - now read-only from profile
  const [userInfo, setUserInfo] = useState({
    name: userProfile?.name || '',
    email: userProfile?.contact?.email || '',
    phone: userProfile?.contact?.phone || ''
  });

  // Update user info when userProfile changes or dialog opens
  useEffect(() => {
    if (open && userProfile) {
      setUserInfo({
        name: userProfile.name || '',
        email: userProfile.contact?.email || '',
        phone: userProfile.contact?.phone || ''
      });
    }
  }, [open, userProfile]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please log in to send a request', { variant: 'error' });
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/mentoring/request',
        {
          mentorId: mentor.id,
          sessionGoals: sessionGoals,
          requestType: requestType || 'General Mentoring'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.success) {
        enqueueSnackbar('Mentoring request sent successfully!', { variant: 'success' });
        handleNext(); // Move to success step
      } else {
        enqueueSnackbar(response.data.message || 'Failed to send request', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to send request. Please try again.',
        { variant: 'error' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseDialog = () => {
    // 4. Reset state specific to this form on close
    setTimeout(() => {
        setActiveStep(0);
        setSessionGoals('');
        setUserInfo({
          name: userProfile?.name || '',
          email: userProfile?.contact?.email || '',
          phone: userProfile?.contact?.phone || ''
        });
    }, 300); // Delay to allow closing animation
    onClose();
  };

  // 5. The content for each step is completely changed
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Step 1: Confirm User's Details (mostly unchanged)
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The mentor will use this information to contact you.
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <TextField 
                label="Full Name" 
                value={userInfo.name} 
                fullWidth 
                margin="dense" 
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
              <TextField 
                label="Email Address" 
                value={userInfo.email} 
                fullWidth 
                margin="dense" 
                variant="outlined"
                type="email"
                InputProps={{ readOnly: true }}
              />
              <TextField 
                label="Phone Number" 
                value={userInfo.phone} 
                fullWidth 
                margin="dense" 
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Box>
          </Box>
        );
      case 1: // Step 2: Define Session Goals (replaces document upload)
        return (
          <Box>
            <Typography variant="h6" gutterBottom>What would you like to discuss?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Briefly describe your goals for this session. This will help the mentor prepare. (e.g., "Resume review", "Career path advice", "Mock interview for a React role")
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Session Type</InputLabel>
              <Select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                label="Session Type"
              >
                <MenuItem value="CV Review">CV Review</MenuItem>
                <MenuItem value="Interview Prep">Interview Preparation</MenuItem>
                <MenuItem value="Career Guidance">Career Guidance</MenuItem>
                <MenuItem value="Technical Mentoring">Technical Mentoring</MenuItem>
                <MenuItem value="Portfolio Review">Portfolio Review</MenuItem>
                <MenuItem value="General Mentoring">General Mentoring</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Message to Mentor"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={sessionGoals}
              onChange={(e) => setSessionGoals(e.target.value)}
              placeholder="I'd like to get feedback on my portfolio and discuss career growth..."
            />
          </Box>
        );
      case 2: // Step 3: Review the request
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Your Request</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              One final check before you send your request to {mentor.name}.
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 1 }}>
              <Typography gutterBottom><strong>Requesting session with:</strong> {mentor.name}</Typography>
              <Typography gutterBottom><strong>Specialization:</strong> {mentor.specialties ? mentor.specialties.join(', ') : 'Not specified'}</Typography>
              <Typography><strong>Your Goals:</strong> {sessionGoals || 'Not provided'}</Typography>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* 6. Dynamic title for the mentor session */}
        Request a Session with {mentor?.name}
        <IconButton edge="end" color="inherit" onClick={handleCloseDialog}>
            <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ my: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          // 7. Custom success message for the session request
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>Request Sent!</Typography>
            <Typography color="text.secondary">
              {mentor?.name} has received your request. You will be notified once they respond. You can track the status in your "My Sessions" tab.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2, mb: 1 }}>{getStepContent(activeStep)}</Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {activeStep === steps.length ? (
          <Button onClick={handleCloseDialog} variant="contained">Close</Button>
        ) : (
          <Box sx={{ flex: '1 1 auto', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              color="inherit"
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              // 8. Disable button if the goals message is empty in step 1
              disabled={isSubmitting || (activeStep === 1 && !sessionGoals.trim())}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (activeStep === steps.length - 1 ? 'Send Request' : 'Next')}
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ApplyForm;