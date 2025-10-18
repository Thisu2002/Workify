import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Chip,
  Grid,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

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
  { id: 11, name: "AWS" },
];

const dummyQuizzes = [
  "UI Developer Fundamentals Quiz",
  "React Advanced Concepts Quiz",
  "JavaScript Core Knowledge Quiz",
  "Frontend Architecture Quiz",
  "CSS & Design Systems Quiz",
];

const PostJob = ({setShowJobForm, fetchPosts}) => {
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
    additionalComments: "",
    quiz: "",
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showInterviewSection, setShowInterviewSection] = useState(false);
  const [interviewRounds, setInterviewRounds] = useState([
    { roundNumber: 1, panelId: "", roundName: "" },
  ]);
  const [panels, setPanels] = useState([]);
  const [customSkill, setCustomSkill] = useState("");

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/recruiter/fetchPanels",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const mapped = res.data.map((panel) => ({
          id: panel._id,
          name: panel.name,
        }));
        setPanels(mapped);
        //console.log(mapped);
      } catch (err) {
        toast.error(err.res?.data?.error || "Failed to fetch panels");
        console.error(err);
      }
    };

    fetchPanels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "experienceYears" && Number(value) < 0) {
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const toggleSkill = (id) => {
    setSelectedSkills((prev) =>
      prev.includes(id)
        ? prev.filter((skillId) => skillId !== id)
        : [...prev, id]
    );
  };

  const handleInterviewChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRounds = [...interviewRounds];
    updatedRounds[index] = {
      ...updatedRounds[index],
      [name]: value,
    };
    setInterviewRounds(updatedRounds);
  };

  const addRound = () => {
    setInterviewRounds([
      ...interviewRounds,
      { roundNumber: interviewRounds.length + 1, panelId: "", roundName: "" },
    ]);
  };

  const removeRound = (index) => {
    if (interviewRounds.length > 1) {
      const updatedRounds = interviewRounds
        .filter((_, i) => i !== index)
        .map((round, idx) => ({ ...round, roundNumber: idx + 1 }));
      setInterviewRounds(updatedRounds);
    }
  };

  const handleJobDetailsSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.salary) {
      toast.error("Please fill all required fields");
      return;
    }
    setShowInterviewSection(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate interview rounds
    const invalidRound = interviewRounds.some(
      (round) => !round.panelId || !round.roundName
    );
    if (invalidRound) {
      toast.error("Please fill all interview round details");
      return;
    }

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
              field: form.educationField,
            },
          ],
          experience: {
            years: parseInt(form.experienceYears) || 0,
            description: form.experienceDescription,
          },
          qualifications: form.requiredQualifications
            .split(",")
            .filter(Boolean)
            .map((q) => ({
              name: q.trim(),
              required: true,
            })),
          preferred_qualifications: form.preferredQualifications
            .split(",")
            .filter(Boolean)
            .map((q) => ({
              name: q.trim(),
              required: false,
            })),
          comments: form.additionalComments,
          interview_rounds: interviewRounds.map((round) => ({
            round_number: round.roundNumber,
            round_name: round.roundName,
            panel_id: round.panelId,
          })),
          quiz: form.quiz,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        additionalComments: "",
        quiz: "",
      });
      setSelectedSkills([]);
      setInterviewRounds([{ roundNumber: 1, panelId: "", roundName: "" }]);
      setShowInterviewSection(false);
      setShowJobForm(false);
      // navigate("/recruiter/job-posts");
      // window.location.reload();
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post job");
    }
  };

  const handleBackToJobDetails = () => {
    setShowInterviewSection(false);
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 800, mx: "auto", p: 4, mt: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Post a Job
      </Typography>

      {!showInterviewSection ? (
        <Box component="form" onSubmit={handleJobDetailsSubmit}>
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
          {/* Location and Job Type */}
          <Grid container spacing={4} sx={{ width: "100%" }}>
            <Grid item xs={6}>
              <TextField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Job Type"
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="e.g. Full-time, Part-time, Contract"
              />
            </Grid>
          </Grid>

          {/* Salary and Deadline */}
          <Grid container spacing={4} sx={{ width: "100%" }}>
            <Grid item xs={6}>
              <TextField
                label="Salary"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                fullWidth
                required
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

          {/* Field of Study and Education Level */}
          <Grid container spacing={4} sx={{ width: "100%" }}>
            <Grid item xs={6}>
              <TextField
                label="Field of Study"
                name="educationField"
                value={form.educationField}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="e.g. Computer Science"
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

          {/* Experience Years and Description */}
          <Grid container spacing={4} sx={{ width: "100%" }}>
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
            <Grid container spacing={1} alignItems="center">
              {dummySkills.map((skill) => (
                <Grid item key={skill.id}>
                  <Chip
                    label={skill.name}
                    color={
                      selectedSkills.includes(skill.id) ? "primary" : "default"
                    }
                    onClick={() => toggleSkill(skill.id)}
                    clickable
                    sx={{ fontSize: 14 }}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Add Custom Skill"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  fullWidth
                  margin="normal"
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Continue
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Interview Rounds Setup
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Please define the interview rounds and assign panels for each round.
          </Typography>

          {interviewRounds.map((round, index) => (
            <Box
              key={index}
              sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Round {round.roundNumber}
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Round Name"
                    name="roundName"
                    value={round.roundName}
                    onChange={(e) => handleInterviewChange(index, e)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item>
                  <TextField
                    select
                    label="Select Panel"
                    name="panelId"
                    value={round.panelId}
                    onChange={(e) => handleInterviewChange(index, e)}
                    sx={{ width: 200 }}
                    fullWidth
                    required
                  >
                    {panels.map((panel) => (
                      <MenuItem key={panel.id} value={panel.id}>
                        {panel.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={1}>
                  {index > 0 && (
                    <IconButton
                      onClick={() => removeRound(index)}
                      color="error"
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}

          <Button
            startIcon={<AddCircleIcon />}
            onClick={addRound}
            variant="outlined"
            sx={{ mb: 3 }}
          >
            Add Another Round
          </Button>

          <Box sx={{ mb: 3 }}>
            <TextField
              select
              label="Select Quiz"
              name="quiz"
              value={form.quiz}
              onChange={handleChange}
              fullWidth
            >
              {dummyQuizzes.map((quiz, index) => (
                <MenuItem key={index} value={quiz}>
                  {quiz}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                onClick={handleBackToJobDetails}
                variant="outlined"
                fullWidth
              >
                Back to Job Details
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Post Job
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default PostJob;
