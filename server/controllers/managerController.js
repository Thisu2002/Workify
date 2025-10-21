const Post = require('../models/JobPost');
const Company = require('../models/Company');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Candidate = require('../models/Candidate');
const MentorVerification = require('../models/MentorVerification');
const Mentor = require('../models/Mentor');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const RegistrationRequest = require('../models/RegistrationRequest');
const BusinessManager = require('../models/BusinessManager');
const Skill = require('../models/Skill');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Prefer explicit Gmail config using EMAIL_USER / EMAIL_PASS (app password)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: (process.env.SMTP_SECURE === 'true'), // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be 16-char app password (no spaces) for Gmail
  },
});

// verify transporter at startup (logs useful errors)
transporter.verify().then(() => {
  console.log('Email transporter ready');
}).catch(err => {
  console.error('Email transporter verify failed:', err);
});

async function sendEmail(to, subject, html, text) {
  const from = process.env.FROM_EMAIL || process.env.EMAIL_USER || 'no-reply@workify.local';
  try {
    await transporter.sendMail({ from, to, subject, text: text || '', html });
    console.log('Email sent to', to, 'subject:', subject);
  } catch (err) {
    console.error('sendEmail error:', err);
  }
}

console.log('managerController loaded'); // debug

// Get job posts with selected fields only
exports.getJobPosts = async (req, res) => {
  try {
    // Fetch all job posts
    const posts = await Post.find({})
      .select({
        _id: 1,
        title: 1,
        description: 1,
        location: 1,
        salary: 1,
        jobType: 1,
        deadline: 1,
        education_requirements: 1,
        date_posted: 1,
        status: 1,
        company_id: 1,      // <-- include company reference
        recruiter_id: 1,    // <-- include recruiter reference if present
        skills: 1, // include skill IDs
      })
      .sort({ date_posted: -1 })
      .lean();

    console.log('managerController.getJobPosts -> found', posts.length, 'posts');

    // Fetch all skills once for mapping
    const allSkills = await Skill.find({}).lean();
    const skillMap = {};
    allSkills.forEach(skill => {
      skillMap[skill.id] = skill.name;
    });

    // Map skill IDs to skill names for each post
    const postsWithSkillNames = posts.map(post => ({
      ...post,
      skills: Array.isArray(post.skills)
        ? post.skills.map(skillId => skillMap[skillId] || `Unknown(${skillId})`)
        : [],
    }));

    res.status(200).json(postsWithSkillNames);
  } catch (err) {
    console.error('getJobPosts error:', err);
    res.status(500).json({
      message: 'Error fetching job posts',
      error: err.message,
    });
  }
};


exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({})
      .select({
        _id: 1,
        name: 1,
        location: 1,
        description: 1,
        website: 1,
      })
      .lean();

    console.log('managerController.getCompanies -> found', companies.length, 'companies');
    res.status(200).json(companies);
  } catch (err) {
    console.error('getCompanies error:', err);
    res.status(500).json({
      message: 'Error fetching companies',
      error: err.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();

    // 1️⃣ RECRUITERS
    const recruiters = await Promise.all(
      users
        .filter((u) => u.user_roles.includes('recruiter'))
        .map(async (u) => {
          const recruiter = await Recruiter.findById(u._id).lean();
          let companyName = '';
          if (recruiter && recruiter.company_id) {
            const company = await Company.findById(recruiter.company_id).lean();
            companyName = company ? company.name : '';
          }
          return {
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            position: 'Recruiter',
            company: companyName,
            phone: u.contactNumber || '',
            image: recruiter?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          };
        })
    );

    // 2️⃣ CANDIDATES
    const candidates = await Promise.all(
      users
        .filter((u) => u.user_roles.includes('candidate'))
        .map(async (u) => {
          const candidate = await Candidate.findById(u._id).lean();
          return {
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            position: 'Candidate',
            skills: candidate?.skills || [],
            image: candidate?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
          };
        })
    );

    // 3️⃣ MENTORS
    const mentors = users
      .filter((u) => u.user_roles.includes('mentor'))
      .map((u) => ({
        id: u._id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        position: 'Mentor',
        image: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png',
      }));

    // 4️⃣ BLOCKED CANDIDATES (if you want to manage separately)
    const blockedCandidates = []; // For now empty; can integrate later

    res.status(200).json({
      recruiters,
      candidates,
      mentors,
      'blocked-candidates': blockedCandidates,
    });
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Get all pending mentor verification requests
exports.getPendingMentors = async (req, res) => {
  try {
    const mentors = await MentorVerification.find({ status: 'Pending' }).lean();
    res.status(200).json(mentors);
  } catch (err) {
    console.error('getPendingMentors error:', err);
    res.status(500).json({ message: 'Error fetching mentor requests', error: err.message });
  }
};

// Accept mentor request
exports.acceptMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const mentorReq = await MentorVerification.findById(id);
    if (!mentorReq) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }

    // 1️⃣ Create User
    const newUser = new User({
      email: mentorReq.email,
      password: 'hashed_default_password', // Replace later with actual password flow
      firstName: mentorReq.firstName,
      lastName: mentorReq.lastName,
      contactNumber: mentorReq.contactNumber,
      user_roles: ['mentor']
    });
    await newUser.save();

    // 2️⃣ Create Mentor
    const newMentor = new Mentor({
      _id: newUser._id,
      field: mentorReq.field,
      experience: mentorReq.experience,
      bio: mentorReq.bio,
      linkedin: mentorReq.linkedin,
      contactNumber: mentorReq.contactNumber
    });
    await newMentor.save();

    // 3️⃣ Update verification record
    mentorReq.status = 'Accepted';
    await mentorReq.save();

    // Notify mentor by email
    const html = `
      <p>Hi ${mentorReq.firstName},</p>
      <p>Your mentor verification request has been <strong>accepted</strong>. Welcome aboard!</p>
      <p>We will notify you with login details / next steps shortly.</p>
      <p>Regards,<br/>Workify Team</p>
    `;
    await sendEmail(mentorReq.email, 'Mentor Verification Accepted - Workify', html);

    res.status(200).json({ message: 'Mentor accepted successfully.' });
  } catch (err) {
    console.error('acceptMentor error:', err);
    res.status(500).json({ message: 'Error accepting mentor', error: err.message });
  }
};

// Decline mentor request
exports.declineMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const mentorReq = await MentorVerification.findById(id);
    if (!mentorReq) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }

    mentorReq.status = 'Declined';
    mentorReq.reason = reason;
    await mentorReq.save();

    // Notify mentor by email
    const html = `
      <p>Hi ${mentorReq.firstName},</p>
      <p>Your mentor verification request has been <strong>declined</strong>.</p>
      <p>Reason: ${reason || 'Not specified'}</p>
      <p>Regards,<br/>Workify Team</p>
    `;
    await sendEmail(mentorReq.email, 'Mentor Verification Declined - Workify', html);

    res.status(200).json({ message: 'Mentor declined successfully.' });
  } catch (err) {
    console.error('declineMentor error:', err);
    res.status(500).json({ message: 'Error declining mentor', error: err.message });
  }
};

// Get all subscription plans with subscribers count
exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({}).lean();

    // Attach number of companies subscribed to each plan
    const plansWithSubscribers = await Promise.all(
      plans.map(async (plan) => {
        const subscribedCompanies = await Company.find({ 'currentSubscription.plan': plan._id }).select('name').lean();
        return {
          ...plan,
          subscribers: subscribedCompanies.length,
          companies: subscribedCompanies.map(c => c.name)
        };
      })
    );

    res.status(200).json(plansWithSubscribers);
  } catch (err) {
    console.error('getSubscriptionPlans error:', err);
    res.status(500).json({ message: 'Error fetching subscription plans', error: err.message });
  }
};

// Create a new subscription plan
exports.createSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, features, billingCycle, description, trialDays } = req.body;

    const newPlan = new SubscriptionPlan({
      name,
      price,
      features: features.split(',').map(f => f.trim()),
      billingCycle,
      description,
      trialDays,
      isActive: true
    });

    await newPlan.save();
    res.status(201).json({ message: 'Subscription plan created successfully', plan: newPlan });
  } catch (err) {
    console.error('createSubscriptionPlan error:', err);
    res.status(500).json({ message: 'Error creating subscription plan', error: err.message });
  }
};

// Update existing plan
exports.updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, features, billingCycle, description, trialDays } = req.body;

    const plan = await SubscriptionPlan.findById(id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    plan.name = name || plan.name;
    plan.price = price || plan.price;
    if (features) {
      if (Array.isArray(features)) {
        plan.features = features.map(f => f.trim());
      } else if (typeof features === 'string') {
        plan.features = features.split(',').map(f => f.trim());
      }
    }
    plan.billingCycle = billingCycle || plan.billingCycle;
    plan.description = description || plan.description;
    plan.trialDays = trialDays || plan.trialDays;

    await plan.save();
    res.status(200).json({ message: 'Plan updated successfully', plan });
  } catch (err) {
    console.error('updateSubscriptionPlan error:', err);
    res.status(500).json({ message: 'Error updating subscription plan', error: err.message });
  }
};

// Enable / Disable plan
exports.toggleSubscriptionPlanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlan.findById(id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    plan.isActive = !plan.isActive;
    await plan.save();
    res.status(200).json({ message: `Plan ${plan.isActive ? 'enabled' : 'disabled'} successfully`, plan });
  } catch (err) {
    console.error('toggleSubscriptionPlanStatus error:', err);
    res.status(500).json({ message: 'Error toggling plan status', error: err.message });
  }
};

// Get companies subscribed to a plan
exports.getSubscribedCompanies = async (req, res) => {
  try {
    const { id } = req.params;
    const companies = await Company.find({ 'currentSubscription.plan': id }).select('name location website currentSubscription').lean();
    res.status(200).json(companies);
  } catch (err) {
    console.error('getSubscribedCompanies error:', err);
    res.status(500).json({ message: 'Error fetching subscribed companies', error: err.message });
  }
};

// Get all pending registration requests
exports.getRegistrationRequests = async (req, res) => {
  try {
    const requests = await RegistrationRequest.find({ status: 'Pending' }).lean();
    res.status(200).json(requests);
  } catch (err) {
    console.error('getRegistrationRequests error:', err);
    res.status(500).json({ message: 'Error fetching registration requests', error: err.message });
  }
};

// Accept registration request
exports.acceptRegistrationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RegistrationRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const newCompany = new Company({
      name: request.companyName,
      location: request.address || 'N/A',
      description: request.description,
      website: request.website,
      currentSubscription: {
        plan: request.subscriptionPlan.planId,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
        status: 'active'
      },
      passkey: request.passkey || crypto.randomBytes(12).toString('hex')
    });

    await newCompany.save();

    // Update request status
    request.status = 'Accepted';
    await request.save();

    // Notify requester by email
    const html = `
      <p>Dear ${request.contactPerson || request.companyName},</p>
      <p>Your company registration request has been <strong>accepted</strong>.</p>
      <p>Company: <strong>${newCompany.name}</strong></p>
      <p>Passkey: <code>${newCompany.passkey}</code></p>
      <p>You can now login and complete your profile.</p>
      <p>Regards,<br/>Workify Team</p>
    `;
    await sendEmail(request.email, 'Company Registration Accepted - Workify', html);
    
    // (Optional: Send notification/email here)
    res.status(200).json({ message: 'Registration request accepted and email sent', company: newCompany });
  } catch (err) {
    console.error('acceptRegistrationRequest error:', err);
    res.status(500).json({ message: 'Error accepting registration request', error: err.message });
  }
};

// Decline registration request
exports.declineRegistrationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const request = await RegistrationRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'Declined';
    request.declineReason = reason;
    await request.save();

    // Notify requester by email
    const html = `
      <p>Dear ${request.contactPerson || request.companyName},</p>
      <p>We regret to inform you that your company registration request has been <strong>declined</strong>.</p>
      <p>Reason: ${reason || 'Not specified'}</p>
      <p>If you believe this is a mistake please contact support.</p>
      <p>Regards,<br/>Workify Team</p>
    `;
    await sendEmail(request.email, 'Company Registration Declined - Workify', html);

    // (Optional: Send alert/email here)
    res.status(200).json({ message: 'Registration request declined and email sent', request });
  } catch (err) {
    console.error('declineRegistrationRequest error:', err);
    res.status(500).json({ message: 'Error declining registration request', error: err.message });
  }
};

// Get active business manager
exports.getActiveBusinessManager = async (req, res) => {
  try {
    const manager = await BusinessManager.findOne({ status: 'Active' }).lean();
    if (!manager) return res.status(404).json({ message: 'No active manager found' });

    res.status(200).json(manager);
  } catch (err) {
    console.error('getActiveBusinessManager error:', err);
    res.status(500).json({ message: 'Error fetching active manager', error: err.message });
  }
};

// Update manager profile
exports.updateBusinessManager = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const manager = await BusinessManager.findById(id);
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    Object.assign(manager, updates);
    await manager.save();

    res.status(200).json({ message: 'Manager updated successfully', manager });
  } catch (err) {
    console.error('updateBusinessManager error:', err);
    res.status(500).json({ message: 'Error updating manager', error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalJobPosts = await Post.countDocuments({ status: 'Open' });
    const pendingMentorRequests = await MentorVerification.countDocuments({ status: 'Pending' });
    const pendingCompanyRequests = await RegistrationRequest.countDocuments({ status: 'Pending' });

    res.status(200).json({
      totalJobPosts,
      pendingMentorRequests,
      pendingCompanyRequests
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
  }
};

// Get job posting count over time (grouped by month)
exports.getJobPostingTrends = async (req, res) => {
  try {
    const jobPosts = await Post.aggregate([
      {
        $match: { status: 'Open' }
      },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$date_posted" } },
            month: { $month: { $toDate: "$date_posted" } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const formatted = jobPosts.map(item => ({
      name: `${item._id.month}/${item._id.year}`,
      postings: item.count
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('getJobPostingTrends error:', err);
    res.status(500).json({ message: 'Error fetching job posting trends', error: err.message });
  }
};

exports.getAnalyticsData = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    // 1️⃣ Users: count by role (excluding admin & business_manager)
    const userAggregation = await User.aggregate([
      { $match: { user_roles: { $exists: true, $not: { $size: 0 } } } },
      { $unwind: "$user_roles" },
      {
        $group: {
          _id: "$user_roles",
          count: { $sum: 1 }
        }
      }
    ]);

    // 2️⃣ Companies: registrations over time (use RegistrationRequest pending requests)
    const companyTrends = await RegistrationRequest.aggregate([
      {
        $addFields: {
          createdAtAgg: { $ifNull: ["$createdAt", "$requestDate", { $toDate: "$_id" }] }
        }
      },
      { $match: { createdAtAgg: { $gte: sixMonthsAgo }, status: "Pending" } },
      {
        $group: {
          _id: { $month: "$createdAtAgg" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 3️⃣ Subscription Plans usage
    const planStats = await Company.aggregate([
      { $match: { "currentSubscription.plan": { $exists: true } } },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "currentSubscription.plan",
          foreignField: "_id",
          as: "planDetails"
        }
      },
      { $unwind: "$planDetails" },
      {
        $group: {
          _id: "$planDetails.name",
          companies: { $sum: 1 }
        }
      }
    ]);

    // 4️⃣ Job posts trend
    const jobPostTrends = await Post.aggregate([
      {
        $match: { date_posted: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: { $month: "$date_posted" },
          jobsPosted: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 5️⃣ Mentor verifications trend
    const mentorVerificationTrends = await MentorVerification.aggregate([
      // ensure we have a date field to work with (createdAt or ObjectId timestamp)
      {
        $addFields: {
          createdAtAgg: {
            $ifNull: ["$createdAt", { $toDate: "$_id" }]
          }
        }
      },
      { $match: { createdAtAgg: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAtAgg" },
            month: { $month: "$createdAtAgg" }
          },
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 6️⃣ Registration requests trend
    const registrationTrends = await RegistrationRequest.aggregate([
      // ensure we have a date to work with: prefer createdAt, then requestDate, then ObjectId timestamp
      {
        $addFields: {
          createdAtAgg: {
            $ifNull: ["$createdAt", "$requestDate", { $toDate: "$_id" }]
          }
        }
      },
      { $match: { createdAtAgg: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAtAgg" },
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      users: userAggregation,
      companies: companyTrends,
      plans: planStats,
      jobs: jobPostTrends,
      mentorVerifications: mentorVerificationTrends,
      registrationRequests: registrationTrends
    });
  } catch (err) {
    console.error("getAnalyticsData error:", err);
    res.status(500).json({ message: "Error fetching analytics", error: err.message });
  }
};


exports.getCompanyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Load company and populate recruiters and subscription plan if possible
    const company = await Company.findById(id)
      .populate({ path: 'recruiters', select: '_id name email contactNumber company firstName lastName' })
      .populate({ path: 'currentSubscription.plan', model: 'SubscriptionPlan' })
      .lean();

    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Fetch jobs for this company (ensure company_id exists on JobPost)
    const jobs = await Post.find({ company_id: company._id })
      .select({
        _id: 1,
        title: 1,
        description: 1,
        location: 1,
        salary: 1,
        jobType: 1,
        deadline: 1,
        education_requirements: 1,
        date_posted: 1,
        status: 1,
        company_id: 1,
        skills: 1,
      })
      .sort({ date_posted: -1 })
      .lean();

    // Clean recruiters array (filter out nulls and normalize name)
    const recruiters = (company.recruiters || [])
      .filter(Boolean)
      .map((r) => ({
        _id: r._id,
        name: r.name || `${r.firstName || ''} ${r.lastName || ''}`.trim(),
        email: r.email,
        contactNumber: r.contactNumber,
        company: r.company,
      }));

    // If currentSubscription.plan is an ObjectId (not populated), try to fetch the plan
    let plan = null;
    if (company.currentSubscription?.plan) {
      if (typeof company.currentSubscription.plan === 'object' && company.currentSubscription.plan.name) {
        plan = company.currentSubscription.plan;
      } else {
        // fetch plan by id as fallback
        try {
          plan = await SubscriptionPlan.findById(company.currentSubscription.plan).lean();
        } catch (e) {
          plan = null;
        }
      }
    }

    res.status(200).json({
      ...company,
      recruiters,
      jobs,
      subscriptionPlan: plan,
    });
  } catch (err) {
    console.error('getCompanyDetails error:', err);
    res.status(500).json({ message: 'Error fetching company details', error: err.message });
  }
};

// module.exports = async function checkSubscriptionLimit(req, res, next) {
//   try {
//     // determine company id: prefer explicit company_id in request body,
//     // otherwise use recruiter_id -> lookup recruiter.company_id
//     let companyId = req.body.company_id;
//     if (!companyId && req.body.recruiter_id) {
//       const recruiter = await Recruiter.findById(req.body.recruiter_id).lean();
//       companyId = recruiter?.company_id;
//     }

//     if (!companyId) {
//       // If company not determinable, allow (or you can block)
//       return res.status(400).json({ message: 'company_id or recruiter_id required' });
//     }

//     const company = await Company.findById(companyId).lean();
//     if (!company) return res.status(404).json({ message: 'Company not found' });

//     const planRef = company.currentSubscription?.plan;
//     if (!planRef) return next(); // no plan => treat as allowed (or if you want block, change here)

//     // get plan (planRef may be populated or an ObjectId)
//     const plan = await (typeof planRef === 'object' && planRef.name
//       ? Promise.resolve(planRef)
//       : SubscriptionPlan.findById(planRef).lean());

//     if (!plan || plan.maxPosts == null) {
//       // unlimited or no well-defined plan -> allow
//             return next();
//     }

//     // count active / open posts for this company
//     const activeCount = await Post.countDocuments({ company_id: companyId, status: 'Open' });

//     if (activeCount >= plan.maxPosts) {
//       return res.status(403).json({
//         message: `Post limit reached for current subscription plan (${plan.name}). Max active posts allowed: ${plan.maxPosts}. Please upgrade the plan to post more jobs.`
//       });
//     }

//     return next();
//   } catch (err) {
//     console.error('checkSubscriptionLimit error:', err);
//     return res.status(500).json({ message: 'Error verifying subscription', error: err.message });
//   }
// };


