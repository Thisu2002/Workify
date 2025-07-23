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
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Alert,
  LinearProgress
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

// --- ProfileSection Helper Component (Unchanged) ---
const ProfileSection = ({ title, icon, children, ...props }) => (
  <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'relative', height: '100%' }} {...props}>
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
  avatarUrl: "",
  about: "Self-taught logo/brand designer with 4+ years of experience creating modern, clean, and minimal brands that make a lasting impression.",
  contact: {
    email: "sajani.ranaweera@gmail.com",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    age: "26 years"
  },
  skills: ["React", "Node.js", "MongoDB", "Flutter", "UI/UX", "JavaScript", "Figma", "Illustrator", "Photoshop"],
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
  const [candidate, setCandidate] = useState(mockCandidate);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Edit Profile Form State
  const [editFormOpen, setEditFormOpen] = useState(false);
  
  // CV Management State
  const [cvs, setCvs] = useState([
    {
      id: 1,
      name: "Software_Engineer_Resume_2024.pdf",
      uploadDate: "2024-07-15",
      size: "245 KB",
      isDefault: true
    },
    {
      id: 2, 
      name: "Frontend_Developer_CV.pdf",
      uploadDate: "2024-07-10",
      size: "312 KB",
      isDefault: false
    }
  ]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleUpload = () => { console.log("Upload"); handleMenuClose(); };
  const handleDelete = () => { console.log("Delete"); handleMenuClose(); };
  const handleEditProfile = () => { 
    setEditFormOpen(true);
  };

  // Edit Profile Form Functions
  const handleEditFormClose = () => {
    setEditFormOpen(false);
  };

  const handleProfileSave = (updatedData) => {
    // Update the candidate data
    setCandidate(prev => ({
      ...prev,
      name: updatedData.name,
      about: updatedData.about,
      contact: updatedData.contact,
      experience: updatedData.experience,
      education: updatedData.education
    }));
    
    // Also update the mockCandidate for consistency (in real app, this would be API call)
    Object.assign(mockCandidate, {
      name: updatedData.name,
      about: updatedData.about,
      contact: updatedData.contact,
      experience: updatedData.experience,
      education: updatedData.education
    });
    
    console.log("Profile updated:", updatedData);
  };

  // CV Management Functions
  const handleCvUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if maximum CVs reached
      if (cvs.length >= 3) {
        alert("Maximum 3 CVs allowed. Please delete an existing CV first.");
        return;
      }
      
      // Check file type
      if (file.type !== 'application/pdf') {
        alert("Only PDF files are allowed.");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }
      
      // Simulate upload progress
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            
            // Add new CV to the list
            const newCv = {
              id: Date.now(),
              name: file.name,
              uploadDate: new Date().toISOString().split('T')[0],
              size: `${Math.round(file.size / 1024)} KB`,
              isDefault: cvs.length === 0
            };
            setCvs(prev => [...prev, newCv]);
            
            return 0;
          }
          return prev + 10;
        });
      }, 100);
    }
    
    // Reset file input
    event.target.value = '';
  };

  const handleDeleteCv = (cvId) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      setCvs(prev => {
        const updatedCvs = prev.filter(cv => cv.id !== cvId);
        // If we deleted the default CV and there are others, make the first one default
        if (updatedCvs.length > 0 && !updatedCvs.some(cv => cv.isDefault)) {
          updatedCvs[0].isDefault = true;
        }
        return updatedCvs;
      });
    }
  };

  const handleSetDefault = (cvId) => {
    setCvs(prev => prev.map(cv => ({
      ...cv,
      isDefault: cv.id === cvId
    })));
  };

  const handleViewCv = (cvName) => {
    // In a real app, this would open the PDF in a new tab or modal
    console.log(`Viewing CV: ${cvName}`);
    alert(`Viewing ${cvName} - In a real app, this would open the PDF`);
  };

  const handleDownloadCv = (cvName) => {
    // In a real app, this would trigger a download
    console.log(`Downloading CV: ${cvName}`);
    alert(`Downloading ${cvName} - In a real app, this would download the file`);
  };

  if (!candidate) return <Typography>Loading profile...</Typography>;

  return (
    <>
      {/* Edit Profile Form */}
      <EditProfileForm 
        open={editFormOpen}
        onClose={handleEditFormClose}
        profileData={candidate}
        onSave={handleProfileSave}
      />

      <Grid container spacing={3} direction="column">
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
              <Stack spacing={3} sx={{ flexGrow: 1, width: '100%' }}>
                {/* Group 1: Name and About section with its own internal spacing */}
                <Stack spacing={2}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {candidate.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {candidate.about}
                  </Typography>
                </Stack>

                {/* Group 2: The Divider (no margin needed, the parent Stack handles it) */}
                <Divider />

                {/* Group 3: The Contact Details Grid */}
                <Grid container spacing={2}> {/* Increased spacing slightly for better layout */}
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Email color="primary" />
                      <Link href={`mailto:${candidate.contact.email}`} underline="hover">
                        {candidate.contact.email}
                      </Link>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Phone color="primary" />
                      <Typography variant="body1">{candidate.contact.phone}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LocationOn color="primary" />
                      <Typography variant="body1">{candidate.contact.location}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarToday color="primary" />
                      <Typography variant="body1">{candidate.contact.age}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        
        <Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleMenuClose}
>
  {/* The primary action, highlighted with the theme's primary color */}
  <MenuItem onClick={handleUpload} sx={{ color: 'primary.main' }}>
    <FileUpload sx={{ mr: 1.5 }} fontSize="small" />
    Upload Photo
  </MenuItem>
  
  {/* A divider to separate action types */}
  <Divider sx={{ my: 0.5 }} />
  
  {/* The destructive action, highlighted with the theme's error color */}
  <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
    <Delete sx={{ mr: 1.5 }} fontSize="small" />
    Delete Photo
  </MenuItem>
</Menu>

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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {candidate.skills.map(skill => (
                <Chip key={skill} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>
          </ProfileSection>
        </Grid>
        
        {/* CV/Resume Management Section */}
        <Grid item xs={12}>
          <ProfileSection title="CV & Resume" icon={<PictureAsPdf color="primary" />}>
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Upload up to 3 CVs in PDF format (max 5MB each)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  component="label"
                  disabled={cvs.length >= 3 || isUploading}
                  size="small"
                >
                  Add CV
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={handleCvUpload}
                  />
                </Button>
              </Stack>

              {/* Upload Progress */}
              {isUploading && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Uploading... {uploadProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}

              {/* CV List */}
              {cvs.length === 0 ? (
                <Alert severity="info" sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">
                    No CVs uploaded yet. Add your first CV to get started!
                  </Typography>
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {cvs.map((cv) => (
                    <Card variant="outlined" key={cv.id} sx={{ position: 'relative' }}>
                      {cv.isDefault && (
                        <Chip
                          label="Default"
                          color="primary"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1
                          }}
                        />
                      )}
                      <CardContent sx={{ pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PictureAsPdf color="error" sx={{ mr: 1, fontSize: 32 }} />
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={cv.name}
                            >
                              {cv.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {cv.size} • {cv.uploadDate}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ 
                        pt: 0, 
                        px: 2, 
                        pb: 2, 
                        display: 'flex',
                        flexDirection: 'column',
                        height: '80px', // Fixed height for CardActions
                        justifyContent: 'space-between'
                      }}>
                        {/* First row: View and Download buttons */}
                        <Box sx={{ display: 'flex', gap: 0.5, width: '100%' }}>
                          <Button 
                            size="small" 
                            startIcon={<Visibility />}
                            onClick={() => handleViewCv(cv.name)}
                            sx={{ flex: 1 }}
                          >
                            View
                          </Button>
                          <Button 
                            size="small" 
                            startIcon={<GetApp />}
                            onClick={() => handleDownloadCv(cv.name)}
                            sx={{ flex: 1 }}
                          >
                            Download
                          </Button>
                        </Box>
                        
                        {/* Second row: Set Default button and Delete icon - fixed layout */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          width: '100%',
                          height: '32px' // Fixed height for this row
                        }}>
                          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            {cv.isDefault ? (
                              <Typography 
                                variant="caption" 
                                color="primary" 
                                sx={{ fontWeight: 'bold' }}
                              >
                                Default CV
                              </Typography>
                            ) : (
                              <Button 
                                size="small"
                                onClick={() => handleSetDefault(cv.id)}
                                color="primary"
                                variant="text"
                                sx={{ minHeight: '24px' }}
                              >
                                Set Default
                              </Button>
                            )}
                          </Box>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteCv(cv.id)}
                            sx={{ minWidth: '32px', minHeight: '32px' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  ))}
                </Stack>
              )}
              
              {/* Usage Stats */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {cvs.length}/3 CVs uploaded
                  {cvs.length > 0 && (
                    <>
                      {" • "}
                      {cvs.find(cv => cv.isDefault)?.name.split('.')[0] || 'None'} is your default CV
                    </>
                  )}
                </Typography>
              </Box>
            </Box>
          </ProfileSection>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;