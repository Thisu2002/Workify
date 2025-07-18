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
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField
} from "@mui/material";
import {
  Description as CvIcon,
  FactCheck as QuizIcon,
  Update as UpdateIcon
} from "@mui/icons-material";
import "../../styles/Recruiter.css";

const tabOptions = [
  { label: "New", value: "new" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Selected", value: "selected" },
  { label: "Rejected", value: "rejected" },
];

// Using a publicly available dummy PDF for demonstration.
const dummyCvUrl = "https://upload.wikimedia.org/wikipedia/commons/c/cc/Resume.pdf";

const newApplicants = [
  {
    name: "John Doe",
    experience: "2 years • Frontend Development",
    skills: ["React", "TypeScript", "CSS"],
    job: "Senior Software Engineer",
    quiz: "85",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2024-01-15",
    priority: "medium",
    cvUrl: dummyCvUrl
  },
  {
    name: "Elizabeth Martin",
    experience: "3 years • Backend Development",
    skills: ["Node.js", "Express", "MongoDB"],
    job: "Backend Developer",
    quiz: "90",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2024-01-14",
    priority: "high"
  },
  {
    name: "Emma Wade",
    experience: "1 year • UI/UX Design",
    skills: ["Figma", "Sketch", "Adobe XD"],
    job: "Product Designer",
    quiz: "78",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    date: "2024-01-13",
    priority: "low"
  },
  {
    name: "Teresa Reyes",
    experience: "4 years • Project Management",
    skills: ["Agile", "Scrum", "Jira"],
    job: "Design Lead",
    quiz: "88",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    date: "2024-01-12",
    priority: "medium"
  },
  {
    name: "Crystal Austin",
    experience: "2 years • Marketing",
    skills: ["SEO", "Content Writing", "Analytics"],
    job: "Marketing Manager",
    quiz: "82",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    date: "2024-01-11",
    priority: "high"
  },
];

const shortlistedApplicants = [
  {
    name: "John Doe",
    experience: "2 years • Frontend Development",
    skills: ["React", "TypeScript", "CSS"],
    job: "Senior Software Engineer",
    quiz: "85",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2024-01-15",
    priority: "medium",
    cvUrl: dummyCvUrl
  },
  {
    name: "Elizabeth Martin",
    experience: "3 years • Backend Development",
    skills: ["Node.js", "Express", "MongoDB"],
    job: "Backend Developer",
    quiz: "90",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2024-01-14",
    priority: "high"
  },
  {
    name: "Emma Wade",
    experience: "1 year • UI/UX Design",
    skills: ["Figma", "Sketch", "Adobe XD"],
    job: "Product Designer",
    quiz: "78",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    date: "2024-01-13",
    priority: "low"
  },
];

const Applications = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [cvStatus, setCvStatus] = useState("");
  
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [selectedCvUrl, setSelectedCvUrl] = useState('');

  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState('');
  const [selectedDates, setSelectedDates] = useState(['', '', '']); // initialize with 3 empty dates

  const availablePanels = [
    { id: 'panel1', name: 'Engineering Panel A' },
    { id: 'panel2', name: 'Marketing Panel B' },
    { id: 'panel3', name: 'Product Panel C' }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenModal = (applicant) => {
    setSelectedApplicant(applicant);
    setCvStatus(applicant.status || "new");
    setModalOpen(true);
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

  // NEW: Handlers for opening and closing the CV modal
  const handleOpenCvModal = (applicant) => {
    setSelectedApplicant(applicant); // Set the applicant to show their name in the title
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

  const handleCloseInterviewModal = () => {
    setInterviewModalOpen(false);
    setSelectedPanel('');
    setSelectedDates(['', '', '']);
  };

  const handleDateChange = (index, value) => {
    const newDates = [...selectedDates];
    newDates[index] = value;
    setSelectedDates(newDates);
  };

  const handleAddDateField = () => {
    setSelectedDates([...selectedDates, '']);
  };

  const handleConfirmInterview = () => {
    // Submit logic here (API call or local state update)
    setInterviewModalOpen(false);
  };

  
  return (
    <Box>
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
        
      <Box>
        {activeTab === "new" && (
          <Stack spacing={3}>
            {newApplicants.map((applicant, idx) => (
              <Card key={idx} className="applicant-card" sx={{ borderRadius: 4, boxShadow: 2, p: 2, display: "flex", alignItems: "flex-start", background: "white" }}>
                <Avatar src={applicant.avatar} sx={{ width: 56, height: 56, mr: 3, mt: 1 }} />
                <Box flex={1}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6" fontWeight="bold">{applicant.name}</Typography>
                      <Chip label={`Applied For: ${applicant.job}`} size="small" sx={{ fontWeight: 600, ml: 2, p: 1 }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">Applied On: {applicant.date}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {applicant.experience}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1, color: "#111" }} >
                    <QuizIcon sx={{ mr: 1 }} />
                    Quiz Score: <span style={{ fontWeight: 600, marginLeft: 6 }}>{applicant.quiz}</span>
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button 
                      variant="outlined" 
                      startIcon={<CvIcon />} 
                      size="small"
                      onClick={() => handleOpenCvModal(applicant)}
                      >
                      View CV
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<UpdateIcon />}
                      size="small"
                      onClick={() => handleOpenModal(applicant)}
                      > 
                      Change Status
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>      
        )}

        {activeTab === "shortlisted" && (
          <Stack spacing={3}>
            {shortlistedApplicants.map((applicant, idx) => (
              <Card key={idx} sx={{ borderRadius: 4, boxShadow: 2, p: 2, display: "flex", alignItems: "flex-start", background: "linear-gradient(90deg,#eaf6fa 0%,#fafdff 100%)" }}>
                <Avatar src={applicant.avatar} sx={{ width: 56, height: 56, mr: 3, mt: 1 }} />
                <Box flex={1}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6" fontWeight="bold">{applicant.name}</Typography>
                      <Chip label={`Applied For: ${applicant.job}`} size="small" sx={{ fontWeight: 600, ml: 2, p: 1 }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">Applied On: {applicant.date}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {applicant.experience}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ display: "flex", alignItems: "center", mb: 1,  }} >
                    <QuizIcon sx={{ mr: 1 }} />
                    Quiz Score: <span style={{ fontWeight: 600, marginLeft: 6 }}>{applicant.quiz}</span>
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button 
                      variant="outlined" 
                      startIcon={<CvIcon />} 
                      size="small"
                      onClick={() => handleOpenCvModal(applicant)}
                      >
                      View CV
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<UpdateIcon />}
                      size="small"
                      onClick={() => handleOpenInterviewModal(applicant)}
                      > 
                      Call for Interview
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {activeTab === "selected" && <div>Selected Applications Content</div>}
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

      {/* NEW: Modal for displaying the CV */}
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

      <Dialog open={interviewModalOpen} onClose={handleCloseInterviewModal} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Interview for {selectedApplicant?.name}</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Assign Interview Panel</InputLabel>
            <Select
              value={selectedPanel}
              onChange={(e) => setSelectedPanel(e.target.value)}
              label="Assign Interview Panel"
            >
              {availablePanels.map((panel) => (
                <MenuItem key={panel.id} value={panel.id}>{panel.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>Choose Available Dates (minimum 3)</Typography>
          <Stack spacing={2}>
            {selectedDates.map((date, index) => (
              <TextField
                key={index}
                type="date"
                value={date}
                onChange={(e) => handleDateChange(index, e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            ))}
            <Button
              variant="outlined"
              onClick={handleAddDateField}
              disabled={selectedDates.length >= 5}
            >
              Add Another Date
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInterviewModal} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmInterview} color="primary" variant="contained">Send Invitation</Button>
        </DialogActions>
      </Dialog>  

    </Box>
  );
};

export default Applications;
