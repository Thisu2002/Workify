import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
  Chip,
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
    panelMembers: [
      { name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Peter Jones', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    ],
    panelAvailability: "Waiting for available dates" 
  },
  {
    id: 2,
    jobTitle: "Product Designer",
    round: "Round 2: Portfolio Review",
    panel: "Design Panel B",
    panelMembers: [
      { name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
      { name: 'Emily White', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
      { name: 'David Green', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    ],
    panelAvailability: "Jul 25, 26, 27" 
  },
  {
    id: 3,
    jobTitle: "Backend Developer",
    round: "Round 1: Technical Screening",
    panel: "Technical Panel C",
    panelMembers: [
      { name: 'Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
      { name: 'Sarah Wilson', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
    ],
    panelAvailability: "Aug 5,6"
  },
   {
    id: 4,
    jobTitle: "Project Management Lead",
    round: "Round 3: Final HR Round",
    panel: "HR Panel A",
    panelMembers: [
      { name: 'Teresa Reyes', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
      { name: 'Chris Evans', avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
    ],
    panelAvailability: "Waiting for available dates"
  },
];


const Interviews = () => {
    const [activeTab, setActiveTab] = useState("new");
    const [searchTerm, setSearchTerm] = useState('');

    const [isNotifyModalOpen, setNotifyModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); 

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Filtering logic:all tab
    const filteredNewInterviews = newInterviewsData.filter(interview =>
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenNotifyModal = (interview) => {
        setSelectedInterview(interview);
        setNotifyModalOpen(true);
    };

    const handleCloseNotifyModal = () => {
        setNotifyModalOpen(false);
        setSelectedDate(null); // Reset date on close
        setSelectedInterview(null);
    };

    const handleFinalNotify = () => {
        if (!selectedDate) {
        alert('Please select a date before notifying candidates.');
        return;
        }
        alert(
        `Notifying candidates for ${selectedInterview.jobTitle} about their interview on ${dayjs(selectedDate).format('MMMM D, YYYY')}.`
        );
        handleCloseNotifyModal();
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
            <Grid container spacing={3}>
                {filteredNewInterviews.map((interview) => {
                    // Determine if the button should be disabled based on the availability text.
                    const isWaitingForDates = interview.panelAvailability === "Waiting for available dates";

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
                            }}>

                            <CardContent sx={{ flexGrow: 1 }}>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2', // Limit to 2 lines
                                        WebkitBoxOrient: 'vertical',
                                        // -------------------------------------
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
                                    disabled={isWaitingForDates}
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

        {/* Placeholders for other tabs */}
        {activeTab === 'pending' && <Typography>Display pending interviews here...</Typography>}
        {activeTab === 'scheduled' && <Typography>Display scheduled interviews here...</Typography>}
        {activeTab === 'completed' && <Typography>Display completed interviews here...</Typography>}

        </Box>

        {/* --- The Notification Modal --- */}
        <Dialog open={isNotifyModalOpen} onClose={handleCloseNotifyModal} fullWidth maxWidth="xs">
            <DialogTitle>Notify Candidates</DialogTitle>
            <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
                Select the confirmed interview date for the <strong>{selectedInterview?.jobTitle}</strong> position. An email will be sent to all shortlisted candidates.
            </DialogContentText>
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

        </LocalizationProvider>
        
    );
};

export default Interviews;