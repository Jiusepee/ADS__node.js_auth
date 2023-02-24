const express = require('express');
const { set } = require('mongoose');
const router = express.Router();

const {
    setAds, getAds, updateAd, deleteAd
} = require('../controllers/adController');


const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, setAds).get(protect, getAds);
router.route('/:id').put(protect, updateAd).delete(protect, deleteAd);

module.exports = router;