import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import "../../styles/JobPosts.css";
import PostJob from "./PostJob";
import { useNavigate } from "react-router-dom";

const JobPosts = ({ showJobForm, setShowJobForm }) => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(null);

  const openJobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Solutions",
      location: "Remote",
      description: "Looking for a skilled software engineer to join our team.",
      status: "Open",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovate Inc.",
      location: "New York, NY",
      description:
        "Seeking a product manager with experience in agile methodologies.",
      status: "Open",
    },
  ];

  const closedJobs = [
    {
      id: 3,
      title: "Data Analyst",
      company: "Data Insights",
      location: "San Francisco, CA",
      description: "Closed position for a data analyst role.",
      status: "Closed",
    },
    {
      id: 4,
      title: "UX Designer",
      company: "Creative Agency",
      location: "Los Angeles, CA",
      description: "Closed position for a UX designer role.",
      status: "Closed",
    },
  ];

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setEditedJob(job);
    setIsEditing(false);
  };

  const handleClose = () => {
    setSelectedJob(null);
    setIsEditing(false);
    setShowJobForm(false);
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditedJob({ ...editedJob, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // In real app: send editedJob to API
    setSelectedJob(editedJob); // Simulate update
    setIsEditing(false);
  };

  return (
    <div className="job-posts-container">
      <h2>Open Job Posts</h2>
      <div className="job-list">
        {openJobs.map((job) => (
          <div
            key={job.id}
            className="job-post"
            onClick={() => handleJobClick(job)}
          >
            <h3>{job.title}</h3>
            <p>
              <strong>Company:</strong> {job.company}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>{job.description}</p>
            <p className="status open">{job.status}</p>
          </div>
        ))}
      </div>

      <h2>Closed Job Posts</h2>
      <div className="job-list">
        {closedJobs.map((job) => (
          <div
            key={job.id}
            className="job-post"
            onClick={() => handleJobClick(job)}
          >
            <h3>{job.title}</h3>
            <p>
              <strong>Company:</strong> {job.company}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>{job.description}</p>
            <p className="status closed">{job.status}</p>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog
        open={Boolean(selectedJob)}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditing ? "Edit Job Post" : selectedJob?.title}
        </DialogTitle>

        <DialogContent dividers>
          {isEditing ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Job Title"
                name="title"
                value={editedJob?.title || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Company"
                name="company"
                value={editedJob?.company || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Location"
                name="location"
                value={editedJob?.location || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={editedJob?.description || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          ) : (
            <>
              <Typography variant="subtitle1">
                <strong>Company:</strong> {selectedJob?.company}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Location:</strong> {selectedJob?.location}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedJob?.description}
              </Typography>
              <Box mt={2}>
                <Typography
                  variant="subtitle2"
                  color={selectedJob?.status === "Open" ? "green" : "gray"}
                >
                  Status: {selectedJob?.status}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => navigate('/recruiter/job-posts/applicants')}>View Applicants</Button>
          <Button onClick={handleClose}>Cancel</Button>
          {isEditing ? (
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button variant="contained" onClick={handleEditToggle}>
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(showJobForm)}
        fullWidth
        maxWidth="sm"
      >
        <PostJob />
        <DialogActions>
          <Button onClick={() => setShowJobForm(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobPosts;
