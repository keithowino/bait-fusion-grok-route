import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { data, firebase } from '../../constants';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebase.auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(firebase.auth);
            alert('Logged out successfully!');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed—check console.');
        }
    };

    const headerRouteStrMapper = data.headerRouteStr.map((item) => {
        return (
            <li key={item.id}>
                <Link to={item.refStr === "home" ? "/" : "/" + item.refStr}>
                    {item.refStr}
                </Link>
            </li>
        );
    });

    return (
        <header className="header">
            <div className="logo">{data.brandName}</div>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                ☰
            </button>
            <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                <ul className="nav-list">
                    {headerRouteStrMapper}
                    {user ? (
                        <>
                            <li className="nav-item">
                                <span className="user-greeting">Welcome, {user.displayName || 'User'}!</span>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <Link to="/login">Login</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;