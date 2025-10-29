import React, { useState } from 'react';
import './Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Components, firebase } from '../../constants';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(firebase.auth, email, password);
            alert('Logged in successfully!');
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Check your credentials.');
        }
    };

    return (
        <div className="login">
            <Components.HelmetTitle title="Log in" />
            {error && <p className="error">{error}</p>}
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
            <p>New here? <a href="/signup">Sign up</a>.</p>
        </div>
    );
};

export default Login;