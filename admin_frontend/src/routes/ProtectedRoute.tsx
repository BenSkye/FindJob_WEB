import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Forbidden from '../components/common/403';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const auth = useContext(AuthContext);
    const location = useLocation();

    if (auth?.isLoading) {
        return <div>Loading...</div>;
    }

    if (!auth?.isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (!auth?.checkPermission()) {
        return <Forbidden />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 