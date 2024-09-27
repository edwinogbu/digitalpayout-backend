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

// SQL query to create the payment gateways table
const createPaymentGatewayTableQuery = `
    CREATE TABLE IF NOT EXISTS payment_gateways (
        id INT AUTO_INCREMENT PRIMARY KEY,
        currencyAddress VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

// Function to create the payment gateways table
async function createPaymentGatewayTable() {
    try {
        await query(createPaymentGatewayTableQuery);
        console.log('Payment Gateways table created successfully.');
    } catch (error) {
        console.error('Error creating payment gateways table:', error);
    }
}

// Execute table creation
(async () => {
    await createPaymentGatewayTable();
})();

// Payment gateway service object
const paymentGatewayService = {};

// Create a new payment gateway
paymentGatewayService.createPaymentGateway = async (gatewayData) => {
    try {
        const { currencyAddress, name, description } = gatewayData;

        // Insert data into payment gateways table
        const insertQuery = `
            INSERT INTO payment_gateways (currencyAddress, name, description)
            VALUES (?, ?, ?)
        `;
        const result = await query(insertQuery, [currencyAddress, name, description]);

        if (!result.insertId) {
            throw new Error('Failed to insert payment gateway into DB');
        }

        return { id: result.insertId, ...gatewayData };
    } catch (error) {
        throw error;
    }
};

// Retrieve all payment gateways
paymentGatewayService.getAllPaymentGateways = async () => {
    try {
        const selectQuery = 'SELECT * FROM payment_gateways';
        const gateways = await query(selectQuery);
        return {
            message: 'Payment gateways retrieved successfully',
            gateways: gateways
        };
    } catch (error) {
        throw error;
    }
};

// Retrieve a payment gateway by ID
paymentGatewayService.getPaymentGatewayById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM payment_gateways WHERE id = ?';
        const gateways = await query(selectQuery, [id]);

        if (gateways.length === 0) {
            throw new Error('Payment gateway not found');
        }

        return gateways[0];
    } catch (error) {
        throw error;
    }
};

// Update a payment gateway by ID
paymentGatewayService.updatePaymentGateway = async (id, updateData) => {
    try {
        const { currencyAddress, name, description } = updateData;

        // Construct the SET clause dynamically
        const updateFields = [];
        const queryValues = [];
        
        if (currencyAddress) {
            updateFields.push('currencyAddress = ?');
            queryValues.push(currencyAddress);
        }
        if (name) {
            updateFields.push('name = ?');
            queryValues.push(name);
        }
        if (description) {
            updateFields.push('description = ?');
            queryValues.push(description);
        }

        if (updateFields.length === 0) {
            throw new Error('No update data provided');
        }

        queryValues.push(id);

        const updateQuery = `UPDATE payment_gateways SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await query(updateQuery, queryValues);

        if (result.affectedRows === 0) {
            throw new Error('Failed to update payment gateway or payment gateway not found');
        }

        return { id, ...updateData };
    } catch (error) {
        throw error;
    }
};

// Delete a payment gateway by ID
paymentGatewayService.deletePaymentGateway = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM payment_gateways WHERE id = ?';
        const result = await query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            throw new Error('Failed to delete payment gateway or payment gateway not found');
        }

        return { id };
    } catch (error) {
        throw error;
    }
};

// Retrieve paginated payment gateways
paymentGatewayService.getPaginatedPaymentGateways = async (page = 1, limit = 10) => {
    try {
        // Calculate the offset
        const offset = (page - 1) * limit;

        // Query to get paginated payment gateways
        const paginatedGatewaysQuery = `
            SELECT * FROM payment_gateways
            ORDER BY createdAt DESC
            LIMIT ? OFFSET ?
        `;

        const gateways = await query(paginatedGatewaysQuery, [limit, offset]);

        // Count total number of payment gateways for pagination metadata
        const countQuery = 'SELECT COUNT(*) AS total FROM payment_gateways';
        const countResult = await query(countQuery);
        const total = countResult[0].total;

        return { gateways, total, page, limit };
    } catch (error) {
        throw error;
    }
};

module.exports = paymentGatewayService;
