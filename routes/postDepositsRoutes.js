const express = require('express');
const router = express.Router();
const postDepositsController = require('../controllers/postDepositsController');

// Route to create a new post deposit
router.post('/create', postDepositsController.createPostDeposits);

// Route to update a post deposit by ID
router.put('/update/:id', postDepositsController.updatePostDeposits);

// Route to delete a post deposit by ID
router.delete('/delete/:id', postDepositsController.deletePostDeposits);

// Route to get all post deposits
router.get('/viewAll', postDepositsController.getAllPostDeposits);

// Route to update the status of a post deposit
router.patch('/changeStatus/:id', postDepositsController.updatePostDepositsStatus);

// Route to get recent withdrawals with an optional limit
router.get('/recent-withdrawals', postDepositsController.getAllRecentWithdrawals);

// Route to get recent deposits with an optional limit
router.get('/recent-deposits', postDepositsController.getAllRecentDeposits);

module.exports = router;
