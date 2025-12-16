import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import './About.css';

const About = ({ profile }) => {
    if (!profile) return null;

    return (
        <section id="about" className="section about">
            <div className="container">
                <h2 className="section-title">About Me</h2>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card glass={true} className="about-card">
                        <div className="about-text">
                            <p>{profile.bio}</p>

                            {profile.location && (
                                <p className="about-detail">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <strong>Location:</strong> {profile.location}
                                </p>
                            )}

                            {profile.email && (
                                <p className="about-detail">
                                    <i className="fas fa-envelope"></i>
                                    <strong>Email:</strong> <a href={`mailto:${profile.email}`}>{profile.email}</a>
                                </p>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
