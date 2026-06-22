import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { User, BookOpen, Cpu, MessageSquare, Plus, X, GraduationCap } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form fields
    const [academics, setAcademics] = useState({
        tenth: { maths: 0, science: 0, english: 0, socialScience: 0, tamil: 0 },
        twelfth: { maths: 0, physics: 0, chemistry: 0, english: 0, tamil: 0, computerScience: 0, biology: 0 },
        cgpa: 0
    });
    const [collegeDetails, setCollegeDetails] = useState({
        department: '',
        year: '',
        section: '',
        degree: ''
    });
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState('');
    const [certifications, setCertifications] = useState([]);
    const [newCertification, setNewCertification] = useState('');
    const [hackathons, setHackathons] = useState([]);
    const [newHackathon, setNewHackathon] = useState('');
    const [eventParticipations, setEventParticipations] = useState([]);
    const [newEventParticipation, setNewEventParticipation] = useState('');
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get(`/students/${user._id}`);
                setStudentData(data);
                
                // Merge academics with defaults to ensure all new fields exist
                if (data.academics) {
                    setAcademics({
                        tenth: { ...academics.tenth, ...data.academics.tenth },
                        twelfth: { ...academics.twelfth, ...data.academics.twelfth },
                        cgpa: data.academics.cgpa || 0
                    });
                }
                setSkills(data.skills || []);
                setActivities(data.activities || []);
                setCertifications(data.certifications || []);
                setHackathons(data.hackathons || []);
                setEventParticipations(data.eventParticipations || []);
                if (data.collegeDetails) setCollegeDetails({ ...collegeDetails, ...data.collegeDetails });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user._id]);

    const handleUpdate = async () => {
        try {
            const { data } = await API.put(`/students/${user._id}`, {
                academics,
                skills,
                activities,
                certifications,
                hackathons,
                eventParticipations,
                collegeDetails
            });
            setStudentData(data);
            setIsEditing(false);
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update profile';
            alert(`Error: ${message}`);
        }
    };

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const addActivity = () => {
        if (newActivity && !activities.includes(newActivity)) {
            setActivities([...activities, newActivity]);
            setNewActivity('');
        }
    };

    const addCertification = () => {
        if (newCertification && !certifications.includes(newCertification)) {
            setCertifications([...certifications, newCertification]);
            setNewCertification('');
        }
    };

    const addHackathon = () => {
        if (newHackathon && !hackathons.includes(newHackathon)) {
            setHackathons([...hackathons, newHackathon]);
            setNewHackathon('');
        }
    };

    const addEventParticipation = () => {
        if (newEventParticipation && !eventParticipations.includes(newEventParticipation)) {
            setEventParticipations([...eventParticipations, newEventParticipation]);
            setNewEventParticipation('');
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Loading profile...</div>;

    if (user?.role === 'faculty') {
        return <Navigate to="/admin" />;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <User className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">{studentData?.name}</h2>
                        <p className="text-gray-500 font-medium">{studentData?.email}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {studentData?.role}
                            </span>
                            {studentData?.classCounselor && (
                                <span className="inline-block bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    Counselor: {studentData.classCounselor}
                                </span>
                            )}
                            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                CGPA: {studentData?.academics?.cgpa ?? '—'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">Your data is managed by your faculty</p>
                    <p className="text-xs text-gray-400">Contact your Class Counselor to update details</p>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Capability Scores */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                             Capabilities
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Aptitude', val: studentData?.capabilities?.aptitude || 0, icon: <BookOpen className="w-4 h-4" /> },
                                { label: 'Coding', val: studentData?.capabilities?.coding || 0, icon: <Cpu className="w-4 h-4" /> },
                                { label: 'Communication', val: studentData?.capabilities?.communication || 0, icon: <MessageSquare className="w-4 h-4" /> }
                            ].map((cap, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                                            {cap.icon} {cap.label}
                                        </span>
                                        <span className="text-sm font-bold text-indigo-600">{cap.val}%</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cap.val}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full bg-indigo-600 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Profile Details - Read Only, managed by faculty */}
                <div className="lg:col-span-2">
                    {false ? (
                        <div className="card space-y-8">
                            <h3 className="text-xl font-bold">Update Your Information</h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <h4 className="font-bold mb-4 text-gray-700 border-b pb-2">College Details</h4>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Degree/Branch</label>
                                            <input type="text" className="input mt-1" value={collegeDetails.degree} onChange={(e) => setCollegeDetails({ ...collegeDetails, degree: e.target.value })} placeholder="B.Tech" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                            <input type="text" className="input mt-1" value={collegeDetails.department} onChange={(e) => setCollegeDetails({ ...collegeDetails, department: e.target.value })} placeholder="CSE" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
                                            <input type="text" className="input mt-1" value={collegeDetails.year} onChange={(e) => setCollegeDetails({ ...collegeDetails, year: e.target.value })} placeholder="3rd Year" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Section</label>
                                            <input type="text" className="input mt-1" value={collegeDetails.section} onChange={(e) => setCollegeDetails({ ...collegeDetails, section: e.target.value })} placeholder="A" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-4 text-gray-700 border-b pb-2">10th Standard</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Maths Marks</label>
                                            <input type="number" className="input mt-1" value={academics.tenth.maths} onChange={(e) => setAcademics({ ...academics, tenth: { ...academics.tenth, maths: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Science Marks</label>
                                            <input type="number" className="input mt-1" value={academics.tenth.science} onChange={(e) => setAcademics({ ...academics, tenth: { ...academics.tenth, science: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">English Marks</label>
                                            <input type="number" className="input mt-1" value={academics.tenth.english} onChange={(e) => setAcademics({ ...academics, tenth: { ...academics.tenth, english: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Social Science Marks</label>
                                            <input type="number" className="input mt-1" value={academics.tenth.socialScience} onChange={(e) => setAcademics({ ...academics, tenth: { ...academics.tenth, socialScience: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Tamil Marks</label>
                                            <input type="number" className="input mt-1" value={academics.tenth.tamil} onChange={(e) => setAcademics({ ...academics, tenth: { ...academics.tenth, tamil: Number(e.target.value) } })} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-4 text-gray-700 border-b pb-2">12th Standard</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Maths Marks</label>
                                            <input type="number" className="input mt-1" value={academics.twelfth.maths} onChange={(e) => setAcademics({ ...academics, twelfth: { ...academics.twelfth, maths: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Physics Marks</label>
                                            <input type="number" className="input mt-1" value={academics.twelfth.physics} onChange={(e) => setAcademics({ ...academics, twelfth: { ...academics.twelfth, physics: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Chemistry Marks</label>
                                            <input type="number" className="input mt-1" value={academics.twelfth.chemistry} onChange={(e) => setAcademics({ ...academics, twelfth: { ...academics.twelfth, chemistry: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">English Marks</label>
                                            <input type="number" className="input mt-1" value={academics.twelfth.english} onChange={(e) => setAcademics({ ...academics, twelfth: { ...academics.twelfth, english: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Tamil Marks</label>
                                            <input type="number" className="input mt-1" value={academics.twelfth.tamil} onChange={(e) => setAcademics({ ...academics, twelfth: { ...academics.twelfth, tamil: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Computer Science</label>
                                            <input type="number" className="input mt-1" value={academics.twelfth.computerScience} onChange={(e) => setAcademics({ ...academics, twelfth: { ...academics.twelfth, computerScience: Number(e.target.value) } })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Biology Marks</label>
                                            <input type="number" className="input mt-1" value={academics.twelfth.biology} onChange={(e) => setAcademics({ ...academics, twelfth: { ...academics.twelfth, biology: Number(e.target.value) } })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="font-bold text-gray-700 mb-2 block">Skills</label>
                                    <div className="flex gap-2 mb-3">
                                        <input type="text" className="input" placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                                        <button onClick={addSkill} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((s, i) => (
                                            <span key={i} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                {s} <X className="w-3 h-3 cursor-pointer" onClick={() => setSkills(skills.filter(sk => sk !== s))} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="font-bold text-gray-700 mb-2 block">Activities</label>
                                    <div className="flex gap-2 mb-3">
                                        <input type="text" className="input" placeholder="Add an activity..." value={newActivity} onChange={(e) => setNewActivity(e.target.value)} />
                                        <button onClick={addActivity} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activities.map((a, i) => (
                                            <span key={i} className="bg-success-DEFAULT/10 text-success-DEFAULT px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                {a} <X className="w-3 h-3 cursor-pointer" onClick={() => setActivities(activities.filter(ac => ac !== a))} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-bold text-gray-700 mb-2 block">Certifications</label>
                                    <div className="flex gap-2 mb-3">
                                        <input type="text" className="input" placeholder="Add a certification... e.g. IELTS" value={newCertification} onChange={(e) => setNewCertification(e.target.value)} />
                                        <button onClick={addCertification} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {certifications.map((a, i) => (
                                            <span key={i} className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                {a} <X className="w-3 h-3 cursor-pointer" onClick={() => setCertifications(certifications.filter(ac => ac !== a))} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-bold text-gray-700 mb-2 block">Hackathons</label>
                                    <div className="flex gap-2 mb-3">
                                        <input type="text" className="input" placeholder="Add a hackathon..." value={newHackathon} onChange={(e) => setNewHackathon(e.target.value)} />
                                        <button onClick={addHackathon} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {hackathons.map((a, i) => (
                                            <span key={i} className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                {a} <X className="w-3 h-3 cursor-pointer" onClick={() => setHackathons(hackathons.filter(ac => ac !== a))} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-bold text-gray-700 mb-2 block">Event Participations</label>
                                    <div className="flex gap-2 mb-3">
                                        <input type="text" className="input" placeholder="Add event participation..." value={newEventParticipation} onChange={(e) => setNewEventParticipation(e.target.value)} />
                                        <button onClick={addEventParticipation} className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"><Plus className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {eventParticipations.map((a, i) => (
                                            <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                                {a} <X className="w-3 h-3 cursor-pointer" onClick={() => setEventParticipations(eventParticipations.filter(ac => ac !== a))} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleUpdate} className="btn btn-primary w-full py-4 text-lg">Save Changes</button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="card">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><GraduationCap className="w-6 h-6 text-indigo-600"/> College Background</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Degree/Branch</p>
                                        <p className="font-bold text-gray-800">{studentData?.collegeDetails?.degree || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Department</p>
                                        <p className="font-bold text-gray-800">{studentData?.collegeDetails?.department || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Year</p>
                                        <p className="font-bold text-gray-800">{studentData?.collegeDetails?.year || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Section</p>
                                        <p className="font-bold text-gray-800">{studentData?.collegeDetails?.section || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <h3 className="text-xl font-bold mb-6">Academic Background</h3>
                                <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-indigo-400 uppercase">Current Semester CGPA</p>
                                        <p className="text-4xl font-extrabold text-indigo-700">{studentData?.academics?.cgpa ?? '—'}<span className="text-lg text-indigo-400">/10</span></p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-3">10th Std</p>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Maths</span>
                                            <span className="font-bold">{studentData?.academics?.tenth?.maths}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">Science</span>
                                            <span className="font-bold">{studentData?.academics?.tenth?.science}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">English</span>
                                            <span className="font-bold">{studentData?.academics?.tenth?.english}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">Social Science</span>
                                            <span className="font-bold">{studentData?.academics?.tenth?.socialScience}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">Tamil</span>
                                            <span className="font-bold">{studentData?.academics?.tenth?.tamil}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-3">12th Std</p>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Maths</span>
                                            <span className="font-bold">{studentData?.academics?.twelfth?.maths}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">Physics</span>
                                            <span className="font-bold">{studentData?.academics?.twelfth?.physics}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">Chemistry</span>
                                            <span className="font-bold">{studentData?.academics?.twelfth?.chemistry}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">English</span>
                                            <span className="font-bold">{studentData?.academics?.twelfth?.english}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">Tamil</span>
                                            <span className="font-bold">{studentData?.academics?.twelfth?.tamil}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">Computer Science</span>
                                            <span className="font-bold">{studentData?.academics?.twelfth?.computerScience}</span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-gray-600">Biology</span>
                                            <span className="font-bold">{studentData?.academics?.twelfth?.biology}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="card">
                                    <h3 className="text-lg font-bold mb-4">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {studentData?.skills?.length > 0 ? studentData.skills.map((s, i) => (
                                            <span key={i} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{s}</span>
                                        )) : <p className="text-gray-400 text-sm">No skills added yet.</p>}
                                    </div>
                                </div>
                                <div className="card">
                                    <h3 className="text-lg font-bold mb-4">Activities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {studentData?.activities?.length > 0 ? studentData.activities.map((a, i) => (
                                            <span key={i} className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{a}</span>
                                        )) : <p className="text-gray-400 text-sm">No activities added yet.</p>}
                                    </div>
                                </div>
                                <div className="card">
                                    <h3 className="text-lg font-bold mb-4">Certifications</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {studentData?.certifications?.length > 0 ? studentData.certifications.map((a, i) => (
                                            <span key={i} className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{a}</span>
                                        )) : <p className="text-gray-400 text-sm">No certifications added yet.</p>}
                                    </div>
                                </div>
                                <div className="card">
                                    <h3 className="text-lg font-bold mb-4">Hackathons</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {studentData?.hackathons?.length > 0 ? studentData.hackathons.map((a, i) => (
                                            <span key={i} className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{a}</span>
                                        )) : <p className="text-gray-400 text-sm">No hackathons added yet.</p>}
                                    </div>
                                </div>
                                <div className="card md:col-span-2">
                                    <h3 className="text-lg font-bold mb-4">Event Participations</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {studentData?.eventParticipations?.length > 0 ? studentData.eventParticipations.map((a, i) => (
                                            <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{a}</span>
                                        )) : <p className="text-gray-400 text-sm">No event participations added yet.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
