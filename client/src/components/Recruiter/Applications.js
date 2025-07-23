import React, { useState } from 'react';
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
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Description as CvIcon,
  FactCheck as QuizIcon,
  Update as UpdateIcon,
  EventNote as InterviewIcon,
  Feedback as FeedbackIcon,
  AssignmentInd as ApplicationIcon,
  FiberManualRecord as DotIcon,
  DoNotDisturbOn as RejectionIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// import { 
//   Timeline, 
//   TimelineItem, 
//   TimelineSeparator, 
//   TimelineConnector, 
//   TimelineContent, 
//   TimelineDot, 
//   TimelineOppositeContent } from '@mui/lab';

import "../../styles/Recruiter.css";

const tabOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "shortlisted" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];
const dummyCvUrl = "https://upload.wikimedia.org/wikipedia/commons/c/cc/Resume.pdf";

const newApplicants = [
  {
    name: "John Doe",
    experience: "2 years",
    title: "Senior Frontend Developer",
    skills: ["React", "TypeScript", "Next.js", "GraphQL"],
    quiz: "85",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    cvUrl: dummyCvUrl,
    overallStatus: "Hired",
    email: "john12@gmail.com",
    phone: "+94 701 8892",
    totalApplications: 3,
    activityLog: [
      {
        jobTitle: "Frontend Developer",
        appliedDate: "2023-09-01",
        quizScore: "85",
        status: "Rejected",
        interviewFeedback: "Panel feedback: 'Excellent technical skills in React, but needs more experience with large-scale state management.'",
        rejectionReason: "Hiring for a more senior role. Candidate is promising for future junior positions."
      },
      {
        jobTitle: "UI/UX Designer",
        appliedDate: "2023-05-10",
        quizScore: "92",
        status: "Shortlisted",
        interviewFeedback: "Initial screening call was very positive. Good communication skills.",
        rejectionReason: null
      }
    ]
  },
  {
    name: "Elizabeth Martin",
    experience: "3 years",
    skills: ["Node.js", "Express", "MongoDB", "Docker"],
    title: "Backend Developer",
    quiz: "90",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    overallStatus: "Hired",
    email: "e.martin@work.com",
    phone: "(+94) 987 6543",
    totalApplications: 1
    
  },
  {
    name: "Emma Wade",
    experience: "1 year",
    skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
    title: "Product Designer",
    quiz: "78",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    overallStatus: "Past Applicant",
    email: "emma.w@gmail.com",
    phone: "(+94) 714 5208",
    totalApplications: 2
  },
  {
    name: "Teresa Reyes",
    experience: "4 years",
    skills: ["Agile", "Scrum", "Jira"],
    title: "Design Lead",
    quiz: "88",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    overallStatus: "Under Consideration",
    email: "teresa.r@gmail.com",
    phone: "(+94) 771 5678",
    totalApplications: 2,
  },
  {
    name: "Crystal Austin",
    experience: "2 years",
    skills: ["SEO", "Content Writing", "Analytics"],
    title: "Marketing Manager",
    quiz: "82",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    overallStatus: "Past Applicant",
    email: "austin@gmail.com.com",
    phone: "(+94) 723 8934",
    totalApplications: 2,
  },
];

const shortlistedApplicants = [
  {
    name: "Teresa Reyes",
    experience: "4 years",
    skills: ["Agile", "Scrum", "Jira"],
    title: "Project Management Lead",
    quiz: "88",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    overallStatus: "Under Consideration",
    email: "teresa.r@gmail.com",
    phone: "(+94) 771 5678",
    totalApplications: 2,
    activityLog: [
      {
        jobTitle: "Project Manager - Agile",
        appliedDate: "2025-06-15",
        quizScore: "85",
        status: "Shortlisted",
        interviewStatus: "Technicall Interview Passed. Next step: HR Interview",
        interviewFeedback: "Panel feedback: 'Excellent technical skills in Agile, remarkable soft skills.'",
        rejectionReason: null
      },
      {
        jobTitle: "Project Manager - Scrum",
        appliedDate: "2025-01-12",
        quizScore: "78",
        status: "Rejected",
        interviewStatus: "Rejected after initial screening",
        interviewFeedback: "Initial screening call was positive. Need more improvement in communication skills",
        rejectionReason: "Hiring for a more senior role."
      }
    ]
  },
  {
    name: "Elizabeth Martin",
    experience: "3 years",
    skills: ["Node.js", "Express", "MongoDB"],
    title: "Backend Developer",
    quiz: "90",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    overallStatus: "Under Consideration",
    email: "e.martin@gmail.com",
    phone: "(+94) 724 6678",
    totalApplications: 3,
  },
  {
    name: "Emma Wade",
    experience: "1 year",
    skills: ["Figma", "Sketch", "Adobe XD"],
    title: "Product Designer",
    quiz: "78",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    overallStatus: "Under Consideration",
    email: "emmawade@gmail.com",
    phone: "(+94) 781 2356",
    totalApplications: 2,
  },
];

const hiredApplicants = [
  {
    name: "John Doe",
    experience: "2 years",
    title: "Senior Frontend Developer",
    skills: ["React", "TypeScript", "Next.js", "GraphQL"],
    quiz: "85",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    cvUrl: dummyCvUrl,
    overallStatus: "Hired",
    email: "john12@gmail.com",
    phone: "+94 701 8892",
    totalApplications: 3,
    activityLog: [
      {
        jobTitle: "Frontend Developer",
        appliedDate: "2025-05-23",
        quizScore: "92",
        status: "Hired",
        interviewStatus: "Hired for the position after successful interviews",
        interviewFeedback: "Excellent technical skills in React, strong problem-solving abilities.",
        rejectionReason: null
      },
      {
        jobTitle: "UI/UX Designer",
        appliedDate: "2025-03-10",
        quizScore: "92",
        status: "Shortlisted",
        interviewStatus: "Shortlisted for the HR interview",
        interviewFeedback: "Initial screening call was very positive. Good communication skills.",
        rejectionReason: null
      },
      {
        jobTitle: "Frontend Developer",
        appliedDate: "2024-12-20",
        quizScore: "85",
        status: "Rejected",
        interviewStatus: "Rejected after Tech Interview",
        interviewFeedback: "Panel feedback: 'Excellent technical skills in React, but needs more experience with large-scale state management.'",
        rejectionReason: "Hiring for a more senior role. Candidate is promising for future junior positions."
      }
    ]
  },
  {
    name: "Elizabeth Martin",
    experience: "3 years",
    skills: ["Node.js", "Express", "MongoDB", "Docker"],
    title: "Backend Developer",
    quiz: "90",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    overallStatus: "Hired",
    email: "e.martin@work.com",
    phone: "(+94) 987 6543",
    totalApplications: 1
    
  },
  {
    name: "Emma Wade",
    experience: "1 year",
    skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
    title: "Product Designer",
    quiz: "78",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    overallStatus: "Hired",
    email: "emma.w@gmail.com",
    phone: "(+94) 714 5208",
    totalApplications: 2
  },
  {
    name: "Crystal Austin",
    experience: "2 years",
    skills: ["SEO", "Content Writing", "Analytics"],
    title: "Marketing Manager",
    quiz: "82",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    overallStatus: "Hired",
    email: "austin@gmail.com.com",
    phone: "(+94) 723 8934",
    totalApplications: 2,
  },
];

const Applications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [cvStatus, setCvStatus] = useState("");
  
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [selectedCvUrl, setSelectedCvUrl] = useState('');

  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState('');
  const [selectedDates, setSelectedDates] = useState(['', '', '']); // initialize with 3 empty dates


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filtering logic:all tab
  const filteredApplicants = newApplicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtering logic:shortlisted tab
  const filteredShortlistedApplicants = shortlistedApplicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtering logic:hired tab
  const filteredHiredApplicants = hiredApplicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (applicant) => {
    setSelectedApplicant(applicant);
    setCvStatus(applicant.status || "new");
    setModalOpen(true);
  };

  const handleActivityModal = (applicant) => {
    setSelectedApplicant(applicant);
    // setCvStatus(applicant.status || "new");
    setActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setActivityModalOpen(false);
    setTimeout(() => setSelectedApplicant(null), 300); 
  };

  const getStatusChipColor = (status) => {
    if (!status) {
      return 'default'; 
    }

    switch (status.toLowerCase()) {
      case 'hired':
        return 'success';
      case 'rejected':
        return 'error';
      case 'shortlisted':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getCandidateStatusChipColor = (status) => {
  if (!status) return 'default';
  switch (status.toLowerCase()) {
    case 'hired':
      return 'success';
    case 'past applicant':
      return 'warning';
    case 'blacklisted':
      return 'error';
    default:
      return 'primary';
  }
};

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleStatusChange = (event) => {
    setCvStatus(event.target.value);
  };

  const handleSaveStatus = () => {
    // Here you would update the applicant's status in your state or backend
    // For demo, just close the modal
    setModalOpen(false);
    setSelectedApplicant(null);
  };

  // Handlers for opening and closing the CV modal
  const handleOpenCvModal = (applicant) => {
    setSelectedApplicant(applicant); 
    setSelectedCvUrl(applicant.cvUrl);
    setCvModalOpen(true);
  };
  
  const handleCloseCvModal = () => {
    setCvModalOpen(false);
    setSelectedCvUrl('');
    setSelectedApplicant(null);
  };

  const handleOpenInterviewModal = (applicant) => {
    setSelectedApplicant(applicant);
    setInterviewModalOpen(true);
  };

  // const handleCloseInterviewModal = () => {
  //   setInterviewModalOpen(false);
  //   setSelectedPanel('');
  //   setSelectedDates(['', '', '']);
  // };

  // const handleDateChange = (index, value) => {
  //   const newDates = [...selectedDates];
  //   newDates[index] = value;
  //   setSelectedDates(newDates);
  // };

  // const handleAddDateField = () => {
  //   setSelectedDates([...selectedDates, '']);
  // };

  // const handleConfirmInterview = () => {
  //   // Submit logic here (API call or local state update)
  //   setInterviewModalOpen(false);
  // };

  
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

        <TextField
          size="small"
          // variant="outlined"
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
          sx={{ width: '300px',   backgroundColor: '#96BEC5' }}
        />
      
      </Box>
      
        
      <Box>
        {activeTab === "all" && (          
          <Stack spacing={3}>
            {filteredApplicants.map((applicant, idx) => (
              <Card key={idx} className="applicant-card" sx={{ borderRadius: 4, boxShadow: 3, p: 3, display: "flex", alignItems: "flex-start", background: "white" }}>
                <Avatar src={applicant.avatar} sx={{ width: 60, height: 60, mr: 3 }} />
                <Box flex={1}>

                  {/* --- Top Section: Name, Title, and Status --- */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{applicant.name}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {applicant.title} • {applicant.experience}
                      </Typography>
                    </Box>
                    <Chip
                      label={applicant.overallStatus}
                      color={getCandidateStatusChipColor(applicant.overallStatus)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* --- Contact Info --- */}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {applicant.email} • {applicant.phone}
                  </Typography>

                  {/* --- Skills Section --- */}
                  <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {applicant.skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* --- Bottom Section: Totals and Actions --- */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      <strong>{applicant.totalApplications}</strong> Total Applications
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenCvModal(applicant)}
                      >
                        View CV
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleActivityModal(applicant)}
                        sx={{ background: "#052353ff", color: "white", fontWeight: 200 }}
                      >
                        View Activity
                      </Button>
                    </Box>
                  </Box>

                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {activeTab === "shortlisted" && (
          <Stack spacing={3}>
            {filteredShortlistedApplicants.map((applicant, idx) => (
              <Card key={idx} className="applicant-card" sx={{ borderRadius: 4, boxShadow: 3, p: 3, display: "flex", alignItems: "flex-start", background: "white" }}>
                <Avatar src={applicant.avatar} sx={{ width: 60, height: 60, mr: 3 }} />
                <Box flex={1}>

                  {/* --- Top Section: Name, Title, and Status --- */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{applicant.name}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {applicant.title} • {applicant.experience}
                      </Typography>
                    </Box>
                    <Chip
                      label={applicant.overallStatus}
                      color={getCandidateStatusChipColor(applicant.overallStatus)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* --- Contact Info --- */}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {applicant.email} • {applicant.phone}
                  </Typography>

                  {/* --- Skills Section --- */}
                  <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {applicant.skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* --- Bottom Section: Totals and Actions --- */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      <strong>{applicant.totalApplications}</strong> Total Applications
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenCvModal(applicant)}
                      >
                        View CV
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleActivityModal(applicant)}
                        sx={{ background: "#052353ff", color: "white", fontWeight: 200 }}
                      >
                        View Activity
                      </Button>
                    </Box>
                  </Box>

                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {activeTab === "hired" && (
          <Stack spacing={3}>
            {filteredHiredApplicants.map((applicant, idx) => (
              <Card key={idx} className="applicant-card" sx={{ borderRadius: 4, boxShadow: 3, p: 3, display: "flex", alignItems: "flex-start", background: "white" }}>
                <Avatar src={applicant.avatar} sx={{ width: 60, height: 60, mr: 3 }} />
                <Box flex={1}>

                  {/* --- Top Section: Name, Title, and Status --- */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{applicant.name}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {applicant.title} • {applicant.experience}
                      </Typography>
                    </Box>
                    <Chip
                      label={applicant.overallStatus}
                      color={getCandidateStatusChipColor(applicant.overallStatus)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* --- Contact Info --- */}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {applicant.email} • {applicant.phone}
                  </Typography>

                  {/* --- Skills Section --- */}
                  <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {applicant.skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* --- Bottom Section: Totals and Actions --- */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      <strong>{applicant.totalApplications}</strong> Total Applications
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenCvModal(applicant)}
                      >
                        View CV
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleActivityModal(applicant)}
                        sx={{ background: "#052353ff", color: "white", fontWeight: 200 }}
                      >
                        View Activity
                      </Button>
                    </Box>
                  </Box>

                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {activeTab === "rejected" && <div>Rejected Applications Content</div>}
      </Box>

      {/* Modal for changing CV status */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>Change CV Status</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Current Status: <strong>{cvStatus.charAt(0).toUpperCase() + cvStatus.slice(1)}</strong>
          </Typography>
          <RadioGroup value={cvStatus} onChange={handleStatusChange}>
            <FormControlLabel value="shortlisted" control={<Radio />} label="Shortlisted" />
            <FormControlLabel value="selected" control={<Radio />} label="Selected" />
            <FormControlLabel value="rejected" control={<Radio />} label="Rejected" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSaveStatus} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for displaying the CV */}
      <Dialog open={cvModalOpen} onClose={handleCloseCvModal} maxWidth="md" fullWidth>
        <DialogTitle>CV of {selectedApplicant?.name}</DialogTitle>
        <DialogContent sx={{ height: '75vh', p: 0 }}>
          <iframe
            src={selectedCvUrl}
            title={`CV of ${selectedApplicant?.name}`}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCvModal} variant="contained">
            Close
          </Button>
        </DialogActions>    
      </Dialog>     

      <Dialog open={activityModalOpen} onClose={handleCloseActivityModal} maxWidth="md" fullWidth>
        <DialogTitle>Activity History for {selectedApplicant?.name}</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'grey.100' }}>
          {selectedApplicant?.activityLog && selectedApplicant.activityLog.length > 0 ? (
            <Stack spacing={2}>
              {selectedApplicant.activityLog.map((activity, index) => (
                <Card key={index} sx={{ p: 2, borderRadius: 2 }}>
                  {/* Card Header: Job Title, Date, and Status */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{activity.jobTitle}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applied on: {activity.appliedDate}
                      </Typography>
                    </Box>
                    <Chip 
                      label={activity.status} 
                      color={getStatusChipColor(activity.status)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* Card Body: Details */}
                  <Stack spacing={1.5}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <QuizIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      Quiz Score: <b style={{ marginLeft: '8px' }}>{activity.quizScore}</b>
                    </Typography>

                    {/*Conditionally render Interview Status*/}
                    {activity.interviewStatus && (
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <InfoIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                        <span><b>Interview Status:</b> {activity.interviewStatus}</span>
                      </Typography>
                    )}

                    {/* Conditionally render Interview Feedback */}
                    {activity.interviewFeedback && (
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <FeedbackIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                        <span><b>Interview Feedback:</b> {activity.interviewFeedback}</span>
                      </Typography>
                    )}

                    {/* Conditionally render Rejection Reason */}
                    {activity.status === 'Rejected' && activity.rejectionReason && (
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
