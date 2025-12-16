import React from 'react';
import './Footer.css';

const Footer = ({ profile }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">Get In Touch</h3>
                        {profile?.email && (
                            <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
                        )}
                        {profile?.phone && (
                            <p><a href={`tel:${profile.phone}`}>{profile.phone}</a></p>
                        )}
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Follow Me</h3>
                        <div className="social-links">
                            {profile?.socialLinks?.github && (
                                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                    <i className="fab fa-github"></i>
                                </a>
                            )}
                            {profile?.socialLinks?.linkedin && (
                                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                            )}
                            {profile?.socialLinks?.twitter && (
                                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            )}
                            {profile?.socialLinks?.instagram && (
                                <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#projects">Projects</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} {profile?.name || 'Portfolio'}. All rights reserved.</p>
                    <p>Built with React & ❤️</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
