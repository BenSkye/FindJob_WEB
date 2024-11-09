import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spin } from 'antd';

interface EmployerRouteProps {
    children: React.ReactNode;
}

const EmployerRoute: React.FC<EmployerRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <Spin />;
    }
    if (!user || !user.roles.includes('employer')) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};


export default EmployerRoute;