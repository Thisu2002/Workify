import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Slide,
  Button,
} from "@mui/material";
import {
  CalendarMonth,
  Email,
  MoreVert,
  CheckCircle,
  Close as CloseIcon,
  ArrowForward,
  History,
  Description,
} from "@mui/icons-material";

const CandidateDetails = ({ candidate, onClose }) => {
  if (!candidate) return null;

  return (
    <Slide direction="left" in={!!candidate} mountOnEnter unmountOnExit style={{ zIndex: 2000 }}>
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

        <Box className="candidate-details-header" sx={{ mt: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 64, height: 64 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {candidate?.name}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              icon={<CheckCircle color="success" sx={{ fontSize: 18 }} />}
              label={`${candidate?.match} matched with us`}
              color="success"
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: 15, px: 1.5, py: 0.5 }}
            />
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

        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>About</Typography>
          <Typography className="candidate-about">{candidate?.about}</Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Related Experienced Tools</Typography>
          <Box className="candidate-tools-list">
            {candidate?.tools?.map((tool, idx) => (
              <Chip key={idx} label={tool} className="candidate-tool-chip" />
            ))}
          </Box>
        </Box>

        <Box mt={4} display="flex" gap={15}>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>Educational Experience</Typography>
            <Typography>{candidate?.education?.degree}</Typography>
            <Typography fontWeight={600}>{candidate?.education?.university}</Typography>
            <Typography>{candidate?.education?.duration}</Typography>
            <Typography>{candidate?.education?.location}</Typography>
            <Typography>GPA: {candidate?.education?.gpa}</Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>Latest Work Experience</Typography>
            {candidate?.latestExperience?.map((exp, idx) => (
              <Box key={idx} mt={1}>
                <Typography fontWeight={600}>{exp.title}</Typography>
                <Typography>{exp.company}</Typography>
                <Typography variant="body2" color="text.secondary">{exp.date}</Typography>
                <ul>
                  {exp.notes.map((note, i) => (
                    <li key={i}><Typography>{note}</Typography></li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mt={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Application Timeline</Typography>
          <Box className="candidate-timeline-horizontal">
            <Stepper
              alternativeLabel
              activeStep={candidate?.timeline?.length}
              className="candidate-timeline-stepper"
            >
              {candidate?.timeline?.map((step, idx) => (
                <Step key={idx} completed>
                  <StepLabel
                    icon={step.icon}
                    StepIconProps={{ style: { color: "#10b981" } }}
                  >
                    <span className="timeline-label">{step.label}</span>
                    <span className="timeline-date">{step.date}</span>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
        <Button
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  mt: 3,
                  width: "fit-content",
                  textTransform: "none",
                  borderRadius: 2,
                  backgroundColor: "#0f2445",
                  "&:hover": { backgroundColor: "#222" },
                }}
              >
                Move to Next Stage
              </Button>
      </Box>
    </Slide>
  );
};

export default CandidateDetails;
