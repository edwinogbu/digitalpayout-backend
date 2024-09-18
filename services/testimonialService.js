

const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT || 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Helper function to execute SQL queries
function query(sql, args = []) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);

            connection.query(sql, args, (err, rows) => {
                connection.release();
                if (err) return reject(err);

                resolve(rows);
            });
        });
    });
}

// SQL query to create the testimonials table with status column
const createTestimonialsTableQuery = `
    CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(20, 2) NOT NULL,
        message TEXT,
        imagePath VARCHAR(255),
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

// Function to create the testimonials table
async function createTestimonialsTable() {
    try {
        await query(createTestimonialsTableQuery);
        console.log('Testimonials table created successfully.');
    } catch (error) {
        console.error('Error creating testimonials table:', error);
    }
}

// Execute table creation
(async () => {
    await createTestimonialsTable();
})();


// Testimonial service object
const testimonialService = {};

// Create a testimonial
testimonialService.createTestimonial = async (testimonialData) => {
    try {
        const { name, amount, message, imagePath } = testimonialData;

        // Insert data into testimonials table
        const insertQuery = `
            INSERT INTO testimonials (name, amount, message, imagePath)
            VALUES (?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [name, amount, message, imagePath]);

        if (!result.insertId) {
            throw new Error('Failed to insert testimonial into DB');
        }

        return { id: result.insertId, ...testimonialData };
    } catch (error) {
        throw error;
    }
};

// Retrieve all testimonials
testimonialService.getAllTestimonials = async () => {
    try {
        const selectQuery = 'SELECT * FROM testimonials';
        const testimonials = await query(selectQuery);
        return testimonials;
    } catch (error) {
        throw error;
    }
};

// Retrieve a testimonial by ID
testimonialService.getTestimonialById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM testimonials WHERE id = ?';
        const testimonials = await query(selectQuery, [id]);

        if (testimonials.length === 0) {
            throw new Error('Testimonial not found');
        }

        return testimonials[0];
    } catch (error) {
        throw error;
    }
};

// Retrieve all published testimonials
testimonialService.getPublishedTestimonials = async () => {
    try {
        const selectQuery = 'SELECT * FROM testimonials WHERE status = ?';
        const testimonials = await query(selectQuery, ['published']);
        return testimonials;
    } catch (error) {
        throw error;
    }
};

// Update a testimonial by ID
testimonialService.updateTestimonial = async (id, updateData) => {
    try {
        const { name, amount, message, imagePath, status } = updateData;

        // Construct the SET clause dynamically
        const updateFields = [];
        const queryValues = [];
        
        if (name) {
            updateFields.push('name = ?');
            queryValues.push(name);
        }
        if (amount) {
            updateFields.push('amount = ?');
            queryValues.push(amount);
        }
        if (message) {
            updateFields.push('message = ?');
            queryValues.push(message);
        }
        if (imagePath) {
            updateFields.push('imagePath = ?');
            queryValues.push(imagePath);
        }
        if (status) {
            updateFields.push('status = ?');
            queryValues.push(status);
        }

        if (updateFields.length === 0) {
            throw new Error('No update data provided');
        }

        queryValues.push(id);

        const updateQuery = `UPDATE testimonials SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await query(updateQuery, queryValues);

        if (result.affectedRows === 0) {
            throw new Error('Failed to update testimonial or testimonial not found');
        }

        return { id, ...updateData };
    } catch (error) {
        throw error;
    }
};

// Change the status of a testimonial
testimonialService.changeTestimonialStatus = async (id, status) => {
    try {
        const validStatuses = ['draft', 'published', 'archived'];
        
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status value');
        }

        const updateQuery = 'UPDATE testimonials SET status = ? WHERE id = ?';
        const result = await query(updateQuery, [status, id]);

        if (result.affectedRows === 0) {
            throw new Error('Failed to update testimonial status or testimonial not found');
        }

        return { id, status };
    } catch (error) {
        throw error;
    }
};

// Delete a testimonial by ID
testimonialService.deleteTestimonial = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM testimonials WHERE id = ?';
        const result = await query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            throw new Error('Failed to delete testimonial or testimonial not found');
        }

        return { id };
    } catch (error) {
        throw error;
    }
};

// Retrieve paginated testimonials
testimonialService.getPaginatedTestimonials = async (page = 1, limit = 10) => {
    try {
        // Calculate the offset
        const offset = (page - 1) * limit;

        // Query to get paginated testimonials
        const paginatedTestimonialsQuery = `
            SELECT * FROM testimonials
            ORDER BY createdAt DESC
            LIMIT ? OFFSET ?
        `;

        const testimonials = await query(paginatedTestimonialsQuery, [limit, offset]);

        // Count total number of testimonials for pagination metadata
        const countQuery = 'SELECT COUNT(*) AS total FROM testimonials';
        const countResult = await query(countQuery);
        const total = countResult[0].total;

        return { testimonials, total, page, limit };
    } catch (error) {
        throw error;
    }
};


module.exports = testimonialService;









// const mysql = require('mysql');
// const dotenv = require('dotenv');

// dotenv.config();

// // Create a connection pool
// const pool = mysql.createPool({
//     connectionLimit: process.env.CONNECTION_LIMIT || 10,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args = []) {
//     return new Promise((resolve, reject) => {
//         pool.getConnection((err, connection) => {
//             if (err) return reject(err);

//             connection.query(sql, args, (err, rows) => {
//                 connection.release();
//                 if (err) return reject(err);

//                 resolve(rows);
//             });
//         });
//     });
// }

// // SQL query to create the testimonials table with status column
// const createTestimonialsTableQuery = `
//     CREATE TABLE IF NOT EXISTS testimonials (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         amount DECIMAL(20, 2) NOT NULL,
//         message TEXT,
//         imagePath VARCHAR(255),
//         status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//     )
// `;

// // Function to create the testimonials table
// async function createTestimonialsTable() {
//     try {
//         await query(createTestimonialsTableQuery);
//         console.log('Testimonials table created successfully.');
//     } catch (error) {
//         console.error('Error creating testimonials table:', error);
//     }
// }

// // Execute table creation
// (async () => {
//     await createTestimonialsTable();
// })();

// // Testimonial service object
// const testimonialService = {};

// // Create a testimonial


// testimonialService.createTestimonial = async (testimonialData) => {
//     try {
//         const { name, amount, message, imagePath } = testimonialData;


//         // Insert data into skill_providers table
//         const insertProviderQuery = `
//             INSERT INTO testimonials (name, amount, message, imagePath)
//             VALUES (?, ?, ?, ?)
//         `;
//         const testimonialResult = await query(insertProviderQuery, [name, amount, message, imagePath]);

//         // Retrieve the providerId
//         //
//         // Check if user insertion was successful
//         if (!testimonialResult.insertId) {
//             throw new Error('Failed to insert to DB');
//         }

    
//         // Return the newly created user data along with the token
//         return { id: testimonialResult.insertId,  ...testimonialData};
        
//     } catch (error) {
//         throw error;
//     }
// };



// // Update an existing testimonial
// testimonialService.updateTestimonial = async (id, updates) => {
//     try {
//         const { name, amount, message, imagePath } = updates;
//         const updateQuery = `
//             UPDATE testimonials
//             SET name = ?, amount = ?, message = ?, imagePath = ?
//             WHERE id = ?
//         `;
//         const result = await query(updateQuery, [name, amount, message, imagePath, id]);

//         if (result.affectedRows === 0) {
//             return { success: false, message: 'Testimonial not found or no changes made.' };
//         }

//         return { success: true, message: 'Testimonial updated successfully.' };
//     } catch (error) {
//         console.error('Error updating testimonial:', error.message);
//         throw new Error('Unable to update testimonial at this time.');
//     }
// };

// // Delete a testimonial
// testimonialService.deleteTestimonial = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM testimonials WHERE id = ?';
//         const result = await query(deleteQuery, [id]);

//         if (result.affectedRows === 0) {
//             return { success: false, message: 'Testimonial not found.' };
//         }

//         return { success: true, message: 'Testimonial deleted successfully.' };
//     } catch (error) {
//         console.error('Error deleting testimonial:', error.message);
//         throw new Error('Unable to delete testimonial at this time.');
//     }
// };

// // Retrieve all testimonials
// testimonialService.getAllTestimonials = async () => {
//     try {
//         const selectQuery = 'SELECT * FROM testimonials';
//         const testimonials = await query(selectQuery);

//         return {
//             success: true,
//             message: testimonials.length > 0 ? 'Testimonials retrieved successfully.' : 'No testimonials found.',
//             data: testimonials,
//         };
//     } catch (error) {
//         console.error('Error retrieving testimonials:', error.message);
//         throw new Error('Unable to retrieve testimonials at this time.');
//     }
// };

// // Retrieve a single testimonial by ID
// testimonialService.getTestimonialById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM testimonials WHERE id = ?';
//         const testimonial = await query(selectQuery, [id]);

//         if (testimonial.length === 0) {
//             return { success: false, message: 'Testimonial not found.' };
//         }

//         return {
//             success: true,
//             message: 'Testimonial retrieved successfully.',
//             data: testimonial[0],
//         };
//     } catch (error) {
//         console.error('Error retrieving testimonial:', error.message);
//         throw new Error('Unable to retrieve testimonial at this time.');
//     }
// };

// // Retrieve all published testimonials
// testimonialService.getPublishedTestimonials = async () => {
//     try {
//         const selectQuery = 'SELECT * FROM testimonials WHERE status = "published"';
//         const testimonials = await query(selectQuery);

//         return {
//             success: true,
//             message: testimonials.length > 0 ? 'Published testimonials retrieved successfully.' : 'No published testimonials found.',
//             data: testimonials,
//         };
//     } catch (error) {
//         console.error('Error retrieving published testimonials:', error.message);
//         throw new Error('Unable to retrieve published testimonials at this time.');
//     }
// };

// // Change the status of a testimonial
// testimonialService.changeTestimonialStatus = async (id, status) => {
//     try {
//         const validStatuses = ['draft', 'published', 'archived'];
//         if (!validStatuses.includes(status)) {
//             return { success: false, message: 'Invalid status provided.' };
//         }

//         const updateQuery = 'UPDATE testimonials SET status = ? WHERE id = ?';
//         const result = await query(updateQuery, [status, id]);

//         if (result.affectedRows === 0) {
//             return { success: false, message: 'Testimonial not found or status unchanged.' };
//         }

//         return { success: true, message: `Testimonial status updated to ${status}.` };
//     } catch (error) {
//         console.error('Error changing testimonial status:', error.message);
//         throw new Error('Unable to change testimonial status at this time.');
//     }
// };

// // Retrieve testimonials with pagination
// testimonialService.getPaginatedTestimonials = async (limit = 10, offset = 0) => {
//     try {
//         const selectQuery = 'SELECT * FROM testimonials LIMIT ? OFFSET ?';
//         const testimonials = await query(selectQuery, [limit, offset]);

//         return {
//             success: true,
//             message: testimonials.length > 0 ? 'Paginated testimonials retrieved successfully.' : 'No testimonials found.',
//             data: testimonials,
//         };
//     } catch (error) {
//         console.error('Error retrieving paginated testimonials:', error.message);
//         throw new Error('Unable to retrieve paginated testimonials at this time.');
//     }
// };

// // Export the service object
// module.exports = testimonialService;


