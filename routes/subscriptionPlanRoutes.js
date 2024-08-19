const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('./../controllers/subscriptionPlanController');

// Route to create a new subscription plan
router.post('/createPlan', subscriptionPlanController.createSubscriptionPlan);

// Route to get all subscription plans
router.get('/allPlans', subscriptionPlanController.getAllSubscriptionPlans);

// Route to get a subscription plan by ID
router.get('/view/:id', subscriptionPlanController.getSubscriptionPlanById);

// Route to update a subscription plan by ID
router.put('/update/:id', subscriptionPlanController.updateSubscriptionPlan);

// Route to delete a subscription plan by ID
router.delete('/delete/:id', subscriptionPlanController.deleteSubscriptionPlan);

module.exports = router;
