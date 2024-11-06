import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface EmployerRouteProps {
    children: React.ReactNode;
}

const EmployerRoute: React.FC<EmployerRouteProps> = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = true; // Thay bằng logic check auth thực tế
    const isEmployer = true; // Thay bằng logic check role thực tế

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isEmployer) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default EmployerRoute;