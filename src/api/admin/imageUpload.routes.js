const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const ImageUploadValidator = require("../../middlewares/imageUpload.middleware");
const checkAdmin = require("../../middlewares/adminAuth.middleware");
const cloudinary = require("../../config/cloudinary");

const router = express.Router();
// Directory to store uploaded images
// const imageDir = path.join(__dirname, '../../uploads');

const allowedFolders = ["product", "store", "user", "category", "sub_category", "banner"];
const maxFileSize = 2 * 1024 * 1024; // 2MB
const allowedExt = /jpeg|jpg|png|webp|gif/;
const allowedMime = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

// Multer file filter function to limit file types
// const fileFilter = (req, file, cb) => {
//     const extName = allowedExt.test(path.extname(file.originalname).toLowerCase());
//     const mimeType = allowedMime.includes(file.mimetype);

//     if (extName && mimeType) {
//         cb(null, true);
//     } else {
//         return cb(new Error("Only JPEG, JPG, PNG, WEBP, and GIF files are allowed"));
//     }
// };

const fileFilter = (req, file, cb) => {
    if (allowedMime.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, JPG, PNG, WEBP, and GIF files are allowed"));
    }
};

// Set up storage engine for multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const folderType = req.params.folder;

//         if (!allowedFolders.includes(folderType)) {
//             return cb(new Error("Invalid folder type"));
//         }
//         const uploadPath = path.join(imageDir, folderType);
//         fs.mkdirSync(uploadPath, { recursive: true });
//         cb(null, uploadPath); // Define the folder to store files
//     },
//     filename: function (req, file, cb) {
//         // Sanitize the filename to avoid directory traversal or dangerous characters
//         const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
//         cb(null, uniqueName);
//     }
// });

// Initialize multer with file filter and size limit
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter, // Apply file type filter
    limits: { fileSize: maxFileSize }, // Limit file size to 2MB
});

// Handle image upload POST request
router.post('/:folder', checkAdmin, upload.single('image'), ImageUploadValidator, async (req, res) => {
    const folder = req.params.folder;

    if (!allowedFolders.includes(folder)) {
        return res.status(400).json({ error: "Invalid folder type" });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
    }

    try {
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        public_id: uuidv4(),
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                Readable.from(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);

        return res.json({
            message: "Image uploaded to Cloudinary successfully",
            imageUrl: result.secure_url,
            public_id: result.public_id
        });
    } catch (err) {
        console.error("Upload Error:", err);
        return res.status(500).json({ error: "Image upload failed" });
    }

    // res.json({ filename: req.file.filename });
});

module.exports = router;
