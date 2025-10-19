const Post = require('../models/JobPost');
const Company = require('../models/Company');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Candidate = require('../models/Candidate');
const MentorVerification = require('../models/MentorVerification');
const Mentor = require('../models/Mentor');
const SubscriptionPlan = require('../models/SubscriptionPlan');

console.log('managerController loaded'); // debug

// Get job posts with selected fields only
exports.getJobPosts = async (req, res) => {
  try {
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
      })
      .sort({ date_posted: -1 })
      .lean();

    console.log('managerController.getJobPosts -> found', posts.length, 'posts');
    res.status(200).json(posts);
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

    // (4️⃣ Send email later — commented out)
    // sendAcceptanceEmail(mentorReq.email);

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

    // (Commented out email)
    // sendDeclineEmail(mentorReq.email, reason);

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