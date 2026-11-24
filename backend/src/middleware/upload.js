const multer = require('multer');

const allowedMimeTypes = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error('Only PDF, PNG, JPEG, and WebP files are allowed');
      error.statusCode = 400;
      return callback(error);
    }
    return callback(null, true);
  }
});

function documentUpload(req, res, next) {
  upload.single('document')(req, res, (error) => {
    if (error) {
      error.statusCode = error.statusCode || 400;
      return next(error);
    }
    if (!req.file) {
      const missingFileError = new Error('A document file is required');
      missingFileError.statusCode = 400;
      return next(missingFileError);
    }
    return next();
  });
}

module.exports = { documentUpload };
