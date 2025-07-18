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
  IconButton,
  Divider,
  Paper
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
                defaultValue=""
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
