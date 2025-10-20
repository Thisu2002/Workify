const Company = require('../models/Company');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Candidate = require('../models/Candidate');
const MentorVerification = require('../models/MentorVerification');
const Mentor = require('../models/Mentor');
const BusinessManager = require('../models/BusinessManager');

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

         // 4️⃣ BUSINESS MANAGERS — load all BMs once and map by userId (mirrors candidate approach)
    const allBMs = await BusinessManager.find({}).lean();
    const bmByUserId = {};
    allBMs.forEach((bm) => {
      if (bm.userId) bmByUserId[String(bm.userId)] = bm;
    });

    const business_managers = users
      .filter((u) => {
        if (!u || !u.user_roles) return false;
        let roles = u.user_roles;
        if (typeof roles === 'string') roles = roles.split(',').map(r => r.trim());
        return Array.isArray(roles) && roles.map(r => r.toLowerCase()).includes('business_manager');
      })
      .map((u) => {
        const bm = bmByUserId[String(u._id)] || null;
        return {
          id: u._id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
          email: u.email,
          position: bm?.position || 'Business Manager',
          description: bm?.description || '',
          status: bm?.status || 'Active',
          phone: bm?.contactNumber || u.contactNumber || '',
          image: bm?.image || 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
        };
      });


    res.status(200).json({
      recruiters,
      candidates,
      mentors,
      business_managers
    });
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments({});
    res.status(200).json({ totalUsers: count });
  } catch (err) {
    console.error('Error fetching user count:', err);
    res.status(500).json({ message: 'Error fetching user count', error: err.message });
  }
};

// adminController.js
exports.getActiveUsersToday = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const activeCount = await User.countDocuments({
      lastLogin: { $gte: startOfToday, $lte: endOfToday }
    });

    res.status(200).json({ activeUsersToday: activeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching active users today' });
  }
};

// Get recent active users (last 10 logins)
exports.getRecentActiveUsers = async (req, res) => {
  try {
    // Fetch users who logged in, sorted by lastLogin descending
    const users = await User.find({ lastLogin: { $ne: null } })
      .sort({ lastLogin: -1 })
      .limit(10)
      .lean();

    const recentActiveUsers = users.map(u => ({
      id: u._id,
      name: `${u.firstName} ${u.lastName}`,
      role: u.user_roles[0] || 'User', // assuming first role
      lastActive: u.lastLogin
    }));

    res.status(200).json(recentActiveUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recent active users' });
  }
};

// GET /admin/platform-usage
exports.getPlatformUsage = async (req, res) => {
  try {
    // Aggregate users by month for the current year
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

    const usage = await User.aggregate([
      { 
        $match: { lastLogin: { $gte: startOfYear, $lte: endOfYear } } 
      },
      {
        $group: {
          _id: { $month: "$lastLogin" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Convert to chart format: { name: 'Jan', users: 123 }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = months.map((m, i) => {
      const monthData = usage.find(u => u._id === i + 1);
      return { name: m, users: monthData ? monthData.count : 0 };
    });

    res.status(200).json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching platform usage', error: err.message });
  }
};

exports.getAdminUser = async (req, res) => {
  try {
    const admin = await User.findOne({ user_roles: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });

    res.status(200).json({ 
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      lastLogin: admin.lastLogin  // include last login
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching admin user' });
  }
};
