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

const createSubscriptionsTable = `
    CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        walletId INT,
        planId INT,
        startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endDate TIMESTAMP NULL,
        earnings DECIMAL(15, 2) DEFAULT 0.00,
        currencyId INT NOT NULL,
        reinvest BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (walletId) REFERENCES wallets(id),
        FOREIGN KEY (planId) REFERENCES subscription_plans(id),
        FOREIGN KEY (currencyId) REFERENCES currencies(id)
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
        await query(createSubscriptionsTable);
        await query(createDepositsTable);
        console.log('All tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}

// Call the function to create tables
createTables();

// Create a new currency
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
cryptoInvestmentService.creditWallet = async (walletId, amount) => {
    try {
        const updateQuery = 'UPDATE wallets SET balance = balance + ? WHERE id = ?';
        const result = await query(updateQuery, [amount, walletId]);

        if (result.affectedRows === 0) {
            throw new Error('Wallet not found');
        }

        return { message: 'Wallet credited successfully' };
    } catch (error) {
        throw error;
    }
};

// Request a deposit with proof of payment
cryptoInvestmentService.requestDeposit = async (walletId, amount, currencyId, proofOfPayment) => {
    try {
        const insertQuery = 'INSERT INTO deposits (walletId, amount, currencyId, proofOfPayment) VALUES (?, ?, ?, ?)';
        const result = await query(insertQuery, [walletId, amount, currencyId, proofOfPayment]);

        if (!result.insertId) {
            throw new Error('Failed to request deposit');
        }

        return { message: 'Deposit request submitted successfully', depositId: result.insertId };
    } catch (error) {
        throw error;
    }
};

// Admin function to approve or reject a deposit request
cryptoInvestmentService.updateDepositStatus = async (depositId, status) => {
    try {
        const validStatuses = ['pending', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }

        const updateQuery = 'UPDATE deposits SET status = ? WHERE id = ?';
        const result = await query(updateQuery, [status, depositId]);

        if (result.affectedRows === 0) {
            throw new Error('Deposit request not found');
        }

        return { message: 'Deposit status updated successfully' };
    } catch (error) {
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


module.exports = cryptoInvestmentService;






















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
