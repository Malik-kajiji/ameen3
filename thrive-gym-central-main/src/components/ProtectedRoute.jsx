import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userController?.user);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // If user is not authenticated, return null (will redirect in useEffect)
    if (!user) {
        return null;
    }

    // If user is authenticated, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;