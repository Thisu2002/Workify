import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // For making API calls
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
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Alert,
  LinearProgress,
  CircularProgress // To show a loading spinner
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
  PictureAsPdf,
  CloudUpload,
  Visibility,
  GetApp,
} from '@mui/icons-material';
import EditProfileForm from './EditProfileForm';
import AddIcon from '@mui/icons-material/Add'; // Add this import at the top

// --- ProfileSection Helper Component is unchanged ---
const ProfileSection = ({ title, icon, children, ...props }) => (
  <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'relative' }} {...props}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
    </Stack>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

const Profile = () => {
  // --- NEW: State to hold profile data, loading status, and errors ---
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for the UI elements are unchanged
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [editFormOpen, setEditFormOpen] = useState(false);
  
  // CV Management state is unchanged for now
  const [cvs, setCvs] = useState([]); // Array of uploaded CVs
  const fileInputRef = useRef();
  const avatarInputRef = useRef(null);

  // --- NEW: useEffect to fetch profile data when component mounts ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Assume the auth token is stored in localStorage after the user logs in
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Authorization failed: No token found. Please log in.");
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Call the backend endpoint you created
        const { data } = await axios.get('http://localhost:5000/candidate/profile', config);
        
        setCandidate(data);
        setCvs(data.cvs || []);

      } catch (err) {
        // Handle errors, e.g., token expired, server down
        setError(err.response ? err.response.data.msg : err.message);
      } finally {
        // Always stop loading, whether it succeeded or failed
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // The empty array [] means this effect runs only once

  // --- UPDATED: handleProfileSave now sends data to the backend ---
  const handleProfileSave = async (updatedData) => {
    try {
      setLoading(true); // Show loading state while saving
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      // Send the updated data to the PUT endpoint
      await axios.put('http://localhost:5000/candidate/profile', updatedData, config);

      // Update the local state immediately for a fast UI response
      setCandidate(updatedData);
      setEditFormOpen(false); // Close the form on success
      
    } catch (err) {
      console.error("Failed to save profile:", err);
      // Optionally, show an error alert to the user here
      alert("Could not save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleCvUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/candidate/upload-cv',
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setCvs(data.cvs);
    } catch (err) {
      alert('CV upload failed: ' + (err.response?.data?.msg || err.message));
      console.error(err); // This will log the error details in your browser console
    }
  };

  // --- NEW: Avatar upload handler ---
    // --- NEW: Avatar upload handler ---
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/candidate/upload-avatar',
        formData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Good practice to add this header
          } 
        }
      );
      // ** THIS IS THE IMPORTANT FIX **
      // This line updates the UI instantly with the new photo URL from the backend
      setCandidate(prev => ({ ...prev, avatarUrl: data.avatarUrl }));

    } catch (err) {
      alert('Avatar upload failed: ' + (err.response?.data?.msg || err.message));
      console.error(err);
    }
  };

    // UI handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleEditProfile = () => setEditFormOpen(true);
  const handleEditFormClose = () => setEditFormOpen(false);

  // This function programmatically "clicks" the hidden file input
  const handleTriggerUpload = () => {
    avatarInputRef.current.click();
    handleMenuClose();
  };

  // This function handles the actual deletion by calling the backend
  const handleDeleteAvatar = async () => {
    if (!window.confirm("Are you sure you want to delete your profile photo?")) {
        return;
    }
    try {
        const token = localStorage.getItem('token');
        // NOTE: Your delete route needs to be created in the backend first
        await axios.delete('http://localhost:5000/candidate/delete-avatar', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        // Update state to remove the avatar URL and instantly refresh the UI
        setCandidate(prev => ({ ...prev, avatarUrl: '' }));
    } catch (err) {
         alert('Could not delete photo: ' + (err.response?.data?.msg || err.message));
    } finally {
        handleMenuClose();
    }
  };
  
  // --- NEW: Conditional rendering for loading and error states ---
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box sx={{ p: 3 }}><Alert severity="error">Error: {error}</Alert></Box>;
  }
  
  // If loading is done and there's no candidate, something is wrong
  if (!candidate) {
     return <Typography sx={{ p: 3 }}>Could not load profile data.</Typography>;
  }

  // --- The main JSX render ---
  // This part is the same as before, but it now uses the `candidate` state from the API
  return (
    <>
      <EditProfileForm 
        open={editFormOpen}
        onClose={handleEditFormClose}
        profileData={candidate}
        onSave={handleProfileSave}
      />
      <input
      type="file"
      ref={avatarInputRef}
      onChange={handleAvatarUpload}
      style={{ display: 'none' }}
      accept="image/png, image/jpeg, image/jpg" // Good practice to accept only images
    />
      <Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleMenuClose}
  // ... (rest of your menu props are fine)
>
  {/* This now calls the function that opens the file dialog */}
  <MenuItem onClick={handleTriggerUpload} sx={{ py: 1, px: 2, color: 'primary.main' }}>
    <FileUpload sx={{ mr: 1.5 }} fontSize="small" />
    Upload Photo
  </MenuItem>

  <Divider sx={{ my: 0.5 }} />
  
  {/* This now calls the function that deletes the photo */}
  <MenuItem onClick={handleDeleteAvatar} sx={{ py: 1, px: 2, color: 'error.main' }}>
    <Delete sx={{ mr: 1.5 }} fontSize="small" />
    Delete Photo
  </MenuItem>
</Menu>

      <Grid container spacing={3} direction="column">
        {/* Profile Header Section */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
            <Button variant="outlined" startIcon={<Edit />} onClick={handleEditProfile} sx={{ position: 'absolute', top: 24, right: 24, borderRadius: '20px' }}>
              Edit Profile
            </Button>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 4 }} alignItems="center">
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Box sx={{ borderRadius: '50%', border: '4px solid', borderColor: 'primary.main', p: '5px', display: 'inline-flex' }}>
                  <Avatar src={`http://localhost:5000${candidate.avatarUrl}`}  alt={candidate.name} sx={{ width: {xs: 120, md: 150}, height: {xs: 120, md: 150} }} />
                </Box>
                <IconButton onClick={handleMenuOpen} sx={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(255, 255, 255, 0.9)', '&:hover': { backgroundColor: 'white' } }}>
                  <PhotoCamera sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
              <Stack spacing={3} sx={{ flexGrow: 1, width: '100%' }}>
                <Stack spacing={2}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{candidate.name}</Typography>
                  <Typography variant="body1" color="text.secondary">{candidate.about}</Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Stack direction="row" spacing={0.5} alignItems="center"><Email color="primary" /><Link href={`mailto:${candidate.contact.email}`} underline="hover">{candidate.contact.email}</Link></Stack></Grid>
                  <Grid item xs={12} sm={6}><Stack direction="row" spacing={0.5} alignItems="center"><Phone color="primary" /><Typography variant="body1">{candidate.contact.phone}</Typography></Stack></Grid>
                  <Grid item xs={12} sm={6}><Stack direction="row" spacing={0.5} alignItems="center"><LocationOn color="primary" /><Typography variant="body1">{candidate.contact.location}</Typography></Stack></Grid>
                  <Grid item xs={12} sm={6}><Stack direction="row" spacing={0.5} alignItems="center"><CalendarToday color="primary" /><Typography variant="body1">{candidate.contact.age}</Typography></Stack></Grid>
                </Grid>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        
        {/* All other sections will now populate from the live `candidate` data */}
        
        <Grid item xs={12}>
          <ProfileSection title="Work Experience" icon={<Work color="primary" />}>
          <IconButton
  onClick={handleEditProfile}
  sx={{
    position: 'absolute',
    top: 16, 
    right: 16, 
    border: '1px solid', 
    borderColor: 'divider'
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

        <Grid item xs={12}>
          <ProfileSection title="Education" icon={<School color="primary" />}>
          <IconButton
  onClick={handleEditProfile}
  sx={{
    position: 'absolute',
    top: 16, 
    right: 16, 
    border: '1px solid', 
    borderColor: 'divider' 
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

        <Grid item xs={12}>
          <ProfileSection title="Skills & Tools" icon={<StarBorder color="primary" />}>
            <IconButton
      onClick={() => {/* open skill add dialog or handle add skill */}}
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <AddIcon />
    </IconButton>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {/* Mock skills */}
      <Chip label="React" color="primary" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main' }} />
      <Chip label="Node.js" color="primary" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main' }} />
      <Chip label="Material UI" color="primary" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main' }} />
      <Chip label="JavaScript" color="primary" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main' }} />
      <Chip label="CSS" color="primary" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main' }} />
      {/* Existing candidate skills */}
      {candidate.skills.map(skill => (
        <Chip key={skill} label={skill} color="primary" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main' }} />
      ))}
    </Box>
  </ProfileSection>
        </Grid>
        
        <Grid item xs={12}>
          <ProfileSection title="CV & Resume" icon={<PictureAsPdf color="primary" />}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current.click()}
            sx={{ mb: 2 }}
          >
            Upload CV/Resume
          </Button>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleCvUpload}
          />
          <Stack spacing={2}>
            {cvs.length === 0 && (
              <Typography color="text.secondary">No CVs uploaded yet.</Typography>
            )}
            {cvs.map((cv, idx) => (
              <Paper key={idx} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <PictureAsPdf color="primary" />
                <Typography sx={{ flexGrow: 1 }}>{cv.filename || cv.name}</Typography>
                <IconButton href={cv.url} target="_blank">
                  <Visibility />
                </IconButton>
                <IconButton>
                  <Delete color="error" />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        </ProfileSection>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;