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
    },
    // Custom function to remove existing image before saving new one
    async beforeSave(req, file, cb) {
        try {
            // Check if there's an existing image for the skill provider
            if (req.provider && req.provider.imagePath) {
                // Remove existing image
                fs.unlinkSync(req.provider.imagePath);
            }
            // Check if there's an existing image for the customer
            if (req.customer && req.customer.imagePath) {
                // Remove existing image
                fs.unlinkSync(req.customer.imagePath);
            }
            // Continue with saving the new image
            cb(null, true);
        } catch (error) {
            cb(error);
        }
    }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/tiff',
        'image/psd',
        'image/raw',
        'image/bmp',
        'image/heif',
        'image/indd',
        'image/jp2',
        'image/svg+xml'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware function to handle file upload
const uploadMiddleware = upload.single('image'); // Assuming the field name for the image is 'image'

module.exports = uploadMiddleware;


// const multer = require('multer');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
//         cb(null, uniqueSuffix + '-' + file.originalname); // Filename format: <timestamp>-<originalname>
//     }
// });

// // File filter to accept only image files
// const fileFilter = (req, file, cb) => {
//     const allowedMimeTypes = [
//         'image/jpeg',
//         'image/png',
//         'image/gif',
//         'image/webp',
//         'image/tiff',
//         'image/psd',
//         'image/raw',
//         'image/bmp',
//         'image/heif',
//         'image/indd',
//         'image/jp2',
//         'image/svg+xml'
//     ];

//     if (allowedMimeTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed'), false);
//     }
// };

// // Multer upload instance
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// // Middleware function to handle file upload
// const uploadMiddleware = upload.single('image'); // Assuming the field name for the image is 'image'

// module.exports = uploadMiddleware;


// const multer = require('multer');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
//         cb(null, uniqueSuffix + '-' + file.originalname); // Filename format: <timestamp>-<originalname>
//     }
// });

// // File filter to accept only image files
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed'), false);
//     }
// };

// // Multer upload instance
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// // Middleware function to handle file upload
// const uploadMiddleware = upload.single('image'); // Assuming the field name for image is 'image'

// module.exports = uploadMiddleware;

