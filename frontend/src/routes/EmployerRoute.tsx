import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface EmployerRouteProps {
    children: React.ReactNode;
}

const EmployerRoute: React.FC<EmployerRouteProps> = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const isEmployer = user?.roles.includes('employer');

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isEmployer) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default EmployerRoute;