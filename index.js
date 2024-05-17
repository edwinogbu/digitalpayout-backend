const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import the 'path' module

const authRoutes = require('./routes/authRoutes');

// const conversationRoutes = require('./routes/conversationRoutes');

const mysql = require('mysql');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register Swagger UI for each route
app.use('/api-docs/auth', swaggerUi.serve, swaggerUi.setup(authRoutes.swaggerDocument));

// app.use('/api-docs/chat', swaggerUi.serve, swaggerUi.setup(conversationRoutes.swaggerDocument));
// app.use('/api-docs/chatting', swaggerUi.serve, swaggerUi.setup(chattingRoutes.swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);

// app.use('/api/chat', conversationRoutes);
// app.use('/api/chatting', chattingRoutes);


app.use('/api-docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Start server
// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the API server');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
