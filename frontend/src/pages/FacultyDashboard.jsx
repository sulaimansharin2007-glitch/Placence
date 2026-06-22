import { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Building2, BookOpen, Cpu, MessageSquare, Trash2, User, GraduationCap, UserPlus, Lock } from 'lucide-react';

const FacultyDashboard = () => {
    const { user } = useContext(AuthContext);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [view, setView] = useState('companies');
    const [students, setStudents] = useState([]);
    const [showAddStudent, setShowAddStudent] = useState(false);
    
    // Add student form state
    const [newStudentData, setNewStudentData] = useState({
        name: '',
        email: '',
        classCounselor: user?.name || '',
        collegeDetails: { department: '', year: '', section: '', degree: '' }
    });
    const [addStudentMsg, setAddStudentMsg] = useState({ type: '', text: '' });

    // Company form state
    const [formData, setFormData] = useState({
        name: '',
        requirements: { aptitude: 50, coding: 50, communication: 50 },
        weightage: { aptitude: 0.33, coding: 0.34, communication: 0.33 },
        officialWebsite: '',
        extractedRequirements: []
    });
    const [extracting, setExtracting] = useState(false);

    // Editing student states
    const [editingStudent, setEditingStudent] = useState(null);
    const [newSkill, setNewSkill] = useState('');
    const [newActivity, setNewActivity] = useState('');
    const [newCertification, setNewCertification] = useState('');
    const [newHackathon, setNewHackathon] = useState('');
    const [newEventParticipation, setNewEventParticipation] = useState('');

    const isMyCounselor = (student) =>
        student.classCounselor === user?.name || student.classCounselor === user?.email;

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setAddStudentMsg({ type: '', text: '' });
        if (!newStudentData.email.endsWith('@sonatech.ac.in')) {
            return setAddStudentMsg({ type: 'error', text: 'Student email must end with @sonatech.ac.in' });
        }
        try {
            await API.post('/students', newStudentData);
            setAddStudentMsg({ type: 'success', text: `Student ${newStudentData.name} added successfully! They can now activate their account using their college email.` });
            setNewStudentData({ name: '', email: '', classCounselor: user?.name || '', collegeDetails: { department: '', year: '', section: '', degree: '' } });
            const { data } = await API.get('/students');
            setStudents(data);
        } catch (err) {
            setAddStudentMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add student' });
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/students/${editingStudent._id}`, {
                collegeDetails: editingStudent.collegeDetails,
                academics: editingStudent.academics,
                skills: editingStudent.skills,
                activities: editingStudent.activities,
                certifications: editingStudent.certifications,
                hackathons: editingStudent.hackathons,
                eventParticipations: editingStudent.eventParticipations,
                classCounselor: editingStudent.classCounselor
            });
            alert('Student profile updated successfully!');
            setEditingStudent(null);
            const { data } = await API.get('/students');
            setStudents(data);
        } catch (err) {
            alert('Failed to update student: ' + (err.response?.data?.message || err.message));
        }
    };

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

    useEffect(() => {
        fetchCompanies();
        const fetchStudents = async () => {
            try {
                const { data } = await API.get('/students');
                setStudents(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/companies', formData);
            setShowForm(false);
            setFormData({
                name: '',
                requirements: { aptitude: 50, coding: 50, communication: 50 },
                weightage: { aptitude: 0.33, coding: 0.34, communication: 0.33 },
                officialWebsite: '',
                extractedRequirements: []
            });
            fetchCompanies();
        } catch (err) {
            alert('Error adding company');
        }
    };

    const handleExtract = async () => {
        if (!formData.officialWebsite) return alert('Enter a website URL first');
        setExtracting(true);
        try {
            const { data } = await API.post('/companies/extract', { url: formData.officialWebsite });
            setFormData(prev => ({
                ...prev,
                requirements: data.requirements,
                extractedRequirements: data.extractedRequirements
            }));
        } catch (err) {
            alert('Failed to extract: ' + (err.response?.data?.message || err.message));
        } finally {
            setExtracting(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold">Faculty Control Panel</h1>
                    <p className="text-gray-500 mt-2">Manage company requirements, register students, and enter their academic details</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setView('companies')} className={`btn ${view === 'companies' ? 'btn-primary' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>Companies</button>
                    <button onClick={() => setView('students')} className={`btn ${view === 'students' ? 'btn-primary' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>Students List</button>
                </div>
            </header>

            {/* ===================== COMPANIES VIEW ===================== */}
            {view === 'companies' && (
                <>
                    <div className="flex justify-end mb-6">
                        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2">
                            {showForm ? 'Close Form' : <><Plus className="w-5 h-5" /> Add New Company</>}
                        </button>
                    </div>

                    {showForm && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card mb-12 border-2 border-indigo-100">
                            <h2 className="text-2xl font-bold mb-8">Register New Company</h2>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Company Name</label>
                                    <input type="text" className="input" placeholder="e.g., Google, Amazon, Microsoft" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Company Official Website</label>
                                        <input type="url" className="input" placeholder="https://careers.company.com" value={formData.officialWebsite} onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })} />
                                    </div>
                                    <div className="flex items-end">
                                        <button type="button" onClick={handleExtract} disabled={extracting || !formData.officialWebsite} className="btn bg-indigo-100 text-indigo-700 hover:bg-indigo-200 whitespace-nowrap h-[42px] font-bold">
                                            {extracting ? 'Extracting via AI...' : 'Run Auto-Extraction'}
                                        </button>
                                    </div>
                                </div>

                                {formData.extractedRequirements?.length > 0 && (
                                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-emerald-800 mb-3">✓ Extracted Raw Requirements</h4>
                                        <ul className="list-disc pl-5 text-sm text-emerald-700 space-y-1">
                                            {formData.extractedRequirements.map((req, i) => <li key={i}>{req}</li>)}
                                        </ul>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div>
                                        <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2 border-b pb-2">
                                            <BookOpen className="w-5 h-5 text-indigo-600" /> Minimum Requirements (%)
                                        </h3>
                                        <div className="space-y-6">
                                            {['aptitude', 'coding', 'communication'].map(key => (
                                                <div key={key}>
                                                    <div className="flex justify-between mb-2">
                                                        <label className="text-sm font-semibold capitalize">{key}</label>
                                                        <span className="text-sm font-bold text-indigo-600">{formData.requirements[key]}%</span>
                                                    </div>
                                                    <input type="range" min="0" max="100" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                        value={formData.requirements[key]}
                                                        onChange={(e) => setFormData({ ...formData, requirements: { ...formData.requirements, [key]: Number(e.target.value) } })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2 border-b pb-2">
                                            <Cpu className="w-5 h-5 text-indigo-600" /> Scoring Weightage (0-1)
                                        </h3>
                                        <div className="space-y-6">
                                            {['aptitude', 'coding', 'communication'].map(key => (
                                                <div key={key}>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{key} Weight</label>
                                                    <input type="number" step="0.01" min="0" max="1" className="input"
                                                        value={formData.weightage[key]}
                                                        onChange={(e) => setFormData({ ...formData, weightage: { ...formData.weightage, [key]: Number(e.target.value) } })}
                                                    />
                                                </div>
                                            ))}
                                            <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 font-medium">
                                                Sum: {(formData.weightage.aptitude + formData.weightage.coding + formData.weightage.communication).toFixed(2)} (should be ~1.0)
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full py-4 text-lg shadow-xl shadow-indigo-100">Create Company Profile</button>
                            </form>
                        </motion.div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {companies.map(company => (
                            <div key={company._id} className="card flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{company.name}</h3>
                                        <p className="text-sm text-gray-500">Added on {new Date(company.createdAt).toLocaleDateString()}</p>
                                        <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                            <span>Apt: {company.requirements?.aptitude}%</span>
                                            <span>Cod: {company.requirements?.coding}%</span>
                                            <span>Com: {company.requirements?.communication}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase">Active</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ===================== STUDENTS VIEW ===================== */}
            {view === 'students' && (
                <div className="space-y-6">
                    {editingStudent ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card space-y-8">
                            <div className="flex justify-between items-center border-b pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold">Edit Student Details</h2>
                                    <p className="text-gray-500 font-medium">{editingStudent.name} ({editingStudent.email})</p>
                                </div>
                                <button onClick={() => setEditingStudent(null)} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800">Back to List</button>
                            </div>

                            <form onSubmit={handleUpdateStudent} className="space-y-8">
                                {/* College Details */}
                                <div>
                                    <h3 className="font-bold mb-4 text-gray-700 border-b pb-2 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-indigo-600"/> College Details
                                    </h3>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Degree/Branch</label>
                                            <input type="text" className="input mt-1" value={editingStudent.collegeDetails?.degree || ''} onChange={(e) => setEditingStudent({ ...editingStudent, collegeDetails: { ...editingStudent.collegeDetails, degree: e.target.value } })} placeholder="B.Tech" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                            <input type="text" className="input mt-1" value={editingStudent.collegeDetails?.department || ''} onChange={(e) => setEditingStudent({ ...editingStudent, collegeDetails: { ...editingStudent.collegeDetails, department: e.target.value } })} placeholder="CSE" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
                                            <input type="text" className="input mt-1" value={editingStudent.collegeDetails?.year || ''} onChange={(e) => setEditingStudent({ ...editingStudent, collegeDetails: { ...editingStudent.collegeDetails, year: e.target.value } })} placeholder="3rd Year" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Section</label>
                                            <input type="text" className="input mt-1" value={editingStudent.collegeDetails?.section || ''} onChange={(e) => setEditingStudent({ ...editingStudent, collegeDetails: { ...editingStudent.collegeDetails, section: e.target.value } })} placeholder="A" />
                                        </div>
                                    </div>
                                </div>

                                {/* Class Counselor field */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Class Counselor (assigned faculty)</label>
                                    <input type="text" className="input mt-1" value={editingStudent.classCounselor || ''} onChange={(e) => setEditingStudent({ ...editingStudent, classCounselor: e.target.value })} placeholder="Faculty name or email" />
                                </div>

                                {/* Academics: 10th and 12th Marks */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-bold mb-4 text-gray-700 border-b pb-2">10th Standard Marks</h3>
                                        <div className="space-y-4">
                                            {['maths', 'science', 'english', 'socialScience', 'tamil'].map(field => (
                                                <div key={field}>
                                                    <label className="text-xs font-bold text-gray-500 uppercase capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                                    <input type="number" min="0" max="100" className="input mt-1"
                                                        value={editingStudent.academics?.tenth?.[field] || 0}
                                                        onChange={(e) => setEditingStudent({ ...editingStudent, academics: { ...editingStudent.academics, tenth: { ...editingStudent.academics.tenth, [field]: Number(e.target.value) } } })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-4 text-gray-700 border-b pb-2">12th Standard Marks</h3>
                                        <div className="space-y-4">
                                            {['maths', 'physics', 'chemistry', 'english', 'tamil', 'computerScience', 'biology'].map(field => (
                                                <div key={field}>
                                                    <label className="text-xs font-bold text-gray-500 uppercase capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                                    <input type="number" min="0" max="100" className="input mt-1"
                                                        value={editingStudent.academics?.twelfth?.[field] || 0}
                                                        onChange={(e) => setEditingStudent({ ...editingStudent, academics: { ...editingStudent.academics, twelfth: { ...editingStudent.academics.twelfth, [field]: Number(e.target.value) } } })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Current Semester CGPA */}
                                <div>
                                    <h3 className="font-bold mb-4 text-gray-700 border-b pb-2">Current Semester CGPA</h3>
                                    <input
                                        type="number" step="0.01" min="0" max="10"
                                        className="input"
                                        placeholder="e.g. 8.5 (out of 10)"
                                        value={editingStudent.academics?.cgpa || 0}
                                        onChange={(e) => setEditingStudent({
                                            ...editingStudent,
                                            academics: { ...editingStudent.academics, cgpa: Number(e.target.value) }
                                        })}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Enter the student's latest CGPA (0–10 scale)</p>
                                </div>

                                {/* Skills, Activities, Certifications, Hackathons, Event Participations */}
                                <div className="space-y-6">
                                    {/* Skills */}
                                    <div>
                                        <label className="font-bold text-gray-700 mb-2 block">Skills</label>
                                        <div className="flex gap-2 mb-3">
                                            <input type="text" className="input" placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (newSkill && !editingStudent.skills.includes(newSkill)) { setEditingStudent({ ...editingStudent, skills: [...editingStudent.skills, newSkill] }); setNewSkill(''); }}}} />
                                            <button type="button" onClick={() => { if (newSkill && !editingStudent.skills.includes(newSkill)) { setEditingStudent({ ...editingStudent, skills: [...editingStudent.skills, newSkill] }); setNewSkill(''); }}} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(editingStudent.skills || []).map((s, i) => (
                                                <span key={i} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                    {s} <Trash2 className="w-3.5 h-3.5 cursor-pointer" onClick={() => setEditingStudent({ ...editingStudent, skills: editingStudent.skills.filter(sk => sk !== s) })} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Activities */}
                                    <div>
                                        <label className="font-bold text-gray-700 mb-2 block">Activities</label>
                                        <div className="flex gap-2 mb-3">
                                            <input type="text" className="input" placeholder="Add an activity..." value={newActivity} onChange={(e) => setNewActivity(e.target.value)} />
                                            <button type="button" onClick={() => { if (newActivity && !editingStudent.activities.includes(newActivity)) { setEditingStudent({ ...editingStudent, activities: [...editingStudent.activities, newActivity] }); setNewActivity(''); }}} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(editingStudent.activities || []).map((a, i) => (
                                                <span key={i} className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                    {a} <Trash2 className="w-3.5 h-3.5 cursor-pointer" onClick={() => setEditingStudent({ ...editingStudent, activities: editingStudent.activities.filter(ac => ac !== a) })} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Certifications */}
                                    <div>
                                        <label className="font-bold text-gray-700 mb-2 block">Certifications</label>
                                        <div className="flex gap-2 mb-3">
                                            <input type="text" className="input" placeholder="Add a certification..." value={newCertification} onChange={(e) => setNewCertification(e.target.value)} />
                                            <button type="button" onClick={() => { if (newCertification && !editingStudent.certifications.includes(newCertification)) { setEditingStudent({ ...editingStudent, certifications: [...editingStudent.certifications, newCertification] }); setNewCertification(''); }}} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(editingStudent.certifications || []).map((c, i) => (
                                                <span key={i} className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                    {c} <Trash2 className="w-3.5 h-3.5 cursor-pointer" onClick={() => setEditingStudent({ ...editingStudent, certifications: editingStudent.certifications.filter(cert => cert !== c) })} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hackathons */}
                                    <div>
                                        <label className="font-bold text-gray-700 mb-2 block">Hackathons Participated</label>
                                        <div className="flex gap-2 mb-3">
                                            <input type="text" className="input" placeholder="Add a hackathon..." value={newHackathon} onChange={(e) => setNewHackathon(e.target.value)} />
                                            <button type="button" onClick={() => { if (newHackathon && !editingStudent.hackathons.includes(newHackathon)) { setEditingStudent({ ...editingStudent, hackathons: [...editingStudent.hackathons, newHackathon] }); setNewHackathon(''); }}} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(editingStudent.hackathons || []).map((h, i) => (
                                                <span key={i} className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                    {h} <Trash2 className="w-3.5 h-3.5 cursor-pointer" onClick={() => setEditingStudent({ ...editingStudent, hackathons: editingStudent.hackathons.filter(hack => hack !== h) })} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Event Participations */}
                                    <div>
                                        <label className="font-bold text-gray-700 mb-2 block">Event Participations</label>
                                        <div className="flex gap-2 mb-3">
                                            <input type="text" className="input" placeholder="Add event participation..." value={newEventParticipation} onChange={(e) => setNewEventParticipation(e.target.value)} />
                                            <button type="button" onClick={() => { if (newEventParticipation && !editingStudent.eventParticipations.includes(newEventParticipation)) { setEditingStudent({ ...editingStudent, eventParticipations: [...editingStudent.eventParticipations, newEventParticipation] }); setNewEventParticipation(''); }}} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(editingStudent.eventParticipations || []).map((ep, i) => (
                                                <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                    {ep} <Trash2 className="w-3.5 h-3.5 cursor-pointer" onClick={() => setEditingStudent({ ...editingStudent, eventParticipations: editingStudent.eventParticipations.filter(e => e !== ep) })} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full py-4 text-lg">Save Student Profile</button>
                            </form>
                        </motion.div>
                    ) : (
                        <>
                            {/* Add Student Button */}
                            <div className="flex justify-end">
                                <button onClick={() => setShowAddStudent(!showAddStudent)} className="btn btn-primary flex items-center gap-2">
                                    {showAddStudent ? 'Close' : <><UserPlus className="w-5 h-5" /> Add New Student</>}
                                </button>
                            </div>

                            {/* Add Student Form */}
                            {showAddStudent && (
                                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card border-2 border-emerald-100">
                                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><UserPlus className="w-5 h-5 text-emerald-600"/> Register New Student</h2>
                                    <p className="text-sm text-gray-500 mb-6">Add the student's college email. They will use this email to activate their account and set a password.</p>

                                    {addStudentMsg.text && (
                                        <div className={`p-3 rounded-lg mb-4 text-sm border ${addStudentMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                            {addStudentMsg.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleAddStudent} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">Student Full Name</label>
                                                <input type="text" className="input mt-1" placeholder="John Doe" value={newStudentData.name} onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">College Email ID</label>
                                                <input type="email" className="input mt-1" placeholder="student@college.edu" value={newStudentData.email} onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Class Counselor (your name)</label>
                                            <input type="text" className="input mt-1" value={newStudentData.classCounselor} onChange={(e) => setNewStudentData({ ...newStudentData, classCounselor: e.target.value })} placeholder="Faculty name" />
                                            <p className="text-xs text-gray-400 mt-1">Only the class counselor assigned here can later edit this student's details.</p>
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">Degree</label>
                                                <input type="text" className="input mt-1" placeholder="B.Tech" value={newStudentData.collegeDetails.degree} onChange={(e) => setNewStudentData({ ...newStudentData, collegeDetails: { ...newStudentData.collegeDetails, degree: e.target.value } })} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                                <input type="text" className="input mt-1" placeholder="CSE" value={newStudentData.collegeDetails.department} onChange={(e) => setNewStudentData({ ...newStudentData, collegeDetails: { ...newStudentData.collegeDetails, department: e.target.value } })} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
                                                <input type="text" className="input mt-1" placeholder="3rd Year" value={newStudentData.collegeDetails.year} onChange={(e) => setNewStudentData({ ...newStudentData, collegeDetails: { ...newStudentData.collegeDetails, year: e.target.value } })} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">Section</label>
                                                <input type="text" className="input mt-1" placeholder="A" value={newStudentData.collegeDetails.section} onChange={(e) => setNewStudentData({ ...newStudentData, collegeDetails: { ...newStudentData.collegeDetails, section: e.target.value } })} />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-full py-3">Add Student</button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Students List */}
                            {students.map(student => {
                                const canEdit = isMyCounselor(student);
                                return (
                                    <div key={student._id} className="card flex flex-col md:flex-row justify-between md:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl uppercase">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl">{student.name}</h3>
                                                <p className="text-sm text-gray-500">{student.email}</p>
                                                <div className="flex gap-2 mt-1 flex-wrap">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${student.isActivated ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {student.isActivated ? '✓ Activated' : '⏳ Not Activated'}
                                                    </span>
                                                    {student.classCounselor && (
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                                            Counselor: {student.classCounselor}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 md:justify-end">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-400 uppercase">Degree & Dept</span>
                                                <span className="font-bold text-gray-800">{student.collegeDetails?.degree || 'N/A'} - {student.collegeDetails?.department || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-400 uppercase">Year / Section</span>
                                                <span className="font-bold text-gray-800">{student.collegeDetails?.year || 'N/A'} / {student.collegeDetails?.section || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-indigo-400 uppercase">CGPA</span>
                                                <span className="font-bold text-lg text-indigo-700">{student.academics?.cgpa ?? '—'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-gray-100 mt-2 md:mt-0">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-1"><BookOpen className="w-3 h-3"/> Apt.</span>
                                                <span className="font-bold text-lg text-indigo-700">{student.capabilities?.aptitude || 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-1"><Cpu className="w-3 h-3"/> Cod.</span>
                                                <span className="font-bold text-lg text-indigo-700">{student.capabilities?.coding || 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-1"><MessageSquare className="w-3 h-3"/> Com.</span>
                                                <span className="font-bold text-lg text-indigo-700">{student.capabilities?.communication || 0}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center pl-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-gray-100">
                                            {canEdit ? (
                                                <button onClick={() => setEditingStudent(JSON.parse(JSON.stringify(student)))} className="btn btn-primary py-2 px-4 text-sm whitespace-nowrap">
                                                    Edit Details
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                    <Lock className="w-3.5 h-3.5" /> Other Counselor
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {students.length === 0 && <p className="text-gray-500 text-center py-10">No students registered yet. Click "Add New Student" to get started.</p>}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;
