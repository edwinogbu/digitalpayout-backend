// CREATE TABLE Users (
//     user_id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL,
//     password_hash VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// CREATE TABLE Wallets (
//     wallet_id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     wallet_name VARCHAR(255),
//     balance DECIMAL(18, 2),
//     currency VARCHAR(10),
//     is_default BOOLEAN DEFAULT FALSE,
//     is_active BOOLEAN DEFAULT TRUE,
//     public_key VARCHAR(255),
//     private_key VARCHAR(255),
//     wallet_type VARCHAR(50),
//     wallet_address VARCHAR(255),
//     last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     notifications_enabled BOOLEAN DEFAULT TRUE,
//     transaction_limit DECIMAL(18, 2),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES Users(user_id)
// );

// CREATE TABLE Transactions (
//     transaction_id INT AUTO_INCREMENT PRIMARY KEY,
//     wallet_id INT NOT NULL,
//     recipient_wallet_id INT,
//     transaction_type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
//     amount DECIMAL(18, 2),
//     description TEXT,
//     transaction_status ENUM('pending', 'completed', 'failed') NOT NULL,
//     fee DECIMAL(18, 2),
//     metadata JSON,
//     transaction_hash VARCHAR(255),
//     blockchain_network VARCHAR(50),
//     confirmations INT,
//     transaction_fee_currency VARCHAR(10),
//     transaction_fee_amount DECIMAL(18, 2),
//     transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     completed_at TIMESTAMP,
//     status_message TEXT,
//     transaction_category VARCHAR(50),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (wallet_id) REFERENCES Wallets(wallet_id),
//     FOREIGN KEY (recipient_wallet_id) REFERENCES Wallets(wallet_id)
// );

// CREATE TABLE Security_Settings (
//     security_id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     two_factor_authentication_enabled BOOLEAN DEFAULT FALSE,
//     phone_verification_enabled BOOLEAN DEFAULT FALSE,
//     recovery_email_setup BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES Users(user_id)
// );

// CREATE TABLE Contacts (
//     contact_id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     contact_name VARCHAR(255),
//     contact_email VARCHAR(255),
//     contact_phone VARCHAR(20),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES Users(user_id)
// );

// CREATE TABLE User_Roles (
//     role_id INT AUTO_INCREMENT PRIMARY KEY,
//     role_name VARCHAR(50) UNIQUE,
//     description TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE User_User_Roles (
//     user_id INT NOT NULL,
//     role_id INT NOT NULL,
//     PRIMARY KEY (user_id, role_id),
//     FOREIGN KEY (user_id) REFERENCES Users(user_id),
//     FOREIGN KEY (role_id) REFERENCES User_Roles(role_id)
// );

// CREATE TABLE Logs (
//     log_id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT,
//     action VARCHAR(255),
//     log_message TEXT,
//     log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES Users(user_id)
// );

// CREATE TABLE Images (
//     image_id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT,
//     image_url VARCHAR(255),
//     uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES Users(user_id)
// );



const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Helper function to execute SQL queries
function query(sql, args) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Ensure the tables exist
const createTables = async () => {
    const createCryptocurrencyTable = `
        CREATE TABLE IF NOT EXISTS Cryptocurrency (
            crypto_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            crypto_name VARCHAR(255) NOT NULL,
            crypto_type VARCHAR(255) NOT NULL,
            public_address VARCHAR(255) NOT NULL,
            private_key_encrypted TEXT NOT NULL,
            notes TEXT,
            crypto_balance DECIMAL(18, 8) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `;

    const createTransactionsTable = `
        CREATE TABLE IF NOT EXISTS Transactions (
            transaction_id INT AUTO_INCREMENT PRIMARY KEY,
            wallet_id INT NOT NULL,
            recipient_wallet_id INT,
            transaction_type VARCHAR(255) NOT NULL,
            amount DECIMAL(18, 8) NOT NULL,
            description TEXT,
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (wallet_id) REFERENCES Cryptocurrency(crypto_id),
            FOREIGN KEY (recipient_wallet_id) REFERENCES Cryptocurrency(crypto_id)
        );
    `;

    await query(createCryptocurrencyTable);
    await query(createTransactionsTable);
};

createTables().catch(console.error);

const CryptocurrencyService = {};

// Function to create a new cryptocurrency wallet
CryptocurrencyService.createWallet = async (userId, cryptoName, cryptoType, publicAddress, privateKeyEncrypted, notes) => {
    try {
        // Implement your logic here to create a new cryptocurrency wallet
        // Example query: h
        const query = `
            INSERT INTO Cryptocurrency (user_id, crypto_name, crypto_type, public_address, private_key_encrypted, notes, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        await pool.query(query, [userId, cryptoName, cryptoType, publicAddress, privateKeyEncrypted, notes]);
    } catch (error) {
        throw error;
    }
};

// Function to get cryptocurrency wallets by user ID
CryptocurrencyService.getWalletsByUserId = async (userId) => {
    try {
        // Implement your logic here to fetch cryptocurrency wallets by user ID
        // Example query:
        const query = 'SELECT * FROM Cryptocurrency WHERE user_id = ?';
        const wallets = await pool.query(query, [userId]);
        return wallets;
    } catch (error) {
        throw error;
    }
};

// Function to get cryptocurrency wallet by wallet ID
CryptocurrencyService.getWalletById = async (walletId) => {
    try {
        // Implement your logic here to fetch cryptocurrency wallet by wallet ID
        // Example query:
        const query = 'SELECT * FROM Cryptocurrency WHERE crypto_id = ?';
        const wallet = await pool.query(query, [walletId]);
        return wallet[0];
    } catch (error) {
        throw error;
    }
};

// Function to update cryptocurrency wallet
CryptocurrencyService.updateWallet = async (walletId, updateFields) => {
    try {
        // Implement your logic here to update cryptocurrency wallet
        // Example query:
        const updateValues = [];
        let updateQuery = 'UPDATE Cryptocurrency SET ';
        Object.keys(updateFields).forEach((key, index) => {
            updateQuery += `${key} = ?`;
            updateValues.push(updateFields[key]);
            if (index < Object.keys(updateFields).length - 1) {
                updateQuery += ', ';
            }
        });
        updateQuery += ` WHERE crypto_id = ?`;
        updateValues.push(walletId);
        await pool.query(updateQuery, updateValues);
    } catch (error) {
        throw error;
    }
};


// Function to get cryptocurrency wallet balance by wallet ID
CryptocurrencyService.getWalletBalance = async (walletId) => {
    try {
        // Implement your logic here to calculate cryptocurrency wallet balance
        // Example query:
        const query = 'SELECT crypto_balance FROM Cryptocurrency WHERE crypto_id = ?';
        const result = await pool.query(query, [walletId]);
        return result[0].crypto_balance;
    } catch (error) {
        throw error;
    }
};

// Function to perform a cryptocurrency transaction (send or receive)
CryptocurrencyService.performTransaction = async (walletId, amount, transactionType, recipientAddress, notes) => {
    try {
        // Implement your logic here to perform a cryptocurrency transaction
        // Example query:
        // Update sender's wallet balance
        const updateSenderQuery = `
            UPDATE Cryptocurrency 
            SET crypto_balance = crypto_balance - ? 
            WHERE crypto_id = ?;
        `;
        await pool.query(updateSenderQuery, [amount, walletId]);

        // Insert transaction record for sender
        const insertSenderTransactionQuery = `
            INSERT INTO Transactions (wallet_id, transaction_type, amount, description, transaction_date) 
            VALUES (?, ?, ?, ?, NOW());
        `;
        await pool.query(insertSenderTransactionQuery, [walletId, transactionType, -amount, notes]);

        // If it's a transfer, update recipient's wallet balance and insert transaction record
        if (transactionType === 'transfer') {
            // Update recipient's wallet balance
            const updateRecipientQuery = `
                UPDATE Cryptocurrency 
                SET crypto_balance = crypto_balance + ? 
                WHERE public_address = ?;
            `;
            await pool.query(updateRecipientQuery, [amount, recipientAddress]);

            // Get recipient's wallet ID
            const getRecipientWalletIdQuery = `
                SELECT crypto_id 
                FROM Cryptocurrency 
                WHERE public_address = ?;
            `;
            const recipientWalletId = await pool.query(getRecipientWalletIdQuery, [recipientAddress]);

            // Insert transaction record for recipient
            const insertRecipientTransactionQuery = `
                INSERT INTO Transactions (wallet_id, recipient_wallet_id, transaction_type, amount, description, transaction_date) 
                VALUES (?, ?, ?, ?, ?, NOW());
            `;
            await pool.query(insertRecipientTransactionQuery, [recipientWalletId, walletId, transactionType, amount, notes]);
        }

        // Return success message or transaction ID
        return { message: 'Transaction successful' };
    } catch (error) {
        // Rollback transaction if any step fails
        await pool.rollback();
        throw error;
    }
};

// Function to retrieve cryptocurrency transactions for a wallet
CryptocurrencyService.getTransactionsForWallet = async (walletId) => {
    try {
        // Implement your logic here to fetch cryptocurrency transactions for a wallet
        // Example query:
        const query = 'SELECT * FROM Transactions WHERE wallet_id = ?';
        const transactions = await pool.query(query, [walletId]);
        return transactions;
    } catch (error) {
        throw error;
    }
};

module.exports = CryptocurrencyService;
