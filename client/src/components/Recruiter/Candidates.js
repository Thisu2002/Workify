import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import {
  CheckCircle,
  Loop,
  EventAvailable,
  ArrowBack,
} from "@mui/icons-material";
import "../../styles/Candidates.css";
import { useNavigate } from "react-router-dom";
import CandidateDetails from "./CandidateDetails";

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
          Senior UI Developer
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

        <CandidateDetails
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
         />  
      </Box>
    </Box>
  );
};

export default Candidates;
