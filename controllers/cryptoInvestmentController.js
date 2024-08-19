const cryptoInvestmentService = require('../services/cryptoInvestmentService');

// Create a new wallet for a user
async function createWallet(req, res) {
    try {
        const { userId } = req.body;
        const result = await cryptoInvestmentService.createWallet(userId);
        res.json({ 
            success: true, 
            message: `Wallet successfully created for user ID: ${userId}.`, 
            walletId: result.walletId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to create wallet for user ID: ${userId}. Error: ${error.message}` 
        });
    }
}

// Deposit funds into the wallet
async function deposit(req, res) {
    try {
        const { walletId, amount } = req.body;
        const result = await cryptoInvestmentService.deposit(walletId, amount);
        res.json({ 
            success: true, 
            message: `Deposit of ${amount} successfully initiated for wallet ID: ${walletId}.`, 
            transactionId: result.transactionId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to initiate deposit of ${amount} for wallet ID: ${walletId}. Error: ${error.message}` 
        });
    }
}

// Update deposit status (Admin action)
async function updateDepositStatus(req, res) {
    try {
        const { transactionId, status } = req.body;
        const result = await cryptoInvestmentService.updateDepositStatus(transactionId, status);
        const action = status === 'accepted' ? 'approved' : 'rejected';
        res.json({ 
            success: true, 
            message: `Deposit ${action} for transaction ID: ${transactionId}.` 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to update deposit status for transaction ID: ${transactionId}. Error: ${error.message}` 
        });
    }
}

// Request a withdrawal
async function requestWithdrawal(req, res) {
    try {
        const { walletId, amount } = req.body;
        const result = await cryptoInvestmentService.requestWithdrawal(walletId, amount);
        res.json({ 
            success: true, 
            message: `Withdrawal request of ${amount} successfully initiated for wallet ID: ${walletId}.`, 
            transactionId: result.transactionId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to request withdrawal of ${amount} for wallet ID: ${walletId}. Error: ${error.message}` 
        });
    }
}

// Update withdrawal status (Admin action)
async function updateWithdrawalStatus(req, res) {
    try {
        const { transactionId, status } = req.body;
        const result = await cryptoInvestmentService.updateWithdrawalStatus(transactionId, status);
        const action = status === 'accepted' ? 'approved' : 'rejected';
        res.json({ 
            success: true, 
            message: `Withdrawal ${action} for transaction ID: ${transactionId}.` 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to update withdrawal status for transaction ID: ${transactionId}. Error: ${error.message}` 
        });
    }
}

// Add earnings to a subscription
async function addEarnings(req, res) {
    try {
        const { subscriptionId, amount } = req.body;
        const result = await cryptoInvestmentService.addEarnings(subscriptionId, amount);
        res.json({ 
            success: true, 
            message: `Earnings of ${amount} successfully added to subscription ID: ${subscriptionId}.`, 
            transactionId: result.transactionId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to add earnings of ${amount} to subscription ID: ${subscriptionId}. Error: ${error.message}` 
        });
    }
}

// Create a new subscription plan for a wallet
async function createSubscription(req, res) {
    try {
        const { walletId, planId, durationMonths, reinvest } = req.body;
        const result = await cryptoInvestmentService.createSubscription(walletId, planId, durationMonths, reinvest);
        res.json({ 
            success: true, 
            message: `Subscription plan ${planId} successfully created for wallet ID: ${walletId} with a duration of ${durationMonths} months${reinvest ? ', reinvest option enabled' : ''}.`, 
            subscriptionId: result.subscriptionId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to create subscription plan ${planId} for wallet ID: ${walletId}. Error: ${error.message}` 
        });
    }
}

// Handle subscription expiration
async function handleSubscriptionExpiration(req, res) {
    try {
        const { subscriptionId } = req.body;
        const result = await cryptoInvestmentService.handleSubscriptionExpiration(subscriptionId);
        res.json({ 
            success: true, 
            message: `Subscription ID: ${subscriptionId} successfully handled. ${result.message}` 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to handle subscription expiration for subscription ID: ${subscriptionId}. Error: ${error.message}` 
        });
    }
}

// Request a payout
async function requestPayout(req, res) {
    try {
        const { walletId, amount } = req.body;
        const result = await cryptoInvestmentService.requestPayout(walletId, amount);
        res.json({ 
            success: true, 
            message: `Payout request of ${amount} successfully initiated for wallet ID: ${walletId}.`, 
            payoutId: result.payoutId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to request payout of ${amount} for wallet ID: ${walletId}. Error: ${error.message}` 
        });
    }
}

// Update payout status (Admin action)
async function updatePayoutStatus(req, res) {
    try {
        const { payoutId, status } = req.body;
        const result = await cryptoInvestmentService.updatePayoutStatus(payoutId, status);
        const action = status === 'accepted' ? 'approved' : 'rejected';
        res.json({ 
            success: true, 
            message: `Payout ${action} for payout ID: ${payoutId}.` 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Failed to update payout status for payout ID: ${payoutId}. Error: ${error.message}` 
        });
    }
}

module.exports = {
    createWallet,
    deposit,
    updateDepositStatus,
    requestWithdrawal,
    updateWithdrawalStatus,
    addEarnings,
    createSubscription,
    handleSubscriptionExpiration,
    requestPayout,
    updatePayoutStatus
};


// const cryptoInvestmentService = require('../services/cryptoInvestmentService');

// // Create a new wallet for a user
// async function createWallet(req, res) {
//     try {
//         const { userId } = req.body;
//         const result = await cryptoInvestmentService.createWallet(userId);
//         res.json({ success: true, message: result.message, walletId: result.walletId });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to create wallet: ' + error.message });
//     }
// }

// // Deposit funds into the wallet
// async function deposit(req, res) {
//     try {
//         const { walletId, amount } = req.body;
//         const result = await cryptoInvestmentService.deposit(walletId, amount);
//         res.json({ success: true, message: result.message, transactionId: result.transactionId });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to initiate deposit: ' + error.message });
//     }
// }

// // Approve or reject deposit (Admin action)
// async function updateDepositStatus(req, res) {
//     try {
//         const { transactionId, status } = req.body;
//         if (!['accepted', 'rejected'].includes(status)) {
//             return res.status(400).json({ success: false, message: 'Invalid status provided' });
//         }
//         const result = await cryptoInvestmentService.updateDepositStatus(transactionId, status);
//         res.json({ success: true, message: result.message });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to update deposit status: ' + error.message });
//     }
// }

// // Request a withdrawal
// async function requestWithdrawal(req, res) {
//     try {
//         const { walletId, amount } = req.body;
//         const result = await cryptoInvestmentService.requestWithdrawal(walletId, amount);
//         res.json({ success: true, message: result.message, transactionId: result.transactionId });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to request withdrawal: ' + error.message });
//     }
// }

// // Approve or reject withdrawal (Admin action)
// async function updateWithdrawalStatus(req, res) {
//     try {
//         const { transactionId, status } = req.body;
//         if (!['accepted', 'rejected'].includes(status)) {
//             return res.status(400).json({ success: false, message: 'Invalid status provided' });
//         }
//         const result = await cryptoInvestmentService.updateWithdrawalStatus(transactionId, status);
//         res.json({ success: true, message: result.message });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to update withdrawal status: ' + error.message });
//     }
// }

// // Add earnings to a subscription
// async function addEarnings(req, res) {
//     try {
//         const { subscriptionId, amount } = req.body;
//         const result = await cryptoInvestmentService.addEarnings(subscriptionId, amount);
//         res.json({ success: true, message: result.message });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to add earnings: ' + error.message });
//     }
// }

// // Create a new subscription plan for a wallet
// async function createSubscription(req, res) {
//     try {
//         const { walletId, planId, durationMonths, reinvest } = req.body;
//         const result = await cryptoInvestmentService.createSubscription(walletId, planId, durationMonths, reinvest);
//         res.json({ success: true, message: result.message, subscriptionId: result.subscriptionId });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to create subscription: ' + error.message });
//     }
// }

// // Handle subscription expiration
// async function handleSubscriptionExpiration(req, res) {
//     try {
//         const { subscriptionId } = req.body;
//         const result = await cryptoInvestmentService.handleSubscriptionExpiration(subscriptionId);
//         res.json({ success: true, message: result.message });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to handle subscription expiration: ' + error.message });
//     }
// }

// // Request a payout
// async function requestPayout(req, res) {
//     try {
//         const { walletId, amount } = req.body;
//         const result = await cryptoInvestmentService.requestPayout(walletId, amount);
//         res.json({ success: true, message: result.message, payoutId: result.payoutId });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to request payout: ' + error.message });
//     }
// }

// // Approve or reject payout (Admin action)
// async function updatePayoutStatus(req, res) {
//     try {
//         const { payoutId, status } = req.body;
//         if (!['accepted', 'rejected'].includes(status)) {
//             return res.status(400).json({ success: false, message: 'Invalid status provided' });
//         }
//         const result = await cryptoInvestmentService.updatePayoutStatus(payoutId, status);
//         res.json({ success: true, message: result.message });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to update payout status: ' + error.message });
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

// // // Approve deposit (Admin action)
// // async function approveDeposit(req, res) {
// //     try {
// //         const { transactionId } = req.body;
// //         const result = await cryptoInvestmentService.approveDeposit(transactionId);
// //         res.json({ success: true, message: result.message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to approve deposit: ' + error.message });
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

// // // Approve withdrawal (Admin action)
// // async function approveWithdrawal(req, res) {
// //     try {
// //         const { transactionId } = req.body;
// //         const result = await cryptoInvestmentService.approveWithdrawal(transactionId);
// //         res.json({ success: true, message: result.message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to approve withdrawal: ' + error.message });
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

// // // Approve a payout (Admin action)
// // async function approvePayout(req, res) {
// //     try {
// //         const { payoutId } = req.body;
// //         const result = await cryptoInvestmentService.approvePayout(payoutId);
// //         res.json({ success: true, message: result.message });
// //     } catch (error) {
// //         res.status(500).json({ success: false, message: 'Failed to approve payout: ' + error.message });
// //     }
// // }

// // module.exports = {
// //     createWallet,
// //     deposit,
// //     approveDeposit,
// //     requestWithdrawal,
// //     approveWithdrawal,
// //     addEarnings,
// //     createSubscription,
// //     handleSubscriptionExpiration,
// //     requestPayout,
// //     approvePayout
// // };
