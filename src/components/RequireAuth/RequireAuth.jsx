import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Components, firebase } from '../../constants'; // We are including my existing auth

import './RequireAuth.css';

const RequireAuth = ({ children }) => {
    const [user, loading] = useAuthState(firebase.auth);  // Listens for auth changes

    // Show loading while checking auth
    if (loading) {
        return <Components.Loading message="Authenticating..." />;
    }

    // Redirect if no user
    if (!user) {
        return <Navigate to="/login" replace />;  // 'replace' clears history
    }

    // All good: Render the protected page
    return children;
};

export default RequireAuth;