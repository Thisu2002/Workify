import React, { useState } from 'react';
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
  ListItemText
} from "@mui/material";
import { 
  Search,
  Star,
  ChatBubbleOutline,
  CalendarToday,
  AccessTime,
  Videocam,
  Link as LinkIcon
} from '@mui/icons-material';
import RequestForm from './RequestForm';

// Sample Mentor Data - In a real app, this would come from an API
const MOCK_MENTORS = [
  {
    id: 1,
    name: 'Diluni Amarasinghe',
    avatar: '',
    role: 'Senior Product Manager at Surge Global',
    bio: 'Passionate about building great products and helping aspiring PMs navigate their career path.',
    specialties: ['Resume Review', 'Product Strategy', 'Interview Prep', 'Career Growth']
  },
  {
    id: 2,
    name: 'Nudam Perera',
    avatar: '',
    role: 'Lead Software Engineer at Furtado',
    bio: 'Specializing in scalable systems and architecture. Happy to conduct mock technical interviews.',
    specialties: ['System Design', 'Technical Interviews', 'GoLang', 'React']
  },
  {
    id: 3,
    name: 'Tharushi Nethmini',
    avatar: '',
    role: 'Engineering Manager at TechCorp',
    bio: 'Focused on leadership, team building, and growing engineers from mid-level to senior roles.',
    specialties: ['Leadership', 'Salary Negotiation', 'Team Culture', 'Public Speaking']
  },
  {
    id: 4,
    name: 'Rasika Samarasinghe',
    avatar: '',
    role: 'UX Designer at Sysco Labs',
    bio: 'I help people understand the "why" behind user behavior and translate insights into impactful design.',
    specialties: ['UX Research', 'Portfolio Review', 'User Testing', 'Career Change']
  },
];

// Sample Scheduled Sessions Data
const MOCK_SCHEDULED_SESSIONS = [
    {
        id: 1,
        mentor: MOCK_MENTORS[1], // Nudam Perera
        session: {
            date: 'October 28, 2024',
            time: '2:00 PM - 2:30 PM',
            status: 'Confirmed',
            topic: 'Technical Interview Prep',
            meetingLink: 'https://meet.google.com/xyz-abc-def'
        }
    },
    {
        id: 2,
        mentor: MOCK_MENTORS[3], // Rasika Samarasinghe
        session: {
            date: 'November 5, 2024',
            time: '10:00 AM - 10:45 AM',
            status: 'Confirmed',
            topic: 'Portfolio Review',
            meetingLink: 'https://meet.google.com/ghi-jkl-mno'
        }
    }
];


const CareerAdvice = ({ userProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [showScheduledOnly, setShowScheduledOnly] = useState(false); // State to toggle view

  const handleRequestSession = (mentor) => {
    setSelectedMentor(mentor);
    setIsRequestFormOpen(true);
  };

  const handleCloseRequestForm = () => {
    setIsRequestFormOpen(false);
    setSelectedMentor(null);
  };

  const handleToggleShowScheduled = () => {
    setShowScheduledOnly(prev => !prev);
  };

  const filteredMentors = MOCK_MENTORS.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderAllMentors = () => (
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
      <Grid container spacing={3}>
        {filteredMentors.map(mentor => (
          <Grid item key={mentor.id} xs={12} sm={6} lg={4} sx={{ flexGrow: 1 }}>
            <Paper 
              elevation={2} 
              sx={{ p: 2.5, borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s, transform 0.2s', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={mentor.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{mentor.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{mentor.role}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ flexGrow: 1, mb: 2 }}>{mentor.bio}</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Can help with:</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {mentor.specialties.map(specialty => (
                    <Chip key={specialty} icon={<Star fontSize="small" />} label={specialty} size="small" variant="outlined" color="primary" />
                  ))}
                </Stack>
              </Box>
              <Button variant="contained" startIcon={<ChatBubbleOutline />} fullWidth sx={{ mt: 'auto' }} onClick={() => handleRequestSession(mentor)}>
                Request a Session
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {filteredMentors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" color="text.secondary">No mentors found matching your search.</Typography>
          </Box>
      )}
    </>
  );

  const renderScheduledSessions = () => (
    <Box>
        {MOCK_SCHEDULED_SESSIONS.length > 0 ? (
            MOCK_SCHEDULED_SESSIONS.map(item => (
                <Paper key={item.id} elevation={2} sx={{ mb: 2, p: 2.5, borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Grid item>
                            <Avatar src={item.mentor.avatar} sx={{ width: 50, height: 50 }}/>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6">{item.session.topic}</Typography>
                            <Typography variant="body2" color="text.secondary">With {item.mentor.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm="auto">
                             <Chip label={item.session.status} color="success" size="small" />
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{xs: 1, sm: 3}} useFlexGap flexWrap="wrap">
                        <ListItem sx={{p:0}}>
                            <ListItemIcon sx={{minWidth: 36}}><CalendarToday fontSize="small" color="action"/></ListItemIcon>
                            <ListItemText primary={item.session.date} />
                        </ListItem>
                        <ListItem sx={{p:0}}>
                            <ListItemIcon sx={{minWidth: 36}}><AccessTime fontSize="small" color="action"/></ListItemIcon>
                            <ListItemText primary={item.session.time} />
                        </ListItem>
                    </Stack>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="outlined" size="small">Reschedule</Button>
                        <Button variant="contained" size="small" startIcon={<Videocam />} href={item.session.meetingLink} target="_blank">Join Meeting</Button>
                    </Box>
                </Paper>
            ))
        ) : (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
                <Typography variant="h6" color="text.secondary">You have no upcoming sessions.</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                    Click 'All Mentors' to find and request a session with a mentor.
                </Typography>
            </Paper>
        )}
    </Box>
  );

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
        />
      )}
    </Box>
  );
};

export default CareerAdvice;