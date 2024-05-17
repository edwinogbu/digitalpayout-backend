const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'DIGITAL PAYOUT',
        description: 'The DIGITAL PAYOUT API, developed by Edwin, equips Page Innovations developers with essential tools for crafting apps: techniques, materials, project ideas, pattern generation, community features, marketplace integration, customization, and analytics.'
    },
    // host: 'https://handiworks.cosmossound.com.ng', // Update the host to match your domain
    host: 'localhost:5000' // Update the host to match your domain
};

const outputFile = './swagger-output.json';
const routes = [
    './routes/authRoutes.js',
   
    // Add more routes as needed
];

swaggerAutogen(outputFile, routes, doc);
