import React, { useState } from 'react';
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
  IconButton
} from '@mui/material';
import { Person, Description, UploadFile, CheckCircle, Close } from '@mui/icons-material';

const steps = ['Confirm Details', 'Upload Documents', 'Review & Submit'];

// Mock user data - in a real app, this would come from a user context or props
const MOCK_USER = {
  name: 'Nethmini Lankathilaka',
  email: 'nethmini.l@email.com',
  phone: '070 4324312'
};

const ApplyForm = ({ open, onClose, job }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Submitting Application:', {
      jobId: job.id,
      resume: resumeFile.name,
      coverLetter,
    });
    setIsSubmitting(false);
    handleNext(); // Move to the success step
  };
  
  const handleCloseDialog = () => {
    // Reset state on close
    setTimeout(() => {
        setActiveStep(0);
        setResumeFile(null);
        setCoverLetter('');
    }, 300); // Delay to allow closing animation
    onClose();
  };


  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This information is from your profile. It will be shared with the recruiter.
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <TextField label="Full Name" defaultValue={MOCK_USER.name} fullWidth margin="dense" InputProps={{ readOnly: true }} />
              <TextField label="Email Address" defaultValue={MOCK_USER.email} fullWidth margin="dense" InputProps={{ readOnly: true }} />
              <TextField label="Phone Number" defaultValue={MOCK_USER.phone} fullWidth margin="dense" InputProps={{ readOnly: true }} />
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Your Documents</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please upload your resume. A cover letter is optional but recommended.
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadFile                    />}
              sx={{ mb: 2, textTransform: 'none', color: resumeFile ? 'success.main' : 'primary.main' }}
            >
              {resumeFile ? `${resumeFile.name} (Uploaded)` : 'Upload Resume/CV'}
              <input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            </Button>
            <TextField
              label="Cover Letter (Optional)"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Your Application</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              One final check before you submit. Good luck!
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 1 }}>
              <Typography gutterBottom><strong>Applying for:</strong> {job.title} at {job.company}</Typography>
              <Typography gutterBottom><strong>Resume:</strong> {resumeFile?.name || 'Not provided'}</Typography>
              <Typography><strong>Cover Letter:</strong> {coverLetter ? 'Included' : 'Not included'}</Typography>
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
        Apply to {job?.title}
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
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>Application Sent!</Typography>
            <Typography color="text.secondary">
              You can track the status of this application in your Overview tab. The team at {job?.company} will be in touch.
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
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting || (activeStep === 1 && !resumeFile)}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (activeStep === steps.length - 1 ? 'Submit Application' : 'Next')}
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ApplyForm;