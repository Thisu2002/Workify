import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  IconButton,
  Avatar,
  Grid,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment
} from "@mui/material";
import { 
  BookmarkBorder, 
  Bookmark,
  LocationOn,
  Apartment,
  MonetizationOn,
  Search
} from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import ApplyForm from './ApplyForm';

const jobPostings = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'WealthOS',
    logo: 'https://via.placeholder.com/40?text=I',
    location: 'Colombo',
    type: 'Full-time',
    model: 'Remote',
    salary: '$120,000 - $150,000',
    postedDate: '5d ago',
    description: 'Join our team to build next-generation web applications with React and TypeScript. You will be responsible for developing and implementing user interface components using React.js concepts and workflows such as Redux, Flux, and Webpack.',
    responsibilities: ['Developing new user-facing features', 'Building reusable components', 'Translating designs into high-quality code'],
    qualifications: ['5+ years of React experience', 'Strong proficiency in JavaScript & CSS', 'Experience with RESTful APIs']
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'IFS',
    logo: 'https://via.placeholder.com/40?text=C',
    location: 'Colombo',
    type: 'Contract',
    model: 'Hybrid',
    salary: '$90,000 - $110,000',
    postedDate: '2d ago',
    description: 'We are looking for a talented UI/UX Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts.',
    responsibilities: ['Gather and evaluate user requirements', 'Illustrate design ideas using storyboards', 'Design graphical user interface elements'],
    qualifications: ['Proven UX/UI experience', 'Portfolio of design projects', 'Proficiency in Figma, Sketch, or Adobe XD']
  }
];

const FindJobs = () => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());

  const [isApplyFormOpen, setApplyFormOpen] = useState(false);
  const [applyingForJob, setApplyingForJob] = useState(null);

  const handleToggleDetails = (jobId) => {
    setSelectedJobId(prevId => (prevId === jobId ? null : jobId));
  };

  const handleToggleSave = (jobId) => {
    setSavedJobs(prevSaved => {
      const newSaved = new Set(prevSaved);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

   const handleOpenApplyForm = (job) => {
    setApplyingForJob(job);
    setApplyFormOpen(true);
  };

  const handleCloseApplyForm = () => {
    setApplyFormOpen(false);
    setTimeout(() => setApplyingForJob(null), 300);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Search and Filter Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Find Your Next Opportunity
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, company, or keyword..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        {/* Filter chips could go here */}
      </Box>

      {/* Job Postings List */}
      <Box>
        {jobPostings.map((job) => (
          <Paper key={job.id} elevation={2} sx={{ mb: 2, p: 2.5, borderRadius: 2, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar src={job.logo} sx={{ width: 50, height: 50 }} />
              </Grid>
              <Grid item xs>
                <Typography variant="h6">{job.title}</Typography>
                <Box display="flex" alignItems="center" gap={2} color="text.secondary" flexWrap="wrap">
                  <Box display="flex" alignItems="center"><Apartment fontSize="small" sx={{ mr: 0.5 }} /> {job.company}</Box>
                  <Box display="flex" alignItems="center"><LocationOn fontSize="small" sx={{ mr: 0.5 }} /> {job.location}</Box>
                </Box>
              </Grid>
              <Grid item>
                <IconButton onClick={() => handleToggleSave(job.id)}>
                  {savedJobs.has(job.id) ? <Bookmark color="primary" /> : <BookmarkBorder />}
                </IconButton>
              </Grid>
            </Grid>
            <Box sx={{ my: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={job.type} size="small" />
              <Chip label={job.model} size="small" variant="outlined" />
              <Chip icon={<MonetizationOn />} label={job.salary} size="small" variant="outlined" color="success" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Posted {job.postedDate}
              </Typography>
              <Box>
                <Button variant="text" size="small" onClick={() => handleToggleDetails(job.id)}>
                  {selectedJobId === job.id ? 'Hide Details' : 'View Details'}
                </Button>
                <Button 
                  variant="contained" 
                  size="small" 
                  sx={{ ml: 1 }}
                  onClick={() => handleOpenApplyForm(job)}
                >
                  Apply Now
                </Button>
              </Box>
            </Box>

            {/* Collapsible Details Section */}
            <Collapse in={selectedJobId === job.id} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ p: 1 }}>
                <Typography variant="body1" paragraph>{job.description}</Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Responsibilities</Typography>
                <List dense>
                  {job.responsibilities.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}><CheckIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>Qualifications</Typography>
                <List dense>
                  {job.qualifications.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}><CheckIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </Paper>
        ))}
      </Box>
      {applyingForJob && (
          <ApplyForm 
            open={isApplyFormOpen}
            onClose={handleCloseApplyForm}
            job={applyingForJob}
          />
      )}
    </Box>
  );
};

export default FindJobs;