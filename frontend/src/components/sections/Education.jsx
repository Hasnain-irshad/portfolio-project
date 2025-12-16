import React from 'react';
import { motion } from 'framer-motion';
import './Education.css';

const Education = ({ education }) => {
    if (!education || education.length === 0) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="education" className="section education">
            <div className="container">
                <h2 className="section-title">Education</h2>

                <div className="education-timeline">
                    {education.map((edu, index) => (
                        <motion.div
                            key={edu._id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`education-item ${index % 2 === 0 ? 'left' : 'right'}`}
                        >
                            <div className="education-content">
                                <div className="education-header">
                                    <h3 className="education-degree">{edu.degree}</h3>
                                    <p className="education-field">{edu.field}</p>
                                </div>

                                <div className="education-info">
                                    <p className="education-school">
                                        <i className="fas fa-university"></i> {edu.school}
                                    </p>
                                    {edu.location && (
                                        <p className="education-location">
                                            <i className="fas fa-map-marker-alt"></i> {edu.location}
                                        </p>
                                    )}
                                    <p className="education-duration">
                                        <i className="fas fa-calendar-alt"></i>
                                        {' '}{formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                                    </p>
                                </div>

                                {edu.grade && (
                                    <p className="education-grade">
                                        <i className="fas fa-star"></i> GPA: {edu.grade}
                                    </p>
                                )}

                                {edu.description && (
                                    <p className="education-description">{edu.description}</p>
                                )}

                                {edu.activities && edu.activities.length > 0 && (
                                    <div className="education-activities">
                                        <h4>Activities & Societies</h4>
                                        <ul>
                                            {edu.activities.map((activity, idx) => (
                                                <li key={idx}>
                                                    <i className="fas fa-check-circle"></i> {activity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="timeline-marker">
                                <i className="fas fa-graduation-cap"></i>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;