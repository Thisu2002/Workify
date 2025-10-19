import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Chip
} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// API Configuration
const API_BASE = 'http://localhost:5000';

const getAuthToken = () => localStorage.getItem('token');
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json'
});

const tabOptions = [
  { label: "New", value: "new" },
  { label: "Pending", value: "pending" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
];

const InterviewsTest = () => {
    const [activeTab, setActiveTab] = useState("new");
    const [searchTerm, setSearchTerm] = useState('');
    
    // API Data State
    const [newInterviews, setNewInterviews] = useState([]);
    const [pendingInterviews, setPendingInterviews] = useState([]);
    
    // Loading and Error States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Modal States
    const [isNotifyModalOpen, setNotifyModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isNotifying, setIsNotifying] = useState(false);
    
    // Candidate confirmation modal states
    const [isCandidateModalOpen, setCandidateModalOpen] = useState(false);

    // API Functions
    const fetchNewInterviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE}/recruiter/interviews/new`, {
                headers: getAuthHeaders()
            });
            console.log('New interviews response:', response.data);
            setNewInterviews(response.data.interviews || []);
        } catch (err) {
            console.error('Error fetching new interviews:', err);
            setError('Failed to load new interviews');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingInterviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE}/recruiter/interviews/pending`, {
                headers: getAuthHeaders()
            });
            console.log('Pending interviews response:', response.data);
            setPendingInterviews(response.data.interviews || []);
        } catch (err) {
            console.error('Error fetching pending interviews:', err);
            setError('Failed to load pending interviews');
        } finally {
            setLoading(false);
        }
    };

    const notifyCandidate = async (jobId, interviewDate, startTime = '10:00', endTime = '11:00') => {
        try {
            setIsNotifying(true);
            const response = await axios.put(`${API_BASE}/recruiter/interviews/notify-candidates`, {
                jobId,
                interviewDate: interviewDate.format('YYYY-MM-DD'),
                startTime,
                endTime
            }, {
                headers: getAuthHeaders()
            });
            
            if (response.data.success) {
                await fetchNewInterviews();
                await fetchPendingInterviews();
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error notifying candidates:', err);
            setError('Failed to notify candidates');
            return false;
        } finally {
            setIsNotifying(false);
        }
    };

    // Load data when tab changes
    useEffect(() => {
        if (activeTab === 'new') {
            fetchNewInterviews();
        } else if (activeTab === 'pending') {
            fetchPendingInterviews();
        }
    }, [activeTab]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Filtering logic
    const filteredNewInterviews = newInterviews.filter(interview =>
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPendingInterviews = pendingInterviews.filter(interview =>
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Modal handlers
    const handleOpenNotifyModal = (interview) => {
        setSelectedInterview(interview);
        setNotifyModalOpen(true);
    };

    const handleCloseNotifyModal = () => {
        setNotifyModalOpen(false);
        setSelectedDate(null);
        setSelectedInterview(null);
    };

    // Candidate confirmation modal handlers
    const handleOpenCandidateModal = (interview) => {
        setSelectedInterview(interview);
        setCandidateModalOpen(true);
    };

    const handleCloseCandidateModal = () => {
        setCandidateModalOpen(false);
        setTimeout(() => setSelectedInterview(null), 300);
    };

    const handleProceedToInterviews = () => {
        alert(`Proceeding to interviews for ${selectedInterview.jobTitle}`);
        handleCloseCandidateModal();
    };

    const getConfirmationStatusColor = (status) => {
        if (status === 'Confirmed') {
            return 'success';
        }
        return 'warning';
    };

    const handleFinalNotify = async () => {
        if (!selectedDate) {
            alert('Please select a date before notifying candidates.');
            return;
        }
        
        const success = await notifyCandidate(selectedInterview._id, selectedDate);
        
        if (success) {
            alert(`Successfully notified candidates for ${selectedInterview.jobTitle} about their interview on ${dayjs(selectedDate).format('MMMM D, YYYY')}.`);
            handleCloseNotifyModal();
        } else {
            alert('Failed to notify candidates. Please try again.');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                {/* Header with Tabs and Search */}
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
                                className="application-tab" 
                            />
                        ))}
                    </Tabs>

                    <TextField
                        size="small"
                        placeholder="Search by Job Title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: '300px', '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                    />
                </Box>

                {/* Content for New Tab */}
                {activeTab === 'new' && (
                    <>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredNewInterviews.map((interview) => (
                                    <Grid item key={interview._id} xs={12} sm={6} md={4}>
                                        <Card sx={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 4,
                                            boxShadow: 3,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minWidth: 400,
                                            minHeight: 300,
                                        }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: '2',
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {interview.jobTitle}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {interview.round}
                                                </Typography>

                                                {/* Panel Section */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                    <GroupIcon color="action" />
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {interview.panel?.name || 'Panel not assigned'}
                                                    </Typography>
                                                </Box>

                                                {/* Panel Availability Section */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                    <EventAvailableIcon color="action" />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontStyle: interview.isWaitingForDates ? 'italic' : 'normal',
                                                            color: interview.isWaitingForDates ? 'text.secondary' : 'text.primary',
                                                        }}
                                                    >
                                                        {interview.panelAvailability}
                                                    </Typography>
                                                </Box>
                                            </CardContent>

                                            {/* Action Button */}
                                            <Box sx={{ p: 2, pt: 0 }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: '#0a2048',
                                                        '&:hover': {
                                                            backgroundColor: '#062a5eff',
                                                        },
                                                    }}
                                                    disabled={interview.isWaitingForDates || isNotifying}
                                                    onClick={() => handleOpenNotifyModal(interview)}
                                                >
                                                    {isNotifying ? 'Notifying...' : 'Notify Candidates'}
                                                </Button>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}

                {/* Content for Pending Tab */}
                {activeTab === 'pending' && (
                    <>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredPendingInterviews.map((interview) => (
                                    <Grid item key={interview._id} xs={12} sm={6} md={4}>
                                        <Card sx={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 4,
                                            boxShadow: 3,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minWidth: 400,
                                            minHeight: 300,
                                        }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: '2',
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {interview.jobTitle}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {interview.round}
                                                </Typography>

                                                {/* Panel Section */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                    <GroupIcon color="action" />
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {interview.panel?.name || 'Panel not assigned'}
                                                    </Typography>
                                                </Box>

                                                {/* Interview Date Section */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                    <EventAvailableIcon color="action" />
                                                    <Typography variant="body2">
                                                        {interview.interviewDate || 'Date pending'}
                                                    </Typography>
                                                </Box>

                                                {/* Application Count */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                    <Typography variant="body2">
                                                        <strong>{interview.applicationCount}</strong> Applications
                                                    </Typography>
                                                </Box>
                                            </CardContent>

                                            {/* Action Button */}
                                            <Box sx={{ p: 2, pt: 0 }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{
                                                        backgroundColor: '#0a2048',
                                                        '&:hover': {
                                                            backgroundColor: '#062a5eff',
                                                        },
                                                    }}
                                                    onClick={() => handleOpenCandidateModal(interview)}
                                                >
                                                    View Candidate Confirmation
                                                </Button>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}

                {/* Other tabs placeholder */}
                {(activeTab === 'scheduled' || activeTab === 'completed') && (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab - Coming Soon
                        </Typography>
                    </Box>
                )}

                {/* Notification Modal */}
                <Dialog open={isNotifyModalOpen} onClose={handleCloseNotifyModal} fullWidth maxWidth="xs">
                    <DialogTitle>Notify Candidates</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 2 }}>
                            Select the confirmed interview date for the <strong>{selectedInterview?.jobTitle}</strong> position. 
                            An email will be sent to all shortlisted candidates.
                        </DialogContentText>
                        <DatePicker
                            label="Interview Date"
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            disablePast
                            sx={{ width: '100%' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseNotifyModal}>Cancel</Button>
                        <Button
                            onClick={handleFinalNotify}
                            variant="contained"
                            disabled={!selectedDate || isNotifying}
                            sx={{ backgroundColor: '#052353' }}
                        >
                            {isNotifying ? 'Notifying...' : 'Notify Candidates'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Candidate Confirmation Modal */}
                <Dialog open={isCandidateModalOpen} onClose={handleCloseCandidateModal} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Candidate Confirmation for: <strong>{selectedInterview?.jobTitle}</strong>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedInterview?.candidates && selectedInterview.candidates.length > 0 ? (
                            <List>
                                {selectedInterview.candidates.map((candidate) => (
                                    <ListItem key={candidate.id} disableGutters>
                                        <ListItemText
                                            primary={candidate.name}
                                            secondary={
                                                <>
                                                    {candidate.email}
                                                    {candidate.phone && (
                                                        <><br />{candidate.phone}</>
                                                    )}
                                                </>
                                            }
                                        />
                                        <Chip
                                            label={candidate.status}
                                            color={getConfirmationStatusColor(candidate.status)}
                                            size="small"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography>No candidates to display.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCandidateModal}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleProceedToInterviews}
                            sx={{
                                backgroundColor: '#0a2048',
                                '&:hover': {
                                    backgroundColor: '#062a5eff',
                                },
                            }}
                        >
                            Proceed to Interviews
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default InterviewsTest;