import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Grid, Card, CardContent, Avatar, Chip, Stack, Button, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating
} from '@mui/material';
import {
  Schedule, GroupWork, Description, VideoCall
} from '@mui/icons-material';
import { assignmentsData } from './Assignments';

const tabLabels = ["All Interviews", "Today", "Upcoming", "Completed"];

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(today.getDate() + 2);

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

const interviewsData = [
  // Today interviews
  {
    id: 1,
    candidate: {
      name: "Kasun Perera",
      position: "Senior Developer",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      experience: "8 years"
    },
    status: "in_progress",
    time: "10:00 AM - 11:00 AM",
    date: formatDate(today),
    panel: "Technical Panel A",
    type: "Technical Round",
    meetingLink: "meet.google.com/abc-def-ghi",
    documents: ["Resume", "Portfolio"],
    interviewers: [
      { name: "Dr. Perera", avatar: "https://randomuser.me/api/portraits/men/42.jpg" },
      { name: "Mr. Silva", avatar: "https://randomuser.me/api/portraits/men/43.jpg" }
    ]
  },
  {
    id: 2,
    candidate: {
      name: "Malini Silva",
      position: "UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/41.jpg",
      experience: "5 years"
    },
    status: "upcoming",
    time: "11:30 AM - 12:30 PM",
    date: formatDate(today),
    panel: "Design Panel",
    type: "Portfolio Review",
    meetingLink: "meet.google.com/xyz-pqr-stu",
    documents: ["Portfolio", "Design Case Studies"],
    interviewers: [
      { name: "Ms. Fernando", avatar: "https://randomuser.me/api/portraits/women/42.jpg" },
      { name: "Mr. Gunawardena", avatar: "https://randomuser.me/api/portraits/men/44.jpg" }
    ]
  },
  // Upcoming interviews
  {
    id: 3,
    candidate: {
      name: "Ashan Fernando",
      position: "DevOps Engineer",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      experience: "6 years"
    },
    status: "upcoming",
    time: "2:00 PM - 3:00 PM",
    date: formatDate(tomorrow),
    panel: "Technical Panel B",
    type: "System Design",
    meetingLink: "meet.google.com/lmn-opq-rst",
    documents: ["Resume", "Projects"],
    interviewers: [
      { name: "Mr. Ranasinghe", avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
      { name: "Ms. Cooray", avatar: "https://randomuser.me/api/portraits/women/43.jpg" }
    ]
  },
  {
    id: 4,
    candidate: {
      name: "Nadeesha Jayasuriya",
      position: "QA Analyst",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      experience: "4 years"
    },
    status: "upcoming",
    time: "4:00 PM - 5:00 PM",
    date: formatDate(dayAfterTomorrow),
    panel: "QA Panel",
    type: "Technical Assessment",
    meetingLink: "meet.google.com/qwe-rty-uio",
    documents: ["Resume", "Test Cases"],
    interviewers: [
      { name: "Ms. Silva", avatar: "https://randomuser.me/api/portraits/women/46.jpg" },
      { name: "Mr. Perera", avatar: "https://randomuser.me/api/portraits/men/47.jpg" }
    ]
  },
  // Completed interview (for completed tab)
  {
    id: 5,
    candidate: {
      name: "Ruwan Fernando",
      position: "Product Manager",
      avatar: "https://randomuser.me/api/portraits/men/48.jpg",
      experience: "10 years"
    },
    status: "completed",
    time: "9:00 AM - 10:00 AM",
    date: "2024-01-10",
    panel: "PM Panel",
    type: "Final Round",
    meetingLink: "meet.google.com/pm-final",
    documents: ["Resume", "Portfolio"],
    interviewers: [
      { name: "Ms. Jayasuriya", avatar: "https://randomuser.me/api/portraits/women/49.jpg" },
      { name: "Mr. Abeyratne", avatar: "https://randomuser.me/api/portraits/men/49.jpg" }
    ]
  },
  {
    id: 6,
    candidate: {
      name: "Dilani Perera",
      position: "UI/UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/50.jpg",
      experience: "7 years"
    },
    status: "completed",
    time: "11:00 AM - 12:00 PM",
    date: "2024-01-11",
    panel: "Design Panel",
    type: "Portfolio Review",
    meetingLink: "meet.google.com/uiux-final",
    documents: ["Portfolio", "Design Presentation"],
    interviewers: [
      { name: "Mr. Gunawardena", avatar: "https://randomuser.me/api/portraits/men/44.jpg" },
      { name: "Ms. Fernando", avatar: "https://randomuser.me/api/portraits/women/42.jpg" }
    ]
  },
  {
    id: 7,
    candidate: {
      name: "Sahan Jayasinghe",
      position: "Backend Developer",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
      experience: "5 years"
    },
    status: "completed",
    time: "2:00 PM - 3:00 PM",
    date: "2024-01-12",
    panel: "Backend Panel",
    type: "System Design",
    meetingLink: "meet.google.com/backend-final",
    documents: ["Resume", "System Design Doc"],
    interviewers: [
      { name: "Mr. Silva", avatar: "https://randomuser.me/api/portraits/men/43.jpg" },
      { name: "Dr. Perera", avatar: "https://randomuser.me/api/portraits/men/42.jpg" }
    ]
  },
  {
    id: 8,
    candidate: {
      name: "Nimasha Senanayake",
      position: "QA Analyst",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
      experience: "6 years"
    },
    status: "completed",
    time: "3:00 PM - 4:00 PM",
    date: "2024-01-13",
    panel: "QA Panel",
    type: "Technical Assessment",
    meetingLink: "meet.google.com/qa-final",
    documents: ["Resume", "Test Cases"],
    interviewers: [
      { name: "Ms. Silva", avatar: "https://randomuser.me/api/portraits/women/46.jpg" },
      { name: "Mr. Perera", avatar: "https://randomuser.me/api/portraits/men/47.jpg" }
    ]
  },
];

const getStatusChipProps = (status) => {
  const statusConfig = {
    in_progress: { label: 'In Progress', color: '#3B5998', bg: 'rgba(59, 89, 152, 0.1)' },
    upcoming: { label: 'Upcoming', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    completed: { label: 'Completed', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' }
  };
  return statusConfig[status];
};

function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
}

function isUpcoming(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  // Upcoming means date is after today
  return d > today;
}

function isCompleted(status) {
  return status === 'completed';
}

const Interviews = () => {
  const [currentTab, setCurrentTab] = useState(0);
  // Feedback modal state
  const [openFeedbackId, setOpenFeedbackId] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [techRating, setTechRating] = useState(0);
  const [commRating, setCommRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");

  // Helper to get today's and upcoming job interviews from assignmentsData
  function getJobInterviewsForTab(tab) {
    const today = new Date();
    function isToday(dateStr) {
      const d = new Date(dateStr);
      return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    }
    function isUpcoming(dateStr) {
      const d = new Date(dateStr);
      return d > today;
    }
    if (tab === 1) {
      // Today
      return assignmentsData.filter(a => a.date && isToday(a.date));
    } else if (tab === 2) {
      // Upcoming
      return assignmentsData.filter(a => a.date && isUpcoming(a.date));
    }
    return [];
  }

  let filteredInterviews = interviewsData;
  let jobInterviews = [];
  if (currentTab === 1) {
    filteredInterviews = interviewsData.filter(i => isToday(i.date));
    jobInterviews = getJobInterviewsForTab(1);
  } else if (currentTab === 2) {
    filteredInterviews = interviewsData.filter(i => isUpcoming(i.date));
    jobInterviews = getJobInterviewsForTab(2);
  } else if (currentTab === 3) {
    filteredInterviews = interviewsData.filter(i => isCompleted(i.status));
  }

  return (
    <Box p={3}>
      <Tabs
        value={currentTab}
        onChange={(e, val) => setCurrentTab(val)}
        sx={{ mb: 3 }}
      >
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Grid container spacing={3}>
        {filteredInterviews.length === 0 && jobInterviews.length === 0 && (
          <Typography variant="body1" sx={{ mt: 4, ml: 2 }}>
            No interviews in this category.
          </Typography>
        )}
        {/* Candidate interviews */}
        {filteredInterviews.map((interview) => (
          <Grid item xs={12} md={4} key={interview.id}>
            <Card
              sx={{
                position: 'relative',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(231, 234, 245, 0.7)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Card Title and Candidate */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={interview.candidate.avatar}
                    sx={{ width: 56, height: 56, border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#0F2445', fontWeight: 600 }}>
                      {interview.candidate.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {interview.candidate.position} • {interview.candidate.experience}
                    </Typography>
                    <Chip
                      label={getStatusChipProps(interview.status).label}
                      size="small"
                      sx={{
                        backgroundColor: getStatusChipProps(interview.status).bg,
                        color: getStatusChipProps(interview.status).color,
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                </Box>
                {/* Details */}
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule fontSize="small" sx={{ color: '#64748b' }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.time} • {interview.date}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupWork fontSize="small" sx={{ color: '#64748b' }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.panel} • {interview.type}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                {/* Interviewers */}
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Interviewers:
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {interview.interviewers.map((interviewer, idx) => (
                      <Chip
                        key={idx}
                        avatar={<Avatar src={interviewer.avatar}>{interviewer.name[0]}</Avatar>}
                        label={interviewer.name}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
                {/* Actions */}
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button
                    startIcon={<Description />}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#3B5998', color: '#3B5998' }}
                  >
                    Documents
                  </Button>
                  {/* Show Feedback button only in Completed tab, otherwise show Join Meeting */}
                  {currentTab === 3 ? (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: '#3B5998' }}
                      onClick={() => { setOpenFeedbackId(interview.id); setFeedbackText(""); }}
                    >
                      Feedback
                    </Button>
                  ) : (
                    <Button
                      startIcon={<VideoCall />}
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: '#3B5998' }}
                      href={`https://${interview.meetingLink}`}
                      target="_blank"
                    >
                      Join Meeting
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {/* Job interview cards for today/upcoming */}
        {jobInterviews.map((job) => (
          <Grid item xs={12} md={4} key={job.id}>
            <Card
              sx={{
                position: 'relative',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(231, 234, 245, 0.7)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Card Title and Round */}
                <Typography variant="h6" sx={{ color: "#0F2445", fontWeight: 600, mb: 0.5 }}>
                  {job.jobName}
                </Typography>
                {/* Round number as text */}
                {job.round && (
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
                    {job.round}
                  </Typography>
                )}
                {/* Details */}
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule fontSize="small" sx={{ color: "#64748b" }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.time} • {job.date || job.scheduledDate}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupWork fontSize="small" sx={{ color: "#64748b" }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.panel} • {job.type}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                {/* Interviewers */}
                {job.interviewers && job.interviewers.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Interviewers:
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {job.interviewers.map((interviewer, idx) => (
                        <Chip
                          key={idx}
                          avatar={<Avatar src={interviewer.avatar}>{interviewer.name[0]}</Avatar>}
                          label={interviewer.name}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
                {/* Actions */}
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button
                    startIcon={<Description />}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#3B5998', color: '#3B5998' }}
                  >
                    Documents
                  </Button>
                  {/* Show Feedback button for completed jobs, otherwise Join Meeting */}
                  {job.status === 'completed' ? (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: '#3B5998' }}
                      onClick={() => { setOpenFeedbackId(job.id); setFeedbackText(""); }}
                    >
                      Feedback
                    </Button>
                  ) : (
                    <Button
                      startIcon={<VideoCall />}
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: '#3B5998' }}
                      href={`https://${job.meetingLink}`}
                      target="_blank"
                    >
                      Join Meeting
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Feedback Modal */}
      <Dialog open={!!openFeedbackId} onClose={() => setOpenFeedbackId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Feedback</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">Technical Skills</Typography>
              <Rating value={techRating} precision={0.5} onChange={(_, v) => setTechRating(v)} sx={{ color: '#ffa500' }} />
              <Typography variant="h6" color="primary">{techRating ? techRating + '/5' : ''}</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">Communication</Typography>
              <Rating value={commRating} precision={0.5} onChange={(_, v) => setCommRating(v)} sx={{ color: '#ffa500' }} />
              <Typography variant="h6" color="primary">{commRating ? commRating + '/5' : ''}</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">Overall Rating</Typography>
              <Rating value={overallRating} precision={0.5} onChange={(_, v) => setOverallRating(v)} sx={{ color: '#ffa500' }} />
              <Typography variant="h6" color="primary">{overallRating ? overallRating + '/5' : ''}</Typography>
            </Box>
          </Box>
          <TextField
            label="Strengths"
            value={strengths}
            onChange={e => setStrengths(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="E.g. Problem Solving, System Design"
          />
          <TextField
            label="Areas for Improvement"
            value={improvements}
            onChange={e => setImprovements(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="E.g. Communication, Time Management"
          />
          <TextField
            label="Comment"
            multiline
            rows={3}
            value={feedbackText}
            onChange={e => setFeedbackText(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Additional comments..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedbackId(null)} color="secondary">Cancel</Button>
          <Button onClick={() => {
            setOpenFeedbackId(null);
            setFeedbackText("");
            setTechRating(0);
            setCommRating(0);
            setOverallRating(0);
            setStrengths("");
            setImprovements("");
          }} variant="contained" sx={{ backgroundColor: '#3B5998' }}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Interviews;
