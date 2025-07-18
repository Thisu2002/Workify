import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Rating,
  Divider,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  FileDownload as DownloadIcon,
  Visibility as ViewIcon
} from "@mui/icons-material";
import "../../styles/Recruiter.css";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedSession, setSelectedSession] = useState(null);
  
  const completedSessions = [
    {
      id: 1,
      candidateName: "Lisathmi Gunasekara",
      candidateAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
      sessionType: "Interview Prep",
      completedDate: "2024-01-12",
      duration: "75 min",
      rating: 5,
      feedback: "Excellent guidance, very helpful! The mock interview really boosted my confidence.",
      notes: "Candidate performed well in the mock interview. Strong technical knowledge but needs to work on explaining complex concepts in simpler terms. Recommended focusing on behavioral questions."
    },
    {
      id: 2,
      candidateName: "Anushka Silva",
      candidateAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
      sessionType: "CV Review",
      completedDate: "2024-01-10",
      duration: "45 min",
      rating: 4,
      feedback: "Good insights on CV structure. Helped me reorganize my experience section effectively.",
      notes: "Reviewed CV and suggested improvements on formatting and content organization. Candidate has good experience but wasn't highlighting achievements effectively."
    },
    {
      id: 3,
      candidateName: "Michael Johnson",
      candidateAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      sessionType: "Career Guidance",
      completedDate: "2024-01-08",
      duration: "60 min",
      rating: 5,
      feedback: "Great advice on transitioning to a leadership role. The resources shared were very valuable.",
      notes: "Discussed career progression from senior developer to tech lead. Shared resources on management skills and recommended networking opportunities."
    },
    {
      id: 4,
      candidateName: "Emma Wade",
      candidateAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      sessionType: "Technical Mentoring",
      completedDate: "2024-01-05",
      duration: "90 min",
      rating: 4,
      feedback: "The code review was thorough and I learned a lot about system design principles.",
      notes: "Reviewed candidate's project architecture. Suggested improvements for scalability and performance. Recommended resources on system design patterns."
    }
  ];
  
  const handleOpenDetails = (session) => {
    setSelectedSession(session);
  };
  
  const handleCloseDetails = () => {
    setSelectedSession(null);
  };
  
  const filteredSessions = completedSessions.filter(session => {
    const matchesSearch = session.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          session.sessionType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && session.sessionType.toLowerCase().includes(filter);
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Session History
      </Typography>
      
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          placeholder="Search sessions..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />
        
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Filter">
            <MenuItem value="all">All Sessions</MenuItem>
            <MenuItem value="cv">CV Review</MenuItem>
            <MenuItem value="interview">Interview Prep</MenuItem>
            <MenuItem value="career">Career Guidance</MenuItem>
            <MenuItem value="technical">Technical Mentoring</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box display="flex" flexDirection="column" gap={2}>
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Card key={session.id} className="history-card-modern">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={session.candidateAvatar} />
                    <Box>
                      <Typography variant="h6">{session.candidateName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.sessionType}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary">
                      {session.completedDate}
                    </Typography>
                    <Typography variant="body2">
                      {session.duration}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                  <Typography variant="subtitle2">Candidate Feedback:</Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Rating value={session.rating} readOnly size="small" />
                    <Typography variant="body2">({session.rating}.0)</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{session.feedback}"
                  </Typography>
                </Box>

                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleOpenDetails(session)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<DownloadIcon />}
                  >
                    Export Report
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Box textAlign="center" p={5}>
            <Typography variant="h6" color="text.secondary">
              No sessions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Session Details Dialog */}
      <Dialog open={Boolean(selectedSession)} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>
          Session Details - {selectedSession?.sessionType}
        </DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold">Candidate</Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar src={selectedSession?.candidateAvatar} />
              <Typography>{selectedSession?.candidateName}</Typography>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">Session Information</Typography>
            <Box mb={2}>
              <Typography variant="body2">
                <strong>Date:</strong> {selectedSession?.completedDate}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {selectedSession?.duration}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {selectedSession?.sessionType}
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">Your Notes</Typography>
            <Typography variant="body2" paragraph>
              {selectedSession?.notes}
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">Candidate Feedback</Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Rating value={selectedSession?.rating || 0} readOnly />
              <Typography>({selectedSession?.rating}.0/5.0)</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              "{selectedSession?.feedback}"
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>Export Report</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default History;
