import { useSelector } from 'react-redux';

const MyComponent = () => {
    const { isAuthenticated, user, isLoading, role } = useSelector((state) => state.auth);
    
    // Check  user is admin
    const isAdmin = role === 'admin';
    
    return (
        <div>
            {isAuthenticated ? (
                <p>Welcome, {user?.name}!</p>
            ) : (
                <p>Please login</p>
            )}
        </div>
    );
};