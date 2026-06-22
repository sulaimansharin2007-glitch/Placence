// Keyword lists for skill classification
const CODING_KEYWORDS = [
    'python', 'java', 'c++', 'c', 'javascript', 'js', 'react', 'node', 'nodejs', 'html', 'css',
    'sql', 'mysql', 'mongodb', 'django', 'flask', 'spring', 'angular', 'vue', 'typescript',
    'kotlin', 'swift', 'php', 'ruby', 'go', 'rust', 'scala', 'r', 'matlab', 'tensorflow',
    'pytorch', 'machine learning', 'deep learning', 'ai', 'data science', 'data structures',
    'dsa', 'algorithms', 'leetcode', 'competitive programming', 'git', 'linux', 'docker',
    'kubernetes', 'aws', 'azure', 'cloud', 'devops', 'api', 'rest', 'graphql', 'flutter',
    'android', 'ios', 'blockchain', 'cybersecurity', 'networking', 'embedded', 'arduino',
    'raspberry pi', 'opencv', 'nlp', 'web development', 'software', 'programming', 'coding'
];

const COMMUNICATION_KEYWORDS = [
    'communication', 'english', 'public speaking', 'leadership', 'management', 'teamwork',
    'team player', 'presentation', 'verbal', 'writing', 'soft skills', 'interpersonal',
    'negotiation', 'conflict resolution', 'time management', 'critical thinking', 'adaptability',
    'creativity', 'problem solving', 'analytical', 'debate', 'drama', 'theatre', 'singing',
    'dancing', 'sports', 'yoga', 'nss', 'ncc', 'red cross', 'volunteer', 'social service'
];

const APTITUDE_KEYWORDS = [
    'aptitude', 'problem solving', 'mathematics', 'maths', 'logical', 'reasoning',
    'quantitative', 'verbal', 'analytical', 'cat', 'gre', 'gmat', 'toefl', 'ielts',
    'statistics', 'probability', 'calculus', 'algebra', 'geometry', 'number theory'
];

const CODING_CERTIFICATION_KEYWORDS = [
    'aws', 'azure', 'google cloud', 'python', 'java', 'javascript', 'web development',
    'data science', 'machine learning', 'cybersecurity', 'networking', 'cisco', 'oracle',
    'microsoft', 'programming', 'coding', 'software', 'cloud', 'devops', 'docker', 'kubernetes',
    'ai', 'blockchain', 'database', 'sql', 'mongodb', 'tensorflow', 'pytorch'
];

const COMMUNICATION_CERTIFICATION_KEYWORDS = [
    'english', 'ielts', 'toefl', 'communication', 'public speaking', 'leadership',
    'management', 'soft skills', 'personality development', 'hr', 'french', 'german',
    'spanish', 'japanese', 'chinese', 'foreign language'
];

function hasKeyword(text, keywords) {
    const lower = text.toLowerCase();
    return keywords.some(kw => lower.includes(kw));
}

const calculateCapabilities = (student) => {
    const { academics, skills = [], activities = [], certifications = [], hackathons = [], eventParticipations = [] } = student;

    // ============================================================
    // APTITUDE (0-100)
    // 50% from academic marks (10th + 12th core subjects avg)
    // 30% from CGPA (out of 10 scale to 100)
    // 20% from aptitude-related skills
    // ============================================================
    const tenth = academics?.tenth || {};
    const twelfth = academics?.twelfth || {};
    const cgpa = academics?.cgpa || 0;

    const academicMarks = [
        tenth.maths || 0,
        tenth.science || 0,
        twelfth.maths || 0,
        twelfth.physics || 0,
        twelfth.chemistry || 0
    ].filter(v => v > 0);
    const academicAvg = academicMarks.length > 0 
        ? academicMarks.reduce((sum, v) => sum + v, 0) / academicMarks.length
        : 0;

    const academicScore = (academicAvg / 100) * 50;
    const cgpaScore = (cgpa / 10) * 30;
    const aptitudeSkillCount = skills.filter(s => hasKeyword(s, APTITUDE_KEYWORDS)).length;
    const aptitudeSkillScore = Math.min(aptitudeSkillCount * 5, 20);

    const aptitude = Math.min(Math.round(academicScore + cgpaScore + aptitudeSkillScore), 100);

    // ============================================================
    // CODING (0-100)
    // Coding skills:      15 pts each, max 60
    // Hackathons:         20 pts each, max 30
    // Coding certifications: 8 pts each, max 20  
    // Coding events:      5 pts each, max 10
    // ============================================================ (total cap: 100)
    const codingSkillCount = skills.filter(s => hasKeyword(s, CODING_KEYWORDS)).length;
    const codingSkillScore = Math.min(codingSkillCount * 15, 60);
    const hackathonScore = Math.min(hackathons.length * 20, 30);
    const codingCertCount = certifications.filter(c => hasKeyword(c, CODING_CERTIFICATION_KEYWORDS)).length;
    const codingCertScore = Math.min(codingCertCount * 8, 20);
    const codingEventCount = eventParticipations.filter(e => hasKeyword(e, CODING_KEYWORDS)).length;
    const codingEventScore = Math.min(codingEventCount * 5, 10);

    const coding = Math.min(Math.round(codingSkillScore + hackathonScore + codingCertScore + codingEventScore), 100);

    // ============================================================
    // COMMUNICATION (0-100)
    // Communication skills: 15 pts each, max 30
    // Activities:           12 pts each, max 36
    // Communication certifications: 15 pts each, max 24
    // Communication events: 8 pts each, max 20
    // 10th/12th English marks: bonus up to 10 pts
    // ============================================================
    const commSkillCount = skills.filter(s => hasKeyword(s, COMMUNICATION_KEYWORDS)).length;
    const commSkillScore = Math.min(commSkillCount * 15, 30);
    const activityScore = Math.min(activities.length * 12, 36);
    const commCertCount = certifications.filter(c => hasKeyword(c, COMMUNICATION_CERTIFICATION_KEYWORDS)).length;
    const commCertScore = Math.min(commCertCount * 15, 24);
    const commEventCount = eventParticipations.filter(e => hasKeyword(e, COMMUNICATION_KEYWORDS)).length;
    const commEventScore = Math.min(commEventCount * 8, 20);
    const englishAvg = ((tenth.english || 0) + (twelfth.english || 0)) / 2;
    const englishBonus = Math.round((englishAvg / 100) * 10);

    const communication = Math.min(Math.round(commSkillScore + activityScore + commCertScore + commEventScore + englishBonus), 100);

    return {
        aptitude: aptitude || 0,
        coding: coding || 0,
        communication: communication || 0
    };
};

module.exports = { calculateCapabilities };
