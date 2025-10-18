import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  Stack,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Description as CvIcon,
  FactCheck as QuizIcon,
  Feedback as FeedbackIcon,
  DoNotDisturbOn as RejectionIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import axios from "axios";

import "../../styles/Recruiter.css";

const tabOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "1_shortlisted" },
  { label: "Hired", value: "1_selected" },
  { label: "Rejected", value: "1_rejected" },
];

// Get base URL 
const API_BASE_URL = 'http://localhost:5000';

const Applications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Job filter states
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('all');

  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [selectedCvUrl, setSelectedCvUrl] = useState('');

  // Fetch job posts on component mount
  useEffect(() => {
    fetchJobPosts();
  }, []);

  // Fetch data based on active tab and selected job
  useEffect(() => {
    fetchData();
  }, [activeTab, selectedJobId]);

  const fetchJobPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get(`${API_BASE_URL}/recruiter/jobPosts`, config);
      console.log('Fetched job posts:', response.data);
      setJobPosts(response.data || []);
    } catch (err) {
      console.error('Error fetching job posts:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (activeTab === 'all') {
        // Fetch unique candidates for "All" tab
        let url = `${API_BASE_URL}/recruiter/candidates/all`;
        if (selectedJobId && selectedJobId !== 'all') {
          url += `?jobId=${selectedJobId}`;
        }
        const response = await axios.get(url, config);
        console.log('Fetched candidates:', response.data);
        setCandidates(response.data.candidates || []);
        setApplications([]);
      } else {
        // Fetch applications filtered by status for other tabs
        let url = `${API_BASE_URL}/recruiter/candidates/applications?status=${activeTab}`;
        if (selectedJobId && selectedJobId !== 'all') {
          url += `&jobId=${selectedJobId}`;
        }
        const response = await axios.get(url, config);
        console.log('Fetched applications:', response.data);
        setApplications(response.data.applications || []);
        setCandidates([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filtering logic for "All" tab (candidates)
  const filteredCandidates = candidates.filter(candidate =>
    `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtering logic for other tabs (applications)
  const filteredApplications = applications.filter(app =>
    `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActivityModal = (applicant) => {
    setSelectedApplicant(applicant);
    setActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setActivityModalOpen(false);
    setTimeout(() => setSelectedApplicant(null), 300); 
  };

  const getStatusChipColor = (status) => {
    if (!status) return 'default';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('selected') || statusLower.includes('hired')) {
      return 'success';
    } else if (statusLower.includes('rejected')) {
      return 'error';
    } else if (statusLower.includes('shortlisted')) {
      return 'warning';
    } else if (statusLower.includes('completed')) {
      return 'info';
    }
    return 'primary';
  };

  const getCandidateStatusChipColor = (status) => {
    if (!status) return 'default';
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('selected')) {
      return 'success';
    } else if (statusLower.includes('rejected')) {
      return 'error';
    } else if (statusLower.includes('shortlisted') || statusLower.includes('interview')) {
      return 'warning';
    } else if (statusLower === 'new') {
      return 'info';
    }
    return 'primary';
  };

  const formatStatus = (status) => {
    if (!status) return 'New';
    
    // Convert status like "1_shortlisted" to "Shortlisted (Round 1)"
    const parts = status.split('_');
    if (parts.length === 2) {
      const round = parts[0];
      const statusName = parts[1].replace(/([A-Z])/g, ' $1').trim();
      return `${statusName.charAt(0).toUpperCase() + statusName.slice(1)} (Round ${round})`;
    }
    
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleOpenCvModal = (applicant) => {
    setSelectedApplicant(applicant); 
    // Assuming CV URL will be available from backend
    setSelectedCvUrl(applicant.cvUrl || '');
    setCvModalOpen(true);
  };
  
  const handleCloseCvModal = () => {
    setCvModalOpen(false);
    setSelectedCvUrl('');
    setSelectedApplicant(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Format round status array into readable format
  const formatRoundStatus = (roundStatus) => {
    if (!roundStatus || !Array.isArray(roundStatus) || roundStatus.length === 0) {
      return null;
    }

    return roundStatus.map((round, index) => {
      const roundNumber = round.round_number || index + 1;
      const result = round.round_result || 'pending';
      const feedback = round.round_feedback || '';
      
      // Determine color based on result
      let resultColor = 'default';
      let resultText = result;
      
      if (result === 'passed' || result === 'selected') {
        resultColor = 'success';
        resultText = '✓ Passed';
      } else if (result === 'failed' || result === 'rejected') {
        resultColor = 'error';
        resultText = '✗ Failed';
      } else if (result === 'pending') {
        resultColor = 'warning';
        resultText = '⏳ Pending';
      }

      return {
        roundNumber,
        result,
        resultText,
        resultColor,
        feedback
      };
    });
  };

  // Render Candidate Card (for "All" tab)
  const renderCandidateCard = (candidate, idx) => (
    <Card key={idx} className="applicant-card" sx={{ borderRadius: 4, boxShadow: 3, p: 3, display: "flex", alignItems: "flex-start", background: "white" }}>
      <Avatar 
        src={candidate.avatarUrl ? `${API_BASE_URL}${candidate.avatarUrl}` : ''} 
        sx={{ width: 60, height: 60, mr: 3 }} 
      />
      <Box flex={1}>
        {/* --- Top Section: Name, Title, and Status --- */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {candidate.firstName} {candidate.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {candidate.experience?.years || 0} years experience
            </Typography>
          </Box>
          <Chip
            label={formatStatus(candidate.overallStatus)}
            color={getCandidateStatusChipColor(candidate.overallStatus)}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* --- Contact Info --- */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {candidate.email} • {candidate.phone}
        </Typography>

        {/* --- Skills Section --- */}
        {candidate.skills && candidate.skills.length > 0 && (
          <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {candidate.skills.slice(0, 5).map((skill, idx) => (
              <Chip key={idx} label={skill} size="small" variant="outlined" />
            ))}
            {candidate.skills.length > 5 && (
              <Chip label={`+${candidate.skills.length - 5} more`} size="small" variant="outlined" />
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* --- Bottom Section: Totals and Actions --- */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            <strong>{candidate.totalApplications}</strong> Total Applications
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleOpenCvModal(candidate)}
            >
              View CV
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleActivityModal(candidate)}
              sx={{ background: "#052353ff", color: "white", fontWeight: 200 }}
            >
              View Activity
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );

  // Render Application Card (for filtered tabs)
  const renderApplicationCard = (app, idx) => (
    <Card key={idx} className="applicant-card" sx={{ borderRadius: 4, boxShadow: 3, p: 3, display: "flex", alignItems: "flex-start", background: "white" }}>
      <Avatar 
        src={app.avatarUrl ? `${API_BASE_URL}${app.avatarUrl}` : ''} 
        sx={{ width: 60, height: 60, mr: 3 }} 
      />
      <Box flex={1}>
        {/* --- Top Section: Name, Job Title, and Status --- */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {app.firstName} {app.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Applied for: <strong>{app.jobTitle}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {app.experience?.years || 0} years experience
            </Typography>
          </Box>
          <Chip
            label={formatStatus(app.currentStatus)}
            color={getStatusChipColor(app.currentStatus)}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* --- Contact Info --- */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {app.email} • {app.phone}
        </Typography>

        {/* --- Application Details --- */}
        <Box sx={{ my: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {app.quizScore !== undefined && (
            <Chip 
              icon={<QuizIcon />}
              label={`Quiz: ${app.quizScore}%`} 
              size="small" 
              color="secondary" 
              variant="outlined" 
            />
          )}
          {app.matchScore !== undefined && (
            <Chip 
              label={`Match: ${app.matchScore}%`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          )}
          <Chip 
            label={`Applied: ${formatDate(app.appliedDate)}`} 
            size="small" 
            variant="outlined" 
          />
        </Box>

        {/* --- Skills Section --- */}
        {app.skills && app.skills.length > 0 && (
          <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {app.skills.slice(0, 5).map((skill, idx) => (
              <Chip key={idx} label={skill} size="small" variant="outlined" />
            ))}
            {app.skills.length > 5 && (
              <Chip label={`+${app.skills.length - 5} more`} size="small" variant="outlined" />
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* --- Bottom Section: Actions --- */}
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenCvModal(app)}
          >
            View CV
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleActivityModal({ ...app, applications: [app] })}
            sx={{ background: "#052353ff", color: "white", fontWeight: 200 }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box>
      <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          mb: 3
        }}> 

        <Tabs
            value={activeTab}
            onChange={handleTabChange}
            className="application-tabs"
          >
          {tabOptions.map((tab) => (
            <Tab 
              key={tab.value} 
              label={tab.label} 
              value={tab.value}
              className="application-tab" />
          ))}
        </Tabs>

        <Box display="flex" gap={2} alignItems="center">
          {/* Job Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="job-filter-label">Filter by Job</InputLabel>
            <Select
              labelId="job-filter-label"
              id="job-filter"
              value={selectedJobId}
              label="Filter by Job"
              onChange={(e) => setSelectedJobId(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="all">All Jobs</MenuItem>
              {jobPosts.map((job) => (
                <MenuItem key={job._id} value={job._id}>
                  {job.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px', backgroundColor: '#96BEC5' }}
          />
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
          <CircularProgress />
        </Box>
      )}

      {/* Content */}
      {!loading && (
        <Box>
          {activeTab === "all" && (
            <Stack spacing={3}>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate, idx) => renderCandidateCard(candidate, idx))
              ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center" py={5}>
                  No candidates found
                </Typography>
              )}
            </Stack>
          )}

          {activeTab !== "all" && (
            <Stack spacing={3}>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app, idx) => renderApplicationCard(app, idx))
              ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center" py={5}>
                  No applications found for this status
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      )}

      {/* CV Modal */}
      <Dialog open={cvModalOpen} onClose={handleCloseCvModal} maxWidth="md" fullWidth>
        <DialogTitle>CV of {selectedApplicant?.firstName} {selectedApplicant?.lastName}</DialogTitle>
        <DialogContent sx={{ height: '75vh', p: 0 }}>
          {selectedCvUrl ? (
            <iframe
              src={selectedCvUrl}
              title={`CV of ${selectedApplicant?.firstName} ${selectedApplicant?.lastName}`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          ) : (
            <Typography sx={{ p: 3, textAlign: 'center' }}>
              CV not available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCvModal} variant="contained">
            Close
          </Button>
        </DialogActions>    
      </Dialog>     

      {/* Activity History Modal */}
      <Dialog open={activityModalOpen} onClose={handleCloseActivityModal} maxWidth="md" fullWidth>
        <DialogTitle>Activity History for {selectedApplicant?.firstName} {selectedApplicant?.lastName}</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'grey.100' }}>
          {selectedApplicant?.applications && selectedApplicant.applications.length > 0 ? (
            <Stack spacing={2}>
              {selectedApplicant.applications.map((activity, index) => (
                <Card key={index} sx={{ p: 2, borderRadius: 2 }}>
                  {/* Card Header: Job Title, Date, and Status */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{activity.jobTitle}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applied on: {formatDate(activity.appliedDate)}
                      </Typography>
                    </Box>
                    <Chip 
                      label={formatStatus(activity.currentStatus || activity.status)} 
                      color={getStatusChipColor(activity.currentStatus || activity.status)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* Card Body: Details */}
                  <Stack spacing={1.5}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <QuizIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      Quiz Score: <b style={{ marginLeft: '8px' }}>{activity.quizScore || 'N/A'}</b>
                    </Typography>

                    {activity.matchScore !== undefined && (
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        Match Score: <b style={{ marginLeft: '8px' }}>{activity.matchScore}%</b>
                      </Typography>
                    )}

                    {/* Round Status Info */}
                    {activity.roundStatus && Array.isArray(activity.roundStatus) && activity.roundStatus.length > 0 && (
                      <Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, mt: 1 }}>
                          Interview Rounds:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {formatRoundStatus(activity.roundStatus)?.map((round, idx) => (
                            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Chip 
                                label={`Round ${round.roundNumber}: ${round.resultText}`}
                                color={round.resultColor}
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                              />
                              {round.feedback && (
                                <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 200, fontSize: '0.7rem' }}>
                                  {round.feedback}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Interview Feedback - if available from backend later */}
                    {activity.interviewFeedback && (
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <FeedbackIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                        <span><b>Interview Feedback:</b> {activity.interviewFeedback}</span>
                      </Typography>
                    )}

                    {/* Rejection Reason - if available */}
                    {activity.currentStatus?.includes('rejected') && activity.rejectionReason && (
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <RejectionIcon sx={{ mr: 1, mt: 0.5, color: 'error.main' }} />
                        <span><b>Reason for Rejection:</b> {activity.rejectionReason}</span>
                      </Typography>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography sx={{ p: 3, textAlign: 'center' }}>
              No past activity found for this candidate.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActivityModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog> 
    </Box>
  );
};

export default Applications;
