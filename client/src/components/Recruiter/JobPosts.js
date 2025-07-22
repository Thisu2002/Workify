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
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../../styles/JobPosts.css";
import PostJob from "./PostJob";
import { useNavigate } from "react-router-dom";
import companyLogo from "../../uploads/companyLogo.jpg";
import { Search } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import JobDetails from "./JobDetails";

const cardColors = [
  "#e5e3f0",
  "#f7e7d7",
  "#e5f3e5",
  "#f7f3d7",
  "#e3eaf7",
  "#f7e5e5",
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuJob, setMenuJob] = useState(null);

  const menuOpen = Boolean(anchorEl);

  // New State for Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [activeTab, setActiveTab] = useState("open");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/recruiter/jobPosts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleMenuClick = (e, job) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setMenuJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuJob(null);
  };

  const handleStatusToggle = async () => {
    if (!menuJob) return;
    const newStatus = menuJob.status === "Open" ? "Closed" : "Open";

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/recruiter/changeJobStatus",
        {
          jobId: menuJob.id,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "Status updated successfully!");
      const updatedJob = { ...menuJob, status: newStatus };
      setOpenJobs((prev) => prev.filter((job) => job.id !== menuJob.id));
      setClosedJobs((prev) => prev.filter((job) => job.id !== menuJob.id));

      if (newStatus === "Open") {
        setOpenJobs((prev) => [...prev, updatedJob]);
      } else {
        setClosedJobs((prev) => [...prev, updatedJob]);
      }

      handleMenuClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update status");
      handleMenuClose();
      console.error("Failed to update job status", err);
    }
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              className={`job-status ${job.status.toLowerCase()}`}
              sx={{ mr: 1 }}
            >
              {job.status}
            </Typography>
            <IconButton size="small" onClick={(e) => handleMenuClick(e, job)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography className="job-title">{job.title}</Typography>
        <Typography
          className="job-description"
          sx={{
            color: "#555",
            mt: -3,
            mb: 3,
            ml: 5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {job.description}
        </Typography>
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

  // Filtering
  const filterJobs = (jobs) =>
    jobs.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((id) => job.skills.includes(id));
      const matchesExperience = (() => {
        if (!selectedExperience) return true;
        const years = job.experience?.years || 0;
        if (selectedExperience === "0-2") return years <= 2;
        if (selectedExperience === "3-5") return years >= 3 && years <= 5;
        if (selectedExperience === "6-10") return years >= 6 && years <= 10;
        if (selectedExperience === "10+") return years > 10;
        return true;
      })();
      return matchesTitle && matchesSkills && matchesExperience;
    });

  const filteredOpenJobs = filterJobs(openJobs);
  const filteredClosedJobs = filterJobs(closedJobs);

  return (
    <Box className="job-posts-container" sx={{ py: 4 }}>
      {/* Tabs for Open / Closed */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Open Jobs" value="open" />
        <Tab label="Closed Jobs" value="closed" />
      </Tabs>

      {/* Filter Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Filter by Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Skills</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {dummySkills.map((skill) => (
              <Chip
                key={skill.id}
                label={skill.name}
                variant={selectedSkills.includes(skill.id) ? "filled" : "outlined"}
                onClick={() => {
                  setSelectedSkills((prev) =>
                    prev.includes(skill.id)
                      ? prev.filter((id) => id !== skill.id)
                      : [...prev, skill.id]
                  );
                }}
                clickable
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Experience</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {["0-2", "3-5", "6-10", "10+"].map((range) => (
              <Chip
                key={range}
                label={`${range} yrs`}
                variant={selectedExperience === range ? "filled" : "outlined"}
                onClick={() => setSelectedExperience(range)}
                clickable
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3} className="job-grid">
        {(activeTab === "open" ? filteredOpenJobs : filteredClosedJobs).map(
          (job, index) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              {renderJobCard(job, index)}
            </Grid>
          )
        )}
      </Grid>

      <JobDetails
        dummySkills={dummySkills}
        open={Boolean(selectedJob)}
        job={selectedJob}
        isEditing={isEditing}
        editedJob={editedJob}
        setEditedJob={setEditedJob}
        handleClose={handleClose}
        handleChange={handleChange}
        handleEditToggle={handleEditToggle}
        handleSave={handleSave}
      />

      <Dialog open={Boolean(showJobForm)} fullWidth maxWidth="sm">
        <PostJob />
        <DialogActions>
          <Button onClick={() => setShowJobForm(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleStatusToggle}>
          {menuJob?.status === "Open" ? "Mark as Closed" : "Reopen Job"}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default JobPosts;
