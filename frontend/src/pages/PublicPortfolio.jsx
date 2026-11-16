import React, { useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Recognition from '../components/sections/Recognition';
import Education from '../components/sections/Education';
import Blogs from '../components/sections/Blogs';
import Publications from '../components/sections/Publications';
import CurrentlyDoing from '../components/sections/CurrentlyDoing';
import Contact from '../components/sections/Contact';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useReveal } from '../hooks/useReveal';

/**
 * Home page. Renders instantly from the build-time snapshot — there is no
 * full-screen loader — and swaps in live data when the API responds.
 */
function PublicPortfolio() {
    const { data } = usePortfolioData();
    const d = data;

    // Section order, visibility and nav labels in one place. Indices are
    // assigned only to sections that render, so numbering never skips.
    const sections = useMemo(() => {
        const list = [
            { id: 'about', nav: 'About', show: !!d.profile },
            { id: 'experience', nav: 'Experience', show: d.experience.length > 0 },
            { id: 'projects', nav: 'Work', show: d.projects.length > 0 },
            { id: 'skills', nav: 'Skills', show: d.skills.length > 0 },
            { id: 'achievements', nav: null, show: d.achievements.length + d.certificates.length > 0 },
            { id: 'education', nav: null, show: d.education.length > 0 },
            { id: 'blogs', nav: 'Writing', show: d.blogs.length > 0 },
            { id: 'publications', nav: 'Research', show: d.publications.length > 0 },
            { id: 'activities', nav: null, show: d.activities.length > 0 },
            { id: 'contact', nav: 'Contact', show: true },
        ].filter((s) => s.show);
        return list.map((s, i) => ({ ...s, index: String(i + 1).padStart(2, '0') }));
    }, [d]);

    const idx = (id) => sections.find((s) => s.id === id)?.index;
    const nav = sections.filter((s) => s.nav).map((s) => ({ id: s.id, label: s.nav }));

    const stats = [
        { label: 'Projects', value: d.projects.length },
        { label: 'Roles', value: d.experience.length },
        { label: 'Certificates', value: d.certificates.length },
        { label: 'Awards & milestones', value: d.achievements.length },
    ];

    useReveal([d]);

    useEffect(() => {
        if (d.profile?.name) {
            const role = d.profile.title?.split('|')[0].trim();
            document.title = role ? `${d.profile.name} — ${role}` : d.profile.name;
        }
    }, [d.profile]);

    return (
        <div className="app">
            <Header profile={d.profile} resume={d.resume} nav={nav} />
            <main id="main">
                <Hero profile={d.profile} resume={d.resume} experience={d.experience} education={d.education} activities={d.activities} />
                <About index={idx('about')} profile={d.profile} stats={stats} />
                <Experience index={idx('experience')} experiences={d.experience} />
                <Projects index={idx('projects')} projects={d.projects} />
                <Skills index={idx('skills')} skills={d.skills} />
                <Recognition index={idx('achievements')} achievements={d.achievements} certificates={d.certificates} />
                <Education index={idx('education')} education={d.education} />
                <Blogs index={idx('blogs')} blogs={d.blogs} />
                <Publications index={idx('publications')} publications={d.publications} />
                <CurrentlyDoing index={idx('activities')} activities={d.activities} />
                <Contact index={idx('contact')} profile={d.profile} />
            </main>
            <Footer profile={d.profile} />
        </div>
    );
}

export default PublicPortfolio;
