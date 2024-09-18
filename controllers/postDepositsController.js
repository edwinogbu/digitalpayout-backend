const postDepositsService = require('../services/postDepositsService');

// Create a new post deposit
async function createPostDeposits(req, res) {
    try {
        const result = await postDepositsService.createPostDeposits(req.body);
        return res.status(201).json({
            success: true,
            message: 'Post deposit created successfully.',
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating post deposit. Please try again later.'
        });
    }
}

// Update an existing post deposit
async function updatePostDeposits(req, res) {
    const { id } = req.params;
    try {
        const result = await postDepositsService.updatePostDeposits(id, req.body);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Post deposit updated successfully.'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Post deposit not found or no changes made.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating post deposit. Please try again later.'
        });
    }
}

// Delete a post deposit
async function deletePostDeposits(req, res) {
    const { id } = req.params;
    try {
        const result = await postDepositsService.deletePostDeposits(id);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Post deposit deleted successfully.'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Post deposit not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting post deposit. Please try again later.'
        });
    }
}

// Get all post deposits
async function getAllPostDeposits(req, res) {
    try {
        const result = await postDepositsService.getAllPostDeposits();
        return res.status(200).json({
            success: true,
            message: 'Post deposits retrieved successfully.',
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving post deposits. Please try again later.'
        });
    }
}

// Update post deposit status
async function updatePostDepositsStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await postDepositsService.updatePostDepositsStatus(id, status);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: `Post deposit status updated to '${status}'.`
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Post deposit not found or no changes made.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating post deposit status. Please try again later.'
        });
    }
}

// Get recent withdrawals
async function getAllRecentWithdrawals(req, res) {
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10
    try {
        const result = await postDepositsService.getAllRecentWithdrawals(limit);
        return res.status(200).json({
            success: true,
            message: 'Recent withdrawals retrieved successfully.',
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving recent withdrawals. Please try again later.'
        });
    }
}

// Get recent deposits
async function getAllRecentDeposits(req, res) {
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10
    try {
        const result = await postDepositsService.getAllRecentDeposits(limit);
        return res.status(200).json({
            success: true,
            message: 'Recent deposits retrieved successfully.',
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving recent deposits. Please try again later.'
        });
    }
}

module.exports = {
    createPostDeposits,
    updatePostDeposits,
    deletePostDeposits,
    getAllPostDeposits,
    updatePostDepositsStatus,
    getAllRecentWithdrawals,
    getAllRecentDeposits,
};
