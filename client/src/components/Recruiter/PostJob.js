import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Chip,
  Grid
} from "@mui/material";

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

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSkill = (id) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((skillId) => skillId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to post a job.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/recruiter/postJob",
        {
          ...form,
          skills: selectedSkills
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(response.data.message || "Job posted successfully!");
      setForm({ title: "", description: "", location: "", salary: "" });
      setSelectedSkills([]);
      //navigate to the job posts page
      window.location.href = "/recruiter/job-posts";
    
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post job");
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", p: 4, mt: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Post a Job
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Job Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          minRows={3}
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Salary"
          name="salary"
          type="number"
          value={form.salary}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Required Skills
          </Typography>
          <Grid container spacing={1}>
            {dummySkills.map((skill) => (
              <Grid item key={skill.id}>
                <Chip
                  label={skill.name}
                  color={selectedSkills.includes(skill.id) ? "primary" : "default"}
                  onClick={() => toggleSkill(skill.id)}
                  clickable
                  sx={{ fontSize: 14 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Post Job
        </Button>
      </Box>
    </Paper>
  );
};

export default PostJob;
