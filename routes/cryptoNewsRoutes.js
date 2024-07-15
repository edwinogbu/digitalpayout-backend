const express = require('express');
const router = express.Router();
const cryptoNewsController = require('../controllers/cryptoNewsController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');



router.get('/news', cryptoNewsController.getAllCryptoNews);
router.get('/news/:id', cryptoNewsController.getCryptoNewsById);
router.post('/create', uploadMiddleware, cryptoNewsController.createCryptoNews);
router.put('/update/:id', cryptoNewsController.updateCryptoNews);
router.delete('/delete/:id', cryptoNewsController.deleteCryptoNews);

router.get('/news/latest', cryptoNewsController.getLatestCryptoNews);
router.get('/news/recent', cryptoNewsController.getRecentCryptoNews);
router.get('/news/trending', cryptoNewsController.getTrendingCryptoNews);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const cryptoNewsController = require('../controllers/cryptoNewsController');

// // POST create new crypto news
// router.post('/crypto-news', cryptoNewsController.createCryptoNews);

// // GET all crypto news
// router.get('/crypto-news', cryptoNewsController.getAllCryptoNews);

// // GET crypto news by ID
// router.get('/crypto-news/:id', cryptoNewsController.getCryptoNewsById);

// // PUT update crypto news
// router.put('/crypto-news/:id', cryptoNewsController.updateCryptoNews);

// // DELETE delete crypto news
// router.delete('/crypto-news/:id', cryptoNewsController.deleteCryptoNews);

// // GET latest crypto news
// router.get('/crypto-news/latest', cryptoNewsController.getLatestCryptoNews);

// // GET recent crypto news
// router.get('/crypto-news/recent', cryptoNewsController.getRecentCryptoNews);

// // GET trending crypto news
// router.get('/crypto-news/trending', cryptoNewsController.getTrendingCryptoNews);

// module.exports = router;
