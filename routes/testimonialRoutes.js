const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

// Route to create a new testimonial
router.post('/testimonials', testimonialController.createTestimonial);

// Route to get a testimonial by ID
router.get('/testimonials/:id', testimonialController.getTestimonialById);

// Route to get all testimonials
router.get('/testimonials', testimonialController.getAllTestimonials);

// Route to update a testimonial
router.put('/testimonials/:id', testimonialController.updateTestimonial);

// Route to delete a testimonial
router.delete('/testimonials/:id', testimonialController.deleteTestimonial);

module.exports = router;
