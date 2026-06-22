const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    probability: { type: Number, required: true },
    gaps: [{ type: String }],
    suggestions: [{ type: String }],
    missingSkills: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
