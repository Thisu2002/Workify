import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  Grid,
  Stack,
  Divider,
  Link,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { 
  Email,
  Phone,
  LocationOn,
  Work,
  School,
  StarBorder,
  CalendarToday,
  PhotoCamera,
  FileUpload,
  Delete,
  Edit,
} from '@mui/icons-material';

// --- ProfileSection Helper Component (Unchanged) ---
const ProfileSection = ({ title, icon, children, ...props }) => (
  <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'relative' }} {...props}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Stack>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

// --- MOCK DATA (Unchanged) ---
const mockCandidate = {
  name: "Sajani Ranaweera",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face",
  about: "Self-taught logo/brand designer with 4+ years of experience creating modern, clean, and minimal brands that make a lasting impression.",
  contact: {
    email: "sajani.ranaweera@email.com",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    age: "26 years"
  },
  skills: ["React", "Node.js", "UI/UX", "JavaScript", "Figma", "Illustrator", "Photoshop"],
  experience: [
    {
      title: "Freelancer",
      company: "Logo/Brand Designer",
      dates: "2021 - Present",
      description: "• Worked on diverse logo and brand identity projects.\n• Collaborated with clients from multiple countries.\n• Developed a versatile design skill set."
    },
    {
      title: "Wealth OS",
      company: "Frontend Developer",
      dates: "2020 - 2021",
      description: "• Developed modern web apps using React and MUI.\n• Collaboration: Supported Lead Designer on projects.\n• Tools: Used React, Node.js, & MUI."
    }
  ],
  education: [
    { degree: "BSc in Computer Science", school: "University of Colombo", dates: "2017-21" },
    { degree: "Diploma in Graphic Design", school: "Local Institute", dates: "2017-18" }
  ],
};


const Profile = () => {
  const candidate = mockCandidate;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleUpload = () => { console.log("Upload"); handleMenuClose(); };
  const handleDelete = () => { console.log("Delete"); handleMenuClose(); };
  const handleEditProfile = () => { console.log("Edit Profile Clicked"); };

  if (!candidate) return <Typography>Loading profile...</Typography>;

  return (
    <Grid container spacing={3} alignItems="flex-start">
      
      <Grid item xs={12}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEditProfile}
            sx={{
              position: 'absolute',
              top: 24,
              right: 24,
              borderRadius: '20px'
            }}
          >
            Edit Profile
          </Button>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 4 }} alignItems="center">
            
            {/* === UPDATED: Avatar section with border wrapper === */}
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              {/* This Box creates the border and spacing */}
              <Box sx={{
                borderRadius: '50%',
                border: '4px solid',
                borderColor: 'primary.main', // Color set to primary.main
                p: '5px', // This padding creates the space
                display: 'inline-flex',
                backgroundColor: 'background.paper' // Ensures a solid background behind the avatar
              }}>
                <Avatar 
                  src={candidate.avatarUrl} 
                  alt={candidate.name}
                  sx={{ 
                    width: {xs: 120, md: 150}, 
                    height: {xs: 120, md: 150},
                    // The border is now on the parent Box, not here
                  }} 
                />
              </Box>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  position: 'absolute', bottom: 5, right: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'white' }
                }}
              >
                <PhotoCamera sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Name, About, and Contact Info */}
            <Stack spacing={1} sx={{ flexGrow: 1, width: '100%' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{candidate.name}</Typography>
              <Typography variant="body1" color="text.secondary">{candidate.about}</Typography>
              <Divider sx={{ my: 2 }}/>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}><Stack direction="row" spacing={1}><Email color="primary"/> <Link href={`mailto:${candidate.contact.email}`}>{candidate.contact.email}</Link></Stack></Grid>
                <Grid item xs={12} sm={6}><Stack direction="row" spacing={1}><Phone color="primary"/> <Typography>{candidate.contact.phone}</Typography></Stack></Grid>
                <Grid item xs={12} sm={6}><Stack direction="row" spacing={1}><LocationOn color="primary"/> <Typography>{candidate.contact.location}</Typography></Stack></Grid>
                <Grid item xs={12} sm={6}><Stack direction="row" spacing={1}><CalendarToday color="primary"/> <Typography>{candidate.contact.age}</Typography></Stack></Grid>
              </Grid>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
      
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleUpload}><FileUpload sx={{ mr: 1 }} fontSize="small" />Upload Photo</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><Delete sx={{ mr: 1 }} fontSize="small" />Delete Photo</MenuItem>
      </Menu>

      <Grid item xs={12} md={6}>
        <ProfileSection title="Work Experience" icon={<Work color="primary" />}>
        <IconButton
  onClick={handleEditProfile}
  sx={{
    position: 'absolute',
    top: 16, // Adjusted for better spacing
    right: 16, // Adjusted for better spacing
    border: '1px solid', // Manually add the border
    borderColor: 'divider' // Use the theme's divider color for a subtle outline
  }}
>
  <Edit />
</IconButton>
          <Timeline position="right" sx={{ p: 0, m: 0 }}>
            {candidate.experience.map((job, index) => (
              <TimelineItem key={index} sx={{ '&::before': { content: 'none' } }}>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  {index < candidate.experience.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 3 }}>
                  <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
                    {job.title}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                     <Typography variant="subtitle1" color="text.primary">{job.company}</Typography>
                     <Chip label={job.dates} size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                    {job.description}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </ProfileSection>
      </Grid>

      <Grid item xs={12} md={6}>
        <ProfileSection title="Education" icon={<School color="primary" />}>
        <IconButton
  onClick={handleEditProfile}
  sx={{
    position: 'absolute',
    top: 16, // Adjusted for better spacing
    right: 16, // Adjusted for better spacing
    border: '1px solid', // Manually add the border
    borderColor: 'divider' // Use the theme's divider color for a subtle outline
  }}
>
  <Edit />
</IconButton>
          <Stack spacing={2}>
            {candidate.education.map((edu, index) => (
              <Box key={index}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{edu.degree}</Typography>
                  <Chip label={edu.dates} size="small" />
                </Stack>
                <Typography variant="body1">{edu.school}</Typography>
              </Box>
            ))}
          </Stack>
        </ProfileSection>
      </Grid>
      
      {/* <Grid item xs={12}>
        <ProfileSection title="Skills & Tools" icon={<StarBorder color="primary" />}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {candidate.skills.map(skill => (
              <Chip key={skill} label={skill} color="primary" variant="outlined" />
            ))}
          </Box>
        </ProfileSection>
      </Grid> */}
    </Grid>
  );
};

export default Profile;