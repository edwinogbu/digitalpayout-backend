const testimonialService = require('../services/testimonialService');

// Create a new testimonial
async function createTestimonial(req, res) {
    try {
        const { name, amount, message, imagePath } = req.body;
        const newTestimonial = await testimonialService.createTestimonial({ name, amount, message, imagePath });
        res.status(201).json({ success: true, testimonial: newTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get testimonial by ID
async function getTestimonialById(req, res) {
    try {
        const { id } = req.params;
        const testimonial = await testimonialService.getTestimonialById(id);
        if (!testimonial) {
            res.status(404).json({ success: false, error: 'Testimonial not found' });
            return;
        }
        res.status(200).json({ success: true, testimonial });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get all testimonials
async function getAllTestimonials(req, res) {
    try {
        const testimonials = await testimonialService.getAllTestimonials();
        res.status(200).json({ success: true, testimonials });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Update a testimonial
async function updateTestimonial(req, res) {
    try {
        const { id } = req.params;
        const { name, amount, message, imagePath } = req.body;
        const updatedTestimonial = await testimonialService.updateTestimonial(id, { name, amount, message, imagePath });
        if (!updatedTestimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }
        res.status(200).json({ success: true, testimonial: updatedTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Delete a testimonial
async function deleteTestimonial(req, res) {
    try {
        const { id } = req.params;
        await testimonialService.deleteTestimonial(id);
        res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    createTestimonial,
    getTestimonialById,
    getAllTestimonials,
    updateTestimonial,
    deleteTestimonial
};
