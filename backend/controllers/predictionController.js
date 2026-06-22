const Prediction = require('../models/Prediction');
const Student = require('../models/Student');
const Company = require('../models/Company');
const { calculatePrediction } = require('../services/predictionService');

// @desc    Predict placement probability
// @route   POST /api/predict
// @access  Private
const predictPlacement = async (req, res) => {
    const { companyId } = req.body;
    const studentId = req.user._id;

    try {
        const student = await Student.findById(studentId);
        const company = await Company.findById(companyId);

        if (!student || !company) {
            return res.status(404).json({ message: 'Student or Company not found' });
        }

        const { probability, gaps, suggestions, missingSkills } = calculatePrediction(student, company);

        const prediction = await Prediction.create({
            studentId,
            companyId,
            probability,
            gaps,
            suggestions,
            missingSkills
        });

        const populatedPrediction = await prediction.populate('companyId');
        res.status(201).json(populatedPrediction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { predictPlacement };
