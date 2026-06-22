const mongoose = require('mongoose');
const Company = require('./models/Company');
require('dotenv').config();

const companies = [
    {
        name: 'Google',
        requirements: { aptitude: 85, coding: 90, communication: 80 },
        weightage: { aptitude: 0.2, coding: 0.6, communication: 0.2 }
    },
    {
        name: 'Microsoft',
        requirements: { aptitude: 80, coding: 85, communication: 75 },
        weightage: { aptitude: 0.3, coding: 0.5, communication: 0.2 }
    },
    {
        name: 'Amazon',
        requirements: { aptitude: 85, coding: 80, communication: 85 },
        weightage: { aptitude: 0.25, coding: 0.45, communication: 0.3 }
    },
    {
        name: 'TCS',
        requirements: { aptitude: 60, coding: 50, communication: 70 },
        weightage: { aptitude: 0.4, coding: 0.3, communication: 0.3 }
    },
    {
        name: 'Infosys',
        requirements: { aptitude: 65, coding: 55, communication: 65 },
        weightage: { aptitude: 0.4, coding: 0.3, communication: 0.3 }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');
        
        // Only seed if no companies exist
        const count = await Company.countDocuments();
        if (count === 0) {
            await Company.insertMany(companies);
            console.log('Sample companies seeded successfully!');
        } else {
            console.log('Companies already exist, skipping seed.');
        }
        
        mongoose.disconnect();
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
