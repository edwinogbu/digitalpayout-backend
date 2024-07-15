const pool = require('./mysqlConnectionPool');

const TransactionsService = {};

// Function to get all transactions for a specific wallet
TransactionsService.getAllTransactionsForWallet = async (walletId) => {
    try {
        const query = 'SELECT * FROM Transactions WHERE wallet_id = ?';
        const transactions = await pool.query(query, [walletId]);
        return transactions;
    } catch (error) {
        throw error;
    }
};

// Function to add a new transaction
TransactionsService.addTransaction = async (transactionData) => {
    try {
        const {
            wallet_id,
            recipient_wallet_id,
            transaction_type,
            amount,
            description,
            transaction_status,
            fee,
            metadata,
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            transaction_date,
            completed_at,
            status_message,
            transaction_category
        } = transactionData;
        const query = `INSERT INTO Transactions 
                        (wallet_id, recipient_wallet_id, transaction_type, amount, description, transaction_status, fee, metadata, transaction_hash, blockchain_network, confirmations, transaction_fee_currency, transaction_fee_amount, transaction_date, completed_at, status_message, transaction_category) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await pool.query(query, [
            wallet_id,
            recipient_wallet_id,
            transaction_type,
            amount,
            description,
            transaction_status,
            fee,
            JSON.stringify(metadata),
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            transaction_date,
            completed_at,
            status_message,
            transaction_category
        ]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Function to update a transaction
TransactionsService.updateTransaction = async (transactionId, updatedTransactionData) => {
    try {
        const {
            amount,
            description,
            transaction_status,
            fee,
            metadata,
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            completed_at,
            status_message,
            transaction_category
        } = updatedTransactionData;
        const query = `UPDATE Transactions 
                        SET amount = ?, description = ?, transaction_status = ?, fee = ?, metadata = ?, transaction_hash = ?, blockchain_network = ?, confirmations = ?, transaction_fee_currency = ?, transaction_fee_amount = ?, completed_at = ?, status_message = ?, transaction_category = ? 
                        WHERE transaction_id = ?`;
        const result = await pool.query(query, [
            amount,
            description,
            transaction_status,
            fee,
            JSON.stringify(metadata),
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            completed_at,
            status_message,
            transaction_category,
            transactionId
        ]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

// Function to delete a transaction
TransactionsService.deleteTransaction = async (transactionId) => {
    try {
        const query = 'DELETE FROM Transactions WHERE transaction_id = ?';
        const result = await pool.query(query, [transactionId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};


// Function to get all cryptocurrency transactions for a specific wallet
TransactionsService.getAllCryptoTransactionsForWallet = async (walletId) => {
    try {
        const query = 'SELECT * FROM Transactions WHERE wallet_id = ? AND transaction_category = "cryptocurrency"';
        const transactions = await pool.query(query, [walletId]);
        return transactions;
    } catch (error) {
        throw error;
    }
};

// Function to add a new cryptocurrency transaction
TransactionsService.addCryptoTransaction = async (transactionData) => {
    try {
        const {
            wallet_id,
            recipient_wallet_id,
            transaction_type,
            amount,
            description,
            transaction_status,
            fee,
            metadata,
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            transaction_date,
            completed_at,
            status_message
        } = transactionData;
        const query = `INSERT INTO Transactions 
                        (wallet_id, recipient_wallet_id, transaction_type, amount, description, transaction_status, fee, metadata, transaction_hash, blockchain_network, confirmations, transaction_fee_currency, transaction_fee_amount, transaction_date, completed_at, status_message, transaction_category) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await pool.query(query, [
            wallet_id,
            recipient_wallet_id,
            transaction_type,
            amount,
            description,
            transaction_status,
            fee,
            JSON.stringify(metadata),
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            transaction_date,
            completed_at,
            status_message,
            'cryptocurrency'
        ]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Function to update a cryptocurrency transaction
TransactionsService.updateCryptoTransaction = async (transactionId, updatedTransactionData) => {
    try {
        const {
            amount,
            description,
            transaction_status,
            fee,
            metadata,
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            completed_at,
            status_message
        } = updatedTransactionData;
        const query = `UPDATE Transactions 
                        SET amount = ?, description = ?, transaction_status = ?, fee = ?, metadata = ?, transaction_hash = ?, blockchain_network = ?, confirmations = ?, transaction_fee_currency = ?, transaction_fee_amount = ?, completed_at = ?, status_message = ? 
                        WHERE transaction_id = ?`;
        const result = await pool.query(query, [
            amount,
            description,
            transaction_status,
            fee,
            JSON.stringify(metadata),
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            completed_at,
            status_message,
            transactionId
        ]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

// Function to delete a cryptocurrency transaction
TransactionsService.deleteCryptoTransaction = async (transactionId) => {
    try {
        const query = 'DELETE FROM Transactions WHERE transaction_id = ? AND transaction_category = "cryptocurrency"';
        const result = await pool.query(query, [transactionId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};




// Function to get all cryptocurrency transactions for a specific wallet
TransactionsService.getAllCryptoTransactionsForWallet = async (walletId) => {
    try {
        const query = 'SELECT * FROM Transactions WHERE wallet_id = ? AND transaction_category = "cryptocurrency"';
        const transactions = await pool.query(query, [walletId]);
        return transactions;
    } catch (error) {
        throw error;
    }
};

// Function to add a new cryptocurrency transaction
TransactionsService.addCryptoTransaction = async (transactionData) => {
    try {
        const {
            wallet_id,
            recipient_wallet_id,
            transaction_type,
            amount,
            description,
            transaction_status,
            fee,
            metadata,
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            transaction_date,
            completed_at,
            status_message
        } = transactionData;
        const query = `INSERT INTO Transactions 
                        (wallet_id, recipient_wallet_id, transaction_type, amount, description, transaction_status, fee, metadata, transaction_hash, blockchain_network, confirmations, transaction_fee_currency, transaction_fee_amount, transaction_date, completed_at, status_message, transaction_category) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await pool.query(query, [
            wallet_id,
            recipient_wallet_id,
            transaction_type,
            amount,
            description,
            transaction_status,
            fee,
            JSON.stringify(metadata),
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            transaction_date,
            completed_at,
            status_message,
            'cryptocurrency'
        ]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Function to update a cryptocurrency transaction
TransactionsService.updateCryptoTransaction = async (transactionId, updatedTransactionData) => {
    try {
        const {
            amount,
            description,
            transaction_status,
            fee,
            metadata,
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            completed_at,
            status_message
        } = updatedTransactionData;
        const query = `UPDATE Transactions 
                        SET amount = ?, description = ?, transaction_status = ?, fee = ?, metadata = ?, transaction_hash = ?, blockchain_network = ?, confirmations = ?, transaction_fee_currency = ?, transaction_fee_amount = ?, completed_at = ?, status_message = ? 
                        WHERE transaction_id = ?`;
        const result = await pool.query(query, [
            amount,
            description,
            transaction_status,
            fee,
            JSON.stringify(metadata),
            transaction_hash,
            blockchain_network,
            confirmations,
            transaction_fee_currency,
            transaction_fee_amount,
            completed_at,
            status_message,
            transactionId
        ]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

// Function to delete a cryptocurrency transaction
TransactionsService.deleteCryptoTransaction = async (transactionId) => {
    try {
        const query = 'DELETE FROM Transactions WHERE transaction_id = ? AND transaction_category = "cryptocurrency"';
        const result = await pool.query(query, [transactionId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};



// Function to get cryptocurrency transactions by transaction type
TransactionsService.getCryptoTransactionsByType = async (walletId, transactionType) => {
    try {
        const query = 'SELECT * FROM Transactions WHERE wallet_id = ? AND transaction_category = "cryptocurrency" AND transaction_type = ?';
        const transactions = await pool.query(query, [walletId, transactionType]);
        return transactions;
    } catch (error) {
        throw error;
    }
};

// Function to get cryptocurrency transactions by status
TransactionsService.getCryptoTransactionsByStatus = async (walletId, transactionStatus) => {
    try {
        const query = 'SELECT * FROM Transactions WHERE wallet_id = ? AND transaction_category = "cryptocurrency" AND transaction_status = ?';
        const transactions = await pool.query(query, [walletId, transactionStatus]);
        return transactions;
    } catch (error) {
        throw error;
    }
};

// Function to get cryptocurrency transactions by date range
TransactionsService.getCryptoTransactionsByDateRange = async (walletId, startDate, endDate) => {
    try {
        const query = 'SELECT * FROM Transactions WHERE wallet_id = ? AND transaction_category = "cryptocurrency" AND transaction_date BETWEEN ? AND ?';
        const transactions = await pool.query(query, [walletId, startDate, endDate]);
        return transactions;
    } catch (error) {
        throw error;
    }
};

// Function to get cryptocurrency transactions by amount range
TransactionsService.getCryptoTransactionsByAmountRange = async (walletId, minAmount, maxAmount) => {
    try {
        const query = 'SELECT * FROM Transactions WHERE wallet_id = ? AND transaction_category = "cryptocurrency" AND amount BETWEEN ? AND ?';
        const transactions = await pool.query(query, [walletId, minAmount, maxAmount]);
        return transactions;
    } catch (error) {
        throw error;
    }
};

// Function to get total cryptocurrency balance for a wallet
TransactionsService.getTotalCryptoBalanceForWallet = async (walletId) => {
    try {
        const query = 'SELECT SUM(amount) AS total_balance FROM Transactions WHERE wallet_id = ? AND transaction_category = "cryptocurrency"';
        const result = await pool.query(query, [walletId]);
        return result[0].total_balance || 0;
    } catch (error) {
        throw error;
    }
};

// Function to get cryptocurrency transaction by ID
TransactionsService.getCryptoTransactionById = async (transactionId) => {
    try {
        const query = 'SELECT * FROM Transactions WHERE transaction_id = ? AND transaction_category = "cryptocurrency"';
        const transactions = await pool.query(query, [transactionId]);
        return transactions.length > 0 ? transactions[0] : null;
    } catch (error) {
        throw error;
    }
};



module.exports = TransactionsService;
