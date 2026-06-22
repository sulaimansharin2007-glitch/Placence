import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, Briefcase, BarChart2, User, Layout } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                    <Layout className="w-8 h-8" />
                    PlaceSense
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                                <User className="w-4 h-4" /> Dashboard
                            </Link>
                            <Link to="/companies" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                                <Briefcase className="w-4 h-4" /> Companies
                            </Link>
                            <Link to="/prediction" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                                <BarChart2 className="w-4 h-4" /> Predict
                            </Link>
                            {(user.role === 'faculty' || user.role === 'admin') && (
                                <Link to="/admin" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                                    <Layout className="w-4 h-4" /> Admin
                                </Link>
                            )}
                            <button 
                                onClick={handleLogout}
                                className="text-danger flex items-center gap-1 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
