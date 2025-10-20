const Post = require("../models/JobPost");
const jwt = require("jsonwebtoken");
const Panel = require("../models/Panel");
const Skill = require("../models/Skill");
const Company = require("../models/Company");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const CandidateJob = require('../models/Candidate_Job');
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');

// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get recruiter ID from authenticated user
    const recruiterId = req.user.id;

    // Get filter parameter (default to 'weekly')
    const { filter = 'weekly', acquisitionMonth = 'current' } = req.query;

    // Get recruiter with company info and user info
    const recruiter = await Recruiter.findById(recruiterId).populate('company_id');
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    // Get user details for profile
    const user = await User.findById(recruiterId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all job posts for this recruiter
    const allJobs = await Post.find({ recruiter_id: recruiterId });
    const jobIds = allJobs.map(job => job._id);

    // 1. Job Posts Count (Open)
    const openJobsCount = allJobs.filter(job => job.status === 'Open').length;

    // 2. Applications Count (New this month)
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const newApplicationsCount = await CandidateJob.countDocuments({
      job_id: { $in: jobIds },
      date_applied: { $gte: firstDayOfMonth }
    });

    // 3. Scheduled Interviews Count (only scheduled, not completed)
    // Include: scheduled, interviewPending, interviewScheduled, candidatesNotified (exclude interviewCompleted)
    const scheduledInterviewsCount = await CandidateJob.countDocuments({
      job_id: { $in: jobIds },
      current_status: { $regex: /(scheduled|interviewPending|interviewScheduled|candidatesNotified)(?!.*completed)/i }
    });    // 4. Top Active Jobs (with filter: daily, weekly, monthly)
    let filterDate = new Date();
    if (filter === 'daily') {
      filterDate.setHours(0, 0, 0, 0); // Start of today
    } else if (filter === 'weekly') {
      filterDate.setDate(filterDate.getDate() - 7); // Last 7 days
    } else if (filter === 'monthly') {
      filterDate.setMonth(filterDate.getMonth() - 1); // Last 30 days
    }

    const topJobs = await Promise.all(
      allJobs.slice(0, 10).map(async (job) => {
        const applications = await CandidateJob.countDocuments({
          job_id: job._id,
          date_applied: { $gte: filterDate }
        });
        const shortlisted = await CandidateJob.countDocuments({
          job_id: job._id,
          current_status: { $regex: /shortlisted/i }
        });
        const rejected = await CandidateJob.countDocuments({
          job_id: job._id,
          current_status: { $regex: /rejected/i }
        });

        return {
          jobId: job._id,
          jobTitle: job.title,
          applications,
          shortlisted,
          rejected
        };
      })
    );

    // Sort by applications and get top jobs
    const sortedTopJobs = topJobs.sort((a, b) => b.applications - a.applications).slice(0, 5);

    // Get daily application data for chart
    const applicationsByDate = await CandidateJob.aggregate([
      {
        $match: {
          job_id: { $in: jobIds },
          date_applied: { $gte: filterDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date_applied" }
          },
          applications: { $sum: 1 },
          shortlisted: {
            $sum: {
              $cond: [{ $regexMatch: { input: "$current_status", regex: /shortlisted/i } }, 1, 0]
            }
          },
          rejected: {
            $sum: {
              $cond: [{ $regexMatch: { input: "$current_status", regex: /rejected/i } }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Fill in missing dates with zero values
    const daysToShow = filter === 'daily' ? 7 : filter === 'weekly' ? 7 : 30;
    const chartData = [];
    const today = new Date();
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const existingData = applicationsByDate.find(d => d._id === dateStr);
      
      chartData.push({
        date: dateStr,
        applications: existingData ? existingData.applications : 0,
        shortlisted: existingData ? existingData.shortlisted : 0,
        rejected: existingData ? existingData.rejected : 0
      });
    }

    // 5. Acquisitions (Application Funnel - with month filter)
    // Calculate the month range based on acquisitionMonth parameter
    const now = new Date();
    let acquisitionStartDate, acquisitionEndDate;
    let monthLabel;
    
    if (acquisitionMonth === 'current') {
      // Current month (October 2025)
      acquisitionStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      acquisitionEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else {
      // Parse month offset (e.g., "1" for last month, "2" for 2 months ago, etc.)
      const monthsAgo = parseInt(acquisitionMonth) || 0;
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
      acquisitionStartDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      acquisitionEndDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 23, 59, 59);
      monthLabel = targetMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    
    const totalApplicationsFiltered = await CandidateJob.countDocuments({
      job_id: { $in: jobIds },
      date_applied: { $gte: acquisitionStartDate, $lte: acquisitionEndDate }
    });

    const shortlistedFiltered = await CandidateJob.countDocuments({
      job_id: { $in: jobIds },
      current_status: { $regex: /shortlisted/i },
      date_applied: { $gte: acquisitionStartDate, $lte: acquisitionEndDate }
    });

    const onHoldFiltered = await CandidateJob.countDocuments({
      job_id: { $in: jobIds },
      current_status: { $regex: /on-hold/i },
      date_applied: { $gte: acquisitionStartDate, $lte: acquisitionEndDate }
    });

    const rejectedFiltered = await CandidateJob.countDocuments({
      job_id: { $in: jobIds },
      current_status: { $regex: /rejected/i },
      date_applied: { $gte: acquisitionStartDate, $lte: acquisitionEndDate }
    });

    const acquisitions = {
      applicationsPercentage: totalApplicationsFiltered > 0 ? Math.round((totalApplicationsFiltered / totalApplicationsFiltered) * 100) : 0,
      shortlistedPercentage: totalApplicationsFiltered > 0 ? Math.round((shortlistedFiltered / totalApplicationsFiltered) * 100) : 0,
      onHoldPercentage: totalApplicationsFiltered > 0 ? Math.round((onHoldFiltered / totalApplicationsFiltered) * 100) : 0,
      rejectedPercentage: totalApplicationsFiltered > 0 ? Math.round((rejectedFiltered / totalApplicationsFiltered) * 100) : 0,
      // Add actual counts
      applicationsCount: totalApplicationsFiltered,
      shortlistedCount: shortlistedFiltered,
      onHoldCount: onHoldFiltered,
      rejectedCount: rejectedFiltered,
      monthLabel: monthLabel
    };

    // 6. New Applicants (Latest 10 applicants, not just today)
    const newApplicants = await CandidateJob.find({
      job_id: { $in: jobIds }
    })
      .populate('job_id', 'title')
      .sort({ date_applied: -1 })
      .limit(10);

    const applicantsList = newApplicants.map(app => ({
      name: `${app.firstName} ${app.lastName}`,
      jobTitle: app.job_id?.title || 'Unknown Job',
      appliedDate: app.date_applied
    }));

    // 7. Company Profile
    const companyProfile = {
      name: recruiter.company_id?.name || 'Unknown Company',
      location: recruiter.company_id?.location || 'Unknown Location',
      description: recruiter.company_id?.description || '',
      verified: true,
      badge: 'Expert'
    };

    // 8. User Profile Details
    const userProfile = {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      email: user.email || '',
      role: 'Hiring Manager',
      experience: '3 years experience'
    };

    res.status(200).json({
      jobPosts: openJobsCount,
      applications: newApplicationsCount,
      interviews: scheduledInterviewsCount,
      topActiveJobs: sortedTopJobs,
      topActiveJobsFilter: filter,
      chartData: chartData, // Add actual date-based chart data
      acquisitions,
      newApplicants: applicantsList,
      companyProfile,
      userProfile
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
  }
};

exports.getJobPosts = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const recruiter = await Recruiter.findById(decoded.id).select("company_id");
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const posts = await Post.find({ company_id: recruiter.company_id });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching job posts:", err);
    res.status(500).json({ message: "Error fetching job posts", error: err.message });
  }
};


exports.postJob = async (req, res) => {
  const {
    title,
    description,
    location,
    salary,
    jobType,
    deadline,
    skills,
    education_requirements,
    experience,
    qualifications,
    preferred_qualifications,
    comments,
    interview_rounds,
    quiz,
  } = req.body;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiter_id = decoded.id;

    const recruiter = await Recruiter.findById(recruiter_id).select("company_id");
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const newPost = new Post({
      title,
      description,
      location,
      salary,
      jobType,
      deadline,
      skills,
      education_requirements,
      experience,
      qualifications,
      preferred_qualifications,
      comments,
      recruiter_id,
      company_id: recruiter.company_id,
      interview_rounds,
      quiz,
    });

    await newPost.save();

    res.status(201).json({ message: "Job Posted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Job Posting Failed", error: err.message });
  }
};

exports.changeJobStatus = async (req, res) => {
  const { jobId, status } = req.body;
  try {
    const post = await Post.findById(jobId);
    if (!post) {
      return res.status(404).json({ message: "Job post not found" });
    }
    post.status = status;
    await post.save();
    res.status(200).json({ message: "Job status updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating job status", error: err.message });
  }
};

exports.fetchPanels = async (req, res) => {
  try {
    const panels = await Panel.find().select("_id name");
    res.status(200).json(panels);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching panels", error: err.message });
  }
};

exports.fetchSkills = async (req, res) => {
  try {
    const skills = await Skill.find().select("id name");
    res.status(200).json(skills);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching skills", error: err.message });
  }
};

exports.fetchCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("_id name passkey");
    res.status(200).json(companies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching companies", error: err.message });
  }
};

exports.fetchSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json(plans);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching subscription plans",
        error: err.message,
      });
  }
};

// Get all unique candidates who applied to jobs from recruiter's company
exports.getAllCandidates = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    const { jobId } = req.query;

    // Get recruiter to find company
    const Recruiter = require("../models/Recruiter");
    const recruiter = await Recruiter.findById(recruiterId);

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // Find all job posts for this recruiter
    let jobQuery = { recruiter_id: recruiterId };
    if (jobId) {
      jobQuery._id = jobId; // Filter by specific job if provided
    }
    const jobPosts = await Post.find(jobQuery).select("_id");
    const jobIds = jobPosts.map((job) => job._id);

    // Find all applications for these jobs
    const CandidateJob = require("../models/Candidate_Job");
    const User = require("../models/User");
    const Skill = require("../models/Skill");

    const applications = await CandidateJob.find({ job_id: { $in: jobIds } })
      .populate("candidate_id", "avatarUrl contact about")
      .populate("job_id", "title");

    // Fetch all skills once to map skill IDs to names
    const allSkills = await Skill.find();

    // Create a map with both numeric IDs and ObjectId strings for compatibility
    const skillMap = new Map();
    allSkills.forEach((skill, index) => {
      // Map by ObjectId string
      skillMap.set(skill._id.toString(), skill.name);
      // Map by numeric index (in case skills are stored as numbers 1, 2, 3...)
      skillMap.set(index + 1, skill.name);
    });

    // Helper function to map skill IDs to names
    const mapSkillsToNames = (skillIds) => {
      if (!skillIds || !Array.isArray(skillIds)) return [];
      return skillIds
        .map((id) => {
          // Try both the ID directly and as string
          return (
            skillMap.get(id) || skillMap.get(id.toString()) || `Skill ${id}`
          );
        })
        .filter(Boolean);
    };

    // Group by candidate to get unique candidates with aggregated data
    const candidateMap = new Map();

    for (const app of applications) {
      const candidateId = app.candidate_id._id.toString();

      if (!candidateMap.has(candidateId)) {
        // Fetch user email from User model
        const user = await User.findById(candidateId).select("email");

        candidateMap.set(candidateId, {
          _id: candidateId,
          firstName: app.firstName,
          lastName: app.lastName,
          email: user?.email || "",
          phone: app.candidate_id.contact?.phone || "",
          avatarUrl: app.candidate_id.avatarUrl || "",
          about: app.candidate_id.about || "",
          experience: app.experience,
          skills: mapSkillsToNames(app.skills), // Map skill IDs to names
          totalApplications: 0,
          applications: [],
          // Determine overall status priority
          overallStatus: "new",
        });
      }

      const candidate = candidateMap.get(candidateId);
      candidate.totalApplications++;
      candidate.applications.push({
        jobId: app.job_id._id,
        jobTitle: app.job_id.title,
        currentStatus: app.current_status,
        appliedDate: app.date_applied,
        quizScore: app.quiz_score,
        matchScore: app.match_score,
        roundStatus: app.round_status,
      });

      // Update overall status based on priority
      // Priority: selected > completed > interviewScheduled > shortlisted > new > rejected
      const statusPriority = {
        "1_selected": 10,
        "2_selected": 10,
        "3_selected": 10,
        "1_completed": 8,
        "2_completed": 8,
        "3_completed": 8,
        "1_interviewScheduled": 6,
        "2_interviewScheduled": 6,
        "1_interviewPending": 5,
        "2_interviewPending": 5,
        "1_shortlisted": 4,
        "2_shortlisted": 4,
        new: 2,
        "1_rejected": 1,
        "2_rejected": 1,
        "3_rejected": 1,
      };
      const currentPriority = statusPriority[candidate.overallStatus] || 0;
      const newPriority = statusPriority[app.current_status] || 0;

      if (newPriority > currentPriority) {
        candidate.overallStatus = app.current_status;
      }
    }

    const candidates = Array.from(candidateMap.values());

    res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res
      .status(500)
      .json({ message: "Error fetching candidates", error: err.message });
  }
};

// Get applications filtered by status
exports.getApplicationsByStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    const { status, jobId } = req.query; // Filter by status and optional jobId

    // Find all job posts for this recruiter
    let jobQuery = { recruiter_id: recruiterId };
    if (jobId) {
      jobQuery._id = jobId; // Filter by specific job if provided
    }
    const jobPosts = await Post.find(jobQuery).select("_id");
    const jobIds = jobPosts.map((job) => job._id);

    // Build query
    const query = { job_id: { $in: jobIds } };
    if (status) {
      query.current_status = status;
    }

    // Find applications
    const CandidateJob = require("../models/Candidate_Job");
    const User = require("../models/User");
    const Skill = require("../models/Skill");

    const applications = await CandidateJob.find(query)
      .populate("candidate_id", "avatarUrl contact about")
      .populate("job_id", "title")
      .sort({ date_applied: -1 });

    // Fetch all skills once to map skill IDs to names
    const allSkills = await Skill.find();

    // Create a map with both numeric IDs and ObjectId strings for compatibility
    const skillMap = new Map();
    allSkills.forEach((skill, index) => {
      // Map by ObjectId string
      skillMap.set(skill._id.toString(), skill.name);
      // Map by numeric index (in case skills are stored as numbers 1, 2, 3...)
      skillMap.set(index + 1, skill.name);
    });

    // Helper function to map skill IDs to names
    const mapSkillsToNames = (skillIds) => {
      if (!skillIds || !Array.isArray(skillIds)) return [];
      return skillIds
        .map((id) => {
          // Try both the ID directly and as string
          return (
            skillMap.get(id) || skillMap.get(id.toString()) || `Skill ${id}`
          );
        })
        .filter(Boolean);
    };

    // Format response with full application details
    const formattedApplications = await Promise.all(
      applications.map(async (app) => {
        // Fetch user email from User model
        const user = await User.findById(app.candidate_id._id).select("email");

        return {
          _id: app._id,
          candidateId: app.candidate_id._id,
          firstName: app.firstName,
          lastName: app.lastName,
          email: user?.email || "",
          phone: app.candidate_id.contact?.phone || "",
          avatarUrl: app.candidate_id.avatarUrl || "",
          about: app.about,
          jobId: app.job_id._id,
          jobTitle: app.job_id.title,
          experience: app.experience,
          skills: mapSkillsToNames(app.skills), // Map skill IDs to names
          education: app.education,
          currentStatus: app.current_status,
          roundStatus: app.round_status,
          appliedDate: app.date_applied,
          quizScore: app.quiz_score,
          matchScore: app.match_score,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: formattedApplications.length,
      status: status || "all",
      applications: formattedApplications,
    });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err.message });
  }
};

// Get job posts filtered by interview status for interviews page
exports.getInterviewsByStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    // Find all job posts for this recruiter
    const jobPosts = await Post.find({ recruiter_id: recruiterId })
      .populate({
        path: "interview_rounds.panel_id",
        select: "name members lead_panelist",
        populate: {
          path: "members lead_panelist",
          select: "firstName lastName avatarUrl",
        },
      })
      .select(
        "title current_status interview_rounds num_applicants date_posted"
      )
      .sort({ date_posted: -1 });

    // Classify job posts into tabs based on current_status
    const classifiedInterviews = {
      new: [],
      pending: [],
      scheduled: [],
      completed: [],
    };

    // Import Candidate_Job model
    const CandidateJob = require("../models/Candidate_Job");
    const User = require("../models/User");

    // Process each job and fetch candidates based on job status
    for (const job of jobPosts) {
      const status = job.current_status;
      let candidateStatusQuery;
      let tabType;

      // Determine which candidates to fetch based on job status and final_date
      if (
        status.includes("panelRequested") ||
        status.includes("panelConfirmed")
      ) {
        // New tab: fetch shortlisted candidates
        candidateStatusQuery = { $regex: /shortlisted/i };
        tabType = "new";
      } else if (status.includes("candidatesNotified")) {
        // Pending tab: fetch interviewPending or interviewScheduled candidates
        candidateStatusQuery = {
          $regex: /(interviewPending|interviewScheduled)/i,
        };
        tabType = "pending";
      } else if (status.includes("scheduled")) {
        // Check if the interview date has passed
        const currentRound =
          job.interview_rounds && job.interview_rounds.length > 0
            ? job.interview_rounds[job.interview_rounds.length - 1]
            : null;

        const finalDate = currentRound?.final_date;
        const currentDate = new Date();

        if (finalDate && new Date(finalDate) < currentDate) {
          // Interview date has passed - move to completed tab
          candidateStatusQuery = {
            $regex:
              /(interviewPending|interviewScheduled|interviewCompleted|selected|rejected)/i,
          };
          tabType = "completed";
        } else {
          // Interview date is upcoming - keep in scheduled tab
          candidateStatusQuery = {
            $regex: /(interviewPending|interviewScheduled)/i,
          };
          tabType = "scheduled";
        }
      } else if (status.includes("completed")) {
        // Completed tab: fetch all interview candidates (pending, scheduled, completed, selected, rejected)
        candidateStatusQuery = {
          $regex:
            /(interviewPending|interviewScheduled|interviewCompleted|selected|rejected)/i,
        };
        tabType = "completed";
      }

      let relevantCandidates = [];

      if (candidateStatusQuery) {
        // Fetch candidates based on the determined status query
        const candidateApplications = await CandidateJob.find({
          job_id: job._id,
          current_status: candidateStatusQuery,
        }).populate("candidate_id", "avatarUrl");

        // Format candidate data
        const candidatePromises = candidateApplications.map((app) => {
          // Get user email from User model for this candidate
          return User.findById(app.candidate_id._id)
            .select("email")
            .then((user) => {
              // Determine overall result status for completed tab
              let overallResult = "Not Interviewed"; // Default for pending/scheduled
              if (app.current_status.toLowerCase().includes("selected")) {
                overallResult = "Selected";
              } else if (
                app.current_status.toLowerCase().includes("rejected")
              ) {
                overallResult = "Rejected";
              } else if (
                app.current_status.toLowerCase().includes("interviewcompleted")
              ) {
                overallResult = "Completed"; // For completed but not yet selected/rejected
              }

              return {
                candidateId: app.candidate_id._id,
                firstName: app.firstName,
                lastName: app.lastName,
                email: user?.email || app.contact?.email || "",
                phone: app.contact?.phone || "",
                avatarUrl: app.candidate_id.avatarUrl || "",
                applicationId: app._id,
                currentStatus: app.current_status,
                dateApplied: app.date_applied,
                overallResult: overallResult,
                roundStatus: app.round_status || [], // Include round_status array
              };
            });
        });

        // Wait for all candidate data to be resolved
        relevantCandidates = await Promise.all(candidatePromises);
      }

      // Classification logic based on current_status
      if (tabType === "new") {
        classifiedInterviews.new.push(
          formatJobForInterview(job, "new", relevantCandidates)
        );
      } else if (tabType === "pending") {
        classifiedInterviews.pending.push(
          formatJobForInterview(job, "pending", relevantCandidates)
        );
      } else if (tabType === "scheduled") {
        classifiedInterviews.scheduled.push(
          formatJobForInterview(job, "scheduled", relevantCandidates)
        );
      } else if (tabType === "completed") {
        classifiedInterviews.completed.push(
          formatJobForInterview(job, "completed", relevantCandidates)
        );
      }
    }

    res.status(200).json({
      success: true,
      data: classifiedInterviews,
    });
  } catch (err) {
    console.error("Error fetching interviews:", err);
    res
      .status(500)
      .json({ message: "Error fetching interviews", error: err.message });
  }
};

// Helper function to format job data for interview display
const formatJobForInterview = (job, status, relevantCandidates = []) => {
  const currentRound =
    job.interview_rounds && job.interview_rounds.length > 0
      ? job.interview_rounds[job.interview_rounds.length - 1] // Get the latest round
      : null;

  let formattedJob = {
    id: job._id,
    jobTitle: job.title,
    round: currentRound
      ? `Round ${currentRound.round_number}: ${currentRound.round_name}`
      : "Round not defined",
    panel: currentRound?.panel_id?.name || "Panel not assigned",
    panelId: currentRound?.panel_id?._id || null,
    applicationCount: job.num_applicants || 0,
    shortlistedCandidatesCount: relevantCandidates.length, // This now represents relevant candidates for each tab
    shortlistedCandidates: relevantCandidates, // This now contains relevant candidates for each tab
    currentStatus: job.current_status,
  };

  // Add status-specific fields
  if (status === "new") {
    // For new interviews, show panel availability
    if (
      currentRound?.available_dates &&
      currentRound.available_dates.length > 0
    ) {
      const dates = currentRound.available_dates
        .filter((d) => d.date)
        .map((d) =>
          new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );
      formattedJob.panelAvailability =
        dates.length > 0 ? dates.join(", ") : "Waiting for available dates";
    } else {
      formattedJob.panelAvailability = "Waiting for available dates";
    }
  } else if (status === "pending" || status === "scheduled") {
    // For pending/scheduled, show the final interview date
    if (currentRound?.final_date) {
      formattedJob.interviewDate = new Date(
        currentRound.final_date
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      formattedJob.interviewDate = "Date TBD";
    }

    // Add panel members info if available
    if (currentRound?.panel_id?.members) {
      formattedJob.panelMembers = currentRound.panel_id.members.map(
        (member) => ({
          name:
            `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
            "Unknown",
          avatar: member.avatarUrl || null,
        })
      );
    }
  } else if (status === "completed") {
    // For completed interviews, show the date it was completed
    if (currentRound?.final_date) {
      formattedJob.interviewDate = new Date(
        currentRound.final_date
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else {
      formattedJob.interviewDate = "Date not available";
    }

    // Add panel members info if available for completed interviews too
    if (currentRound?.panel_id?.members) {
      formattedJob.panelMembers = currentRound.panel_id.members.map(
        (member) => ({
          name:
            `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
            "Unknown",
          avatar: member.avatarUrl || null,
        })
      );
    }
  }

  return formattedJob;
};

// Notify candidates about interview dates
exports.notifyCandidates = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    const { jobId, finalDate } = req.body;

    if (!jobId || !finalDate) {
      return res
        .status(400)
        .json({ message: "Job ID and final date are required" });
    }

    // Find the job post and verify it belongs to this recruiter
    const jobPost = await Post.findOne({
      _id: jobId,
      recruiter_id: recruiterId,
    }).populate('company_id', 'name');
    
    if (!jobPost) {
      return res
        .status(404)
        .json({ message: "Job post not found or unauthorized" });
    }

    // Verify the job is in the correct status (panelConfirmed)
    if (!jobPost.current_status.includes("panelConfirmed")) {
      return res
        .status(400)
        .json({
          message:
            "Job is not in the correct status for candidate notification",
        });
    }

    // Update job status to candidatesNotified
    jobPost.current_status = jobPost.current_status.replace(
      "panelConfirmed",
      "candidatesNotified"
    );

    // Update the final date for the current round
    let roundNumber = 1;
    if (jobPost.interview_rounds && jobPost.interview_rounds.length > 0) {
      const currentRound =
        jobPost.interview_rounds[jobPost.interview_rounds.length - 1];
      currentRound.final_date = new Date(finalDate);
      roundNumber = jobPost.interview_rounds.length;
    }

    await jobPost.save();

    // Update all shortlisted candidates' status from shortlisted to interviewPending
    const CandidateJob = require("../models/Candidate_Job");
    const User = require("../models/User");

    // Get all shortlisted candidates
    const shortlistedCandidates = await CandidateJob.find({
      job_id: jobId,
      current_status: { $regex: /shortlisted/i },
    });

    // First, update all candidate statuses (critical operation - must succeed)
    console.log(`Updating status for ${shortlistedCandidates.length} candidates for job: ${jobPost.title}`);
    
    for (const candidate of shortlistedCandidates) {
      try {
        candidate.current_status = candidate.current_status.replace(
          /shortlisted/i,
          "interviewPending"
        );
        await candidate.save();
      } catch (error) {
        console.error(`Failed to update status for candidate ${candidate.firstName} ${candidate.lastName}:`, error.message);
      }
    }

    // Then, send emails (non-critical operation - failures are acceptable)
    const { sendInterviewInvitationEmail } = require("../utils/emailService");
    const companyName = jobPost.company_id?.name || "Our Company";
    
    let emailsSent = 0;
    let emailsFailed = 0;
    
    console.log(`Starting to send emails to ${shortlistedCandidates.length} candidates...`);
    
    // Send emails - wrapped in try-catch to prevent any email error from breaking the flow
    for (const candidate of shortlistedCandidates) {
      try {
        // Fetch the candidate's email from the User model
        const user = await User.findById(candidate.candidate_id);
        
        // Send email notification
        if (user?.email) {
          console.log(`Sending email to: ${user.email} (${candidate.firstName} ${candidate.lastName})`);
          
          try {
            const emailResult = await sendInterviewInvitationEmail({
              candidateEmail: user.email,
              candidateName: `${candidate.firstName} ${candidate.lastName}`,
              jobTitle: jobPost.title,
              companyName: companyName,
              interviewDate: finalDate,
              interviewRound: `Round ${roundNumber}`
            });

            if (emailResult.success) {
              emailsSent++;
              console.log(`✓ Email sent successfully to ${user.email}`);
            } else {
              emailsFailed++;
              console.error(`✗ Failed to send email to ${user.email}: ${emailResult.error}`);
            }
          } catch (emailError) {
            // Email sending failed - log but continue
            emailsFailed++;
            console.error(`✗ Exception sending email to ${user.email}:`, emailError.message);
          }
        } else {
          emailsFailed++;
          console.warn(`✗ No email found for candidate: ${candidate.firstName} ${candidate.lastName} (Candidate ID: ${candidate.candidate_id})`);
        }
      } catch (error) {
        // Error fetching user or other issue - log but continue
        emailsFailed++;
        console.error(`✗ Error processing email for candidate ${candidate.firstName} ${candidate.lastName}:`, error.message);
      }
    }
    
    console.log(`Email notification complete: ${emailsSent} sent, ${emailsFailed} failed`);

    res.status(200).json({
      success: true,
      message: "Candidates have been notified successfully",
      updatedCandidates: shortlistedCandidates.length,
      emailsSent: emailsSent,
      emailsFailed: emailsFailed,
      finalDate: finalDate,
    });
  } catch (err) {
    console.error("Error notifying candidates:", err);
    res
      .status(500)
      .json({ message: "Error notifying candidates", error: err.message });
  }
};

// Proceed to interviews - update job status from candidatesNotified to scheduled
exports.proceedToInterviews = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiterId = decoded.id;

    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Find the job post and verify it belongs to this recruiter
    const jobPost = await Post.findOne({
      _id: jobId,
      recruiter_id: recruiterId,
    });
    if (!jobPost) {
      return res
        .status(404)
        .json({ message: "Job post not found or unauthorized" });
    }

    // Verify the job is in the correct status (candidatesNotified)
    if (!jobPost.current_status.includes("candidatesNotified")) {
      return res
        .status(400)
        .json({
          message: "Job is not in the correct status to proceed to interviews",
        });
    }

    // Update job status from candidatesNotified to scheduled (preserve round number)
    jobPost.current_status = jobPost.current_status.replace(
      "candidatesNotified",
      "scheduled"
    );
    await jobPost.save();

    res.status(200).json({
      success: true,
      message: "Successfully proceeded to interviews",
      newStatus: jobPost.current_status,
    });
  } catch (err) {
    console.error("Error proceeding to interviews:", err);
    res
      .status(500)
      .json({ message: "Error proceeding to interviews", error: err.message });
  }
};
