const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all active mentors
router.get('/', async (req, res) => {
  try {
    const { search, specialty, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Filter by specialty
    if (specialty) {
      query.specialties = { $in: [specialty] };
    }
    
    const mentors = await Mentor.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ rating: -1, totalSessions: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Mentor.countDocuments(query);
    
    const formattedMentors = mentors.map(mentor => ({
      id: mentor._id,
      userId: mentor.userId._id,
      name: mentor.name,
      avatar: mentor.avatar,
      role: mentor.role,
      company: mentor.company,
      bio: mentor.bio,
      specialties: mentor.specialties,
      experience: mentor.experience,
      rating: mentor.rating,
      totalSessions: mentor.totalSessions,
      socialLinks: mentor.socialLinks
    }));
    
    return res.status(200).json({
      success: true,
      data: formattedMentors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMentors: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching mentors'
    });
  }
});

// Get mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('userId', 'firstName lastName email');
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        id: mentor._id,
        userId: mentor.userId._id,
        name: mentor.name,
        avatar: mentor.avatar,
        role: mentor.role,
        company: mentor.company,
        bio: mentor.bio,
        specialties: mentor.specialties,
        experience: mentor.experience,
        rating: mentor.rating,
        totalSessions: mentor.totalSessions,
        availability: mentor.availability,
        socialLinks: mentor.socialLinks
      }
    });
  } catch (error) {
    console.error('Error fetching mentor:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching mentor details'
    });
  }
});

// Create/Update mentor profile (for mentors only)
router.post('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user is a mentor
    const user = await User.findById(userId);
    if (!user || !user.user_roles.includes('mentor')) {
      return res.status(403).json({
        success: false,
        message: 'Only mentors can create mentor profiles'
      });
    }
    
    const {
      role,
      company,
      bio,
      specialties,
      experience,
      availability,
      socialLinks
    } = req.body;
    
    const mentorData = {
      userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role,
      company: company || '',
      bio,
      specialties,
      experience: experience || 0,
      availability: availability || {},
      socialLinks: socialLinks || {}
    };
    
    let mentor = await Mentor.findOne({ userId });
    
    if (mentor) {
      // Update existing mentor
      mentor = await Mentor.findOneAndUpdate(
        { userId },
        mentorData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new mentor
      mentor = new Mentor(mentorData);
      await mentor.save();
    }
    
    return res.status(200).json({
      success: true,
      message: 'Mentor profile updated successfully',
      data: mentor
    });
  } catch (error) {
    console.error('Error updating mentor profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating mentor profile'
    });
  }
});

// Get specialties list (for filtering)
router.get('/meta/specialties', async (req, res) => {
  try {
    const specialties = await Mentor.distinct('specialties', { isActive: true });
    return res.status(200).json({
      success: true,
      data: specialties.sort()
    });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching specialties'
    });
  }
});

module.exports = router;