import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Slide,
  Button,
} from "@mui/material";
import {
  Email,
  MoreVert,
  CheckCircle,
  Close as CloseIcon,
  History,
  Description,
} from "@mui/icons-material";

const CandidateDetails = ({ candidate, skills, onClose }) => {
  if (!candidate) return null;

  return (
    <Slide
      direction="left"
      in={!!candidate}
      mountOnEnter
      unmountOnExit
      style={{ zIndex: 2000 }}
    >
      <Box className="candidate-details-panel horizontal-timeline-panel">
        <IconButton
          className="close-icon"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "#f5f5f5",
            boxShadow: 1,
            zIndex: 10,
            "&:hover": { background: "#e0e0e0" },
          }}
          size="large"
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        {/* Header */}
        <Box className="candidate-details-header" sx={{ mt: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 64, height: 64 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {candidate?.firstName} {candidate?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {candidate?.contact?.location}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {candidate?.match_score !== undefined && (
              <Chip
                icon={<CheckCircle color="success" sx={{ fontSize: 18 }} />}
                label={`${candidate?.match_score}% match`}
                color="success"
                variant="outlined"
                sx={{ fontWeight: 500, fontSize: 15, px: 1.5, py: 0.5 }}
              />
            )}
            <IconButton
              sx={{
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <History />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<Description />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                borderColor: "#0f2445",
                color: "#0f2445",
                "&:hover": { borderColor: "#222" },
              }}
            >
              View CV
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* About */}
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            About
          </Typography>
          <Typography className="candidate-about">
            {candidate?.about || "No description provided."}
          </Typography>
        </Box>

        {/* Contact Info */}
        <Box mt={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Contact Information
          </Typography>
          <Typography>Email: {candidate?.contact?.email || "N/A"}</Typography>
          <Typography>Phone: {candidate?.contact?.phone || "N/A"}</Typography>
          <Typography>
            LinkedIn:{" "}
            {candidate?.contact?.linkedIn ? (
              <a
                href={candidate.contact.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                {candidate.contact.linkedIn}
              </a>
            ) : (
              "N/A"
            )}
          </Typography>
        </Box>

        {/* Skills */}
        <Box mt={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Skills
          </Typography>
          <Box
  className="candidate-tools-list"
  sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
>
  {candidate?.skills?.length > 0 ? (
    candidate.skills.map((skillId, idx) => {
      // Find matching skill name from the skills collection
      const skill = skills?.find((s) => s.id === skillId);
      return (
        <Chip
          key={idx}
          label={skill ? skill.name : `Skill #${skillId}`}
          className="candidate-tool-chip"
        />
      );
    })
  ) : (
    <Typography>No skills listed</Typography>
  )}
</Box>

        </Box>

        {/* Education */}
        <Box mt={4}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Education
          </Typography>
          {candidate?.education?.length > 0 ? (
            candidate.education.map((edu, idx) => (
              <Box key={idx} mt={1}>
                <Typography fontWeight={600}>{edu.degree}</Typography>
                <Typography>{edu.school}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.dates}
                </Typography>
                {edu.gpa && <Typography>GPA: {edu.gpa}</Typography>}
              </Box>
            ))
          ) : (
            <Typography>No education details provided.</Typography>
          )}
        </Box>

        {/* Work Experience */}
        <Box mt={4}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Work Experience
          </Typography>
          {candidate?.work_experience?.length > 0 ? (
            candidate.work_experience.map((exp, idx) => (
              <Box key={idx} mt={1}>
                <Typography fontWeight={600}>{exp.title}</Typography>
                <Typography>{exp.company}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.dates}
                </Typography>
                <Typography>{exp.description}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No work experience added.</Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Bottom Buttons */}
        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="success"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#15803d" },
            }}
          >
            Shortlist
          </Button>

          <Button
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            Reject
          </Button>
        </Box>
      </Box>
    </Slide>
  );
};

export default CandidateDetails;
