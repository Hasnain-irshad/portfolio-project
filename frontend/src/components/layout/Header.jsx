import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (id) => {
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: id } });
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setMenuOpen(false);
    };

    // Effect to handle scrolling when navigating back to home from another page
    useEffect(() => {
        if (location.pathname === '/' && location.state?.scrollTo) {
            const id = location.state.scrollTo;
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            // Clear the state so it doesn't scroll again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <div className="logo">
                        <span className="logo-text">Portfolio</span>
                    </div>

                    <button
                        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        <li><a onClick={() => handleNavClick('home')}>Home</a></li>
                        <li><a onClick={() => handleNavClick('about')}>About</a></li>
                        <li><a onClick={() => handleNavClick('skills')}>Skills</a></li>
                        <li><a onClick={() => handleNavClick('experience')}>Experience</a></li>
                        <li><a onClick={() => handleNavClick('projects')}>Projects</a></li>
                        <li><a onClick={() => handleNavClick('certificates')}>Certificates</a></li>
                        <li><Link to="/blogs" onClick={() => setMenuOpen(false)}>Blog</Link></li>
                        <li><a onClick={() => handleNavClick('publications')}>Research</a></li>
                        <li><a onClick={() => handleNavClick('activities')}>Activities</a></li>
                        <li><a onClick={() => handleNavClick('contact')}>Contact</a></li>
                    </ul>

                    <div className="header-actions">
                        <ThemeToggle />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
