import React from 'react';
import { motion } from 'framer-motion';
import './Projects.css';

const Projects = ({ projects }) => {
    if (!projects || projects.length === 0) return null;

    return (
        <section id="projects" className="section projects">
            <div className="container">
                <h2 className="section-title">Projects</h2>

                <div className="projects-grid grid-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`project-card card ${project.featured ? 'featured' : ''}`}
                        >
                            {project.featured && <span className="featured-badge">Featured</span>}

                            <div className="tilt-container">
                                <div className="tilt-inner tilt-wrapper">
                                    {project.images && project.images.length > 0 && (
                                        <div className="project-image">
                                            <img src={project.images[0].url} alt={project.title} />
                                        </div>
                                    )}

                                    <div className="project-content glass">
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-description">{project.description}</p>

                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="project-tech">
                                                {project.technologies.map((tech, idx) => (
                                                    <span key={idx} className="tech-tag">{tech}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="project-links">
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                                                    <i className="fas fa-external-link-alt"></i> Live Demo
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                                                    <i className="fab fa-github"></i> Code
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
