const cryptoNewsService = require('../services/cryptoNewsService');

// Create new crypto news
async function createCryptoNews(req, res) {
    try {
        const { title, content, author, imageUrl } = req.body;
        const newCryptoNews = await cryptoNewsService.createCryptoNews({ title, content, author, imageUrl });
        res.status(201).json({ success: true, cryptoNews: newCryptoNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get all crypto news
async function getAllCryptoNews(req, res) {
    try {
        const cryptoNews = await cryptoNewsService.getAllCryptoNews();
        res.status(200).json({ success: true, cryptoNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get crypto news by ID
async function getCryptoNewsById(req, res) {
    try {
        const { id } = req.params;
        const cryptoNews = await cryptoNewsService.getCryptoNewsById(id);
        if (!cryptoNews) {
            res.status(404).json({ success: false, error: 'Crypto news not found' });
            return;
        }
        res.status(200).json({ success: true, cryptoNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Update crypto news
async function updateCryptoNews(req, res) {
    try {
        const { id } = req.params;
        const { title, content, author, imageUrl } = req.body;

        const updatedCryptoNews = await cryptoNewsService.updateCryptoNews(id, { title, content, author, imageUrl });
        if (!updatedCryptoNews) {
            return res.status(404).json({ success: false, error: 'Crypto news not found' });
        }

        res.status(200).json({ success: true, cryptoNews: updatedCryptoNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Delete crypto news
async function deleteCryptoNews(req, res) {
    try {
        const { id } = req.params;
        await cryptoNewsService.deleteCryptoNews(id);
        res.status(200).json({ success: true, message: 'Crypto news deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get latest crypto news
async function getLatestCryptoNews(req, res) {
    try {
        const { limit } = req.query;
        const latestCryptoNews = await cryptoNewsService.getLatestCryptoNews(Number(limit) || 5);
        res.status(200).json({ success: true, cryptoNews: latestCryptoNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get recent crypto news
async function getRecentCryptoNews(req, res) {
    try {
        const { days } = req.query;
        const recentCryptoNews = await cryptoNewsService.getRecentCryptoNews(Number(days) || 7);
        res.status(200).json({ success: true, cryptoNews: recentCryptoNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get trending crypto news
async function getTrendingCryptoNews(req, res) {
    try {
        const { threshold } = req.query;
        const trendingCryptoNews = await cryptoNewsService.getTrendingCryptoNews(Number(threshold) || 3);
        res.status(200).json({ success: true, cryptoNews: trendingCryptoNews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    createCryptoNews,
    getAllCryptoNews,
    getCryptoNewsById,
    updateCryptoNews,
    deleteCryptoNews,
    getLatestCryptoNews,
    getRecentCryptoNews,
    getTrendingCryptoNews
};


// const cryptoNewsService = require('../services/cryptoNewsService');

// // Create new crypto news
// async function createCryptoNews(req, res) {
//     try {
//         const { title, content, author, imageUrl } = req.body;
//         const newCryptoNews = await cryptoNewsService.createCryptoNews({ title, content, author, imageUrl });
//         res.status(201).json({ success: true, cryptoNews: newCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get all crypto news
// async function getAllCryptoNews(req, res) {
//     try {
//         const cryptoNews = await cryptoNewsService.getAllCryptoNews();
//         res.status(200).json({ success: true, cryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get crypto news by ID
// async function getCryptoNewsById(req, res) {
//     try {
//         const { id } = req.params;
//         const cryptoNews = await cryptoNewsService.getCryptoNewsById(id);
//         if (!cryptoNews) {
//             res.status(404).json({ success: false, error: 'Crypto news not found' });
//             return;
//         }
//         res.status(200).json({ success: true, cryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Update crypto news
// async function updateCryptoNews(req, res) {
//     try {
//         const { id } = req.params;
//         const { title, content, author, imageUrl } = req.body;

//         const updatedCryptoNews = await cryptoNewsService.updateCryptoNews(id, { title, content, author, imageUrl });
//         if (!updatedCryptoNews) {
//             return res.status(404).json({ success: false, error: 'Crypto news not found' });
//         }

//         res.status(200).json({ success: true, cryptoNews: updatedCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Delete crypto news
// async function deleteCryptoNews(req, res) {
//     try {
//         const { id } = req.params;
//         await cryptoNewsService.deleteCryptoNews(id);
//         res.status(200).json({ success: true, message: 'Crypto news deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get latest crypto news
// async function getLatestCryptoNews(req, res) {
//     try {
//         const { limit } = req.query;
//         const latestCryptoNews = await cryptoNewsService.getLatestCryptoNews(Number(limit) || 5);
//         res.status(200).json({ success: true, cryptoNews: latestCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get recent crypto news
// async function getRecentCryptoNews(req, res) {
//     try {
//         const { days } = req.query;
//         const recentCryptoNews = await cryptoNewsService.getRecentCryptoNews(Number(days) || 7);
//         res.status(200).json({ success: true, cryptoNews: recentCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get trending crypto news
// async function getTrendingCryptoNews(req, res) {
//     try {
//         const { threshold } = req.query;
//         const trendingCryptoNews = await cryptoNewsService.getTrendingCryptoNews(Number(threshold) || 3);
//         res.status(200).json({ success: true, cryptoNews: trendingCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     createCryptoNews,
//     getAllCryptoNews,
//     getCryptoNewsById,
//     updateCryptoNews,
//     deleteCryptoNews,
//     getLatestCryptoNews,
//     getRecentCryptoNews,
//     getTrendingCryptoNews
// };



// const cryptoNewsService = require('../services/cryptoNewsService');

// // Create new crypto news
// async function createCryptoNews(req, res) {
//     try {
//         const { title, content, author } = req.body;
//         const newCryptoNews = await cryptoNewsService.createCryptoNews({ title, content, author });
//         res.status(201).json({ success: true, cryptoNews: newCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get all crypto news
// async function getAllCryptoNews(req, res) {
//     try {
//         const cryptoNews = await cryptoNewsService.getAllCryptoNews();
//         res.status(200).json({ success: true, cryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get crypto news by ID
// async function getCryptoNewsById(req, res) {
//     try {
//         const { id } = req.params;
//         const cryptoNews = await cryptoNewsService.getCryptoNewsById(id);
//         if (!cryptoNews) {
//             res.status(404).json({ success: false, error: 'Crypto news not found' });
//             return;
//         }
//         res.status(200).json({ success: true, cryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Update crypto news
// async function updateCryptoNews(req, res) {
//     try {
//         const { id } = req.params;
//         const { title, content, author } = req.body;

//         const updatedCryptoNews = await cryptoNewsService.updateCryptoNews(id, { title, content, author });
//         if (!updatedCryptoNews) {
//             return res.status(404).json({ success: false, error: 'Crypto news not found' });
//         }

//         res.status(200).json({ success: true, cryptoNews: updatedCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Delete crypto news
// async function deleteCryptoNews(req, res) {
//     try {
//         const { id } = req.params;
//         await cryptoNewsService.deleteCryptoNews(id);
//         res.status(200).json({ success: true, message: 'Crypto news deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get latest crypto news
// async function getLatestCryptoNews(req, res) {
//     try {
//         const { limit } = req.query;
//         const latestCryptoNews = await cryptoNewsService.getLatestCryptoNews(Number(limit) || 5);
//         res.status(200).json({ success: true, cryptoNews: latestCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get recent crypto news
// async function getRecentCryptoNews(req, res) {
//     try {
//         const { days } = req.query;
//         const recentCryptoNews = await cryptoNewsService.getRecentCryptoNews(Number(days) || 7);
//         res.status(200).json({ success: true, cryptoNews: recentCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Get trending crypto news
// async function getTrendingCryptoNews(req, res) {
//     try {
//         const { threshold } = req.query;
//         const trendingCryptoNews = await cryptoNewsService.getTrendingCryptoNews(Number(threshold) || 3);
//         res.status(200).json({ success: true, cryptoNews: trendingCryptoNews });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     createCryptoNews,
//     getAllCryptoNews,
//     getCryptoNewsById,
//     updateCryptoNews,
//     deleteCryptoNews,
//     getLatestCryptoNews,
//     getRecentCryptoNews,
//     getTrendingCryptoNews
// };
