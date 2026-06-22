const Company = require('../models/Company');
const axios = require('axios');
const cheerio = require('cheerio');

// @desc    Add new company
// @route   POST /api/companies
// @access  Private/Faculty
const addCompany = async (req, res) => {
    const { name, requirements, weightage, officialWebsite, extractedRequirements } = req.body;

    try {
        const company = await Company.create({
            name,
            requirements,
            weightage,
            officialWebsite,
            extractedRequirements
        });

        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({});
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (company) {
            res.json(company);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Extract requirements from official website
// @route   POST /api/companies/extract
// @access  Private/Faculty
const extractCompanyDetails = async (req, res) => {
    const { url } = req.body;
    try {
        if (!url) return res.status(400).json({ message: 'URL is required' });
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const $ = cheerio.load(response.data);
        
        const text = $('body').text().toLowerCase();
        
        let aptitude = 50;
        let coding = 50;
        let communication = 50;
        let extractedRequirements = [];

        if (text.includes('data structure') || text.includes('algorithm') || text.includes('c++') || text.includes('java')) coding += 35;
        else if (text.includes('programming') || text.includes('software')) coding += 20;

        if (text.includes('communication') || text.includes('verbal')) communication += 35;
        else if (text.includes('team') || text.includes('leadership')) communication += 20;
        
        if (text.includes('analytical') || text.includes('problem solving')) aptitude += 35;

        $('li').each((i, el) => {
            const liText = $(el).text().trim();
            if (liText.length > 10 && liText.length < 200) {
                const lower = liText.toLowerCase();
                if (lower.includes('experience') || lower.includes('ability') || lower.includes('strong') || lower.includes('knowledge') || lower.includes('degree') || lower.includes('skills')) {
                    extractedRequirements.push(liText);
                }
            }
        });
        
        extractedRequirements = [...new Set(extractedRequirements)].slice(0, 10);

        res.json({
            requirements: {
                aptitude: Math.min(aptitude, 95),
                coding: Math.min(coding, 95),
                communication: Math.min(communication, 95)
            },
            extractedRequirements,
            officialWebsite: url
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to extract data: ' + error.message });
    }
};

module.exports = { addCompany, getCompanies, getCompanyById, extractCompanyDetails };
