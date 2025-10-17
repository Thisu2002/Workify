const Post = require('../models/JobPost');

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
