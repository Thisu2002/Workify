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
    salary: "",
    jobType: "",
    deadline: "",
    educationLevel: "",
    educationField: "",
    experienceYears: "",
    experienceDescription: "",
    requiredQualifications: "",
    preferredQualifications: "",
    additionalComments: ""
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
          title: form.title,
          description: form.description,
          location: form.location,
          salary: form.salary,
          jobType: form.jobType,
          deadline: form.deadline,
          skills: selectedSkills,
          education_requirements: [
            {
              level: form.educationLevel,
              field: form.educationField
            }
          ],
          experience: {
            years: parseInt(form.experienceYears) || 0,
            description: form.experienceDescription
          },
          qualifications: form.requiredQualifications
            .split(",")
            .filter(Boolean)
            .map((q) => ({
              name: q.trim(),
              required: true
            })),
          preferred_qualifications: form.preferredQualifications
            .split(",")
            .filter(Boolean)
            .map((q) => ({
              name: q.trim(),
              required: false
            })),
          comments: form.additionalComments
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(response.data.message || "Job posted successfully!");
      setForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        jobType: "",
        deadline: "",
        educationLevel: "",
        educationField: "",
        experienceYears: "",
        experienceDescription: "",
        requiredQualifications: "",
        preferredQualifications: "",
        additionalComments: ""
      });
      setSelectedSkills([]);
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Job Type"
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Application Deadline"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="MM/DD/YYYY"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Education Level"
              name="educationLevel"
              value={form.educationLevel}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="e.g. Bachelors, Masters"
            />
          </Grid>
        </Grid>
        <TextField
          label="Field of Study"
          name="educationField"
          value={form.educationField}
          onChange={handleChange}
          fullWidth
          margin="normal"
          placeholder="e.g. Computer Science"
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Experience (Years)"
              name="experienceYears"
              type="number"
              value={form.experienceYears}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Experience Description"
              name="experienceDescription"
              value={form.experienceDescription}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <TextField
          label="Required Qualifications (comma-separated)"
          name="requiredQualifications"
          value={form.requiredQualifications}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          minRows={2}
        />
        <TextField
          label="Preferred Qualifications (comma-separated)"
          name="preferredQualifications"
          value={form.preferredQualifications}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          minRows={2}
        />
        <TextField
          label="Additional Comments"
          name="additionalComments"
          value={form.additionalComments}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          minRows={2}
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
