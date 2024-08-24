const mysql = require('mysql');
const dotenv = require('dotenv');

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
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }

            connection.query(sql, args, (err, rows) => {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    });
}

// Create Testimonials table if it doesn't exist
const createTestimonialsTableQuery = `
    CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(20, 2) NOT NULL,
        message TEXT,
        imagePath VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

const testimonialService = {};

// Function to create Testimonials table
async function createTestimonialsTable() {
    try {
        await query(createTestimonialsTableQuery);
        console.log('Testimonials table created successfully');
    } catch (error) {
        console.error('Error creating Testimonials table:', error);
    }
}

// Call the function to create the table
(async () => {
    await createTestimonialsTable();
})();

// Add a new testimonial
testimonialService.createTestimonial = async (testimonialData) => {
    try {
        const { name, amount, message, imagePath } = testimonialData;

        const insertTestimonialQuery = `
            INSERT INTO testimonials (name, amount, message, imagePath)
            VALUES (?, ?, ?, ?)
        `;
        const testimonialResult = await query(insertTestimonialQuery, [name, amount, message, imagePath]);

        if (!testimonialResult.insertId) {
            throw new Error('Failed to insert testimonial');
        }

        return { id: testimonialResult.insertId, ...testimonialData };
    } catch (error) {
        throw error;
    }
};

// Get testimonial by ID
testimonialService.getTestimonialById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM testimonials WHERE id = ?';
        const testimonials = await query(selectQuery, [id]);
        return testimonials[0];
    } catch (error) {
        throw error;
    }
};

// Get all testimonials
testimonialService.getAllTestimonials = async () => {
    try {
        const selectAllQuery = 'SELECT * FROM testimonials';
        const testimonials = await query(selectAllQuery);

        if (testimonials.length === 0) {
            return { message: "Testimonials table is empty" };
        }

        return testimonials;
    } catch (error) {
        throw error;
    }
};

// Update testimonial
testimonialService.updateTestimonial = async (id, testimonialData) => {
    try {
        const { name, amount, message, imagePath } = testimonialData;

        const updateQuery = `
            UPDATE testimonials
            SET name = ?, amount = ?, message = ?, imagePath = ?
            WHERE id = ?
        `;
        await query(updateQuery, [name, amount, message, imagePath, id]);

        return { id, ...testimonialData };
    } catch (error) {
        throw error;
    }
};

// Delete testimonial
testimonialService.deleteTestimonial = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM testimonials WHERE id = ?';
        await query(deleteQuery, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
};

module.exports = testimonialService;


// const mysql = require('mysql');
// const dotenv = require('dotenv');

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
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 return reject(err);
//             }

//             connection.query(sql, args, (err, rows) => {
//                 connection.release();
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve(rows);
//             });
//         });
//     });
// }

// // Create Testimonials table if it doesn't exist
// const createTestimonialsTableQuery = `
//     CREATE TABLE IF NOT EXISTS testimonials (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         amount DECIMAL(20, 2) NOT NULL,
//         comment TEXT,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//     )
// `;

// const testimonialService = {};

// // Function to create Testimonials table
// async function createTestimonialsTable() {
//     try {
//         await query(createTestimonialsTableQuery);
//         console.log('Testimonials table created successfully');
//     } catch (error) {
//         console.error('Error creating Testimonials table:', error);
//     }
// }

// // Call the function to create the table
// (async () => {
//     await createTestimonialsTable();
// })();

// // Add a new testimonial
// testimonialService.createTestimonial = async (testimonialData) => {
//     try {
//         const { name, amount, comment } = testimonialData;

//         const insertTestimonialQuery = `
//             INSERT INTO testimonials (name, amount, comment)
//             VALUES (?, ?, ?)
//         `;
//         const testimonialResult = await query(insertTestimonialQuery, [name, amount, comment]);

//         if (!testimonialResult.insertId) {
//             throw new Error('Failed to insert testimonial');
//         }

//         return { id: testimonialResult.insertId, ...testimonialData };
//     } catch (error) {
//         throw error;
//     }
// };

// // Get testimonial by ID
// testimonialService.getTestimonialById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM testimonials WHERE id = ?';
//         const testimonials = await query(selectQuery, [id]);
//         return testimonials[0];
//     } catch (error) {
//         throw error;
//     }
// };

// // Get all testimonials
// testimonialService.getAllTestimonials = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM testimonials';
//         const testimonials = await query(selectAllQuery);

//         if (testimonials.length === 0) {
//             return { message: "Testimonials table is empty" };
//         }

//         return testimonials;
//     } catch (error) {
//         throw error;
//     }
// };

// // Update testimonial
// testimonialService.updateTestimonial = async (id, testimonialData) => {
//     try {
//         const { name, amount, comment } = testimonialData;

//         const updateQuery = `
//             UPDATE testimonials
//             SET name = ?, amount = ?, comment = ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [name, amount, comment, id]);

//         return { id, ...testimonialData };
//     } catch (error) {
//         throw error;
//     }
// };

// // Delete testimonial
// testimonialService.deleteTestimonial = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM testimonials WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = testimonialService;
