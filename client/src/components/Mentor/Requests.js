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
import "../../styles/Recruiter.css";

const Requests = () => {
  const [mentorRequests, setMentorRequests] = useState([
    {
      id: 1,
      candidateName: "Pathum Tilakarathne",
      candidateAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      requestType: "CV Review",
      experience: "2 years",
      field: "Frontend Development",
      requestDate: "2024-01-15",
      message: "Looking for help with optimizing my CV for senior frontend roles. I have experience with React, TypeScript, and modern frontend technologies.",
      urgency: "medium",
      skills: ["React", "TypeScript", "CSS"]
    },
    {
      id: 2,
      candidateName: "Sarini Wijesinghe",
      candidateAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      requestType: "Interview Prep",
      experience: "1 year",
      field: "UX Design",
      requestDate: "2024-01-14",
      message: "Need guidance for upcoming Google interview. Looking for tips on design thinking and portfolio presentation.",
      urgency: "high",
      skills: ["Figma", "User Research", "Prototyping"]
    },
    {
      id: 3,
      candidateName: "Milinda Udayanga",
      candidateAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
      requestType: "Career Guidance",
      experience: "3 years",
      field: "Backend Development",
      requestDate: "2024-01-13",
      message: "Seeking advice on career transition to cloud technologies. Currently working with Node.js and exploring AWS.",
      urgency: "low",
      skills: ["Node.js", "AWS", "Docker"]
    }
  ]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const handleAcceptRequest = (requestId) => {
    setSelectedRequest(mentorRequests.find(req => req.id === requestId));
    setShowScheduleDialog(true);
  };

  const handleDeclineRequest = (requestId) => {
    setMentorRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleCloseDialog = () => {
    setShowScheduleDialog(false);
    setSelectedRequest(null);
  };

  const handleScheduleSession = () => {
    // Handle scheduling logic here
    setMentorRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
    setShowScheduleDialog(false);
    setSelectedRequest(null);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#96BEC5';
      default: return '#656565';
    }
  };

  const RequestCard = ({ request, index }) => (
    <Slide in={true} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
      <Card className="request-card-modern" sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={request.candidateAvatar} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="h6" className="candidate-name">
                  {request.candidateName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.experience} • {request.field}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  {request.skills.map((skill, idx) => (
                    <Chip 
                      key={idx} 
                      label={skill} 
                      size="small" 
                      className="skill-chip"
                      sx={{ bgcolor: "#f0f8ff", color: "#3B5998" }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Chip 
                label={request.urgency}
                size="small"
                sx={{ 
                  backgroundColor: getUrgencyColor(request.urgency),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {request.requestDate}
              </Typography>
            </Box>
          </Box>

          <Chip 
            label={request.requestType} 
            variant="outlined" 
            className="type-chip"
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" className="request-message" paragraph>
            {request.message}
          </Typography>

          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={() => handleDeclineRequest(request.id)}
              className="decline-btn"
            >
              Decline
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={() => handleAcceptRequest(request.id)}
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

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Mentoring Requests
      </Typography>
      
      <Box display="flex" flexDirection="column">
        {mentorRequests.length > 0 ? (
          mentorRequests.map((request, index) => (
            <RequestCard key={request.id} request={request} index={index} />
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
              <Select defaultValue={selectedRequest?.requestType.toLowerCase().replace(' ', '-') || ""}>
                <MenuItem value="cv-review">CV Review</MenuItem>
                <MenuItem value="interview-prep">Interview Prep</MenuItem>
                <MenuItem value="career-guidance">Career Guidance</MenuItem>
                <MenuItem value="technical-mentoring">Technical Mentoring</MenuItem>
              </Select>
            </FormControl>
            
            <TextField 
              label="Date & Time" 
              type="datetime-local" 
              fullWidth 
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Duration</InputLabel>
              <Select defaultValue="60">
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
          >
            Schedule Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Requests;
