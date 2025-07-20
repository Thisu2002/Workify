// [Imports unchanged]
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Divider,
  InputAdornment,
} from "@mui/material";
import "../../styles/JobPosts.css";
import PostJob from "./PostJob";
import { useNavigate } from "react-router-dom";
import companyLogo from "../../uploads/companyLogo.jpg";
import { Search } from "@mui/icons-material";
import axios from "axios";

const cardColors = [
  "#e5e3f0", // purple-ish
  "#f7e7d7", // beige
  "#e5f3e5", // greenish
  "#f7f3d7", // yellowish
  "#e3eaf7", // blueish
  "#f7e5e5", // pinkish
];

const dummySkills = [
  { id: 1, name: "JavaScript" },
  { id: 2, name: "React" },
  { id: 3, name: "Node.js" },
  { id: 4, name: "MongoDB" },
  { id: 5, name: "UI/UX" },
  { id: 6, name: "Figma" },
  { id: 7, name: "SQL" },
  { id: 8, name: "Azure" },
  { id: 9, name: "API Design" },
  { id: 10, name: "Cloud" },
];

const JobPosts = ({ showJobForm, setShowJobForm }) => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/recruiter/jobPosts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const posts = res.data.map((p) => {
          const daysAgo = Math.floor(
            (Date.now() - new Date(p.date_posted)) / (1000 * 60 * 60 * 24)
          );
          return {
            ...p,
            id: p._id,
            rate: p.salary ? `$${p.salary}/hr` : "",
            numApplicants: Math.floor(Math.random() * 50) + 1,
            postedAgo: daysAgo,
          };
        });
        setOpenJobs(posts.filter((p) => p.status === "Open"));
        setClosedJobs(posts.filter((p) => p.status === "Closed"));
      } catch (err) {
        console.error("Error fetching posts", err);
      }
    };
    fetchPosts();
  }, []);

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

  const handleEditToggle = () => setIsEditing(true);

  const handleChange = (e) =>
    setEditedJob({ ...editedJob, [e.target.name]: e.target.value });

  const handleSave = () => {
    setSelectedJob(editedJob);
    setIsEditing(false);
  };

  const renderJobCard = (job, index) => (
    <Card
      key={job.id}
      className="job-card"
      sx={{ backgroundColor: cardColors[index % cardColors.length] }}
      onClick={() => handleJobClick(job)}
    >
      <CardContent sx={{ pb: "8px !important" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Typography className="job-rate">{job.rate}</Typography>
          <Typography className={`job-status ${job.status.toLowerCase()}`}>
            {job.status}
          </Typography>
        </Box>
        <Typography className="job-title">{job.title}</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
          {job.skills.map((skillId, idx) => {
            const skill = dummySkills.find((s) => s.id === skillId);
            return (
              <Chip
                key={idx}
                label={skill?.name || skillId}
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
            );
          })}
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
      {/* Search and Filter Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Search Job Posts
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, company, or keyword..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        {/* Filter chips could go here */}
      </Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Open Job Posts
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3} className="job-grid">
        {openJobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            {renderJobCard(job, index)}
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight={700} sx={{ mt: 5, mb: 3 }}>
        Closed Job Posts
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3} className="job-grid">
        {closedJobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            {renderJobCard(job, index)}
          </Grid>
        ))}
      </Grid>

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
              <Box mt={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Skills Required:
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap", mt: 1 }}
                >
                  {selectedJob?.skills?.map((skillId, idx) => {
                    const skill = dummySkills.find((s) => s.id === skillId);
                    return (
                      <Chip
                        key={idx}
                        label={skill?.name || skillId}
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
                    );
                  })}
                </Stack>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/recruiter/job-posts/applicants")}>
            View Applicants
          </Button>
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

      <Dialog open={Boolean(showJobForm)} fullWidth maxWidth="sm">
        <PostJob />
        <DialogActions>
          <Button onClick={() => setShowJobForm(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobPosts;
