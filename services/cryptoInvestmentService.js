// Create a new currency
const mysql = require('mysql');
const dotenv = require('dotenv');
const crypto = require('crypto');

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

// const createWalletsTable = `
//     CREATE TABLE IF NOT EXISTS wallets (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         userId INT NOT NULL,
//         walletAddress VARCHAR(255) UNIQUE NOT NULL,
//         balance DECIMAL(15, 2) DEFAULT 0.00,
//         currencyId INT NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (userId) REFERENCES users(id),
//         FOREIGN KEY (currencyId) REFERENCES currencies(id)
//     );
// `;


const createWalletsTable = `
CREATE TABLE IF NOT EXISTS wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    walletAddress VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    depositId INT DEFAULT NULL,
    depositAmount DECIMAL(15, 2) DEFAULT 0.00,
    currencyId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (currencyId) REFERENCES currencies(id),
    FOREIGN KEY (depositId) REFERENCES deposits(id) -- Make sure deposits table is created first
);
`;




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


const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        walletId INT NOT NULL,
        type ENUM('deposit', 'withdrawal', 'earning') NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        currencyId INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userId INT DEFAULT NULL,
        planId INT DEFAULT NULL,
        depositId INT DEFAULT NULL,
        FOREIGN KEY (walletId) REFERENCES wallets(id),
        FOREIGN KEY (currencyId) REFERENCES currencies(id),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (planId) REFERENCES subscription_plans(id),
        FOREIGN KEY (depositId) REFERENCES deposits(id)
    );
`;


const createPayoutsTable = `
    CREATE TABLE payouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    walletId INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currencyId INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    proofPath VARCHAR(255) NULL,
    requestedBy VARCHAR(255) NULL,
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
        label ENUM('basic', 'regular', 'popular', 'bronze', 'silver', 'gold',  'platinum', 'diamond', 'premium', 'elite', 'ultimate') NOT NULL DEFAULT 'basic',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;



const createDepositsTable = `
    CREATE TABLE IF NOT EXISTS deposits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planId INT NOT NULL,
    userId INT NOT NULL,
    walletId INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currencyId INT NOT NULL,
    proofOfPayment VARCHAR(255) DEFAULT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (planId) REFERENCES subscription_plans(id),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (walletId) REFERENCES wallets(id),
    FOREIGN KEY (currencyId) REFERENCES currencies(id)
);

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
// Function to create tables
async function createTables() {
    try {
        await query(createCurrenciesTable);
        await query(createSubscriptionPlansTableQuery);
        await query(createWalletsTable);
        await query(createSubscriptionsTable);
        await query(createDepositsTable);
        await query(createTransactionsTable);
        // await query(createPayoutsTable);
        console.log('All tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}


createTables()
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


// Helper function to generate a unique wallet address
async function generateUniqueWalletAddress() {
    let walletAddress;
    let addressExists = true;

    try {
        do {
            // Generate a random wallet address
            walletAddress = crypto.randomBytes(16).toString('hex');

            // Check if the generated address already exists in the database
            const existingAddress = await query('SELECT id FROM wallets WHERE walletAddress = ?', [walletAddress]);

            if (existingAddress.length === 0) {
                addressExists = false;
            }
        } while (addressExists);

        return {
            message: 'Unique wallet address generated successfully',
            walletAddress,
        };
    } catch (error) {
        throw new Error(`Error generating wallet address: ${error.message}`);
    }
}



cryptoInvestmentService.createWallet = async (userId, currencyId) => {
    try {
        // Set initial balance to 0.00
        const balance = 0.00;

        // Generate a unique wallet address
        const { walletAddress, message: generationMessage } = await generateUniqueWalletAddress();

        // Insert the new wallet into the database
        const queryStr = `
            INSERT INTO wallets (userId, walletAddress, balance, currencyId)
            VALUES (?, ?, ?, ?)
        `;

        const result = await query(queryStr, [userId, walletAddress, balance, currencyId]);

        return {
            success: true,
            message: 'Wallet created successfully',
            walletId: result.insertId,
            walletAddress,
            additionalInfo: generationMessage, // Include the generation message
        };
    } catch (error) {
        return {
            success: false,
            message: `Error creating wallet: ${error.message}`,
        };
    }
};


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

        // Step 5: Update wallet with the credited amount, depositId, and depositAmount
        const updateQuery = `
            UPDATE wallets 
            SET balance = balance + ?, 
                depositId = ?, 
                depositAmount = ? 
            WHERE id = ?
        `;
        const updateResult = await query(updateQuery, [amount, depositId, depositAmount, walletId]);

        if (updateResult.affectedRows === 0) {
            throw new Error('Wallet not found.');
        }

        // Step 6: Fetch the new balance
        const newBalanceQuery = 'SELECT balance FROM wallets WHERE id = ?';
        const balanceResult = await query(newBalanceQuery, [walletId]);

        if (balanceResult.length === 0) {
            throw new Error('Failed to fetch the new wallet balance.');
        }

        const newBalance = balanceResult[0].balance;

        // Step 7: Return detailed response including the updated balance, depositId, and depositAmount
        return {
            success: true,
            message: 'Wallet credited successfully.',
            walletId: walletId,
            newBalance: newBalance.toFixed(2),
            creditedAmount: amount.toFixed(2),
            depositId: depositId,
            depositAmount: depositAmount.toFixed(2),
            allowableAmount: allowableAmount.toFixed(2)
        };
    } catch (error) {
        return {
            success: false,
            message: `Error crediting wallet: ${error.message}`
        };
    }
};


cryptoInvestmentService.userWallet = async (currencyId) => {
    try {
        // SQL query to get wallet details along with the corresponding currency details
        const queryStr = `
            SELECT 
                wallets.id AS walletId,
                wallets.userId,
                wallets.balance,
                wallets.currencyId,
                wallets.createdAt,
                wallets.updatedAt,
                currencies.code AS currencyCode,
                currencies.symbol AS currencySymbol,
                currencies.name AS currencyName,
                CONCAT(users.firstName, ' ', users.lastName) AS cardHolderName
            FROM 
                wallets
            INNER JOIN 
                currencies ON wallets.currencyId = currencies.id
            INNER JOIN 
                users ON wallets.userId = users.id
            WHERE 
                wallets.currencyId = ?
        `;

        // Execute the query with the provided currencyId
        const result = await query(queryStr, [currencyId]);

        // Check if any results were returned
        if (result.length === 0) {
            return { message: 'No wallets found for the provided currency ID' };
        }

        // Return the wallet, currency details, and cardholder's name
        return {
            message: 'Wallet details retrieved successfully',
            data: result,
        };
    } catch (error) {
        // Handle errors gracefully
        throw new Error(`Error retrieving wallet details: ${error.message}`);
    }
};




cryptoInvestmentService.getTransactionHistory = async (walletId) => {
    try {
        const queryStr = `
            SELECT 
                transactions.id AS transactionId,
                transactions.type,
                transactions.amount,
                transactions.status,
                transactions.createdAt,
                currencies.code AS currencyCode,
                currencies.symbol AS currencySymbol
            FROM 
                transactions
            INNER JOIN 
                currencies ON transactions.currencyId = currencies.id
            WHERE 
                transactions.walletId = ?
            ORDER BY 
                transactions.createdAt DESC
        `;
        const result = await query(queryStr, [walletId]);

        return {
            message: 'Transaction history retrieved successfully',
            data: result,
            success: true,
        };
    } catch (error) {
        return {
            message: `Error retrieving transaction history: ${error.message}`,
            success: false,
        };
    }
};


cryptoInvestmentService.getUserWalletsAndSubscriptions = async (userId) => {
    try {
        // Query to get user, wallet, currency, subscription, and subscription plan details
        const queryStr = `
            SELECT 
                users.id AS userId,
                users.firstName,
                users.lastName,
                users.email,
                users.phone,
                wallets.id AS walletId,
                wallets.walletAddress,
                wallets.balance,
                currencies.id AS currencyId,
                currencies.name AS currencyName,
                currencies.symbol,
                subscriptions.id AS subscriptionId,
                subscriptions.startDate AS subscriptionStartDate,
                subscriptions.endDate AS subscriptionEndDate,
                subscription_plans.id AS planId,
                subscription_plans.name AS planName,
                subscription_plans.price AS planPrice,
                subscription_plans.duration AS planDuration
            FROM users
            LEFT JOIN wallets ON wallets.userId = users.id
            LEFT JOIN currencies ON wallets.currencyId = currencies.id
            LEFT JOIN subscriptions ON subscriptions.userId = users.id
            LEFT JOIN subscription_plans ON subscriptions.planId = subscription_plans.id
            WHERE users.id = ?
        `;

        const results = await query(queryStr, [userId]);

        if (results.length === 0) {
            return {
                success: false,
                message: 'No user, wallet, or subscription details found for the given user ID'
            };
        }

        // Assuming a user has only one wallet and one active subscription; handle multiple wallets and subscriptions if needed
        const userDetails = results[0];

        // Structure the response data
        const user = {
            id: userDetails.userId,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phone: userDetails.phone
        };

        const wallet = {
            walletId: userDetails.walletId,
            walletAddress: userDetails.walletAddress,
            balance: userDetails.balance
        };

        const currency = {
            currencyId: userDetails.currencyId,
            currencyName: userDetails.currencyName,
            symbol: userDetails.symbol
        };

        const subscription = {
            subscriptionId: userDetails.subscriptionId,
            startDate: userDetails.subscriptionStartDate,
            endDate: userDetails.subscriptionEndDate
        };

        const subscriptionPlan = {
            planId: userDetails.planId,
            planName: userDetails.planName,
            planPrice: userDetails.planPrice,
            planDuration: userDetails.planDuration
        };

        return {
            success: true,
            message: 'User, wallet, and subscription details retrieved successfully',
            user,
            wallet,
            currency,
            subscription,
            subscriptionPlan
        };
    } catch (error) {
        console.error('Error fetching user wallet and subscription details:', error);
        throw new Error('Error fetching user wallet and subscription details');
    }
};


// Service to fetch user, wallet, and currency details by User ID
cryptoInvestmentService.getUserWalletDetails = async(userId)=> {
    try {
        const queryStr = `
            SELECT 
                users.id AS userId,
                users.firstName,
                users.lastName,
                users.email,
                users.phone,
                wallets.id AS walletId,
                wallets.walletAddress,
                wallets.balance,
                currencies.id AS currencyId,
                currencies.name AS currencyName,
                currencies.symbol
            FROM users
            LEFT JOIN wallets ON wallets.userId = users.id
            LEFT JOIN currencies ON wallets.currencyId = currencies.id
            WHERE users.id = ?
        `;

        const results = await query(queryStr, [userId]);

        if (results.length === 0) {
            return {
                success: false,
                message: 'No user or wallet found for the given user ID'
            };
        }

        const userWalletDetails = results[0];

        return {
            success: true,
            message: 'User and wallet details retrieved successfully',
            user: {
                id: userWalletDetails.userId,
                firstName: userWalletDetails.firstName,
                lastName: userWalletDetails.lastName,
                email: userWalletDetails.email,
                phone: userWalletDetails.phone
            },
            wallet: {
                walletId: userWalletDetails.walletId,
                walletAddress: userWalletDetails.walletAddress,
                balance: userWalletDetails.balance,
                currency: {
                    currencyId: userWalletDetails.currencyId,
                    currencyName: userWalletDetails.currencyName,
                    symbol: userWalletDetails.symbol
                }
            }
        };
    } catch (error) {
        console.error('Error retrieving user wallet details:', error);
        return {
            success: false,
            message: `Failed to retrieve user wallet details: ${error.message}`
        };
    }
}



cryptoInvestmentService.getUserWalletAndSubscriptionPlanDetails = async (userId) => {
    try {
        // SQL query to fetch user details, wallets, subscriptions, deposits, and plan details
        const queryStr = `
            SELECT 
                u.id AS userId,
                u.firstName,
                u.lastName,
                u.email,
                u.phone,
                w.id AS walletId,
                w.walletAddress,
                w.balance,
                w.depositId AS walletDepositId,
                w.depositAmount AS walletDepositAmount,
                s.currencyId AS subscriptionCurrencyId,
                c.name AS subscriptionCurrencyName,
                c.symbol AS subscriptionCurrencySymbol,
                s.planId AS subscriptionPlanId,
                sp.label AS subscriptionPlanName,
                sp.duration AS subscriptionDuration,
                sp.minInvest AS subscriptionMinInvest,
                sp.maxInvest AS subscriptionMaxInvest,
                sp.rate AS subscriptionRate,
                s.startDate AS subscriptionStartDate,
                s.endDate AS subscriptionEndDate,
                s.totalAmount AS subscriptionTotalAmount,
                s.dailyInterestGain,
                s.totalInterest,
                d.id AS depositId,
                d.amount AS depositAmount,
                d.proofOfPayment AS depositProofOfPayment,
                d.status AS depositStatus
            FROM 
                users u
            LEFT JOIN 
                wallets w ON u.id = w.userId
            LEFT JOIN 
                subscriptions s ON w.id = s.walletId
            LEFT JOIN 
                subscription_plans sp ON s.planId = sp.id
            LEFT JOIN 
                deposits d ON s.depositId = d.id
            LEFT JOIN 
                currencies c ON s.currencyId = c.id  -- Join with currencies table for subscription currency details
            WHERE 
                u.id = ?;
        `;

        const results = await query(queryStr, [userId]);

        // Check if any results were returned
        if (results.length === 0) {
            return {
                success: false,
                message: 'No details found for the given user ID'
            };
        }

        // Initialize result structures
        const user = {
            id: results[0].userId,
            firstName: results[0].firstName,
            lastName: results[0].lastName,
            email: results[0].email,
            phone: results[0].phone
        };

        const wallets = {};
        const subscriptions = {};
        const deposits = {};

        results.forEach(row => {
            // Process wallet data
            if (row.walletId) {
                const planKey = row.subscriptionPlanName || 'No Plan';
                if (!wallets[planKey]) {
                    wallets[planKey] = [];
                }
                wallets[planKey].push({
                    walletId: row.walletId,
                    walletAddress: row.walletAddress,
                    balance: row.balance,
                    deposit: {
                        depositId: row.walletDepositId || null,
                        depositAmount: row.walletDepositAmount || 0.00
                    }
                });
            }

            // Process subscription data
            if (row.subscriptionPlanId) {
                const planKey = row.subscriptionPlanName || 'No Plan';
                if (!subscriptions[planKey]) {
                    subscriptions[planKey] = [];
                }
                subscriptions[planKey].push({
                    planId: row.subscriptionPlanId,
                    planName: row.subscriptionPlanName,
                    duration: row.subscriptionDuration,
                    minInvest: row.subscriptionMinInvest,
                    maxInvest: row.subscriptionMaxInvest,
                    rate: row.subscriptionRate,
                    startDate: row.subscriptionStartDate,
                    endDate: row.subscriptionEndDate,
                    totalAmount: row.subscriptionTotalAmount,
                    dailyInterestGain: row.dailyInterestGain,
                    totalInterest: row.totalInterest,
                    deposit: {
                        id: row.depositId || null,
                        amount: row.depositAmount || 0.00,
                        proofOfPayment: row.depositProofOfPayment || null,
                        status: row.depositStatus || 'pending'
                    },
                    currency: {
                        currencyName: row.subscriptionCurrencyName,
                        symbol: row.subscriptionCurrencySymbol
                    }
                });
            }

            // Process deposit data
            if (row.depositId) {
                deposits[row.depositId] = {
                    depositId: row.depositId,
                    amount: row.depositAmount,
                    proofOfPayment: row.depositProofOfPayment,
                    status: row.depositStatus
                };
            }
        });

        return {
            success: true,
            message: 'User, wallet, deposit, and subscription details retrieved successfully',
            data: {
                user,
                wallets,
                subscriptions,
                deposits
            }
        };
    } catch (error) {
        console.error('Error retrieving user details:', error);
        return {
            success: false,
            message: `Failed to retrieve user details: ${error.message}`
        };
    }
};



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



cryptoInvestmentService.updateDepositStatusCreditWalletAndApproval = async (depositId, status) => {
    try {
        // Step 1: Check if the deposit exists and retrieve its details
        const depositQuery = 'SELECT walletId, amount, currencyId, status FROM deposits WHERE id = ?';
        const depositResult = await query(depositQuery, [depositId]);

        if (depositResult.length === 0) {
            throw new Error('Deposit not found.');
        }

        const deposit = depositResult[0];
        const { walletId, amount, currencyId, status: currentStatus } = deposit;

        // Step 2: Check if the current status is already 'accepted'
        if (currentStatus === 'accepted') {
            return {
                success: false,
                message: 'Deposit is already accepted and wallet credited.',
            };
        }

        // Step 3: If the status is 'rejected', delete the deposit
        if (status === 'rejected') {
            const deleteQuery = 'DELETE FROM deposits WHERE id = ?';
            const deleteResult = await query(deleteQuery, [depositId]);

            if (deleteResult.affectedRows === 0) {
                throw new Error('Failed to delete the rejected deposit.');
            }

            return {
                success: true,
                message: 'Deposit rejected and deleted successfully.',
            };
        }

        // Step 4: If the status is 'accepted', proceed to credit the wallet
        if (status === 'accepted') {
            // Update the deposit status to 'accepted'
            const updateQuery = 'UPDATE deposits SET status = ? WHERE id = ?';
            const updateResult = await query(updateQuery, [status, depositId]);

            if (updateResult.affectedRows === 0) {
                throw new Error('Failed to update deposit status to accepted.');
            }

            // Step 5: Call the creditWallet method to credit the user's wallet
            const creditResponse = await cryptoInvestmentService.creditWallet(walletId, depositId, amount);

            // Check if the wallet crediting process was successful
            if (creditResponse.success) {
                // Step 6: Insert a transaction record
                const insertTransactionQuery = `
                    INSERT INTO transactions (walletId, type, amount, currencyId, status, createdAt) 
                    VALUES (?, 'deposit', ?, ?, 'completed', NOW())
                `;
                const transactionResult = await query(insertTransactionQuery, [
                    walletId,
                    amount,
                    currencyId
                ]);

                if (transactionResult.affectedRows === 0) {
                    throw new Error('Failed to record transaction.');
                }

                return {
                    success: true,
                    message: 'Deposit status updated to accepted, wallet credited, and transaction recorded successfully.',
                    walletId: creditResponse.walletId,
                    creditedAmount: creditResponse.creditedAmount,
                    newBalance: creditResponse.newBalance,
                    depositId: creditResponse.depositId,
                    depositAmount: creditResponse.depositAmount
                };
            } else {
                throw new Error(`Wallet credit failed: ${creditResponse.message}`);
            }
        }

        // Handle invalid status update request
        return {
            success: false,
            message: 'Invalid status update requested. Only "accepted" or "rejected" statuses are allowed.',
        };

    } catch (error) {
        return {
            success: false,
            message: `Error updating deposit status: ${error.message}`,
        };
    }
};

// Function to retrieve the latest transactions history for a specific user
cryptoInvestmentService.getUserLatestTransactions= async(userId, limit = 10)=> {
    // SQL query to get the latest transactions for the user
    const sql = `
        SELECT 
            t.amount, 
            c.name AS currencyName, 
            c.symbol AS currencySymbol, 
            w.walletAddress, 
            t.type
        FROM transactions t
        JOIN wallets w ON t.walletId = w.id
        JOIN currencies c ON t.currencyId = c.id
        WHERE t.userId = ?
        ORDER BY t.createdAt DESC
        LIMIT ?
    `;

    try {
        // Execute the query and return the results
        const transactions = await query(sql, [userId, limit]);
        return {
            success: true,
            data: transactions
        };
    } catch (error) {
        console.error('Error retrieving user transactions:', error);
        return {
            success: false,
            message: `Failed to retrieve transactions: ${error.message}`
        };
    }
}



cryptoInvestmentService.getLockedFunds = async () => {
    try {
        const queryStr = 
            `SELECT 
                wallets.id AS walletId,
                wallets.walletAddress,
                deposits.amount AS lockedAmount,
                currencies.code AS currencyCode,
                currencies.symbol AS currencySymbol
            FROM 
                deposits
            INNER JOIN 
                wallets ON deposits.walletId = wallets.id
            INNER JOIN 
                currencies ON deposits.currencyId = currencies.id
            LEFT JOIN 
                payouts ON payouts.walletId = wallets.id AND (payouts.status = 'pending' OR payouts.status = 'rejected')    
            WHERE 
                deposits.status = 'pending'`;

        const result = await query(queryStr);

        return {
            message: 'Locked funds retrieved successfully',
            data: result,
            success: true,
        };
    } catch (error) {
        return {
            message: `Error retrieving locked funds: ${error.message}`,
            success: false,
        };
    }
};


cryptoInvestmentService.getRecentDeposits = async (limit = 10) => {
    try {
        const queryStr = 
            `SELECT 
                deposits.id AS depositId,
                deposits.amount,
                deposits.createdAt,
                wallets.walletAddress,
                currencies.code AS currencyCode,
                currencies.symbol AS currencySymbol
            FROM 
                deposits
            INNER JOIN 
                wallets ON deposits.walletId = wallets.id
            INNER JOIN 
                currencies ON deposits.currencyId = currencies.id
            ORDER BY 
                deposits.createdAt DESC
            LIMIT ?`;

        const result = await query(queryStr, [limit]);

        return {
            message: 'Recent deposits retrieved successfully',
            data: result,
            success: true,
        };
    } catch (error) {
        return {
            message: `Error retrieving recent deposits: ${error.message}`,
            success: false,
        };
    }
};

cryptoInvestmentService.getRecentWithdrawals = async (limit = 10) => {
    try {
        const queryStr = 
            `SELECT 
                payouts.id AS payoutId,
                payouts.amount,
                payouts.createdAt,
                wallets.walletAddress,
                currencies.code AS currencyCode,
                currencies.symbol AS currencySymbol
            FROM 
                payouts
            INNER JOIN 
                wallets ON payouts.walletId = wallets.id
            INNER JOIN 
                currencies ON payouts.currencyId = currencies.id
            ORDER BY 
                payouts.createdAt DESC
            LIMIT ?`;

        const result = await query(queryStr, [limit]);

        return {
            message: 'Recent withdrawals retrieved successfully',
            data: result,
            success: true,
        };
    } catch (error) {
        return {
            message: `Error retrieving recent withdrawals: ${error.message}`,
            success: false,
        };
    }
};



// Retrieve all deposit requests
// cryptoInvestmentService.getAllDeposits = async () => {
//     try {
//         const selectQuery = 'SELECT * FROM deposits';
//         const deposits = await query(selectQuery);

//         return deposits;
//     } catch (error) {
//         throw error;
//     }
// };


// cryptoInvestmentService.getAllDeposits = async () => {
//     try {
//         const selectQuery = `
//             SELECT deposits.id, 
//                    deposits.planId, 
//                    deposits.userId, 
//                    deposits.walletId, 
//                    deposits.amount, 
//                    deposits.currencyId, 
//                    deposits.proofOfPayment, 
//                    deposits.status, 
//                    deposits.createdAt,
//                    CONCAT(users.firstName, ' ', users.lastName) AS depositorName, 
//                    users.phone, 
//                    users.email,
//                    currencies.name AS currencyName,
//                    subscription_plans.label AS subscriptionPlanLabel
//             FROM deposits
//             JOIN users ON deposits.userId = users.id
//             JOIN currencies ON deposits.currencyId = currencies.id
//             JOIN subscription_plans ON deposits.planId = subscription_plans.id
//             WHERE deposits.status IN ('pending', 'accepted');
//         `;
        
//         const unapprovedDeposits = await query(selectQuery);
//         return unapprovedDeposits;
//     } catch (error) {
//         throw new Error(`Failed to retrieve pending or accepted deposits: ${error.message}`);
//     }
// };

cryptoInvestmentService.getAllDeposits = async () => {
    try {
      const selectQuery = `
        SELECT 
          deposits.id AS depositId,
          deposits.planId, 
          deposits.userId, 
          deposits.walletId, 
          deposits.amount, 
          deposits.currencyId, 
          deposits.proofOfPayment, 
          deposits.status, 
          deposits.createdAt,
          CONCAT(users.firstName, ' ', users.lastName) AS depositorName, 
          users.phone, 
          users.email,
          currencies.name AS currencyName,
          subscription_plans.label AS subscriptionPlanLabel
        FROM 
          deposits
        JOIN 
          users ON deposits.userId = users.id
        JOIN 
          currencies ON deposits.currencyId = currencies.id
        JOIN 
          subscription_plans ON deposits.planId = subscription_plans.id;
      `;
      
      const deposits = await query(selectQuery);
      
      if (deposits.length > 0) {
        return {
          message: 'Deposits retrieved successfully',
          data: deposits,
          success: true,
        };
      } else {
        return {
          message: 'No deposits found',
          data: [],
          success: true,
        };
      }
    } catch (error) {
      return {
        message: `Failed to retrieve deposits: ${error.message}`,
        success: false,
      };
    }
  };
  



// Service method to get all unapproved deposits
cryptoInvestmentService.getAllUnapprovedDeposits = async () => {
    try {
        const selectQuery = `
            SELECT deposits.id, 
                   deposits.planId, 
                   deposits.userId, 
                   deposits.walletId, 
                   deposits.amount, 
                   deposits.currencyId, 
                   deposits.proofOfPayment, 
                   deposits.status, 
                   deposits.createdAt,
                   CONCAT(users.firstName, ' ', users.lastName) AS depositorName, 
                   users.phone, 
                   users.email,
                   currencies.name AS currencyName,
                   subscription_plans.label AS subscriptionPlanLabel
            FROM deposits
            JOIN users ON deposits.userId = users.id
            JOIN currencies ON deposits.currencyId = currencies.id
            JOIN subscription_plans ON deposits.planId = subscription_plans.id
            WHERE deposits.status = 'pending';
        `;
        
        const unapprovedDeposits = await query(selectQuery);
        return unapprovedDeposits;
    } catch (error) {
        throw new Error(`Failed to retrieve pending deposits: ${error.message}`);
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
            `INSERT INTO deposits (planId, userId, walletId, amount, currencyId, proofOfPayment, status, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`,
            [planId, userId, walletId, depositAmount, currencyId, proofOfPayment]
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



// Method to request a payout
// cryptoInvestmentService.requestPayout = async (userId, walletId, amount, currencyId) => {
//     try {
//         // Step 1: Check if the wallet exists and has sufficient balance
//         const walletQuery = 'SELECT balance FROM wallets WHERE id = ?';
//         const walletResult = await query(walletQuery, [walletId]);

//         if (walletResult.length === 0) {
//             throw new Error('Wallet not found.');
//         }

//         const wallet = walletResult[0];
//         const { balance } = wallet;

//         if (amount <= 0) {
//             return {
//                 success: false,
//                 message: 'Payout amount must be greater than zero.',
//             };
//         }

//         if (amount > balance) {
//             return {
//                 success: false,
//                 message: 'Insufficient balance in the wallet.',
//             };
//         }

//         // Step 2: Insert the payout request into the database
//         const insertPayoutQuery = `
//             INSERT INTO payouts (walletId, amount, currencyId, status, requestedBy)
//             VALUES (?, ?, ?, 'pending', ?)
//         `;
//         const insertResult = await query(insertPayoutQuery, [walletId, amount, currencyId, userId]);

//         if (insertResult.affectedRows === 0) {
//             throw new Error('Failed to create payout request.');
//         }

//         const payoutId = insertResult.insertId;

//         return {
//             success: true,
//             message: 'Payout request created successfully.',
//             payoutId,
//         };

//     } catch (error) {
//         return {
//             success: false,
//             message: `Error requesting payout: ${error.message}`,
//         };
//     }
// };

// Method to request a payout
cryptoInvestmentService.requestPayout = async (userId, walletId, amount, currencyId) => {
    try {
        
        // Step 1: Get the firstName and surName of the user
        const userQuery = 'SELECT firstName, lastName FROM users WHERE id = ?';
        const userResult = await query(userQuery, [userId]);

        if (userResult.length === 0) {
            throw new Error('User not found.');
        }

        const { firstName, lastName } = userResult[0];
        const requestedBy = `${firstName} ${lastName}`;

        // Step 2: Check if the wallet exists and has sufficient balance
        const walletQuery = 'SELECT balance FROM wallets WHERE id = ?';
        const walletResult = await query(walletQuery, [walletId]);

        if (walletResult.length === 0) {
            throw new Error('Wallet not found.');
        }

        const wallet = walletResult[0];
        const { balance } = wallet;

        if (amount <= 0) {
            return {
                success: false,
                message: 'Payout amount must be greater than zero.',
            };
        }

        if (amount > balance) {
            return {
                success: false,
                message: 'Insufficient balance in the wallet.',
            };
        }

        // Step 3: Insert the payout request into the database with requestedBy as the user's full name
        const insertPayoutQuery = `
            INSERT INTO payouts (walletId, amount, currencyId, status, requestedBy)
            VALUES (?, ?, ?, 'pending', ?)
        `;
        const insertResult = await query(insertPayoutQuery, [walletId, amount, currencyId, requestedBy]);

        if (insertResult.affectedRows === 0) {
            throw new Error('Failed to create payout request.');
        }

        const payoutId = insertResult.insertId;

        return {
            success: true,
            message: 'Payout request created successfully.',
            payoutId,
        };

    } catch (error) {
        return {
            success: false,
            message: `Error requesting payout: ${error.message}`,
        };
    }
};

// Method for admin to handle payout requests
cryptoInvestmentService.handlePayoutRequest = async (payoutId, action) => {
    try {
        // Step 1: Fetch the payout request details
        const payoutQuery = 'SELECT * FROM payouts WHERE id = ?';
        const payoutResult = await query(payoutQuery, [payoutId]);

        if (payoutResult.length === 0) {
            throw new Error('Payout request not found.');
        }

        const payout = payoutResult[0];
        const { walletId, amount, status } = payout;

        // Only proceed if the request is in 'pending' status
        if (status !== 'pending') {
            return {
                success: false,
                message: 'Payout request has already been processed.',
            };
        }

        if (action === 'accepted') {
            // Step 2: Update the payout request status to 'accepted'
            const updatePayoutQuery = 'UPDATE payouts SET status = ? WHERE id = ?';
            await query(updatePayoutQuery, ['accepted', payoutId]);

            // Step 3: Update the wallet balance
            const updateWalletQuery = 'UPDATE wallets SET balance = balance - ? WHERE id = ?';
            await query(updateWalletQuery, [amount, walletId]);

            return {
                success: true,
                message: 'Payout request approved and wallet balance updated.',
            };

        } else if (action === 'rejected') {
            // Step 2: Update the payout request status to 'rejected'
            const updatePayoutQuery = 'UPDATE payouts SET status = ? WHERE id = ?';
            await query(updatePayoutQuery, ['rejected', payoutId]);

            return {
                success: true,
                message: 'Payout request rejected.',
            };

        } else {
            return {
                success: false,
                message: 'Invalid action specified.',
            };
        }

    } catch (error) {
        return {
            success: false,
            message: `Error handling payout request: ${error.message}`,
        };
    }
};


cryptoInvestmentService.getRequestedPayouts = async () => {
    try {
        const queryStr = `
            SELECT 
                payouts.id AS payoutId,
                payouts.amount,
                payouts.status,
                payouts.createdAt,
                wallets.walletAddress,
                currencies.code AS currencyCode,
                currencies.symbol AS currencySymbol
            FROM 
                payouts
            INNER JOIN 
                wallets ON payouts.walletId = wallets.id
            INNER JOIN 
                currencies ON payouts.currencyId = currencies.id
            WHERE 
                payouts.status = 'pending'
            ORDER BY 
                payouts.createdAt DESC
        `;

        const result = await query(queryStr);

        return {
            message: 'Requested payouts retrieved successfully',
            data: result,
            success: true,
        };
    } catch (error) {
        return {
            message: `Error retrieving requested payouts: ${error.message}`,
            success: false,
        };
    }
};



cryptoInvestmentService.getAllPayouts = async () => {
    try {
      const queryStr = `
        SELECT 
          payouts.id AS payoutId,
          payouts.amount,
          payouts.status,
          payouts.createdAt,
          payouts.proofPath,
          wallets.walletAddress,
          currencies.code AS currencyCode,
          currencies.symbol AS currencySymbol,
          CONCAT(users.firstName, ' ', users.lastName) AS depositorName -- Retrieve the name of the user who requested the payout
        FROM 
          payouts
        INNER JOIN 
          wallets ON payouts.walletId = wallets.id
        INNER JOIN 
          currencies ON payouts.currencyId = currencies.id
        LEFT JOIN 
          deposits ON wallets.depositId = deposits.id
        LEFT JOIN 
          users ON deposits.userId = users.id -- Join with users to get the depositor's name
        ORDER BY 
          payouts.createdAt DESC; -- Order the payouts by the latest created date
      `;
  
      const result = await query(queryStr);
  
      if (result.length > 0) {
        return {
          message: 'Payout details retrieved successfully',
          data: result,
          success: true,
        };
      } else {
        return {
          message: 'No payouts found',
          data: [],
          success: true,
        };
      }
    } catch (error) {
      return {
        message: `Error retrieving payouts: ${error.message}`,
        success: false,
      };
    }
  };
  

cryptoInvestmentService.uploadPaymentProof = async (payoutId, proofPath) => {
    try {
        const updateQuery = 'UPDATE payouts SET proofPath = ?, status = ? WHERE id = ?';
        const updateResult = await query(updateQuery, [proofPath, 'completed', payoutId]);

        if (updateResult.affectedRows === 0) {
            throw new Error('Failed to update payout with proof of payment.');
        }

        return {
            success: true,
            message: 'Payment proof uploaded and payout status updated successfully.',
        };
    } catch (error) {
        return {
            success: false,
            message: `Error uploading payment proof: ${error.message}`,
        };
    }
};


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
