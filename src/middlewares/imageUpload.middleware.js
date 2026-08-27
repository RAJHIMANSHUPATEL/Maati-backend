const multer = require("multer");

/**
 * Middleware to handle errors from Multer file uploads.
 * It checks for specific Multer errors and sends an appropriate response.
 * @param {object} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const ImageUploadValidator = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle specific Multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ success: false, message: 'File too large. Max 2MB allowed.' });
        }
        return res.status(400).json({ success: false, message: 'Error with file upload' });
    }
    if (err) {
        // Handle other errors (e.g., file type validation error)
        return res.status(400).json(err.message || 'Image upload failed');
    }
    next();
}
module.exports = ImageUploadValidator;
