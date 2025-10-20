import { ArrowForward } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Stack,
  Chip,
  Autocomplete,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const JobDetails = ({
  dummySkills,
  open,
  job,
  isEditing,
  editedJob,
  setEditedJob,
  handleClose,
  handleChange,
  handleEditToggle,
  handleSave,
  handleDelete,
}) => {
  const navigate = useNavigate();
  const [panels, setPanels] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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

  // Helpers
  const renderEducationRequirements = (eduReqs) =>
    eduReqs?.map((edu, idx) => (
      <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
        • {edu.level} in {edu.field}
      </Typography>
    ));

  const renderQualifications = (quals) =>
    quals?.map((q, idx) => (
      <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
        • {q.name} {q.required ? "(Required)" : "(Preferred)"}
      </Typography>
    ));

  const handleSkillsChange = (event, newValue) => {
    const newSkillIds = newValue.map((skill) => skill.id);
    setEditedJob({
      ...editedJob,
      skills: newSkillIds,
    });
  };

  const selectedSkillsObjects = dummySkills.filter((skill) =>
    editedJob?.skills?.includes(skill.id)
  );

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      padding={20}
    >
      <DialogTitle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {isEditing ? "Edit Job Post" : job?.title}
        <Button
          endIcon={<ArrowForward />}
          onClick={() => navigate(`/recruiter/job-posts/applicants/${job?._id}`)}
        >
          View Applicants
        </Button>
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
            <TextField
              label="Salary"
              name="salary"
              value={editedJob?.salary || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Job Type"
              name="jobType"
              value={editedJob?.jobType || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Application Deadline"
              name="deadline"
              type="date"
              value={
                editedJob?.deadline
                  ? new Date(editedJob.deadline).toISOString().substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <Autocomplete
              multiple
              options={dummySkills}
              getOptionLabel={(option) => option.name}
              value={selectedSkillsObjects}
              onChange={handleSkillsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option.id}
                    sx={{ fontWeight: 500 }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Select skills"
                />
              )}
              sx={{ mt: 1 }}
            />

            {/* Education Requirements */}
            <TextField
              label="Education Level"
              name="education_requirements.0.level"
              value={editedJob?.education_requirements?.[0]?.level || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Education Field"
              name="education_requirements.0.field"
              value={editedJob?.education_requirements?.[0]?.field || ""}
              onChange={handleChange}
              fullWidth
            />

            {/* Experience */}
            <TextField
              label="Experience Years"
              name="experience.years"
              type="number"
              inputProps={{ min: 0 }}
              value={editedJob?.experience?.years || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Experience Description"
              name="experience.description"
              value={editedJob?.experience?.description || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />

            {/* Qualifications */}
            <TextField
              label="Required Qualifications (comma separated)"
              name="qualifications"
              value={
                editedJob?.qualifications?.map((q) => q.name).join(", ") || ""
              }
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Preferred Qualifications (comma separated)"
              name="preferred_qualifications"
              value={
                editedJob?.preferred_qualifications
                  ?.map((q) => q.name)
                  .join(", ") || ""
              }
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Additional Comments"
              name="comments"
              value={editedJob?.comments || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        ) : (
          <>
            {job?.description && (
              <Box mt={2}>
                <Typography variant="body1">{job.description}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" alignItems="center" gap={3}>
              {job?.location && (
                <Typography variant="subtitle1">
                  <strong>Location:</strong> {job.location}
                </Typography>
              )}

              {job?.salary && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="subtitle1">
                    <strong>Salary:</strong> {job.salary}
                  </Typography>
                </>
              )}

              {job?.jobType && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="subtitle1">
                    <strong>Job Type:</strong> {job.jobType}
                  </Typography>
                </>
              )}
            </Box>

            {job?.deadline &&
              (() => {
                const today = new Date();
                const deadlineDate = new Date(job.deadline);
                const timeDiff = deadlineDate - today;
                const daysRemaining = Math.ceil(
                  timeDiff / (1000 * 60 * 60 * 24)
                );

                let statusText = "";

                if (daysRemaining < 0) {
                  statusText = "Closed";
                } else {
                  statusText = `Expires in ${daysRemaining} day${
                    daysRemaining !== 1 ? "s" : ""
                  }`;
                }

                return (
                  <Typography mt={2} variant="subtitle2">
                    Application Deadline: {deadlineDate.toLocaleDateString()}{" "}
                    <span style={{ color: "red", fontWeight: 500 }}>
                      ({statusText})
                    </span>
                  </Typography>
                );
              })()}

            <Divider sx={{ my: 2 }} />

            {job?.skills?.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Skills Required:
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap", mt: 1 }}
                >
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
              </Box>
            )}

            <Box display="flex" mt={2} gap={5}>
              {job?.experience?.years !== undefined && (
                <Box mt={2} flex={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Experience:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: job.experience.description ? 1 : 0 }}
                  >
                    {job.experience.years} year
                    {job.experience.years !== 1 ? "s" : ""} experience
                  </Typography>
                  {job.experience.description && (
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {job.experience.description}
                    </Typography>
                  )}
                </Box>
              )}

              {job?.education_requirements?.length > 0 && (
                <Box mt={2} flex={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Education Requirements:
                  </Typography>
                  {renderEducationRequirements(job.education_requirements)}
                </Box>
              )}
            </Box>

            <Box display="flex" mt={2} gap={10}>
              {job?.qualifications?.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Qualifications:
                  </Typography>
                  {renderQualifications(job.qualifications)}
                </Box>
              )}

              {job?.preferred_qualifications?.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Preferred Qualifications:
                  </Typography>
                  {renderQualifications(job.preferred_qualifications)}
                </Box>
              )}
            </Box>

            {job?.comments && (
              <Box mt={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Additional Comments:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {job.comments}
                </Typography>
              </Box>
            )}

            {job?.interview_rounds?.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Interview Process:
                </Typography>
                {job.interview_rounds.map((round, idx) => (
                  <Box key={idx} mt={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Round {round.round_number}: {round.round_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", ml: 1 }}
                    >
                      Panel:{" "}
                      {panels?.find((panel) => panel.id === round.panel_id)
                        ?.name || `Panel ID: ${round.panel_id}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", width: "100%", p: 2 }}
      >
        {/* Left-aligned Delete */}
        <Box>
          <Button
            variant="outlined"
            sx={{
              color: "red !important",
              borderColor: "red !important",
            }}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Delete
          </Button>
        </Box>

        {/* Right-aligned Buttons */}
        <Box display="flex" gap={1}>
          <Button onClick={handleClose}>Cancel</Button>
          {isEditing ? (
            <Button variant="contained" onClick={() => handleSave(editedJob)}>
              Save
            </Button>
          ) : (
            job?.status === "Open" && (
              <Button variant="contained" onClick={handleEditToggle}>
                Edit
              </Button>
            )
          )}
        </Box>
      </DialogActions>
    </Dialog>

    {/*  CONFIRM DELETE POPUP */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmDeleteOpen(false);
              //console.log("Deleting Job Post with ID:", job._id);
              if (handleDelete) handleDelete(job._id); //  trigger parent callback
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobDetails;
