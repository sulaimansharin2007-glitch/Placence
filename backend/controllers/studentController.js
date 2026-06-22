const Student = require('../models/Student');
const { calculateCapabilities } = require('../services/capabilityService');
const generateToken = require('../utils/generateToken');

// @desc    Get student profile
// @route   GET /api/students/:id
// @access  Private
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Faculty
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new student (pre-registration by faculty)
// @route   POST /api/students
// @access  Private/Faculty
const createStudent = async (req, res) => {
    const { name, email, classCounselor, collegeDetails } = req.body;

    try {
        if (!email.endsWith('@sonatech.ac.in')) {
            return res.status(400).json({ message: 'Student email must end with @sonatech.ac.in' });
        }

        const existing = await Student.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'A student with this email already exists' });
        }

        const student = await Student.create({
            name,
            email,
            password: 'PLACEHOLDER_NOT_ACTIVATED',
            role: 'student',
            isActivated: false,
            classCounselor: classCounselor || req.user.name,
            collegeDetails: collegeDetails || {}
        });

        res.status(201).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            classCounselor: student.classCounselor,
            isActivated: student.isActivated
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update student profile (only by assigned counselor or admin)
// @route   PUT /api/students/:id
// @access  Private/Faculty
const updateStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Counselor authorization check
        const loggedInUser = req.user;
        const isAdmin = loggedInUser.role === 'admin';
        const isCounselor = 
            loggedInUser.name === student.classCounselor ||
            loggedInUser.email === student.classCounselor;

        if (!isAdmin && !isCounselor) {
            return res.status(403).json({ 
                message: `Only the assigned counselor (${student.classCounselor}) can update this student's profile.` 
            });
        }

        // Update fields
        if (req.body.collegeDetails) {
            student.collegeDetails = { ...student.collegeDetails._doc || student.collegeDetails, ...req.body.collegeDetails };
        }

        if (req.body.academics) {
            if (req.body.academics.tenth) {
                student.academics.tenth = { ...student.academics.tenth._doc || student.academics.tenth, ...req.body.academics.tenth };
            }
            if (req.body.academics.twelfth) {
                student.academics.twelfth = { ...student.academics.twelfth._doc || student.academics.twelfth, ...req.body.academics.twelfth };
            }
            if (req.body.academics.cgpa !== undefined) {
                student.academics.cgpa = req.body.academics.cgpa;
            }
        }

        if (req.body.classCounselor !== undefined) student.classCounselor = req.body.classCounselor;
        if (req.body.skills !== undefined) student.skills = req.body.skills;
        if (req.body.activities !== undefined) student.activities = req.body.activities;
        if (req.body.certifications !== undefined) student.certifications = req.body.certifications;
        if (req.body.hackathons !== undefined) student.hackathons = req.body.hackathons;
        if (req.body.eventParticipations !== undefined) student.eventParticipations = req.body.eventParticipations;

        // Recalculate capabilities with the new formula
        student.capabilities = calculateCapabilities(student);

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudentProfile, updateStudentProfile, getAllStudents, createStudent };
