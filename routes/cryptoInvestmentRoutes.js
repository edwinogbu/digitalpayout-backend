const express = require('express');
const router = express.Router();
const cryptoInvestmentController = require('../controllers/cryptoInvestmentController');
const multer = require('multer');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
        cb(null, uniqueSuffix + '-' + file.originalname); // Filename format: <timestamp>-<originalname>
    }
});

// File filter to accept only DOC, PDF, TXT, and specified image file formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/pdf', // PDF
        'text/plain', // TXT
        'image/jpeg', // JPG
        'image/png', // PNG
        'image/gif', // GIF
        'image/webp', // WEBP
        'image/tiff', // TIFF
        'image/vnd.adobe.photoshop', // PSD
        'image/x-raw', // RAW
        'image/bmp', // BMP
        'image/heif', // HEIF
        'image/x-indesign', // INDD
        'image/jp2', // JPEG 2000
        'image/svg+xml', // SVG
        'application/postscript', // AI
        'application/eps', // EPS
        'application/octet-stream' // PDF
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only DOC, PDF, TXT, JPG, PNG, GIF, WEBP, TIFF, PSD, RAW, BMP, HEIF, INDD, JPEG 2000, SVG, AI, EPS, and PDF files are allowed'), false);
    }
};

// Multer upload instance for handling file uploads
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware function to handle file uploads
const uploadMiddleware = upload.single('proofOfPayment');



// Routes for currency operations
router.post('/currencies', cryptoInvestmentController.createCurrency);
router.put('/currencies', cryptoInvestmentController.updateCurrency);
router.delete('/currencies/:id', cryptoInvestmentController.deleteCurrency);
router.get('/currencies', cryptoInvestmentController.getAllCurrencies);

// Routes for wallet operations
router.post('/wallets', cryptoInvestmentController.createWallet);
router.post('/wallets/credit', cryptoInvestmentController.creditWallet);
router.get('/wallets/:walletId/transactions', cryptoInvestmentController.getAllTransactionsByWalletId);
router.get('/wallets/:userId/details', cryptoInvestmentController.getUserWalletAndSubscriptionDetails);
router.get('/userWallets/:currencyId', cryptoInvestmentController.getWalletsByCurrencyId);
router.get('/user/:userId/wallets', cryptoInvestmentController.getUserWallets);
// router.get('/user/:userId/wallets', cryptoInvestmentController.getTransactionHistory);
// router.get('/wallet/transactions/history/:walletId', cryptoInvestmentController.getTransactionHistory);

router.get('/wallet/user-wallet-history/:userId', cryptoInvestmentController.getUserDetailsWithWallet);
router.get('/wallet/user-wallet-subscription-details/:userId', cryptoInvestmentController.getUserWalletAndSubscriptionPlanDetails);
// http://localhost:3005/api/crypto/wallet/user-wallet-subscription-details/1


// Routes for deposit operations
router.post('/deposits',  uploadMiddleware, cryptoInvestmentController.requestDeposit);
router.put('/deposits/:depositId/status', cryptoInvestmentController.updateDepositStatus);
router.post('/deposits/subscription', uploadMiddleware, cryptoInvestmentController.handleDepositAndSubscription);
router.get('/deposits', cryptoInvestmentController.getAllDeposits);
router.get('/getLockedFunds', cryptoInvestmentController.getLockedFunds);
router.get('/getRecentDeposits', cryptoInvestmentController.getRecentDeposits);
router.get('/getRecentWithdrawals', cryptoInvestmentController.getRecentWithdrawals);




//Admin Aproval Operations

// Route for updating deposit status
router.get('/all-pending-deposits', cryptoInvestmentController.getAllUnapprovedDeposits);
router.put('/admin-deposit-approvalAndCreditWallet', cryptoInvestmentController.updateDepositStatusCreditWalletAndApproval);



// Route to approve or reject deposit and update wallet
router.put('/approve-deposit-status/:depositId', cryptoInvestmentController.updateDepositStatusCreditWalletAndApproval);


// Routes for withdrawal operations
router.post('/withdrawals', cryptoInvestmentController.requestWithdrawal);
router.put('/withdrawals/:transactionId/status', cryptoInvestmentController.updateWithdrawalStatus);
router.get('/wallets/:walletId/withdrawals', cryptoInvestmentController.getWithdrawalsByWalletId);

// Routes for subscription operations
router.post('/subscriptions', cryptoInvestmentController.createSubscription);
router.put('/subscriptions', cryptoInvestmentController.updateSubscription);
router.get('/wallets/:walletId/subscriptions', cryptoInvestmentController.getAllSubscriptionsByWalletId);
router.get('/subscriptions', cryptoInvestmentController.getAllSubscriptions);
router.get('/subscriptions/:subscriptionId', cryptoInvestmentController.getSubscriptionDetails);
router.get('/wallets/:walletId/earnings', cryptoInvestmentController.getSubscriptionEarnings);
router.put('/subscriptions/earnings', cryptoInvestmentController.updateSubscriptionEarnings);

router.delete('/subscriptions/:subscriptionId', cryptoInvestmentController.deleteSubscription);
// Route to get subscription by criteria (userId, depositId, walletId, or subscriptionId)
router.get('/subscriptions/search', cryptoInvestmentController.getSubscriptionsByCriteria);// Route to list all subscriptions
router.get('/subscriptions', cryptoInvestmentController.listAllSubscriptions);

router.get('/subscriptions/user/:userId', cryptoInvestmentController.getSubscriptionDetailsByUserId);




// Routes for payout operations
router.post('/payouts', cryptoInvestmentController.requestPayout);
router.put('/payouts/:payoutId/status', cryptoInvestmentController.updatePayoutStatus);
router.get('/wallets/:walletId/payouts', cryptoInvestmentController.getPayoutsByWalletId);
router.get('/payouts', cryptoInvestmentController.getAllPayouts);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const cryptoInvestmentController = require('../controllers/cryptoInvestmentController');
// const multer = require('multer');
// const fs = require('fs');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
//         cb(null, uniqueSuffix + '-' + file.originalname); // Filename format: <timestamp>-<originalname>
//     }
// });

// // File filter to accept only DOC, PDF, TXT, and specified image file formats
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = [
//         'application/msword', // DOC
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
//         'application/pdf', // PDF
//         'text/plain', // TXT
//         'image/jpeg', // JPG
//         'image/png', // PNG
//         'image/gif', // GIF
//         'image/webp', // WEBP
//         'image/tiff', // TIFF
//         'image/vnd.adobe.photoshop', // PSD
//         'image/x-raw', // RAW
//         'image/bmp', // BMP
//         'image/heif', // HEIF
//         'image/x-indesign', // INDD
//         'image/jp2', // JPEG 2000
//         'image/svg+xml', // SVG
//         'application/postscript', // AI
//         'application/eps', // EPS
//         'application/octet-stream' // PDF
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only DOC, PDF, TXT, JPG, PNG, GIF, WEBP, TIFF, PSD, RAW, BMP, HEIF, INDD, JPEG 2000, SVG, AI, EPS, and PDF files are allowed'), false);
//     }
// };

// // Multer upload instance for handling file uploads
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// // Middleware function to handle file uploads
// const uploadMiddleware = upload.single('proofOfPayment');



// // Routes for currencies
// router.post('/currencies', cryptoInvestmentController.createCurrency);
// router.put('/currencies/:id', cryptoInvestmentController.updateCurrency);
// router.delete('/currencies/:id', cryptoInvestmentController.deleteCurrency);
// router.get('/currencies', cryptoInvestmentController.getAllCurrencies);

// // Routes for wallets
// router.post('/wallets', cryptoInvestmentController.createWallet);
// router.post('/wallets/credit', cryptoInvestmentController.creditWallet);

// // Routes for deposits
// router.post('/deposits', uploadMiddleware, cryptoInvestmentController.requestDeposit);
// router.put('/deposits/:depositId', cryptoInvestmentController.updateDepositStatus);
// router.get('/deposits', cryptoInvestmentController.getAllDeposits);

// // Routes for withdrawals
// router.post('/withdrawals', cryptoInvestmentController.requestWithdrawal);
// router.put('/withdrawals/:transactionId', cryptoInvestmentController.updateWithdrawalStatus);

// // Routes for transactions
// router.get('/transactions/wallet/:walletId', cryptoInvestmentController.getAllTransactionsByWalletId);

// module.exports = router;


// const currencies = [
//     { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
//     { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' },
//     { code: 'XRP', symbol: 'XRP', name: 'Ripple' },
//     { code: 'LTC', symbol: 'Ł', name: 'Litecoin' },
//     { code: 'BCH', symbol: 'BCH', name: 'Bitcoin Cash' },
//     { code: 'BNB', symbol: 'BNB', name: 'Binance Coin' },
//     { code: 'ADA', symbol: '₳', name: 'Cardano' },
//     { code: 'DOGE', symbol: 'Ð', name: 'Dogecoin' },
//     { code: 'DOT', symbol: 'DOT', name: 'Polkadot' },
//     { code: 'SOL', symbol: 'SOL', name: 'Solana' },
//     { code: 'LINK', symbol: 'LINK', name: 'Chainlink' },
//     { code: 'XLM', symbol: '*', name: 'Stellar' },
//     { code: 'USDT', symbol: 'USDT', name: 'Tether' },
//     { code: 'USDC', symbol: 'USDC', name: 'USD Coin' },
//     { code: 'UNI', symbol: 'UNI', name: 'Uniswap' },
//     { code: 'AVAX', symbol: 'AVAX', name: 'Avalanche' },
//     { code: 'MATIC', symbol: 'MATIC', name: 'Polygon' },
//     { code: 'ATOM', symbol: 'ATOM', name: 'Cosmos' },
//     { code: 'TRX', symbol: 'TRX', name: 'TRON' },
//     { code: 'FTT', symbol: 'FTT', name: 'FTX Token' }
// ];
















// const express = require('express');
// const router = express.Router();
// const cryptoInvestmentController = require('../controllers/cryptoInvestmentController');

// // Route to create a new wallet for a user
// router.post('/create', cryptoInvestmentController.createWallet);

// // Route to deposit funds into the wallet
// router.post('/deposit', cryptoInvestmentController.deposit);

// // Route to approve or reject a deposit (Admin action)
// router.put('/deposit/status', cryptoInvestmentController.updateDepositStatus);

// // Route to request a withdrawal
// router.post('/withdrawal', cryptoInvestmentController.requestWithdrawal);

// // Route to approve or reject a withdrawal (Admin action)
// router.put('/withdrawal/status', cryptoInvestmentController.updateWithdrawalStatus);

// // Route to add earnings to a subscription
// router.post('/earnings', cryptoInvestmentController.addEarnings);

// // Route to create a new subscription plan for a wallet
// router.post('/subscription', cryptoInvestmentController.createSubscription);

// // Route to handle subscription expiration
// router.put('/subscription/expiration', cryptoInvestmentController.handleSubscriptionExpiration);

// // Route to request a payout
// router.post('/payout', cryptoInvestmentController.requestPayout);

// // Route to approve or reject a payout (Admin action)
// router.put('/payout/status', cryptoInvestmentController.updatePayoutStatus);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const cryptoInvestmentController = require('../controllers/cryptoInvestmentController');

// // Route to create a new wallet
// router.post('/wallet/create', cryptoInvestmentController.createWallet);

// // Route to initiate a deposit
// router.post('/deposit', cryptoInvestmentController.deposit);

// // Route to update the deposit status (approve/reject)
// router.post('/deposit/update-status', cryptoInvestmentController.updateDepositStatus);

// // Route to request a withdrawal
// router.post('/withdrawal/request', cryptoInvestmentController.requestWithdrawal);

// // Route to update the withdrawal status (approve/reject)
// router.post('/withdrawal/update-status', cryptoInvestmentController.updateWithdrawalStatus);

// // Route to add earnings to a subscription
// router.post('/subscription/add-earnings', cryptoInvestmentController.addEarnings);

// // Route to create a new subscription
// router.post('/subscription/create', cryptoInvestmentController.createSubscription);

// // Route to handle subscription expiration
// router.post('/subscription/expire', cryptoInvestmentController.handleSubscriptionExpiration);

// // Route to request a payout
// router.post('/payout/request', cryptoInvestmentController.requestPayout);

// // Route to update the payout status (approve/reject)
// router.post('/payout/update-status', cryptoInvestmentController.updatePayoutStatus);

// module.exports = router;



// // const express = require('express');
// // const router = express.Router();
// // const cryptoInvestmentController = require('../controllers/cryptoInvestmentController');

// // // Route to create a new wallet for a user
// // router.post('/wallet/create', cryptoInvestmentController.createWallet);

// // // Route to deposit funds into a wallet
// // router.post('/wallet/deposit', cryptoInvestmentController.deposit);

// // // Route to approve a deposit (Admin action)
// // router.post('/wallet/deposit/approve', cryptoInvestmentController.approveDeposit);

// // // Route to request a withdrawal from a wallet
// // router.post('/wallet/withdrawal', cryptoInvestmentController.requestWithdrawal);

// // // Route to approve a withdrawal (Admin action)
// // router.post('/wallet/withdrawal/approve', cryptoInvestmentController.approveWithdrawal);

// // // Route to add earnings to a subscription
// // router.post('/subscription/earnings/add', cryptoInvestmentController.addEarnings);

// // // Route to create a new subscription plan for a wallet
// // router.post('/subscription/create', cryptoInvestmentController.createSubscription);

// // // Route to handle subscription expiration
// // router.post('/subscription/expire', cryptoInvestmentController.handleSubscriptionExpiration);

// // // Route to request a payout
// // router.post('/payout/request', cryptoInvestmentController.requestPayout);

// // // Route to approve a payout (Admin action)
// // router.post('/payout/approve', cryptoInvestmentController.approvePayout);

// // module.exports = router;






// // // const express = require('express');
// // // const cryptoInvestmentController = require('./controllers/cryptoInvestmentController');

// // // const router = express.Router();

// // // router.post('/wallet', cryptoInvestmentController.createWallet);
// // // router.post('/deposit', cryptoInvestmentController.deposit);
// // // router.post('/approve-deposit', cryptoInvestmentController.approveDeposit);
// // // router.post('/withdrawal', cryptoInvestmentController.requestWithdrawal);
// // // router.post('/approve-withdrawal', cryptoInvestmentController.approveWithdrawal);
// // // router.post('/earnings', cryptoInvestmentController.addEarnings);
// // // router.post('/subscription', cryptoInvestmentController.createSubscription);
// // // router.post('/handle-expiration', cryptoInvestmentController.handleSubscriptionExpiration);
// // // router.post('/payout', cryptoInvestmentController.requestPayout);
// // // router.post('/approve-payout', cryptoInvestmentController.approvePayout);

// // // module.exports = router;
