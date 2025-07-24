import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Loop,
  EventAvailable,
  ArrowBack,
  Work,
  School,
  Star,
  AccessTime,
  Quiz,
} from "@mui/icons-material";
import "../../styles/Candidates.css";
import { useNavigate } from "react-router-dom";
import CandidateDetails from "./CandidateDetails";

const candidates = [
  {
    id: 1,
    name: "Nimal Perera",
    role: "Senior UI Developer",
    experience: "5 Years Experience",
    match: "92%",
    quizScore: "85%",
    status: "shortlisted",
    interviewRound: "Round 2",
    about:
      "I'm Nimal, a Senior UI Developer with 5 years of experience based in Colombo, Sri Lanka. I specialize in React, TypeScript, and modern UI frameworks. I've worked on enterprise-level applications for financial institutions in Sri Lanka.",
    tools: ["React", "TypeScript", "Material UI", "Figma", "Node.js"],
    education: {
      degree: "Software Engineering",
      university: "University of Moratuwa",
      duration: "2015 - 2019",
      location: "Moratuwa, Sri Lanka",
      gpa: "3.8",
    },
    latestExperience: [
      {
        title: "Senior UI Developer",
        company: "WSO2",
        date: "2021 - Present / Colombo, Sri Lanka",
        notes: [
          "Led UI development for WSO2 Identity Server",
          "Implemented design system used across products",
          "Mentored junior developers",
        ],
      },
      {
        title: "UI Developer",
        company: "Virtusa",
        date: "2019 - 2021 / Colombo, Sri Lanka",
        notes: [
          "Developed banking applications for EU clients",
          "Optimized performance of React applications",
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
        label: "Shortlisted (Round 2)",
        icon: <CheckCircle color="success" />,
        date: "Jul 3, 2025",
      },
      {
        label: "Interview Scheduled (Round 2)",
        icon: <EventAvailable color="info" />,
        date: "",
      },
    ],
  },
  {
    id: 2,
    name: "Kamal Silva",
    role: "UI/UX Engineer",
    experience: "4 Years Experience",
    match: "88%",
    quizScore: "78%",
    status: "shortlisted",
    interviewRound: "Round 1",
    about:
      "UI/UX Engineer with strong frontend development skills. I bridge the gap between design and implementation, ensuring pixel-perfect UIs with excellent user experience.",
    tools: ["React", "Figma", "Adobe XD", "CSS-in-JS", "Storybook"],
    education: {
      degree: "Computer Science",
      university: "University of Colombo",
      duration: "2016 - 2020",
      location: "Colombo, Sri Lanka",
      gpa: "3.7",
    },
    latestExperience: [
      {
        title: "UI/UX Engineer",
        company: "99x",
        date: "2021 - Present / Colombo, Sri Lanka",
        notes: [
          "Designed and implemented UI components for Norwegian client",
          "Created design system used by 20+ developers",
        ],
      },
      {
        title: "Frontend Developer",
        company: "CodeGen",
        date: "2020 - 2021 / Colombo, Sri Lanka",
        notes: [
          "Developed travel industry web applications",
          "Worked closely with designers on UI implementation",
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
    name: "Sunil Fernando",
    role: "Frontend Architect",
    experience: "7 Years Experience",
    match: "85%",
    quizScore: "92%",
    status: "rejected",
    interviewRound: "Round 3",
    about:
      "Frontend Architect with extensive experience in building scalable UI systems. I focus on performance, accessibility, and maintainability.",
    tools: ["React", "TypeScript", "GraphQL", "Webpack", "Jest"],
    education: {
      degree: "Information Technology",
      university: "Sri Lanka Institute of Information Technology",
      duration: "2013 - 2017",
      location: "Colombo, Sri Lanka",
      gpa: "3.9",
    },
    latestExperience: [
      {
        title: "Frontend Architect",
        company: "Sysco Labs",
        date: "2022 - Present / Colombo, Sri Lanka",
        notes: [
          "Architected frontend for US retail systems",
          "Led team of 8 frontend developers",
        ],
      },
      {
        title: "Senior Frontend Developer",
        company: "MillenniumIT",
        date: "2019 - 2022 / Colombo, Sri Lanka",
        notes: [
          "Developed trading platform UI",
          "Optimized rendering performance by 40%",
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Priyanka Rathnayake",
    role: "Senior React Developer",
    experience: "4 Years Experience",
    match: "82%",
    quizScore: "80%",
    status: "rejected",
    interviewRound: "Round 1",
    about:
      "Senior React Developer passionate about creating beautiful, functional user interfaces with clean code practices.",
    tools: ["React", "Redux", "Styled Components", "Jest", "Cypress"],
    education: {
      degree: "Computer Engineering",
      university: "University of Peradeniya",
      duration: "2014 - 2018",
      location: "Peradeniya, Sri Lanka",
      gpa: "3.6",
    },
    latestExperience: [
      {
        title: "Senior React Developer",
        company: "Creative Software",
        date: "2021 - Present / Colombo, Sri Lanka",
        notes: [
          "Developed healthcare management system UI",
          "Implemented CI/CD pipeline for frontend",
        ],
      },
      {
        title: "React Developer",
        company: "Vega Innovations",
        date: "2018 - 2021 / Colombo, Sri Lanka",
        notes: [
          "Built automotive UI components",
          "Worked on real-time data visualization",
        ],
      },
    ],
  },
];

const Candidates = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [roundFilters, setRoundFilters] = useState({
    round1: false,
    round2: false,
    round3: false,
  });

  const filteredCandidates = candidates.filter((candidate) => {
    if (activeTab === "all") return true;
    if (activeTab === "shortlisted") return candidate.status === "shortlisted";
    if (activeTab === "rejected") return candidate.status === "rejected";
    return true;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "match") {
      return parseFloat(b.match) - parseFloat(a.match);
    } else if (sortBy === "experience") {
      // Sort by experience (years)
      const aExp = parseInt(a.experience);
      const bExp = parseInt(b.experience);
      return bExp - aExp;
    } else {
      // Sort by quiz score
      return parseFloat(b.quizScore) - parseFloat(a.quizScore);
    }
  });

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
        <Box>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
            Senior UI Developer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Currently at: Technical Interview (Round 2)
          </Typography>
        </Box>
      </Box>
      <Box className="candidates-root" sx={{ height: "calc(100vh - 56px)" }}>
        <Box
          className={`candidates-list-panel ${
            selectedCandidate ? "shrink" : "full"
          }`}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            mb={2}
          >
            <Box>
              <Button
                variant={activeTab === "all" ? "contained" : "outlined"}
                onClick={() => setActiveTab("all")}
                sx={{
                  borderRadius: 5,
                  mr: 1,
                  backgroundColor: activeTab === "all" ? "#0f2445" : "inherit",
                  color: activeTab === "all" ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor: activeTab === "all" ? "#222" : "inherit",
                  },
                }}
              >
                All Candidates
              </Button>
              <Button
                variant={activeTab === "shortlisted" ? "contained" : "outlined"}
                onClick={() => setActiveTab("shortlisted")}
                sx={{
                  borderRadius: 5,
                  mr: 1,
                  backgroundColor:
                    activeTab === "shortlisted" ? "#0f2445" : "inherit",
                  color: activeTab === "shortlisted" ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      activeTab === "shortlisted" ? "#222" : "inherit",
                  },
                }}
              >
                Shortlisted
              </Button>
              <Button
                variant={activeTab === "rejected" ? "contained" : "outlined"}
                onClick={() => setActiveTab("rejected")}
                sx={{
                  borderRadius: 5,
                  backgroundColor:
                    activeTab === "rejected" ? "#0f2445" : "inherit",
                  color: activeTab === "rejected" ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      activeTab === "rejected" ? "#222" : "inherit",
                  },
                }}
              >
                Rejected
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 5,
                  ml: 2,
                }}
              >
                Hired
              </Button>
            </Box>
            <RadioGroup
              row
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <FormControlLabel
                value="match"
                control={<Radio size="small" />}
                label="Best Match"
              />
              <FormControlLabel
                value="experience"
                control={<Radio size="small" />}
                label="Experience"
              />
              <FormControlLabel
                value="quiz"
                control={<Radio size="small" />}
                label="Quiz Score"
              />
            </RadioGroup>
          </Box>

          {(activeTab === "shortlisted" || activeTab === "rejected") && (
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Filter by round:
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={roundFilters.round1}
                    onChange={(e) =>
                      setRoundFilters({
                        ...roundFilters,
                        round1: e.target.checked,
                      })
                    }
                  />
                }
                label="Round 1"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={roundFilters.round2}
                    onChange={(e) =>
                      setRoundFilters({
                        ...roundFilters,
                        round2: e.target.checked,
                      })
                    }
                  />
                }
                label="Round 2"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={roundFilters.round3}
                    onChange={(e) =>
                      setRoundFilters({
                        ...roundFilters,
                        round3: e.target.checked,
                      })
                    }
                  />
                }
                label="Round 3"
              />
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          <Box>
            {sortedCandidates.map((candidate) => (
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
                      {candidate.role}
                    </Typography>
                    <Box
                      mt={1}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      flexWrap="wrap"
                    >
                      <Chip
                        icon={<Star fontSize="small" />}
                        label={`${candidate.match} match`}
                        size="small"
                        color="primary"
                        //outlined chip
                        variant="outlined"
                      />
                      <Chip
                        icon={<Work fontSize="small" />}
                        label={candidate.experience}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<Quiz fontSize="small" />}
                        label={`Quiz: ${candidate.quizScore}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      {candidate.interviewRound && (
                        <Chip
                          icon={<AccessTime fontSize="small" />}
                          label={candidate.interviewRound}
                          size="small"  
                          color={
                            candidate.status === "rejected"
                              ? "error"
                              : "success"
                          }
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Typography fontSize={22}>→</Typography>
              </Card>
            ))}
          </Box>
          {activeTab === "shortlisted" && (
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained">Check Panel Availability</Button>
            </Box>
          )}
        </Box>

        <CandidateDetails
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      </Box>
    </Box>
  );
};

export default Candidates;
