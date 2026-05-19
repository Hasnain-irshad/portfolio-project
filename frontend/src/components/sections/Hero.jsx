import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroWave from './HeroWave';
import './Hero.css';

const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

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

    const nameParts = (profile?.name || 'Your Name').trim().split(' ');
    const lastName = nameParts.pop();
    const firstName = nameParts.join(' ');

    const social = profile?.socialLinks || {};

    return (
        <section id="home" className="hero">
            <div className="hero-background">
                <HeroWave />
                <div className="hero-scrim"></div>
            </div>

            <div className="container">
                <motion.div
                    className="hero-content"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
                >
                    {(social.github || social.linkedin || social.twitter) && (
                        <motion.div className="hero-socials" variants={fadeUp}>
                            {social.github && (
                                <a href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                    <i className="fab fa-github"></i>
                                </a>
                            )}
                            {social.linkedin && (
                                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            )}
                            {social.twitter && (
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            )}
                        </motion.div>
                    )}

                    <motion.div className="hero-identity" variants={fadeUp}>
                        {profile?.profileImage?.url && (
                            <div className="hero-avatar">
                                <span className="hero-avatar-ring"></span>
                                <img src={profile.profileImage.url} alt={profile.name} />
                            </div>
                        )}
                        <h1 className="hero-name">
                            {firstName && <span className="name-first">{firstName}</span>}
                            <span className="name-accent">{lastName}</span>
                        </h1>
                    </motion.div>

                    <motion.h2 className="hero-title" variants={fadeUp}>
                        <span className="typing-text">{displayText}</span>
                        <span className="cursor">|</span>
                    </motion.h2>

                    {profile?.bio && (
                        <motion.p className="hero-description" variants={fadeUp}>
                            {profile.bio}
                        </motion.p>
                    )}

                    <motion.div className="hero-buttons" variants={fadeUp}>
                        <button
                            className="btn btn-primary"
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Get In Touch
                        </button>
                        {resume && (
                            <button className="btn btn-ghost-line" onClick={handleDownloadResume}>
                                <i className="fas fa-arrow-down"></i> Download Resume
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            <a href="#about" className="scroll-indicator" aria-label="Scroll to content">
                <span className="scroll-text">Scroll</span>
                <span className="mouse">
                    <span className="wheel"></span>
                </span>
            </a>
        </section>
    );
};

export default Hero;
