const paymentGatewayService = require('../services/paymentGatewayService');

async function createPaymentGateway (req, res) {
    try {
        const gatewayData = req.body;
        const newGateway = await paymentGatewayService.createPaymentGateway(gatewayData);
        res.status(201).json({
            success: true,
            message: 'Payment gateway created successfully',
            data: newGateway
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating payment gateway'
        });
    }
};

async function getAllPaymentGateways  (req, res) {
    try {
        const gateways = await paymentGatewayService.getAllPaymentGateways();
        res.status(200).json({
            success: true,
            message: 'Payment gateways retrieved successfully',
            data: gateways
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving payment gateways'
        });
    }
};

async function getPaymentGatewayById (req, res){
    try {
        const gatewayId = req.params.id;
        const gateway = await paymentGatewayService.getPaymentGatewayById(gatewayId);

        res.status(200).json({
            success: true,
            message: 'Payment gateway retrieved successfully',
            data: gateway
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || 'Payment gateway not found'
        });
    }
};

async function updatePaymentGateway (req, res){
    try {
        const gatewayId = req.params.id;
        const updateData = req.body;
        const updatedGateway = await paymentGatewayService.updatePaymentGateway(gatewayId, updateData);

        res.status(200).json({
            success: true,
            message: 'Payment gateway updated successfully',
            data: updatedGateway
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating payment gateway'
        });
    }
};

async function deletePaymentGateway (req, res) {
    try {
        const gatewayId = req.params.id;
        await paymentGatewayService.deletePaymentGateway(gatewayId);

        res.status(200).json({
            success: true,
            message: 'Payment gateway deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting payment gateway'
        });
    }
};

async function getPaginatedPaymentGateways (req, res){
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const paginatedResult = await paymentGatewayService.getPaginatedPaymentGateways(page, limit);

        res.status(200).json({
            success: true,
            message: 'Paginated payment gateways retrieved successfully',
            data: paginatedResult.gateways,
            pagination: {
                total: paginatedResult.total,
                page: paginatedResult.page,
                limit: paginatedResult.limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving paginated payment gateways'
        });
    }
};

// Exporting the functions using module.exports pattern
module.exports = {
    createPaymentGateway,
    getAllPaymentGateways,
    getPaymentGatewayById,
    updatePaymentGateway,
    deletePaymentGateway,
    getPaginatedPaymentGateways
};
