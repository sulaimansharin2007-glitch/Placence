import { useState, useEffect } from 'react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, AlertCircle, Lightbulb, CheckCircle2, Brain } from 'lucide-react';

const PredictionPage = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predicting, setPredicting] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            const { data } = await API.get('/companies');
            setCompanies(data);
        };
        fetchCompanies();
    }, []);

    const handlePredict = async () => {
        if (!selectedCompany) return;
        setPredicting(true);
        setResult(null);
        try {
            const { data } = await API.post('/predict', { companyId: selectedCompany });
            // Simulate AI thinking time for better UX
            setTimeout(() => {
                setResult(data);
                setPredicting(false);
            }, 1500);
        } catch (err) {
            console.error(err);
            setPredicting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Placement Probability</h1>
                <p className="text-gray-600 max-w-xl mx-auto">
                    Select a company to analyze your profile against their specific requirements and get your placement readiness score.
                </p>
            </header>

            <div className="card mb-12">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Choose Company</label>
                        <select 
                            className="input"
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                        >
                            <option value="">Select a company...</option>
                            {companies.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={handlePredict}
                        disabled={!selectedCompany || predicting}
                        className="btn btn-primary h-[42px] px-8 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                    >
                        {predicting ? (
                            <>
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                Analyzing...
                            </>
                        ) : 'Predict My Placement'}
                    </button>
                </div>
            </div>

            {(() => {
                const activeCompany = companies.find(c => c._id === selectedCompany);
                if (!activeCompany) return null;
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card mb-12 border border-gray-100 bg-gray-50/50"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Search className="w-5 h-5 text-indigo-600"/> {activeCompany.name} Requirements
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase">Min Aptitude</span>
                                <p className="text-2xl font-black text-indigo-600 mt-1">{activeCompany.requirements?.aptitude}%</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase">Min Coding</span>
                                <p className="text-2xl font-black text-indigo-600 mt-1">{activeCompany.requirements?.coding}%</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase">Min Communication</span>
                                <p className="text-2xl font-black text-indigo-600 mt-1">{activeCompany.requirements?.communication}%</p>
                            </div>
                        </div>

                        {activeCompany.extractedRequirements?.length > 0 && (
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Required Skills / Technologies</span>
                                <div className="flex flex-wrap gap-2">
                                    {activeCompany.extractedRequirements.map((req, i) => (
                                        <span key={i} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-100/50">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                );
            })()}

            <AnimatePresence mode="wait">
                {result && (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-8"
                    >
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Probability Circle */}
                            <div className="card flex flex-col items-center justify-center p-12 text-center">
                                <h3 className="text-xl font-bold mb-8">Success Probability</h3>
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    <svg className="w-full h-full circular-progress">
                                        <circle 
                                            cx="50%" cy="50%" r="45%" 
                                            className="fill-none stroke-gray-100 stroke-[12]"
                                        />
                                        <motion.circle 
                                            cx="50%" cy="50%" r="45%" 
                                            className="fill-none stroke-indigo-600 stroke-[12]"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: "0 1000" }}
                                            animate={{ strokeDasharray: `${result.probability * 2.83} 1000` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <span className="absolute text-5xl font-black text-indigo-600">
                                        {result.probability}%
                                    </span>
                                </div>
                                <p className="mt-8 text-gray-500 font-medium italic">
                                    {result.probability > 75 ? 'Highly Probable' : result.probability > 50 ? 'Moderate Chance' : 'Needs Improvement'}
                                </p>
                            </div>

                            {/* Gaps & Strengths */}
                            <div className="space-y-6">
                                <div className="card border-l-4 border-success-DEFAULT p-6">
                                    <h4 className="flex items-center gap-2 font-bold mb-4 text-success-DEFAULT">
                                        <Trophy className="w-5 h-5" /> Your Strengths
                                    </h4>
                                    <div className="space-y-2">
                                        {['Aptitude', 'Coding', 'Communication'].filter(c => !result.gaps.includes(c)).map(s => (
                                            <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                                                <CheckCircle2 className="w-4 h-4 text-success-DEFAULT" /> {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="card border-l-4 border-danger-DEFAULT p-6">
                                    <h4 className="flex items-center gap-2 font-bold mb-4 text-danger-DEFAULT">
                                        <AlertCircle className="w-5 h-5" /> Identified Gaps
                                    </h4>
                                    <div className="space-y-2">
                                        {result.gaps.length > 0 ? result.gaps.map(g => (
                                            <div key={g} className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-danger-DEFAULT" /> {g}
                                            </div>
                                        )) : <p className="text-sm text-gray-400">No significant gaps found!</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Missing Required Skills */}
                        {result.probability < 75 && result.missingSkills?.length > 0 && (
                            <div className="card border-l-4 border-amber-500 bg-amber-50/30 p-6">
                                <h4 className="flex items-center gap-2 font-bold mb-3 text-amber-700 text-lg">
                                    <AlertCircle className="w-5 h-5 text-amber-500" /> Skills You Need to Improve
                                </h4>
                                <p className="text-sm text-amber-800 mb-4 font-medium">
                                    These specific skills/technologies are required by the company but are currently missing from your student profile. Ask a faculty member to update your profile with these once acquired:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingSkills.map((skill, i) => (
                                        <span key={i} className="bg-white text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        <div className="card bg-indigo-50 border-none">
                            <h4 className="flex items-center gap-2 font-bold mb-6 text-indigo-700 text-lg">
                                <Lightbulb className="w-6 h-6" /> Actionable Suggestions
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {result.suggestions.map((s, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 flex gap-3"
                                    >
                                        <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">{s}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {predicting && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-20"
                    >
                        <div className="inline-block relative">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <Brain className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="mt-4 text-gray-500 font-bold animate-pulse">Running Deep Analysis Engine...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PredictionPage;
