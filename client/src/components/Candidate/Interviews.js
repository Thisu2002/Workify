import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Divider,
  IconButton,
  Popover 
} from "@mui/material";
import { 
  Event, 
  AccessTime, 
  Videocam, 
  LocationOn, 
  CheckCircle, 
  Cancel,
  CalendarToday,
  HourglassEmpty
} from '@mui/icons-material';

// Imports for the Date Picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';


const upcomingInterviews = [
  {
    id: 1,
    jobTitle: 'Senior Frontend Developer',
    companyName: 'Innovatech Solutions',
    date: '2025-08-15',
    time: '11:00 AM',
    stage: 'Technical Interview',
    format: 'Google Meet',
    link: 'https://meet.google.com/xyz-abc-def'
  },
  {
    id: 2,
    jobTitle: 'Product Designer',
    companyName: 'Creative Minds Inc.',
    date: '2025-08-18',
    time: '2:30 PM',
    stage: 'Final Round',
    format: 'On-site',
    location: '123 Creative Ave, Design City'
  },
];

const pastInterviews = [
  {
    id: 3,
    jobTitle: 'React Native Developer',
    companyName: 'MobileFirst Co.',
    date: '2025-07-28',
    outcome: 'Advanced to Next Round'
  },
  {
    id: 4,
    jobTitle: 'Junior QA Engineer',
    companyName: 'BugFinders Ltd.',
    date: '2025-07-22',
    outcome: 'No Longer in Consideration'
  },
];

const Interviews = () => {
  // State for the calendar popover
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleOpenCalendar = (event, date) => {
    setAnchorEl(event.currentTarget);
    // The date picker needs a Date object, not a string
    setSelectedDate(new Date(date));
  };

  const handleCloseCalendar = () => {
    setAnchorEl(null);
  };

  const isCalendarOpen = Boolean(anchorEl);

  const getOutcomeChip = (outcome) => {
    if (outcome === 'Advanced to Next Round') {
      return <Chip icon={<CheckCircle />} label={outcome} color="success" size="small" />;
    }
    if (outcome === 'No Longer in Consideration') {
      return <Chip icon={<Cancel />} label={outcome} color="error" size="small" />;
    }
    return <Chip icon={<HourglassEmpty />} label="Awaiting Feedback" color="warning" size="small" />;
  };

  return (
    // Wrap the entire component with LocalizationProvider
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Upcoming Interviews Section */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Upcoming Interviews
        </Typography>
        <List sx={{ mb: 4 }}>
          {upcomingInterviews.map((interview) => (
            <Paper key={interview.id} elevation={2} sx={{ mb: 2, p: 2, borderRadius: 2 ,transition: 'box-shadow 0.3s, transform 0.2s', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }}} >
              <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {interview.jobTitle}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      at {interview.companyName}
                    </Typography>
                  }
                />
                <Chip label={interview.stage} color="primary" variant="outlined" sx={{ ml: 2 }} />
              </ListItem>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box display="flex" alignItems="center"><Event sx={{ mr: 1, color: 'text.secondary' }} /> {new Date(interview.date).toDateString()} at {interview.time}</Box>
                  <Box display="flex" alignItems="center">
                      {interview.format === 'On-site' ? <LocationOn sx={{ mr: 1, color: 'text.secondary' }} /> : <Videocam sx={{ mr: 1, color: 'text.secondary' }} />}
                      {interview.format === 'On-site' ? interview.location : interview.format}
                  </Box>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={(event) => handleOpenCalendar(event, interview.date)}
                  >
                    <CalendarToday />
                  </IconButton>
                  {interview.link && <Button variant="contained" size="small" href={interview.link} target="_blank">Join Meeting</Button>}
              </Box>
            </Paper>
          ))}
        </List>

        {/* Past Interviews Section */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Past Interviews
        </Typography>
        <List>
          {pastInterviews.map((interview) => (
            <Paper key={interview.id} elevation={1} sx={{ mb: 2, p: 2, borderRadius: 2, opacity: 0.8 }}>
               <ListItem sx={{ p: 0 }}>
                <ListItemText
                  primary={interview.jobTitle}
                  secondary={`at ${interview.companyName} on ${new Date(interview.date).toLocaleDateString()}`}
                />
                {getOutcomeChip(interview.outcome)}
              </ListItem>
            </Paper>
          ))}
        </List>

        {/* Calendar Popover - it only needs to be defined once */}
        <Popover
            open={isCalendarOpen}
            anchorEl={anchorEl}
            onClose={handleCloseCalendar}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={selectedDate}
                readOnly // Make it view-only
                onChange={() => {}} // onChange is required, but we do nothing
            />
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};

export default Interviews;