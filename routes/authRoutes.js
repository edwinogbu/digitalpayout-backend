
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cache = require('memory-cache');
const userToken = require('../middlewares/userToken');

// Route to authenticate user general purpose
router.post('/login', authController.authenticateUser);
router.post('/admin/signin', authController.signInAuthentication);

// This is to handle any issue where the users register without email and need a password reset
router.put('/create-defaultEmail/:id', authController.createDefaultEmail);
router.get('/read-defaultEmail', authController.readDefaultEmail);
router.put('/update-defaultEmail/:id', authController.updateDefaultEmail);


// Route to register new user
router.post('/register', authController.registerUser);
router.post('/admin/registration', authController.registerUserWithEmailVerification);

// Route for handling email verification
router.get('/verify-email/:token', authController.handleEmailVerification);



// Route to request password reset
router.post('/forgot-password', authController.requestPasswordReset);

// Route to reset password
router.post('/reset-password', authController.resetPassword);

// Route to get all users
router.get('/users', cacheMiddleware(), authController.getAllUsers);

// Route to verify OTP
router.post('/verify-otp', authController.verifyOTP);

// Use the verifyToken middleware to protect the profile route
router.get('/profile',  authController.getProfile);
// router.get('/profile', userToken, authController.getProfile);

module.exports = router;

// Middleware to handle caching
function cacheMiddleware() {
    return (req, res, next) => {
        const key = req.originalUrl || req.url;
        const cachedData = cache.get(key);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }
        // If not found in cache, proceed to the route handler
        next();
    };
}



