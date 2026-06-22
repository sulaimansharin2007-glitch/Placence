import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Forgot password states
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResetError('');
        try {
            await API.post('/auth/forgot-password', { email: forgotEmail });
            setIsEmailVerified(true);
        } catch (err) {
            setResetError(err.response?.data?.message || 'Email verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setResetError('Passwords do not match');
            return;
        }
        setLoading(true);
        setResetError('');
        try {
            await API.post('/auth/reset-password', { email: forgotEmail, newPassword });
            setResetSuccess(true);
        } catch (err) {
            setResetError(err.response?.data?.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    const resetForgotPasswordState = () => {
        setIsForgotPassword(false);
        setForgotEmail('');
        setIsEmailVerified(false);
        setNewPassword('');
        setConfirmNewPassword('');
        setResetSuccess(false);
        setResetError('');
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <motion.div 
                className="card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {!isForgotPassword ? (
                    <>
                        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
                        {error && <div className="bg-red-50 text-danger p-3 rounded-lg mb-4 text-sm">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-medium">Email Address</label>
                                <input 
                                    type="email" 
                                    className="input" 
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700 text-sm font-medium">Password</label>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsForgotPassword(true)}
                                        className="text-sm text-indigo-600 hover:underline font-semibold"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <input 
                                    type="password" 
                                    className="input" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full py-3">
                                Sign In
                            </button>
                            <p className="text-center text-gray-600 text-sm">
                                Don't have an account? <Link to="/register" className="text-indigo-600 font-bold">Register</Link>
                            </p>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-center mb-8">Reset Password</h2>
                        {resetError && <div className="bg-red-50 text-danger p-3 rounded-lg mb-4 text-sm">{resetError}</div>}
                        
                        {resetSuccess ? (
                            <div className="space-y-6 text-center">
                                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-medium border border-emerald-200">
                                    Your password has been reset successfully! You can now sign in with your new password.
                                </div>
                                <button 
                                    onClick={resetForgotPasswordState}
                                    className="btn btn-primary w-full py-3"
                                >
                                    Go to Sign In
                                </button>
                            </div>
                        ) : !isEmailVerified ? (
                            <form onSubmit={handleVerifyEmail} className="space-y-6">
                                <p className="text-sm text-gray-600">
                                    Enter your registered email address to verify your account and set a new password.
                                </p>
                                <div>
                                    <label className="block text-gray-700 mb-2 text-sm font-medium">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="input" 
                                        placeholder="you@example.com"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="btn btn-primary w-full py-3 disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={resetForgotPasswordState}
                                    className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 w-full py-3"
                                >
                                    Back to Sign In
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-semibold border border-emerald-200">
                                    ✓ Email verified: {forgotEmail}
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 text-sm font-medium">New Password</label>
                                    <input 
                                        type="password" 
                                        className="input" 
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 text-sm font-medium">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        className="input" 
                                        placeholder="••••••••"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="btn btn-primary w-full py-3 disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={resetForgotPasswordState}
                                    className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 w-full py-3"
                                >
                                    Back to Sign In
                                </button>
                            </form>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default Login;
