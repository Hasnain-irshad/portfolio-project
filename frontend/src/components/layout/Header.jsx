import React, { useState, useEffect } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMenuOpen(false);
        }
    };

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
                        <li><a onClick={() => scrollToSection('home')}>Home</a></li>
                        <li><a onClick={() => scrollToSection('about')}>About</a></li>
                        <li><a onClick={() => scrollToSection('skills')}>Skills</a></li>
                        <li><a onClick={() => scrollToSection('experience')}>Experience</a></li>
                        <li><a onClick={() => scrollToSection('projects')}>Projects</a></li>
                        <li><a onClick={() => scrollToSection('certificates')}>Certificates</a></li>
                        <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
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
