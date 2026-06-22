import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.role === 'student' && !formData.email.endsWith('@sonatech.ac.in')) {
            return setError('Student email must end with @sonatech.ac.in');
        }
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const isStudent = formData.role === 'student';

    return (
        <div className="max-w-md mx-auto mt-10">
            <motion.div 
                className="card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <h2 className="text-3xl font-bold text-center mb-2">
                    {isStudent ? 'Activate Your Account' : 'Faculty Registration'}
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                    {isStudent
                        ? 'Use your college email ID added by your faculty to set your password and activate your account.'
                        : 'Register as a faculty member to manage students and companies.'}
                </p>

                {error && <div className="bg-red-50 text-danger p-3 rounded-lg mb-4 text-sm border border-red-200">{error}</div>}

                {isStudent && (
                    <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-3 rounded-lg mb-4 text-xs font-medium">
                        📌 Your college email must be pre-registered by your Class Counselor before you can activate your account.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Role</label>
                        <select 
                            className="input"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                    </div>

                    {!isStudent && (
                        <div>
                            <label className="block text-gray-700 mb-1 text-sm font-medium">Full Name</label>
                            <input 
                                type="text" 
                                className="input" 
                                placeholder="Dr. / Prof. Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required={!isStudent}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">
                            {isStudent ? 'College Email ID (@sonatech.ac.in)' : 'Email Address'}
                        </label>
                        <input 
                            type="email" 
                            className="input" 
                            placeholder={isStudent ? 'username@sonatech.ac.in' : 'faculty@sonatech.ac.in'}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">
                            {isStudent ? 'Set Your Password' : 'Password'}
                        </label>
                        <input 
                            type="password" 
                            className="input" 
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Confirm Password</label>
                        <input 
                            type="password" 
                            className="input" 
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full py-3 mt-4">
                        {isStudent ? 'Activate & Continue' : 'Create Faculty Account'}
                    </button>
                    <p className="text-center text-gray-600 text-sm mt-4">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Sign In</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
