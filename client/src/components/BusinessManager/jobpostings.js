import React, { useState, useEffect } from "react";
import axios from "axios";
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
import companyLogo from "../../uploads/companyLogo.jpg";

const cardColors = [
  "#e5e3f0",
  "#f7e7d7",
  "#e5f3e5",
  "#f7f3d7",
  "#e3eaf7",
  "#f7e5e5",
];

const JobPostings = () => {
  const [openJobs, setOpenJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // match server mount in server/index.js -> app.use('/manager', ...)
        const res = await axios.get("http://localhost:5000/manager/jobPosts");
        console.log("GET /manager/jobPosts ->", res.status, res.data);

        // support different response shapes
        const jobs = Array.isArray(res.data)
          ? res.data
          : res.data?.jobPosts || res.data?.posts || res.data?.jobs || [];

        console.log(`received ${jobs.length} job posts`);

        // case-insensitive splitting by status
        setOpenJobs(jobs.filter(j => (j.status || "").toLowerCase() === "open"));
        setClosedJobs(jobs.filter(j => (j.status || "").toLowerCase() === "closed"));

        // temporary debug: show all if filters removed
        // setOpenJobs(jobs);
        // setClosedJobs([]);
      } catch (err) {
        console.error("Error fetching job posts:", err.response?.status, err.response?.data || err.message);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (job) => setSelectedJob(job);
  const handleClose = () => setSelectedJob(null);

  const renderJobCard = (job, idx) => (
    <Card
      key={job._id || idx}
      className="job-card"
      sx={{ backgroundColor: cardColors[idx % cardColors.length] }}
      onClick={() => handleJobClick(job)}
    >
      <CardContent sx={{ pb: "8px !important" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Typography className="job-rate">{job.salary || "N/A"}</Typography>
          <Typography className={`job-status ${job.status?.toLowerCase()}`}>{job.status}</Typography>
        </Box>
        <Typography className="job-title">{job.title}</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
          {job.skills?.map((skill, idx) => (
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
          <img src={companyLogo} alt={job.title} className="job-logo" />
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: "1rem" }}>
              {job.jobType || "N/A"}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
              Posted on {new Date(job.date_posted).toLocaleDateString()}
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
        {openJobs.map((job, idx) => (
          <Grid item xs={12} sm={6} md={4} key={job._id || idx}>
            {renderJobCard(job, idx)}
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight={700} sx={{ mt: 5, mb: 3 }}>
        Closed Job Posts
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3} className="job-grid">
        {closedJobs.map((job, idx) => (
          <Grid item xs={12} sm={6} md={4} key={job._id || idx}>
            {renderJobCard(job, idx)}
          </Grid>
        ))}
      </Grid>

      {/* Dialog for detailed job info */}
      <Dialog open={Boolean(selectedJob)} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedJob?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1"><strong>Location:</strong> {selectedJob?.location || "N/A"}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{selectedJob?.description || "No description available."}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}><strong>Salary:</strong> {selectedJob?.salary || "N/A"}</Typography>
          <Typography variant="subtitle1"><strong>Job Type:</strong> {selectedJob?.jobType || "N/A"}</Typography>
          <Typography variant="subtitle1"><strong>Deadline:</strong> {selectedJob?.deadline || "N/A"}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}><strong>Education Requirements:</strong></Typography>
          <ul>
            {selectedJob?.education_requirements?.map((edu, idx) => (
              <li key={idx}>
                {edu.level} {edu.field && `in ${edu.field}`}
              </li>
            ))}
          </ul>
          {/* <Box mt={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Skills Required:</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
              {selectedJob?.skills?.map((skill, idx) => (
                <Chip key={idx} label={skill} variant="outlined"
                  sx={{ borderRadius: "16px", fontWeight: 500, fontSize: "0.97rem", borderColor: "#d1d5db", color: "#222", mb: 0.5 }} />
              ))}
            </Stack>
          </Box> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobPostings;
