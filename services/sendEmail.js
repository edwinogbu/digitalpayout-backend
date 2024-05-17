const nodemailer = require('nodemailer');

// Function to generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP as a string
};

// Function to send email with OTP
const sendEmailWithOTP = async (to) => {
    try {
        // Generate OTP
        const otp = generateOTP();

        // Set expiration time for OTP (in milliseconds)
        const otpExpiration = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Create a Nodemailer transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'anointedboy4real80@gmail.com', // Your Gmail address
                pass: 'vxzc nfiu bwba gapo', // Your Gmail password
            },
        });

        // Email message configuration
        const mailOptions = {
            from: 'anointedboy4real80@gmail.com', // Your Gmail address
            to, // Recipient address
            subject: 'OTP for Verification', // Email subject
            text: `Your OTP for verification is: ${otp}`, // Plain text body
            html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`, // HTML body
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log('Email sent successfully with OTP:', otp);
        
        // Return the generated OTP and its expiration time for further processing if needed
        return { otp, expiration: otpExpiration };
    } catch (error) {
        console.error('Error sending email with OTP:', error);
        throw new Error('Failed to send email with OTP');
    }
};

module.exports = sendEmailWithOTP;


// const nodemailer = require('nodemailer');

// // Function to generate random OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
// };

// // Function to send email with OTP
// const sendEmailWithOTP = async (to) => {
//     try {
//         // Generate OTP
//         const otp = generateOTP();

//         // Create a Nodemailer transporter using Gmail service
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'anointedboy4real80@gmail.com', // Your Gmail address
//                 pass: 'vxzc nfiu bwba gapo', // Your Gmail password
//             },
//         });

//         // Email message configuration
//         const mailOptions = {
//             from: 'anointedboy4real80@gmail.com', // Your Gmail address
//             to, // Recipient address
//             subject: 'OTP for Verification', // Email subject
//             text: `Your OTP for verification is: ${otp}`, // Plain text body
//             html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`, // HTML body
//         };

//         // Send email
//         await transporter.sendMail(mailOptions);

//         console.log('Email sent successfully with OTP:', otp);
        
//         // Return the generated OTP for further processing if needed
//         return otp;
//     } catch (error) {
//         console.error('Error sending email with OTP:', error);
//         throw new Error('Failed to send email with OTP');
//     }
// };

// module.exports = sendEmailWithOTP;


// const nodemailer = require('nodemailer');

// // Function to generate random OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
// };

// // Function to send email with OTP
// const sendEmailWithOTP = async (to) => {
//     try {
//         // Generate OTP
//         const otp = generateOTP();

//         // Create a Nodemailer transporter using SMTP settings
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.cosmossound.com.ng', // SMTP server hostname
//             port: 465, // SMTP port (default: 587 for TLS)
//             // port: 587, // SMTP port (default: 587 for TLS)
//             secure: false, // Set to true if using SSL/TLS
//             auth: {
//                 user: 'info@handiwork.cosmossound.com.ng', // Sender email address
//                 pass: 'Passwords1@##', // Sender email password
//             },
//         });

//         // Email message configuration
//         const mailOptions = {
//             from: 'info@handiwork.cosmossound.com.ng', // Sender address
//             to, // Recipient address
//             subject: 'OTP for Verification', // Email subject
//             text: `Your OTP for verification is: ${otp}`, // Plain text body
//             html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`, // HTML body
//         };

//         // Send email
//         await transporter.sendMail(mailOptions);

//         console.log('Email sent successfully with OTP:', otp);
        
//         // Return the generated OTP for further processing if needed
//         return otp;
//     } catch (error) {
//         console.error('Error sending email with OTP:', error);
//         throw new Error('Failed to send email with OTP');
//     }
// };

// module.exports = sendEmailWithOTP;


// const nodemailer = require('nodemailer');

// // Function to generate random OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
// };

// // Function to send email with OTP
// const sendEmailWithOTP = async (email) => {
//     try {
//         // Generate OTP
//         const otp = generateOTP();

//         // Create a Nodemailer transporter using SMTP settings
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.example.com', // SMTP server hostname
//             port: 587, // SMTP port (default: 587 for TLS)
//             secure: false, // Set to true if using SSL/TLS
//             auth: {
//                 user: 'your_email@exampl.com', // SMTP username
//                 pass: 'your_password', // SMTP password
//             },
//         });

//         // Email message configuration
//         const mailOptions = {
//             from: 'your_email@example.com', // Sender address
//             to: email, // Recipient address
//             subject: 'OTP for Verification', // Email subject
//             text: `Your OTP for verification is: ${otp}`, // Plain text body
//             html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`, // HTML body
//         };

//         // Send email
//         await transporter.sendMail(mailOptions);

//         console.log('Email sent successfully with OTP:', otp);
        
//         // Return the generated OTP for further processing if needed
//         return otp;
//     } catch (error) {
//         console.error('Error sending email with OTP:', error);
//         throw new Error('Failed to send email with OTP');
//     }
// };

// module.exports = sendEmailWithOTP;


// const expressAsyncHandler = require("express-async-handler");
// const dotenv = require("dotenv");
// const nodemailer = require("nodemailer");
// const generateOTP = require("./generateOTP");
// dotenv.config();

// let transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_MAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// const sendEmail = expressAsyncHandler(async (req, res) => {
//   const { email } = req.body;
//   console.log(email);

//   const otp = generateOTP();

//   var mailOptions = {
//     from: process.env.SMTP_MAIL,
//     to: email,
//     subject: "OTP form Callback Coding",
//     text: `Your OTP is: ${otp}`,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent successfully!");
//     }
//   });
// });

// module.exports = { sendEmail };