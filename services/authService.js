const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const sendEmailWithOTP = require('./sendEmail');
const sendEmailVerification = require('./sendEmailVerification');

dotenv.config();

// Create a pool of MySQL connections
const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Helper function to execute SQL queries
function query(sql, args) {
    return new Promise((resolve, reject) => {
        // Get a connection from the pool
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }

            // Execute the query using the acquired connection
            connection.query(sql, args, (err, rows) => {
                // Release the connection back to the pool
                connection.release();

                if (err) {
                    return reject(err);
                }

                resolve(rows);
            });
        });
    });
}

// Create Users table if it doesn't exist
const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        emailVerified BOOLEAN DEFAULT FALSE,
        status VARCHAR(255) NOT NULL DEFAULT 'pending',
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

const createOtpsTableQuery = `
    CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        otp VARCHAR(6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`;

// Function to create Users table
async function createUsersTable() {
    try {
        await query(createUsersTableQuery);
        console.log('Users table created successfully');
    } catch (error) {
        console.error('Error creating Users table:', error);
    }
}

// Execute table creation and alteration queries
(async () => {
    await createUsersTable();
    await query(createOtpsTableQuery);
    console.log('Tables created successfully');
})();

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Function to generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const authenticationService = {};

// Check if email exists
authenticationService.emailExists = async (email) => {
    try {
        const selectQuery = 'SELECT * FROM users WHERE email = ?';
        const result = await query(selectQuery, [email]);

        return result.length > 0;
    } catch (error) {
        throw error;
    }
};

// Create User
authenticationService.createUser = async (userData) => {
    try {
        const { firstName, lastName, email, phone, password, role } = userData;
        const emailAlreadyExists = await authenticationService.emailExists(email);

        if (emailAlreadyExists) throw new Error('Email already exists');
        const hashedPassword = await bcrypt.hash(password, 12);

        const insertQuery = 'INSERT INTO users (firstName, lastName, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await query(insertQuery, [firstName, lastName, email, phone, hashedPassword, role]);

        if (!result.insertId) throw new Error('Failed to register user');
        const token = signToken(result.insertId);

        return { id: result.insertId, token, ...userData };
    } catch (error) {
        throw error;
    }
};

// Read User by ID
authenticationService.getUserById = async (userId) => {
    try {
        const selectQuery = 'SELECT * FROM users WHERE id = ?';
        const user = await query(selectQuery, [userId]);

        if (user.length === 0) {
            throw new Error('User not found');
        }

        return user[0];
    } catch (error) {
        throw error;
    }
};

// Read All Users
authenticationService.getAllUsers = async () => {
    try {
        const selectAllUsersQuery = 'SELECT * FROM users';
        const users = await query(selectAllUsersQuery);

        if (users.length === 0) {
            return { message: 'Users table is empty' };
        }

        return users;
    } catch (error) {
        throw error;
    }
};

// Update User by ID
authenticationService.updateUser = async (userId, updateData) => {
    try {
        const { firstName, lastName, email, phone, role, status } = updateData;

        const updateQuery = `
            UPDATE users 
            SET firstName = ?, lastName = ?, email = ?, phone = ?, role = ?, status = ?, updatedAt = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await query(updateQuery, [firstName, lastName, email, phone, role, status, userId]);

        return { message: 'User updated successfully' };
    } catch (error) {
        throw error;
    }
};

// Delete User by ID
authenticationService.deleteUser = async (userId) => {
    try {
        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        await query(deleteQuery, [userId]);

        return { message: 'User deleted successfully' };
    } catch (error) {
        throw error;
    }
};

// Authenticate user with email/phone and password
authenticationService.authenticateUser = async (loginData) => {
    try {
        if (!loginData || !loginData.emailOrPhone || !loginData.password) {
            throw new Error('Both email/phone and password are required for authentication');
        }

        const emailOrPhone = loginData.emailOrPhone;
        const password = loginData.password;

        const isEmail = emailOrPhone.includes('@');
        const column = isEmail ? 'email' : 'phone';

        const selectQuery = `SELECT * FROM users WHERE ${column} = ?`;
        const user = await query(selectQuery, [emailOrPhone]);

        if (user.length === 0) {
            throw new Error('User not found');
        }

        const hashedPassword = user[0].password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = signToken(user[0].id);

        return { user: user[0], token };
    } catch (error) {
        throw error;
    }
};

module.exports = authenticationService;


// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const sendEmailWithOTP = require('./sendEmail');
// const sendEmailVerification = require('./sendEmailVerification');

// dotenv.config();

// // Create a pool of MySQL connections
// const pool = mysql.createPool({
//     connectionLimit: process.env.CONNECTION_LIMIT,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });



// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         // Get a connection from the pool
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 return reject(err);
//             }

//             // Execute the query using the acquired connection
//             connection.query(sql, args, (err, rows) => {
//                 // Release the connection back to the pool
//                 connection.release();

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(rows);
//             });
//         });
//     });
// }


// // Create Users table if it doesn't exist
// const createUsersTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         firstName VARCHAR(255) NOT NULL,
//         lastName VARCHAR(255) NOT NULL,
//         email VARCHAR(255),
//         phone VARCHAR(255) NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         emailVerified BOOLEAN DEFAULT FALSE,
//         status VARCHAR(255) NOT NULL DEFAULT 'pending',
//         role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
//         userType ENUM('Customer', 'SkillProvider') NOT NULL,
//         defaultEmail VARCHAR(255),
//         pinCode INT,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
// `;

// const createOtpsTableQuery = `
//     CREATE TABLE IF NOT EXISTS otps (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT NOT NULL,
//         otp VARCHAR(6) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id)
//     )
// `;

// // Function to create Users table
// async function createUsersTable() {
//     try {
//         await query(createUsersTableQuery);
//         console.log('Users table created successfully');
//     } catch (error) {
//         console.error('Error creating Users table:', error);
//     }
// }

// // Function to alter Users table
// // async function alterUsersTable() {
// //     try {
// //         const alterTableQuery = `ALTER TABLE users ADD COLUMN defaultEmail VARCHAR(255)`;
// //         await query(alterTableQuery); // Add the defaultEmail column to the users table
// //         console.log('Users table altered successfully');
// //     } catch (error) {
// //         console.error('Error altering Users table:', error);
// //     }
// // }

// // Execute table creation and alteration queries
// (async () => {
//     await createUsersTable();
//     // await alterUsersTable();
//     await query(createOtpsTableQuery);
//     console.log('Tables created successfully');
// })();


// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };


// // Function to generate a random OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const authenticationService = {};


// // Authenticate user with email/phone and password
// authenticationService.authenticateUser = async (loginData) => {
//     try {
//         // Ensure loginData is provided and contains emailOrPhone and password properties
//         if (!loginData || !loginData.emailOrPhone || !loginData.password) {
//             throw new Error('Both email/phone and password are required for authentication');
//         }

//         const emailOrPhone = loginData.emailOrPhone;
//         const password = loginData.password;

//         // Check if the login data is an email or phone number
//         const isEmail = emailOrPhone.includes('@');
//         const column = isEmail ? 'email' : 'phone';

//         // Fetch user data from the database based on email or phone
//         const selectQuery = `SELECT * FROM users WHERE ${column} = ?`;
//         const user = await query(selectQuery, [emailOrPhone]);

//         // If user not found, return error
//         if (user.length === 0) {
//             throw new Error('User not found');
//         }

//         // Verify password
//         const hashedPassword = user[0].password;
//         const isPasswordValid = await bcrypt.compare(password, hashedPassword);

//         // If password is invalid, return error
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user[0].id);

//         // Return user data along with token
//         return { user: user[0], token };
//     } catch (error) {
//         throw error;
//     }
// };




// authenticationService.emailExists = async (email) => {
//     try {
//         // Fetch the default email address from the database
//         const defaultEmailQuery = 'SELECT defaultEmail FROM users LIMIT 1';
//         const defaultEmailResult = await query(defaultEmailQuery);
//         const defaultEmail = defaultEmailResult.length > 0 ? defaultEmailResult[0].defaultEmail : null;

//         if (email === defaultEmail) {
//             // Default email address allowed without restrictions
//             return false; // Assume it doesn't exist since it's the default
//         } else {
//             let selectQuery;
//             let queryParams;
            
//             if (email === null) {
//                 selectQuery = 'SELECT COUNT(*) AS count FROM users WHERE email IS NULL';
//                 queryParams = [];
//             } else {
//                 selectQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
//                 queryParams = [email];
//             }

//             const result = await query(selectQuery, queryParams);
//             const count = result[0].count;
//             return count > 0;
//         }
//     } catch (error) {
//         throw error;
//     }
// };






// // Generate a random 4-digit pin code
// const generatePinCode = () => {
//     return Math.floor(1000 + Math.random() * 9000);
// };



// // Register user
// authenticationService.registerUser = async (userData) => {
//     try {
//         const { firstName, lastName, email, phone, password, role, userType } = userData;
//         const emailAlreadyExists = await authenticationService.emailExists(email);

//         if (emailAlreadyExists) throw new Error('Email already exists');
//         const hashedPassword = await bcrypt.hash(password, 12);
//         const pinCode = generatePinCode();

//         const insertQuery = 'INSERT INTO users (firstName, lastName, email, phone, password, role, userType, pinCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//         const result = await query(insertQuery, [firstName, lastName, email, phone, hashedPassword, role, userType, pinCode]);

//         if (!result.insertId) throw new Error('Failed to register user');
//         const token = signToken(result.insertId);

//         return { id: result.insertId, token, pinCode, ...userData };
//     } catch (error) {
//         throw error;
//     }
// };



// // Register user with email verification
// authenticationService.registerUserWithEmailVerification = async (userData) => {
//     try {
//         const { firstName, lastName, email, phone, password, role, userType } = userData;
//         const emailAlreadyExists = await authenticationService.emailExists(email);

//         if (emailAlreadyExists) throw new Error('Email already exists');
//         const hashedPassword = await bcrypt.hash(password, 12);
//         const pinCode = generatePinCode();

//         const insertQuery = `
//             INSERT INTO users 
//                 (firstName, lastName, email, phone, password, emailVerified, status, role, userType, pinCode) 
//             VALUES 
//                 (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, phone, hashedPassword, false, 'pending', role, userType, pinCode]);

//         if (!result.insertId) throw new Error('Failed to register user');
//         const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN,
//         });

//         const emailVerificationToken = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN,
//         });

//         const verificationLink = `${process.env.APP_BASE_URL}/verify-email?token=${emailVerificationToken}`;
//         await sendEmailVerification(email, verificationLink);

//         return { id: result.insertId, token, pinCode, ...userData };
//     } catch (error) {
//         throw error;
//     }
// };



// authenticationService.handleEmailVerification = async (token) => {
//     try {
//         // Verify the email verification token
//         const decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);

//         // Extract user ID from the decoded token
//         const userId = decodedToken.userId;

//         // Update user's email verification status in the database
//         const updateQuery = 'UPDATE users SET emailVerified = ? WHERE id = ?';
//         await query(updateQuery, [true, userId]);

//         return { message: 'Email verification successful' };
//     } catch (error) {
//         // Handle token verification failure
//         if (error.name === 'TokenExpiredError') {
//             throw new Error('Email verification link has expired');
//         } else if (error.name === 'JsonWebTokenError') {
//             throw new Error('Invalid email verification token');
//         } else {
//             throw new Error('Unknown error occurred during email verification');
//         }
//     }
// };


// // Authenticate user with email/phone and password
// authenticationService.signInAuthentication = async (loginData) => {
//     try {
//         // Ensure loginData is provided and contains emailOrPhone and password properties
//         if (!loginData || !loginData.emailOrPhone || !loginData.password) {
//             throw new Error('Both email/phone and password are required for authentication');
//         }

//         const emailOrPhone = loginData.emailOrPhone;
//         const password = loginData.password;

//         // Check if the login data is an email or phone number
//         const isEmail = emailOrPhone.includes('@');
//         const column = isEmail ? 'email' : 'phone';

//         // Fetch user data from the database based on email or phone
//         const selectQuery = `SELECT * FROM users WHERE ${column} = ?`;
//         const user = await query(selectQuery, [emailOrPhone]);

//         // If user not found, return error
//         if (user.length === 0) {
//             throw new Error('User not found');
//         }

//         // Check if user's status is approved
//         if (user[0].status !== 'approved') {
//             throw new Error('User account is not approved');
//         }

//         // Verify password
//         const hashedPassword = user[0].password;
//         const isPasswordValid = await bcrypt.compare(password, hashedPassword);

//         // If password is invalid, return error
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN,
//         });

//         // Return user data along with token
//         return { user: user[0], token };
//     } catch (error) {
//         throw error;
//     }
// };



// // Request password reset: Generate OTP and send it via email
// authenticationService.requestPasswordReset = async (emailOrPhone) => {
//     try {
//         // Check if the provided email or phone exists in the database
//         const isEmail = emailOrPhone.includes('@');
//         const column = isEmail ? 'email' : 'phone';
//         const selectQuery = `SELECT * FROM users WHERE ${column} = ?`;
//         const user = await query(selectQuery, [emailOrPhone]);

//         // If user not found, return error
//         if (user.length === 0) {
//             throw new Error('User not found');
//         }

//         // Generate OTP
//         const otp = generateOTP();

//         // Store OTP in the database
//         const insertOtpQuery = 'INSERT INTO otps (user_id, otp) VALUES (?, ?)';
//         await query(insertOtpQuery, [user[0].id, otp]);

//         // Send OTP via email
//         await sendEmailWithOTP(user[0].email, otp);

//         // Return the generated OTP and user ID
//         return { userId: user[0].id, otp };
//     } catch (error) {
//         throw error;
//     }
// };

// // Reset password: Validate OTP, update password, and remove OTP from database
// authenticationService.resetPassword = async (resetData) => {
//     try {
//         const { userId, newPassword, otp } = resetData;

//         // Fetch OTP from the database
//         const selectOtpQuery = 'SELECT * FROM otps WHERE user_id = ? AND otp = ? ORDER BY created_at DESC LIMIT 1';
//         const otpRecord = await query(selectOtpQuery, [userId, otp]);

//         // If OTP not found or expired, return error
//         if (otpRecord.length === 0) {
//             throw new Error('Invalid or expired OTP');
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 12);

//         // Update user's password in the database
//         const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
//         await query(updatePasswordQuery, [hashedPassword, userId]);

//         // Delete OTP record from the database
//         const deleteOtpQuery = 'DELETE FROM otps WHERE id = ?';
//         await query(deleteOtpQuery, [otpRecord[0].id]);

//         return { message: 'Password reset successful' };
//     } catch (error) {
//         throw error;
//     }
// };


// // Verify OTP
// authenticationService.verifyOTP = async (userId, otp) => {
//     try {
//         // Fetch OTP from the database
//         const selectOtpQuery = 'SELECT * FROM otps WHERE user_id = ? AND otp = ? ORDER BY created_at DESC LIMIT 1';
//         const otpRecord = await query(selectOtpQuery, [userId, otp]);

//         // If OTP not found or expired, return false
//         if (otpRecord.length === 0) {
//             return { valid: false, message: 'Invalid or expired OTP' };
//         }

//         // Check if OTP is expired (assuming expiration time is stored in the database)
//         const otpExpiration = otpRecord[0].created_at.getTime() + 5 * 60 * 1000; // Assuming 5 minutes expiration time
//         const currentTime = Date.now();

//         if (currentTime > otpExpiration) {
//             // OTP has expired, delete it from the database
//             const deleteOtpQuery = 'DELETE FROM otps WHERE id = ?';
//             await query(deleteOtpQuery, [otpRecord[0].id]);

//             return { valid: false, message: 'OTP has expired' };
//         }

//         // OTP is valid and not expired
//         return { valid: true, message: 'OTP is valid' };
//     } catch (error) {
//         throw error;
//     }
// };

// authenticationService.getAllUsers = async () => {
//     try {
//         const selectAllUsersQuery = 'SELECT * FROM users';
//         const users = await query(selectAllUsersQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "Users table is empty" };
//         }

//         return users;
//     } catch (error) {
//         throw error;
//     }
// };




// authenticationService.getProfile = async (userId) => {
//     try {
//         // Fetch user data from the database based on user ID
//         const selectQuery = 'SELECT id, firstName, lastName, email, phone, emailVerified, status, role, userType, pinCode, createdAt, updatedAt FROM users WHERE id = ?';
//         const user = await query(selectQuery, [userId]);

//         // If user not found, return error
//         if (user.length === 0) {
//             throw new Error('User not found');
//         }

//         // Return user data
//         return user[0];
//     } catch (error) {
//         throw error;
//     }
// };


// module.exports = authenticationService;
