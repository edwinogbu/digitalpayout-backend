// const mysql = require('mysql');
// const dotenv = require('dotenv');

// dotenv.config();

// // Create a pool of MySQL connections
// const pool = mysql.createPool({
//     connectionLimit: process.env.CONNECTION_LIMIT || 10,
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

// // Table creation SQL statements
// const createCurrenciesTable = `
//     CREATE TABLE IF NOT EXISTS currencies (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         code VARCHAR(10) UNIQUE NOT NULL,
//         symbol VARCHAR(5) NOT NULL,
//         name VARCHAR(50) NOT NULL
//     );
// `;

// const createWalletsTable = `
//     CREATE TABLE IF NOT EXISTS wallets (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         userId INT NOT NULL,
//         balance DECIMAL(15, 2) DEFAULT 0.00,
//         currencyId INT NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (userId) REFERENCES users(id),
//         FOREIGN KEY (currencyId) REFERENCES currencies(id)
//     );
// `;

// const createTransactionsTable = `
//     CREATE TABLE IF NOT EXISTS transactions (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         walletId INT NOT NULL,
//         type ENUM('deposit', 'withdrawal', 'earning') NOT NULL,
//         amount DECIMAL(15, 2) NOT NULL,
//         currencyId INT NOT NULL,
//         status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (walletId) REFERENCES wallets(id),
//         FOREIGN KEY (currencyId) REFERENCES currencies(id)
//     );
// `;

// const createPayoutsTable = `
//     CREATE TABLE IF NOT EXISTS payouts (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         walletId INT NOT NULL,
//         amount DECIMAL(15, 2) NOT NULL,
//         currencyId INT NOT NULL,
//         status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (walletId) REFERENCES wallets(id),
//         FOREIGN KEY (currencyId) REFERENCES currencies(id)
//     );
// `;

// const createSubscriptionsTable = `
//     CREATE TABLE IF NOT EXISTS subscriptions (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         walletId INT,
//         planId INT,
//         startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         endDate TIMESTAMP NULL,
//         earnings DECIMAL(15, 2) DEFAULT 0.00,
//         currencyId INT NOT NULL,
//         reinvest BOOLEAN DEFAULT FALSE,
//         FOREIGN KEY (walletId) REFERENCES wallets(id),
//         FOREIGN KEY (planId) REFERENCES subscription_plans(id),
//         FOREIGN KEY (currencyId) REFERENCES currencies(id)
//     );
// `;

// const createDepositsTable = `
//     CREATE TABLE IF NOT EXISTS deposits (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         walletId INT NOT NULL,
//         amount DECIMAL(15, 2) NOT NULL,
//         currencyId INT NOT NULL,
//         status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
//         proofOfPayment VARCHAR(255) DEFAULT NULL,  -- Path to proof of payment file
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (walletId) REFERENCES wallets(id),
//         FOREIGN KEY (currencyId) REFERENCES currencies(id)
//     );
// `;
// const createSubscriptionPlansTableQuery = `
//     CREATE TABLE IF NOT EXISTS subscription_plans (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         rate VARCHAR(10) NOT NULL,
//         duration VARCHAR(50) NOT NULL,
//         minInvest DECIMAL(10, 2) NOT NULL,
//         maxInvest DECIMAL(10, 2) NOT NULL,
//         avgMonthly VARCHAR(20) NOT NULL,
//         label ENUM('basic', 'regular', 'popular', 'bronze', 'silver', 'gold') NOT NULL DEFAULT 'basic',
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//     )
// `;

// // Function to create tables
// async function createTables() {
//     try {
//         await query(createCurrenciesTable);
//         await query(createWalletsTable);
//         await query(createTransactionsTable);
//         await query(createPayoutsTable);
//         await query(createSubscriptionsTable);
//         await query(createDepositsTable);
//         console.log('All tables created successfully');
//     } catch (error) {
//         console.error('Error creating tables:', error);
//         throw error;
//     }
// }

// // Call the function to create tables
// createTables();

// const cryptoInvestmentService = {};



// Create a new currency
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

// Create a pool of MySQL connections
const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT || 10,
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

// Table creation SQL statements
const createCurrenciesTable = `
    CREATE TABLE IF NOT EXISTS currencies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        symbol VARCHAR(5) NOT NULL,
        name VARCHAR(50) NOT NULL
    );
`;

const createWalletsTable = `
    CREATE TABLE IF NOT EXISTS wallets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        balance DECIMAL(15, 2) DEFAULT 0.00,
        currencyId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (currencyId) REFERENCES currencies(id)
    );
`;

const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        walletId INT NOT NULL,
        type ENUM('deposit', 'withdrawal', 'earning') NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        currencyId INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (walletId) REFERENCES wallets(id),
        FOREIGN KEY (currencyId) REFERENCES currencies(id)
    );
`;

const createPayoutsTable = `
    CREATE TABLE IF NOT EXISTS payouts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        walletId INT NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        currencyId INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (walletId) REFERENCES wallets(id),
        FOREIGN KEY (currencyId) REFERENCES currencies(id)
    );
`;

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

const createSubscriptionsTable = `
    CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        walletId INT,
        planId INT,
        userId INT NOT NULL,
        startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endDate TIMESTAMP NULL,
        earnings DECIMAL(15, 2) DEFAULT 0.00,
        currencyId INT NOT NULL,
        reinvest BOOLEAN DEFAULT FALSE,
        depositId INT,  -- New column to reference the deposits table
        dailyInterestGain DECIMAL(10, 2) NOT NULL DEFAULT 0,
        dailyTotalAmount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        totalInterest DECIMAL(10, 2) NOT NULL DEFAULT 0,
        totalAmount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (walletId) REFERENCES wallets(id),
        FOREIGN KEY (planId) REFERENCES subscription_plans(id),
        FOREIGN KEY (currencyId) REFERENCES currencies(id),
        FOREIGN KEY (depositId) REFERENCES deposits(id)  -- Foreign key relationship
    );
`;

const createDepositsTable = `
    CREATE TABLE IF NOT EXISTS deposits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        walletId INT NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        currencyId INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        proofOfPayment VARCHAR(255) DEFAULT NULL,  -- Path to proof of payment file
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (walletId) REFERENCES wallets(id),
        FOREIGN KEY (currencyId) REFERENCES currencies(id)
    );
`;

// Function to create tables
async function createTables() {
    try {
        await query(createCurrenciesTable);
        await query(createWalletsTable);
        await query(createTransactionsTable);
        await query(createPayoutsTable);
        await query(createSubscriptionPlansTableQuery);
        await query(createSubscriptionsTable);
        await query(createDepositsTable);
        console.log('All tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}

// Function to alter the subscriptions table to add depositId foreign key
// const alterSubscriptionsTable = `
//     ALTER TABLE subscriptions 
//     ADD COLUMN depositId INT,
//     ADD CONSTRAINT fk_depositId FOREIGN KEY (depositId) REFERENCES deposits(id);
// `;

// async function alterTable() {
//     try {
//         await query(alterSubscriptionsTable);
//         console.log('subscriptions table altered successfully');
//     } catch (error) {
//         console.error('Error altering subscriptions table:', error);
//         throw error;
//     }
// }

// Call the function to create tables and alter the subscriptions table
// createTables().then(() => {
//     alterTable();
// });

const cryptoInvestmentService = {};

cryptoInvestmentService.createCurrency = async (code, symbol, name) => {
    try {
        const insertQuery = 'INSERT INTO currencies (code, symbol, name) VALUES (?, ?, ?)';
        const result = await query(insertQuery, [code, symbol, name]);

        return { message: 'Currency created successfully', currencyId: result.insertId };
    } catch (error) {
        throw error;
    }
};

// Update an existing currency
cryptoInvestmentService.updateCurrency = async (id, code, symbol, name) => {
    try {
        const updateQuery = 'UPDATE currencies SET code = ?, symbol = ?, name = ? WHERE id = ?';
        const result = await query(updateQuery, [code, symbol, name, id]);

        if (result.affectedRows === 0) {
            throw new Error('Currency not found or no changes made');
        }

        return { message: 'Currency updated successfully' };
    } catch (error) {
        throw error;
    }
};

// Delete a currency
cryptoInvestmentService.deleteCurrency = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM currencies WHERE id = ?';
        const result = await query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            throw new Error('Currency not found');
        }

        return { message: 'Currency deleted successfully' };
    } catch (error) {
        throw error;
    }
};

// Retrieve all currencies
cryptoInvestmentService.getAllCurrencies = async () => {
    try {
        const selectQuery = 'SELECT * FROM currencies';
        const currencies = await query(selectQuery);

        return currencies;
    } catch (error) {
        throw error;
    }
};


// Create a new wallet for a user
cryptoInvestmentService.createWallet = async (userId, currencyId) => {
    try {
        const insertQuery = 'INSERT INTO wallets (userId, currencyId) VALUES (?, ?)';
        const result = await query(insertQuery, [userId, currencyId]);

        if (!result.insertId) {
            throw new Error('Failed to create wallet');
        }

        return { message: 'Wallet created successfully', walletId: result.insertId };
    } catch (error) {
        throw error;
    }
};

// Credit an investor's wallet
// cryptoInvestmentService.creditWallet = async (walletId, amount) => {
//     try {
//         const updateQuery = 'UPDATE wallets SET balance = balance + ? WHERE id = ?';
//         const result = await query(updateQuery, [amount, walletId]);

//         if (result.affectedRows === 0) {
//             throw new Error('Wallet not found');
//         }

//         return { message: 'Wallet credited successfully' };
//     } catch (error) {
//         throw error;
//     }
// };

// cryptoInvestmentService.creditWallet = async (walletId, amount) => {
//     try {
//         // Step 1: Check if there are any deposits with 'accepted' status
//         const depositQuery = 'SELECT SUM(amount) as totalDeposited FROM deposits WHERE walletId = ? AND status = "accepted"';
//         const depositResult = await query(depositQuery, [walletId]);

//         const totalDeposited = depositResult[0].totalDeposited || 0;

//         if (totalDeposited === 0) {
//             throw new Error('No accepted deposits found for this wallet.');
//         }

//         // Step 2: Check the total earnings from subscriptions
//         const earningsQuery = 'SELECT SUM(earnings) as totalEarnings FROM subscriptions WHERE walletId = ?';
//         const earningsResult = await query(earningsQuery, [walletId]);

//         const totalEarnings = earningsResult[0].totalEarnings || 0;

//         // Step 3: Calculate the allowable amount for crediting
//         const allowableAmount = totalDeposited + totalEarnings;

//         if (amount > allowableAmount) {
//             throw new Error(`The amount exceeds the allowable limit. Maximum allowable credit is ${allowableAmount.toFixed(2)}, but tried to credit ${amount.toFixed(2)}.`);
//         }

//         // Step 4: Proceed with crediting the wallet
//         const updateQuery = 'UPDATE wallets SET balance = balance + ? WHERE id = ?';
//         const result = await query(updateQuery, [amount, walletId]);

//         if (result.affectedRows === 0) {
//             throw new Error('Wallet not found');
//         }

//         return { message: 'Wallet credited successfully', creditedAmount: amount, allowableAmount: allowableAmount.toFixed(2) };
//     } catch (error) {
//         throw error;
//     }
// };

cryptoInvestmentService.creditWallet = async (walletId, depositId, amount) => {
    try {
        // Step 1: Check the deposit by ID and status
        const depositQuery = 'SELECT amount, status FROM deposits WHERE walletId = ? AND id = ?';
        const depositResult = await query(depositQuery, [walletId, depositId]);

        if (depositResult.length === 0) {
            throw new Error('No deposit found for this wallet with the provided deposit ID.');
        }

        const depositAmount = depositResult[0].amount;
        const depositStatus = depositResult[0].status;

        // Step 2: Handle pending deposit status
        if (depositStatus === 'pending') {
            throw new Error('The deposit is still pending. Crediting the wallet is not allowed until the deposit is accepted.');
        }

        // Step 3: Check the total earnings for that specific subscription
        const earningsQuery = 'SELECT earnings FROM subscriptions WHERE walletId = ? AND depositId = ?';
        const earningsResult = await query(earningsQuery, [walletId, depositId]);

        const totalEarnings = earningsResult.length > 0 ? earningsResult[0].earnings : 0;

        // Step 4: Calculate the allowable amount for crediting
        const allowableAmount = depositAmount + totalEarnings;

        if (amount > allowableAmount) {
            throw new Error(`The amount exceeds the allowable limit. 
            - Deposited Amount: ${depositAmount.toFixed(2)} 
            - Earnings from Subscription: ${totalEarnings.toFixed(2)} 
            - Maximum Allowable Credit: ${allowableAmount.toFixed(2)} 
            - Attempted Credit: ${amount.toFixed(2)}`);
        }

        // Step 5: Proceed with crediting the wallet
        const updateQuery = 'UPDATE wallets SET balance = balance + ? WHERE id = ?';
        const result = await query(updateQuery, [amount, walletId]);

        if (result.affectedRows === 0) {
            throw new Error('Wallet not found.');
        }

        return { 
            message: 'Wallet credited successfully.', 
            creditedAmount: amount, 
            allowableAmount: allowableAmount.toFixed(2) 
        };
    } catch (error) {
        throw error;
    }
};


// Request a deposit with proof of payment
cryptoInvestmentService.requestDeposit = async (walletId, amount, currencyId, proofOfPayment) => {
    try {
        const insertQuery = 'INSERT INTO deposits (walletId, amount, currencyId, status, proofOfPayment) VALUES (?, ?, ?, ?, ?)';
        const result = await query(insertQuery, [walletId, amount, currencyId, 'pending', proofOfPayment]);

        if (!result.insertId) {
            throw new Error('Failed to request deposit');
        }

        return { message: 'Deposit request submitted successfully', depositId: result.insertId };
    } catch (error) {
        throw error;
    }
};

// Admin function to approve or reject a deposit request
// cryptoInvestmentService.updateDepositStatus = async (depositId, status) => {
//     try {
//         const validStatuses = ['pending', 'accepted', 'rejected'];
//         if (!validStatuses.includes(status)) {
//             throw new Error('Invalid status');
//         }

//         const updateQuery = 'UPDATE deposits SET status = ? WHERE id = ?';
//         const result = await query(updateQuery, [status, depositId]);

//         if (result.affectedRows === 0) {
//             throw new Error('Deposit request not found');
//         }

//         return { message: 'Deposit status updated successfully' };
//     } catch (error) {
//         throw error;
//     }
// };

cryptoInvestmentService.updateDepositStatus = async (depositId, status) => {
    try {
        const validStatuses = ['pending', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }

        // Update deposit status
        const updateQuery = 'UPDATE deposits SET status = ? WHERE id = ?';
        const result = await query(updateQuery, [status, depositId]);

        if (result.affectedRows === 0) {
            throw new Error('Deposit request not found');
        }

        // Fetch deposit details for transaction recording
        const depositDetailsQuery = 'SELECT walletId, amount, currencyId FROM deposits WHERE id = ?';
        const depositDetails = await query(depositDetailsQuery, [depositId]);

        if (depositDetails.length === 0) {
            throw new Error('Deposit details not found');
        }

        const { walletId, amount, currencyId } = depositDetails[0];

        // If the deposit is accepted, record a transaction
        if (status === 'accepted') {
            const transactionQuery = `
                INSERT INTO transactions (walletId, amount, currencyId, type,  status)
                VALUES (?, ?, ?, 'deposit', 'completed')
            `;
            await query(transactionQuery, [walletId, amount, currencyId]);

            return {
                message: 'Deposit accepted. Transaction recorded successfully. Funds will be credited when the investment duration is due.',
            };
        }

        return { message: `Deposit status updated successfully to ${status}` };
    } catch (error) {
        console.error(error);
        throw error;
    }
};




// Retrieve all deposit requests
cryptoInvestmentService.getAllDeposits = async () => {
    try {
        const selectQuery = 'SELECT * FROM deposits';
        const deposits = await query(selectQuery);

        return deposits;
    } catch (error) {
        throw error;
    }
};

// Request a withdrawal
cryptoInvestmentService.requestWithdrawal = async (walletId, amount, currencyId) => {
    try {
        const insertQuery = 'INSERT INTO transactions (walletId, type, amount, currencyId) VALUES (?, ?, ?, ?)';
        const result = await query(insertQuery, [walletId, 'withdrawal', amount, currencyId]);

        if (!result.insertId) {
            throw new Error('Failed to request withdrawal');
        }

        return { message: 'Withdrawal request submitted successfully', transactionId: result.insertId };
    } catch (error) {
        throw error;
    }
};

// Admin function to approve or reject a withdrawal request
cryptoInvestmentService.updateWithdrawalStatus = async (transactionId, status) => {
    try {
        const validStatuses = ['pending', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }

        const updateQuery = 'UPDATE transactions SET status = ? WHERE id = ? AND type = "withdrawal"';
        const result = await query(updateQuery, [status, transactionId]);

        if (result.affectedRows === 0) {
            throw new Error('Withdrawal request not found');
        }

        return { message: 'Withdrawal status updated successfully' };
    } catch (error) {
        throw error;
    }
};

// Retrieve all transactions for a specific wallet
cryptoInvestmentService.getAllTransactionsByWalletId = async (walletId) => {
    try {
        const selectQuery = 'SELECT * FROM transactions WHERE walletId = ?';
        const transactions = await query(selectQuery, [walletId]);

        return transactions;
    } catch (error) {
        throw error;
    }
};



// Retrieve user wallet details along with subscription information
cryptoInvestmentService.getUserWalletAndSubscriptionDetails = async (userId) => {
    try {
        // Query to retrieve user, wallet, and subscription details
        const selectQuery = `
            SELECT 
                u.id AS userId, u.firstName, u.lastName, u.email,
                w.id AS walletId, w.balance, w.currencyId, w.createdAt AS walletCreatedAt,
                s.id AS subscriptionId, s.startDate, s.endDate, s.earnings, 
                p.name AS planName, p.duration, p.interestRate
            FROM users u
            LEFT JOIN wallets w ON u.id = w.userId
            LEFT JOIN subscriptions s ON w.id = s.walletId
            LEFT JOIN subscription_plans p ON s.planId = p.id
            WHERE u.id = ?
        `;

        const results = await query(selectQuery, [userId]);

        if (results.length === 0) {
            throw new Error('User or wallet not found');
        }

        return results;
    } catch (error) {
        throw error;
    }
};



// Additional implementation for managing subscriptions and deposits

// Create a new subscription for a user
cryptoInvestmentService.createSubscription = async (walletId, planId, currencyId, reinvest = false) => {
    try {
        const insertQuery = `
            INSERT INTO subscriptions (walletId, planId, currencyId, reinvest) 
            VALUES (?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [walletId, planId, currencyId, reinvest]);

        if (!result.insertId) {
            throw new Error('Failed to create subscription');
        }

        return { message: 'Subscription created successfully', subscriptionId: result.insertId };
    } catch (error) {
        throw error;
    }
};


// Update an existing subscription
cryptoInvestmentService.updateSubscription = async (subscriptionId, reinvest, endDate) => {
    try {
        const updateQuery = `
            UPDATE subscriptions 
            SET reinvest = ?, endDate = ? 
            WHERE id = ?
        `;
        const result = await query(updateQuery, [reinvest, endDate, subscriptionId]);

        if (result.affectedRows === 0) {
            throw new Error('Subscription not found or no changes made');
        }

        return { message: 'Subscription updated successfully' };
    } catch (error) {
        throw error;
    }
};



// Retrieve all subscriptions for a specific wallet
cryptoInvestmentService.getAllSubscriptionsByWalletId = async (walletId) => {
    try {
        const selectQuery = 'SELECT * FROM subscriptions WHERE walletId = ?';
        const subscriptions = await query(selectQuery, [walletId]);

        return subscriptions;
    } catch (error) {
        throw error;
    }
};

// Retrieve all subscriptions
cryptoInvestmentService.getAllSubscriptions = async () => {
    try {
        const selectQuery = 'SELECT * FROM subscriptions';
        const subscriptions = await query(selectQuery);

        return subscriptions;
    } catch (error) {
        throw error;
    }
};

// Retrieve subscription details along with the associated wallet and plan
cryptoInvestmentService.getSubscriptionDetails = async (subscriptionId) => {
    try {
        const selectQuery = `
            SELECT 
                s.id AS subscriptionId, s.startDate, s.endDate, s.earnings, s.reinvest,
                w.id AS walletId, w.balance, w.currencyId, 
                p.id AS planId, p.name AS planName, p.duration, p.interestRate
            FROM subscriptions s
            LEFT JOIN wallets w ON s.walletId = w.id
            LEFT JOIN subscription_plans p ON s.planId = p.id
            WHERE s.id = ?
        `;

        const result = await query(selectQuery, [subscriptionId]);

        if (result.length === 0) {
            throw new Error('Subscription not found');
        }

        return result[0];
    } catch (error) {
        throw error;
    }
};

// Retrieve earnings from subscriptions
cryptoInvestmentService.getSubscriptionEarnings = async (subscriptionId) => {
    try {
        const selectQuery = `
            SELECT earnings FROM subscriptions 
            WHERE id = ?
        `;
        const result = await query(selectQuery, [subscriptionId]);

        if (result.length === 0) {
            throw new Error('Subscription not found');
        }

        return { earnings: result[0].earnings };
    } catch (error) {
        throw error;
    }
};

// Update subscription earnings
cryptoInvestmentService.updateSubscriptionEarnings = async (subscriptionId, amount) => {
    try {
        const updateQuery = `
            UPDATE subscriptions 
            SET earnings = earnings + ? 
            WHERE id = ?
        `;
        const result = await query(updateQuery, [amount, subscriptionId]);

        if (result.affectedRows === 0) {
            throw new Error('Subscription not found');
        }

        return { message: 'Subscription earnings updated successfully' };
    } catch (error) {
        throw error;
    }
};

// Retrieve all deposit requests for a specific wallet
cryptoInvestmentService.getDepositsByWalletId = async (walletId) => {
    try {
        const selectQuery = 'SELECT * FROM deposits WHERE walletId = ?';
        const deposits = await query(selectQuery, [walletId]);

        return deposits;
    } catch (error) {
        throw error;
    }
};

// Retrieve all deposits within a specific time range
cryptoInvestmentService.getDepositsByDateRange = async (startDate, endDate) => {
    try {
        const selectQuery = `
            SELECT * FROM deposits 
            WHERE createdAt BETWEEN ? AND ?
        `;
        const deposits = await query(selectQuery, [startDate, endDate]);

        return deposits;
    } catch (error) {
        throw error;
    }
};

// Update deposit proof of payment
cryptoInvestmentService.updateDepositProof = async (depositId, proofOfPayment) => {
    try {
        const updateQuery = `
            UPDATE deposits 
            SET proofOfPayment = ? 
            WHERE id = ?
        `;
        const result = await query(updateQuery, [proofOfPayment, depositId]);

        if (result.affectedRows === 0) {
            throw new Error('Deposit not found or no changes made');
        }

        return { message: 'Deposit proof of payment updated successfully' };
    } catch (error) {
        throw error;
    }
};

// Delete a deposit request
cryptoInvestmentService.deleteDeposit = async (depositId) => {
    try {
        const deleteQuery = 'DELETE FROM deposits WHERE id = ?';
        const result = await query(deleteQuery, [depositId]);

        if (result.affectedRows === 0) {
            throw new Error('Deposit not found');
        }

        return { message: 'Deposit deleted successfully' };
    } catch (error) {
        throw error;
    }
};


// cryptoInvestmentService.calculateEarnings = (rate, depositAmount, duration) => {
//     return (parseFloat(rate) * depositAmount * duration).toFixed(2);
// };


// cryptoInvestmentService.getPlanDetails = async (planId) => {
//     const plan = await query("SELECT * FROM subscription_plans WHERE id = ?", [planId]);
//     return plan.length ? plan[0] : null;
// };

// Function to get plan details by plan ID
async function getPlanDetails(planId) {
    try {
        const selectQuery = 'SELECT * FROM subscription_plans WHERE id = ?';
        const plans = await query(selectQuery, [planId]);

        if (plans.length === 0) {
            throw new Error('Plan not found');
        }

        return plans[0]; // Return the plan details
    } catch (error) {
        throw error;
    }
}



// Function to fetch user details
async function getUserDetails(userId) {
    try {
        // Query to select user details from the users table
        const selectQuery = 'SELECT * FROM users WHERE id = ?';
        const users = await query(selectQuery, [userId]);

        // Check if the user exists
        if (users.length === 0) {
            throw new Error('User not found');
        }

        // Return the user details
        return users[0];
    } catch (error) {
        // Throw error if any issues occur
        throw error;
    }
}

cryptoInvestmentService.getOrCreateSubscription = async (walletId, planId, currencyId, depositAmount, earnings, duration) => {
    const activeSubscription = await query(
        "SELECT * FROM subscriptions WHERE walletId = ? AND planId = ? AND endDate IS NULL",
        [walletId, planId]
    );

    if (activeSubscription.length > 0) {
        // Update existing subscription
        const subscription = activeSubscription[0];
        await query(
            "UPDATE subscriptions SET earnings = earnings + ?, endDate = DATE_ADD(startDate, INTERVAL ? MONTH), reinvest = ? WHERE id = ?",
            [earnings, duration, false, subscription.id]
        );
        return subscription.id;
    } else {
        // Create new subscription
        const result = await query(
            `INSERT INTO subscriptions (walletId, planId, startDate, endDate, earnings, currencyId, reinvest)
            VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MONTH), ?, ?, ?)`,
            [walletId, planId, duration, earnings, currencyId, false]
        );
        return result.insertId;
    }
};




// cryptoInvestmentService.calculateEarnings = (rate, depositAmount, duration) => {
//     let rateDecimal;

//     // Check if rate is a string with a '%' sign
//     if (typeof rate === 'string' && rate.includes('%')) {
//         // Remove '%' and convert to decimal
//         rateDecimal = parseFloat(rate) / 100;
//     } else if (typeof rate === 'number') {
//         // Assume rate is already in decimal form (e.g., 0.05 for 5%)
//         rateDecimal = rate;
//     } else {
//         throw new Error("Invalid rate format. Rate must be a number or a percentage string.");
//     }

//     // Convert duration to a number, ensuring it's a valid number
//     let durationNumber;
//     if (typeof duration === 'string') {
//         // Extract the numeric part of the duration string
//         const durationMatch = duration.match(/\d+/); // Matches one or more digits
//         if (durationMatch) {
//             durationNumber = parseFloat(durationMatch[0]); // Convert to number
//         } else {
//             throw new Error("Invalid duration format. Duration string must contain a numeric value.");
//         }
//     } else if (typeof duration === 'number') {
//         // Assume duration is already a number
//         durationNumber = duration;
//     } else {
//         throw new Error("Invalid duration format. Duration must be a number or a string containing numeric value.");
//     }

//     // Calculate earnings
//     return (rateDecimal * depositAmount * durationNumber).toFixed(2);
// };

cryptoInvestmentService.calculateEarnings = (rate, depositAmount, duration) => {
    return (parseFloat(rate) * depositAmount * duration).toFixed(2);
};



// cryptoInvestmentService.handleDepositAndSubscription = async (walletId, planId, currencyId, depositAmount, proofOfPayment) => {
//     try {
//         // Fetch the subscription plan details
//         const plan = await getPlanDetails(planId);
//         if (!plan) throw new Error("Invalid subscription plan selected");

//         // Validate deposit amount
//         if (depositAmount < plan.minInvest || depositAmount > plan.maxInvest) {
//             throw new Error(`Deposit amount must be between ${plan.minInvest} and ${plan.maxInvest}`);
//         }

//         rateDecimal = parseFloat(plan.rate) / 100;
//         duration = plan.duration
//         console.log('====================================');
//         console.log(rateDecimal, duration);
//         console.log('====================================');
//         // rateDecimal = parseFloat(rate) / 100;
//         // Calculate earnings (not credited until the duration is due)
//         // const earnings = await calculateEarnings(rateDecimal, depositAmount, duration);
//         // const earnings = calculateEarnings(plan.rate, depositAmount, plan.duration);
//         const earnings = (parseFloat(rateDecimal) * depositAmount * duration).toFixed(2);

//         // Update or create subscription
//          // Create new subscription
//          const subscriptionId = await query(
//             `INSERT INTO subscriptions (walletId, planId, startDate, endDate, earnings, currencyId, reinvest)
//             VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MONTH), ?, ?, ?)`,
//             [walletId, planId, duration, earnings, currencyId, false]
//         );
//         // const subscriptionId = await getOrCreateSubscription(walletId, planId, currencyId, depositAmount, earnings, parseInt(plan.duration));

//         // Request deposit (pending approval)
//         const depositRequest = await cryptoInvestmentService.requestDeposit(walletId, depositAmount, currencyId, proofOfPayment);

//         return {
//             success: true,
//             message: `Deposit request submitted successfully for subscription plan ${plan.label}. Admin approval is required.`,
//             subscriptionId,
//             earnings,
//             depositRequest
//         };
//     } catch (error) {
//         console.error(error);
//         return {
//             success: false,
//             message: error.message,
//         };
//     }
// };


// cryptoInvestmentService.handleDepositAndSubscription = async (walletId, planId, currencyId, depositAmount, proofOfPayment) => {
//     try {
//         // Fetch the subscription plan details
//         const plan = await getPlanDetails(planId);
//         if (!plan) throw new Error("Invalid subscription plan selected");

//         // Validate deposit amount
//         if (depositAmount < plan.minInvest || depositAmount > plan.maxInvest) {
//             throw new Error(`Deposit amount must be between ${plan.minInvest} and ${plan.maxInvest}`);
//         }

//         const rateDecimal = parseFloat(plan.rate) / 100;
//         const duration = parseInt(plan.duration);

//         console.log('Rate:', rateDecimal, 'Duration:', duration);

//         // Request deposit (initially pending approval)
//         const depositRequest = await cryptoInvestmentService.requestDeposit(walletId, depositAmount, currencyId, proofOfPayment);

//         if (!depositRequest.success) {
//             throw new Error('Failed to request deposit');
//         }

//         // Wait for deposit to be accepted (this could be a separate async flow or a polling mechanism)
//         const depositId = depositRequest.depositId;

//         // Here, assume we have a function to check deposit status
//         const isAccepted = await checkDepositStatus(depositId);

//         if (!isAccepted) {
//             return {
//                 success: false,
//                 message: 'Deposit request is still pending approval or was rejected.',
//             };
//         }

//         // Calculate earnings
//         const earnings = (rateDecimal * depositAmount * duration).toFixed(2);

//         // Create new subscription with the accepted deposit
//         const result = await query(
//             `INSERT INTO subscriptions (walletId, planId, startDate, endDate, earnings, currencyId, reinvest, depositId)
//              VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MONTH), ?, ?, ?, ?)`,
//             [walletId, planId, duration, earnings, currencyId, false, depositId]
//         );

//         const subscriptionId = result.insertId;

//         return {
//             success: true,
//             message: `Deposit accepted and subscription created successfully for plan ${plan.label}.`,
//             subscriptionId,
//             earnings,
//             depositId
//         };
//     } catch (error) {
//         console.error(error);
//         return {
//             success: false,
//             message: error.message,
//         };
//     }
// };


// cryptoInvestmentService.handleDepositAndSubscription = async (walletId, planId, currencyId, depositAmount, proofOfPayment) => {
//     try {
//         const plan = await query('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
//         if (!plan || plan.length === 0) throw new Error("Invalid subscription plan selected");

//         const selectedPlan = plan[0];

//         // Validate deposit amount
//         if (depositAmount < selectedPlan.minInvest || depositAmount > selectedPlan.maxInvest) {
//             throw new Error(`Deposit amount must be between ${selectedPlan.minInvest} and ${selectedPlan.maxInvest}`);
//         }

//         // Calculate earnings
//         const rateDecimal = parseFloat(selectedPlan.rate) / 100;
//         const duration = parseInt(selectedPlan.duration);
//         const earnings = (rateDecimal * depositAmount * duration).toFixed(2);

//         // Insert deposit request
//         const depositResult = await query(
//             `INSERT INTO deposits (walletId, amount, currencyId, status, proofOfPayment, createdAt)
//             VALUES (?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)`,
//             [walletId, depositAmount, currencyId, proofOfPayment]
//         );

//         const depositId = depositResult.insertId;

//         // Create subscription
//         const subscriptionResult = await query(
//             `INSERT INTO subscriptions (walletId, planId, startDate, endDate, earnings, currencyId, reinvest, depositId)
//             VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MONTH), ?, ?, FALSE, ?)`,
//             [walletId, planId, duration, earnings, currencyId, depositId]
//         );

//         const subscriptionId = subscriptionResult.insertId;

//         return {
//             success: true,
//             message: `Deposit request submitted and subscription created successfully for plan ${selectedPlan.label}. Admin approval is required.`,
//             subscriptionId,
//             earnings,
//             depositId,
//         };
//     } catch (error) {
//         console.error(error);
//         return {
//             success: false,
//             message: error.message,
//         };
//     }
// };



// Function to handle deposit and subscription
// cryptoInvestmentService.handleDepositAndSubscription = async (walletId, planId, currencyId, depositAmount, proofOfPayment) => {
//     try {
//         // Fetch the subscription plan details using the helper function
//         const selectedPlan = await getPlanDetails(planId);

//         // Validate deposit amount
//         if (depositAmount < selectedPlan.minInvest || depositAmount > selectedPlan.maxInvest) {
//             throw new Error(`Deposit amount must be between ${selectedPlan.minInvest} and ${selectedPlan.maxInvest}`);
//         }

//         // Calculate earnings
//         const rateDecimal = parseFloat(selectedPlan.rate) / 100;
//         const duration = parseInt(selectedPlan.duration);
//         const earnings = (rateDecimal * depositAmount * duration).toFixed(2);

//         // Insert deposit request
//         const depositResult = await query(
//             `INSERT INTO deposits (walletId, amount, currencyId, status, proofOfPayment, createdAt)
//              VALUES (?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)`,
//             [walletId, depositAmount, currencyId, proofOfPayment]
//         );

//         const depositId = depositResult.insertId;

//         // Create subscription
//         const subscriptionResult = await query(
//             `INSERT INTO subscriptions (walletId, planId, startDate, endDate, earnings, currencyId, reinvest, depositId)
//              VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MONTH), ?, ?, FALSE, ?)`,
//             [walletId, planId, duration, earnings, currencyId, depositId]
//         );

//         const subscriptionId = subscriptionResult.insertId;

//         return {
//             success: true,
//             message: `Deposit request submitted and subscription created successfully for plan ${selectedPlan.label}. Admin approval is required.`,
//             subscriptionId,
//             earnings,
//             depositId,
//             planLabel: selectedPlan.label, // Pass the plan label for use in the controller
//         };
//     } catch (error) {
//         console.error(error);
//         return {
//             success: false,
//             message: error.message,
//         };
//     }
// };


// cryptoInvestmentService.handleDepositAndSubscription = async (walletId, planId, currencyId, depositAmount, proofOfPayment) => {
//     try {
//         // Fetch the subscription plan details using the helper function
//         const selectedPlan = await getPlanDetails(planId);

//         // Validate deposit amount
//         if (depositAmount < selectedPlan.minInvest || depositAmount > selectedPlan.maxInvest) {
//             throw new Error(`Deposit amount must be between ${selectedPlan.minInvest} and ${selectedPlan.maxInvest}`);
//         }

//         // Calculate earnings
//         const rateDecimal = parseFloat(selectedPlan.rate) / 100;
//         const duration = parseInt(selectedPlan.duration);
//         const earnings = (rateDecimal * depositAmount * duration).toFixed(2);

//         // Calculate total amount to be collected
//         const totalAmount = (parseFloat(depositAmount) + parseFloat(earnings)).toFixed(2);

//         // Insert deposit request
//         const depositResult = await query(
//             `INSERT INTO deposits (walletId, amount, currencyId, status, proofOfPayment, createdAt)
//              VALUES (?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)`,
//             [walletId, depositAmount, currencyId, proofOfPayment]
//         );

//         const depositId = depositResult.insertId;

//         // Create subscription with totalTurnOver
//         const subscriptionResult = await query(
//             `INSERT INTO subscriptions (walletId, planId, startDate, endDate, earnings, currencyId, reinvest, depositId, totalTurnOver)
//              VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MONTH), ?, ?, FALSE, ?, ?)`,
//             [walletId, planId, duration, earnings, currencyId, depositId, totalAmount]
//         );

//         const subscriptionId = subscriptionResult.insertId;

//         return {
//             success: true,
//             message: `Deposit request submitted and subscription created successfully for plan ${selectedPlan.label}. Admin approval is required.`,
//             subscriptionId,
//             earnings,
//             depositId,
//             totalAmount, // Return the total amount to be collected
//             planLabel: selectedPlan.label, // Include the plan label
//         };
//     } catch (error) {
//         console.error(error);
//         return {
//             success: false,
//             message: error.message,
//         };
//     }
// };


cryptoInvestmentService.handleDepositAndSubscription = async (walletId, planId, currencyId, depositAmount, proofOfPayment, userId) => {
    try {
        // Fetch the subscription plan details using the helper function
        const selectedPlan = await getPlanDetails(planId);

                // Fetch the user details
                const user = await getUserDetails(userId);

                // Validate if the user exists
                if (!user) {
                    throw new Error('User not found');
                }
        

        // Validate deposit amount
        if (depositAmount < selectedPlan.minInvest || depositAmount > selectedPlan.maxInvest) {
            throw new Error(`Deposit amount must be between ${selectedPlan.minInvest} and ${selectedPlan.maxInvest}`);
        }

        // Calculate rate and duration
        const rateDecimal = parseFloat(selectedPlan.rate) / 100; // Convert percentage to decimal
        const duration = parseInt(selectedPlan.duration); // Duration in days

        // Convert Annual Rate to Daily Rate
        const dailyRate = rateDecimal / 365; // Annual rate to daily rate

        // Calculate Daily Interest Gain
        const dailyInterestGain = (depositAmount * dailyRate).toFixed(2);

        // Calculate Interest for the Given Duration
        const totalInterest = (depositAmount * dailyRate * duration).toFixed(2);

        // Calculate Total Amount
        const totalAmount = (parseFloat(depositAmount) + parseFloat(totalInterest)).toFixed(2);

        // Calculate Daily Total Amount
        const dailyTotalAmount = (parseFloat(depositAmount) + parseFloat(dailyInterestGain)).toFixed(2);

        // Insert deposit request
        const depositResult = await query(
            `INSERT INTO deposits (walletId, amount, currencyId, status, proofOfPayment, createdAt)
             VALUES (?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)`,
            [walletId, depositAmount, currencyId, proofOfPayment]
        );

        const depositId = depositResult.insertId;

        // Create subscription with additional fields
        const subscriptionResult = await query(
            `INSERT INTO subscriptions (walletId, planId, startDate, endDate, earnings, currencyId, reinvest, depositId, dailyInterestGain, dailyTotalAmount, totalInterest, totalAmount, userId)
             VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? DAY), ?, ?, FALSE, ?, ?, ?, ?, ?, ?)`,
            [walletId, planId, duration, totalInterest, currencyId, depositId, dailyInterestGain, dailyTotalAmount, totalInterest, totalAmount, userId]
        );

        const subscriptionId = subscriptionResult.insertId;

        return {
            success: true,
            message: `Deposit request submitted and subscription created successfully for plan ${selectedPlan.label}. Admin approval is required.`,
            subscriptionId,
            earnings: totalInterest,
            depositId,
            totalAmount, // Total amount to be collected
            planLabel: selectedPlan.label, // Include the plan label
            dailyInterestGain, // Daily interest gain
            dailyTotalAmount, // Daily total amount
            userId
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};



cryptoInvestmentService.getAllSubscriptions = async () => {
    try {
        const selectQuery = `
            SELECT s.*, 
                   CONCAT(u.firstName, ' ', u.lastName) AS username,
                   u.email,
                   u.phone,
                   d.amount AS depositAmount,
                   d.status AS depositStatus,
                   sp.label AS planLabel,
                   sp.rate AS planRate,
                   sp.duration AS planDuration
            FROM subscriptions s
            LEFT JOIN users u ON s.userId = u.id
            LEFT JOIN deposits d ON s.depositId = d.id
            LEFT JOIN subscription_plans sp ON s.planId = sp.id
        `;

        const results = await query(selectQuery);

        return results; // Return the list of subscriptions
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// cryptoInvestmentService.getAllSubscriptions = async () => {
//     try {
//         const selectQuery = `
//             SELECT s.*, sp.label AS planLabel, u.username AS userName
//             FROM subscriptions s
//             JOIN subscription_plans sp ON s.planId = sp.id
//             JOIN users u ON s.userId = u.id
//         `;

//         const results = await query(selectQuery);

//         return results; // Return the list of subscriptions
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };




cryptoInvestmentService.getSubscriptionByCriteria  = async ({ userId, depositId, walletId, subscriptionId }) => {
    try {
        let sql = `
            SELECT s.*, 
                   CONCAT(u.firstName, ' ', u.lastName) AS username, 
                   u.email AS userEmail, 
                   u.phone AS userPhone, 
                   d.amount AS depositAmount, 
                   d.status AS depositStatus, 
                   sp.rate AS planRate, 
                   sp.duration AS planDuration, 
                   sp.minInvest AS planMinInvest, 
                   sp.maxInvest AS planMaxInvest
            FROM subscriptions s
            JOIN subscription_plans sp ON s.planId = sp.id
            JOIN users u ON s.userId = u.id
            LEFT JOIN deposits d ON s.depositId = d.id
            WHERE 1=1
        `;

        const params = [];

        if (userId) {
            sql += ' AND s.userId = ?';
            params.push(userId);
        }

        if (depositId) {
            sql += ' AND s.depositId = ?';
            params.push(depositId);
        }

        if (walletId) {
            sql += ' AND s.walletId = ?';
            params.push(walletId);
        }

        if (subscriptionId) {
            sql += ' AND s.id = ?';
            params.push(subscriptionId);
        }

        const results = await query(sql, params);

        return results;
    } catch (error) {
        console.error('Error in getSubscriptionByCriteria:', error.message);
        throw error;
    }
};






cryptoInvestmentService.deleteSubscription = async (subscriptionId) => {
    try {
        // Check if the subscription exists
        const checkQuery = 'SELECT * FROM subscriptions WHERE id = ?';
        const existingSubscription = await query(checkQuery, [subscriptionId]);

        if (existingSubscription.length === 0) {
            throw new Error('Subscription not found');
        }

        // Delete the subscription
        const deleteQuery = 'DELETE FROM subscriptions WHERE id = ?';
        await query(deleteQuery, [subscriptionId]);

        return {
            success: true,
            message: 'Subscription deleted successfully'
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};


cryptoInvestmentService.getSubscriptionDetailsByUserId = async (userId) => {
    try {
        // SQL query to get subscription details by user ID
        const selectQuery = `
            SELECT 
                s.id AS subscriptionId,
                s.walletId,
                s.planId,
                s.userId,
                s.startDate,
                s.endDate,
                s.earnings,
                s.currencyId,
                s.reinvest,
                s.depositId,
                s.dailyInterestGain,
                s.dailyTotalAmount,
                s.totalInterest,
                s.totalAmount,
                sp.rate AS planRate,
                sp.duration AS planDuration,
                sp.minInvest AS planMinInvest,
                sp.maxInvest AS planMaxInvest,
                sp.avgMonthly AS planAvgMonthly,
                sp.label AS planLabel,
                d.amount AS depositAmount,
                d.status AS depositStatus,
                d.createdAt AS depositCreatedAt,
                CONCAT(u.firstName, ' ', u.lastName) AS username,
                u.email AS userEmail,
                u.phone AS userPhone
            FROM subscriptions s
            JOIN subscription_plans sp ON s.planId = sp.id
            JOIN users u ON s.userId = u.id
            LEFT JOIN deposits d ON s.depositId = d.id
            WHERE s.userId = ?;
        `;

        // Execute the query with the userId parameter
        const results = await query(selectQuery, [userId]);

        return results; // Return the list of subscription details for the user
    } catch (error) {
        console.error('Error fetching subscription details for user:', error);
        throw error;
    }
};


cryptoInvestmentService.getAllSubscriptionDetails = async () => {
    try {
        const selectQuery = `
            SELECT 
                s.id AS subscriptionId,
                s.walletId,
                s.planId,
                s.userId,
                s.startDate,
                s.endDate,
                s.earnings,
                s.currencyId,
                s.reinvest,
                s.depositId,
                s.dailyInterestGain,
                s.dailyTotalAmount,
                s.totalInterest,
                s.totalAmount,
                sp.rate AS planRate,
                sp.duration AS planDuration,
                sp.minInvest AS planMinInvest,
                sp.maxInvest AS planMaxInvest,
                sp.avgMonthly AS planAvgMonthly,
                sp.label AS planLabel,
                d.amount AS depositAmount,
                d.status AS depositStatus,
                d.createdAt AS depositCreatedAt,
                CONCAT(u.firstName, ' ', u.lastName) AS username,
                u.email AS userEmail,
                u.phone AS userPhone
            FROM subscriptions s
            JOIN subscription_plans sp ON s.planId = sp.id
            JOIN users u ON s.userId = u.id
            LEFT JOIN deposits d ON s.depositId = d.id
        `;

        const results = await query(selectQuery);

        return results; // Return the list of subscription details
    } catch (error) {
        console.error('Error fetching subscription details:', error);
        throw error;
    }
};


// Mock function to simulate checking deposit status
// async function checkDepositStatus(depositId) {
//     // This should actually check the deposit status from the database or another service
//     // For now, let's assume it's accepted immediately for demonstration
//     const result = await query(`SELECT status FROM deposits WHERE id = ?`, [depositId]);
//     return result[0] && result[0].status === 'accepted';
// }


module.exports = cryptoInvestmentService;


// cryptoInvestmentService.depositToSubscription = async (walletId, planId, currencyId, depositAmount, proofOfPayment) => {
//     try {
//         // Fetch the subscription plan details
//         const plan = await getPlanDetails(planId);
//         if (!plan) throw new Error("Invalid subscription plan selected");

//         // Validate deposit amount
//         if (depositAmount < plan.minInvest || depositAmount > plan.maxInvest) {
//             throw new Error(`Deposit amount must be between ${plan.minInvest} and ${plan.maxInvest}`);
//         }

//         // Calculate earnings
//         const earnings = calculateEarnings(plan.rate, depositAmount, plan.duration);

//         // Update or create subscription
//         const subscriptionId = await getOrCreateSubscription(walletId, planId, currencyId, depositAmount, earnings, parseInt(plan.duration));

//         // Insert deposit record
//         await query(
//             `INSERT INTO deposits (walletId, amount, currencyId, status, proofOfPayment)
//             VALUES (?, ?, ?, 'accepted', ?)`,
//             [walletId, depositAmount, currencyId, proofOfPayment]
//         );

//         // Update wallet balance
//         await query("UPDATE wallets SET balance = balance + ? WHERE id = ?", [depositAmount, walletId]);

//         return {
//             success: true,
//             message: `Deposit successful and tied to subscription plan ${plan.label}. Your potential earnings are ${earnings}`,
//             subscriptionId,
//             earnings,
//         };
//     } catch (error) {
//         console.error(error);
//         return {
//             success: false,
//             message: error.message,
//         };
//     }
// };



// module.exports = cryptoInvestmentService;






















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

// // Function to create database tables if they don't exist
// async function createTables() {
//     const createWalletsTable = `
//         CREATE TABLE IF NOT EXISTS wallets (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             userId INT NOT NULL,
//             balance DECIMAL(15, 2) DEFAULT 0.00,
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (userId) REFERENCES users(id)
//         );
//     `;

//     const createTransactionsTable = `
//         CREATE TABLE IF NOT EXISTS transactions (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             walletId INT NOT NULL,
//             type ENUM('deposit', 'withdrawal', 'earning') NOT NULL,
//             amount DECIMAL(15, 2) NOT NULL,
//             status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (walletId) REFERENCES wallets(id)
//         );
//     `;

//     const createPayoutsTable = `
//         CREATE TABLE IF NOT EXISTS payouts (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             walletId INT NOT NULL,
//             amount DECIMAL(15, 2) NOT NULL,
//             status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (walletId) REFERENCES wallets(id)
//         );
//     `;

//     const createSubscriptionsTable = `
//         CREATE TABLE IF NOT EXISTS subscriptions (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             walletId INT,
//             planId INT,
//             startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             endDate TIMESTAMP NULL,
//             earnings DECIMAL(15, 2) DEFAULT 0.00,
//             reinvest BOOLEAN DEFAULT FALSE,
//             FOREIGN KEY (walletId) REFERENCES wallets(id),
//             FOREIGN KEY (planId) REFERENCES subscription_plans(id)
//         );
//     `;

//     try {
//         await query(createWalletsTable);
//         await query(createTransactionsTable);
//         await query(createPayoutsTable);
//         await query(createSubscriptionsTable);
//         console.log('All tables created successfully');
//     } catch (error) {
//         console.error('Error creating tables:', error);
//         throw error;
//     }
// }

// // Call the createTables function at the start of your application
// createTables();

// const cryptoInvestmentService = {};

// // Create a new wallet for a user
// cryptoInvestmentService.createWallet = async (userId) => {
//     try {
//         const insertQuery = 'INSERT INTO wallets (userId) VALUES (?)';
//         const result = await query(insertQuery, [userId]);

//         if (!result.insertId) {
//             throw new Error('Failed to create wallet');
//         }

//         return { message: 'Wallet created successfully', walletId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Deposit funds into the wallet
// cryptoInvestmentService.deposit = async (walletId, amount) => {
//     try {
//         const insertTransactionQuery = `
//             INSERT INTO transactions (walletId, type, amount, status)
//             VALUES (?, 'deposit', ?, 'pending')
//         `;
//         const result = await query(insertTransactionQuery, [walletId, amount]);

//         if (!result.insertId) {
//             throw new Error('Failed to initiate deposit');
//         }

//         return { message: 'Deposit initiated successfully', transactionId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Approve or reject deposit (Admin action)
// cryptoInvestmentService.updateDepositStatus = async (transactionId, status) => {
//     try {
//         const selectTransactionQuery = 'SELECT walletId, amount FROM transactions WHERE id = ? AND type = ? AND status = ?';
//         const transaction = await query(selectTransactionQuery, [transactionId, 'deposit', 'pending']);

//         if (transaction.length === 0) {
//             throw new Error('Deposit not found or already processed');
//         }

//         if (status === 'accepted') {
//             const updateWalletBalanceQuery = 'UPDATE wallets SET balance = balance + ? WHERE id = ?';
//             await query(updateWalletBalanceQuery, [transaction[0].amount, transaction[0].walletId]);
//         }

//         const updateTransactionStatusQuery = 'UPDATE transactions SET status = ? WHERE id = ?';
//         await query(updateTransactionStatusQuery, [status, transactionId]);

//         return { message: `Deposit ${status} successfully` };
//     } catch (error) {
//         throw error;
//     }
// };

// // Request a withdrawal
// cryptoInvestmentService.requestWithdrawal = async (walletId, amount) => {
//     try {
//         const selectBalanceQuery = 'SELECT balance FROM wallets WHERE id = ?';
//         const wallet = await query(selectBalanceQuery, [walletId]);

//         if (wallet.length === 0 || wallet[0].balance < amount) {
//             throw new Error('Insufficient balance or wallet not found');
//         }

//         const insertTransactionQuery = `
//             INSERT INTO transactions (walletId, type, amount, status)
//             VALUES (?, 'withdrawal', ?, 'pending')
//         `;
//         const result = await query(insertTransactionQuery, [walletId, amount]);

//         if (!result.insertId) {
//             throw new Error('Failed to request withdrawal');
//         }

//         return { message: 'Withdrawal requested successfully', transactionId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Approve or reject withdrawal (Admin action)
// cryptoInvestmentService.updateWithdrawalStatus = async (transactionId, status) => {
//     try {
//         const selectTransactionQuery = 'SELECT walletId, amount FROM transactions WHERE id = ? AND type = ? AND status = ?';
//         const transaction = await query(selectTransactionQuery, [transactionId, 'withdrawal', 'pending']);

//         if (transaction.length === 0) {
//             throw new Error('Withdrawal not found or already processed');
//         }

//         if (status === 'accepted') {
//             const updateWalletBalanceQuery = 'UPDATE wallets SET balance = balance - ? WHERE id = ?';
//             await query(updateWalletBalanceQuery, [transaction[0].amount, transaction[0].walletId]);
//         }

//         const updateTransactionStatusQuery = 'UPDATE transactions SET status = ? WHERE id = ?';
//         await query(updateTransactionStatusQuery, [status, transactionId]);

//         return { message: `Withdrawal ${status} successfully` };
//     } catch (error) {
//         throw error;
//     }
// };

// // Add earnings to a subscription
// cryptoInvestmentService.addEarnings = async (subscriptionId, amount) => {
//     try {
//         const updateEarningsQuery = `
//             UPDATE subscriptions SET earnings = earnings + ? WHERE id = ?
//         `;
//         await query(updateEarningsQuery, [amount, subscriptionId]);

//         const insertTransactionQuery = `
//             INSERT INTO transactions (walletId, type, amount, status)
//             SELECT walletId, 'earning', ?, 'accepted' FROM subscriptions WHERE id = ?
//         `;
//         await query(insertTransactionQuery, [amount, subscriptionId]);

//         return { message: 'Earnings added successfully' };
//     } catch (error) {
//         throw error;
//     }
// };

// // Create a new subscription plan for a wallet
// cryptoInvestmentService.createSubscription = async (walletId, planId, durationMonths, reinvest) => {
//     try {
//         const endDate = new Date();
//         endDate.setMonth(endDate.getMonth() + durationMonths);

//         const insertSubscriptionQuery = `
//             INSERT INTO subscriptions (walletId, planId, endDate, reinvest)
//             VALUES (?, ?, ?, ?)
//         `;
//         const result = await query(insertSubscriptionQuery, [walletId, planId, endDate, reinvest]);

//         if (!result.insertId) {
//             throw new Error('Failed to create subscription');
//         }

//         return { message: 'Subscription created successfully', subscriptionId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Handle subscription expiration
// cryptoInvestmentService.handleSubscriptionExpiration = async (subscriptionId) => {
//     try {
//         const selectSubscriptionQuery = `
//             SELECT id, walletId, earnings, reinvest FROM subscriptions WHERE id = ? AND endDate <= NOW()
//         `;
//         const subscription = await query(selectSubscriptionQuery, [subscriptionId]);

//         if (subscription.length === 0) {
//             throw new Error('Subscription not found or not expired');
//         }

//         if (subscription[0].reinvest) {
//             await cryptoInvestmentService.createSubscription(subscription[0].walletId, subscription[0].planId, 12, true); // Assuming 12 months for reinvestment
//         } else {
//             await cryptoInvestmentService.deposit(subscription[0].walletId, subscription[0].earnings);
//         }

//         return { message: 'Subscription handled successfully' };
//     } catch (error) {
//         throw error;
//     }
// };

// // Request a payout
// cryptoInvestmentService.requestPayout = async (walletId, amount) => {
//     try {
//         const selectBalanceQuery = 'SELECT balance FROM wallets WHERE id = ?';
//         const wallet = await query(selectBalanceQuery, [walletId]);

//         if (wallet.length === 0 || wallet[0].balance < amount) {
//             throw new Error('Insufficient balance or wallet not found');
//         }

//         const insertPayoutQuery = `
//             INSERT INTO payouts (walletId, amount, status)
//             VALUES (?, ?, 'pending')
//         `;
//         const result = await query(insertPayoutQuery, [walletId, amount]);

//         if (!result.insertId) {
//             throw new Error('Failed to request payout');
//         }

//         return { message: 'Payout requested successfully', payoutId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Approve or reject payout (Admin action)
// cryptoInvestmentService.updatePayoutStatus = async (payoutId, status) => {
//     try {
//         const selectPayoutQuery = 'SELECT walletId, amount FROM payouts WHERE id = ? AND status = ?';
//         const payout = await query(selectPayoutQuery, [payoutId, 'pending']);

//         if (payout.length === 0) {
//             throw new Error('Payout not found or already processed');
//         }

//         if (status === 'accepted') {
//             const updateWalletBalanceQuery = 'UPDATE wallets SET balance = balance - ? WHERE id = ?';
//             await query(updateWalletBalanceQuery, [payout[0].amount, payout[0].walletId]);
//         }

//         const updatePayoutStatusQuery = 'UPDATE payouts SET status = ? WHERE id = ?';
//         await query(updatePayoutStatusQuery, [status, payoutId]);

//         return { message: `Payout ${status} successfully` };
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = cryptoInvestmentService;



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

// // Function to create database tables if they don't exist
// async function createTables() {
//     const createWalletsTable = `
//         CREATE TABLE IF NOT EXISTS wallets (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             userId INT NOT NULL,
//             balance DECIMAL(15, 2) DEFAULT 0.00,
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (userId) REFERENCES users(id)
//         );
//     `;

//     const createTransactionsTable = `
//         CREATE TABLE IF NOT EXISTS transactions (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             walletId INT NOT NULL,
//             type ENUM('deposit', 'withdrawal', 'earning') NOT NULL,
//             amount DECIMAL(15, 2) NOT NULL,
//             status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (walletId) REFERENCES wallets(id)
//         );
//     `;

//     const createPayoutsTable = `
//         CREATE TABLE IF NOT EXISTS payouts (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             walletId INT NOT NULL,
//             amount DECIMAL(15, 2) NOT NULL,
//             approved BOOLEAN DEFAULT FALSE,
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//             FOREIGN KEY (walletId) REFERENCES wallets(id)
//         );
//     `;

//     const createSubscriptionsTable = `
//         CREATE TABLE IF NOT EXISTS subscriptions (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             walletId INT,
//             planId INT,
//             startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             endDate TIMESTAMP NULL,
//             earnings DECIMAL(15, 2) DEFAULT 0.00,
//             reinvest BOOLEAN DEFAULT FALSE,
//             FOREIGN KEY (walletId) REFERENCES wallets(id),
//             FOREIGN KEY (planId) REFERENCES subscription_plans(id)
//         );
//     `;

//     try {
//         await query(createWalletsTable);
//         await query(createTransactionsTable);
//         await query(createPayoutsTable);
//         await query(createSubscriptionsTable);
//         console.log('All tables created successfully');
//     } catch (error) {
//         console.error('Error creating tables:', error);
//         throw error;
//     }
// }

// // Call the createTables function at the start of your application
// createTables();

// const cryptoInvestmentService = {};

// // Create a new wallet for a user
// cryptoInvestmentService.createWallet = async (userId) => {
//     try {
//         const insertQuery = 'INSERT INTO wallets (userId) VALUES (?)';
//         const result = await query(insertQuery, [userId]);

//         if (!result.insertId) {
//             throw new Error('Failed to create wallet');
//         }

//         return { message: 'Wallet created successfully', walletId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Deposit funds into the wallet
// cryptoInvestmentService.deposit = async (walletId, amount) => {
//     try {
//         const insertTransactionQuery = `
//             INSERT INTO transactions (walletId, type, amount, status)
//             VALUES (?, 'deposit', ?, 'pending')
//         `;
//         const result = await query(insertTransactionQuery, [walletId, amount]);

//         if (!result.insertId) {
//             throw new Error('Failed to initiate deposit');
//         }

//         return { message: 'Deposit initiated successfully', transactionId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Approve deposit (Admin action)
// cryptoInvestmentService.approveDeposit = async (transactionId) => {
//     try {
//         const selectTransactionQuery = 'SELECT walletId, amount FROM transactions WHERE id = ? AND type = ? AND status = ?';
//         const transaction = await query(selectTransactionQuery, [transactionId, 'deposit', 'pending']);

//         if (transaction.length === 0) {
//             throw new Error('Deposit not found or already approved/rejected');
//         }

//         const updateWalletBalanceQuery = 'UPDATE wallets SET balance = balance + ? WHERE id = ?';
//         await query(updateWalletBalanceQuery, [transaction[0].amount, transaction[0].walletId]);

//         const updateTransactionStatusQuery = 'UPDATE transactions SET status = ? WHERE id = ?';
//         await query(updateTransactionStatusQuery, ['approved', transactionId]);

//         return { message: 'Deposit approved successfully' };
//     } catch (error) {
//         throw error;
//     }
// };

// // Request a withdrawal
// cryptoInvestmentService.requestWithdrawal = async (walletId, amount) => {
//     try {
//         const selectBalanceQuery = 'SELECT balance FROM wallets WHERE id = ?';
//         const wallet = await query(selectBalanceQuery, [walletId]);

//         if (wallet.length === 0 || wallet[0].balance < amount) {
//             throw new Error('Insufficient balance or wallet not found');
//         }

//         const insertTransactionQuery = `
//             INSERT INTO transactions (walletId, type, amount, status)
//             VALUES (?, 'withdrawal', ?, 'pending')
//         `;
//         const result = await query(insertTransactionQuery, [walletId, amount]);

//         if (!result.insertId) {
//             throw new Error('Failed to request withdrawal');
//         }

//         return { message: 'Withdrawal requested successfully', transactionId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Approve withdrawal (Admin action)
// cryptoInvestmentService.approveWithdrawal = async (transactionId) => {
//     try {
//         const selectTransactionQuery = 'SELECT walletId, amount FROM transactions WHERE id = ? AND type = ? AND status = ?';
//         const transaction = await query(selectTransactionQuery, [transactionId, 'withdrawal', 'pending']);

//         if (transaction.length === 0) {
//             throw new Error('Withdrawal not found or already approved/rejected');
//         }

//         const updateWalletBalanceQuery = 'UPDATE wallets SET balance = balance - ? WHERE id = ?';
//         await query(updateWalletBalanceQuery, [transaction[0].amount, transaction[0].walletId]);

//         const updateTransactionStatusQuery = 'UPDATE transactions SET status = ? WHERE id = ?';
//         await query(updateTransactionStatusQuery, ['approved', transactionId]);

//         return { message: 'Withdrawal approved successfully' };
//     } catch (error) {
//         throw error;
//     }
// };

// // Add earnings to a subscription
// cryptoInvestmentService.addEarnings = async (subscriptionId, amount) => {
//     try {
//         const updateEarningsQuery = `
//             UPDATE subscriptions SET earnings = earnings + ? WHERE id = ?
//         `;
//         await query(updateEarningsQuery, [amount, subscriptionId]);

//         const insertTransactionQuery = `
//             INSERT INTO transactions (walletId, type, amount, status)
//             SELECT walletId, 'earning', ?, 'approved' FROM subscriptions WHERE id = ?
//         `;
//         await query(insertTransactionQuery, [amount, subscriptionId]);

//         return { message: 'Earnings added successfully' };
//     } catch (error) {
//         throw error;
//     }
// };

// // Create a new subscription plan for a wallet
// cryptoInvestmentService.createSubscription = async (walletId, planId, durationMonths, reinvest) => {
//     try {
//         const endDate = new Date();
//         endDate.setMonth(endDate.getMonth() + durationMonths);

//         const insertSubscriptionQuery = `
//             INSERT INTO subscriptions (walletId, planId, endDate, reinvest)
//             VALUES (?, ?, ?, ?)
//         `;
//         const result = await query(insertSubscriptionQuery, [walletId, planId, endDate, reinvest]);

//         if (!result.insertId) {
//             throw new Error('Failed to create subscription');
//         }

//         return { message: 'Subscription created successfully', subscriptionId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Handle subscription expiration
// cryptoInvestmentService.handleSubscriptionExpiration = async (subscriptionId) => {
//     try {
//         const selectSubscriptionQuery = `
//             SELECT walletId, earnings, reinvest FROM subscriptions WHERE id = ?
//         `;
//         const subscription = await query(selectSubscriptionQuery, [subscriptionId]);

//         if (subscription.length === 0) {
//             throw new Error('Subscription not found');
//         }

//         if (subscription[0].reinvest) {
//             await cryptoInvestmentService.createSubscription(subscription[0].walletId, subscription[0].planId, 12, true);
//             return { message: 'Subscription renewed and earnings reinvested successfully' };
//         } else {
//             await cryptoInvestmentService.requestWithdrawal(subscription[0].walletId, subscription[0].earnings);
//             return { message: 'Subscription expired and earnings withdrawn' };
//         }
//     } catch (error) {
//         throw error;
//     }
// };

// // Request a payout
// cryptoInvestmentService.requestPayout = async (walletId, amount) => {
//     try {
//         const selectBalanceQuery = 'SELECT balance FROM wallets WHERE id = ?';
//         const wallet = await query(selectBalanceQuery, [walletId]);

//         if (wallet.length === 0 || wallet[0].balance < amount) {
//             throw new Error('Insufficient balance or wallet not found');
//         }

//         const insertPayoutQuery = `
//             INSERT INTO payouts (walletId, amount, approved)
//             VALUES (?, ?, false)
//         `;
//         const result = await query(insertPayoutQuery, [walletId, amount]);

//         if (!result.insertId) {
//             throw new Error('Failed to request payout');
//         }

//         return { message: 'Payout requested successfully', payoutId: result.insertId };
//     } catch (error) {
//         throw error;
//     }
// };

// // Approve a payout (Admin action)
// cryptoInvestmentService.approvePayout = async (payoutId) => {
//     try {
//         const selectPayoutQuery = 'SELECT walletId, amount FROM payouts WHERE id = ? AND approved = false';
//         const payout = await query(selectPayoutQuery, [payoutId]);

//         if (payout.length === 0) {
//             throw new Error('Payout not found or already approved');
//         }

//         const updateWalletBalanceQuery = 'UPDATE wallets SET balance = balance - ? WHERE id = ?';
//         await query(updateWalletBalanceQuery, [payout[0].amount, payout[0].walletId]);

//         const updatePayoutStatusQuery = 'UPDATE payouts SET approved = true WHERE id = ?';
//         await query(updatePayoutStatusQuery, [payoutId]);

//         return { message: 'Payout approved successfully' };
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = cryptoInvestmentService;
