import React, { useState } from "react";
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
  IconButton
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  Message as MessageIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon
} from "@mui/icons-material";
import "../../styles/Recruiter.css";

const Sessions = ({ showSessionForm, setShowSessionForm }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  
  const activeSessions = [
    {
      id: 1,
      candidateName: "Emaya Liyanage",
      candidateAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      sessionType: "CV Review",
      scheduledTime: "2024-01-16 14:00",
      duration: "60 min",
      status: "upcoming",
      progress: 0
    },
    {
      id: 2,
      candidateName: "Danushka Perera",
      candidateAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      sessionType: "Mock Interview",
      scheduledTime: "2024-01-16 16:30",
      duration: "90 min",
      status: "in-progress",
      progress: 45
    },
    {
      id: 3,
      candidateName: "Sarah Johnson",
      candidateAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
      sessionType: "Career Guidance",
      scheduledTime: "2024-01-17 10:00",
      duration: "45 min",
      status: "upcoming",
      progress: 0
    },
    {
      id: 4,
      candidateName: "Michael Smith",
      candidateAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
      sessionType: "Technical Mentoring",
      scheduledTime: "2024-01-17 13:30",
      duration: "60 min",
      status: "upcoming",
      progress: 0
    }
  ];
  
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
  
  const CreateSessionForm = () => (
    <Box component="form" sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Schedule New Session
      </Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Session Type</InputLabel>
        <Select defaultValue="">
          <MenuItem value="cv-review">CV Review</MenuItem>
          <MenuItem value="mock-interview">Mock Interview</MenuItem>
          <MenuItem value="career-guidance">Career Guidance</MenuItem>
          <MenuItem value="technical-mentoring">Technical Mentoring</MenuItem>
        </Select>
      </FormControl>
      
      <TextField 
        label="Candidate Email" 
        fullWidth 
        margin="normal"
      />
      
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
        label="Notes" 
        fullWidth 
        margin="normal"
        multiline
        rows={3}
      />
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Active Sessions</Typography>
        <Button 
          variant="contained"
          startIcon={<ScheduleIcon />}
          onClick={() => setShowSessionForm(true)}
        >
          Schedule Session
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {activeSessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </Grid>
      
      <Dialog open={Boolean(showSessionForm)} onClose={() => setShowSessionForm(false)} maxWidth="sm" fullWidth>
        <CreateSessionForm />
        <DialogActions>
          <Button onClick={() => setShowSessionForm(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sessions;
