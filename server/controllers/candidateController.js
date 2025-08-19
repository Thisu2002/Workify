const User = require('../models/User');
const Candidate = require('../models/Candidate');
const path = require('path');
const fs = require('fs');

// IMPORTANT: Use "exports.getProfile", not "export function" or "export default"
exports.getProfile = async (req, res) => {
  try {
    let candidateProfile = await Candidate.findById(req.user.id).populate({
      path: '_id',
      model: 'User',
      select: 'firstName lastName email'
    });

    if (!candidateProfile) {
      candidateProfile = new Candidate({ _id: req.user.id });
      await candidateProfile.save();
      candidateProfile = await Candidate.findById(req.user.id).populate('_id', 'firstName lastName email');
    }

    const userDetails = candidateProfile._id;
    const response = {
      name: `${userDetails.firstName} ${userDetails.lastName}`,
      email: userDetails.email,
      about: candidateProfile.about,
      contact: {
        email: userDetails.email,
        phone: candidateProfile.contact?.phone || '',
        location: candidateProfile.contact?.location || '',
        age: candidateProfile.contact?.age || '',
      },
      skills: candidateProfile.skills,
      experience: candidateProfile.experience,
      education: candidateProfile.education,
      avatarUrl: candidateProfile.avatarUrl,
      cvs: candidateProfile.cvs, 
    };
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// IMPORTANT: Use "exports.updateProfile"
exports.updateProfile = async (req, res) => {
    const { name, about, contact, skills, experience, education, avatarUrl } = req.body;
    try {
        if (name) {
            const nameParts = name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            await User.findByIdAndUpdate(req.user.id, { $set: { firstName, lastName } });
        }
        const candidateFields = { about, contact, skills, experience, education, avatarUrl };
        await Candidate.findByIdAndUpdate(req.user.id, { $set: candidateFields });
        res.status(200).json({ msg: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// UPDATE this function
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded.' });
    }

    // The URL path we will save and send to the frontend
    // It will look like: /uploads/avatars/1634567890123-my-avatar.png
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update the candidate's profile
    await Candidate.findByIdAndUpdate(req.user.id, { $set: { avatarUrl } });

    res.json({
      msg: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl, // Send the relative path back
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// UPDATE this function to delete the file from the server
exports.deleteAvatar = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id);
        const oldAvatarUrl = candidate.avatarUrl;

        // Remove the reference from our DB
        await Candidate.findByIdAndUpdate(req.user.id, { $set: { avatarUrl: '' } });

        // If there was an old avatar, delete the file from the file system
        if (oldAvatarUrl) {
            // Construct the full path to the file
            const filePath = path.join(__dirname, '..', oldAvatarUrl);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }
        
        res.json({ msg: 'Avatar deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.handleCvUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded.' });
    }

    const candidate = await Candidate.findById(req.user.id);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate profile not found.' });
    }
    
    const newCv = {
      filename: req.file.originalname,
      url: `/uploads/cvs/${req.file.filename}` 
    };

    candidate.cvs.unshift(newCv);
    await candidate.save();

    // Send back the complete, updated list of CVs
    res.json({
      msg: 'CV uploaded successfully',
      cvs: candidate.cvs
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.handleCvDelete = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id);

        // Find the cv to be deleted
        const cvToDelete = candidate.cvs.find(
            (cv) => cv._id.toString() === req.params.cv_id
        );

        if (!cvToDelete) {
            return res.status(404).json({ msg: 'CV not found' });
        }

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, '..', cvToDelete.url);
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file: ${filePath}`, err);
        });

        // Remove the CV from the array in the database
        candidate.cvs = candidate.cvs.filter(
            (cv) => cv._id.toString() !== req.params.cv_id
        );

        await candidate.save();

        // Return the updated list of CVs
        res.json({ msg: 'CV removed', cvs: candidate.cvs });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};