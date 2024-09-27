const express = require('express');
const paymentGatewayController = require('../controllers/paymentGatewayController');

const router = express.Router();

// Route to create a new payment gateway
router.post('/create', paymentGatewayController.createPaymentGateway);
// {
//     "currencyAddress": "0x123abc456def789",
//     "name": "Bitcoin Gateway",
//     "description": "Payment gateway for Bitcoin transactions"
//   }
  
// Route to get all payment gateways
router.get('/all', paymentGatewayController.getAllPaymentGateways);
// http://localhost:3005/api/payment-gateways/all
// Route to get a payment gateway by ID
router.get('/view/:id', paymentGatewayController.getPaymentGatewayById);
// http://localhost:3005/api/payment-gateways/view/3
// Route to update a payment gateway by ID
router.put('/update/:id', paymentGatewayController.updatePaymentGateway);
// http://localhost:3005/api/payment-gateways/update/3
// Route to delete a payment gateway by ID
router.delete('/delete/:id', paymentGatewayController.deletePaymentGateway);
// http://localhost:3005/api/payment-gateways/delete/3
// Route to get paginated payment gateways
router.get('/paginate', paymentGatewayController.getPaginatedPaymentGateways);

module.exports = router;

// http://localhost:3005/api/payment-gateways/all
// http://localhost:3005/api/payment-gateways/view/:id
// http://localhost:3005/api/payment-gateways/update/:id
// http://localhost:3005/api/payment-gateways/delete/:id
// http://localhost:3005/api/payment-gateways/paginate

// https://server.digitalspayout.com/api/payment-gateways/all
// https://server.digitalspayout.com/api/payment-gateways/view/:id
// https://server.digitalspayout.com/api/payment-gateways/update/:id
// https://server.digitalspayout.com/api/payment-gateways/delete/:id
// https://server.digitalspayout.com/api/payment-gateways/paginate