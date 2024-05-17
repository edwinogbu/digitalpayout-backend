const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Function to send email verification confirmation
const sendEmailVerification = async (to, verificationLink) => {
    try {
        // Create a Nodemailer transporter using Gmail SMTP
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.EMAIL_USERNAME, // Your Gmail address
        //         pass: process.env.EMAIL_PASSWORD, // Your Gmail password

        //     },
        // });

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
            from: process.env.EMAIL_USERNAME, // Your Gmail address
            to, // Recipient address
            subject: 'Email Verification Confirmation', // Email subject
            text: `Please click on the following link to verify your email address: ${verificationLink}`, // Plain text body
            html: `<p>Please click <a href="${verificationLink}">here</a> to verify your email address.</p>`, // HTML body
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log('Email verification confirmation sent successfully:', to);
    } catch (error) {
        console.error('Error sending email verification confirmation:', error);
        throw new Error('Failed to send email verification confirmation');
    }
};

module.exports = sendEmailVerification;
