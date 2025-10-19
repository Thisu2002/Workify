import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Avatar,
    AvatarGroup,
    Tooltip
} from "@mui/material";

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Import dayjs

const tabOptions = [
  { label: "New", value: "new" },
  { label: "Pending", value: "pending" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
];

const newInterviewsData = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    round: "Round 1: Technical Screening",
    panel: "Technical Panel A",
    panelAvailability: "Waiting for available dates" 
  },
  {
    id: 2,
    jobTitle: "Product Designer",
    round: "Round 2: Portfolio Review",
    panel: "Design Panel B",
    panelAvailability: "Jul 25, 26, 27" 
  },
  {
    id: 3,
    jobTitle: "Backend Developer",
    round: "Round 1: Technical Screening",
    panel: "Technical Panel C",
    panelAvailability: "Aug 5,6"
  },
   {
    id: 4,
    jobTitle: "Project Management Lead",
    round: "Round 3: Final HR Round",
    panel: "HR Panel A",
    panelAvailability: "Waiting for available dates"
  },
];

const pendingInterviewsData = [
  {
    id: 1,
    jobTitle: "Product Designer",
    round: "Round 2: Portfolio Screening",
    panel: "Design Panel B",
    panelMembers: [
      { name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Peter Jones', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    ],
    interviewDate: "Jul 25",
    applicationCount: 10,
    candidates: [
      { id: 101, name: 'Kasun Fernando', email: 'kasunf@gmail.com', status: 'Confirmed' },
      { id: 102, name: 'Avishka Desilva', email: 'aviska12@gmail.com', status: 'Confirmed' },
      { id: 103, name: 'Charlie Brown', email: 'charlie.b@gmail.com', status: 'Not Replied' },
      { id: 104, name: 'Dilshani Peiris', email: 'dilshani.p@gmail.com', status: 'Not Replied' },
      { id: 105, name: 'Lakshan Perera', email: 'lakshan.p@gmail.com', status: 'Not Replied' },
      { id: 106, name: 'Frnaca Nishadi', email: 'franca@gmail.com', status: 'Confirmed' },
      { id: 107, name: 'Malith Silva', email: 'malith2@gmail.com', status: 'Confirmed' },
      { id: 108, name: 'Cathy Vaas', email: 'cathy.v@gmail.com', status: 'Not Replied' },
      { id: 109, name: 'Heshani Dias', email: 'heshani.p@gmail.com', status: 'Not Replied' },
      { id: 110, name: 'Pawan Fernando', email: 'pawan.p@gmail.com', status: 'Not Replied' },
    ]
  },
  {
    id: 2,
    jobTitle: "Backend Developer",
    round: "Round 1: Technical Screening",
    panel: "Technical Panel C",
    interviewDate: "Aug 5",
    applicationCount: 5,
    candidates: [
      { id: 201, name: 'Diana Prince', email: 'diana.p@email.com', status: 'Confirmed' },
      { id: 202, name: 'Eve Adams', email: 'eve.a@email.com', status: 'Confirmed' },
    ]
  }
];

const scheduledInterviewsData = [
  {
    id: 1,
    jobTitle: "Product Designer",
    round: "Round 2: Portfolio Screening",
    panel: "Design Panel B",
    panelMembers: [
      { name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Peter Jones', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    ],
    interviewDate: "Jul 25",
    applicationCount: 10,
    candidates: [
      { id: 101, name: 'Kasun Fernando', email: 'kasunf@gmail.com', status: 'Confirmed' },
      { id: 102, name: 'Avishka Desilva', email: 'aviska12@gmail.com', status: 'Confirmed' },
      { id: 103, name: 'Charlie Brown', email: 'charlie.b@gmail.com', status: 'Confirmed' },
      { id: 104, name: 'Dilshani Peiris', email: 'dilshani.p@gmail.com', status: 'Not Replied' },
      { id: 105, name: 'Lakshan Perera', email: 'lakshan.p@gmail.com', status: 'Confirmed' },
      { id: 106, name: 'Frnaca Nishadi', email: 'franca@gmail.com', status: 'Confirmed' },
      { id: 107, name: 'Malith Silva', email: 'malith2@gmail.com', status: 'Confirmed' },
      { id: 108, name: 'Cathy Vaas', email: 'cathy.v@gmail.com', status: 'Confirmed' },
      { id: 109, name: 'Heshani Dias', email: 'heshani.p@gmail.com', status: 'Not Replied' },
      { id: 110, name: 'Pawan Fernando', email: 'pawan.p@gmail.com', status: 'Not Replied' },
    ]
  },
  {
    id: 2,
    jobTitle: "Backend Developer",
    round: "Round 1: Technical Screening",
    panel: "Technical Panel C",
    interviewDate: "Aug 5",
    applicationCount: 5,
    candidates: [
      { id: 201, name: 'Diana Prince', email: 'diana.p@email.com', status: 'Confirmed' },
      { id: 202, name: 'Eve Adams', email: 'eve.a@email.com', status: 'Confirmed' },
    ]
  }
];

const completedInterviewsData = [
  {
    id: 1,
    jobTitle: "Product Designer",
    round: "Round 2: Portfolio Screening",
    panel: "Design Panel B",
    interviewDate: "Jul 01, 2025",
    applicationCount: 10,
    candidates: [
      { id: 101, name: 'Kasun Fernando', email: 'kasunf@gmail.com', status: 'Confirmed', interviewStatus: 'Failed', feedback: 'Struggled with the system design question. Lacks experience in large-scale applications.' },
      { id: 102, name: 'Avishka Desilva', email: 'aviska12@gmail.com', status: 'Confirmed', interviewStatus: 'Passed', feedback: 'Amazing portfolio. Her design thinking process is very mature.' },
      { id: 103, name: 'Charlie Brown', email: 'charlie.b@gmail.com', status: 'Confirmed', interviewStatus: 'On Hold', feedback: 'Good candidate, but we want to compare against others before making a final decision.' },
      { id: 104, name: 'Dilshani Peiris', email: 'dilshani.p@gmail.com', status: 'Not Replied', interviewStatus: 'Passed', feedback: null },
      { id: 105, name: 'Lakshan Perera', email: 'lakshan.p@gmail.com', status: 'Confirmed', interviewStatus: 'Passed', feedback: 'Strong fundamentals, good communication. Ready for the next round.' },
      { id: 106, name: 'Frnaca Nishadi', email: 'franca@gmail.com', status: 'Confirmed', interviewStatus: 'Passed', feedback: 'Excellent problem-solving skills and deep knowledge of React hooks. A clear pass.' },
      { id: 107, name: 'Malith Silva', email: 'malith2@gmail.com', status: 'Confirmed', interviewStatus: 'Failed', feedback: null },
      { id: 108, name: 'Cathy Vaas', email: 'cathy.v@gmail.com', status: 'Confirmed', interviewStatus: 'On Hold', feedback: null },
      { id: 109, name: 'Heshani Dias', email: 'heshani.p@gmail.com', status: 'Not Replied', interviewStatus: 'Passed', feedback: null },
      { id: 110, name: 'Pawan Fernando', email: 'pawan.p@gmail.com', status: 'Not Replied', interviewStatus: 'Failed', feedback: null },
    ]
  },
  {
    id: 2,
    jobTitle: "Backend Developer",
    round: "Round 1: Technical Screening",
    panel: "Technical Panel C",
    interviewDate: "May 5, 2025",
    applicationCount: 5,
    candidates: [
      { id: 201, name: 'Diana Prince', email: 'diana.p@email.com', status: 'Confirmed', interviewStatus: 'Passed', feedback: 'Excellent problem-solving skills and deep knowledge of React hooks. A clear pass.' },
      { id: 202, name: 'Eve Adams', email: 'eve.a@email.com', status: 'Confirmed', interviewStatus: 'Passed', feedback: 'Strong fundamentals, good communication. Ready for the next round.' },
    ]
  },
  {
    id: 3,
    jobTitle: "Project Management Lead",
    round: "Round 1: Technical Screening",
    panel: "Technical Panel A",
    interviewDate: "Apr 3, 2025",
    applicationCount: 5,
    candidates: [
      { id: 201, name: 'Diana Prince', email: 'diana.p@email.com', status: 'Confirmed' },
      { id: 202, name: 'Eve Adams', email: 'eve.a@email.com', status: 'Confirmed' },
    ]
  }
];

const Interviews = () => {
    const [activeTab, setActiveTab] = useState("new");
    const [searchTerm, setSearchTerm] = useState('');
    const [interviewData, setInterviewData] = useState({
        new: [],
        pending: [],
        scheduled: [],
        completed: []
    });
    const [loading, setLoading] = useState(true);

    const [isNotifyModalOpen, setNotifyModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); 

    const [isCandidateModalOpen, setCandidateModalOpen] = useState(false);

    const [completedInterviews, setCompletedInterviews] = useState(completedInterviewsData);
    const [viewingInterviewDetails, setViewingInterviewDetails] = useState(null); // Will hold the selected interview object
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [selectedCandidateFeedback, setSelectedCandidateFeedback] = useState(null);

    // Fetch interview data from API
    useEffect(() => {
        fetchInterviewData();
    }, []);

    const fetchInterviewData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get('http://localhost:5000/recruiter/interviews', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setInterviewData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching interview data:', error);
            // Keep using mock data as fallback
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Filtering logic based on API data
    const filteredNewInterviews = interviewData.new.filter(interview =>
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPendingInterviews = interviewData.pending.filter(interview =>
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredScheduledInterviews = interviewData.scheduled.filter(interview =>
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCompltedInterviews = interviewData.completed.filter(interview =>
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleOpenNotifyModal = (interview) => {
        setSelectedInterview(interview);
        setNotifyModalOpen(true);
    };

    const handleCloseNotifyModal = () => {
        setNotifyModalOpen(false);
        setSelectedDate(null); // Reset date on close
        setSelectedInterview(null);
    };

    const handleFinalNotify = async () => {
        if (!selectedDate) {
            alert('Please select a date before notifying candidates.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post('http://localhost:5000/recruiter/interviews/notify-candidates', {
                jobId: selectedInterview.id,
                finalDate: selectedDate.toISOString()
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                alert(`Successfully notified ${response.data.updatedCandidates} candidates for ${selectedInterview.jobTitle} about their interview on ${dayjs(selectedDate).format('MMMM D, YYYY')}.`);
                
                // Refresh the interview data to reflect changes
                await fetchInterviewData();
                
                handleCloseNotifyModal();
            }
        } catch (error) {
            console.error('Error notifying candidates:', error);
            alert('Failed to notify candidates. Please try again.');
        }
    };

    const handleViewFeedbacks = (interview) => {
        setViewingInterviewDetails(interview);
    };

    const handleBackToGrid = () => {
        setViewingInterviewDetails(null);
    };

    const handleOpenFeedbackModal = (candidate) => {
        setSelectedCandidateFeedback(candidate);
        setFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setFeedbackModalOpen(false);
        setTimeout(() => setSelectedCandidateFeedback(null), 300);
    };
    
    const handleProceedToNextRound = () => {
        alert(`Proceeding to the next round for: ${viewingInterviewDetails.jobTitle}. This would create a new entry in the "Pending" tab.`);
        handleBackToGrid(); // Go back to the grid view after action
    };

    const getInterviewStatusColor = (status) => {
        if (status === 'Passed') return 'success';
        if (status === 'Failed') return 'error';
        if (status === 'On Hold') return 'warning';
        return 'default';
    };
  
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
            {/* Header with Tabs and Search Bar */}
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

            {/* Content for the "New" Tab */}
            {activeTab === 'new' && (
                <>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <Typography>Loading interviews...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredNewInterviews.map((interview) => {
                                // Determine if the button should be disabled based on current_status and availability
                                const isWaitingForDates = interview.panelAvailability === "Waiting for available dates" || 
                                                        interview.currentStatus?.includes('panelRequested');
                                const isButtonEnabled = interview.currentStatus?.includes('panelConfirmed') && 
                                                      interview.panelAvailability !== "Waiting for available dates";

                                return (
                                <Grid item key={interview.id} xs={12} sm={6} md={4}>
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

                                            {/* Panel Members Section (no changes here) */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                <GroupIcon color="action" />
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {interview.panel}
                                                </Typography>
                                            </Box>

                                            {/* Panel Availability Section with conditional styling */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                <EventAvailableIcon color="action" />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                    fontStyle: isWaitingForDates ? 'italic' : 'normal',
                                                    color: isWaitingForDates ? 'text.secondary' : 'text.primary',
                                                    }}
                                                >
                                                    {interview.panelAvailability}
                                                </Typography>
                                            </Box>

                                            {/* Shortlisted Candidates Count */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                <PeopleOutlineIcon color="action" />
                                                <Typography variant="body2">
                                                    <strong>{interview.shortlistedCandidatesCount || 0}</strong> Shortlisted Candidates
                                                </Typography>
                                            </Box>
                                        </CardContent>

                                        {/* Action Button with conditional disabled prop */}
                                        <Box sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    backgroundColor: '#0a2048',
                                                    // Add a hover effect for better UX
                                                    '&:hover': {
                                                    backgroundColor: '#062a5eff', // A slightly darker shade
                                                    },
                                                }}
                                                disabled={!isButtonEnabled}
                                                onClick={() => handleOpenNotifyModal(interview)}
                                                >
                                                Notify Candidates
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </>
            )}

            {/* Placeholders for other tabs */}
            {activeTab === 'pending' && (
                <>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <Typography>Loading interviews...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredPendingInterviews.map((interview) => {
                                return (
                                <Grid item key={interview.id} xs={12} sm={6} md={4}>
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

                                    {/* Panel Members Section (no changes here) */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                        <GroupIcon color="action" />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {interview.panel}
                                        </Typography>
                                    </Box>

                                    {/* Panel Availability Section with conditional styling */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                        <EventAvailableIcon color="action" />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                            fontStyle: 'normal',
                                            color: 'text.primary',
                                            }}
                                            >
                                            {interview.interviewDate}
                                        </Typography>
                                    </Box>
                                    {/*Shortlisted Candidates Count*/}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                        <PeopleOutlineIcon color="action" />
                                        <Typography variant="body2">
                                            <strong>{interview.shortlistedCandidatesCount || interview.applicationCount || 0}</strong> Shortlisted Candidates
                                        </Typography>
                                    </Box>
                                </CardContent>

                                {/* Action Button with conditional disabled prop */}
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#0a2048',
                                            // Add a hover effect for better UX
                                            '&:hover': {
                                            backgroundColor: '#062a5eff', // A slightly darker shade
                                            },
                                        }}
                                        onClick={() => handleOpenCandidateModal(interview)}
                                        >
                                        View Candidate Confirmation
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                        );
                    })}
                        </Grid>
                    )}
                </>
            )}
            {activeTab === 'scheduled' && (
                <>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <Typography>Loading interviews...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                    {filteredScheduledInterviews.map((interview) => {
                        return (
                        <Grid item key={interview.id} xs={12} sm={6} md={4}>
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

                                    {/* Panel Members Section (no changes here) */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                        <GroupIcon color="action" />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {interview.panel}
                                        </Typography>
                                    </Box>

                                    {/* Panel Availability Section with conditional styling */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                        <EventAvailableIcon color="action" />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                            fontStyle: 'normal',
                                            color: 'text.primary',
                                            }}
                                            >
                                            {interview.interviewDate}
                                        </Typography>
                                    </Box>
                                    {/*Shortlisted Candidates Count*/}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                        <PeopleOutlineIcon color="action" />
                                        <Typography variant="body2">
                                            <strong>{interview.shortlistedCandidatesCount || interview.applicationCount || 0}</strong> Shortlisted Candidates
                                        </Typography>
                                    </Box>
                                </CardContent>

                                {/* Action Button with conditional disabled prop */}
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#0a2048',
                                            // Add a hover effect for better UX
                                            '&:hover': {
                                            backgroundColor: '#062a5eff', // A slightly darker shade
                                            },
                                        }}
                                        onClick={() => handleOpenCandidateModal(interview)}
                                        >
                                        View Candidate Confirmation
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                        );
                    })}
                        </Grid>
                    )}
                </>
            )}

            {activeTab === 'completed' && (
                <>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <Typography>Loading interviews...</Typography>
                        </Box>
                    ) : (
                        <>
                            {/* If we are NOT viewing details, show the grid of cards */}
                            {!viewingInterviewDetails ? (
                        <Grid container spacing={3}>
                            {filteredCompltedInterviews.map((interview) => {
                                return (
                                <Grid item key={interview.id} xs={12} sm={6} md={4}>
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

                                            {/* Panel Members Section (no changes here) */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                <GroupIcon color="action" />
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {interview.panel}
                                                </Typography>
                                            </Box>

                                            {/* Panel Availability Section with conditional styling */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                <EventAvailableIcon color="action" />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                    fontStyle: 'normal',
                                                    color: 'text.primary',
                                                    }}
                                                    >
                                                    {interview.interviewDate}
                                                </Typography>
                                            </Box>
                                            {/*Application Count*/}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                                <PeopleOutlineIcon color="action" />
                                                <Typography variant="body2">
                                                    <strong>{interview.applicationCount}</strong> Interviewees
                                                </Typography>
                                            </Box>
                                        </CardContent>

                                        {/* Action Button with conditional disabled prop */}
                                        <Box sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    backgroundColor: '#0a2048',
                                                    // Add a hover effect for better UX
                                                    '&:hover': {
                                                    backgroundColor: '#062a5eff', // A slightly darker shade
                                                    },
                                                }}
                                                onClick={() => handleViewFeedbacks(interview)}
                                                >
                                                View Interview Feedbacks
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        /* If we ARE viewing details, show the candidate list view */
                        <Box>
                            {/* Header for the detail view */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">Feedbacks for: {viewingInterviewDetails.jobTitle}</Typography>
                                    <Typography variant="subtitle1" color="text.secondary">{viewingInterviewDetails.round}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="outlined" onClick={handleBackToGrid}>Back to All Interviews</Button>
                                    <Button 
                                        variant="contained" 
                                        onClick={handleProceedToNextRound}
                                        disabled={!viewingInterviewDetails.candidates.some(c => c.status === 'Passed')}
                                    >
                                        Proceed to Next Round
                                    </Button>
                                </Box>
                            </Box>
                            
                            {/* List of Candidates */}
                            <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                                {viewingInterviewDetails.candidates.map((candidate) => (
                                    <ListItem key={candidate.id} divider>
                                        <ListItemText primary={candidate.name} secondary={candidate.email} />
                                        <Chip label={candidate.interviewStatus} color={getInterviewStatusColor(candidate.interviewStatus)} sx={{ mx: 2 }} />
                                        <Button variant="outlined" size="small" onClick={() => handleOpenFeedbackModal(candidate)}>
                                            View Feedback
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                        </>
                    )}
                </>
            )}

        </Box>

        {/* --- The Notification Modal --- */}
        <Dialog open={isNotifyModalOpen} onClose={handleCloseNotifyModal} fullWidth maxWidth="xs">
            <DialogTitle>Notify Candidates</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Select the confirmed interview date for the <strong>{selectedInterview?.jobTitle}</strong> position. An email will be sent to all shortlisted candidates.
                </DialogContentText>
                
                {/* Show available dates if they exist */}
                {selectedInterview?.panelAvailability && selectedInterview.panelAvailability !== "Waiting for available dates" && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Available dates: {selectedInterview.panelAvailability}
                    </Typography>
                )}
                
                <DatePicker
                    label="Interview Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    disablePast // Prevent selecting dates that have already passed
                    sx={{ width: '100%' }}
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseNotifyModal}>Cancel</Button>
            <Button 
                onClick={handleFinalNotify} 
                variant="contained" 
                // Disable button until a date is selected
                disabled={!selectedDate} 
                sx={{ backgroundColor: '#052353' }}
            >
                Notify Candidates
            </Button>
            </DialogActions>
        </Dialog>

        {/*Candidate Confirmation Modal*/}
        <Dialog open={isCandidateModalOpen} onClose={handleCloseCandidateModal} fullWidth maxWidth="sm">
            <DialogTitle>Candidate Confirmation for: <strong>{selectedInterview?.jobTitle}</strong></DialogTitle>
            <DialogContent dividers>
                {selectedInterview?.candidates && selectedInterview.candidates.length > 0 ? (
                    <List>
                        {selectedInterview.candidates.map((candidate) => (
                            <ListItem key={candidate.id} disableGutters>
                                <ListItemText 
                                    primary={candidate.name} 
                                    secondary={candidate.email} 
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
                    >
                    Proceed to Interviews
                </Button>
            </DialogActions>
        </Dialog>

        {/* Feedback Details Modal */}
        <Dialog open={isFeedbackModalOpen} onClose={handleCloseFeedbackModal} fullWidth maxWidth="sm">
            <DialogTitle>Interview Feedback for: <strong>{selectedCandidateFeedback?.name}</strong></DialogTitle>
            <DialogContent dividers>
                <Typography variant="h6" gutterBottom>Status: {selectedCandidateFeedback?.interviewStatus}</Typography>
                <Typography variant="body1">{selectedCandidateFeedback?.feedback}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseFeedbackModal}>Close</Button>
            </DialogActions>
        </Dialog>

        </LocalizationProvider>
        
    );
};

export default Interviews;