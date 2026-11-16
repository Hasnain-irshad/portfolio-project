import React from 'react';
import SectionHeader from '../common/SectionHeader';
import './Skills.css';

const isSoft = (c) => /^soft\s*skills?$/i.test((c || '').trim());

const Skills = ({ index, skills }) => {
    if (!skills?.length) return null;

    const sorted = [...skills].sort((a, b) => (a.order || 0) - (b.order || 0));
    const groups = new Map();
    const soft = [];
    sorted.forEach((s) => {
        if (isSoft(s.category)) return soft.push(s);
        const cat = (s.category || 'Other').trim();
        if (!groups.has(cat)) groups.set(cat, []);
        groups.get(cat).push(s);
    });

    // Largest category leads with the wide tile.
    const cats = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
    // Keep the 3-col grid hole-free: lead tile spans 2 → total cells = n + 1.
    const leadSpans = cats.length > 1 && (cats.length + 1) % 3 === 0;

    return (
        <section id="skills" className="sec skills" aria-labelledby="skills-title">
            <div className="container">
                <SectionHeader
                    id="skills-title"
                    index={index}
                    eyebrow="Toolkit"
                    title={
                        <>
                            The <em>stack</em> I work in.
                        </>
                    }
                />

                <div className="bento">
                    {cats.map(([cat, items], i) => (
                        <article
                            key={cat}
                            className={`tile sk reveal ${i === 0 ? 'sk--lead' : ''} ${i === 0 && leadSpans ? 'span-2' : ''}`}
                            style={{ '--reveal-delay': `${(i % 3) * 60}ms` }}
                        >
                            <header className="sk__head">
                                <h3 className="sk__title">{cat}</h3>
                                <span className="meta">{String(items.length).padStart(2, '0')}</span>
                            </header>
                            <ul role="list" className="chip-list">
                                {items.map((s) => (
                                    <li key={s._id || s.name} className="chip">
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}

                    {soft.length > 0 && (
                        <article className="tile span-3 sk sk--soft reveal">
                            <header className="sk__head">
                                <h3 className="sk__title">How I work</h3>
                            </header>
                            <ul role="list" className="sk__soft">
                                {soft.map((s) => (
                                    <li key={s._id || s.name}>{s.name}</li>
                                ))}
                            </ul>
                        </article>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Skills;
