import React from 'react';
import SectionHeader from '../common/SectionHeader';
import ZoomableImage from '../common/ZoomableImage';
import Icon from '../common/Icon';
import './Projects.css';

const MAX_TAGS = 6;

/**
 * Zig-zag bento: rows of two cards alternating wide-left / wide-right on a
 * 3-column grid; a trailing odd card spans the full row. Never leaves holes.
 */
const layoutFor = (i, total) => {
    if (total % 2 === 1 && i === total - 1) return 'span-3 pj--full';
    const row = Math.floor(i / 2);
    const wideFirst = row % 2 === 0;
    const isFirst = i % 2 === 0;
    return (isFirst === wideFirst) ? 'span-2 pj--wide' : 'pj--narrow';
};

const ProjectCard = ({ project, layout, delay }) => {
    const images = (project.images || []).filter((im) => im?.url);
    const gallery = images.map((im, n) => ({ src: im.url, alt: `${project.title} — screenshot ${n + 1}` }));
    const tags = project.technologies || [];
    const extra = tags.length - MAX_TAGS;

    return (
        <article className={`tile tile--flush tile--interactive pj ${layout} reveal`} style={{ '--reveal-delay': delay }}>
            {images.length > 0 && (
                <div className="pj__media">
                    <ZoomableImage
                        src={images[0].url}
                        alt={`${project.title} screenshot`}
                        gallery={gallery.length > 1 ? gallery : undefined}
                        widths={[480, 800, 1200]}
                        sizes={layout.includes('narrow') ? '(max-width: 640px) 100vw, 400px' : '(max-width: 640px) 100vw, 800px'}
                    />
                    {images.length > 1 && (
                        <span className="pj__count chip chip--mono" aria-hidden="true">
                            <Icon name="image" width="13" height="13" /> {images.length}
                        </span>
                    )}
                    {project.featured && <span className="pj__featured chip chip--accent chip--mono">Featured</span>}
                </div>
            )}

            <div className="pj__body">
                <h3 className="pj__title">{project.title}</h3>
                <p className="pj__desc">{project.description}</p>

                {tags.length > 0 && (
                    <ul role="list" className="chip-list pj__tags" aria-label="Technologies">
                        {tags.slice(0, MAX_TAGS).map((t) => (
                            <li key={t} className="chip">{t}</li>
                        ))}
                        {extra > 0 && (
                            <li className="chip" title={tags.slice(MAX_TAGS).join(', ')}>
                                +{extra}
                                <span className="sr-only"> more: {tags.slice(MAX_TAGS).join(', ')}</span>
                            </li>
                        )}
                    </ul>
                )}

                {(project.liveUrl || project.githubUrl) && (
                    <div className="pj__links">
                        {project.liveUrl && (
                            <a className="link-arrow" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                Live site <Icon name="arrow-up-right" />
                                <span className="sr-only"> for {project.title}</span>
                            </a>
                        )}
                        {project.githubUrl && (
                            <a className="link-arrow" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Icon name="github" /> Source
                                <span className="sr-only"> code for {project.title}</span>
                            </a>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

const Projects = ({ index, projects }) => {
    if (!projects?.length) return null;

    // Featured first, otherwise keep the admin-defined order.
    const items = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

    return (
        <section id="projects" className="sec projects" aria-labelledby="projects-title">
            <div className="container">
                <SectionHeader
                    id="projects-title"
                    index={index}
                    eyebrow="Selected work"
                    title={
                        <>
                            Things I&rsquo;ve <em>built</em>.
                        </>
                    }
                    lede="Production LLM systems, ML pipelines and full-stack products — from retrieval and agents to deployment."
                />

                <div className="bento pj-grid">
                    {items.map((p, i) => (
                        <ProjectCard key={p._id} project={p} layout={layoutFor(i, items.length)} delay={`${(i % 2) * 80}ms`} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
