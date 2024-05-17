const authenticationService = require('../services/authService');

// Function to sanitize input to prevent XSS attacks
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    // Replace potentially dangerous characters with HTML entities
    return input.replace(/[&<>"'/]/g, (char) => {
        switch (char) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#x27;'; // &apos; is not recommended, use &#x27; instead
            case '/':
                return '&#x2F;'; // Forward slash is included as it could end an HTML entity
            default:
                return char;
        }
    });
}

async function authenticateUser(req, res) {
    try {
        const { emailOrPhone, password } = req.body;
        const sanitizedEmailOrPhone = sanitizeInput(emailOrPhone);
        const sanitizedPassword = sanitizeInput(password);
        const result = await authenticationService.authenticateUser({ emailOrPhone: sanitizedEmailOrPhone, password: sanitizedPassword });
        res.status(200).json({ success: true, user: result.user, token: result.token });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
}




async function registerUser(req, res) {
    try {
        const userData = req.body;
        const sanitizedUserData = {};
        for (const key in userData) {
            sanitizedUserData[key] = sanitizeInput(userData[key]);
        }
        const result = await authenticationService.registerUser(sanitizedUserData);
        res.status(201).json({ success: true, user: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}



const registerUserWithEmailVerification = async (req, res) => {
    try {
        const userData = req.body; // Assuming user data is sent in the request body
        const newUser = await authenticationService.registerUserWithEmailVerification(userData);
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for verification.',
            user: newUser
        });
    } catch (error) {
        // Error handling
        console.error('Registration failed:', error.message);
        let errorMessage = 'Failed to register user. Please try again later.';
        if (error.message === 'Email already exists') {
            errorMessage = 'Registration failed: Email already exists';
        } else if (error.message === 'Failed to send email verification') {
            errorMessage = 'Registration failed: Email verification could not be sent';
        } else if (error.message === 'Registration failed: Database error occurred') {
            errorMessage = 'Failed to register user due to database error. Please try again later.';
        }
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
};


const handleEmailVerification = async (req, res) => {
    try {
        const token = req.params.token;

        // Handle email verification using authentication service
        const result = await authenticationService.handleEmailVerification(token);

        // Email verification successful
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        // Handle errors during email verification
        res.status(400).json({ success: false, message: error.message });
    }
};


// Sign in user with email/phone and password
// Sign in user with email/phone and password
const signInAuthentication = async (req, res) => {
    try {
        // Extract email/phone and password from request body
        const { emailOrPhone, password } = req.body;

        // Authenticate user
        const { user, token } = await authenticationService.signInAuthentication({ emailOrPhone, password });

        // If authentication is successful, send user data and token in response
        res.status(200).json({ success: true, message: 'Sign in successful', user, token });
    } catch (error) {
        let message = 'Authentication failed';
        if (error.message === 'User not found') {
            message = 'User not found';
        } else if (error.message === 'Invalid password') {
            message = 'Invalid password';
        } else if (error.message === 'User account is not approved') {
            message = 'User account is not approved';
        }

        // If authentication fails, send error message in response
        res.status(401).json({ success: false, message });
    }
};

async function requestPasswordReset(req, res) {
    try {
        const { emailOrPhone } = req.body;
        const sanitizedEmailOrPhone = sanitizeInput(emailOrPhone);
        const result = await authenticationService.requestPasswordReset(sanitizedEmailOrPhone);
        res.status(200).json({ success: true, userId: result.userId, message: 'OTP sent to email' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function resetPassword(req, res) {
    try {
        const resetData = req.body;
        const sanitizedResetData = {};
        for (const key in resetData) {
            sanitizedResetData[key] = sanitizeInput(resetData[key]);
        }
        await authenticationService.resetPassword(sanitizedResetData);
        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function verifyOTP(req, res) {
    try {
        const { userId, otp } = req.body;
        const sanitizedUserId = sanitizeInput(userId);
        const sanitizedOtp = sanitizeInput(otp);
        const otpVerificationResult = await authenticationService.verifyOTP(sanitizedUserId, sanitizedOtp);
        if (otpVerificationResult.valid) {
            res.status(200).json({ success: true, message: otpVerificationResult.message });
        } else {
            res.status(400).json({ success: false, error: otpVerificationResult.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await authenticationService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Create Default Email
async function createDefaultEmail(req, res, next){
    try {
        const { defaultEmail, userId } = req.body;
        await authenticationService.updateDefaultEmail({defaultEmail, userId}); // Update the default email parameter in the users table
        res.status(201).json({ message: 'Default email created successfully' });
    } catch (error) {
        next(error);
    }
};

// Read Default Email
async function readDefaultEmail(req, res, next){
    try {
        const defaultEmail = await authenticationService.readDefaultEmail(); // Read the default email parameter from the users table
        res.status(200).json({ defaultEmail });
    } catch (error) {
        next(error);
    }
};

// Update Default Email
async function updateDefaultEmail(req, res, next){
    try {
        const { defaultEmail, userId } = req.body;
        await authenticationService.updateDefaultEmail({defaultEmail, userId}); // Update the default email parameter in the users table
        res.status(200).json({ message: 'Default email updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Controller to handle fetching the user profile
async function getProfile  (req, res){
    try {
        // Extract user ID from the request object (assuming it is set by middleware)
        const userId = req.user.id;

        // Fetch the user profile using the authentication service
        const userProfile = await authenticationService.getProfile(userId);

        // Respond with the user profile data
        res.status(200).json(userProfile);
    } catch (error) {
        // Handle errors (e.g., user not found)
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    authenticateUser,
    registerUser,
    requestPasswordReset,
    resetPassword,
    verifyOTP,
    getAllUsers,
    createDefaultEmail,
    readDefaultEmail,
    updateDefaultEmail,
    registerUserWithEmailVerification,
    signInAuthentication,
    handleEmailVerification,
    getProfile
};


