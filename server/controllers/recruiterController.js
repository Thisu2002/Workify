const Post = require('../models/JobPost');
const jwt = require('jsonwebtoken');
const Panel = require('../models/Panel');

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
    interview_rounds
  } = req.body;

  //console.log("Received Job Post Data:", req.body);

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recruiter_id = decoded.id;

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
      interview_rounds, 
    });

    await newPost.save();

    res.status(201).json({ message: "Job Posted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Job Posting Failed", error: err.message });
  }
};

exports.changeJobStatus = async (req, res) => {
  const {jobId, status} = req.body;
  try {
    const post = await Post.findById(jobId);
    if (!post) {
      return res.status(404).json({ message: 'Job post not found' });
    }
    post.status = status;
    await post.save();
    res.status(200).json({ message: 'Job status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating job status', error: err.message });
  }
};

exports.fetchPanels = async (req, res) => {
  try {
    const panels = await Panel.find().select('_id name');
    res.status(200).json(panels);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching panels', error: err.message });
  }
};
