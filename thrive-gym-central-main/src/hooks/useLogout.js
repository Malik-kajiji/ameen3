import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../redux/userState';

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        // Clear user from redux store and localStorage
        dispatch(userActions.clearData());
        localStorage.removeItem('user');
        
        // Navigate to login page
        navigate('/login');
    };

    return { logout };
};