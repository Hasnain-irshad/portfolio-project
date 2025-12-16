import React from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

const Skills = ({ skills }) => {
    if (!skills || skills.length === 0) return null;

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <section id="skills" className="section skills">
            <div className="container">
                <h2 className="section-title">Skills & Technologies</h2>

                <div className="skills-grid">
                    {Object.entries(groupedSkills).map(([category, categorySkills], idx) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="skill-category"
                        >
                            <h3 className="category-title">{category}</h3>
                            <div className="skills-list">
                                {categorySkills.map((skill) => (
                                    <div key={skill._id} className="skill-item lift-hover">
                                        <div className="skill-header">
                                            <span className="skill-name skill-badge">{skill.name}</span>
                                            <span className="skill-level">{skill.proficiency}</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div
                                                className="skill-progress"
                                                style={{ width: `${skill.proficiencyLevel || 50}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
