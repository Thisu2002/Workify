import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Button
} from "@mui/material";
import { AccessTime, CheckCircle, Cancel, Autorenew, HourglassEmpty } from "@mui/icons-material";
import axios from 'axios';

const ApplicationTracker = ({ trackerTab, setTrackerTab }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications from backend
  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view applications');
        return;
      }

      console.log('Fetching applications...');
      
      const response = await axios.get('http://localhost:5000/api/applicationTracker/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Applications response:', response.data);
      
      if (response.data.success) {
        setApplications(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Error loading applications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Map database status to tab index based on your requirements
  const getTabFromStatus = (status) => {
    if (status === 'new') return 0; // Pending
    if (status.includes('interviewPending')) return 1; // Shortlisted
    if (status.includes('interviewScheduled')) return 2; // Ongoing
    if (status === 'rejected') return 3; // Rejected
    return 0; // Default to Pending
  };

  // Filter applications by tab
  const getFilteredApplications = (tabIndex) => {
    switch(tabIndex) {
      case 0: // Pending (new applications)
        return applications.filter(app => app.current_status === 'new');
      case 1: // Shortlisted (interview pending)
        return applications.filter(app => 
          app.current_status.includes('interviewPending')
        );
      case 2: // Ongoing (interview scheduled)
        return applications.filter(app => 
          app.current_status.includes('interviewScheduled')
        );
      case 3: // Rejected
        return applications.filter(app => app.current_status === 'rejected');
      default:
        return [];
    }
  };

  // Get user-friendly status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'new': return 'Pending Review';
      case '1_interviewPending': return 'Round 1 Shortlisted';
      case '1_interviewScheduled': return 'Round 1 Scheduled';
      case '2_interviewPending': return 'Round 2 Shortlisted';
      case '2_interviewScheduled': return 'Round 2 Scheduled';
      case '3_interviewPending': return 'Final Round Shortlisted';
      case '3_interviewScheduled': return 'Final Round Scheduled';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status, tabIndex) => {
    switch(tabIndex) {
      case 0: return "warning";
      case 1: return "success";
      case 2: return "info";
      case 3: return "error";
      default: return "default";
    }
  };

  const filteredApplications = getFilteredApplications(trackerTab);

  return (
    <Box
      sx={{
        mt: 4,
        mb: 2,
        maxWidth: 1300,
        mx: "auto",
        p: 3,
        borderRadius: '28px',
        boxShadow: 2,
        background: "linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)"
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Application Tracker
        </Typography>
        <Button variant="outlined" onClick={fetchApplications} disabled={isLoading}>
          {isLoading ? <CircularProgress size={20} /> : 'Refresh'}
        </Button>
      </Box>

      <Tabs
        value={trackerTab}
        onChange={(_, newValue) => setTrackerTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          mb: 3,
          '& .MuiTab-root': { fontWeight: 500, fontSize: 16 },
        }}
      >
        <Tab 
          icon={<HourglassEmpty color="warning" />} 
          iconPosition="start" 
          label={`Pending (${getFilteredApplications(0).length})`}
        />
        <Tab 
          icon={<CheckCircle color="success" />} 
          iconPosition="start" 
          label={`Shortlisted (${getFilteredApplications(1).length})`}
        />
        <Tab 
          icon={<Autorenew color="info" />} 
          iconPosition="start" 
          label={`Ongoing (${getFilteredApplications(2).length})`}
        />
        <Tab 
          icon={<Cancel color="error" />} 
          iconPosition="start" 
          label={`Rejected (${getFilteredApplications(3).length})`}
        />
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={fetchApplications} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      {/* Applications List */}
      {!isLoading && !error && (
        <List>
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <ListItem
                key={app._id}
                divider
                sx={{
                  bgcolor: trackerTab === 0
                    ? 'warning.50'
                    : trackerTab === 1
                    ? 'success.50'
                    : trackerTab === 2
                    ? 'info.50'
                    : 'error.50',
                  borderRadius: 2,
                  mb: 1,
                  boxShadow: 1,
                }}
                secondaryAction={
                  <Box>
                    <Chip
                      label={getStatusLabel(app.current_status)}
                      color={getStatusColor(app.current_status, trackerTab)}
                      size="small"
                      sx={{ fontWeight: 500, mb: 1 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Applied: {new Date(app.applied_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              >
                <ListItemIcon>
                  {trackerTab === 0 && <HourglassEmpty color="warning" />}
                  {trackerTab === 1 && <CheckCircle color="success" />}
                  {trackerTab === 2 && <Autorenew color="info" />}
                  {trackerTab === 3 && <Cancel color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {app.job?.company_name || 'Unknown Company'}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {app.job?.position || app.job?.job_title || 'Unknown Position'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Match Score: {app.match_score}% • Round: {app.current_round || 1}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No applications in this category.
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      )}
    </Box>
  );
};

export default ApplicationTracker;