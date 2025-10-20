import React, { useState, useEffect, useCallback } from "react";
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
import toast from "react-hot-toast";

const Candidates = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobPost, setJobPost] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("toReview");
  const [sortBy, setSortBy] = useState("match");
  const [roundFilters, setRoundFilters] = useState({});
  const [currentRound, setCurrentRound] = useState(null);
  const [skills, setSkills] = useState([]);

  const fetchJobPost = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/jobs/fetchJobPost/${jobId}`
      );
      const job = res.data.jobPost;
      setJobPost(job);

      if (job.current_status) {
        const roundMatch = job.current_status.match(/^(\d+)_/);
        const roundNumber = roundMatch ? parseInt(roundMatch[1], 10) : null;

        if (job.current_status === "1_new") {
          // Before any interviews — mark initial rejection filter as default
          setCurrentRound(null);
          setRoundFilters({ initialReject: true });
        } else if (roundNumber) {
          setCurrentRound(roundNumber);
          setRoundFilters({ [roundNumber]: true });
        }
      }
    } catch (error) {
      console.error("Error fetching job post:", error);
    }
  }, [jobId]);

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/recruiter/fetchCandidates/${jobId}`
      );
      const fetchedCandidates = res.data.candidates || [];

      // Filter candidates without match_score
      const candidatesWithoutScore = fetchedCandidates.filter(
        (c) => !c.match_score && c.match_score !== 0
      );

      if (candidatesWithoutScore.length > 0 && jobId) {
        // Send job id and candidates with no match_score to backend
        const updateRes = await axios.post(
          "http://localhost:5000/api/jobs/updateMatchScores",
          {
            jobId: jobId,
            candidates: candidatesWithoutScore,
          }
        );

        setCandidates(updateRes.data.candidates || []);
      } else {
        setCandidates(fetchedCandidates);
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  }, [jobId]);

  const fetchSkills = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/recruiter/fetchSkills",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSkills(res.data);
      //console.log("Skills fetched:", res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const loadAll = async () => {
      try {
        await Promise.all([fetchJobPost(), fetchCandidates(), fetchSkills()]);
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };

    loadAll();
  }, [jobId, fetchJobPost, fetchCandidates, fetchSkills]);

  const refreshCandidates = async () => {
    await fetchCandidates();
    await fetchJobPost();
  };

  const changeJobStatus = async (newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/changeJobStatus/${jobId}`,
        { new_status: newStatus }
      );
      fetchJobPost();
      toast.success("Panel availability requested successfully.");
    } catch (err) {
      toast.error("Failed to request panel availability.");
      console.error("Error changing job status:", err);
    }
  };

  // Filtering logic per tab
  const filteredCandidates = candidates.filter((candidate) => {
    const status = candidate.current_status || "";

    switch (activeTab) {
      case "toReview":
        return status === "new";

      case "shortlisted":
        return status !== "new" && status !== "rejected";

      case "selected":
        return candidate.round_status?.some(
          (r) =>
            r.round_result !== "rejected" &&
            r.round_result &&
            r.round_result.trim() !== ""
        );

      case "rejected":
        return (
          status === "rejected" ||
          candidate.round_status?.some((r) => r.round_result === "rejected")
        );

      case "hired":
        return status.toLowerCase().includes("hired");

      default:
        return true;
    }
  });

  // Apply round filters for Shortlisted / Rejected
  const roundFilteredCandidates = filteredCandidates.filter((candidate) => {
    if (activeTab === "selected" || activeTab === "rejected") {
      const selectedRounds = Object.keys(roundFilters).filter(
        (r) => roundFilters[r]
      );

      if (selectedRounds.length === 0) return true;

      return candidate.round_status?.some((r) => {
        const roundNum = r.round_number?.toString();
        const result = r.round_result?.trim()?.toLowerCase();

        if (activeTab === "selected") {
          // For selected tab, only those not rejected in selected rounds
          if (!selectedRounds.includes(roundNum) || !result) return false;
          return result !== "rejected";
        }

        if (activeTab === "rejected") {
          // Handle initial rejection filter
          if (
            selectedRounds.includes("initialReject") &&
            candidate.current_status === "rejected"
          ) {
            return true;
          }
          if (!selectedRounds.includes(roundNum) || !result) return false;
          return result === "rejected";
        }

        return false;
      });
    }

    return true;
  });

  // Sorting logic
  const sortedCandidates = [...roundFilteredCandidates].sort((a, b) => {
    if (sortBy === "match") {
      return (b.match_score || 0) - (a.match_score || 0);
    } else if (sortBy === "experience") {
      return (b.experience?.years || 0) - (a.experience?.years || 0);
    } else {
      return (b.quiz_score || 0) - (a.quiz_score || 0);
    }
  });

  // Helper: Get status label and color for "All Candidates"
  const getStatusLabel = (status) => {
    if (status === "new") {
      return (
        <Chip
          label="new"
          size="small"
          sx={{ backgroundColor: "#729be1ff", color: "#ffffff" }}
        />
      );
    }

    const roundMatch = status.match(/^(\d+)_/);
    const roundNumber = roundMatch ? parseInt(roundMatch[1], 10) : null;

    if (!roundNumber) return null;

    if (status.includes("rejected")) {
      return (
        <Chip
          label={`Round ${roundNumber}`}
          size="small"
          sx={{ backgroundColor: "#ffdddd", color: "#d32f2f" }}
        />
      );
    }

    return (
      <Chip
        label={`Round ${roundNumber}`}
        size="small"
        sx={{ backgroundColor: "#d0f0c0", color: "#2e7d32" }}
      />
    );
  };

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
            {jobPost ? jobPost.title : "Loading..."}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {jobPost
              ? (() => {
                  const status = jobPost.current_status;
                  if (status !== "1_new") {
                    const roundMatch = status.match(/^(\d+)_/);
                    const roundNumber = roundMatch
                      ? parseInt(roundMatch[1], 10)
                      : null;

                    if (roundNumber) {
                      const round = jobPost.interview_rounds?.find(
                        (r) => r.round_number === roundNumber
                      );
                      if (round) {
                        return `Currently at: ${round.round_name} (Round ${round.round_number})`;
                      }
                    }
                  }
                  return "Currently at: Processing Applications";
                })()
              : "Loading..."}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, mt: 2 }} />

      <Box className="candidates-root" sx={{ height: "calc(100vh - 56px)" }}>
        <Box
          className={`candidates-list-panel ${
            selectedCandidate ? "shrink" : "full"
          }`}
        >
          {/* Tabs */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            mb={2}
          >
            <Box>
              {[
                { key: "all", label: "All Candidates" },
                { key: "toReview", label: "To Review" },
                { key: "shortlisted", label: "Shortlisted" },
                { key: "selected", label: "Selected" },
                { key: "rejected", label: "Rejected" },
                { key: "hired", label: "Hired" },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "contained" : "outlined"}
                  onClick={() => setActiveTab(tab.key)}
                  sx={{
                    borderRadius: 5,
                    mr: 1,
                    backgroundColor:
                      activeTab === tab.key ? "#0f2445" : "inherit",
                    color: activeTab === tab.key ? "#fff" : "inherit",
                    position: "relative",
                    "&:hover": {
                      backgroundColor:
                        activeTab === tab.key ? "#222" : "inherit",
                    },
                  }}
                >
                  {tab.label}
                  {tab.key === "toReview" && (
                    <sup
                      style={{
                        color: "#1976d2",
                        marginLeft: 3,
                        marginBottom: 3,
                      }}
                    >
                      NEW
                    </sup>
                  )}
                </Button>
              ))}
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

          {/* Round Filters */}
          {(activeTab === "selected" || activeTab === "rejected") && (
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Filter by round:
              </Typography>

              {/* Initial Shortlisting Rejects — only visible in Rejected tab */}
              {activeTab === "rejected" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={!!roundFilters.initialReject}
                      onChange={(e) =>
                        setRoundFilters({
                          ...roundFilters,
                          initialReject: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Initial Shortlisting"
                />
              )}

              {/* Normal rounds (visible in both Selected and Rejected) */}
              {jobPost?.interview_rounds?.map((round) => (
                <FormControlLabel
                  key={round.round_number}
                  control={
                    <Checkbox
                      size="small"
                      checked={!!roundFilters[round.round_number]}
                      onChange={(e) =>
                        setRoundFilters({
                          ...roundFilters,
                          [round.round_number]: e.target.checked,
                        })
                      }
                    />
                  }
                  label={`Round ${round.round_number}`}
                />
              ))}
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          {/* Candidate Cards */}
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
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontWeight={600}>
                        {candidate.firstName} {candidate.lastName}
                      </Typography>
                      {activeTab === "all" &&
                        getStatusLabel(candidate.current_status)}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {candidate.about || "No about info provided."}
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
                        label={`${
                          candidate.experience?.years || 0
                        } Years Experience`}
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

          {(activeTab === "shortlisted" || activeTab === "selected") && (
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  disabled={
                    activeTab === "shortlisted"
                      ? jobPost?.current_status !== "1_new"
                      : !jobPost?.current_status?.includes("completed")
                  }
                  onClick={() => {
                    const newStatus =
                      activeTab === "shortlisted"
                        ? "1_panelRequested"
                        : `${currentRound + 1}_panelRequested`;

                    changeJobStatus(newStatus);
                  }}
                >
                  Check Panel Availability
                </Button>
              </Box>
            )}
        </Box>

        <CandidateDetails
          candidate={selectedCandidate}
          skills={skills}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={refreshCandidates}
        />
      </Box>
    </Box>
  );
};

export default Candidates;
