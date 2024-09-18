const express = require('express');
const router = express.Router();
const blogPostsController = require('../controllers/blogPostsController');
const multer = require('multer');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
        cb(null, uniqueSuffix + '-' + file.originalname); // Filename format: <timestamp>-<originalname>
    }
});

// File filter to accept only DOC, PDF, TXT, and specified image file formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/pdf', // PDF
        'text/plain', // TXT
        'image/jpeg', // JPG
        'image/png', // PNG
        'image/gif', // GIF
        'image/webp', // WEBP
        'image/tiff', // TIFF
        'image/vnd.adobe.photoshop', // PSD
        'image/x-raw', // RAW
        'image/bmp', // BMP
        'image/heif', // HEIF
        'image/x-indesign', // INDD
        'image/jp2', // JPEG 2000
        'image/svg+xml', // SVG
        'application/postscript', // AI
        'application/eps', // EPS
        'application/octet-stream' // PDF
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only DOC, PDF, TXT, JPG, PNG, GIF, WEBP, TIFF, PSD, RAW, BMP, HEIF, INDD, JPEG 2000, SVG, AI, EPS, and PDF files are allowed'), false);
    }
};

// Multer upload instance for handling file uploads
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware function to handle file uploads
const uploadMiddleware = upload.single('imageUrl');


const handleUploadError = (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
}



// Apply to create and update routes
router.post('/create', uploadMiddleware, handleUploadError, blogPostsController.createBlogPost);
router.put('/update/:id', uploadMiddleware, handleUploadError, blogPostsController.updateBlogPost);


// Delete a blog post
router.delete('/delete/:id', blogPostsController.deleteBlogPost);

// Get all blog posts
router.get('/viewAll/', blogPostsController.getAllBlogPosts);

// Get all blog posts
router.get('/published', blogPostsController.getAllPublishBlogPosts);

// Get a single blog post by ID
router.get('/view/:id', blogPostsController.getBlogPostById);

// Update blog post status
router.patch('/changeStatus/:id', blogPostsController.updateBlogPostStatus);

// Increment blog post views
router.patch('/postViews/:id', blogPostsController.incrementBlogPostViews);

// Get paginated blog posts
router.get('/allBlogs/paginated', blogPostsController.getPaginatedBlogPosts);

module.exports = router;
