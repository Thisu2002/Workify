const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');
    await seedAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    let user = await User.findOne({ email: 'admin@gmail.com' });

    if (!user) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      user = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        user_roles: ['admin']
      });

      console.log('Admin user created in User table');
    } else {
      console.log('Admin user already exists in User table');
    }

    // Check if any Admin entry exists
    const existingAdmin = await Admin.findOne();

    if (!existingAdmin) {
      await Admin.create({
        _id: user._id, // Use same _id as User
        privileges: ['manage_users', 'view_reports']
      });

      console.log('Admin entry created in Admin table');
    } else {
      console.log('Admin entry already exists in Admin table');
    }

  } catch (error) {
    console.error('Error seeding admin user or admin table:', error);
  }
};

module.exports = connectDB;
