import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Components, firebase } from '../../constants';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState(''); // New state for first name
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password);
            // Update user profile with first name
            await updateProfile(userCredential.user, {
                displayName: firstName
            });
            alert('Account created successfully!');
            navigate('/login');
        } catch (err) {
            setError('Failed to create account. Try a different email or stronger password.');
            console.error('Signup error:', err);
        }
    };

    return (
        <div className="signup">
            <Components.HelmetTitle title="Sign Up" />
            {error && <p className="error">{error}</p>}
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a>.</p>
        </div>
    );
};

export default Signup;