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