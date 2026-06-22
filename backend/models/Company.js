const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    requirements: {
        aptitude: { type: Number, required: true },
        coding: { type: Number, required: true },
        communication: { type: Number, required: true }
    },
    weightage: {
        aptitude: { type: Number, required: true, default: 0.33 },
        coding: { type: Number, required: true, default: 0.34 },
        communication: { type: Number, required: true, default: 0.33 }
    },
    officialWebsite: { type: String },
    extractedRequirements: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
