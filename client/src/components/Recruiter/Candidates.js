import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Chip,
  Divider,
  Slide,
  Stepper,
  Step,
  StepLabel,
  IconButton,
} from "@mui/material";
import {
  CalendarMonth,
  Email,
  MoreVert,
  CheckCircle,
  Loop,
  EventAvailable,
  Close as CloseIcon,
  ArrowBack,
} from "@mui/icons-material";
import "./Candidates.css";
import { useNavigate } from "react-router-dom";

const candidates = [
  {
    id: 1,
    name: "Celine Fransisca",
    role: "UI/UX Designer",
    experience: "2 Years Experience",
    match: "88%",
    about:
      "I'm Hernandez, 3 years experienced UI/UX Designer based in Indonesia. I work previously on a tech startup that has 2 branches in Indonesia. The success key of UI/UX Design is to create a stable design system and always listen to user feedback.",
    tools: [
      "Figma",
      "Framer",
      "Blender",
      "Adobe Photoshop",
      "Adobe Illustrator",
    ],
    education: {
      degree: "Computer Science",
      university: "Gadjah Mada University",
      duration: "August 2018 - May 2022",
      location: "Yogyakarta, Indonesia",
      gpa: "3.65",
    },
    latestExperience: [
      {
        title: "UI/UX Designer",
        company: "Microsoft Corporation",
        date: "April 2021 - current / Saint Paul, MN",
        notes: [
          "Created A/B testing for Microsoft 365 product",
          "Improved several features of the product",
        ],
      },
    ],
    timeline: [
      {
        label: "Applied",
        icon: <CheckCircle color="success" />,
        date: "Jul 1, 2025",
      },
      {
        label: "Shortlisted",
        icon: <Loop color="primary" />,
        date: "Jul 3, 2025",
      },
      {
        label: "Interview Scheduled",
        icon: <EventAvailable color="info" />,
        date: "Jul 7, 2025",
      },
    ],
  },
  {
    id: 2,
    name: "Sarookh Pakoor",
    role: "Social Media Analyst",
    experience: "4 Years Experience",
    match: "82%",
    about:
      "I'm Sarookh, a dedicated Social Media Analyst with 4 years of experience optimizing online presence for brands.",
    tools: [
      "Google Analytics",
      "Hootsuite",
      "Buffer",
      "Sprout Social",
      "Adobe Illustrator",
    ],
    education: {
      degree: "Marketing and Communication",
      university: "University of Colombo",
      duration: "January 2016 - December 2019",
      location: "Colombo, Sri Lanka",
      gpa: "3.72",
    },
    latestExperience: [
      {
        title: "Social Media Analyst",
        company: "Unilever",
        date: "March 2021 - Present",
        notes: [
          "Increased engagement by 30% through strategic content planning",
          "Analyzed campaign performance using key metrics",
          "Collaborated with creative team to align brand voice",
        ],
      },
      {
        title: "Junior Social Media Coordinator",
        company: "Leo Burnett",
        date: "June 2019 - February 2021",
        notes: [
          "Scheduled and managed daily posts across platforms",
          "Monitored real-time campaign analytics",
          "Prepared weekly performance reports",
        ],
      },
    ],
    timeline: [
      {
        label: "Applied",
        icon: <CheckCircle color="success" />,
        date: "Jul 1, 2025",
      },
      {
        label: "Shortlisted",
        icon: <Loop color="primary" />,
        date: "Jul 3, 2025",
      },
      {
        label: "Interview Scheduled",
        icon: <EventAvailable color="info" />,
        date: "Jul 7, 2025",
      },
    ],
  },
  {
    id: 3,
    name: "Hernandez da Silva",
    role: "Front End Developer",
    experience: "2 Years Experience",
    match: "80%",
    about: "Front End Developer passionate about building interactive UIs.",
    tools: ["React", "JavaScript", "TypeScript", "Redux", "Material UI"],
    education: {
      degree: "Software Engineering",
      university: "University of São Paulo",
      duration: "2017 - 2021",
      location: "São Paulo, Brazil",
      gpa: "3.80",
    },
    latestExperience: [
      {
        title: "Front End Developer",
        company: "Globo",
        date: "Jan 2022 - Present",
        notes: [
          "Developed scalable React applications",
          "Worked closely with UX/UI teams",
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Jonathan Sebastian",
    role: "Business Strategist",
    experience: "5 Years Experience",
    match: "79%",
    about: "Business strategist with a knack for market analysis and growth.",
    tools: ["Excel", "Power BI", "Tableau", "SPSS"],
    education: {
      degree: "Business Administration",
      university: "Harvard Business School",
      duration: "2013 - 2017",
      location: "Boston, USA",
      gpa: "3.90",
    },
    latestExperience: [
      {
        title: "Business Strategist",
        company: "Deloitte",
        date: "2018 - Present",
        notes: ["Led market entry projects", "Managed cross-functional teams"],
      },
    ],
  },
];

const Candidates = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <Box className="candidates-main">
      <Box display="flex" gap={3}>
        <ArrowBack
          onClick={() => navigate("/recruiter/job-posts")}
          sx={{
            mb: 2,
            color: "#0f2445",
            cursor: "pointer",
            height: 30,
            width: 30,  
          }}
        />
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Software Engineer
        </Typography>
      </Box>
      <Box className="candidates-root" sx={{ height: "calc(100vh - 56px)" }}>
        <Box
          className={`candidates-list-panel ${
            selectedCandidate ? "shrink" : "full"
          }`}
        >
          <Box display="flex" mt={2} mb={2}>
            <Button variant="outlined" sx={{ borderRadius: 5, mr: 2 }}>
              All Candidates
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: 5,
                backgroundColor: "#0f2445",
                color: "#fff",
                "&:hover": { backgroundColor: "#222" },
              }}
            >
              Most Relevant
            </Button>
          </Box>
          <Box>
            {candidates.map((candidate) => (
              <Card
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className={`candidate-card ${
                  selectedCandidate?.id === candidate.id ? "active" : ""
                }`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  cursor: "pointer",
                  boxShadow: selectedCandidate?.id === candidate.id ? 4 : 1,
                  transition: "box-shadow 0.2s, background 0.2s",
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ width: 50, height: 50, mr: 2 }} />
                  <Box>
                    <Typography fontWeight={600}>{candidate.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      apply as {candidate.role}
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={`${candidate.match} match with us`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip label={candidate.experience} size="small" />
                    </Box>
                  </Box>
                </Box>
                <Typography fontSize={22}>→</Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Candidate Details - Slide in from right */}
        <Slide
          direction="left"
          in={!!selectedCandidate}
          mountOnEnter
          unmountOnExit
          style={{ zIndex: 2000 }}
        >
          <Box className="candidate-details-panel horizontal-timeline-panel">
            <IconButton
              className="close-icon"
              onClick={() => setSelectedCandidate(null)}
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
                    {selectedCandidate?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    apply as {selectedCandidate?.role}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  icon={<CheckCircle color="success" sx={{ fontSize: 18 }} />}
                  label={`${selectedCandidate?.match} matched with us`}
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 500, fontSize: 15, px: 1.5, py: 0.5 }}
                />
                <IconButton>
                  <Email />
                </IconButton>
                <IconButton>
                  <CalendarMonth />
                </IconButton>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                About
              </Typography>
              <Typography className="candidate-about">
                {selectedCandidate?.about}
              </Typography>
            </Box>

            <Box mt={3}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Related Experienced Tools
              </Typography>
              <Box className="candidate-tools-list">
                {selectedCandidate?.tools?.map((tool, idx) => (
                  <Chip
                    key={idx}
                    label={tool}
                    className="candidate-tool-chip"
                  />
                ))}
              </Box>
            </Box>

            <Box mt={4} display="flex" gap={15}>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Educational Experience
                </Typography>
                <Typography>{selectedCandidate?.education?.degree}</Typography>
                <Typography fontWeight={600}>
                  {selectedCandidate?.education?.university}
                </Typography>
                <Typography>
                  {selectedCandidate?.education?.duration}
                </Typography>
                <Typography>
                  {selectedCandidate?.education?.location}
                </Typography>
                <Typography>
                  GPA: {selectedCandidate?.education?.gpa}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Latest Work Experience
                </Typography>
                {selectedCandidate?.latestExperience?.map((exp, idx) => (
                  <Box key={idx} mt={1}>
                    <Typography fontWeight={600}>{exp.title}</Typography>
                    <Typography>{exp.company}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.date}
                    </Typography>
                    <ul>
                      {exp.notes.map((note, i) => (
                        <li key={i}>
                          <Typography>{note}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box mt={3}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Application Timeline
              </Typography>
              <Box className="candidate-timeline-horizontal">
                <Stepper
                  alternativeLabel
                  activeStep={selectedCandidate?.timeline?.length}
                  className="candidate-timeline-stepper"
                >
                  {selectedCandidate?.timeline?.map((step, idx) => (
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
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default Candidates;
