import React from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

const isSoftCategory = (c) => /^soft\s*skills?$/i.test((c || '').trim());

const Skills = ({ skills }) => {
    if (!skills || skills.length === 0) return null;

    // Sort by order, then group: technical categories vs. soft skills
    const sorted = [...skills].sort((a, b) => (a.order || 0) - (b.order || 0));

    const groupedTechnical = {};
    const softSkills = [];

    sorted.forEach((skill) => {
        if (isSoftCategory(skill.category)) {
            softSkills.push(skill);
        } else {
            const cat = (skill.category || 'Other').trim();
            if (!groupedTechnical[cat]) groupedTechnical[cat] = [];
            groupedTechnical[cat].push(skill);
        }
    });

    const techCategories = Object.entries(groupedTechnical);
    const hasTechnical = techCategories.length > 0;
    const hasSoft = softSkills.length > 0;

    if (!hasTechnical && !hasSoft) return null;

    return (
        <section id="skills" className="section skills">
            <div className="container">
                <h2 className="section-title">Skills &amp; Expertise</h2>

                {hasTechnical && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                        className="skills-panel"
                    >
                        <h3 className="skills-subtitle">
                            <span className="skills-subtitle-dot" />
                            Technical Skills
                        </h3>

                        <ul className="skills-rows">
                            {techCategories.map(([category, items], idx) => (
                                <motion.li
                                    key={category}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.07 }}
                                    className="skills-row"
                                >
                                    <span className="skills-row-category">{category}:</span>
                                    <span className="skills-row-items">
                                        {items.map((s, i) => (
                                            <React.Fragment key={s._id || `${category}-${i}`}>
                                                <span className="skills-pill">{s.name}</span>
                                                {i < items.length - 1 && <span className="skills-sep">, </span>}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {hasSoft && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="skills-panel skills-panel-soft"
                    >
                        <h3 className="skills-subtitle">
                            <span className="skills-subtitle-dot skills-subtitle-dot-soft" />
                            Soft Skills
                        </h3>

                        <p className="skills-soft-list">
                            {softSkills.map((s, i) => (
                                <React.Fragment key={s._id || s.name}>
                                    {i > 0 && <span className="skills-bullet">•</span>}
                                    <span className="skills-soft-item">{s.name}</span>
                                </React.Fragment>
                            ))}
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Skills;
