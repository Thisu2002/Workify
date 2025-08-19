// middleware/localUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // To check if directory exists

// Ensure upload directory exists
const uploadDir = 'uploads/avatars';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Directory to save the files
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid overwrites
    // e.g., 1634567890123-my-avatar.png
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const cvDir = 'uploads/cvs';

if (!fs.existsSync(cvDir)) {
    fs.mkdirSync(cvDir, { recursive: true });
}

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvDir); // Save to the 'uploads/cvs' folder
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniquePrefix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

// File filter to accept only common document types
const cvFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: File type not supported. Only PDF, DOC, and DOCX are allowed.');
};

const uploadCv = multer({
  storage: cvStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: cvFileFilter
});

// Init upload
const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = {
  uploadAvatar,
  uploadCv
};