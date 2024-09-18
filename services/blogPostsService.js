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

// SQL query to create the blog_posts table
const createBlogPostsTableQuery = `CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    imageUrl VARCHAR(255),  -- New field for image URL
    views INT DEFAULT 0,    -- New field for view counter
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

// Function to create the blog_posts table
async function createBlogPostsTable() {
    try {
        await query(createBlogPostsTableQuery);
        console.log('Blog posts table created successfully');
    } catch (error) {
        console.error('Error creating blog posts table:', error);
    }
}

// Execute table creation query
(async () => {
    await createBlogPostsTable();
    console.log('Blog posts table setup complete');
})();

// Blog posts service object
const blogPostsService = {};


blogPostsService.createBlogPost = async (title, content, author, status, imageUrl, views) => {
    try {
        const insertQuery = `
            INSERT INTO blog_posts (title, content, author, status, imageUrl, views)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [title, content, author, status, imageUrl, views];
        
        const result = await query(insertQuery, values);

        
        // Return the result with the new blog post ID
        return {
            success: true,
            message: 'Blog post created successfully.',
            data: { id: result.insertId, title, content, author, status, imageUrl, views }
        };
    } catch (error) {
        console.error('Error in createBlogPost service:', error);
        throw new Error('Unable to create blog post at this time.');
    }
};

// Update an existing blog post
blogPostsService.updateBlogPost = async (id, updates) => {
    try {
        const { title, content, author, status, imageUrl, views } = updates;
        const updateQuery = `
            UPDATE blog_posts
            SET title = ?, content = ?, author = ?, status = ?, imageUrl = ?, views = ?
            WHERE id = ?
        `;
        const result = await query(updateQuery, [title, content, author, status, imageUrl, views, id]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'Blog post not found or no changes made.' };
        }

        return { success: true, message: 'Blog post updated successfully.' };
    } catch (error) {
        console.error('Error updating blog post:', error.message);
        throw new Error('Unable to update blog post at this time. Please try again later.');
    }
};

// Delete a blog post
blogPostsService.deleteBlogPost = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM blog_posts WHERE id = ?';
        const result = await query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'Blog post not found.' };
        }

        return { success: true, message: 'Blog post deleted successfully.' };
    } catch (error) {
        console.error('Error deleting blog post:', error.message);
        throw new Error('Unable to delete blog post at this time. Please try again later.');
    }
};

// Retrieve all blog posts
blogPostsService.getAllBlogPosts = async () => {
    try {
        const selectQuery = 'SELECT * FROM blog_posts';
        const blogPosts = await query(selectQuery);

        return {
            success: true,
            message: blogPosts.length > 0 ? 'Blog posts retrieved successfully.' : 'No blog posts found.',
            data: blogPosts,
        };
    } catch (error) {
        console.error('Error retrieving blog posts:', error.message);
        throw new Error('Unable to retrieve blog posts at this time. Please try again later.');
    }
};

// Retrieve all blog posts
blogPostsService.getAllPublishBlogPosts = async () => {
    try {
        const selectQuery = "SELECT * FROM blog_posts WHERE status ='published'";
        const blogPosts = await query(selectQuery);

        return {
            success: true,
            message: blogPosts.length > 0 ? 'Blog posts retrieved successfully.' : 'No blog posts found.',
            data: blogPosts,
        };
    } catch (error) {
        console.error('Error retrieving blog posts:', error.message);
        throw new Error('Unable to retrieve blog posts at this time. Please try again later.');
    }
};

// Retrieve a single blog post by ID
blogPostsService.getBlogPostById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM blog_posts WHERE id = ?';
        const blogPost = await query(selectQuery, [id]);

        if (blogPost.length === 0) {
            return { success: false, message: 'Blog post not found.' };
        }

        return {
            success: true,
            message: 'Blog post retrieved successfully.',
            data: blogPost[0],
        };
    } catch (error) {
        console.error('Error retrieving blog post:', error.message);
        throw new Error('Unable to retrieve blog post at this time. Please try again later.');
    }
};

// Change the status of a blog post
blogPostsService.updateBlogPostStatus = async (id, status) => {
    try {
        const validStatuses = ['draft', 'published', 'archived'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status. Valid statuses are draft, published, or archived.');
        }

        const updateQuery = 'UPDATE blog_posts SET status = ? WHERE id = ?';
        const result = await query(updateQuery, [status, id]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'Blog post not found or no changes made.' };
        }

        return { success: true, message: `Blog post status updated to '${status}'.` };
    } catch (error) {
        console.error('Error updating blog post status:', error.message);
        throw new Error('Unable to update blog post status at this time. Please try again later.');
    }
};

// Increment the view counter for a blog post
blogPostsService.incrementBlogPostViews = async (id) => {
    try {
        const updateQuery = 'UPDATE blog_posts SET views = views + 1 WHERE id = ?';
        const result = await query(updateQuery, [id]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'Blog post not found or no changes made.' };
        }

        return { success: true, message: 'Blog post views incremented successfully.' };
    } catch (error) {
        console.error('Error incrementing blog post views:', error.message);
        throw new Error('Unable to increment blog post views at this time. Please try again later.');
    }
};

// Retrieve blog posts with pagination
blogPostsService.getPaginatedBlogPosts = async (limit = 10, offset = 0) => {
    try {
        const selectQuery = 'SELECT * FROM blog_posts LIMIT ? OFFSET ?';
        const blogPosts = await query(selectQuery, [limit, offset]);

        return {
            success: true,
            message: blogPosts.length > 0 ? 'Paginated blog posts retrieved successfully.' : 'No blog posts found.',
            data: blogPosts,
        };
    } catch (error) {
        console.error('Error retrieving paginated blog posts:', error.message);
        throw new Error('Unable to retrieve paginated blog posts at this time. Please try again later.');
    }
};

// Export the service object
module.exports = blogPostsService;


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

// // SQL query to create the blog_posts table
// const createBlogPostsTableQuery = `CREATE TABLE IF NOT EXISTS blog_posts (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     content TEXT NOT NULL,
//     author VARCHAR(255) NOT NULL,
//     status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
//     imageUrl VARCHAR(255),  -- New field for image URL
//     views INT DEFAULT 0,    -- New field for view counter
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// )`;

// // Function to create the blog_posts table
// async function createBlogPostsTable() {
//     try {
//         await query(createBlogPostsTableQuery);
//         console.log('Blog posts table created successfully');
//     } catch (error) {
//         console.error('Error creating blog posts table:', error);
//     }
// }

// // Execute table creation query
// (async () => {
//     await createBlogPostsTable();
//     console.log('Blog posts table setup complete');
// })();

// // Blog posts service object
// const blogPostsService = {};

// // Create a new blog post
// blogPostsService.createBlogPost = async (blogPost) => {
//     try {
//         const { title, content, author, status = 'draft', imageUrl = null, views = 0 } = blogPost;
//         const insertQuery = `
//             INSERT INTO blog_posts (title, content, author, status, imageUrl, views)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [title, content, author, status, imageUrl, views]);

//         return {
//             success: true,
//             message: 'Blog post created successfully.',
//             data: { id: result.insertId, ...blogPost },
//         };
//     } catch (error) {
//         console.error('Error creating blog post:', error.message);
//         throw new Error('Unable to create blog post at this time. Please try again later.');
//     }
// };

// // Update an existing blog post
// blogPostsService.updateBlogPost = async (id, updates) => {
//     try {
//         const { title, content, author, status, imageUrl, views } = updates;
//         const updateQuery = `
//             UPDATE blog_posts
//             SET title = ?, content = ?, author = ?, status = ?, imageUrl = ?, views = ?
//             WHERE id = ?
//         `;
//         const result = await query(updateQuery, [title, content, author, status, imageUrl, views, id]);

//         if (result.affectedRows === 0) {
//             return { success: false, message: 'Blog post not found or no changes made.' };
//         }

//         return { success: true, message: 'Blog post updated successfully.' };
//     } catch (error) {
//         console.error('Error updating blog post:', error.message);
//         throw new Error('Unable to update blog post at this time. Please try again later.');
//     }
// };

// // Delete a blog post
// blogPostsService.deleteBlogPost = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM blog_posts WHERE id = ?';
//         const result = await query(deleteQuery, [id]);

//         if (result.affectedRows === 0) {
//             return { success: false, message: 'Blog post not found.' };
//         }

//         return { success: true, message: 'Blog post deleted successfully.' };
//     } catch (error) {
//         console.error('Error deleting blog post:', error.message);
//         throw new Error('Unable to delete blog post at this time. Please try again later.');
//     }
// };

// // Retrieve all blog posts
// blogPostsService.getAllBlogPosts = async () => {
//     try {
//         const selectQuery = 'SELECT * FROM blog_posts';
//         const blogPosts = await query(selectQuery);

//         return {
//             success: true,
//             message: blogPosts.length > 0 ? 'Blog posts retrieved successfully.' : 'No blog posts found.',
//             data: blogPosts,
//         };
//     } catch (error) {
//         console.error('Error retrieving blog posts:', error.message);
//         throw new Error('Unable to retrieve blog posts at this time. Please try again later.');
//     }
// };

// // Retrieve a single blog post by ID
// blogPostsService.getBlogPostById = async (id) => {
//    try {
//     const selectQuery = 'SELECT * FROM blog_posts WHERE id = ?';
//     const blogPost = await query(selectQuery, [id]);

//     if (blogPost.length === 0) {
//         return { success: false, message: 'Blog post not found.' };
//     }

//     return {
//         success:true,
//         data:blogPost
//     }
//    } catch (error) {
//      throw new error('unable to retrieve blog');
//    }
// }  

// module.exports = blogPostsService;