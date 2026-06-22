const express = require('express');
const router = express.Router();
const { addCompany, getCompanies, getCompanyById, extractCompanyDetails } = require('../controllers/companyController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCompanies)
    .post(protect, faculty, addCompany);

router.route('/extract')
    .post(protect, faculty, extractCompanyDetails);

router.route('/:id')
    .get(protect, getCompanyById);

module.exports = router;
