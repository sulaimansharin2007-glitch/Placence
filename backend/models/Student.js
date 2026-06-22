const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: '' },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    isActivated: { type: Boolean, default: false },
    classCounselor: { type: String, default: '' },
    collegeDetails: {
        department: { type: String, default: '' },
        year: { type: String, default: '' },
        section: { type: String, default: '' },
        degree: { type: String, default: '' }
    },
    academics: {
        tenth: {
            maths: { type: Number, default: 0 },
            science: { type: Number, default: 0 },
            english: { type: Number, default: 0 },
            socialScience: { type: Number, default: 0 },
            tamil: { type: Number, default: 0 }
        },
        twelfth: {
            maths: { type: Number, default: 0 },
            physics: { type: Number, default: 0 },
            chemistry: { type: Number, default: 0 },
            english: { type: Number, default: 0 },
            tamil: { type: Number, default: 0 },
            computerScience: { type: Number, default: 0 },
            biology: { type: Number, default: 0 }
        },
        cgpa: { type: Number, default: 0 }
    },
    skills: [{ type: String }],
    activities: [{ type: String }],
    certifications: [{ type: String }],
    hackathons: [{ type: String }],
    eventParticipations: [{ type: String }],
    capabilities: {
        aptitude: { type: Number, default: 0 },
        coding: { type: Number, default: 0 },
        communication: { type: Number, default: 0 }
    }
}, { timestamps: true });

studentSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
