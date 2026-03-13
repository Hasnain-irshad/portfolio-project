import React from 'react';
import { motion } from 'framer-motion';
import './CurrentlyDoing.css';

const CurrentlyDoing = ({ activities }) => {
    if (!activities || activities.length === 0) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="activities" className="section currently-doing">
            <div className="container">
                <h2 className="section-title">Currently Doing</h2>

                <div className="activities-grid">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity._id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.12 }}
                            className="activity-card card"
                        >
                            {activity.current && (
                                <div className="activity-pulse">
                                    <span className="pulse-dot"></span>
                                    <span className="pulse-label">Active</span>
                                </div>
                            )}

                            {activity.image?.url && (
                                <div className="activity-image">
                                    <img src={activity.image.url} alt={activity.title} />
                                </div>
                            )}

                            <div className="activity-content">
                                <h3 className="activity-title">{activity.title}</h3>

                                {activity.role && (
                                    <p className="activity-role">{activity.role}</p>
                                )}

                                {activity.startDate && (
                                    <p className="activity-date">
                                        <i className="fas fa-clock"></i>
                                        Since {formatDate(activity.startDate)}
                                    </p>
                                )}

                                {activity.description && (
                                    <p className="activity-description">{activity.description}</p>
                                )}

                                {activity.document?.url && (
                                    <a
                                        href={activity.document.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="activity-attachment"
                                    >
                                        <i className="fas fa-paperclip"></i>
                                        {activity.document.originalName || 'Attachment'}
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CurrentlyDoing;
