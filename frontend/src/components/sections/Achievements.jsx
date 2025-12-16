import React from 'react';
import { motion } from 'framer-motion';
import './Achievements.css';

const Achievements = ({ achievements }) => {
    if (!achievements || achievements.length === 0) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Award': '#ffc107',
            'Recognition': '#28a745',
            'Milestone': '#17a2b8',
            'Competition': '#dc3545',
            'Certification': '#6f42c1',
            'Other': '#6c757d'
        };
        return colors[category] || '#6c757d';
    };

    return (
        <section id="achievements" className="section achievements">
            <div className="container">
                <h2 className="section-title">Achievements & Awards</h2>

                <div className="achievements-grid">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={achievement._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="achievement-card"
                        >
                            <div className="achievement-icon" style={{ color: getCategoryColor(achievement.category) }}>
                                <i className={achievement.icon || 'fas fa-trophy'}></i>
                            </div>
                            <div className="achievement-content">
                                <h3 className="achievement-title">{achievement.title}</h3>
                                <span className="achievement-category" style={{ backgroundColor: getCategoryColor(achievement.category) }}>
                                    {achievement.category}
                                </span>
                                <p className="achievement-date">
                                    <i className="fas fa-calendar-alt"></i> {formatDate(achievement.date)}
                                </p>
                                <p className="achievement-description">{achievement.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;