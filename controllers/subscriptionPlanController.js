const subscriptionPlanService = require('../services/subscriptionPlanService');

// Create a new subscription plan
async function createSubscriptionPlan(req, res) {
    try {
        const subscriptionPlanData = req.body;
        const result = await subscriptionPlanService.createSubscriptionPlan(subscriptionPlanData);
        res.status(201).json({ success: true, message: 'Subscription plan created successfully', data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create subscription plan: ' + error.message });
    }
}

// Get all subscription plans
async function getAllSubscriptionPlans(req, res) {
    try {
        const plans = await subscriptionPlanService.getAllSubscriptionPlans();
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve subscription plans: ' + error.message });
    }
}

// Get a subscription plan by ID
async function getSubscriptionPlanById(req, res) {
    try {
        const { id } = req.params;
        const plan = await subscriptionPlanService.getSubscriptionPlanById(id);
        if (plan.message) {
            return res.status(404).json({ success: false, message: plan.message });
        }
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve subscription plan: ' + error.message });
    }
}

// Update a subscription plan
async function updateSubscriptionPlan(req, res) {
    try {
        const { id } = req.params;
        const updatedPlanData = req.body;
        const result = await subscriptionPlanService.updateSubscriptionPlan(id, updatedPlanData);
        res.status(200).json({ success: true, message: 'Subscription plan updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update subscription plan: ' + error.message });
    }
}

// Delete a subscription plan
async function deleteSubscriptionPlan(req, res) {
    try {
        const { id } = req.params;
        const result = await subscriptionPlanService.deleteSubscriptionPlan(id);
        res.status(200).json({ success: true, message: 'Subscription plan deleted successfully', data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete subscription plan: ' + error.message });
    }
}

module.exports = {
    createSubscriptionPlan,
    getAllSubscriptionPlans,
    getSubscriptionPlanById,
    updateSubscriptionPlan,
    deleteSubscriptionPlan
};


// const subscriptionService = require('../services/subscriptionService');

// // Create a new subscription plan
// async function createSubscriptionPlan(req, res) {
//     try {
//         const subscriptionPlanData = req.body;
//         const newPlan = await subscriptionService.createSubscriptionPlan(subscriptionPlanData);
//         res.status(201).json({
//             success: true,
//             message: 'Subscription plan created successfully',
//             data: newPlan
//         });
//     } catch (error) {
//         console.error('Error creating subscription plan:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create subscription plan',
//             error: error.message
//         });
//     }
// }

// // Get all subscription plans
// async function getAllSubscriptionPlans(req, res) {
//     try {
//         const plans = await subscriptionService.getAllSubscriptionPlans();
//         res.status(200).json({
//             success: true,
//             data: plans
//         });
//     } catch (error) {
//         console.error('Error fetching subscription plans:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch subscription plans',
//             error: error.message
//         });
//     }
// }

// // Get a subscription plan by ID
// async function getSubscriptionPlanById(req, res) {
//     const { id } = req.params;
//     try {
//         const plan = await subscriptionService.getSubscriptionPlanById(id);
//         if (!plan) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Subscription plan not found'
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: plan
//         });
//     } catch (error) {
//         console.error('Error fetching subscription plan:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch subscription plan',
//             error: error.message
//         });
//     }
// }

// // Update a subscription plan by ID
// async function updateSubscriptionPlan(req, res) {
//     const { id } = req.params;
//     const updatedPlanData = req.body;
//     try {
//         const updatedPlan = await subscriptionService.updateSubscriptionPlan(id, updatedPlanData);
//         if (!updatedPlan) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Subscription plan not found'
//             });
//         }
//         res.status(200).json({
//             success: true,
//             message: 'Subscription plan updated successfully',
//             data: updatedPlan
//         });
//     } catch (error) {
//         console.error('Error updating subscription plan:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to update subscription plan',
//             error: error.message
//         });
//     }
// }

// // Delete a subscription plan by ID
// async function deleteSubscriptionPlan(req, res) {
//     const { id } = req.params;
//     try {
//         const result = await subscriptionService.deleteSubscriptionPlan(id);
//         if (!result) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Subscription plan not found'
//             });
//         }
//         res.status(200).json({
//             success: true,
//             message: 'Subscription plan deleted successfully',
//             data: result
//         });
//     } catch (error) {
//         console.error('Error deleting subscription plan:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to delete subscription plan',
//             error: error.message
//         });
//     }
// }

// module.exports = {
//     createSubscriptionPlan,
//     getAllSubscriptionPlans,
//     getSubscriptionPlanById,
//     updateSubscriptionPlan,
//     deleteSubscriptionPlan
// };
