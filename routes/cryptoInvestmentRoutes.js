const express = require('express');
const router = express.Router();
const cryptoInvestmentController = require('../controllers/cryptoInvestmentController');

// Route to create a new wallet for a user
router.post('/create', cryptoInvestmentController.createWallet);

// Route to deposit funds into the wallet
router.post('/deposit', cryptoInvestmentController.deposit);

// Route to approve or reject a deposit (Admin action)
router.put('/deposit/status', cryptoInvestmentController.updateDepositStatus);

// Route to request a withdrawal
router.post('/withdrawal', cryptoInvestmentController.requestWithdrawal);

// Route to approve or reject a withdrawal (Admin action)
router.put('/withdrawal/status', cryptoInvestmentController.updateWithdrawalStatus);

// Route to add earnings to a subscription
router.post('/earnings', cryptoInvestmentController.addEarnings);

// Route to create a new subscription plan for a wallet
router.post('/subscription', cryptoInvestmentController.createSubscription);

// Route to handle subscription expiration
router.put('/subscription/expiration', cryptoInvestmentController.handleSubscriptionExpiration);

// Route to request a payout
router.post('/payout', cryptoInvestmentController.requestPayout);

// Route to approve or reject a payout (Admin action)
router.put('/payout/status', cryptoInvestmentController.updatePayoutStatus);

module.exports = router;


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
