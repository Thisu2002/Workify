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
  Stack
} from "@mui/material";
import { 
  Search,
  Star,
  ChatBubbleOutline
} from '@mui/icons-material';

// Sample Mentor Data - In a real app, this would come from an API
const MOCK_MENTORS = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Senior Product Manager at Google',
    bio: 'Passionate about building great products and helping aspiring PMs navigate their career path.',
    specialties: ['Resume Review', 'Product Strategy', 'Interview Prep', 'Career Growth']
  },
  {
    id: 2,
    name: 'David Lee',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Lead Software Engineer at Meta',
    bio: 'Specializing in scalable systems and architecture. Happy to conduct mock technical interviews.',
    specialties: ['System Design', 'Technical Interviews', 'GoLang', 'React']
  },
  {
    id: 3,
    name: 'Maria Garcia',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Engineering Manager at Netflix',
    bio: 'Focused on leadership, team building, and growing engineers from mid-level to senior roles.',
    specialties: ['Leadership', 'Salary Negotiation', 'Team Culture', 'Public Speaking']
  },
  {
    id: 4,
    name: 'James Miller',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    role: 'Principal UX Researcher at Amazon',
    bio: 'I help people understand the "why" behind user behavior and translate insights into impactful design.',
    specialties: ['UX Research', 'Portfolio Review', 'User Testing', 'Career Change']
  },
];

const CareerAdvice = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = MOCK_MENTORS.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Page Header and Search */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Connect with Industry Mentors
        </Typography>
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
        />
      </Box>

      {/* Mentor List Grid */}
      <Grid container spacing={3}>
        {filteredMentors.map(mentor => (
          <Grid item key={mentor.id} xs={12} sm={6} lg={4} sx={{ flexGrow: 1 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                transition: 'box-shadow 0.3s, transform 0.2s', 
                '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' } 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={mentor.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{mentor.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{mentor.role}</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ flexGrow: 1, mb: 2 }}>
                {mentor.bio}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Can help with:
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {mentor.specialties.map(specialty => (
                    <Chip key={specialty} icon={<Star fontSize="small" />} label={specialty} size="small" variant="outlined" color="primary" />
                  ))}
                </Stack>
              </Box>

              <Button 
                variant="contained" 
                startIcon={<ChatBubbleOutline />} 
                fullWidth
                sx={{ mt: 'auto' }} // Pushes the button to the bottom
              >
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
    </Box>
  );
};

export default CareerAdvice;