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

// Init upload
const localUpload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = localUpload;