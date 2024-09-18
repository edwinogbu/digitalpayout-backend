const blogPostsService = require('../services/blogPostsService');

// Create a new blog post
async function createBlogPost(req, res) {
    try {
        const { title, content, author, status = 'draft', views = 0 } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        console.log('Creating blog post with:', { title, content, author, status, imageUrl, views });

        const result = await blogPostsService.createBlogPost(title, content, author, status, imageUrl, views);

        return res.status(201).json({
            success: true,
            message: 'Blog post created successfully.',
            data: result.data
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating blog post. Please try again later.'
        });
    }
}


// Update an existing blog post
async function updateBlogPost(req, res) {
    const { id } = req.params;

    try {
        // Check if an image is uploaded
        const imageUrl = req.file ? req.file.path : null;

        // Collect blog post data from the request
        const updatedData = { ...req.body };

        // If an image was uploaded, update the image URL
        if (imageUrl) {
            updatedData.imageUrl = imageUrl;
        }

        // Call the service to update the blog post
        const result = await blogPostsService.updateBlogPost(id, updatedData);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Blog post updated successfully.',
                data: result.data
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found or no changes made.'
            });
        }
    } catch (error) {
        console.error('Error updating blog post:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating blog post. Please try again later.'
        });
    }
}


// Delete a blog post
async function deleteBlogPost(req, res) {
    const { id } = req.params;
    try {
        const result = await blogPostsService.deleteBlogPost(id);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Blog post deleted successfully.'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting blog post. Please try again later.'
        });
    }
}

// Get all blog posts
async function getAllBlogPosts(req, res) {
    try {
        const result = await blogPostsService.getAllBlogPosts();
        return res.status(200).json({
            success: true,
            message: 'Blog posts retrieved successfully.',
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving blog posts. Please try again later.'
        });
    }
}

// Get all blog posts
async function getAllPublishBlogPosts(req, res) {
    try {
        const result = await blogPostsService.getAllPublishBlogPosts();
        return res.status(200).json({
            success: true,
            message: 'Published Blog posts retrieved successfully.',
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving Published blog posts. Please try again later.'
        });
    }
}

// Get a single blog post by ID
async function getBlogPostById(req, res) {
    const { id } = req.params;
    try {
        const result = await blogPostsService.getBlogPostById(id);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Blog post retrieved successfully.',
                data: result.data
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving blog post. Please try again later.'
        });
    }
}

// Update blog post status
async function updateBlogPostStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await blogPostsService.updateBlogPostStatus(id, status);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: `Blog post status updated to '${status}'.`
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found or no changes made.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating blog post status. Please try again later.'
        });
    }
}

// Increment blog post views
async function incrementBlogPostViews(req, res) {
    const { id } = req.params;
    try {
        const result = await blogPostsService.incrementBlogPostViews(id);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Blog post views incremented successfully.'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error incrementing blog post views. Please try again later.'
        });
    }
}

// Get paginated blog posts
async function getPaginatedBlogPosts(req, res) {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
        const result = await blogPostsService.getPaginatedBlogPosts(limit, offset);
        return res.status(200).json({
            success: true,
            message: 'Paginated blog posts retrieved successfully.',
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving paginated blog posts. Please try again later.'
        });
    }
}

module.exports = {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getAllBlogPosts,
    getAllPublishBlogPosts,
    getBlogPostById,
    updateBlogPostStatus,
    incrementBlogPostViews,
    getPaginatedBlogPosts
};
