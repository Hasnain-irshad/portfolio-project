import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = ({ profile, resume }) => {
    const [displayText, setDisplayText] = useState('');
    const fullText = profile?.title || 'Full Stack Developer';

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [fullText]);

    const handleDownloadResume = () => {
        if (resume?.fileUrl) {
            const encoded = encodeURIComponent(resume.fileUrl || resume.url);
            const viewer = `https://docs.google.com/gview?url=${encoded}&embedded=true`;
            window.open(viewer, '_blank');
        }
    };

    return (
        <section id="home" className="hero" style={profile?.backgroundImage?.url ? { backgroundImage: `url(${profile.backgroundImage.url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            <div className="hero-background">
                <div className="hero-gradient"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hero-text"
                    >
                        <p className="hero-greeting">Hi, I'm</p>
                        <h1 className="hero-name">{profile?.name || 'Your Name'}</h1>
                        <h2 className="hero-title">
                            <span className="typing-text">{displayText}</span>
                            <span className="cursor">|</span>
                        </h2>
                        <p className="hero-description">
                            {profile?.bio || 'Passionate about building amazing web experiences'}
                        </p>

                        <div className="hero-buttons">
                            <button
                                className="btn btn-primary"
                                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Get In Touch
                            </button>
                            {resume && (
                                <button className="btn btn-outline" onClick={handleDownloadResume}>
                                    Download Resume
                                </button>
                            )}
                        </div>

                        <div className="hero-social">
                            {profile?.socialLinks?.github && (
                                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-github"></i>
                                </a>
                            )}
                            {profile?.socialLinks?.linkedin && (
                                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                            )}
                            {profile?.socialLinks?.twitter && (
                                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            )}
                        </div>
                    </motion.div>

                    {profile?.profileImage?.url && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="hero-image"
                        >
                            <div className="hero-accent-shape"></div>
                            <div className="image-wrapper">
                                <img src={profile.profileImage.url} alt={profile.name} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="scroll-indicator">
                <div className="mouse">
                    <div className="wheel"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
