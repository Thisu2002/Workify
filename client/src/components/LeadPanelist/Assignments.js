import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Description,
  MoreVert,
  Schedule,
  GroupWork,
  Email,
  Work
} from "@mui/icons-material";
import { useNavigate, useLocation } from 'react-router-dom';


const tabLabels = ["New", "Pending", "Schedule", "Complete"];

export const assignmentsData = [
  {
    id: 1,
    jobName: "UI/UX Interview",
    round: "Round 1 - CV Review",
    status: "new",
    time: "10:00 AM - 11:00 AM",
    date: "2024-01-18",
    panel: "Design Panel",
    type: "Portfolio Review",
    documents: ["Portfolio", "Design Case Studies"],
    interviewers: [
      { name: "Ms. Fernando", avatar: "https://randomuser.me/api/portraits/women/42.jpg" },
      { name: "Mr. Gunawardena", avatar: "https://randomuser.me/api/portraits/men/44.jpg" }
    ],
    panelMembers: [
      { name: "Ms. Fernando", position: "Lead Designer", email: "fernando@workify.com" },
      { name: "Mr. Gunawardena", position: "Senior UI/UX", email: "gunawardena@workify.com" }
    ]
  },
  {
    id: 2,
    jobName: "Full Stack Interview",
    round: "Round 2 - Technical Assessment",
    status: "new",
    time: "11:30 AM - 12:30 PM",
    date: "2024-01-18",
    panel: "Technical Panel B",
    type: "System Design",
    documents: ["Resume", "Projects"],
    interviewers: [
      { name: "Mr. Ranasinghe", avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
      { name: "Ms. Cooray", avatar: "https://randomuser.me/api/portraits/women/43.jpg" }
    ],
    panelMembers: [
      { name: "Mr. Ranasinghe", position: "Lead Developer", email: "ranasinghe@workify.com" },
      { name: "Ms. Cooray", position: "Full Stack Engineer", email: "cooray@workify.com" }
    ]
  },
  {
    id: 3,
    jobName: "Business Analyst Interview",
    round: "Round 1 - Case Study",
    status: "new",
    time: "2:00 PM - 3:00 PM",
    date: "2024-01-18",
    panel: "BA Panel",
    type: "Case Study",
    documents: ["Resume", "Case Study"],
    interviewers: [
      { name: "Dr. Perera", avatar: "https://randomuser.me/api/portraits/men/42.jpg" },
      { name: "Mr. Silva", avatar: "https://randomuser.me/api/portraits/men/43.jpg" }
    ],
    panelMembers: [
      { name: "Dr. Perera", position: "Lead BA", email: "perera@workify.com" },
      { name: "Mr. Silva", position: "Business Analyst", email: "silva@workify.com" }
    ]
  },
  {
    id: 4,
    jobName: "Frontend Developer Interview",
    round: "Round 2 - Technical Assessment",
    status: "pending",
    scheduledDate: "2024-01-19",
    time: "10:00 AM - 11:00 AM",
    duration: "1 hour",
    panel: "Frontend Panel",
    type: "Technical Round",
    documents: ["Resume", "Portfolio"],
    interviewers: [],
  },
  {
    id: 5,
    jobName: "Backend Developer Interview",
    round: "Round 1 - Coding Test",
    status: "pending",
    scheduledDate: "2024-01-20",
    time: "11:30 AM - 12:30 PM",
    duration: "1 hour",
    panel: "Backend Panel",
    type: "Coding Test",
    documents: ["Resume", "Projects"],
    interviewers: [],
  },
  {
    id: 6,
    jobName: "QA Analyst Interview",
    round: "Round 2 - Technical Assessment",
    status: "pending",
    scheduledDate: "2024-01-21",
    time: "2:00 PM - 3:00 PM",
    duration: "1 hour",
    panel: "QA Panel",
    type: "Technical Assessment",
    documents: ["Resume", "Test Cases"],
    interviewers: [],
  },
  {
    id: 7,
    jobName: "DevOps Engineer Interview",
    round: "Round 1 - Screening",
    status: "schedule",
    scheduledDate: "2024-01-22",
    time: "9:00 AM - 10:00 AM",
    duration: "1 hour",
    panel: "DevOps Panel",
    type: "Screening",
    documents: ["Resume"],
    interviewers: [],
    panelMembers: [
      { name: "Dr. Perera", email: "perera@workify.com", position: "Lead DevOps" },
      { name: "Ms. Silva", email: "silva@workify.com", position: "DevOps Engineer" }
    ]
  },
  {
    id: 8,
    jobName: "Product Manager Interview",
    round: "Round 2 - Case Study",
    status: "schedule",
    scheduledDate: "2024-01-23",
    time: "3:00 PM - 4:00 PM",
    duration: "1 hour",
    panel: "PM Panel",
    type: "Case Study",
    documents: ["Resume", "Case Study"],
    interviewers: [],
    panelMembers: [
      { name: "Mr. Fernando", email: "fernando@workify.com", position: "Senior PM" },
      { name: "Ms. Jayasuriya", email: "jayasuriya@workify.com", position: "Product Analyst" }
    ]
  },
  {
    id: 11,
    jobName: "Data Scientist Interview",
    round: "Round 1 - Technical Screening",
    status: "schedule",
    scheduledDate: "2024-01-24",
    time: "4:00 PM - 5:00 PM",
    duration: "1 hour",
    panel: "Data Science Panel",
    type: "Technical Screening",
    documents: ["Resume", "Portfolio"],
    interviewers: [],
    panelMembers: [
      { name: "Dr. Wijesinghe", email: "wijesinghe@workify.com", position: "Lead Data Scientist" },
      { name: "Mr. Abeyratne", email: "abeyratne@workify.com", position: "Data Engineer" }
    ]
  },
  {
    id: 12,
    jobName: "UI/UX Designer Interview",
    round: "Final Round - Portfolio Review",
    status: "complete",
    completedDate: "2024-01-25",
    time: "10:00 AM - 11:00 AM",
    duration: "1 hour",
    panel: "Design Panel",
    type: "Portfolio Review",
    documents: ["Portfolio", "Design Presentation"],
    interviewers: [],
  },
  {
    id: 13,
    jobName: "Backend Developer Interview",
    round: "Final Round - System Design",
    status: "complete",
    completedDate: "2024-01-24",
    time: "2:00 PM - 3:00 PM",
    duration: "1 hour",
    panel: "Backend Panel",
    type: "System Design",
    documents: ["Resume", "System Design Doc"],
    interviewers: [],
  },
  {
    id: 14,
    jobName: "QA Analyst Interview",
    round: "Final Round - Technical Assessment",
    status: "complete",
    completedDate: "2024-01-23",
    time: "11:00 AM - 12:00 PM",
    duration: "1 hour",
    panel: "QA Panel",
    type: "Technical Assessment",
    documents: ["Resume", "Test Cases"],
    interviewers: [],
  },
];

const statusMap = {
  new: 0,
  pending: 1,
  schedule: 2,
  complete: 3
};

const Assignments = () => {
  const [currentTab, setCurrentTab] = useState(0);
  // Calendar dialog state
  const [openCalendar, setOpenCalendar] = useState(null); // assignment id or null
  // { [id]: [date1, date2, date3] }
  const [selectedDates, setSelectedDates] = useState({});

  // Add panelMembers to new assignments
  const [openPanelDetails, setOpenPanelDetails] = useState(null); // assignment id or null

  const handleOpenCalendar = (id) => setOpenCalendar(id);
  const handleCloseCalendar = () => setOpenCalendar(null);
  const handleDateChange = (id, idx, date) => {
    setSelectedDates((prev) => {
      const prevArr = prev[id] || [null, null, null];
      const newArr = [...prevArr];
      newArr[idx] = date;
      return { ...prev, [id]: newArr };
    });
  };

  const filteredAssignments = assignmentsData.filter(
    (a) => statusMap[a.status] === currentTab
  );

  // For the 'New' tab, ensure 3 cards per row (fill with empty Grid items if needed)
  const isNewTab = currentTab === 0;
  const cardsToShow = isNewTab ? 3 : filteredAssignments.length;
  const rows = isNewTab
    ? [filteredAssignments.slice(0, 3)]
    : [filteredAssignments];

  const navigate = useNavigate();

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
        {isNewTab
          ? rows[0].map((assignment, idx) => (
              <Grid item xs={12} md={4} key={assignment ? assignment.id : `empty-${idx}`}>
                {assignment && (
                  <Card
                    sx={{
                      position: "relative",
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      border: "1px solid rgba(231, 234, 245, 0.7)",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Card Title and Round */}
                      <Typography variant="h6" sx={{ color: "#0F2445", fontWeight: 600, mb: 0.5 }}>
                        {assignment.jobName}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        {assignment.round}
                      </Typography>
                      {/* Details */}
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Schedule fontSize="small" sx={{ color: "#64748b" }} />
                          <Typography variant="body2" color="text.secondary">
                            {assignment.time} • {assignment.date}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <GroupWork fontSize="small" sx={{ color: "#64748b" }} />
                          <Typography variant="body2" color="text.secondary">
                            {assignment.panel} • {assignment.type}
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ my: 2 }} />
                      {/* Actions: Pick a Date & Panel Mentors */}
                      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: "#3B5998", color: "#3B5998" }}
                          onClick={() => handleOpenCalendar(assignment.id)}
                        >
                          Pick a Date
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ backgroundColor: "#3B5998" }}
                          onClick={() => setOpenPanelDetails(assignment.id)}
                        >
                          Panel Details
                        </Button>
                      </Box>
                      {selectedDates[assignment.id] && selectedDates[assignment.id].some(Boolean) && (
                        <Box sx={{ mt: 1 }}>
                          {selectedDates[assignment.id].map((date, i) =>
                            date ? (
                              <Typography key={i} variant="caption" color="text.secondary" display="block">
                                Suggested Date {i + 1}: {date.toLocaleDateString?.()}
                              </Typography>
                            ) : null
                          )}
                        </Box>
                      )}
                      {/* Calendar Dialog */}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Dialog open={openCalendar === assignment.id} onClose={handleCloseCalendar}>
                          <DialogTitle>Pick up to 3 Dates</DialogTitle>
                          <DialogContent>
                            <Box display="flex" flexDirection="column" gap={2}>
                              {[0, 1, 2].map((idx) => (
                                <DatePicker
                                  key={idx}
                                  label={`Suggested Date ${idx + 1}`}
                                  value={selectedDates[assignment.id]?.[idx] || null}
                                  onChange={(date) => handleDateChange(assignment.id, idx, date)}
                                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                />
                              ))}
                            </Box>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseCalendar}>Close</Button>
                          </DialogActions>
                        </Dialog>
                      </LocalizationProvider>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            ))
          : currentTab === 2
          ? filteredAssignments.map((assignment, idx) => (
              <Grid item xs={12} md={4} key={assignment.id}>
                <Card
                  sx={{
                    position: "relative",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(231, 234, 245, 0.7)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="h6" sx={{ color: "#0F2445", fontWeight: 600 }}>
                        {assignment.jobName}
                      </Typography>
                      <Chip label="Scheduled" color="success" size="small" sx={{ fontWeight: 600 }} />
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                      {assignment.round}
                    </Typography>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Schedule fontSize="small" sx={{ color: "#64748b" }} />
                        <Typography variant="body2" color="text.secondary">
                          {assignment.scheduledDate ? `Scheduled: ${assignment.scheduledDate}` : assignment.time}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <GroupWork fontSize="small" sx={{ color: "#64748b" }} />
                        <Typography variant="body2" color="text.secondary">
                          {assignment.panel} • {assignment.type}
                        </Typography>
                      </Box>
                      {assignment.duration && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {assignment.duration}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                    {/* Action Buttons: View Panel & Candidate View */}
                    <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center" mt={2}>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: "#3B5998", color: "#3B5998" }}
                        onClick={() => handleOpenCalendar(assignment.id)}
                      >
                        View Panel
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ backgroundColor: "#3B5998" }}
                        onClick={() => navigate('/lead-panelist/candidates')}
                      >
                        Candidate View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : filteredAssignments.map((assignment, idx) => (
              <Grid item xs={12} md={4} key={assignment.id}>
                <Card
                  sx={{
                    position: "relative",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(231, 234, 245, 0.7)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Card Title and Round */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="h6" sx={{ color: "#0F2445", fontWeight: 600 }}>
                        {assignment.jobName}
                      </Typography>
                      {assignment.status === "pending" && (
                        <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 600 }} />
                      )}
                      {assignment.status === "complete" && (
                        <Chip label="Completed" size="small" sx={{ fontWeight: 600, backgroundColor: '#3B5998', color: '#fff' }} />
                      )}
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                      {assignment.round}
                    </Typography>
                    {/* Scheduled Date, Time, Duration */}
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Schedule fontSize="small" sx={{ color: "#64748b" }} />
                        <Typography variant="body2" color="text.secondary">
                          {assignment.scheduledDate ? `Scheduled: ${assignment.scheduledDate}` : assignment.time}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <GroupWork fontSize="small" sx={{ color: "#64748b" }} />
                        <Typography variant="body2" color="text.secondary">
                          {assignment.panel} • {assignment.type}
                        </Typography>
                      </Box>
                      {assignment.duration && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {assignment.duration}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        {/* Fill empty grid items for 'New' tab if less than 3 cards */}
        {isNewTab && filteredAssignments.length < 3 &&
          Array.from({ length: 3 - filteredAssignments.length }).map((_, idx) => (
            <Grid item xs={12} md={4} key={`empty-${idx}`} style={{ visibility: 'hidden' }} />
          ))}
      </Grid>
      {filteredAssignments.length === 0 && (
        <Typography variant="body1" sx={{ mt: 4 }}>
          No assignments in this category.
        </Typography>
      )}
      {/* Panel Modal */}
      {filteredAssignments.map((assignment) => (
        <Dialog
          key={assignment.id}
          open={openPanelDetails === assignment.id}
          onClose={() => setOpenPanelDetails(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 0,
              minHeight: 320,
              boxShadow: '0 8px 32px rgba(60,72,100,0.10)',
              background: '#fff',
              border: '1px solid #e3e8ee',
            }
          }}
        >
          <DialogTitle>Panel Members</DialogTitle>
          <DialogContent>
            {assignment.panelMembers && assignment.panelMembers.length > 0 ? (
              <Box>
                {assignment.panelMembers.map((member, idx) => (
                  <Box key={idx} mb={2}>
                    <Typography variant="subtitle1" fontWeight={700}>{member.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{member.position}</Typography>
                    <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No panel members listed.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPanelDetails(null)} variant="outlined" sx={{ borderRadius: 2, px: 4, fontWeight: 600, color: '#3B5998', borderColor: '#3B5998' }}>Close</Button>
            <Button onClick={() => alert('Edit panel details coming soon!')} variant="contained" sx={{ borderRadius: 2, px: 4, fontWeight: 600, background: '#3B5998' }}>Edit</Button>
          </DialogActions>
        </Dialog>
      ))}
    </Box>
  );
};

export default Assignments; 