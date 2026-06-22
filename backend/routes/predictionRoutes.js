const express = require('express');
const router = express.Router();
const { predictPlacement } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, predictPlacement);

module.exports = router;
