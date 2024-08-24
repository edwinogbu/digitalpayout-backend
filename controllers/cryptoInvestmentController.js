const cryptoInvestmentService = require('../services/cryptoInvestmentService');

// Create a new currency
async function createCurrency(req, res) {
    try {
        const { code, symbol, name } = req.body;
        const result = await cryptoInvestmentService.createCurrency(code, symbol, name);
        res.status(201).json({
            success: true,
            message: 'Currency created successfully.',
            currencyId: result.currencyId
        });
    } catch (error) {
        console.error('Error creating currency:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the currency.',
            error: error.message
        });
    }
}

// Update an existing currency
async function updateCurrency(req, res) {
    try {
        const { id } = req.params;
        const { code, symbol, name } = req.body;
        const result = await cryptoInvestmentService.updateCurrency(id, code, symbol, name);
        res.status(200).json({
            success: true,
            message: 'Currency updated successfully.'
        });
    } catch (error) {
        console.error('Error updating currency:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the currency.',
            error: error.message
        });
    }
}

// Delete a currency
async function deleteCurrency(req, res) {
    try {
        const { id } = req.params;
        const result = await cryptoInvestmentService.deleteCurrency(id);
        res.status(200).json({
            success: true,
            message: 'Currency deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting currency:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the currency.',
            error: error.message
        });
    }
}

// Retrieve all currencies
async function getAllCurrencies(req, res) {
    try {
        const currencies = await cryptoInvestmentService.getAllCurrencies();
        res.status(200).json({
            success: true,
            message: 'Currencies retrieved successfully.',
            currencies
        });
    } catch (error) {
        console.error('Error retrieving currencies:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving currencies.',
            error: error.message
        });
    }
}

// Create a new wallet for a user
async function createWallet(req, res) {
    try {
        const { userId, currencyId } = req.body;
        const result = await cryptoInvestmentService.createWallet(userId, currencyId);
        res.status(201).json({
            success: true,
            message: 'Wallet created successfully.',
            walletId: result.walletId
        });
    } catch (error) {
        console.error('Error creating wallet:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the wallet.',
            error: error.message
        });
    }
}

// Credit an investor's wallet
async function creditWallet(req, res) {
    try {
        const { walletId, amount } = req.body;
        const result = await cryptoInvestmentService.creditWallet(walletId, amount);
        res.status(200).json({
            success: true,
            message: 'Wallet credited successfully.'
        });
    } catch (error) {
        console.error('Error crediting wallet:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while crediting the wallet.',
            error: error.message
        });
    }
}

// Request a deposit with proof of payment
async function requestDeposit(req, res) {
    try {
        const { walletId, amount, currencyId, proofOfPayment } = req.body;
        const result = await cryptoInvestmentService.requestDeposit(walletId, amount, currencyId, proofOfPayment);
        res.status(201).json({
            success: true,
            message: 'Deposit request submitted successfully.',
            depositId: result.depositId
        });
    } catch (error) {
        console.error('Error requesting deposit:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while requesting the deposit.',
            error: error.message
        });
    }
}

// Update deposit status
async function updateDepositStatus(req, res) {
    try {
        const { depositId } = req.params;
        const { status } = req.body;
        const result = await cryptoInvestmentService.updateDepositStatus(depositId, status);
        res.status(200).json({
            success: true,
            message: 'Deposit status updated successfully.'
        });
    } catch (error) {
        console.error('Error updating deposit status:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the deposit status.',
            error: error.message
        });
    }
}

// Retrieve all deposit requests
async function getAllDeposits(req, res) {
    try {
        const deposits = await cryptoInvestmentService.getAllDeposits();
        res.status(200).json({
            success: true,
            message: 'Deposit requests retrieved successfully.',
            deposits
        });
    } catch (error) {
        console.error('Error retrieving deposits:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving deposit requests.',
            error: error.message
        });
    }
}

// Request a withdrawal
async function requestWithdrawal(req, res) {
    try {
        const { walletId, amount, currencyId } = req.body;
        const result = await cryptoInvestmentService.requestWithdrawal(walletId, amount, currencyId);
        res.status(201).json({
            success: true,
            message: 'Withdrawal request submitted successfully.',
            transactionId: result.transactionId
        });
    } catch (error) {
        console.error('Error requesting withdrawal:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while requesting the withdrawal.',
            error: error.message
        });
    }
}

// Update withdrawal status
async function updateWithdrawalStatus(req, res) {
    try {
        const { transactionId } = req.params;
        const { status } = req.body;
        const result = await cryptoInvestmentService.updateWithdrawalStatus(transactionId, status);
        res.status(200).json({
            success: true,
            message: 'Withdrawal status updated successfully.'
        });
    } catch (error) {
        console.error('Error updating withdrawal status:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the withdrawal status.',
            error: error.message
        });
    }
}

// Retrieve all transactions for a specific wallet
async function getAllTransactionsByWalletId(req, res) {
    try {
        const { walletId } = req.params;
        const transactions = await cryptoInvestmentService.getAllTransactionsByWalletId(walletId);
        res.status(200).json({
            success: true,
            message: 'Transactions retrieved successfully.',
            transactions
        });
    } catch (error) {
        console.error('Error retrieving transactions:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving transactions.',
            error: error.message
        });
    }
}

module.exports = {
    createCurrency,
    updateCurrency,
    deleteCurrency,
    getAllCurrencies,
    createWallet,
    creditWallet,
    requestDeposit,
    updateDepositStatus,
    getAllDeposits,
    requestWithdrawal,
    updateWithdrawalStatus,
    getAllTransactionsByWalletId
};




// const cryptoInvestmentService = require('../services/cryptoInvestmentService');

// // Create a new wallet for a user
// async function createWallet(req, res) {
//     try {
//         const { userId } = req.body;
//         const result = await cryptoInvestmentService.createWallet(userId);
//         res.json({ 
//             success: true, 
//             message: `Wallet successfully created for user ID: ${userId}.`, 
//             walletId: result.walletId 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to create wallet for user ID: ${userId}. Error: ${error.message}` 
//         });
//     }
// }

// // Deposit funds into the wallet
// async function deposit(req, res) {
//     try {
//         const { walletId, amount } = req.body;
//         const result = await cryptoInvestmentService.deposit(walletId, amount);
//         res.json({ 
//             success: true, 
//             message: `Deposit of ${amount} successfully initiated for wallet ID: ${walletId}.`, 
//             transactionId: result.transactionId 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to initiate deposit of ${amount} for wallet ID: ${walletId}. Error: ${error.message}` 
//         });
//     }
// }

// // Update deposit status (Admin action)
// async function updateDepositStatus(req, res) {
//     try {
//         const { transactionId, status } = req.body;
//         const result = await cryptoInvestmentService.updateDepositStatus(transactionId, status);
//         const action = status === 'accepted' ? 'approved' : 'rejected';
//         res.json({ 
//             success: true, 
//             message: `Deposit ${action} for transaction ID: ${transactionId}.` 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to update deposit status for transaction ID: ${transactionId}. Error: ${error.message}` 
//         });
//     }
// }

// // Request a withdrawal
// async function requestWithdrawal(req, res) {
//     try {
//         const { walletId, amount } = req.body;
//         const result = await cryptoInvestmentService.requestWithdrawal(walletId, amount);
//         res.json({ 
//             success: true, 
//             message: `Withdrawal request of ${amount} successfully initiated for wallet ID: ${walletId}.`, 
//             transactionId: result.transactionId 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to request withdrawal of ${amount} for wallet ID: ${walletId}. Error: ${error.message}` 
//         });
//     }
// }

// // Update withdrawal status (Admin action)
// async function updateWithdrawalStatus(req, res) {
//     try {
//         const { transactionId, status } = req.body;
//         const result = await cryptoInvestmentService.updateWithdrawalStatus(transactionId, status);
//         const action = status === 'accepted' ? 'approved' : 'rejected';
//         res.json({ 
//             success: true, 
//             message: `Withdrawal ${action} for transaction ID: ${transactionId}.` 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to update withdrawal status for transaction ID: ${transactionId}. Error: ${error.message}` 
//         });
//     }
// }

// // Add earnings to a subscription
// async function addEarnings(req, res) {
//     try {
//         const { subscriptionId, amount } = req.body;
//         const result = await cryptoInvestmentService.addEarnings(subscriptionId, amount);
//         res.json({ 
//             success: true, 
//             message: `Earnings of ${amount} successfully added to subscription ID: ${subscriptionId}.`, 
//             transactionId: result.transactionId 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to add earnings of ${amount} to subscription ID: ${subscriptionId}. Error: ${error.message}` 
//         });
//     }
// }

// // Create a new subscription plan for a wallet
// async function createSubscription(req, res) {
//     try {
//         const { walletId, planId, durationMonths, reinvest } = req.body;
//         const result = await cryptoInvestmentService.createSubscription(walletId, planId, durationMonths, reinvest);
//         res.json({ 
//             success: true, 
//             message: `Subscription plan ${planId} successfully created for wallet ID: ${walletId} with a duration of ${durationMonths} months${reinvest ? ', reinvest option enabled' : ''}.`, 
//             subscriptionId: result.subscriptionId 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to create subscription plan ${planId} for wallet ID: ${walletId}. Error: ${error.message}` 
//         });
//     }
// }

// // Handle subscription expiration
// async function handleSubscriptionExpiration(req, res) {
//     try {
//         const { subscriptionId } = req.body;
//         const result = await cryptoInvestmentService.handleSubscriptionExpiration(subscriptionId);
//         res.json({ 
//             success: true, 
//             message: `Subscription ID: ${subscriptionId} successfully handled. ${result.message}` 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to handle subscription expiration for subscription ID: ${subscriptionId}. Error: ${error.message}` 
//         });
//     }
// }

// // Request a payout
// async function requestPayout(req, res) {
//     try {
//         const { walletId, amount } = req.body;
//         const result = await cryptoInvestmentService.requestPayout(walletId, amount);
//         res.json({ 
//             success: true, 
//             message: `Payout request of ${amount} successfully initiated for wallet ID: ${walletId}.`, 
//             payoutId: result.payoutId 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to request payout of ${amount} for wallet ID: ${walletId}. Error: ${error.message}` 
//         });
//     }
// }

// // Update payout status (Admin action)
// async function updatePayoutStatus(req, res) {
//     try {
//         const { payoutId, status } = req.body;
//         const result = await cryptoInvestmentService.updatePayoutStatus(payoutId, status);
//         const action = status === 'accepted' ? 'approved' : 'rejected';
//         res.json({ 
//             success: true, 
//             message: `Payout ${action} for payout ID: ${payoutId}.` 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: `Failed to update payout status for payout ID: ${payoutId}. Error: ${error.message}` 
//         });
//     }
// }

// module.exports = {
//     createWallet,
//     deposit,
//     updateDepositStatus,
//     requestWithdrawal,
//     updateWithdrawalStatus,
//     addEarnings,
//     createSubscription,
//     handleSubscriptionExpiration,
//     requestPayout,
//     updatePayoutStatus
// };


// // const cryptoInvestmentService = require('../services/cryptoInvestmentService');

// // // Create a new wallet for a user
// // async function createWallet(req, res) {
// //     try {
// //         const { userId } = req.body;
// //         const result = await cryptoInvestmentService.createWallet(userId);
// //         res.json({ success: true, message: result.message, walletId: result.walletId });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to create wallet: ' + error.message });
// //     }
// // }

// // // Deposit funds into the wallet
// // async function deposit(req, res) {
// //     try {
// //         const { walletId, amount } = req.body;
// //         const result = await cryptoInvestmentService.deposit(walletId, amount);
// //         res.json({ success: true, message: result.message, transactionId: result.transactionId });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to initiate deposit: ' + error.message });
// //     }
// // }

// // // Approve or reject deposit (Admin action)
// // async function updateDepositStatus(req, res) {
// //     try {
// //         const { transactionId, status } = req.body;
// //         if (!['accepted', 'rejected'].includes(status)) {
// //             return res.status(400).json({ success: false, message: 'Invalid status provided' });
// //         }
// //         const result = await cryptoInvestmentService.updateDepositStatus(transactionId, status);
// //         res.json({ success: true, message: result.message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to update deposit status: ' + error.message });
// //     }
// // }

// // // Request a withdrawal
// // async function requestWithdrawal(req, res) {
// //     try {
// //         const { walletId, amount } = req.body;
// //         const result = await cryptoInvestmentService.requestWithdrawal(walletId, amount);
// //         res.json({ success: true, message: result.message, transactionId: result.transactionId });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to request withdrawal: ' + error.message });
// //     }
// // }

// // // Approve or reject withdrawal (Admin action)
// // async function updateWithdrawalStatus(req, res) {
// //     try {
// //         const { transactionId, status } = req.body;
// //         if (!['accepted', 'rejected'].includes(status)) {
// //             return res.status(400).json({ success: false, message: 'Invalid status provided' });
// //         }
// //         const result = await cryptoInvestmentService.updateWithdrawalStatus(transactionId, status);
// //         res.json({ success: true, message: result.message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to update withdrawal status: ' + error.message });
// //     }
// // }

// // // Add earnings to a subscription
// // async function addEarnings(req, res) {
// //     try {
// //         const { subscriptionId, amount } = req.body;
// //         const result = await cryptoInvestmentService.addEarnings(subscriptionId, amount);
// //         res.json({ success: true, message: result.message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to add earnings: ' + error.message });
// //     }
// // }

// // // Create a new subscription plan for a wallet
// // async function createSubscription(req, res) {
// //     try {
// //         const { walletId, planId, durationMonths, reinvest } = req.body;
// //         const result = await cryptoInvestmentService.createSubscription(walletId, planId, durationMonths, reinvest);
// //         res.json({ success: true, message: result.message, subscriptionId: result.subscriptionId });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to create subscription: ' + error.message });
// //     }
// // }

// // // Handle subscription expiration
// // async function handleSubscriptionExpiration(req, res) {
// //     try {
// //         const { subscriptionId } = req.body;
// //         const result = await cryptoInvestmentService.handleSubscriptionExpiration(subscriptionId);
// //         res.json({ success: true, message: result.message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to handle subscription expiration: ' + error.message });
// //     }
// // }

// // // Request a payout
// // async function requestPayout(req, res) {
// //     try {
// //         const { walletId, amount } = req.body;
// //         const result = await cryptoInvestmentService.requestPayout(walletId, amount);
// //         res.json({ success: true, message: result.message, payoutId: result.payoutId });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to request payout: ' + error.message });
// //     }
// // }

// // // Approve or reject payout (Admin action)
// // async function updatePayoutStatus(req, res) {
// //     try {
// //         const { payoutId, status } = req.body;
// //         if (!['accepted', 'rejected'].includes(status)) {
// //             return res.status(400).json({ success: false, message: 'Invalid status provided' });
// //         }
// //         const result = await cryptoInvestmentService.updatePayoutStatus(payoutId, status);
// //         res.json({ success: true, message: result.message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to update payout status: ' + error.message });
// //     }
// // }

// // module.exports = {
// //     createWallet,
// //     deposit,
// //     updateDepositStatus,
// //     requestWithdrawal,
// //     updateWithdrawalStatus,
// //     addEarnings,
// //     createSubscription,
// //     handleSubscriptionExpiration,
// //     requestPayout,
// //     updatePayoutStatus
// // };



// // // const cryptoInvestmentService = require('../services/cryptoInvestmentService');

// // // // Create a new wallet for a user
// // // async function createWallet(req, res) {
// // //     try {
// // //         const { userId } = req.body;
// // //         const result = await cryptoInvestmentService.createWallet(userId);
// // //         res.json({ success: true, message: result.message, walletId: result.walletId });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to create wallet: ' + error.message });
// // //     }
// // // }

// // // // Deposit funds into the wallet
// // // async function deposit(req, res) {
// // //     try {
// // //         const { walletId, amount } = req.body;
// // //         const result = await cryptoInvestmentService.deposit(walletId, amount);
// // //         res.json({ success: true, message: result.message, transactionId: result.transactionId });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to initiate deposit: ' + error.message });
// // //     }
// // // }

// // // // Approve deposit (Admin action)
// // // async function approveDeposit(req, res) {
// // //     try {
// // //         const { transactionId } = req.body;
// // //         const result = await cryptoInvestmentService.approveDeposit(transactionId);
// // //         res.json({ success: true, message: result.message });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to approve deposit: ' + error.message });
// // //     }
// // // }

// // // // Request a withdrawal
// // // async function requestWithdrawal(req, res) {
// // //     try {
// // //         const { walletId, amount } = req.body;
// // //         const result = await cryptoInvestmentService.requestWithdrawal(walletId, amount);
// // //         res.json({ success: true, message: result.message, transactionId: result.transactionId });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to request withdrawal: ' + error.message });
// // //     }
// // // }

// // // // Approve withdrawal (Admin action)
// // // async function approveWithdrawal(req, res) {
// // //     try {
// // //         const { transactionId } = req.body;
// // //         const result = await cryptoInvestmentService.approveWithdrawal(transactionId);
// // //         res.json({ success: true, message: result.message });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to approve withdrawal: ' + error.message });
// // //     }
// // // }

// // // // Add earnings to a subscription
// // // async function addEarnings(req, res) {
// // //     try {
// // //         const { subscriptionId, amount } = req.body;
// // //         const result = await cryptoInvestmentService.addEarnings(subscriptionId, amount);
// // //         res.json({ success: true, message: result.message });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to add earnings: ' + error.message });
// // //     }
// // // }

// // // // Create a new subscription plan for a wallet
// // // async function createSubscription(req, res) {
// // //     try {
// // //         const { walletId, planId, durationMonths, reinvest } = req.body;
// // //         const result = await cryptoInvestmentService.createSubscription(walletId, planId, durationMonths, reinvest);
// // //         res.json({ success: true, message: result.message, subscriptionId: result.subscriptionId });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to create subscription: ' + error.message });
// // //     }
// // // }

// // // // Handle subscription expiration
// // // async function handleSubscriptionExpiration(req, res) {
// // //     try {
// // //         const { subscriptionId } = req.body;
// // //         const result = await cryptoInvestmentService.handleSubscriptionExpiration(subscriptionId);
// // //         res.json({ success: true, message: result.message });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to handle subscription expiration: ' + error.message });
// // //     }
// // // }

// // // // Request a payout
// // // async function requestPayout(req, res) {
// // //     try {
// // //         const { walletId, amount } = req.body;
// // //         const result = await cryptoInvestmentService.requestPayout(walletId, amount);
// // //         res.json({ success: true, message: result.message, payoutId: result.payoutId });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to request payout: ' + error.message });
// // //     }
// // // }

// // // // Approve a payout (Admin action)
// // // async function approvePayout(req, res) {
// // //     try {
// // //         const { payoutId } = req.body;
// // //         const result = await cryptoInvestmentService.approvePayout(payoutId);
// // //         res.json({ success: true, message: result.message });
// // //     } catch (error) {
// // //         res.status(500).json({ success: false, message: 'Failed to approve payout: ' + error.message });
// // //     }
// // // }

// // // module.exports = {
// // //     createWallet,
// // //     deposit,
// // //     approveDeposit,
// // //     requestWithdrawal,
// // //     approveWithdrawal,
// // //     addEarnings,
// // //     createSubscription,
// // //     handleSubscriptionExpiration,
// // //     requestPayout,
// // //     approvePayout
// // // };
