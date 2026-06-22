import { useState, useEffect } from 'react';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Cpu, MessageSquare } from 'lucide-react';

const CompanyPage = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data } = await API.get('/companies');
                setCompanies(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-500">Loading companies...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Partner Companies</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our network of companies and their recruitment criteria. 
                    Check your compatibility and start preparing today.
                </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {companies.map((company, index) => (
                    <motion.div 
                        key={company._id}
                        className="card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">{company.name}</h3>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Minimum Requirements</h4>
                            
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg overflow-hidden">
                                <span className="text-sm flex items-center gap-2 font-medium">
                                    <BookOpen className="w-4 h-4 text-gray-400" /> Aptitude
                                </span>
                                <span className="font-bold text-indigo-600">{company.requirements.aptitude}%</span>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg overflow-hidden">
                                <span className="text-sm flex items-center gap-2 font-medium">
                                    <Cpu className="w-4 h-4 text-gray-400" /> Coding
                                </span>
                                <span className="font-bold text-indigo-600">{company.requirements.coding}%</span>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg overflow-hidden">
                                <span className="text-sm flex items-center gap-2 font-medium">
                                    <MessageSquare className="w-4 h-4 text-gray-400" /> Communication
                                </span>
                                <span className="font-bold text-indigo-600">{company.requirements.communication}%</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 italic text-xs text-gray-400">
                            * Weightage: Aptitude ({Math.round(company.weightage.aptitude * 100)}%), 
                            Coding ({Math.round(company.weightage.coding * 100)}%), 
                            Comm. ({Math.round(company.weightage.communication * 100)}%)
                        </div>
                    </motion.div>
                ))}
            </div>

            {companies.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400">No companies listed yet. Check back later!</p>
                </div>
            )}
        </div>
    );
};

export default CompanyPage;
