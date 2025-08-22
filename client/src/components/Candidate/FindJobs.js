import React, { useState, useMemo, useEffect} from 'react';
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
  InputAdornment,
  Stack,
  CircularProgress
} from "@mui/material";
import { 
  BookmarkBorder, 
  Bookmark,
  LocationOn,
  Apartment,
  Search,
  ArrowBack
} from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import ApplyForm from './ApplyForm';
import axios from 'axios';



const FindJobs = () => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  
  // NEW state to manage the view: 'top', 'explore', or 'saved'
  const [viewMode, setViewMode] = useState('top');
  const [searchTerm, setSearchTerm] = useState('');

  // NEW states for fetching data from the backend
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isApplyFormOpen, setApplyFormOpen] = useState(false);
  const [applyingForJob, setApplyingForJob] = useState(null);

  // FETCH DATA using useEffect
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Make sure the URL matches your backend endpoint
        const response = await axios.get('http://localhost:5000/api/jobs/open');
        setAllJobs(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Could not load job postings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty dependency array means this runs once on component mount

  const handleToggleDetails = (jobId) => {
    setSelectedJobId(prevId => (prevId === jobId ? null : jobId));
  };

  const handleToggleSave = (jobId) => {
    setSavedJobs(prevSaved => {
      const newSaved = new Set(prevSaved);
      if (newSaved.has(jobId)) newSaved.delete(jobId);
      else newSaved.add(jobId);
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
  
  // UPDATED logic to determine which jobs to show based on the view mode and search term
  const displayedJobs = useMemo(() => {
    const sourceJobs = allJobs;
    switch (viewMode) {
      case 'top':
        return sourceJobs.slice(0, 5);
      case 'saved':
        return sourceJobs.filter(job => savedJobs.has(job.id));
      case 'explore':
        if (!searchTerm) return sourceJobs;
        return sourceJobs.filter(job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  }, [viewMode, searchTerm, savedJobs, allJobs]);

  const titles = {
    top: 'Top job picks for you',
    explore: 'Explore All Opportunities',
    saved: 'Your Saved Jobs',
  };

  // NEW: Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Jobs...</Typography>
      </Box>
    );
  }

  // NEW: Render error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search and Filter Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {titles[viewMode]}
          </Typography>
          
          {/* UPDATED Button Group */}
          <Stack direction="row" spacing={1}>
            {viewMode === 'top' ? (
              <>
                <Button 
                  variant="contained" 
                  onClick={() => setViewMode('explore')}
                  sx={{ backgroundColor: '#0a2048', color: '#ffffff', '&:hover': { backgroundColor: '#1a3668' } }}
                >
                  Explore More Jobs
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setViewMode('saved')}
                  sx={{
                    backgroundColor: '#ffffff',
                    borderColor: '#0a2048',
                    color: '#0a2048',
                    '&:hover': {
                      backgroundColor: 'rgba(10, 32, 72, 0.04)',
                      borderColor: '#0a2048'
                    }
                  }}
                >
                  Saved Jobs
                </Button></>
            ) : (
              <Button variant="contained" startIcon={<ArrowBack />} onClick={() => setViewMode('top')} sx={{ backgroundColor: '#0a2048', color: '#ffffff', '&:hover': { backgroundColor: '#1a3668' } }}>
                Back to Top Jobs
              </Button>
            )}
          </Stack>
        </Box>

        {/* Search Bar now only shows in 'explore' mode */}
        {viewMode === 'explore' && (
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by title, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start"><Search /></InputAdornment>
                    ),
                }}
            />
        )}
      </Box>

      {/* Job Postings List */}
      <Box>
        {displayedJobs.length > 0 ? (
          displayedJobs.map((job) => (
            <Paper key={job.id} elevation={2} sx={{ mb: 2, p: 2.5, borderRadius: 2, transition: 'box-shadow 0.3s,transform 0.2s','&:hover': { boxShadow: 6, transform: 'translateY(-4px)' } }}>
              {/* Job Card content remains the same */}
              <Grid container spacing={2} alignItems="center">
                <Grid item><Avatar src={job.logo} sx={{ width: 50, height: 50 }} /></Grid>
                <Grid item xs>
                  <Typography variant="h6">{job.title}</Typography>
                  <Box display="flex" alignItems="center" gap={2} color="text.secondary" flexWrap="wrap">
                    <Box display="flex" alignItems="center"><Apartment fontSize="small" sx={{ mr: 0.5 }} /> {job.company}</Box>
                    <Box display="flex" alignItems="center"><LocationOn fontSize="small" sx={{ mr: 0.5 }} /> {job.location}</Box>
                  </Box>
                </Grid>
                <Grid item><IconButton onClick={() => handleToggleSave(job.id)}>{savedJobs.has(job.id) ? <Bookmark color="primary" /> : <BookmarkBorder />}</IconButton></Grid>
              </Grid>
              <Box sx={{ my: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={job.type} size="small" />
                <Chip label={job.model} size="small" variant="outlined" />
                <Chip label={job.salary} size="small" variant="outlined" color="success" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Posted {job.postedDate}</Typography>
                <Box>
                  <Button variant="text" size="small" onClick={() => handleToggleDetails(job.id)}>{selectedJobId === job.id ? 'Hide Details' : 'View Details'}</Button>
                  <Button variant="contained" size="small" sx={{ ml: 1 }} onClick={() => handleOpenApplyForm(job)}>Apply Now</Button>
                </Box>
              </Box>
              <Collapse in={selectedJobId === job.id} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 1 }}>
                  <Typography variant="body1" paragraph>{job.description}</Typography>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Responsibilities</Typography>
                  <List dense>{job.responsibilities.map((item, index) => (<ListItem key={index} sx={{ py: 0 }}><ListItemIcon sx={{ minWidth: 32 }}><CheckIcon fontSize="small" color="primary" /></ListItemIcon><ListItemText primary={item} /></ListItem>))}</List>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>Qualifications</Typography>
                  <List dense>{job.qualifications.map((item, index) => (<ListItem key={index} sx={{ py: 0 }}><ListItemIcon sx={{ minWidth: 32 }}><CheckIcon fontSize="small" color="primary" /></ListItemIcon><ListItemText primary={item} /></ListItem>))}</List>
                </Box>
              </Collapse>
            </Paper>
          ))
        ) : (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary">
              {viewMode === 'saved' ? "You haven't saved any jobs yet." : "No jobs found."}
            </Typography>
            {viewMode === 'saved' && (
              <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                Click the bookmark icon <BookmarkBorder fontSize="small" /> on a job to save it for later.
              </Typography>
            )}
          </Paper>
        )}
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