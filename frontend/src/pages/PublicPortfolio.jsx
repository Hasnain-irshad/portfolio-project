import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Achievements from '../components/sections/Achievements';
import Education from '../components/sections/Education';
import Certificates from '../components/sections/Certificates';
import Blogs from '../components/sections/Blogs';
import Publications from '../components/sections/Publications';
import CurrentlyDoing from '../components/sections/CurrentlyDoing';
import Contact from '../components/sections/Contact';
import Loading from '../components/common/Loading';
import {
    profileAPI,
    resumeAPI,
    projectsAPI,
    skillsAPI,
    experienceAPI,
    certificatesAPI,
    achievementsAPI,
    educationAPI,
    blogsAPI,
    publicationsAPI,
    activitiesAPI
} from '../services/api';

function PublicPortfolio() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        profile: null,
        resume: null,
        projects: [],
        skills: [],
        experience: [],
        achievements: [],
        education: [],
        certificates: [],
        blogs: [],
        publications: [],
        activities: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profile, resume, projects, skills, experience, achievements, education, certificates, blogs, publications, activities] = await Promise.all([
                    profileAPI.get().catch(() => ({ data: { data: null } })),
                    resumeAPI.get().catch(() => ({ data: { data: null } })),
                    projectsAPI.getAll().catch(() => ({ data: { data: [] } })),
                    skillsAPI.getAll().catch(() => ({ data: { data: { skills: [] } } })),
                    experienceAPI.getAll().catch(() => ({ data: { data: [] } })),
                    achievementsAPI.getAll().catch(() => ({ data: { data: [] } })),
                    educationAPI.getAll().catch(() => ({ data: { data: [] } })),
                    certificatesAPI.getAll().catch(() => ({ data: { data: [] } })),
                    blogsAPI.getAll().catch(() => ({ data: { data: [] } })),
                    publicationsAPI.getAll().catch(() => ({ data: { data: [] } })),
                    activitiesAPI.getAll().catch(() => ({ data: { data: [] } }))
                ]);

                setData({
                    profile: profile.data.data,
                    resume: resume.data.data,
                    projects: projects.data.data,
                    skills: skills.data.data?.skills || skills.data.data,
                    experience: experience.data.data,
                    achievements: achievements.data.data,
                    education: education.data.data,
                    certificates: certificates.data.data,
                    blogs: blogs.data.data,
                    publications: publications.data.data,
                    activities: activities.data.data
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Apply dynamic background image to body
    useEffect(() => {
        if (data.profile?.backgroundImage?.url) {
            document.body.style.backgroundImage = `url(${data.profile.backgroundImage.url})`;
        }
        return () => {
            document.body.style.backgroundImage = '';
        };
    }, [data.profile]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app">
            <Header />
            <main>
                <Hero profile={data.profile} resume={data.resume} />
                <About profile={data.profile} />
                <Skills skills={data.skills} />
                <Experience experiences={data.experience} />
                <Education education={data.education} />
                <Projects projects={data.projects} />
                <Achievements achievements={data.achievements} />
                <Certificates certificates={data.certificates} />
                <Blogs blogs={data.blogs} />
                <Publications publications={data.publications} />
                <CurrentlyDoing activities={data.activities} />
                <Contact profile={data.profile} />
            </main>
            <Footer profile={data.profile} />
        </div>
    );
}

export default PublicPortfolio;
