import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/01_moaz_Login_milestone2';
import Register from './components/01_moaz_Register_milestone2';
import ParentDashboard from './components/ParentDashboard';
import ChildDashboard from './components/ChildDashboard';

function App() {
    const location = useLocation();
    const [authState, setAuthState] = useState({
        isLoggedIn: !!localStorage.getItem('token'),
        userRole: localStorage.getItem('userRole')
    });

    // Re-check auth state whenever route changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        setAuthState({
            isLoggedIn: !!token,
            userRole: role
        });
    }, [location]);

    const { isLoggedIn, userRole } = authState;

    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={
                    isLoggedIn ? (
                        userRole === 'parent' ? <Navigate to="/dashboard" replace /> : <Navigate to="/child-dashboard" replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />
                <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} />
                <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />} />
                <Route path="/dashboard" element={
                    isLoggedIn && userRole === 'parent' ? <ParentDashboard /> : <Navigate to="/login" replace />
                } />
                <Route path="/child-dashboard" element={
                    isLoggedIn && userRole === 'child' ? <ChildDashboard /> : <Navigate to="/login" replace />
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
