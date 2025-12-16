import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';
import './Experience.css';

const Experience = ({ experiences }) => {
    if (!experiences || experiences.length === 0) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="experience" className="section experience">
            <div className="container">
                <h2 className="section-title">Work Experience</h2>

                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="timeline-item"
                        >
                            <div className="timeline-content">
                                <div className="timeline-date">
                                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                </div>
                                <h3 className="experience-title">{exp.position}</h3>
                                <h4 className="experience-company">{exp.company}</h4>
                                {exp.location && <p className="experience-location"><i className="fas fa-map-marker-alt"></i> {exp.location}</p>}
                                <Badge variant="info" size="small" className="experience-type">{exp.type}</Badge>
                                <p className="experience-description">{exp.description}</p>

                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="experience-achievements">
                                        {exp.achievements.map((achievement, idx) => (
                                            <li key={idx}>{achievement}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
