import React from 'react';
import { motion } from 'framer-motion';
import './Certificates.css';

const Certificates = ({ certificates }) => {
    if (!certificates || certificates.length === 0) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <section id="certificates" className="section certificates">
            <div className="container">
                <h2 className="section-title">Certificates & Achievements</h2>

                <div className="certificates-grid grid-3">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="certificate-card card"
                        >
                            {cert.image?.url && (
                                <div className="certificate-image">
                                    <img src={cert.image.url} alt={cert.title} />
                                </div>
                            )}

                            <div className="certificate-content">
                                <h3 className="certificate-title">{cert.title}</h3>
                                <p className="certificate-issuer">
                                    <i className="fas fa-building"></i> {cert.issuer}
                                </p>
                                <p className="certificate-date">
                                    <i className="fas fa-calendar"></i> {formatDate(cert.issueDate)}
                                </p>

                                {cert.credentialId && (
                                    <p className="certificate-id">
                                        <strong>ID:</strong> {cert.credentialId}
                                    </p>
                                )}

                                {cert.credentialUrl && (
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="certificate-link"
                                    >
                                        <i className="fas fa-external-link-alt"></i> Verify Certificate
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

export default Certificates;
