const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT || 10, // Added fallback value
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

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

const createPostDepositsTableQuery = `
    CREATE TABLE IF NOT EXISTS post_deposits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('deposit', 'withdrawal', 'earning') NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        profit DECIMAL(15, 2) NOT NULL,
        currency VARCHAR(255) NOT NULL,
        investorName VARCHAR(255) NOT NULL,
        status ENUM('pending', 'publish', 'unpublish') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

async function createPostDepositsTable() {
    try {
        await query(createPostDepositsTableQuery);
        console.log('Post deposits table created successfully');
    } catch (error) {
        console.error('Error creating post deposits table:', error);
    }
}

// Execute table creation query
(async () => {
    await createPostDepositsTable();
    console.log('Post deposits table setup complete');
})();

const postDepositsService = {};

// Create a new post deposit/withdrawal
postDepositsService.createPostDeposits = async (postsDeposits) => {
    try {
        const { type, amount, profit, currency, investorName, status = 'pending' } = postsDeposits;
        const insertQuery = `
            INSERT INTO post_deposits (type, amount, profit, currency, investorName, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [type, amount, profit, currency, investorName, status]);

        return {
            success: true,
            message: 'Post deposit created successfully.',
            data: { id: result.insertId, ...postsDeposits },
        };
    } catch (error) {
        console.error('Error creating post deposit:', error.message);
        throw new Error('Unable to create post deposit at this time. Please try again later.');
    }
};

// Update an existing post deposit/withdrawal
postDepositsService.updatePostDeposits = async (id, { type, amount, profit, currency, investorName, status }) => {
    try {
        const updateQuery = `
            UPDATE post_deposits
            SET type = ?, amount = ?, profit = ?, currency = ?, investorName = ?, status = ?
            WHERE id = ?
        `;
        const result = await query(updateQuery, [type, amount, profit, currency, investorName, status, id]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'Post deposit not found or no changes made.' };
        }

        return { success: true, message: 'Post deposit updated successfully.' };
    } catch (error) {
        console.error('Error updating post deposit:', error.message);
        throw new Error('Unable to update post deposit at this time. Please try again later.');
    }
};

// Delete a post deposit/withdrawal
postDepositsService.deletePostDeposits = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM post_deposits WHERE id = ?';
        const result = await query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'Post deposit not found.' };
        }

        return { success: true, message: 'Post deposit deleted successfully.' };
    } catch (error) {
        console.error('Error deleting post deposit:', error.message);
        throw new Error('Unable to delete post deposit at this time. Please try again later.');
    }
};

// Retrieve all post deposits/withdrawals
postDepositsService.getAllPostDeposits = async () => {
    try {
        const selectQuery = 'SELECT * FROM post_deposits';
        const postsDeposits = await query(selectQuery);

        return {
            success: true,
            message: postsDeposits.length > 0 ? 'Post deposits retrieved successfully.' : 'No post deposits found.',
            data: postsDeposits,
        };
    } catch (error) {
        console.error('Error retrieving post deposits:', error.message);
        throw new Error('Unable to retrieve post deposits at this time. Please try again later.');
    }
};

// Change the status of a post deposit/withdrawal
postDepositsService.updatePostDepositsStatus = async (id, status) => {
    try {
        const validStatuses = ['pending', 'publish', 'unpublish'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status. Valid statuses are pending, publish, or unpublish.');
        }

        const updateQuery = 'UPDATE post_deposits SET status = ? WHERE id = ?';
        const result = await query(updateQuery, [status, id]);

        if (result.affectedRows === 0) {
            return { success: false, message: 'Post deposit not found or no changes made.' };
        }

        return { success: true, message: `Post deposit status updated to '${status}'.` };
    } catch (error) {
        console.error('Error updating post deposit status:', error.message);
        throw new Error('Unable to update post deposit status at this time. Please try again later.');
    }
};

// Optimized Get all recent withdrawals
postDepositsService.getAllRecentWithdrawals = async (limit = 10) => {
    try {
        const selectQuery = `
            SELECT * FROM post_deposits
            WHERE type = 'withdrawal'
            ORDER BY createdAt DESC
            LIMIT ?
        `;
        const recentWithdrawals = await query(selectQuery, [limit]);

        return {
            success: true,
            message: recentWithdrawals.length > 0 ? 'Recent withdrawals retrieved successfully.' : 'No recent withdrawals found.',
            data: recentWithdrawals,
        };
    } catch (error) {
        console.error('Error retrieving recent withdrawals:', error.message);
        throw new Error('Unable to retrieve recent withdrawals at this time. Please try again later.');
    }
};



// Optimized Get all recent deposits
postDepositsService.getAllRecentDeposits = async (limit = 10) => {
    try {
        const selectQuery = `
            SELECT * FROM post_deposits
            WHERE type = 'deposit'
            ORDER BY createdAt DESC
            LIMIT ?
        `;
        const recentDeposits = await query(selectQuery, [limit]);

        return {
            success: true,
            message: recentDeposits.length > 0 ? 'Recent deposits retrieved successfully.' : 'No recent deposits found.',
            data: recentDeposits,
        };
    } catch (error) {
        console.error('Error retrieving recent deposits:', error.message);
        throw new Error('Unable to retrieve recent deposits at this time. Please try again later.');
    }
};



// Optimized Get all recent withdrawals with status 'publish'
// postDepositsService.getAllRecentWithdrawals = async (limit = 10) => {
//     try {
//         const selectQuery = `
//             SELECT * FROM post_deposits
//             WHERE type = 'withdrawal' AND status = 'publish'
//             ORDER BY createdAt DESC
//             LIMIT ?
//         `;
//         const recentWithdrawals = await query(selectQuery, [limit]);

//         return {
//             success: true,
//             message: recentWithdrawals.length > 0 ? 'Recent withdrawals retrieved successfully.' : 'No recent withdrawals found.',
//             data: recentWithdrawals,
//         };
//     } catch (error) {
//         console.error('Error retrieving recent withdrawals:', error.message);
//         throw new Error('Unable to retrieve recent withdrawals at this time. Please try again later.');
//     }
// };

// // Optimized Get all recent deposits with status 'publish'
// postDepositsService.getAllRecentDeposits = async (limit = 10) => {
//     try {
//         const selectQuery = `
//             SELECT * FROM post_deposits
//             WHERE type = 'deposit' AND status = 'publish'
//             ORDER BY createdAt DESC
//             LIMIT ?
//         `;
//         const recentDeposits = await query(selectQuery, [limit]);

//         return {
//             success: true,
//             message: recentDeposits.length > 0 ? 'Recent deposits retrieved successfully.' : 'No recent deposits found.',
//             data: recentDeposits,
//         };
//     } catch (error) {
//         console.error('Error retrieving recent deposits:', error.message);
//         throw new Error('Unable to retrieve recent deposits at this time. Please try again later.');
//     }
// };


module.exports = postDepositsService;
