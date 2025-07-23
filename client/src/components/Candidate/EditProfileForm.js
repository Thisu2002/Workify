import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stack,
  Typography,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Box,
  Divider
} from "@mui/material";
import {
  Close,
  Save,
  Add,
  Remove,
  Person,
  Work,
  School
} from '@mui/icons-material';

// Tab Panel Component (Unchanged)
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EditProfileForm = ({ open, onClose, profileData, onSave }) => {
  const [currentTab, setCurrentTab] = useState(0);
  // All state and handler functions are unchanged from your version
  const [formData, setFormData] = useState({
    name: profileData?.name || "",
    about: profileData?.about || "",
    email: profileData?.contact?.email || "",
    phone: profileData?.contact?.phone || "",
    location: profileData?.contact?.location || "",
    age: profileData?.contact?.age?.replace(' years', '') || "",
    experience: profileData?.experience || [{ title: "", company: "", dates: "", description: "" }],
    education: profileData?.education || [{ degree: "", school: "", dates: "" }]
  });

  const handleTabChange = (event, newValue) => setCurrentTab(newValue);
  const handleBasicInfoChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleExperienceChange = (index, field, value) => setFormData(prev => ({ ...prev, experience: prev.experience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp) }));
  const handleEducationChange = (index, field, value) => setFormData(prev => ({ ...prev, education: prev.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu) }));
  const addExperience = () => setFormData(prev => ({ ...prev, experience: [...prev.experience, { title: "", company: "", dates: "", description: "" }] }));
  const removeExperience = (index) => { if (formData.experience.length > 1) setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) })); };
  const addEducation = () => setFormData(prev => ({ ...prev, education: [...prev.education, { degree: "", school: "", dates: "" }] }));
  const removeEducation = (index) => { if (formData.education.length > 1) setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) })); };

  const handleSave = () => {
    const updatedData = {
      name: formData.name,
      about: formData.about,
      contact: { email: formData.email, phone: formData.phone, location: formData.location, age: formData.age ? `${formData.age} years` : "" },
      experience: formData.experience,
      education: formData.education
    };
    onSave(updatedData);
    onClose();
  };
  const handleClose = () => onClose();

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      // === CRITICAL FIX 1: Enforce a flex column layout on the dialog itself ===
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      {/* HEADER SECTION: This part will not scroll */}
      <Box sx={{ flexShrink: 0 }}>
        <DialogTitle sx={{ pb: 1, backgroundColor: 'background.paper' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Edit Profile</Typography>
            <IconButton onClick={handleClose} size="small"><Close /></IconButton>
          </Stack>
        </DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
          <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<Person />} label="Basic Info" />
            <Tab icon={<Work />} label="Experience" />
            <Tab icon={<School />} label="Education" />
          </Tabs>
        </Box>
      </Box>

      {/* === CRITICAL FIX 2: Make DialogContent the flexible, scrolling area === */}
      <DialogContent sx={{ p: 0, flex: '1 1 auto', overflowY: 'auto' }}>
        {/* Basic Info Tab */}
        <TabPanel value={currentTab} index={0}>
          <Box sx={{ px: 3 }}>
            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Personal Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}><TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => handleBasicInfoChange('name', e.target.value)} required/></Grid>
                  <Grid item xs={12}><TextField fullWidth label="About / Bio" value={formData.about} onChange={(e) => handleBasicInfoChange('about', e.target.value)} multiline rows={3} helperText="Tell us about yourself..."/></Grid>
                </Grid>
              </Paper>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Contact Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" value={formData.email} onChange={(e) => handleBasicInfoChange('email', e.target.value)} type="email" required/></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => handleBasicInfoChange('phone', e.target.value)} helperText="Include country code"/></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Location" value={formData.location} onChange={(e) => handleBasicInfoChange('location', e.target.value)} helperText="City, Country"/></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Age" value={formData.age} onChange={(e) => handleBasicInfoChange('age', e.target.value)} type="number" helperText="Enter age in years"/></Grid>
                </Grid>
              </Paper>
            </Stack>
          </Box>
        </TabPanel>

        {/* Work Experience Tab */}
        <TabPanel value={currentTab} index={1}>
          <Box sx={{ px: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Work Experience
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addExperience}
                  size="small"
                >
                  Add Experience
                </Button>
              </Stack>

              {formData.experience.map((experience, index) => (
                <Paper 
                  key={index} 
                  variant="outlined" 
                  sx={{ p: 3, borderRadius: 2, position: 'relative' }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Experience {index + 1}
                    </Typography>
                    {formData.experience.length > 1 && (
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => removeExperience(index)}
                      >
                        <Remove />
                      </IconButton>
                    )}
                  </Stack>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={experience.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        value={experience.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={experience.dates}
                        onChange={(e) => handleExperienceChange(index, 'dates', e.target.value)}
                        variant="outlined"
                        placeholder="e.g., 2020 - 2021 or 2021 - Present"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      {/* Empty space for alignment */}
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Job Description"
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        variant="outlined"
                        multiline
                        rows={4}
                        placeholder="• Describe your key responsibilities&#10;• List your achievements&#10;• Mention technologies/tools used"
                        helperText="Use bullet points (•) to list your responsibilities and achievements"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </Box>
        </TabPanel>

        {/* Education Tab */}
        <TabPanel value={currentTab} index={2}>
          <Box sx={{ px: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Education
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addEducation}
                  size="small"
                >
                  Add Education
                </Button>
              </Stack>

              {formData.education.map((education, index) => (
                <Paper 
                  key={index} 
                  variant="outlined" 
                  sx={{ p: 3, borderRadius: 2, position: 'relative' }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Education {index + 1}
                    </Typography>
                    {formData.education.length > 1 && (
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => removeEducation(index)}
                      >
                        <Remove />
                      </IconButton>
                    )}
                  </Stack>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Degree / Qualification"
                        value={education.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Institution / School"
                        value={education.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={education.dates}
                        onChange={(e) => handleEducationChange(index, 'dates', e.target.value)}
                        variant="outlined"
                        placeholder="e.g., 2017-21 or 2020-2024"
                        required
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </Box>
        </TabPanel>
      </DialogContent>

      {/* FOOTER SECTION: This part will not scroll */}
      <Box sx={{ flexShrink: 0 }}>
        <Divider />
        <DialogActions sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <Button onClick={handleClose} variant="outlined" size="large" sx={{ mr: 1 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />} size="large">Save Changes</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditProfileForm;