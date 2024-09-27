const testimonialService = require('../services/testimonialService');

// Create a new testimonial
async function createTestimonial(req, res) {
    try {
        const { name, amount, message, status = 'draft' } = req.body;

        // Check if an image file is uploaded
        const imagePath = req.file ? req.file.path : null;

        // If no image file is uploaded, return an error response
        if (!imagePath) {
            return res.status(400).json({ success: false, message: 'Image upload is required.' });
        }

        // Call the service layer function to create the testimonial
        const newTestimonial = await testimonialService.createTestimonial({ name, amount, message, status, imagePath });

        // Return success response with the newly created testimonial data
        res.status(201).json({ success: true, message: 'Testimonial created successfully.', testimonial: newTestimonial });
    } catch (error) {
        // Return error response if any error occurs during the process
        res.status(500).json({ success: false, message: 'Failed to create testimonial.', error: error.message });
    }
}

// Retrieve all testimonials
async function getAllTestimonials(req, res) {
    try {
        const testimonials = await testimonialService.getAllTestimonials();
        res.status(200).json({ success: true, message:'Testimonials retrived successfully', testimonials:testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve testimonials.', error: error.message });
    }
}

// Retrieve a testimonial by ID
async function getTestimonialById(req, res) {
    try {
        const { id } = req.params;
        const testimonial = await testimonialService.getTestimonialById(id);
        res.status(200).json({ success: true, testimonial });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Testimonial not found.', error: error.message });
    }
}

// Retrieve all published testimonials
async function getAllPublishedTestimonials(req, res) {
    try {
        const testimonials = await testimonialService.getPublishedTestimonials();
        res.status(200).json({ success: true, testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve published testimonials.', error: error.message });
    }
}

// Update a testimonial by ID
async function updateTestimonial(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if an image file is uploaded and update the path if available
        const imagePath = req.file ? req.file.path : undefined;
        if (imagePath) {
            updateData.imagePath = imagePath;
        }

        const updatedTestimonial = await testimonialService.updateTestimonial(id, updateData);
        res.status(200).json({ success: true, message: 'Testimonial updated successfully.', testimonial: updatedTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update testimonial.', error: error.message });
    }
}

// Change the status of a testimonial
async function changeTestimonialStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedTestimonial = await testimonialService.changeTestimonialStatus(id, status);
        res.status(200).json({ success: true, message: 'Testimonial status updated successfully.', testimonial: updatedTestimonial });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid status value or testimonial not found.', error: error.message });
    }
}

// Delete a testimonial by ID
async function deleteTestimonial(req, res) {
    try {
        const { id } = req.params;
        await testimonialService.deleteTestimonial(id);
        res.status(200).json({ success: true, message: 'Testimonial deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete testimonial.', error: error.message });
    }
}


// Retrieve paginated testimonials
async function getPaginatedTestimonials(req, res) {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        // Validate pagination parameters
        if (page < 1 || limit < 1) {
            return res.status(400).json({ success: false, message: 'Invalid pagination parameters.' });
        }

        // Fetch paginated testimonials from the service
        const { testimonials, total } = await testimonialService.getPaginatedTestimonials(page, limit);

        res.status(200).json({ 
            success: true, 
            testimonials, 
            pagination: { total, page, limit } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve testimonials.', error: error.message });
    }
}

module.exports = {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    getAllPublishedTestimonials,
    updateTestimonial,
    changeTestimonialStatus,
    deleteTestimonial,
    getPaginatedTestimonials,
};


// const testimonialService = require('../services/testimonialService');

// // Create a new testimonial
// async function createTestimonial(req, res) {
//     try {
        
//         const { name, amount, message, status = 'draft' } = req.body;

//         // Check if an image file is uploaded
//         const imagePath = req.file ? req.file.path : null;

//         // If no image file is uploaded, return an error response
//         if (!imagePath) {
//             return res.status(400).json({ success: false, error: 'No image uploaded' });
//         }

//         // Call the service layer function to create the skill provider with or without an image path
//         const newTestimonial = await testimonialService.createTestimonial({ name, amount, message, status, imagePath});
       
//         // Return success response with the newly created skill provider data, including the imagePath
//         res.status(201).json({ success: true, testimonial: newTestimonial});
//     } catch (error) {
//         // Return error response if any error occurs during the process
//         res.status(500).json({ success: false, error: error.message });
//     }
// }


// // Update an existing testimonial
// async function updateTestimonial(req, res) {
//     const { id } = req.params;

//     try {
//         const imagePath = req.file ? req.file.path : null;

//         const updatedData = { ...req.body };

//         if (imagePath) {
//             updatedData.imagePath = imagePath;
//         }

//         const result = await testimonialService.updateTestimonial(id, updatedData);

//         if (result.success) {
//             return res.status(200).json({
//                 success: true,
//                 message: 'Testimonial updated successfully.',
//                 data: result.data
//             });
//         } else {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Testimonial not found or no changes made.'
//             });
//         }
//     } catch (error) {
//         console.error('Error updating testimonial:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error updating testimonial. Please try again later.'
//         });
//     }
// }

// // Delete a testimonial
// async function deleteTestimonial(req, res) {
//     const { id } = req.params;
//     try {
//         const result = await testimonialService.deleteTestimonial(id);
//         if (result.success) {
//             return res.status(200).json({
//                 success: true,
//                 message: 'Testimonial deleted successfully.'
//             });
//         } else {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Testimonial not found.'
//             });
//         }
//     } catch (error) {
//         console.error('Error deleting testimonial:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error deleting testimonial. Please try again later.'
//         });
//     }
// }

// // Get all testimonials
// async function getAllTestimonials(req, res) {
//     try {
//         const result = await testimonialService.getAllTestimonials();
//         return res.status(200).json({
//             success: true,
//             message: 'Testimonials retrieved successfully.',
//             data: result.data
//         });
//     } catch (error) {
//         console.error('Error retrieving testimonials:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error retrieving testimonials. Please try again later.'
//         });
//     }
// }

// // Get all published testimonials
// async function getAllPublishedTestimonials(req, res) {
//     try {
//         const result = await testimonialService.getAllPublishedTestimonials();
//         return res.status(200).json({
//             success: true,
//             message: 'Published testimonials retrieved successfully.',
//             data: result.data
//         });
//     } catch (error) {
//         console.error('Error retrieving published testimonials:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error retrieving published testimonials. Please try again later.'
//         });
//     }
// }

// // Get a single testimonial by ID
// async function getTestimonialById(req, res) {
//     const { id } = req.params;
//     try {
//         const result = await testimonialService.getTestimonialById(id);
//         if (result.success) {
//             return res.status(200).json({
//                 success: true,
//                 message: 'Testimonial retrieved successfully.',
//                 data: result.data
//             });
//         } else {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Testimonial not found.'
//             });
//         }
//     } catch (error) {
//         console.error('Error retrieving testimonial:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error retrieving testimonial. Please try again later.'
//         });
//     }
// }

// // Update testimonial status
// async function updateTestimonialStatus(req, res) {
//     const { id } = req.params;
//     const { status } = req.body;
//     try {
//         const result = await testimonialService.updateTestimonialStatus(id, status);
//         if (result.success) {
//             return res.status(200).json({
//                 success: true,
//                 message: `Testimonial status updated to '${status}'.`
//             });
//         } else {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Testimonial not found or no changes made.'
//             });
//         }
//     } catch (error) {
//         console.error('Error updating testimonial status:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error updating testimonial status. Please try again later.'
//         });
//     }
// }

// // Get paginated testimonials
// async function getPaginatedTestimonials(req, res) {
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const offset = parseInt(req.query.offset, 10) || 0;
//     try {
//         const result = await testimonialService.getPaginatedTestimonials(limit, offset);
//         return res.status(200).json({
//             success: true,
//             message: 'Paginated testimonials retrieved successfully.',
//             data: result.data
//         });
//     } catch (error) {
//         console.error('Error retrieving paginated testimonials:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error retrieving paginated testimonials. Please try again later.'
//         });
//     }
// }

// module.exports = {
//     createTestimonial,
//     updateTestimonial,
//     deleteTestimonial,
//     getAllTestimonials,
//     getAllPublishedTestimonials,
//     getTestimonialById,
//     updateTestimonialStatus,
//     getPaginatedTestimonials
// };


// // const testimonialService = require('../services/testimonialService');

// // // Create a new testimonial
// // async function createTestimonial(req, res) {
// //     try {
// //         const { name, amount, message, status = 'draft' } = req.body;
       
// //         const imagePath = req.file ? req.file.path : null;

// //         // Check if a file is uploaded
// //         if (!req.file) {
// //             return res.status(400).json({ success: false, error: 'No image uploaded' });
// //         }

// //         console.log('Creating testimonial with:', { name, amount, message, status, imagePath });

// //         const result = await testimonialService.createTestimonial(name, amount, message, status, imagePath);

// //         return res.status(201).json({
// //             success: true,
// //             message: 'Testimonial created successfully.',
// //             data: result.data
// //         });
// //     } catch (error) {
// //         console.error('Error creating testimonial:', error);
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Error creating testimonial. Please try again later.'
// //         });
// //     }
// // }

// // // Update an existing testimonial
// // async function updateTestimonial(req, res) {
// //     const { id } = req.params;

// //     try {
       
// //         const imagePath = req.file ? req.file.path : null;

// //         // Check if a file is uploaded
// //         if (!req.file) {
// //             return res.status(400).json({ success: false, error: 'No image uploaded' });
// //         }
// //         const updatedData = { ...req.body };

// //         if (imagePath) {
// //             updatedData.imagePath = imagePath;
// //         }

// //         const result = await testimonialService.updateTestimonial(id, updatedData);

// //         if (result.success) {
// //             return res.status(200).json({
// //                 success: true,
// //                 message: 'Testimonial updated successfully.',
// //                 data: result.data
// //             });
// //         } else {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: 'Testimonial not found or no changes made.'
// //             });
// //         }
// //     } catch (error) {
// //         console.error('Error updating testimonial:', error);
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Error updating testimonial. Please try again later.'
// //         });
// //     }
// // }

// // // Delete a testimonial
// // async function deleteTestimonial(req, res) {
// //     const { id } = req.params;
// //     try {
// //         const result = await testimonialService.deleteTestimonial(id);
// //         if (result.success) {
// //             return res.status(200).json({
// //                 success: true,
// //                 message: 'Testimonial deleted successfully.'
// //             });
// //         } else {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: 'Testimonial not found.'
// //             });
// //         }
// //     } catch (error) {
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Error deleting testimonial. Please try again later.'
// //         });
// //     }
// // }

// // // Get all testimonials
// // async function getAllTestimonials(req, res) {
// //     try {
// //         const result = await testimonialService.getAllTestimonials();
// //         return res.status(200).json({
// //             success: true,
// //             message: 'Testimonials retrieved successfully.',
// //             data: result.data
// //         });
// //     } catch (error) {
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Error retrieving testimonials. Please try again later.'
// //         });
// //     }
// // }

// // // Get all published testimonials
// // async function getAllPublishedTestimonials(req, res) {
// //     try {
// //         const result = await testimonialService.getAllPublishedTestimonials();
// //         return res.status(200).json({
// //             success: true,
// //             message: 'Published testimonials retrieved successfully.',
// //             data: result.data
// //         });
// //     } catch (error) {
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Error retrieving published testimonials. Please try again later.'
// //         });
// //     }
// // }

// // // Get a single testimonial by ID
// // async function getTestimonialById(req, res) {
// //     const { id } = req.params;
// //     try {
// //         const result = await testimonialService.getTestimonialById(id);
// //         if (result.success) {
// //             return res.status(200).json({
// //                 success: true,
// //                 message: 'Testimonial retrieved successfully.',
// //                 data: result.data
// //             });
// //         } else {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: 'Testimonial not found.'
// //             });
// //         }
// //     } catch (error) {
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Error retrieving testimonial. Please try again later.'
// //         });
// //     }
// // }

// // // Update testimonial status
// // async function updateTestimonialStatus(req, res) {
// //     const { id } = req.params;
// //     const { status } = req.body;
// //     try {
// //         const result = await testimonialService.updateTestimonialStatus(id, status);
// //         if (result.success) {
// //             return res.status(200).json({
// //                 success: true,
// //                 message: `Testimonial status updated to '${status}'.`
// //             });
// //         } else {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: 'Testimonial not found or no changes made.'
// //             });
// //         }
// //     } catch (error) {
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Error updating testimonial status. Please try again later.'
// //         });
// //     }
// // }

// // // Get paginated testimonials
// // async function getPaginatedTestimonials(req, res) {
// //     const limit = parseInt(req.query.limit, 10) || 10;
// //     const offset = parseInt(req.query.offset, 10) || 0;
// //     try {
// //         const result = await testimonialService.getPaginatedTestimonials(limit, offset);
// //         return res.status(200).json({
// //             success: true,
// //             message: 'Paginated testimonials retrieved successfully.',
// //             data: result.data
// //         });
// //     } catch (error) {
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Error retrieving paginated testimonials. Please try again later.'
// //         });
// //     }
// // }

// // module.exports = {
// //     createTestimonial,
// //     updateTestimonial,
// //     deleteTestimonial,
// //     getAllTestimonials,
// //     getAllPublishedTestimonials,
// //     getTestimonialById,
// //     updateTestimonialStatus,
// //     getPaginatedTestimonials
// // };
