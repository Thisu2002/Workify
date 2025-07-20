import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import "../../styles/JobPostings.css";
import { useNavigate } from "react-router-dom";
import companyLogo from "../../uploads/companyLogo.jpg";

const cardColors = [
  "#e5e3f0", // purple-ish
  "#f7e7d7", // beige
  "#e5f3e5", // greenish
  "#f7f3d7", // yellowish
  "#e3eaf7", // blueish
  "#f7e5e5", // pinkish
];

const openJobs = [
  {
    id: 1,
    title: "Senior UI Developer",
    company: "Nike",
    location: "Remote",
    description: "Looking for a skilled UI developer to join our team.",
    status: "Open",
    rate: "$120/hr",
    role: "Senior UI Developer",
    skills: ["React", "UI/UX", "Figma", "JavaScript", "Teamwork"],
    numApplicants: 12,
    postedAgo: 5,
  },
  {
    id: 2,
    title: "Senior Backend Engineer",
    company: "Google",
    location: "New York, NY",
    description: "Seeking a backend engineer with experience in Node.js.",
    status: "Open",
    rate: "$150/hr",
    role: "Senior Backend Engineer",
    skills: ["Node.js", "API Design", "Cloud", "MongoDB"],
    numApplicants: 3,
    postedAgo: 2,
  },
  {
    id: 3,
    title: "Azure Data Engineer",
    company: "Airbnb",
    location: "San Francisco, CA",
    description: "Looking for an Azure Data Engineer.",
    status: "Open",
    rate: "$125-145/hr",
    role: "Azure Data Engineer",
    skills: ["Azure", "ETL", "SQL", "Python", "Data Warehousing"],
    numApplicants: 12,
    postedAgo: 5,
  },
];

const closedJobs = [
  {
    id: 4,
    title: "Azure Data Engineer",
    company: "Airbnb",
    location: "San Francisco, CA",
    description: "Closed position for an Azure Data Engineer.",
    status: "Closed",
    rate: "$125-145/hr",
    role: "Azure Data Engineer",
    skills: ["Azure", "ETL", "SQL", "Python", "Data Warehousing"],
    numApplicants: 12,
    postedAgo: 5,
  },
  {
    id: 5,
    title: "Senior Backend Engineer",
    company: "Google",
    location: "Remote",
    description: "Closed position for a backend engineer.",
    status: "Closed",
    rate: "$150/hr",
    role: "Senior Backend Engineer",
    skills: ["Node.js", "API Design", "Cloud", "MongoDB"],
    numApplicants: 100,
    postedAgo: 10,
  },
  {
    id: 6,
    title: "Senior UI Developer",
    company: "Nike",
    location: "Remote",
    description: "Closed position for a UI developer.",
    status: "Closed",
    rate: "$120/hr",
    role: "Senior UI Developer",
    skills: ["React", "UI/UX", "Figma", "JavaScript", "Teamwork"],
    numApplicants: 20,
    postedAgo: 12,
  },
];

const JobPostings = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleClose = () => {
    setSelectedJob(null);
  };

  const renderJobCard = (job) => (
    <Card
      key={job.id}
      className="job-card"
      sx={{ backgroundColor: cardColors[job.id % cardColors.length] }}
      onClick={() => handleJobClick(job)}
    >
      <CardContent sx={{ pb: "8px !important" }}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}
        >
          <Typography className="job-rate">{job.rate}</Typography>
          <Typography className={`job-status ${job.status.toLowerCase()}`}>
            {job.status}
          </Typography>
        </Box>
        <Typography className="job-title">{job.title}</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
          {job.skills.map((skill, idx) => (
            <Chip
              key={idx}
              label={skill}
              variant="outlined"
              sx={{
                borderRadius: "16px",
                fontWeight: 500,
                fontSize: "0.97rem",
                borderColor: "#d1d5db",
                color: "#222",
                mb: 0.5,
              }}
            />
          ))}
        </Stack>
      </CardContent>

      <Box className="job-card-footer">
        <Box className="job-company">
          <img src={companyLogo} alt={job.company} className="job-logo" />
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: "1rem" }}>
              {job.role}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
              {job.numApplicants} applicants • Posted {job.postedAgo} days ago
            </Typography>
          </Box>
        </Box>
        <Button
          className="job-view-btn"
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleJobClick(job);
          }}
        >
          View
        </Button>
      </Box>
    </Card>
  );

  return (
    <Box className="job-posts-container" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Open Job Posts
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3} className="job-grid">
        {openJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            {renderJobCard(job)}
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight={700} sx={{ mt: 5, mb: 3 }}>
        Closed Job Posts
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3} className="job-grid">
        {closedJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            {renderJobCard(job)}
          </Grid>
        ))}
      </Grid>

      <Dialog open={Boolean(selectedJob)} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedJob?.title}</DialogTitle>
        <DialogContent dividers>
            <>
              <Typography variant="subtitle1"><strong>Company:</strong> {selectedJob?.company}</Typography>
              <Typography variant="subtitle1"><strong>Location:</strong> {selectedJob?.location}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>{selectedJob?.description}</Typography>
              <Box mt={2}>
                <Typography variant="subtitle2" color={selectedJob?.status === "Open" ? "green" : "gray"}>
                  Status: {selectedJob?.status}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Skills Required:</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
                  {selectedJob?.skills?.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      variant="outlined"
                      sx={{
                        borderRadius: "16px",
                        fontWeight: 500,
                        fontSize: "0.97rem",
                        borderColor: "#d1d5db",
                        color: "#222",
                        mb: 0.5,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobPostings;