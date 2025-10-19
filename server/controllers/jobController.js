// controllers/jobController.js

const Candidate_Job = require('../models/Candidate_Job');
const JobPost = require('../models/JobPost'); // Adjust path if needed
const Recruiter = require('../models/Recruiter'); // We need this to populate
const calculateMatchScore = require('../utils/matchScore');

// Helper function to format the date
const formatPostedDate = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  if (interval === 1) return "1 day ago";
  return "Today";
};

// GET all open job posts for candidates
exports.getAllOpenJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find({ status: 'Open' })
      .populate('recruiter_id', 'companyName companyLogoUrl') // Populate recruiter's company name and logo
      .sort({ date_posted: -1 }); // Show newest jobs first

    // Map the data to match the structure the frontend expects
    const formattedJobs = jobs.map(job => {
      // Handle cases where recruiter might be deleted
      const companyName = job.recruiter_id ? job.recruiter_id.companyName : 'N/A';
      const companyLogo = job.recruiter_id ? job.recruiter_id.companyLogoUrl : 'https://via.placeholder.com/40?text=C';

      return {
        id: job._id,
        title: job.title,
        company: companyName,
        logo: companyLogo,
        location: job.location,
        type: job.jobType,
        model: job.location === 'Remote' ? 'Remote' : 'Onsite', // Simple logic for 'model'
        salary: job.salary,
        postedDate: formatPostedDate(job.date_posted),
        description: job.description,
        responsibilities: job.experience.description ? job.experience.description.split('. ') : [], // Simple split logic
        qualifications: job.qualifications.map(q => q.name),
      };
    });

    res.status(200).json(formattedJobs);
  } catch (error) {
    console.error('Error fetching open jobs:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

exports.deleteJobPost = async (req, res) => {
  try {
    const { jobId } = req.body;
    await JobPost.findByIdAndDelete(jobId);
    res.json({ message: "Job deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job post" });
  }
};

exports.fetchCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Fetch all candidate-job entries for that job
    const candidates = await Candidate_Job.find({ job_id: jobId })

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found for this job." });
    }

    res.status(200).json({
      message: "Candidates fetched successfully.",
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.fetchJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobPost = await JobPost.findById(jobId);

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found." });
    }

    res.status(200).json({
      message: "Job post fetched successfully.",
      jobPost,
    });
  } catch (error) {
    console.error("Error fetching job post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.changeJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { new_status } = req.body;

    if (!new_status) {
      return res.status(400).json({ message: "New status is required" });
    }

    const jobPost = await JobPost.findById(jobId);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    jobPost.current_status = new_status;
    await jobPost.save();

    return res.status(200).json({
      message: "Job status updated successfully",
      updatedStatus: new_status,
    });
  } catch (error) {
    console.error("Error changing job status:", error);
    res.status(500).json({ message: "Server error while changing job status" });
  }
};

exports.changeApplicationStatus = async (req, res) => {
  try {
    const { candidateId, newCurrentStatus, currentRound, roundResult } = req.body;

    if (!candidateId || !newCurrentStatus || !currentRound || !roundResult) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const candidate = await Candidate_Job.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    candidate.current_status = newCurrentStatus;

    const roundIndex = candidate.round_status.findIndex(
      (r) => r.round_number === currentRound
    );

    if (roundIndex !== -1) {
      candidate.round_status[roundIndex].round_result = roundResult;
    } else {
      candidate.round_status.push({
        round_number: currentRound,
        round_result: roundResult,
        round_feedback: "",
      });
    }

    await candidate.save();

    res.status(200).json({ message: "Candidate status updated successfully.", candidate });
  } catch (err) {
    console.error("Error updating candidate status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateMatchScores = async (req, res) => {
  try {
    const { jobId, candidates } = req.body;

    if (!jobId || !candidates || candidates.length === 0) {
      return res.status(400).json({ message: "Job and candidates data required" });
    }

    // Fetch the latest job post to ensure it's valid
    const jobPost = await JobPost.findById(jobId);
    if (!jobPost) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Loop through candidates with no match_score
    for (let cand of candidates) {
      const candidateDoc = await Candidate_Job.findById(cand._id);
      if (!candidateDoc) continue;

      // Calculate match score
      const score = calculateMatchScore(jobPost, candidateDoc);

      // Update in DB
      candidateDoc.match_score = score;
      await candidateDoc.save();
    }

    // Fetch updated list of candidates for the job
    const updatedCandidates = await Candidate_Job.find({ job_id: jobId });

    res.status(200).json({
      message: "Match scores updated successfully.",
      candidates: updatedCandidates,
    });
  } catch (error) {
    console.error("Error updating match scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
