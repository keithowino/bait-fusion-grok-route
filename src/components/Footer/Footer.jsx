import React from 'react'
import './Footer.css'
import { data } from '../../constants'
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerRouteStrMapper = data.footerRouteStr.map((item) => {
        return (
            <li key={item.id}>
                <Link to={`/${item.refStr}`}>{item.refStr}</Link>
            </li>
        );
    })
    return (
        <footer className="footer">
            <p>&copy; 2025 {data.brandName}. All rights reserved.</p>
            <ul>
                {footerRouteStrMapper}
            </ul>
        </footer>
    )
}

export default Footer
