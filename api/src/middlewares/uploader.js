const multer = require('multer');

// Middleware for handling file uploads
exports.upload = multer({ dest: 'uploads/' });