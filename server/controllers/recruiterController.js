const Post = require('../models/JobPost');
const jwt = require('jsonwebtoken');

exports.getJobPosts = async (req, res) => {
    try {
        //const posts = await Post.find().populate('recruiter_id');
        const posts = await Post.find(); // Without populate

        //console.log("Fetched Job Posts:", posts);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching job posts', error: err.message });
    }
}

exports.postJob = async (req, res) => {
  const { title, description, location, skills, salary } = req.body;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiter_id = decoded.id;
    
    const newPost = new Post({
      title,
      description,
      location,
      skills,
      salary,
      recruiter_id
    });

    await newPost.save();

    res.status(201).json({ message: 'Job Posted Successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Job Posting Failed', error: err.message });
  }
};
