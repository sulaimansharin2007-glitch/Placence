const express = require('express');
const router = express.Router();
const { getStudentProfile, updateStudentProfile, getAllStudents, createStudent } = require('../controllers/studentController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, faculty, getAllStudents)
    .post(protect, faculty, createStudent);

router.route('/:id')
    .get(protect, getStudentProfile)
    .put(protect, faculty, updateStudentProfile);

module.exports = router;
