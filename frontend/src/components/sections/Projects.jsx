import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';
import Button from '../common/Button';
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
                            {project.featured && <Badge variant="secondary" className="featured-badge">Featured</Badge>}

                            <div className="tilt-container">
                                <div className="tilt-inner tilt-wrapper">
                                    {project.images && project.images.length > 0 && (
                                        <div className="project-image">
                                            <img src={project.images[0].url} alt={project.title} />
                                            <div className="project-image-overlay"></div>
                                        </div>
                                    )}

                                    <div className="project-content glass">
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-description">{project.description}</p>

                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="project-tech">
                                                {project.technologies.map((tech, idx) => (
                                                    <Badge key={idx} variant="primary" size="small">{tech}</Badge>
                                                ))}
                                            </div>
                                        )}

                                        <div className="project-links">
                                            {project.liveUrl && (
                                                <Button
                                                    variant="primary"
                                                    size="small"
                                                    onClick={() => window.open(project.liveUrl, '_blank')}
                                                    icon={<i className="fas fa-external-link-alt"></i>}
                                                    iconPosition="left"
                                                >
                                                    Live Demo
                                                </Button>
                                            )}
                                            {project.githubUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="small"
                                                    onClick={() => window.open(project.githubUrl, '_blank')}
                                                    icon={<i className="fab fa-github"></i>}
                                                    iconPosition="left"
                                                >
                                                    Code
                                                </Button>
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
