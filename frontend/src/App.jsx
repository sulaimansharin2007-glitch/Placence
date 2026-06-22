import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CompanyPage from './pages/CompanyPage';
import PredictionPage from './pages/PredictionPage';
import FacultyDashboard from './pages/FacultyDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const FacultyRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return user && (user.role === 'faculty' || user.role === 'admin') ? children : <Navigate to="/" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />
                            
                            <Route path="/companies" element={
                                <PrivateRoute>
                                    <CompanyPage />
                                </PrivateRoute>
                            } />
                            
                            <Route path="/prediction" element={
                                <PrivateRoute>
                                    <PredictionPage />
                                </PrivateRoute>
                            } />
                            
                            <Route path="/admin" element={
                                <FacultyRoute>
                                    <FacultyDashboard />
                                </FacultyRoute>
                            } />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
