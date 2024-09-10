const cryptoInvestmentService = require('../services/cryptoInvestmentService');

// Controller for creating a new currency
const createCurrency = async (req, res) => {
    const { code, symbol, name } = req.body;

    try {
        const response = await cryptoInvestmentService.createCurrency(code, symbol, name);
        res.status(201).json({ message: 'Currency created successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create currency', error: error.message });
    }
};

// Controller for updating an existing currency
const updateCurrency = async (req, res) => {
    const { id, code, symbol, name } = req.body;

    try {
        const response = await cryptoInvestmentService.updateCurrency(id, code, symbol, name);
        res.status(200).json({ message: 'Currency updated successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update currency', error: error.message });
    }
};

// Controller for deleting a currency
const deleteCurrency = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await cryptoInvestmentService.deleteCurrency(id);
        if (response.affectedRows === 0) {
            return res.status(404).json({ message: 'Currency not found or already deleted' });
        }
        res.status(200).json({ message: 'Currency deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete currency', error: error.message });
    }
};

// Controller for retrieving all currencies
const getAllCurrencies = async (req, res) => {
    try {
        const currencies = await cryptoInvestmentService.getAllCurrencies();
        res.status(200).json({ message: 'Currencies retrieved successfully', data: currencies });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve currencies', error: error.message });
    }
};


const createWallet = async (req, res) => {

    const { userId, currencyId } = req.body;

    if (!userId || !currencyId) {
        return res.status(400).json({
            success: false,
            message: 'userId and currencyId are required fields',
        });
    }

    try {
        // Attempt to create a wallet
        const result = await cryptoInvestmentService.createWallet(userId, currencyId);

        // Check if the creation was successful
        if (result.success === false) {
            // Send a 500 error response with a detailed error message
            res.status(500).json({
                success: false,
                message: result.message || 'Failed to create wallet',
            });
        } else {
            // Send a 201 success response with wallet details and additional info
            res.status(201).json({
                success: true,
                message: result.message || 'Wallet created successfully',
                walletId: result.walletId,
                walletAddress: result.walletAddress,
                additionalInfo: result.additionalInfo, // Include any additional info (e.g., generation message)
            });
        }
    } catch (error) {
        // Send a 500 error response with a detailed error message for unexpected errors
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`,
        });
    }
};

// Controller for creating a new wallet
// const createWallet = async (req, res) => {
//     const { userId, currencyId } = req.body;

//     try {
//         const response = await cryptoInvestmentService.createWallet(userId, currencyId);
//         res.status(201).json({ message: 'Wallet created successfully', data: response });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create wallet', error: error.message });
//     }
// };

// Controller for crediting a wallet
// const creditWallet = async (req, res) => {
//     const { walletId, amount } = req.body;

//     try {
//         const response = await cryptoInvestmentService.creditWallet(walletId, amount);
//         if (response.affectedRows === 0) {
//             return res.status(404).json({ message: 'Wallet not found' });
//         }
//         res.status(200).json({ message: 'Wallet credited successfully', data: response });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to credit wallet', error: error.message });
//     }
// };


// Controller function to handle credit wallet requests
const creditWallet = async (req, res) => {
    const { walletId, depositId, amount } = req.body;

    // Check for missing fields and provide explicit error messages
    if (!walletId) {
        return res.status(400).json({
            message: 'Validation Error: Wallet ID is required.'
        });
    }
    
    if (!depositId) {
        return res.status(400).json({
            message: 'Validation Error: Deposit ID is required.'
        });
    }

    if (!amount) {
        return res.status(400).json({
            message: 'Validation Error: Amount is required.'
        });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            message: 'Validation Error: The amount must be a positive number greater than zero.'
        });
    }

    try {
        // Call the service to credit the wallet
        const result = await cryptoInvestmentService.creditWallet(walletId, depositId, parseFloat(amount));

        // Successful crediting response
        return res.status(200).json({
            message: 'Success: The wallet has been credited successfully.',
            creditedAmount: result.creditedAmount,
            allowableAmount: result.allowableAmount,
            detail: `An amount of ${result.creditedAmount} has been credited to the wallet. The maximum allowable amount for this transaction was ${result.allowableAmount}.`
        });

    } catch (error) {
        // Handle pending deposit status
        if (error.message.includes('pending')) {
            return res.status(400).json({
                message: 'Transaction Denied: The deposit associated with this wallet is still pending.',
                detail: 'Crediting the wallet is not allowed until the deposit has been accepted. Please try again after the deposit status is updated to accepted.'
            });
        }

        // Handle amount exceeding the allowable limit
        if (error.message.includes('exceeds the allowable limit')) {
            return res.status(400).json({
                message: 'Transaction Denied: The requested amount exceeds the allowable credit limit.',
                detail: error.message // This will include details about the deposit amount, earnings, and the maximum allowable credit
            });
        }

        // Generic error response
        return res.status(500).json({
            message: 'Internal Server Error: An unexpected error occurred while processing the request.',
            error: error.message
        });
    }
};







// Controller for requesting a deposit
const requestDeposit = async (req, res) => {
    const { walletId, amount, currencyId, proofOfPayment } = req.body;

    try {
        const response = await cryptoInvestmentService.requestDeposit(walletId, amount, currencyId, proofOfPayment);
        res.status(201).json({ message: 'Deposit requested successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to request deposit', error: error.message });
    }
};

// Controller for updating deposit status
const updateDepositStatus = async (req, res) => {
    const { depositId } = req.params;
    const { status } = req.body;

    try {
        const response = await cryptoInvestmentService.updateDepositStatus(depositId, status);
        if (response.affectedRows === 0) {
            return res.status(404).json({ message: 'Deposit not found' });
        }
        res.status(200).json({ message: 'Deposit status updated successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update deposit status', error: error.message });
    }
};


// const updateDepositStatusCreditWalletAndApproval = async(req, res)=>{
//     const { depositId, newStatus } = req.body;

//     try {
//         // Validate input parameters
//         if (!depositId || !newStatus) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Missing required fields: depositId and newStatus.',
//             });
//         }

//         // Check if the newStatus is valid
//         if (newStatus !== 'accepted' && newStatus !== 'rejected') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid status. Only "accepted" or "rejected" are allowed.',
//             });
//         }

//         // Call the service method to update the deposit status
//         const result = await cryptoInvestmentService.updateDepositStatusCreditWalletAndApproval(depositId, newStatus);

//         // Return the response from the service method
//         if (result.success) {
//             return res.status(200).json({
//                 success: true,
//                 message: result.message,
//             });
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: result.message,
//             });
//         }

//     } catch (error) {
//         // Log the error (if you have a logging mechanism) and return a generic error response
//         console.error('Error in updateDepositStatus:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'An unexpected error occurred while updating deposit status.',
//         });
//     }

// }

const updateDepositStatusCreditWalletAndApproval = async (req, res) => {
    const { depositId } = req.params;  // Extract depositId from the route params
    const { status } = req.body;  // Extract status from the request body

    try {
        // Validate input parameters
        if (!depositId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: depositId and status.',
            });
        }

        // Check if the status is valid
        if (status !== 'accepted' && status !== 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Only "accepted" or "rejected" are allowed.',
            });
        }

        // Call the service method to update the deposit status
        const result = await cryptoInvestmentService.updateDepositStatusCreditWalletAndApproval(depositId, status);

        // Return the response from the service method
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }

    } catch (error) {
        // Log the error and return a generic error response
        console.error('Error in updateDepositStatus:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while updating deposit status.',
        });
    }
};



const getLockedFunds = async (req, res) => {
    try {
        const result = await cryptoInvestmentService.getLockedFunds();

        if (result.success) {
            return res.status(200).json({
                message: 'Locked funds retrieved successfully.',
                data: result.data,
            });
        } else {
            return res.status(404).json({
                message: 'No locked funds found.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Failed to retrieve locked funds. Error: ${error.message}`,
        });
    }
};

const getRecentDeposits = async (req, res) => {
    try {
        const result = await cryptoInvestmentService.getRecentDeposits();

        if (result.success) {
            return res.status(200).json({
                message: 'Recent deposits retrieved successfully.',
                data: result.data,
            });
        } else {
            return res.status(404).json({
                message: 'No recent deposits found.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Failed to retrieve recent deposits. Error: ${error.message}`,
        });
    }
};

const getRecentWithdrawals = async (req, res) => {
    try {
        const result = await cryptoInvestmentService.getRecentWithdrawals();

        if (result.success) {
            return res.status(200).json({
                message: 'Recent withdrawals retrieved successfully.',
                data: result.data,
            });
        } else {
            return res.status(404).json({
                message: 'No recent withdrawals found.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Failed to retrieve recent withdrawals. Error: ${error.message}`,
        });
    }
};       


const getWalletsByCurrencyId = async (req, res) => {
    const { currencyId } = req.params;

    try {
        // Call the service function to get wallet details by currency ID
        const result = await cryptoInvestmentService.userWallet(currencyId);

        // Check if the service returned a message indicating no wallets were found
        if (result.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No wallets found for the provided currency ID',
            });
        }

        // Return a success response with the wallet details
        return res.status(200).json({
            success: true,
            message: 'Wallet details retrieved successfully',
            data: result.data,
        });
    } catch (error) {
        // Handle errors and return a server error response
        return res.status(500).json({
            success: false,
            message: `An error occurred while retrieving wallet details: ${error.message}`,
        });
    }
};


const getUserWallets = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await cryptoInvestmentService.getUserWallets(userId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({
            message: result.message,
            groupedWallets: result.data,
        });
    } catch (error) {
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};

const getTransactionHistory = async (req, res) => {
    const { walletId } = req.params;

    try {
        const result = await cryptoInvestmentService.getTransactionHistory(walletId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({
            message: result.message,
            transactions: result.data,
        });
    } catch (error) {
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};


// Controller to get user details with wallet and currency info
// Controller to handle fetching user details along with wallet and currency information
// Controller to handle fetching user details along with wallet and currency information
async function getUserDetailsWithWallet(req, res) {
    const { userId } = req.params;

    try {
        const result = await cryptoInvestmentService.getUserWalletDetails(userId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                user: result.user,
                wallet: result.wallet
            }
        });
    } catch (error) {
        console.error('Error fetching user wallet details:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


// const getUserWalletAndSubscriptionPlanDetails = async (req, res) => {
//     const { userId } = req.params;
//     const { currencyId, currencyCode, currencyName } = req.query;  // Capture filters from query params

//     const currencyFilter = {
//         currencyId: currencyId || null,
//         currencyCode: currencyCode || null,
//         currencyName: currencyName || null
//     };

//     try {
//         const result = await cryptoInvestmentService.getUserWalletAndSubscriptionPlanDetails(userId, currencyFilter);

//         if (!result.success) {
//             return res.status(404).json({ message: result.message });
//         }

//         return res.status(200).json({
//             success: true,
//             message: result.message,
//             data: result.data
//         });
//     } catch (error) {
//         console.error('Error fetching user wallet details:', error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// const getUserWalletAndSubscriptionPlanDetails = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         // Validate userId
//         if (!userId || isNaN(userId)) {
//             return res.status(400).json({ success: false, message: 'Invalid user ID format' });
//         }

//         // Fetch details from the service
//         const result = await cryptoInvestmentService.getUserWalletAndSubscriptionPlanDetails(userId);

//         if (!result.success) {
//             if (result.message === 'No details found for the given user ID') {
//                 return res.status(404).json({ success: false, message: result.message });
//             }
//             return res.status(500).json({ success: false, message: result.message });
//         }

//         return res.status(200).json({
//             success: true,
//             message: result.message,
//             data: {
//                 user: result.data.user,
//                 wallets: result.data.wallets,
//                 subscriptions: result.data.subscriptions
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching user details:', error);
//         return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
//     }
// };


const getUserWalletAndSubscriptionPlanDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        // Validate userId
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID format' });
        }

        // Fetch details from the service
        const result = await cryptoInvestmentService.getUserWalletAndSubscriptionPlanDetails(userId);

        if (!result.success) {
            if (result.message === 'No details found for the given user ID') {
                return res.status(404).json({ success: false, message: result.message });
            }
            return res.status(500).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                user: result.data.user,
                wallets: result.data.wallets,
                subscriptions: result.data.subscriptions
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
    }
};






// Controller for handling deposit and subscription
// const handleDepositAndSubscription = async (req, res) => {
//     const { walletId, planId, currencyId, depositAmount, proofOfPayment } = req.body;

//     try {
//         const response = await cryptoInvestmentService.handleDepositAndSubscription(walletId, planId, currencyId, depositAmount, proofOfPayment);
//         res.status(201).json({ message: 'Deposit and subscription processed successfully', data: response });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to process deposit and subscription', error: error.message });
//     }
// };


// Controller for handling deposit and subscription
// const handleDepositAndSubscription = async (req, res) => {
//     const { walletId, planId, currencyId, depositAmount } = req.body;

//     // Retrieve file path or set to null if no file is uploaded
//     const proofOfPayment = req.file ? req.file.path : null;

//     try {
//         // Validate the necessary fields
//         if (!walletId || !planId || !currencyId || !depositAmount) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "Please provide all required fields: walletId, planId, currencyId, depositAmount."
//             });
//         }

//         // Check if proofOfPayment is required and provided
//         if (!proofOfPayment) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "Proof of payment is required. Please upload a valid file."
//             });
//         }

//         // Call the service to handle the deposit and subscription
//         const response = await cryptoInvestmentService.handleDepositAndSubscription(walletId, planId, currencyId, depositAmount, proofOfPayment);

//         // Return success response
//         res.status(201).json({
//             status: "success",
//             message: "Deposit and subscription processed successfully.",
//             data: response
//         });
//     } catch (error) {
//         console.error("Error processing deposit and subscription:", error);
//         // Return error response
//         res.status(500).json({
//             status: "error",
//             message: "Failed to process deposit and subscription.",
//             error: error.message
//         });
//     }
// };



// const handleDepositAndSubscription = async (req, res) => {
//     try {
//         const { walletId, planId, currencyId, depositAmount } = req.body;

//         // Retrieve file path or set to null if no file is uploaded
//         const proofOfPayment = req.file ? req.file.path : null;

//         // Call the service to handle deposit and subscription
//         const result = await cryptoInvestmentService.handleDepositAndSubscription(walletId, planId, currencyId, depositAmount, proofOfPayment);

//         if (result.success) {
//             return res.status(200).json({
//                 success: true,
//                 message: `Deposit request submitted successfully for subscription plan ${result.planLabel}. Admin approval is required.`,
//                 subscriptionId: result.subscriptionId,
//                 earnings: result.earnings,
//                 depositId: result.depositId,
//                 proofOfPayment: proofOfPayment ? 'File uploaded successfully.' : 'No proof of payment file uploaded.',
//             });
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: result.message,
//             });
//         }
//     } catch (error) {
//         console.error('Error processing deposit and subscription:', error.message);
//         return res.status(500).json({
//             success: false,
//             message: 'An error occurred while processing the deposit and subscription.',
//             error: error.message,
//         });
//     }
// };

// const handleDepositAndSubscription = async (req, res) => {
//     try {
//         const { walletId, planId, currencyId, depositAmount } = req.body;

//         // Retrieve file path or set to null if no file is uploaded
//         const proofOfPayment = req.file ? req.file.path : null;

//         // Call the service to handle deposit and subscription
//         const result = await cryptoInvestmentService.handleDepositAndSubscription(walletId, planId, currencyId, depositAmount, proofOfPayment);

//         if (result.success) {
//             return res.status(200).json({
//                 success: true,
//                 message: result.message,
//                 subscriptionId: result.subscriptionId,
//                 earnings: result.earnings,
//                 depositId: result.depositId,
//                 planLabel: result.planLabel, // Include the plan label in the response
//                 proofOfPayment: proofOfPayment ? 'File uploaded successfully.' : 'No proof of payment file uploaded.',
//             });
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: result.message,
//             });
//         }
//     } catch (error) {
//         console.error('Error processing deposit and subscription:', error.message);
//         return res.status(500).json({
//             success: false,
//             message: 'An error occurred while processing the deposit and subscription.',
//             error: error.message,
//         });
//     }
// };


// const handleDepositAndSubscription = async (req, res) => {
//     try {
//         const { walletId, planId, currencyId, depositAmount } = req.body;

//         // Retrieve file path or set to null if no file is uploaded
//         const proofOfPayment = req.file ? req.file.path : null;

//         // Call the service to handle deposit and subscription
//         const result = await cryptoInvestmentService.handleDepositAndSubscription(walletId, planId, currencyId, depositAmount, proofOfPayment);

//         if (result.success) {
//             return res.status(200).json({
//                 success: true,
//                 message: result.message,
//                 subscriptionId: result.subscriptionId,
//                 earnings: result.earnings,
//                 depositId: result.depositId,
//                 totalAmount: result.totalAmount, // Include the total amount in the response
//                 planLabel: result.planLabel, // Include the plan label
//                 proofOfPayment: proofOfPayment ? 'File uploaded successfully.' : 'No proof of payment file uploaded.',
//             });
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: result.message,
//             });
//         }
//     } catch (error) {
//         console.error('Error processing deposit and subscription:', error.message);
//         return res.status(500).json({
//             success: false,
//             message: 'An error occurred while processing the deposit and subscription.',
//             error: error.message,
//         });
//     }
// };


const handleDepositAndSubscription = async (req, res) => {
    try {
        const { walletId, planId, currencyId, depositAmount, userId } = req.body;

        // Retrieve file path or set to null if no file is uploaded
        const proofOfPayment = req.file ? req.file.path : null;

        // Call the service to handle deposit and subscription
        const result = await cryptoInvestmentService.handleDepositAndSubscription(walletId, planId, currencyId, depositAmount, proofOfPayment, userId);
        // const result = await cryptoInvestmentService.handleDepositAndSubscription(walletId, planId, currencyId, depositAmount, proofOfPayment);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                subscriptionId: result.subscriptionId,
                earnings: result.totalInterest, // Set earnings to totalInterest
                earnings: result.earnings,
                userId:result.userId,
                depositId: result.depositId,
                totalAmount: result.totalAmount, // Include the total amount in the response
                planLabel: result.planLabel, // Include the plan label
                dailyInterestGain: result.dailyInterestGain, // Include the daily interest gain
                dailyTotalAmount: result.dailyTotalAmount, // Include the daily total amount
                proofOfPayment: proofOfPayment ? 'File uploaded successfully.' : 'No proof of payment file uploaded.',
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }
    } catch (error) {
        console.error('Error processing deposit and subscription:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing the deposit and subscription.',
            error: error.message,
        });
    }
};


const listAllSubscriptions = async (req, res) => {
    try {
        // Fetch all subscriptions using the service function
        const subscriptions = await getAllSubscriptions();

        if (subscriptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No subscriptions found. It may be empty or all subscriptions have been deleted.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'All subscriptions retrieved successfully.',
            data: subscriptions
        });
    } catch (error) {
        console.error('Error retrieving subscriptions:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving subscriptions. Please try again later.',
            error: error.message
        });
    }
};



// Controller to handle getting subscriptions by criteria

// const getSubscriptionByCriteria = async (req, res) => {
//     try {
//         const { userId, depositId, walletId, subscriptionId } = req.query;

//         // Check if at least one criteria is provided
//         if (!userId && !depositId && !walletId && !subscriptionId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'At least one criterion (userId, depositId, walletId, subscriptionId) must be provided to fetch subscriptions.'
//             });
//         }

//         // Fetch subscription details using the service function
//         const subscriptions = await getSubscriptionByCriteria({ userId, depositId, walletId, subscriptionId });

//         if (subscriptions.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No subscriptions found for the provided criteria. Please verify the details and try again.'
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Subscriptions retrieved successfully.',
//             data: subscriptions
//         });
//     } catch (error) {
//         console.error('Error retrieving subscription details:', error.message);
//         return res.status(500).json({
//             success: false,
//             message: 'An error occurred while retrieving subscription details. Please try again later.',
//             error: error.message
//         });
//     }
// };




const deleteSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        // Validate subscriptionId
        if (!subscriptionId) {
            return res.status(400).json({
                success: false,
                message: 'Subscription ID is required.'
            });
        }

        // Call the service to delete the subscription
        const result = await deleteSubscription(subscriptionId);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Subscription deleted successfully.',
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message || 'Failed to delete the subscription. It may not exist or be already deleted.',
            });
        }
    } catch (error) {
        console.error('Error deleting subscription:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the subscription. Please try again later.',
            error: error.message
        });
    }
};





// Controller for retrieving all deposits
const getAllDeposits = async (req, res) => {
    try {
        const deposits = await cryptoInvestmentService.getAllDeposits();
        res.status(200).json({ message: 'Deposits retrieved successfully', data: deposits });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve deposits', error: error.message });
    }
};


const getAllUnapprovedDeposits = async (req, res) => {
    try {
        const unapprovedDeposits = await cryptoInvestmentService.getAllUnapprovedDeposits();
        if (!unapprovedDeposits || unapprovedDeposits.length === 0) {
            return res.status(404).json({ message: "No unapproved deposits found." });
        }
        res.status(200).json(unapprovedDeposits);
    } catch (error) {
        console.error('Error retrieving unapproved deposits:', error);
        res.status(500).json({
            message: "Failed to retrieve pending deposits",
            error: error.message
        });
    }
};

// Controller for requesting a withdrawal
const requestWithdrawal = async (req, res) => {
    const { walletId, amount, currencyId } = req.body;

    try {
        const response = await cryptoInvestmentService.requestWithdrawal(walletId, amount, currencyId);
        res.status(201).json({ message: 'Withdrawal requested successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to request withdrawal', error: error.message });
    }
};

// Controller for updating withdrawal status
const updateWithdrawalStatus = async (req, res) => {
    const { transactionId } = req.params;
    const { status } = req.body;

    try {
        const response = await cryptoInvestmentService.updateWithdrawalStatus(transactionId, status);
        if (response.affectedRows === 0) {
            return res.status(404).json({ message: 'Withdrawal transaction not found' });
        }
        res.status(200).json({ message: 'Withdrawal status updated successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update withdrawal status', error: error.message });
    }
};

// Controller for retrieving all transactions by wallet ID
const getAllTransactionsByWalletId = async (req, res) => {
    const { walletId } = req.params;

    try {
        const transactions = await cryptoInvestmentService.getAllTransactionsByWalletId(walletId);
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this wallet ID' });
        }
        res.status(200).json({ message: 'Transactions retrieved successfully', data: transactions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve transactions', error: error.message });
    }
};

// Controller for retrieving user wallet and subscription details
const getUserWalletAndSubscriptionDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        const details = await cryptoInvestmentService.getUserWalletAndSubscriptionDetails(userId);
        if (!details) {
            return res.status(404).json({ message: 'User details not found' });
        }
        res.status(200).json({ message: 'User wallet and subscription details retrieved successfully', data: details });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user wallet and subscription details', error: error.message });
    }
};

// Controller for creating a new subscription
const createSubscription = async (req, res) => {
    const { walletId, planId, currencyId, reinvest } = req.body;

    try {
        const response = await cryptoInvestmentService.createSubscription(walletId, planId, currencyId, reinvest);
        res.status(201).json({ message: 'Subscription created successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subscription', error: error.message });
    }
};

// Controller for updating an existing subscription
const updateSubscription = async (req, res) => {
    const { subscriptionId, reinvest, endDate } = req.body;

    try {
        const response = await cryptoInvestmentService.updateSubscription(subscriptionId, reinvest, endDate);
        if (response.affectedRows === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription updated successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subscription', error: error.message });
    }
};

// Controller for retrieving all subscriptions by wallet ID
const getAllSubscriptionsByWalletId = async (req, res) => {
    const { walletId } = req.params;

    try {
        const subscriptions = await cryptoInvestmentService.getAllSubscriptionsByWalletId(walletId);
        if (subscriptions.length === 0) {
            return res.status(404).json({ message: 'No subscriptions found for this wallet ID' });
        }
        res.status(200).json({ message: 'Subscriptions retrieved successfully', data: subscriptions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve subscriptions', error: error.message });
    }
};

// Controller for retrieving all subscriptions
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await cryptoInvestmentService.getAllSubscriptions();
        res.status(200).json({ message: 'Subscriptions retrieved successfully', data: subscriptions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve subscriptions', error: error.message });
    }
};

// Controller for retrieving subscription details by ID
const getSubscriptionDetails = async (req, res) => {
    const { subscriptionId } = req.params;

    try {
        const subscription = await cryptoInvestmentService.getSubscriptionDetails(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription details retrieved successfully', data: subscription });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve subscription details', error: error.message });
    }
};

// Controller for retrieving subscription earnings by wallet ID
const getSubscriptionEarnings = async (req, res) => {
    const { walletId } = req.params;

    try {
        const earnings = await cryptoInvestmentService.getSubscriptionEarnings(walletId);
        if (earnings.length === 0) {
            return res.status(404).json({ message: 'No earnings found for this wallet ID' });
        }
        res.status(200).json({ message: 'Subscription earnings retrieved successfully', data: earnings });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve subscription earnings', error: error.message });
    }
};

// Controller for updating subscription earnings
const updateSubscriptionEarnings = async (req, res) => {
    const { walletId, earnings } = req.body;

    try {
        const response = await cryptoInvestmentService.updateSubscriptionEarnings(walletId, earnings);
        if (response.affectedRows === 0) {
            return res.status(404).json({ message: 'Subscription earnings update failed' });
        }
        res.status(200).json({ message: 'Subscription earnings updated successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subscription earnings', error: error.message });
    }
};

// Controller for retrieving deposits by wallet ID
const getDepositsByWalletId = async (req, res) => {
    const { walletId } = req.params;

    try {
        const deposits = await cryptoInvestmentService.getDepositsByWalletId(walletId);
        if (deposits.length === 0) {
            return res.status(404).json({ message: 'No deposits found for this wallet ID' });
        }
        res.status(200).json({ message: 'Deposits retrieved successfully', data: deposits });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve deposits by wallet ID', error: error.message });
    }
};

// Controller for retrieving withdrawals by wallet ID
const getWithdrawalsByWalletId = async (req, res) => {
    const { walletId } = req.params;

    try {
        const withdrawals = await cryptoInvestmentService.getWithdrawalsByWalletId(walletId);
        if (withdrawals.length === 0) {
            return res.status(404).json({ message: 'No withdrawals found for this wallet ID' });
        }
        res.status(200).json({ message: 'Withdrawals retrieved successfully', data: withdrawals });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve withdrawals by wallet ID', error: error.message });
    }
};

// Controller for retrieving payouts by wallet ID
const getPayoutsByWalletId = async (req, res) => {
    const { walletId } = req.params;

    try {
        const payouts = await cryptoInvestmentService.getPayoutsByWalletId(walletId);
        if (payouts.length === 0) {
            return res.status(404).json({ message: 'No payouts found for this wallet ID' });
        }
        res.status(200).json({ message: 'Payouts retrieved successfully', data: payouts });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve payouts by wallet ID', error: error.message });
    }
};

// Controller for retrieving all payouts
const getAllPayouts = async (req, res) => {
    try {
        const payouts = await cryptoInvestmentService.getAllPayouts();
        res.status(200).json({ message: 'Payouts retrieved successfully', data: payouts });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve payouts', error: error.message });
    }
};

// Controller for requesting a payout
const requestPayout = async (req, res) => {
    const { walletId, amount, currencyId } = req.body;

    try {
        const response = await cryptoInvestmentService.requestPayout(walletId, amount, currencyId);
        res.status(201).json({ message: 'Payout requested successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to request payout', error: error.message });
    }
};

// Controller for updating payout status
const updatePayoutStatus = async (req, res) => {
    const { payoutId } = req.params;
    const { status } = req.body;

    try {
        const response = await cryptoInvestmentService.updatePayoutStatus(payoutId, status);
        if (response.affectedRows === 0) {
            return res.status(404).json({ message: 'Payout not found' });
        }
        res.status(200).json({ message: 'Payout status updated successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update payout status', error: error.message });
    }
};


const updateDepositProof = async (req, res) => {
    try {
        const { depositId } = req.params;

        // Retrieve file path or set to null if no file is uploaded
        const proofOfPayment = req.file ? req.file.path : null;

        if (!proofOfPayment) {
            return res.status(400).json({
                status: "error",
                message: "No file uploaded. Please upload a valid proof of payment."
            });
        }

        // Call the service to update the deposit with the new proof of payment
        const updatedDeposit = await cryptoInvestmentService.updateDepositProof(depositId, proofOfPayment);

        if (!updatedDeposit) {
            return res.status(404).json({
                status: "error",
                message: "Deposit not found or could not be updated."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Proof of payment updated successfully.",
            deposit: updatedDeposit
        });
    } catch (error) {
        console.error("Error updating proof of payment:", error);
        return res.status(500).json({
            status: "error",
            message: "An unexpected error occurred while updating the proof of payment."
        });
    }
};


// Controller function to get subscriptions by criteria
const getSubscriptionsByCriteria = async (req, res) => {
    try {
        const { userId, depositId, walletId, subscriptionId } = req.query;

        // Validate input criteria
        if (!userId && !depositId && !walletId && !subscriptionId) {
            return res.status(400).json({
                success: false,
                message: 'At least one query parameter (userId, depositId, walletId, or subscriptionId) is required.'
            });
        }

        // Call the service function
        const subscriptions = await cryptoInvestmentService.getSubscriptionsByCriteria({
            userId,
            depositId,
            walletId,
            subscriptionId
        });

        // Check if any subscriptions were found
        if (subscriptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No subscriptions found for the provided criteria.'
            });
        }

        // Return the list of subscriptions
        return res.status(200).json({
            success: true,
            message: 'Subscriptions retrieved successfully.',
            data: subscriptions
        });
    } catch (error) {
        console.error('Error retrieving subscriptions:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving subscriptions.',
            error: error.message
        });
    }
};


const getSubscriptionDetailsByUserId = async (req, res)=>{
    const {userId} = req.params;
    try {
        const result = await cryptoInvestmentService.getSubscriptionDetailsByUserId(userId);
        if (result.length ===0) {
            return res.status(404).json({message:"User Id Not Found"});
        }
        return res.status(200).json({message:"success", data:result});
    } catch (error) {
        return res.status(500).json({message:"Internal Error", error:error.message});
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
    handleDepositAndSubscription,
    getAllDeposits,
    requestWithdrawal,
    updateWithdrawalStatus,
    getAllTransactionsByWalletId,
    getUserWalletAndSubscriptionDetails,
    createSubscription,
    updateSubscription,
    getAllSubscriptionsByWalletId,
    getAllSubscriptions,
    getSubscriptionDetails,
    getSubscriptionEarnings,
    updateSubscriptionEarnings,
    getDepositsByWalletId,
    getWithdrawalsByWalletId,
    getPayoutsByWalletId,
    getAllPayouts,
    getAllUnapprovedDeposits,
    requestPayout,
    updatePayoutStatus,
    updateDepositProof,
    listAllSubscriptions,
    deleteSubscription,
    // getSubscriptionByCriteria,
    getSubscriptionsByCriteria,
    getSubscriptionDetailsByUserId,
    getWalletsByCurrencyId,
    getUserWallets,
    getTransactionHistory,
    getUserDetailsWithWallet,
    updateDepositStatusCreditWalletAndApproval,
    getLockedFunds,
    getRecentDeposits,
    getRecentWithdrawals,
    getUserWalletAndSubscriptionPlanDetails,
};



// const cryptoInvestmentService = require('../services/cryptoInvestmentService');

// // Create a new currency
// async function createCurrency(req, res) {
//     try {
//         const { code, symbol, name } = req.body;
//         const result = await cryptoInvestmentService.createCurrency(code, symbol, name);
//         res.status(201).json({
//             success: true,
//             message: 'Currency created successfully.',
//             currencyId: result.currencyId
//         });
//     } catch (error) {
//         console.error('Error creating currency:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while creating the currency.',
//             error: error.message
//         });
//     }
// }

// // Update an existing currency
// async function updateCurrency(req, res) {
//     try {
//         const { id } = req.params;
//         const { code, symbol, name } = req.body;
//         const result = await cryptoInvestmentService.updateCurrency(id, code, symbol, name);
//         res.status(200).json({
//             success: true,
//             message: 'Currency updated successfully.'
//         });
//     } catch (error) {
//         console.error('Error updating currency:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while updating the currency.',
//             error: error.message
//         });
//     }
// }

// // Delete a currency
// async function deleteCurrency(req, res) {
//     try {
//         const { id } = req.params;
//         const result = await cryptoInvestmentService.deleteCurrency(id);
//         res.status(200).json({
//             success: true,
//             message: 'Currency deleted successfully.'
//         });
//     } catch (error) {
//         console.error('Error deleting currency:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while deleting the currency.',
//             error: error.message
//         });
//     }
// }

// // Retrieve all currencies
// async function getAllCurrencies(req, res) {
//     try {
//         const currencies = await cryptoInvestmentService.getAllCurrencies();
//         res.status(200).json({
//             success: true,
//             message: 'Currencies retrieved successfully.',
//             currencies
//         });
//     } catch (error) {
//         console.error('Error retrieving currencies:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while retrieving currencies.',
//             error: error.message
//         });
//     }
// }

// // Create a new wallet for a user
// async function createWallet(req, res) {
//     try {
//         const { userId, currencyId } = req.body;
//         const result = await cryptoInvestmentService.createWallet(userId, currencyId);
//         res.status(201).json({
//             success: true,
//             message: 'Wallet created successfully.',
//             walletId: result.walletId
//         });
//     } catch (error) {
//         console.error('Error creating wallet:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while creating the wallet.',
//             error: error.message
//         });
//     }
// }

// // Credit an investor's wallet
// async function creditWallet(req, res) {
//     try {
//         const { walletId, amount } = req.body;
//         const result = await cryptoInvestmentService.creditWallet(walletId, amount);
//         res.status(200).json({
//             success: true,
//             message: 'Wallet credited successfully.'
//         });
//     } catch (error) {
//         console.error('Error crediting wallet:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while crediting the wallet.',
//             error: error.message
//         });
//     }
// }

// // Request a deposit with proof of payment
// async function requestDeposit(req, res) {
//     try {
//         const { walletId, amount, currencyId } = req.body;
//         const proofOfPayment = req.file ? req.file.path : null
//         if (!proofOfPayment) {
//             return res.status(400).json({success:false, error:'no proofOfPayment document found'})
//         }
//         const result = await cryptoInvestmentService.requestDeposit(walletId, amount, currencyId, proofOfPayment);
//         res.status(201).json({
//             success: true,
//             message: 'Deposit request submitted successfully.',
//             depositId: result.depositId
//         });
//     } catch (error) {
//         console.error('Error requesting deposit:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while requesting the deposit.',
//             error: error.message
//         });
//     }
// }


// // Update deposit status
// async function updateDepositStatus(req, res) {
//     try {
//         const { depositId } = req.params;
//         const { status } = req.body;
//         const result = await cryptoInvestmentService.updateDepositStatus(depositId, status);
//         res.status(200).json({
//             success: true,
//             message: 'Deposit status updated successfully.'
//         });
//     } catch (error) {
//         console.error('Error updating deposit status:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while updating the deposit status.',
//             error: error.message
//         });
//     }
// }

// // Retrieve all deposit requests
// async function getAllDeposits(req, res) {
//     try {
//         const deposits = await cryptoInvestmentService.getAllDeposits();
//         res.status(200).json({
//             success: true,
//             message: 'Deposit requests retrieved successfully.',
//             deposits
//         });
//     } catch (error) {
//         console.error('Error retrieving deposits:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while retrieving deposit requests.',
//             error: error.message
//         });
//     }
// }

// // Request a withdrawal
// async function requestWithdrawal(req, res) {
//     try {
//         const { walletId, amount, currencyId } = req.body;
//         const result = await cryptoInvestmentService.requestWithdrawal(walletId, amount, currencyId);
//         res.status(201).json({
//             success: true,
//             message: 'Withdrawal request submitted successfully.',
//             transactionId: result.transactionId
//         });
//     } catch (error) {
//         console.error('Error requesting withdrawal:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while requesting the withdrawal.',
//             error: error.message
//         });
//     }
// }

// // Update withdrawal status
// async function updateWithdrawalStatus(req, res) {
//     try {
//         const { transactionId } = req.params;
//         const { status } = req.body;
//         const result = await cryptoInvestmentService.updateWithdrawalStatus(transactionId, status);
//         res.status(200).json({
//             success: true,
//             message: 'Withdrawal status updated successfully.'
//         });
//     } catch (error) {
//         console.error('Error updating withdrawal status:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while updating the withdrawal status.',
//             error: error.message
//         });
//     }
// }

// // Retrieve all transactions for a specific wallet
// async function getAllTransactionsByWalletId(req, res) {
//     try {
//         const { walletId } = req.params;
//         const transactions = await cryptoInvestmentService.getAllTransactionsByWalletId(walletId);
//         res.status(200).json({
//             success: true,
//             message: 'Transactions retrieved successfully.',
//             transactions
//         });
//     } catch (error) {
//         console.error('Error retrieving transactions:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while retrieving transactions.',
//             error: error.message
//         });
//     }
// }



// module.exports = {
//     createCurrency,
//     updateCurrency,
//     deleteCurrency,
//     getAllCurrencies,
//     createWallet,
//     creditWallet,
//     requestDeposit,
//     updateDepositStatus,
//     getAllDeposits,
//     requestWithdrawal,
//     updateWithdrawalStatus,
//     getAllTransactionsByWalletId
// };




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
