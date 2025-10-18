import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import CandidateDetails from "./CandidateDetails";
import axios from "axios";

const Candidates = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [roundFilters, setRoundFilters] = useState({
    round1: false,
    round2: false,
    round3: false,
  });

  // ✅ Fetch candidates who applied for this job
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/recruiter/fetchCandidates/${jobId}`
        );
        setCandidates(res.data.candidates || []);
        //console.log("Fetched candidates:", res.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    if (jobId) fetchCandidates();
  }, [jobId]);

  // ✅ Filtering logic (unchanged)
  const filteredCandidates = candidates.filter((candidate) => {
    if (activeTab === "all") return true;
    if (activeTab === "shortlisted") return candidate.status === "shortlisted";
    if (activeTab === "rejected") return candidate.status === "rejected";
    return true;
  });

  // ✅ Sorting logic (unchanged)
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "match") {
      return (b.match_score || 0) - (a.match_score || 0);
    } else if (sortBy === "experience") {
      return (b.experience?.years || 0) - (a.experience?.years || 0);
    } else {
      return (b.quiz_score || 0) - (a.quiz_score || 0);
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
            Applicants for Job
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Job ID: {jobId}
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
                key={candidate._id}
                onClick={() => setSelectedCandidate(candidate)}
                className={`candidate-card ${
                  selectedCandidate?._id === candidate._id ? "active" : ""
                }`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  cursor: "pointer",
                  boxShadow: selectedCandidate?._id === candidate._id ? 4 : 1,
                  transition: "box-shadow 0.2s, background 0.2s",
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ width: 50, height: 50, mr: 2 }} />
                  <Box>
                    <Typography fontWeight={600}>
                      {candidate.firstName} {candidate.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {candidate.experience?.years || 0} Years Experience
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
                        label={`${candidate.match_score || 0}% match`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        icon={<Work fontSize="small" />}
                        label={`${candidate.experience?.years || 0} Years`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<Quiz fontSize="small" />}
                        label={`Quiz: ${candidate.quiz_score || 0}%`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
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
