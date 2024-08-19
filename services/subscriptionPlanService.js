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

// // Create Subscription Plans table if it doesn't exist
// const createSubscriptionPlansTableQuery = `
//     CREATE TABLE IF NOT EXISTS subscription_plans (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         rate VARCHAR(10) NOT NULL,
//         duration VARCHAR(50) NOT NULL,
//         minInvest DECIMAL(10, 2) NOT NULL,
//         maxInvest DECIMAL(10, 2) NOT NULL,
//         avgMonthly VARCHAR(20) NOT NULL,
//         label VARCHAR(50),
//         label ENUM('basic', 'regular', 'popular', 'bronze', 'silver', 'gold') NOT NULL DEFAULT 'user',
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//     )
// `;

// // Function to create the Subscription Plans table
// async function createSubscriptionPlansTable() {
//     try {
//         await query(createSubscriptionPlansTableQuery);
//         console.log('Subscription Plans table created successfully');
//     } catch (error) {
//         console.error('Error creating Subscription Plans table:', error);
//     }
// }

// // Execute table creation query
// (async () => {
//     await createSubscriptionPlansTable();
// })();

// // Subscription plan CRUD operations
// const subscriptionPlanService = {};

// // Function to create a new subscription plan
// subscriptionPlanService.createSubscriptionPlan = async (subscriptionPlanData) => {
//     try {
//         const { rate, duration, minInvest, maxInvest, avgMonthly, label } = subscriptionPlanData;

//         const insertQuery = `
//             INSERT INTO subscription_plans (rate, duration, minInvest, maxInvest, avgMonthly, label)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [rate, duration, minInvest, maxInvest, avgMonthly, label]);

//         if (!result.insertId) {
//             throw new Error('Failed to create subscription plan');
//         }

//         return { id: result.insertId, ...subscriptionPlanData };
//     } catch (error) {
//         throw error;
//     }
// };

// // Function to get all subscription plans
// subscriptionPlanService.getAllSubscriptionPlans = async () => {
//     try {
//         const selectQuery = 'SELECT * FROM subscription_plans';
//         const plans = await query(selectQuery);

//         if (plans.length === 0) {
//             return { message: "No subscription plans found" };
//         }

//         return plans;
//     } catch (error) {
//         throw error;
//     }
// };

// // Function to get a subscription plan by ID
// subscriptionPlanService.getSubscriptionPlanById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM subscription_plans WHERE id = ?';
//         const plans = await query(selectQuery, [id]);
        
//         if (plans.length === 0) {
//             return { message: "Subscription plan not found" };
//         }

//         return plans[0];
//     } catch (error) {
//         throw error;
//     }
// };

// // Function to update a subscription plan by ID
// subscriptionPlanService.updateSubscriptionPlan = async (id, updatedPlanData) => {
//     try {
//         const { rate, duration, minInvest, maxInvest, avgMonthly, label } = updatedPlanData;

//         const updateQuery = `
//             UPDATE subscription_plans
//             SET rate = ?, duration = ?, minInvest = ?, maxInvest = ?, avgMonthly = ?, label = ?
//             WHERE id = ?
//         `;
//         const result = await query(updateQuery, [rate, duration, minInvest, maxInvest, avgMonthly, label, id]);

//         if (result.affectedRows === 0) {
//             throw new Error('Failed to update subscription plan');
//         }

//         return { id, ...updatedPlanData };
//     } catch (error) {
//         throw error;
//     }
// };

// // Function to delete a subscription plan by ID
// subscriptionPlanService.deleteSubscriptionPlan = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM subscription_plans WHERE id = ?';
//         const result = await query(deleteQuery, [id]);

//         if (result.affectedRows === 0) {
//             throw new Error('Failed to delete subscription plan');
//         }

//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = subscriptionPlanService;





const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

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

const createSubscriptionPlansTableQuery = `
    CREATE TABLE IF NOT EXISTS subscription_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rate VARCHAR(10) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        minInvest DECIMAL(10, 2) NOT NULL,
        maxInvest DECIMAL(10, 2) NOT NULL,
        avgMonthly VARCHAR(20) NOT NULL,
        label ENUM('basic', 'regular', 'popular', 'bronze', 'silver', 'gold') NOT NULL DEFAULT 'basic',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

async function createSubscriptionPlansTable() {
    try {
        await query(createSubscriptionPlansTableQuery);
        console.log('Subscription Plans table created successfully');
    } catch (error) {
        console.error('Error creating Subscription Plans table:', error);
    }
}

(async () => {
    await createSubscriptionPlansTable();
})();

const subscriptionPlanService = {};

subscriptionPlanService.createSubscriptionPlan = async (subscriptionPlanData) => {
    try {
        const { rate, duration, minInvest, maxInvest, avgMonthly, label } = subscriptionPlanData;

        const insertQuery = `
            INSERT INTO subscription_plans (rate, duration, minInvest, maxInvest, avgMonthly, label)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [rate, duration, minInvest, maxInvest, avgMonthly, label]);

        if (!result.insertId) {
            throw new Error('Failed to create subscription plan');
        }

        return { id: result.insertId, ...subscriptionPlanData };
    } catch (error) {
        throw error;
    }
};

subscriptionPlanService.getAllSubscriptionPlans = async () => {
    try {
        const selectQuery = 'SELECT * FROM subscription_plans';
        const plans = await query(selectQuery);

        if (plans.length === 0) {
            return { message: "No subscription plans found" };
        }

        return plans;
    } catch (error) {
        throw error;
    }
};

subscriptionPlanService.getSubscriptionPlanById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM subscription_plans WHERE id = ?';
        const plans = await query(selectQuery, [id]);

        if (plans.length === 0) {
            return { message: "Subscription plan not found" };
        }

        return plans[0];
    } catch (error) {
        throw error;
    }
};

subscriptionPlanService.updateSubscriptionPlan = async (id, updatedPlanData) => {
    try {
        const { rate, duration, minInvest, maxInvest, avgMonthly, label } = updatedPlanData;

        const updateQuery = `
            UPDATE subscription_plans
            SET rate = ?, duration = ?, minInvest = ?, maxInvest = ?, avgMonthly = ?, label = ?
            WHERE id = ?
        `;
        const result = await query(updateQuery, [rate, duration, minInvest, maxInvest, avgMonthly, label, id]);

        if (result.affectedRows === 0) {
            throw new Error('Failed to update subscription plan');
        }

        return { id, ...updatedPlanData };
    } catch (error) {
        throw error;
    }
};

subscriptionPlanService.deleteSubscriptionPlan = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM subscription_plans WHERE id = ?';
        const result = await query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            throw new Error('Failed to delete subscription plan');
        }

        return { id };
    } catch (error) {
        throw error;
    }
};

module.exports = subscriptionPlanService;
