const calculatePrediction = (student, company) => {
    const { capabilities } = student;
    const { aptitude, coding, communication } = capabilities;
    const { requirements, weightage } = company;
    
    // Calculate raw score based on weightage
    const score = (aptitude * weightage.aptitude) + 
                  (coding * weightage.coding) + 
                  (communication * weightage.communication);
                  
    // Calculate probability (normalized against requirements)
    const requiredScore = (requirements.aptitude * weightage.aptitude) + 
                          (requirements.coding * weightage.coding) + 
                          (requirements.communication * weightage.communication);
    
    let probability = (score / requiredScore) * 100;
    probability = Math.min(Math.round(probability), 100);
    
    const gaps = [];
    const suggestions = [];
    
    if (aptitude < requirements.aptitude) {
        gaps.push('Aptitude');
        suggestions.push('Improve quantitative aptitude and logical reasoning');
    }
    
    if (coding < requirements.coding) {
        gaps.push('Coding');
        suggestions.push('Practice Data Structures and Algorithms (DSA) on platforms like LeetCode or CodeChef');
    }
    
    if (communication < requirements.communication) {
        gaps.push('Communication');
        suggestions.push('Participate in group discussions, seminars, or public speaking activities');
    }
    
    if (student.skills.length < 3) {
        suggestions.push('Learn new industry-relevant skills like Cloud Computing, AI, or Web Frameworks');
    }
    
    const missingSkills = [];
    if (company.extractedRequirements && company.extractedRequirements.length > 0) {
        company.extractedRequirements.forEach(reqSkill => {
            const hasSkill = (student.skills || []).some(studentSkill => 
                reqSkill.toLowerCase().includes(studentSkill.toLowerCase()) ||
                studentSkill.toLowerCase().includes(reqSkill.toLowerCase())
            );
            if (!hasSkill) {
                missingSkills.push(reqSkill);
            }
        });
    }
    
    return {
        probability,
        gaps,
        suggestions,
        missingSkills
    };
};

module.exports = { calculatePrediction };
