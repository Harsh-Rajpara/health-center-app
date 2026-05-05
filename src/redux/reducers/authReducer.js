// Example: Getting auth state in any component
import { useSelector } from 'react-redux';

const MyComponent = () => {
    // Get authentication state
    const { isAuthenticated, user, isLoading, role } = useSelector((state) => state.auth);
    
    // Check if user is admin
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