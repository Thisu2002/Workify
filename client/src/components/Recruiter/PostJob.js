import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });
  const [postedJob, setPostedJob] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Job posted successfully!");
    setPostedJob(form);
    setForm({ title: "", description: "", location: "", salary: "" });
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 500, mx: "auto", p: 4, mt: 2 }}>
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Post Job
        </Button>
      </Box>

      {postedJob && (
        <Box className="posted-job-details" sx={{ mt: 4, p: 2, bgcolor: "#f5f8fa", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Posted Job Details
          </Typography>
          <Typography><strong>Title:</strong> {postedJob.title}</Typography>
          <Typography><strong>Description:</strong> {postedJob.description}</Typography>
          <Typography><strong>Location:</strong> {postedJob.location}</Typography>
          <Typography><strong>Salary:</strong> {postedJob.salary}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PostJob;