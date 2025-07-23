const User = require('../models/User');
const Candidate = require('../models/Candidate');

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